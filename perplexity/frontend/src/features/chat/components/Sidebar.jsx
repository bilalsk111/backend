import { Plus, MessageSquare, Trash2, ChevronLeft, Bot, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, setIsOpen, chats, onSelectChat, currentChatId, onNewChat, onDeleteChat }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const chatList = useMemo(() => {
    const arr = Object.values(chats).sort(
      (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
    );
    if (!searchQuery.trim()) return arr;
    return arr.filter((c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  // Group by Today, Yesterday, Older
  const grouped = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now - 86400000).toDateString();
    const groups = { Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };

    chatList.forEach((chat) => {
      const d = new Date(chat.lastUpdated || 0);
      const ds = d.toDateString();
      const diff = (now - d) / 86400000;
      if (ds === today) groups.Today.push(chat);
      else if (ds === yesterday) groups.Yesterday.push(chat);
      else if (diff <= 7) groups["Previous 7 Days"].push(chat);
      else groups.Older.push(chat);
    });

    return groups;
  }, [chatList]);

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (deleteConfirm === chatId) {
      await onDeleteChat(chatId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(chatId);
      setTimeout(() => setDeleteConfirm(null), 2500);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed md:relative md:translate-x-0 z-50 md:z-auto h-full w-[280px] flex-shrink-0 flex flex-col bg-[#111111] border-r border-white/[0.06]"
        style={{ transform: undefined }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Bot size={15} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">Cognivex</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white transition-all group"
          >
            <Plus size={16} className="text-violet-400 group-hover:rotate-90 transition-transform duration-200" />
            New conversation
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <Search size={13} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-gray-300 placeholder:text-gray-600 outline-none"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-1 space-y-0.5 px-2 custom-scrollbar">
          {chatList.length === 0 && (
            <div className="text-center py-10 text-gray-600 text-xs">
              {searchQuery ? "No results found" : "No chats yet"}
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => {
            if (!items.length) return null;
            return (
              <div key={group} className="mb-3">
                <p className="px-2 py-1.5 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                  {group}
                </p>
                {items.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => { onSelectChat(chat.id); setIsOpen(false); }}
                    className={`w-full group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all text-sm ${
                      currentChatId === chat.id
                        ? "bg-white/[0.1] text-white"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-gray-200"
                    }`}
                  >
                    <MessageSquare size={13} className="flex-shrink-0 opacity-60" />
                    <span className="flex-1 truncate text-[13px]">
                      {chat.title || "New Chat"}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, chat.id)}
                      className={`flex-shrink-0 p-1 rounded-md transition-all ${
                        deleteConfirm === chat.id
                          ? "opacity-100 text-red-400 bg-red-500/10"
                          : "opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <p className="text-[10px] text-gray-600 text-center">Powered by Gemini & Mistral</p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
