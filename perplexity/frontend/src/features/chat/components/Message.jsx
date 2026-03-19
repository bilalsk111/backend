import { Sparkles, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

const Message = ({ role, content }) => {
  const isAI = role === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end animate-in slide-in-from-right-2 duration-300'}`}>
      <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${
          isAI ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-[#303030] border border-white/10'
        }`}>
          {isAI ? <Sparkles size={16} className="text-white fill-white/20" /> : <User size={16} className="text-gray-400" />}
        </div>

        <div className={`flex flex-col ${isAI ? 'items-start flex-1' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed overflow-hidden ${
            isAI ? 'text-gray-200 bg-transparent w-full' : 'bg-[#303030] text-white border border-white/5 shadow-md'
          }`}>
            
            {isAI ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative my-4 group">
                        <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleCopy(String(children))}
                            className="p-1.5 bg-[#1e1e1e] border border-white/10 rounded-md text-gray-400 hover:text-white"
                          >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl !bg-[#1e1e1e] !p-4 border border-white/5 text-sm"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Styling for lists and links
                  ul: ({children}) => <ul className="list-disc ml-6 space-y-2 my-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-6 space-y-2 my-2">{children}</ol>,
                  a: ({children, href}) => <a href={href} className="text-indigo-400 underline hover:text-indigo-300" target="_blank" rel="noopener noreferrer">{children}</a>,
                  p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{content}</p>
            )}
          </div>
          
          <span className="text-[10px] text-gray-600 mt-2 px-1 font-bold uppercase tracking-widest">
            {isAI ? 'Cognivex' : 'You'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;