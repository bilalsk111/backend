import { useState, memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Sparkles, User, Copy, Check, Download, FileText,
  ChevronDown, ChevronUp, Volume2,
} from "lucide-react";
import { motion } from "framer-motion";

// Custom code theme
const codeTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "#0d0d0d",
    margin: 0,
    borderRadius: 0,
    padding: "1rem",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontSize: "13px",
  },
};

const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
        copied
          ? "bg-green-500/20 text-green-400"
          : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1] hover:text-white"
      } ${className}`}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const CodeBlock = ({ language, children }) => {
  const code = String(children).replace(/\n$/, "");
  const [collapsed, setCollapsed] = useState(code.split("\n").length > 30);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d0d0d]">
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 font-medium">
            {language || "code"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {code.split("\n").length > 30 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] text-gray-400 hover:text-white text-xs transition-colors"
            >
              {collapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
              {collapsed ? "Expand" : "Collapse"}
            </button>
          )}
          <CopyButton text={code} />
        </div>
      </div>

      {/* Code content */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            style={codeTheme}
            language={language || "text"}
            PreTag="div"
            customStyle={{ margin: 0, background: "transparent" }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}

      {collapsed && (
        <div
          className="px-4 py-3 cursor-pointer text-gray-600 text-xs font-mono hover:bg-white/[0.02] transition-colors"
          onClick={() => setCollapsed(false)}
        >
          {code.split("\n").length} lines hidden — click to expand
        </div>
      )}
    </div>
  );
};

const FileAttachment = ({ fileUrl, fileType, fileName }) => {
  const isImage = fileType?.startsWith("image/");
  const isPDF = fileType === "application/pdf";
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (isImage && !imgError) {
    return (
      <div className="mb-3">
        <div
          className={`overflow-hidden rounded-xl border border-white/[0.1] cursor-pointer transition-all ${
            expanded ? "max-w-full" : "max-w-[280px]"
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <img
            src={fileUrl}
            alt={fileName || "Uploaded image"}
            className="w-full h-auto object-cover"
            onError={() => setImgError(true)}
          />
        </div>
        {expanded && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1.5 text-xs text-violet-400 hover:text-violet-300"
          >
            <Download size={11} />
            Open original
          </a>
        )}
      </div>
    );
  }

  if (isPDF || (!isImage && fileUrl)) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] transition-all mb-3 group"
      >
        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-red-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors truncate max-w-[180px]">
            {fileName || "Document"}
          </p>
          <p className="text-[10px] text-gray-600">Click to open</p>
        </div>
      </a>
    );
  }

  return null;
};

const AIMessage = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.75]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              if (!inline && match) {
                return <CodeBlock language={match[1]}>{children}</CodeBlock>;
              }
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-white/[0.1] text-violet-300 font-mono text-[13px]"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <>{children}</>;
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08]">
                  <table className="w-full text-sm">{children}</table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/[0.04] border-b border-white/[0.06]">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-4 py-2.5 text-gray-300 border-b border-white/[0.04] last:border-0">
                  {children}
                </td>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-violet-500/50 pl-4 text-gray-400 italic my-3">
                  {children}
                </blockquote>
              );
            },
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-5 mb-3">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-semibold text-gray-100 mt-3 mb-1.5">{children}</h3>,
            p: ({ children }) => <p className="mb-3.5 last:mb-0 text-gray-200 leading-[1.8]">{children}</p>,
            ul: ({ children }) => <ul className="list-none space-y-1.5 my-2 ml-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 space-y-1.5 my-2 text-gray-200">{children}</ol>,
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-gray-200">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500/70 flex-shrink-0" />
                <span>{children}</span>
              </li>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 underline underline-offset-2 hover:text-violet-300 decoration-violet-500/30 hover:decoration-violet-400/60 transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-white/[0.08] my-5" />,
            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Copy button */}
      {content && (
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-all"
          >
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy response"}
          </button>
        </div>
      )}
    </div>
  );
};

const Message = memo(({ role, content, fileUrl, fileType, fileName }) => {
  const isAI = role === "ai";

  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex gap-3.5 py-3"
      >
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-500/20">
          <Sparkles size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          {content ? (
            <AIMessage content={content} />
          ) : (
            <div className="flex items-center gap-2 py-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-violet-500/70 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: 12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3.5 py-3 flex-row-reverse"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center mt-0.5">
        <User size={13} className="text-gray-400" />
      </div>
      <div className="flex flex-col items-end max-w-[75%]">
        {fileUrl && (
          <FileAttachment fileUrl={fileUrl} fileType={fileType} fileName={fileName} />
        )}
        {content && (
          <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-[#1e1e1e] border border-white/[0.08] text-gray-100 text-[15px] leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </motion.div>
  );
});

Message.displayName = "Message";
export default Message;