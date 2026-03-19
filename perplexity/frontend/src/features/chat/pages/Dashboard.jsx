import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);


  useEffect(() => {
    chat.initSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (e) => {
    if (e) e.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  return (
    <main className="h-screen w-full bg-[#07090f] text-white flex overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        chats={Object.values(chats)}
        onSelectChat={(id) => {
          if (!id) return;
          chat.handleOpenChat(id);
        }}
        currentChatId={currentChatId}
        onNewChat={chat.handleNewChat}
      />

      {/* ChatArea logic passed as props */}
      <ChatArea
        messages={chats[currentChatId]?.messages || []}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSubmit={handleSubmitMessage}
        setIsOpen={setIsSidebarOpen}
      />
    </main>
  );
};

export default Dashboard;
