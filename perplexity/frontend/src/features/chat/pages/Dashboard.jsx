import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChat } from "../hooks/useChat";
import { initSocketConnection, joinChat, leaveChat } from "../services/chat.socket";
import { appendMessageChunk, setSidebarOpen } from "../chat.slice";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const prevChatId = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const sidebarOpen = useSelector((state) => state.chat.sidebarOpen);

  // Init socket once
  useEffect(() => {
    initSocketConnection();
    chat.handleGetChats();
  }, []);

  // Join/leave socket rooms on chat change
  useEffect(() => {
    const socket = initSocketConnection();
    if (!socket || !currentChatId) return;

    // Leave previous room
    if (prevChatId.current && prevChatId.current !== currentChatId) {
      leaveChat(prevChatId.current);
      socket.off(`stream-${prevChatId.current}`);
    }

    prevChatId.current = currentChatId;
    joinChat(currentChatId);

    const handleChunk = (chunk) => {
      dispatch(appendMessageChunk({ chatId: currentChatId, chunk }));
    };

    socket.on(`stream-${currentChatId}`, handleChunk);

    return () => {
      socket.off(`stream-${currentChatId}`, handleChunk);
    };
  }, [currentChatId, dispatch]);

  const handleSubmit = useCallback(
    ({ message, file }) => {
      chat.handleSendMessage({ message, chatId: currentChatId, file });
    },
    [currentChatId, chat]
  );

  return (
    <main className="h-screen w-full bg-[#0a0a0a] text-white flex overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={(v) => dispatch(setSidebarOpen(v))}
        chats={chats}
        onSelectChat={chat.handleOpenChat}
        currentChatId={currentChatId}
        onNewChat={chat.handleNewChat}
        onDeleteChat={chat.handleDeleteChat}
      />
      <ChatArea
        messages={chats[currentChatId]?.messages || []}
        chatTitle={chats[currentChatId]?.title}
        onSubmit={handleSubmit}
        onOpenSidebar={() => dispatch(setSidebarOpen(true))}
        onNewChat={chat.handleNewChat}
        currentChatId={currentChatId}
      />
    </main>
  );
};

export default Dashboard;
