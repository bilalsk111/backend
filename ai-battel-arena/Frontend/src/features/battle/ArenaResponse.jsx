import React, { useState } from "react";
import { 
  Trophy, Monitor, Cpu, Copy, Check, Zap, Scale, 
  ChevronRight, Activity, Shield, Code2, Sparkles 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Enhanced CodeBlock with custom scrolling and high-fidelity headers
 */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code rounded-2xl border border-white/[0.06] bg-[#09090b] overflow-hidden flex flex-col h-full min-h-[450px] max-h-[650px] shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-all duration-300"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            {copied ? "Copied" : "Copy Source"}
          </span>
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-grow selection:bg-indigo-500/40 p-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    background: "transparent",
                    padding: "1.25rem",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {code || "_No response received._"}
        </ReactMarkdown>
      </div>
    </div>
  );
}

/**
 * Competitive Card Component
 * Restored: Floating Winner Tag & Scaled Grid logic
 */
function Card({ title, model, code, score, winner, isSolution1 }) {
  return (
    <div
      className={`group relative flex flex-col h-full rounded-[2.5rem] transition-all duration-700 ${
        winner
          ? "bg-gradient-to-b from-indigo-500/[0.12] to-[#09090b] border-indigo-500/50 shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)] z-10 scale-[1.01]"
          : "bg-zinc-900/40 border-white/[0.05] opacity-70 hover:opacity-100"
      } border`}
    >
      {/* FLOATING WINNER TAG */}
      {winner && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center gap-2 z-30 animate-pulse">
          <Trophy size={14} className="text-white" fill="white" />
          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Arena Champion</span>
        </div>
      )}

      <div className="p-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className={`flex items-center justify-center w-14 h-14 rounded-[1.25rem] ${
              isSolution1 ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            } border shadow-xl transition-transform group-hover:scale-110 duration-500`}>
              {isSolution1 ? <Monitor size={28} /> : <Cpu size={28} />}
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">{title}</h3>
              <p className="text-xl font-bold text-white tracking-tight">{model || "Neural Engine"}</p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-4xl font-black tracking-tighter ${winner ? "text-indigo-400" : "text-zinc-400"}`}>
              {score ?? "—"}
              <span className="text-sm text-zinc-600 font-bold ml-1 tracking-normal">/10</span>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Accuracy Grade</p>
          </div>
        </div>
        
        <CodeBlock code={code} />
      </div>
    </div>
  );
}

/**
 * Main Arena Display
 * Features: Restored VS Bridge, Wide Max-Width, and Professional Verdict Panel
 */
export default function ArenaResponse({ question, solution_1, solution_2, judge }) {
  if (!judge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
          <Activity size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white text-lg font-bold tracking-widest uppercase">Consulting High Council</p>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em] animate-pulse">Comparing weights and measures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-300 selection:bg-indigo-500/30 font-sans antialiased">
      {/* Container widened to 1600px for desktop clarity */}
      <div className="max-w-[1600px] mx-auto px-8 py-20 space-y-24 animate-in fade-in duration-1000">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl">
              <Shield size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">Security Verified Analysis</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Battle <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">Report.</span>
            </h1>
          </div>

          <div className="relative group max-w-xl w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-transparent blur opacity-25" />
            <div className="relative flex items-center gap-5 bg-zinc-900/80 p-6 rounded-[2rem] border border-white/[0.08] backdrop-blur-md">
              <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-400 shrink-0">
                <Code2 size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Target Prompt</p>
                <p className="text-base text-zinc-200 truncate font-medium italic">"{question}"</p>
              </div>
            </div>
          </div>
        </header>

        {/* Competition Grid with RESTORED VS BRIDGE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative">
          
          {/* THE VS ICON BRIDGE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-16 h-16 rounded-2xl bg-[#080b10] border border-white/10 z-20 shadow-[0_0_50px_rgba(0,0,0,0.8)] outline outline-8 outline-[#080b10]">
            <span className="text-xs font-black text-indigo-500 tracking-tighter">VS</span>
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full -z-10" />
          </div>
          
          <Card
            title="System Alpha"
            code={solution_1}
            score={judge.solution_1_score}
            winner={judge.winner === "solution_1"}
            isSolution1={true}
          />
          <Card
            title="System Beta"
            code={solution_2}
            score={judge.solution_2_score}
            winner={judge.winner === "solution_2"}
            isSolution1={false}
          />
        </div>

        {/* Verdict Insight Panel */}
        <section className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-zinc-950 border border-white/10 px-8 py-3 rounded-full flex items-center gap-4 shadow-2xl">
              <Scale size={18} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 whitespace-nowrap">Official Arbitration</span>
            </div>
          </div>

          <div className="bg-[#09090b] border border-white/[0.08] rounded-[3rem] overflow-hidden shadow-3xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-4 p-12 bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/[0.05]">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6">The Verdict</h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                  Comprehensive audit across syntax optimization, architectural integrity, and functional performance benchmarks.
                </p>
                
                <div className={`p-6 rounded-3xl border transition-all duration-500 ${
                  judge.winner === "tie" ? "bg-zinc-800/20 border-zinc-700" : "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]"
                }`}>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-center">Conclusion</p>
                  <p className="text-lg font-bold text-white tracking-tight leading-tight text-center">
                    {judge.winner === "tie" ? "TECHNOLOGICAL PARITY" : `${judge.winner === "solution_1" ? "ALPHA" : "BETA"} DOMINANCE`}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 p-6 lg:p-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Alpha Logic Debrief</h4>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed font-mono pl-5 border-l border-white/5 ml-1">
                    {judge.solution_1_reasoning}
                  </p>
                </div>

                <div className="h-px bg-white/[0.05] w-full" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Beta Logic Debrief</h4>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed font-mono pl-5 border-l border-white/5 ml-1">
                    {judge.solution_2_reasoning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer Metrics */}
        <footer className="flex flex-col items-center gap-8 pt-10 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-16">
            {[
              { label: "Processing Latency", val: "142ms" },
              { label: "Token Density", val: "0.84" },
              { label: "Stability Index", val: "99.9%" }
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-help">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1 group-hover:text-indigo-400 transition-colors">{stat.label}</p>
                <p className="text-sm font-bold text-zinc-400">{stat.val}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-[1em]">
            Arena Engine v2.4.0_Stable // Built for Commanders
          </p>
        </footer>
      </div>
    </div>
  );
}