import React, { useState } from 'react';
import { Bot, Send, Loader, X } from 'lucide-react';

interface SimpleAIChatboxProps {
  onExtract: (extractedInfo: any) => void;
  isOpen: boolean;
  onClose: () => void;
  keyId: string | null;
}

const SimpleAIChatbox: React.FC<SimpleAIChatboxProps> = ({ onExtract, isOpen, onClose, keyId }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai' | 'system', content: string }>>([
    {
      type: 'system',
      content: keyId 
        ? 'Hi! I can help extract project information from emails, work orders, or any text. Just paste your content and I\'ll automatically fill out the form fields.'
        : 'Hi! Please set up your OpenAI API key in the settings first to use AI extraction.'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !keyId) return;

    setLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-extract-simple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, keyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract information');
      }

      const { extractedInfo } = data;
      
      if (extractedInfo && Object.keys(extractedInfo).length > 0) {
        onExtract(extractedInfo);
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: `Great! I extracted information for: ${Object.keys(extractedInfo).join(', ')}. The form has been updated with the extracted data.` 
        }]);
        setInput('');
      } else {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'I couldn\'t find any project information in that text. Try including details like project name, company, address, contact info, or work description.' 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">AI Project Extractor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Analyzing text...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={keyId 
                ? "Paste your email, work order, or project description here..."
                : "Please set up your API key first to use this feature..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={loading || !keyId}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !input.trim() || !keyId}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Extract Info
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleAIChatbox;