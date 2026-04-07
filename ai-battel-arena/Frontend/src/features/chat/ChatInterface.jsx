import { useRef, useEffect } from "react";
import ArenaResponse from "../battle/ArenaResponse";
import ArenaSkeleton from "../battle/ArenaSkeleton";
import Sidebar from "./Sidebar";
import Hero from "../battle/Hero";
import { useBattle } from "../../hooks/useBattle";
import { useAuth } from "../../hooks/useAuth";

export default function ChatInterface() {
  const { user } = useAuth(); // ✅ decoded from JWT — no extra API call

  const {
    input,
    setInput,
    loading,
    restoring,
    activeBattle,
    battleHistory,
    pendingQuestion,
    sendChallenge,
    chatList,
    chatId,
    loadChat,
    handleDeleteChat,
    newChat,
  } = useBattle();

  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battleHistory.length, loading]);

  const hasContent = battleHistory.length > 0 || loading;

  return (
    <div className="flex h-screen overflow-hidden bg-[#08080f] text-white">
      <Sidebar
        input={input}
        setInput={setInput}
        onSend={sendChallenge}
        loading={loading}
        chatList={chatList}
        onSelectChat={loadChat}
        onDeleteChat={handleDeleteChat}
        activeChatId={chatId}
        onNewChat={newChat}
        user={user} // ✅ passed down for avatar + name display
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 h-11 border-b border-white/[0.04] flex items-center px-6 gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
            {chatId ? "Session active" : "New session"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {restoring ? (
              <div className="space-y-6">
                <RestoreSkeleton />
                <RestoreSkeleton dim />
              </div>
            ) : !hasContent ? (
              <Hero onSelectPrompt={sendChallenge} />
            ) : (
              <div className="space-y-1 divide-y divide-white/[0.03]">
                {battleHistory.map((battle) => (
                  <ArenaResponse
                    key={battle.id}
                    question={battle.question}
                    solution_1={battle.solution_1}
                    solution_2={battle.solution_2}
                    judge={battle.judge}
                  />
                ))}
                {loading && <ArenaSkeleton question={pendingQuestion} />}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </main>
    </div>
  );
}

function RestoreSkeleton({ dim = false }) {
  return (
    <div className={`space-y-3 py-2 ${dim ? "opacity-30" : "opacity-60"}`}>
      <div className="flex justify-end px-2">
        <div className="h-9 w-48 rounded-2xl rounded-tr-md bg-indigo-500/10 animate-pulse" />
      </div>
      <div className="flex items-start gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map(i => (
              <div key={i} className="rounded-2xl border border-white/[0.05] bg-[#0e0e14] p-4 space-y-2">
                {["w-3/4", "w-full", "w-5/6", "w-2/3", "w-full"].map((w, j) => (
                  <div key={j} className={`h-2.5 ${w} rounded bg-white/[0.05] animate-pulse`}
                    style={{ animationDelay: `${j * 80}ms` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}