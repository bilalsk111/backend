import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  ArrowUp, Paperclip, Menu, Plus, Globe, FileText,
  Image as ImageIcon, X, StopCircle, Sparkles, Zap,
} from "lucide-react";
import Message from "./Message";
import { motion, AnimatePresence } from "framer-motion";

const ACCEPTED_FILES = "image/*,application/pdf,.doc,.docx,.txt,.md";
const MAX_FILE_MB = 20;

const WelcomeScreen = ({ onSuggestion }) => {
  const suggestions = [
    { icon: Globe, label: "Search the web", prompt: "What are the latest AI news today?" },
    { icon: FileText, label: "Analyze a document", prompt: "I'll upload a PDF, please summarize it" },
    { icon: ImageIcon, label: "Analyze an image", prompt: "I'll upload an image, describe what you see" },
    { icon: Zap, label: "Write code", prompt: "Write a Python script to scrape a website" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-20"
    >
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/30">
          <Sparkles size={26} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          How can I help you?
        </h1>
        <p className="text-gray-500 text-sm max-w-sm">
          Ask anything, search the web, analyze files, write code — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-xl">
        {suggestions.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            onClick={() => onSuggestion(prompt)}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.14] transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
              <Icon size={15} className="text-gray-400 group-hover:text-violet-400 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const FilePreview = ({ file, previewUrl, onRemove }) => {
  const isPDF = file?.type === "application/pdf";
  const isDoc = file?.name?.match(/\.(doc|docx|txt|md)$/i);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] max-w-[200px]"
    >
      {isPDF || isDoc ? (
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <FileText size={15} className="text-red-400" />
        </div>
      ) : (
        <img
          src={previewUrl}
          alt="preview"
          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-300 truncate font-medium">{file?.name}</p>
        <p className="text-[10px] text-gray-600">
          {(file?.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-700 border border-white/20 flex items-center justify-center hover:bg-zinc-600 transition-colors"
      >
        <X size={8} className="text-white" />
      </button>
    </motion.div>
  );
};

const ChatArea = ({ messages, chatTitle, onSubmit, onOpenSidebar, onNewChat }) => {
  const isLoading = useSelector((state) => state.chat.isLoading);
  const isStreaming = useSelector((state) => state.chat.isStreaming);

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [rows, setRows] = useState(1);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      const maxH = 160;
      textareaRef.current.style.height = Math.min(scrollH, maxH) + "px";
    }
  }, [input]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError(null);

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File too large. Max ${MAX_FILE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (isLoading) return;
      if (!input.trim() && !selectedFile) return;

      onSubmit({ message: input.trim(), file: selectedFile });
      setInput("");
      removeFile();
    },
    [input, selectedFile, isLoading, onSubmit, removeFile]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleSuggestion = useCallback((prompt) => {
    setInput(prompt);
    textareaRef.current?.focus();
  }, []);

  const canSubmit = (input.trim() || selectedFile) && !isLoading;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0a0a0a] relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-medium text-gray-300 truncate max-w-[200px]">
            {chatTitle || "Cognivex"}
          </span>
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-400 hover:text-white text-xs font-medium transition-all"
        >
          <Plus size={13} />
          New chat
        </button>
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto w-full px-4">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSuggestion} />
          ) : (
            <div className="py-6 space-y-2">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  fileUrl={msg.fileUrl}
                  fileType={msg.fileType}
                  fileName={msg.fileName}
                />
              ))}

              {/* Streaming indicator */}
              {isStreaming && messages[messages.length - 1]?.id === "temp-ai-msg" && !messages[messages.length - 1]?.content && (
                <div className="flex items-center gap-3 pl-10 pb-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium tracking-wider uppercase">Thinking</span>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-5 pt-2">
        <div className="max-w-3xl mx-auto">
          {/* File error */}
          <AnimatePresence>
            {fileError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-400 mb-2 text-center"
              >
                {fileError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* File preview */}
          <AnimatePresence>
            {selectedFile && (
              <div className="mb-2.5">
                <FilePreview
                  file={selectedFile}
                  previewUrl={previewUrl}
                  onRemove={removeFile}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Input box */}
          <div className={`relative rounded-2xl border transition-all duration-200 ${
            isLoading
              ? "bg-white/[0.03] border-white/[0.06]"
              : "bg-[#1a1a1a] border-white/[0.1] focus-within:border-violet-500/40 focus-within:bg-[#1c1c1c]"
          }`}>
            <div className="flex items-end gap-2 px-3 py-2.5">
              {/* Attach */}
              <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
                <input
                  type="file"
                  accept={ACCEPTED_FILES}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  title="Attach image, PDF, or document"
                  className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-colors disabled:opacity-30"
                >
                  <Paperclip size={17} />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading
                    ? "Cognivex is responding..."
                    : "Message Cognivex... (Shift+Enter for new line)"
                }
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-white text-[15px] placeholder:text-gray-600 outline-none resize-none leading-relaxed py-1 min-h-[26px] max-h-[160px] custom-scrollbar disabled:opacity-50"
                style={{ scrollbarWidth: "none" }}
              />

              {/* Submit */}
              <div className="flex-shrink-0 pb-0.5">
                {isLoading ? (
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-white/[0.06] text-gray-500 cursor-not-allowed"
                  >
                    <StopCircle size={17} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`p-1.5 rounded-lg transition-all ${
                      canSubmit
                        ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                        : "bg-white/[0.06] text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <ArrowUp size={17} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-700 mt-2.5 font-medium">
            Cognivex can make mistakes · Verify important information
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
