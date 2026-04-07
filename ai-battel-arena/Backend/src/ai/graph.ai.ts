import { StateGraph, StateSchema, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import {
    // cohereModel,
    // openAIModel,
    groqModel,
    geminiModel,
    mistralAIModel,
} from "./model.ai.js";
import { createAgent, HumanMessage, toolStrategy } from "langchain";
import { tavily } from "@tavily/core";


const State = new StateSchema({
    problem: z.string().default(""),
    history: z.array(z.string()).default([]),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
        winner: z.enum(["solution_1", "solution_2", "tie"]).default("tie"),
    }),
});


const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY!
});

export async function searchInternet(query: string) {
    try {
        const response = await tavilyClient.search(query);
        return response.results
            .map((r: any) => r.content)
            .join("\n");
    } catch (err) {
        console.error("Tavily error:", err);
        return "";
    }
}

const solutionNode: GraphNode<typeof State> = async (state) => {
    const searchResults = await searchInternet(state.problem);
    const context = state.history.join("\n");

    const query = state.problem.toLowerCase();

    const isCodeQuery =
        query.includes("code") ||
        query.includes("function") ||
        query.includes("algorithm") ||
        query.includes("implement");

    let prompt = "";

    if (isCodeQuery) {
        prompt = `
Problem:
${state.problem}

Conversation History:
${context}

Web Data:
${searchResults}

Instructions:
- Write a clean JavaScript solution
- Include code block
- Keep explanation short
`;
    } else {
        prompt = `
User Question:
${state.problem}

Latest Data:
${searchResults}

Instructions:
- Give direct answer
- NO code
- Keep it short and factual
- You are a senior engineer. Be detailed.
`;
    }

    const [ai1Response, ai2Response] = await Promise.all([
        geminiModel.invoke(`You are a senior engineer. Be detailed.\n\n${prompt}`),
        mistralAIModel.invoke(`You are a competitive programmer. Be short and optimized.\n\n${prompt}`)
    ]);

    return {
        solution_1: ai1Response.content || ai1Response.text || "",
        solution_2: ai2Response.content || ai2Response.text || "",
    };
};

const judgeNode: GraphNode<typeof State> = async (state) => {
    const { problem, solution_1, solution_2 } = state;

    const judge = createAgent({
        model: groqModel,
        responseFormat: toolStrategy(
            z.object({
                solution_1_score: z.number().default(0),
                solution_2_score: z.number().default(0),
                solution_1_reasoning: z.string().default(""),
                solution_2_reasoning: z.string().default(""),
                winner: z.enum(["solution_1", "solution_2", "tie"]).default("tie"),
            })
        ),
        systemPrompt: `
You are a strict AI judge comparing two solutions.

Scoring rules:
- Scores must reflect differences in quality.
- DO NOT give the same score unless both solutions are nearly identical.
- Penalize for: lack of detail, poor explanation, missing reasoning.
- Reward for: clarity, completeness, depth, helpfulness.
- Even if both are correct, the better one MUST get a higher score.

Return JSON only.
`,
    });

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(`
Compare the following two solutions carefully.

Problem:
${problem}

Solution 1:
${solution_1}

Solution 2:
${solution_2}

winner: solution_1, solution_2, or tie?

Instructions:
- Compare both solutions side-by-side
- Identify which is better and WHY
- Give DIFFERENT scores unless they are almost identical
- Be strict in evaluation

Return structured response.
`),
        ],
    });

    const {
        solution_1_score,
        solution_2_score,
        solution_1_reasoning,
        solution_2_reasoning,
        winner,
    } = judgeResponse.structuredResponse || {
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: "Failed",
        solution_2_reasoning: "Failed",
        winner: "tie",
    };

    return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning,
            winner,
        },
    };
};

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile();


export default async function runGraph(problem: string, history: string[] = []) {
    const result = await graph.invoke({
        problem,
        history, // ✅ pass directly, no .map(h => h.problem)
    });

    return result;
}