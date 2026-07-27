import React, { useState, useRef, useEffect } from 'react';
import client from '../api/client';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the CGLP assistant. Ask me about our partnership plans or how contributions work." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await client.post('/chat', { message: userMessage.content, history });
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: err.response?.data?.error || "Sorry, I'm having trouble responding right now." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white dark:bg-forest-dark border border-forest/10 dark:border-parchment/10 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-forest text-parchment px-4 py-3 flex justify-between items-center">
            <span className="font-display text-sm">CGLP Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm max-w-[85%] px-3 py-2 rounded-xl ${
                  m.role === 'user'
                    ? 'ml-auto bg-guava text-white rounded-br-sm'
                    : 'bg-forest/5 dark:bg-parchment/10 text-forest-dark dark:text-parchment rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-forest-dark/40 dark:text-parchment/40">CGLP Assistant is typing…</div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="border-t border-forest/10 dark:border-parchment/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-lg border border-forest/20 dark:border-parchment/20 dark:bg-forest-dark px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guava"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-forest text-parchment text-sm font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-guava text-white shadow-lg flex items-center justify-center text-2xl hover:bg-guava-dark transition-colors"
        aria-label="Open chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
