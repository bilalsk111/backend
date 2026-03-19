import {
  MessageSquare,
  Plus,
  LogOut,
  PanelLeftClose,
  Share2,
  Sparkles,
  MoreVertical,
  Pin,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/hook/useAuth";

const Sidebar = ({ isOpen, setIsOpen, chats, onSelectChat, onNewChat }) => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const openChat = (chatId) => {
    if (!chatId) return;
    onSelectChat(chatId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:relative z-50 h-full w-[280px] bg-[#171717] p-4 flex flex-col transition-all duration-300 border-r border-white/5
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
            <Sparkles size={18} className="text-white fill-white/20" />
          </div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Cognivex
          </h2>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNewChat()}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-all py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-white/5"
          >
            <Plus size={18} strokeWidth={3} />
            New Chat
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden ml-2 p-2 hover:bg-[#2f2f2f] rounded-lg text-gray-400"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-2 -mr-2 custom-scrollbar">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] px-3 mb-3">
            Recent Chats
          </p>

          {Object.values(chats).map((chat, i) => (
            <div key={chat.id} className="relative group px-1">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 FIX
                  openChat(chat.id);
                }}
                className={`
      w-full flex items-center justify-between px-3 py-3 text-sm rounded-xl transition-all cursor-pointer
      ${activeMenu === i ? "bg-[#2f2f2f] text-white" : "text-gray-400 hover:text-gray-100 hover:bg-[#2f2f2f]/40"}
    `}
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageSquare
                    size={16}
                    className={
                      activeMenu === i ? "text-indigo-400" : "opacity-40"
                    }
                  />
                  <span className="truncate">{chat.title}</span>
                </div>
                <MoreVertical
                  size={14}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(i);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-white cursor-pointer"
                />
              </button>
              {activeMenu === i && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-1 w-44 bg-[#212121] border border-white/10 rounded-xl shadow-2xl z-[60] py-1.5 animate-in fade-in zoom-in duration-150"
                >
                  <MenuOption icon={<Pin size={14} />} label="Pin Chat" />
                  <MenuOption icon={<Edit3 size={14} />} label="Rename" />
                  <MenuOption
                    icon={<ExternalLink size={14} />}
                    label="Share Chat"
                  />
                  <div className="h-[1px] bg-white/5 my-1" />
                  <MenuOption
                    icon={<Trash2 size={14} />}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors group">
            <LogOut
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
            Logout
          </button>

          <div className="flex items-center justify-between p-2.5 bg-[#212121]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?name=Bilal+Shaikh&background=6366f1&color=fff"
                  alt="Profile"
                  className="w-9 h-9 rounded-full"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#171717] rounded-full"></div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-200">
                  {user?.username}
                </span>
                <span className="text-[10px] text-indigo-400 font-bold tracking-wide uppercase">
                  Pro Account
                </span>
              </div>
            </div>
            <Share2
              size={16}
              className="text-gray-500 hover:text-white transition-colors"
            />
          </div>
        </div>
      </aside>
    </>
  );
};

// Helper Component for Dropdown Options
const MenuOption = ({ icon, label, variant = "default" }) => (
  <button
    className={`
    w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors
    ${variant === "danger" ? "text-red-400 hover:bg-red-500/10" : "text-gray-300 hover:bg-white/5"}
  `}
  >
    {icon}
    {label}
  </button>
);

export default Sidebar;
