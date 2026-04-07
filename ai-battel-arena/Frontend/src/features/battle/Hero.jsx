import { Swords, Code, Terminal, Cpu, Globe, Sparkles, Command } from "lucide-react";

const SUGGESTIONS = [
  { 
    icon: <Code size={16} />, 
    text: "Write a binary search algorithm",
    tag: "Algorithm"
  },
  { 
    icon: <Terminal size={16} />, 
    text: "Implement a linked list in Python",
    tag: "Data Structures"
  },
  { 
    icon: <Cpu size={16} />, 
    text: "Build a debounce function",
    tag: "Frontend"
  },
  { 
    icon: <Globe size={16} />, 
    text: "Create a REST API in Node.js",
    tag: "Backend"
  },
];

export default function Hero({ onSelectPrompt }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-6 py-20 overflow-hidden">
      
      {/* ── Background Ambient Glows ──────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full -z-10" />

      {/* ── Central Icon ──────────────────────────────────────────────────── */}
      <div className="relative mb-8 animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="relative p-6 rounded-[2rem] bg-zinc-950 border border-indigo-500/30 text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
          <Swords size={56} strokeWidth={1} className="animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-500">
          <Sparkles size={16} />
        </div>
      </div>

      {/* ── Heading ───────────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-16 animate-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-2">
          <Command size={12} className="text-zinc-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Ready for Input</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">Arena</span> Awaits.
        </h1>
        
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Deploy your most complex programming challenges. Watch two <span className="text-white">Neural Engines</span> battle in real-time while our automated judge determines the superior logic.
        </p>
      </div>

      {/* ── Tactical Suggestions ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-8 duration-1000 delay-200">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(s.text)}
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#09090b]/50 border border-white/[0.06] hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all duration-500 text-left overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300">
              {s.icon}
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5 group-hover:text-indigo-500/70 transition-colors">
                {s.tag}
              </p>
              <p className="text-xs text-zinc-300 font-medium group-hover:text-white transition-colors">
                {s.text}
              </p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <Command size={14} className="text-indigo-500/40" />
            </div>
          </button>
        ))}
      </div>

      {/* ── Bottom Status ─────────────────────────────────────────────────── */}
      <div className="mt-16 flex items-center gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-500">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> 
          Node Cluster: Active
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" /> 
          Judgement Engine: Online
        </span>
      </div>
    </div>
  );
}