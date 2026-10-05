import { useState } from 'react';
import { motion } from 'framer-motion';
import { currentUser } from '../data/demoData';
import { Camera, Edit, Shield, MapPin, Briefcase, GraduationCap, Heart, Sparkles, Settings, Zap, Crown, Eye } from 'lucide-react';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-nexora-400 to-pink-400 mx-auto mb-4 border-4 border-nexora-600/30"></div>
            <button className="absolute bottom-4 right-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </button>
            <div className="absolute top-0 right-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-dark-900">
              <Shield className="w-3 h-3" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Usuario, 28</h1>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> Madrid, España
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-nexora-600/20 text-xs text-nexora-300">Plan Free</span>
            <span className="px-3 py-1 rounded-full bg-green-600/20 text-xs text-green-300">✓ Verificado</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="gradient-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">156</div>
            <div className="text-xs text-gray-400">Likes recibidos</div>
          </div>
          <div className="gradient-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">23</div>
            <div className="text-xs text-gray-400">Matches</div>
          </div>
          <div className="gradient-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">89%</div>
            <div className="text-xs text-gray-400">Tasa respuesta</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
          {[
            { id: 'profile', label: 'Perfil' },
            { id: 'photos', label: 'Fotos' },
            { id: 'vibesync', label: 'VibeSync' },
            { id: 'prompts', label: 'Prompts' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${activeTab === tab.id ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="gradient-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Biografía</h3>
                <button onClick={() => setEditing(!editing)} className="text-nexora-400"><Edit className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-gray-300">{currentUser.bio}</p>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h3 className="font-medium text-sm mb-3">Información</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm"><Briefcase className="w-4 h-4 text-gray-500" /><span>{currentUser.profession}</span></div>
                <div className="flex items-center gap-3 text-sm"><GraduationCap className="w-4 h-4 text-gray-500" /><span>{currentUser.education}</span></div>
                <div className="flex items-center gap-3 text-sm"><Heart className="w-4 h-4 text-gray-500" /><span>{currentUser.relationshipType}</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-gray-500" /><span>{currentUser.city}, {currentUser.country}</span></div>
              </div>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h3 className="font-medium text-sm mb-3">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map(i => (
                  <span key={i} className="px-3 py-1 rounded-full bg-nexora-600/20 text-xs text-nexora-300">{i}</span>
                ))}
              </div>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h3 className="font-medium text-sm mb-3">Idiomas</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.languages.map(l => (
                  <span key={l} className="px-3 py-1 rounded-full glass-light text-xs">{l}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-3 gap-3">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="aspect-square rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition cursor-pointer">
                {i === 0 ? <Camera className="w-6 h-6 text-gray-500" /> : <div className={`w-full h-full rounded-xl bg-gradient-to-br ${['from-purple-400/30 to-pink-400/30', 'from-blue-400/30 to-cyan-400/30', 'from-emerald-400/30 to-teal-400/30', 'from-orange-400/30 to-red-400/30', 'from-pink-400/30 to-rose-400/30'][i % 5]}`}></div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vibesync' && (
          <div className="space-y-4">
            <div className="gradient-card rounded-xl p-6 text-center">
              <Sparkles className="w-10 h-10 text-nexora-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold gradient-text mb-2">Tu VibeSync</h3>
              <p className="text-sm text-gray-400 mb-4">Tu puntuación de compatibilidad promedio con tus matches</p>
              <div className="text-4xl font-bold gradient-text mb-2">87%</div>
              <p className="text-xs text-gray-500">Basado en 23 matches</p>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h4 className="text-sm font-medium mb-3">Tus fortalezas</h4>
              <div className="space-y-3">
                {[
                  { label: 'Comunicación', value: 92 },
                  { label: 'Valores', value: 88 },
                  { label: 'Intereses', value: 85 },
                  { label: 'Estilo de vida', value: 82 },
                  { label: 'Objetivos', value: 79 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-nexora-300">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-3">
            {[
              { q: 'Mi forma perfecta de pasar un domingo es...', a: 'Café, libro y una caminata por el parque' },
              { q: 'Lo que más me apasiona es...', a: 'Crear cosas nuevas y aprender constantemente' },
              { q: 'Un dato curioso sobre mí...', a: 'Puedo cocinar 12 tipos de pasta diferentes' },
            ].map((p, i) => (
              <div key={i} className="gradient-card rounded-xl p-4">
                <p className="text-xs text-nexora-400 mb-1">{p.q}</p>
                <p className="text-sm">{p.a}</p>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm font-medium">+ Agregar prompt</button>
          </div>
        )}

        {/* Boost & Premium CTA */}
        <div className="mt-8 space-y-3">
          <button className="w-full py-3 rounded-xl gradient-primary font-medium text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Boost NEXORA — Aumenta tu visibilidad
          </button>
          <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm font-medium flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" /> Descubrir NEXORA Premium
          </button>
        </div>
      </div>
    </div>
  );
}