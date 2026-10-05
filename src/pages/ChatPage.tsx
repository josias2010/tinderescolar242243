import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversations, profiles, icebreakers } from '../data/demoData';
import { Search, Send, Smile, Image, Mic, MoreVertical, Phone, Video, ArrowLeft, Heart, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conversations[0]?.messages || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const filteredConvs = conversations.filter(c => {
    const profile = profiles.find(p => p.id === c.userId);
    return profile?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedProfile = selectedChat ? profiles.find(p => p.id === selectedChat) : null;
  const currentConv = selectedChat ? conversations.find(c => c.userId === selectedChat) : null;

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: `msg_new_${Date.now()}`,
      senderId: 'current_user',
      text: message,
      timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text' as const,
    };
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  // Chat List View
  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 sm:px-6 py-4">
          <h1 className="text-xl font-bold mb-4">Mensajes</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Buscar conversaciones..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm" />
          </div>
        </div>

        {/* Pinned */}
        {conversations.filter(c => c.pinned).length > 0 && (
          <div className="px-4 sm:px-6 mb-2">
            <p className="text-xs text-gray-500 uppercase font-medium mb-2">Fijados</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(conv => {
            const profile = profiles.find(p => p.id === conv.userId);
            if (!profile) return null;
            return (
              <button key={conv.id} onClick={() => { setSelectedChat(conv.userId); setMessages(conv.messages); }} className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-white/5 transition text-left">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.photos[0]}`}></div>
                  {profile.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-dark-900"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{profile.name}</span>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold">{conv.unread}</div>
                )}
                {conv.pinned && <span className="text-xs text-gray-600">📌</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Chat Conversation View
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <button onClick={() => setSelectedChat(null)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="relative">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedProfile?.photos[0]}`}></div>
          {selectedProfile?.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-dark-900"></div>}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{selectedProfile?.name}</span>
            {selectedProfile?.verified && <span className="text-blue-400 text-xs">✓</span>}
          </div>
          <span className="text-xs text-gray-400">{selectedProfile?.online ? 'En línea' : selectedProfile?.lastActive}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5"><Phone className="w-4 h-4 text-gray-400" /></button>
          <button className="p-2 rounded-lg hover:bg-white/5"><Video className="w-4 h-4 text-gray-400" /></button>
          <button className="p-2 rounded-lg hover:bg-white/5"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
        </div>
      </div>

      {/* VibeSync Banner */}
      {selectedProfile && (
        <div className="px-4 py-2 bg-nexora-900/20 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-3 h-3 text-nexora-400" />
            <span className="text-nexora-300">VibeSync {selectedProfile.vibeSync}% • {selectedProfile.vibeReasons[0]}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.senderId === 'current_user' ? 'gradient-primary text-white rounded-br-md' : 'glass-light rounded-bl-md'}`}>
              <p>{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.senderId === 'current_user' ? 'justify-end' : ''}`}>
                <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                {msg.senderId === 'current_user' && (
                  <span className="text-[10px] opacity-60">{msg.read ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Icebreakers */}
      <AnimatePresence>
        {showIcebreakers && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 overflow-hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {icebreakers.map((ib, i) => (
                <button key={i} onClick={() => { setMessage(ib); setShowIcebreakers(false); }} className="px-3 py-1.5 rounded-full glass-light text-xs whitespace-nowrap hover:bg-white/10 transition">
                  💡 {ib}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowIcebreakers(!showIcebreakers)} className="p-2 rounded-lg hover:bg-white/5">
            <Heart className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5">
            <Image className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 relative">
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Escribe un mensaje..." className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {message ? (
            <button onClick={sendMessage} className="p-2.5 rounded-full gradient-primary">
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2.5 rounded-full glass-light">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}