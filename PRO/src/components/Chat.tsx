import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { Message, Match } from '../types';

interface ChatProps {
  match: Match;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ match, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      matchId: match.id,
      senderId: 'currentUser', // TODO: Replace with actual user ID
      content: newMessage,
      read: false,
      createdAt: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#2D2D2D] rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={match.profile.photos[0]}
            alt={match.profile.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-white">{match.profile.name}</h3>
            <p className="text-sm text-white/60">
              {match.active ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="text-white/60">×</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === 'currentUser'
                  ? 'bg-[#6200EE] text-white'
                  : 'bg-[#1E1E1E] text-white/90'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Paperclip className="text-white/60" size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#1E1E1E] rounded-full px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
          />
          <button
            type="button"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Smile className="text-white/60" size={20} />
          </button>
          <button
            type="submit"
            className="p-2 bg-[#6200EE] rounded-full hover:bg-opacity-80 transition-colors"
          >
            <Send className="text-white" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}; 