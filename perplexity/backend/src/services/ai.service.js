import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { tavily } from "@tavily/core";
import { sendEmail } from "./mail.service.js";
import axios from "axios";
import sharp from "sharp";
import * as z from "zod";

const MAX_MESSAGES = 20;
const MAX_TOOL_ITERATIONS = 3;

const SYSTEM_PROMPT = `You are Cognivex — a powerful, intelligent AI assistant. You can:
- Search the internet for real-time information
- Analyze images, PDFs, and documents in detail
- Send emails on behalf of the user
- Answer questions with depth and accuracy
- Write code, essays, stories, and more

When an image is shared, describe it thoroughly and answer any questions about it.
Always be helpful, precise, and friendly. Format responses using Markdown when useful.
When you search the web, cite your sources. Today's date is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

IMPORTANT LANGUAGE RULES:
- If the user asks you to respond in "Hinglish", write using ROMAN SCRIPT ONLY — meaning Hindi words spelled in English letters mixed with English words. Example: "Yeh ek bahut accha resume hai, isme aapki skills clearly dikhayi deti hain." NEVER use Devanagari (Hindi) script for Hinglish.
- If the user writes in Hindi script, you may respond in Hindi script.
- Always match the language and script the user prefers.`;
// ================= MODELS =================
// gemini-1.5-flash-latest has its own quota bucket separate from gemini-2.0-flash
const geminiFlash = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 8192,
});

// Lighter fallback model — separate quota bucket
const geminiLite = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 8192,
});

const mistral = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0.3,
});

// ================= TOOLS =================
let tvly;
try {
  tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
} catch {
  tvly = null;
}

const searchTool = tool(
  async ({ query }) => {
    if (!tvly) return "Search unavailable.";
    try {
      const res = await tvly.search(query, {
        maxResults: 5,
        searchDepth: "advanced",
        includeAnswer: true,
      });
      const answer = res.answer ? `**Summary:** ${res.answer}\n\n` : "";
      const results = res.results
        .map(
          (r, i) =>
            `**[${i + 1}] ${r.title}**\n${r.content.slice(0, 300)}\nSource: ${r.url}`,
        )
        .join("\n\n");
      return answer + results;
    } catch (err) {
      return `Search failed: ${err.message}`;
    }
  },
  {
    name: "search_internet",
    description:
      "Search the internet for real-time, current information. Use this for news, recent events, prices, weather, and anything that may have changed recently.",
    schema: z.object({
      query: z.string().describe("The search query to look up"),
    }),
  },
);

const emailTool = tool(
  async ({ to, subject, body }) => {
    try {
      await sendEmail({
        to,
        subject,
        html: `<p style="font-family:sans-serif;line-height:1.6">${body.replace(/\n/g, "<br>")}</p>`,
      });
      return `✅ Email sent successfully to ${to}`;
    } catch (err) {
      return `❌ Email failed: ${err.message}`;
    }
  },
  {
    name: "send_email",
    description: "Send an email to a specified address",
    schema: z.object({
      to: z.string().email(),
      subject: z.string(),
      body: z.string(),
    }),
  },
);

const toolsMap = { search_internet: searchTool, send_email: emailTool };

const mistralWithTools = mistral.bindTools([searchTool, emailTool]);
const geminiWithTools = geminiFlash.bindTools([searchTool, emailTool]);

// ================= HELPERS =================

