import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatbotProps {
  onNavigate: (view: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Assalam-o-Alaikum! Welcome to Saadaat Kitchen ("Good Food ❤️ Happy Mood"). I am your virtual culinary assistant. How can I assist you with our BBQ, Rolls, Burgers, or orders today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    { label: 'View Menu', action: () => onNavigate('menu') },
    { label: 'Track Order', action: () => onNavigate('track-order') },
    { label: 'Deals & Momos', action: () => onNavigate('deals') },
    { label: 'Easypaisa Info', query: 'What are your Easypaisa payment details?' },
    { label: 'Urdu Menu / اردو', query: 'Mujhe Chicken Malai Tikka aur Roll ki price batayein' }
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const replyContent = data.reply || "I'm having trouble connecting right now. Please reach us on WhatsApp at +92 371 0238821.";

      setMessages(prev => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          role: 'assistant',
          content: replyContent
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          role: 'assistant',
          content: 'We apologize for the brief pause. Feel free to contact our live team on WhatsApp at +92 371 0238821.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-zinc-950 text-white rounded-full border border-amber-500/50 shadow-2xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          <div className="w-6 h-6 rounded-full gold-gradient-bg flex items-center justify-center text-zinc-950">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
              AI Support
            </span>
            <span className="text-[10px] text-zinc-400 leading-tight">
              Saadaat Kitchen
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-zinc-950 shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Saadaat Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online · Urdu & English
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-zinc-950/70">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-zinc-950 font-medium rounded-br-none shadow'
                      : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-none shadow'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-bl-none p-3 text-zinc-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Checking menu & recipes...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (q.action) q.action();
                  if (q.query) handleSend(q.query);
                }}
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/20 rounded-full transition-colors cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* WhatsApp Escalation Banner */}
          <div className="px-3 py-1.5 bg-zinc-900/90 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Prefer human support?</span>
            <a
              href="https://wa.me/923710238821"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp +92 371 0238821</span>
            </a>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about BBQ, Tikka, deals, Urdu support..."
              className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-xl transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
