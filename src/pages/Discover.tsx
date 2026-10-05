import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profiles, currentUser } from '../data/demoData';
import { Heart, X, Star, Zap, ChevronDown, Filter, MapPin, Shield, Info, Sparkles } from 'lucide-react';

export default function Discover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [likesUsed, setLikesUsed] = useState(currentUser.likesUsed);
  const [matchProfile, setMatchProfile] = useState<any>(null);

  const currentProfile = profiles[currentIndex % profiles.length];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    setSwipeDirection(direction);
    if (direction === 'up') {
      // Super Like
      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentIndex(currentIndex + 1);
      }, 500);
      return;
    }
    if (direction === 'right') {
      setLikesUsed(prev => prev + 1);
      // 30% chance of match
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setMatchProfile(currentProfile);
          setShowMatch(true);
        }, 300);
      }
    }
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(currentIndex + 1);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Descubrir</h1>
          <p className="text-xs text-gray-400">Likes: {likesUsed}/{currentUser.likesLimit} • Super Likes: {currentUser.superLikesUsed}/{currentUser.superLikesLimit}</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-xl glass-light hover:bg-white/10 transition">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 overflow-hidden">
            <div className="gradient-card rounded-xl p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Edad</span>
                <span className="text-xs text-nexora-400">22 - 35</span>
              </div>
              <input type="range" min={18} max={50} defaultValue={35} className="w-full accent-nexora-500" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Distancia</span>
                <span className="text-xs text-nexora-400">50 km</span>
              </div>
              <input type="range" min={1} max={100} defaultValue={50} className="w-full accent-nexora-500" />
              <div className="flex flex-wrap gap-2">
                {['Seria', 'Casual', 'Amistad'].map(f => (
                  <button key={f} className="px-3 py-1 rounded-full glass-light text-xs hover:bg-white/10">{f}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4 relative">
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              className={`w-full max-w-sm aspect-[3/4] relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing ${
                swipeDirection === 'left' ? 'swipe-card swiping-left' :
                swipeDirection === 'right' ? 'swipe-card swiping-right' : ''
              }`}
              drag={!showProfile}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe('right');
                else if (info.offset.x < -100) handleSwipe('left');
                else if (info.offset.y < -100) handleSwipe('up');
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentProfile.photos[0]}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Compatibility Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full glass text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3 text-nexora-300" />
                  <span className="gradient-text font-bold">{currentProfile.vibeSync}%</span>
                  <span className="text-gray-300">VibeSync</span>
                </div>
              </div>

              {/* Verified Badge */}
              {currentProfile.verified && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              )}

              {/* Online indicator */}
              {currentProfile.online && (
                <div className="absolute top-14 right-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-dark-900"></div>
                </div>
              )}

              {/* Card Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                      <span className="text-xl">{currentProfile.age}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{currentProfile.city} • {currentProfile.distance} km</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">{currentProfile.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {currentProfile.interests.slice(0, 3).map(i => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{i}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowProfile(true)} className="p-2 rounded-full glass-light">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Swipe indicators */}
              {swipeDirection === 'right' && (
                <div className="absolute top-1/2 left-8 -translate-y-1/2 px-4 py-2 border-4 border-green-400 rounded-lg rotate-[-15deg]">
                  <span className="text-green-400 font-bold text-2xl">LIKE</span>
                </div>
              )}
              {swipeDirection === 'left' && (
                <div className="absolute top-1/2 right-8 -translate-y-1/2 px-4 py-2 border-4 border-red-400 rounded-lg rotate-[15deg]">
                  <span className="text-red-400 font-bold text-2xl">NOPE</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next card preview */}
        {profiles[(currentIndex + 1) % profiles.length] && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden opacity-30 scale-95 bg-gradient-to-br ${profiles[(currentIndex + 1) % profiles.length].photos[0]}`}></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-6 flex items-center justify-center gap-4">
        <button onClick={() => handleSwipe('left')} className="w-14 h-14 rounded-full glass-light flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition group">
          <X className="w-6 h-6 text-gray-400 group-hover:text-red-400" />
        </button>
        <button onClick={() => handleSwipe('up')} className="w-12 h-12 rounded-full glass-light flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/50 transition group">
          <Star className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
        </button>
        <button onClick={() => handleSwipe('right')} className="w-14 h-14 rounded-full glass-light flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 transition group">
          <Heart className="w-6 h-6 text-gray-400 group-hover:text-green-400" />
        </button>
        <button className="w-12 h-12 rounded-full glass-light flex items-center justify-center hover:bg-nexora-500/20 hover:border-nexora-500/50 transition group">
          <Zap className="w-5 h-5 text-gray-400 group-hover:text-nexora-400" />
        </button>
      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-dark-900/95 overflow-y-auto" onClick={() => setShowProfile(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="min-h-full p-4 sm:p-6 max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
              <div className={`w-full aspect-[3/4] rounded-2xl bg-gradient-to-br ${currentProfile.photos[0]} relative mb-6`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center">✕</button>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                  <p className="text-sm text-gray-300 flex items-center gap-1"><MapPin className="w-3 h-3" />{currentProfile.city}</p>
                </div>
              </div>

              {/* VibeSync Score */}
              <div className="gradient-card rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-nexora-400" />
                  <span className="font-semibold">VibeSync {currentProfile.vibeSync}%</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{currentProfile.vibeReasons[0]}</p>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-400 uppercase">¿Por qué hacemos match?</h4>
                  {currentProfile.vibeReasons.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</div>
                      <span className="text-gray-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility Breakdown */}
              <div className="gradient-card rounded-xl p-4 mb-4">
                <h4 className="font-semibold mb-3">Compatibilidad NEXORA: {currentProfile.compatibility}%</h4>
                <div className="space-y-2">
                  {['Valores', 'Estilo de vida', 'Intereses', 'Comunicación', 'Objetivos', 'Ritmo social', 'Intención'].map(cat => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24">{cat}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full gradient-primary rounded-full" style={{ width: `${60 + Math.random() * 35}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Details */}
              <div className="gradient-card rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-300 mb-4">{currentProfile.bio}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Profesión</span><p>{currentProfile.profession}</p></div>
                  <div><span className="text-gray-500">Educación</span><p>{currentProfile.education}</p></div>
                  <div><span className="text-gray-500">Relación</span><p>{currentProfile.relationshipType}</p></div>
                  <div><span className="text-gray-500">Personalidad</span><p>{currentProfile.personality}</p></div>
                </div>
              </div>

              <div className="gradient-card rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium mb-2">Intereses</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map(i => (
                    <span key={i} className="px-3 py-1 rounded-full bg-nexora-600/20 text-xs text-nexora-300">{i}</span>
                  ))}
                </div>
              </div>

              <div className="gradient-card rounded-xl p-4 mb-20">
                <h4 className="text-sm font-medium mb-2">Idiomas</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.languages.map(l => (
                    <span key={l} className="px-3 py-1 rounded-full glass-light text-xs">{l}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-dark-900/95 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-center">
              <div className="text-6xl mb-4">💫</div>
              <h2 className="text-3xl font-bold gradient-text mb-2 match-pulse">¡Es Match!</h2>
              <p className="text-gray-400 mb-8">Tú y {matchProfile.name} se interesaron mutuamente</p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nexora-400 to-pink-400 border-4 border-nexora-500"></div>
                <div className="text-2xl">❤️</div>
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${matchProfile.photos[0]} border-4 border-nexora-500`}></div>
              </div>
              <div className="gradient-card rounded-xl p-4 mb-6 max-w-sm mx-auto">
                <p className="text-sm text-gray-300">💡 Ambos aman viajar. Pregunta cuál ha sido su destino favorito.</p>
              </div>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button onClick={() => { setShowMatch(false); setCurrentIndex(currentIndex + 1); }} className="py-3 rounded-full gradient-primary font-semibold">Enviar mensaje</button>
                <button onClick={() => { setShowMatch(false); setCurrentIndex(currentIndex + 1); }} className="py-3 rounded-full glass-light font-medium">Seguir descubriendo</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}