// Download image from URL and return base64 JPEG
async function imageUrlToBase64(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const buffer = await sharp(Buffer.from(res.data))
    .resize({ width: 1024, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return buffer.toString("base64");
}

// Is it a 429 quota error?
function isQuotaError(err) {
  return (
    err?.status === 429 ||
    err?.message?.includes("429") ||
    err?.message?.includes("quota")
  );
}

// ================= FORMAT MESSAGES =================
async function formatMessages(messages = []) {
  const formatted = [];

  for (const msg of messages.slice(-MAX_MESSAGES)) {
    if (msg.role === "ai") {
      if (msg.content) formatted.push(new AIMessage(msg.content));
      continue;
    }

    // Image message — inline base64 so Gemini can actually see it
    if (msg.fileUrl && !msg.fileType?.includes("pdf")) {
      const contentParts = [];

      if (msg.content) {
        contentParts.push({ type: "text", text: msg.content });
      }

      try {
        const base64 = await imageUrlToBase64(msg.fileUrl);
        // LangChain Google GenAI expects inlineData format
        contentParts.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64}` },
        });
        console.log("✅ Image loaded and base64-encoded for Gemini");
      } catch (err) {
        console.warn("⚠️ Image load failed:", err.message);
        contentParts.push({
          type: "text",
          text: `[User attached an image (${msg.fileName || "image"}) but it could not be loaded: ${err.message}]`,
        });
      }

      formatted.push(new HumanMessage({ content: contentParts }));
      continue;
    }

    // PDF message
    if (msg.fileUrl && msg.fileType?.includes("pdf")) {
      const text =
        (msg.content ? msg.content + "\n\n" : "") +
        `[PDF attached: "${msg.fileName || "document.pdf"}". URL: ${msg.fileUrl} — Please analyze this document thoroughly.]`;
      formatted.push(new HumanMessage(text));
      continue;
    }

    // Plain text message
    if (msg.content) {
      formatted.push(new HumanMessage(msg.content));
    }
  }

  return formatted;
}

// ================= TOOL LOOP =================
async function runToolLoop(history, useGemini = false) {
  const model = useGemini ? geminiWithTools : mistralWithTools;
  let count = 0;

  while (count < MAX_TOOL_ITERATIONS) {
    let res;
    try {
      res = await model.invoke(history);
    } catch (err) {
      console.warn("Tool loop invoke failed:", err.message);
      break;
    }

    if (!res.tool_calls?.length) return;
    history.push(res);

    const results = await Promise.all(
      res.tool_calls.map(async (call) => {
        const toolFn = toolsMap[call.name];
        if (!toolFn) return null;
        try {
          const result = await toolFn.invoke(call.args);
          return new ToolMessage({
            content: String(result),
            tool_call_id: call.id,
          });
        } catch {
          return new ToolMessage({
            content: "Tool failed",
            tool_call_id: call.id,
          });
        }
      }),
    );

    history.push(...results.filter(Boolean));
    count++;
  }
}

// ================= MAIN =================
export async function geminiairesponse(messages, onChunk) {
  if (!Array.isArray(messages)) return "⚠️ Invalid message format.";

  const safeMessages = messages
    .filter((m) => m?.content || m?.fileUrl)
    .slice(-MAX_MESSAGES);

  const hasImage = safeMessages.some(
    (m) => m?.fileUrl && !m?.fileType?.includes("pdf"),
  );
  const hasPDF = safeMessages.some((m) => m?.fileType?.includes("pdf"));
  const needsGemini = hasImage || hasPDF;

  const formatted = await formatMessages(safeMessages);
  const history = [new SystemMessage(SYSTEM_PROMPT), ...formatted];

  let stream;

  try {
    if (needsGemini) {
      // Gemini handles vision — run tool loop with Gemini then stream
      await runToolLoop(history, true).catch((err) =>
        console.warn("Gemini tool loop skipped:", err.message),
      );

      try {
        stream = await geminiFlash.stream(history);
      } catch (err) {
        if (isQuotaError(err) || err?.status === 404) {
          console.warn(
            "gemini-2.5-flash failed, trying gemini-2.0-flash-lite...",
          );
          try {
            stream = await geminiLite.stream(history);
          } catch (err2) {
            if (isQuotaError(err2) || err2?.status === 404) {
              console.warn(
                "Gemini quota hit, falling back to Mistral (text-only)",
              );
              // Strip image parts from history for Mistral fallback
              const textOnly = history.map((msg) => {
                if (
                  msg._getType?.() === "human" &&
                  Array.isArray(msg.content)
                ) {
                  const textParts = msg.content
                    .filter((p) => p.type === "text")
                    .map((p) => p.text)
                    .join("\n");
                  return new HumanMessage(
                    textParts || "[Image message - quota exceeded]",
                  );
                }
                return msg;
              });
              stream = await mistral.stream(textOnly);
            } else {
              throw err2;
            }
          }
        } else {
          throw err;
        }
      }
    } else {
      // Text-only: Mistral with tools, Gemini as fallback
      await runToolLoop(history, false).catch((err) =>
        console.warn("Mistral tool loop skipped:", err.message),
      );

      try {
        stream = await mistral.stream(history);
      } catch (err) {
        console.warn("Mistral failed, falling back to Gemini:", err.message);
        try {
          stream = await geminiFlash.stream(history);
        } catch (err2) {
          try {
            stream = await geminiLite.stream(history);
          } catch (err3) {
            if (isQuotaError(err3) || isQuotaError(err2)) {
              return "⚠️ All AI models are rate-limited. Please wait a minute and try again.";
            }
            throw err3;
          }
        }
      }
    }
  } catch (err) {
    console.error("AI Error:", err.message);
    if (isQuotaError(err)) {
      return "⚠️ AI quota exceeded. Please wait a moment and try again, or check your Gemini API billing.";
    }
    return "⚠️ AI is temporarily unavailable. Please try again.";
  }

  let full = "";
  try {
    for await (const chunk of stream) {
      const text = chunk?.content || "";
      if (text) {
        full += text;
        if (onChunk) onChunk(text);
      }
    }
  } catch (err) {
    console.error("Stream error:", err.message);
    if (!full) return "⚠️ Stream interrupted. Please try again.";
  }

  return full || "⚠️ No response generated.";
}

// ================= TITLE GENERATION =================
export async function chatTitle(message) {
  if (!message || message.length < 3) return "New Chat";
  const prompt = [
    new SystemMessage(
      "Generate a short chat title (3-5 words max). Return ONLY the title, no quotes, no trailing punctuation.",
    ),
    new HumanMessage(message.slice(0, 200)),
  ];
  try {
    const res = await mistral.invoke(prompt);
    return res.content?.replace(/['"]/g, "").trim() || "New Chat";
  } catch {
    try {
      const res = await geminiFlash.invoke(prompt);
      return res.content?.replace(/['"]/g, "").trim() || "New Chat";
    } catch {
      return "New Chat";
    }
  }
}
