import { Send, Scale, History, Trash2, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Sidebar({
  input,
  setInput,
  onSend,
  loading,
  chatList,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  activeChatId,
  user,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteChat(id);
    } finally {
      setDeletingId(null);
    }
  };

  const safeChats = Array.isArray(chatList) ? chatList : [];

  return (
    <aside className="w-80 h-screen bg-[#09090b] border-r border-white/10 flex flex-col font-sans">
      
      {/* ── Branding Header ────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <Scale size={22} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-tighter">Arena Pro</h1>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Neural Link</p>
              </div>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-300 group"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Chat List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            <History size={12} />
            <span>History</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-700 bg-white/5 px-1.5 py-0.5 rounded">
            {safeChats.length} Sessions
          </span>
        </div>

        {safeChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-10 text-center px-4">
            <div className="p-4 rounded-full bg-white/[0.02] mb-3">
              <Sparkles size={24} className="text-zinc-800" />
            </div>
            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">No Active Archives</p>
          </div>
        ) : (
          safeChats.map((chat) => {
            const lastMessage = chat.messages?.[chat.messages.length - 1]?.problem ?? "New Combat Thread";
            const isActive = activeChatId === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-indigo-500/[0.08] border-indigo-500/40"
                    : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
                }`}
              >
                {/* Active Sidebar Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}

                <div className="flex justify-between items-start mb-1.5 pl-2">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono">
                    {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    {deletingId === chat._id ? (
                      <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>

                <p className={`text-xs pl-2 truncate font-medium transition-colors ${isActive ? "text-indigo-100" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                  {lastMessage}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* ── Input Box Section ─────────────────────────────────────────────── */}
      <div className="p-4 bg-white/[0.01] border-t border-white/[0.06]">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Deploy challenge..."
            rows={3}
            className="w-full bg-zinc-900/50 border border-white/[0.08] rounded-2xl p-4 text-xs resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-700 text-zinc-200 shadow-inner"
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="absolute bottom-3 right-3 p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all duration-300"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>

      {/* ── User Footer ───────────────────────────────────────────────────── */}
      <div className="p-4 flex items-center gap-3 bg-white/[0.02] border-t border-white/[0.06]">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayname}
              className="w-9 h-9 rounded-xl object-cover border border-white/10"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
              {user?.displayname?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#09090b] rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
            {user?.displayname ?? "Operator"}
          </p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Level 1 Elite</p>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}