import { useState } from 'react';
import { motion } from 'framer-motion';
import { profiles, conversations } from '../data/demoData';
import { Heart, MessageCircle, Sparkles, Zap, MapPin, Shield } from 'lucide-react';

export default function MatchesPage() {
  const [tab, setTab] = useState<'new' | 'all'>('new');
  const matchedProfiles = profiles.slice(0, 12);
  const likesReceived = profiles.slice(12, 20);

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Matches</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('new')} className={`px-4 py-2 rounded-full text-sm transition ${tab === 'new' ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>
            Nuevos Matches ({matchedProfiles.length})
          </button>
          <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-full text-sm transition ${tab === 'all' ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>
            Likes recibidos ({likesReceived.length})
          </button>
        </div>

        {tab === 'new' && (
          <>
            {/* New Matches */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" /> Nuevos Matches
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {matchedProfiles.map((profile, i) => (
                  <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="gradient-card rounded-2xl overflow-hidden group cursor-pointer">
                    <div className={`aspect-[3/4] bg-gradient-to-br ${profile.photos[0]} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {profile.online && <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-400 border-2 border-dark-900"></div>}
                      {profile.verified && (
                        <div className="absolute top-2 left-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-nexora-300" />
                          <span className="text-xs text-nexora-300 font-medium">{profile.vibeSync}%</span>
                        </div>
                        <h3 className="font-semibold text-sm">{profile.name}, {profile.age}</h3>
                        <p className="text-xs text-gray-300 flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.city}</p>
                      </div>
                    </div>
                    <div className="p-3 flex gap-2">
                      <button className="flex-1 py-2 rounded-lg gradient-primary text-xs font-medium flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Chat
                      </button>
                      <button className="py-2 px-3 rounded-lg glass-light text-xs">
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conversations with matches */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-nexora-400" /> Conversaciones
              </h2>
              <div className="space-y-2">
                {conversations.slice(0, 5).map(conv => {
                  const profile = profiles.find(p => p.id === conv.userId);
                  if (!profile) return null;
                  return (
                    <div key={conv.id} className="flex items-center gap-3 p-3 rounded-xl glass-light hover:bg-white/10 transition cursor-pointer">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.photos[0]}`}></div>
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
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {tab === 'all' && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" /> Personas que te dieron Like
            </h2>
            <div className="gradient-card rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Desbloquea quién le diste Like</p>
                  <p className="text-xs text-gray-400">Con NEXORA Plus puedes ver todos los likes</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {likesReceived.map((profile, i) => (
                <motion.div key={profile.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="gradient-card rounded-2xl overflow-hidden relative">
                  <div className={`aspect-[3/4] bg-gradient-to-br ${profile.photos[0]} relative blur-sm`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white/50" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-300">NEXORA Plus</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}