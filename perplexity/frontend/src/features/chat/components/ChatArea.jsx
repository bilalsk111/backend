import { ArrowUp, Paperclip, Sparkles, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import Message from "../components/Message";

const ChatArea = ({ messages, chatInput, setChatInput, onSubmit, setIsOpen }) => {

  const isLoading = useSelector((state) => state.chat.isLoading);

  return (
    <main className="chat flex-1 flex flex-col bg-[#212121] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 w-full z-10 p-4 flex justify-between items-center bg-[#212121]/80 backdrop-blur-md">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#333333] hover:bg-[#414040] rounded-xl text-gray-300 font-medium transition-colors">
          Cognivex
        </button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-10">
        <div className="flex flex-col gap-4 pt-20 pb-40 max-w-4xl mx-auto w-full">
          {messages.map((message) => (
            <Message key={message.id} role={message.role} content={message.content} />
          ))}

          {/* AI Researching State */}
          {isLoading && (
            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mt-1 border border-indigo-500/30">
                <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
                <p className="text-xs font-bold text-indigo-400/80 tracking-widest uppercase">
                  Researching...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Area - No Blur Shadow */}
      <div className="absolute bottom-0 left-0 w-full bg-[#212121] pt-2 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <form 
            onSubmit={onSubmit} 
            className="relative flex items-center bg-[#2f2f2f] rounded-2xl border border-white/5 p-2 focus-within:border-white/10 transition-all"
          >
            <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message Cognivex..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white px-2 py-3 text-md placeholder:text-gray-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!chatInput.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center min-w-[42px] min-h-[42px] ${
                isLoading 
                ? "bg-transparent border border-white/10 text-gray-500" 
                : "bg-white text-black hover:bg-gray-200"
              } disabled:opacity-30`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ArrowUp size={20} strokeWidth={3} />
              )}
            </button>
          </form>
          
          <p className="text-[11px] text-center text-gray-600 mt-3 font-medium">
            Cognivex can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ChatArea;