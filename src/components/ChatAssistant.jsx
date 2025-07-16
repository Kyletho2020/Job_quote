import { useState } from 'react';

function ChatAssistant({ onAnswer }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Name.' }
  ]);
  const [input, setInput] = useState('');

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/.netlify/functions/chatgpt-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      const assistantReply = { role: 'assistant', content: data.reply };
      setMessages([...newMessages, assistantReply]);

      if (/^Name:/i.test(data.reply)) {
        const name = data.reply.replace(/^Name:/i, '').replace(/\.$/, '').trim();
        if (onAnswer) onAnswer('name', name);
      }

      if (/^Email:/i.test(data.reply)) {
        const email = data.reply.replace(/^Email:/i, '').replace(/\.$/, '').trim();
        if (onAnswer) onAnswer('email', email);
      }

    } catch (err) {
      console.error('Chat error:', err);
    }
  }

  return (
    <div className="border p-4 mb-6 bg-gray-50">
      <h2 className="text-lg font-bold mb-2">Assistant</h2>
      <div className="h-48 overflow-y-auto mb-3 p-2 border">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'assistant' ? 'text-blue-700' : 'text-gray-800'}>
            <strong>{msg.role === 'assistant' ? 'Assistant:' : 'You:'}</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="flex-1 border px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2 px-4 py-1 bg-blue-600 text-white" type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatAssistant;