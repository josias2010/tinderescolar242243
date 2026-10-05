import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import Discover from './Discover';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import PremiumPage from './PremiumPage';
import MatchesPage from './MatchesPage';
import { Sparkles, Compass, Heart, MessageCircle, User, Crown, Settings, Shield, Bell, LogOut, Menu, X, Star, Zap, Bookmark } from 'lucide-react';
import { profiles } from '../data/demoData';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { path: '/app/discover', icon: <Compass className="w-5 h-5" />, label: 'Descubrir' },
    { path: '/app/matches', icon: <Heart className="w-5 h-5" />, label: 'Matches' },
    { path: '/app/chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Mensajes' },
    { path: '/app/favorites', icon: <Bookmark className="w-5 h-5" />, label: 'Favoritos' },
    { path: '/app/profile', icon: <User className="w-5 h-5" />, label: 'Mi perfil' },
    { path: '/app/premium', icon: <Crown className="w-5 h-5" />, label: 'Premium' },
  ];

  const notifications = [
    { id: 1, text: '¡Valentina te dio Super Like!', time: 'Hace 5 min', type: 'superlike' },
    { id: 2, text: 'Nuevo match con Sofía', time: 'Hace 1 hora', type: 'match' },
    { id: 3, text: 'Tienes 3 likes nuevos', time: 'Hace 2 horas', type: 'like' },
    { id: 4, text: 'Tu perfil fue visto 12 veces hoy', time: 'Hace 3 horas', type: 'view' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-dark-800/50 fixed h-full z-40">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold">NEXORA</span>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${location.pathname === item.path ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={() => navigate('/app/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" /> Configuración
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition">
            <LogOut className="w-5 h-5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${location.pathname === item.path ? 'text-nexora-400' : 'text-gray-500'}`}>
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold">NEXORA</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">4</span>
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-dark-800 z-50 p-4 pt-16">
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${location.pathname === item.path ? 'gradient-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition mt-4">
                  <LogOut className="w-5 h-5" /> Cerrar sesión
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-14 right-4 w-80 glass rounded-2xl p-4 z-50 border border-white/10">
              <h3 className="font-semibold mb-3">Notificaciones</h3>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
                    <p className="text-sm">{n.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <Routes>
          <Route path="discover" element={<Discover />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="premium" element={<PremiumPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Discover />} />
        </Routes>
      </main>
    </div>
  );
}

function FavoritesPage() {
  const favorites = profiles.slice(0, 6);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((p: any) => (
          <div key={p.id} className="gradient-card rounded-2xl overflow-hidden">
            <div className={`aspect-[3/4] bg-gradient-to-br ${p.photos[0]} flex items-center justify-center`}>
              <Heart className="w-8 h-8 text-white/50" />
            </div>
            <div className="p-3">
              <div className="font-medium text-sm">{p.name}, {p.age}</div>
              <div className="text-xs text-gray-400">{p.city}</div>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-nexora-600/30 text-xs text-nexora-300 inline-block">{p.vibeSync}% VibeSync</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const tabs = [
    { id: 'account', label: 'Cuenta' },
    { id: 'privacy', label: 'Privacidad' },
    { id: 'preferences', label: 'Preferencias' },
    { id: 'notifications', label: 'Notificaciones' },
    { id: 'security', label: 'Seguridad' },
    { id: 'blocked', label: 'Bloqueados' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${activeTab === tab.id ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="gradient-card rounded-2xl p-6 space-y-4">
        {activeTab === 'account' && (
          <>
            <div><label className="text-sm text-gray-400 mb-1 block">Nombre</label><input type="text" defaultValue="Usuario" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Email</label><input type="email" defaultValue="usuario@email.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Teléfono</label><input type="tel" defaultValue="+34 600 000 000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" /></div>
            <button className="px-6 py-3 rounded-xl gradient-primary text-sm font-medium">Guardar cambios</button>
          </>
        )}
        {activeTab === 'privacy' && (
          <>
            <div className="flex items-center justify-between py-2"><span className="text-sm">Mostrar perfil</span><div className="w-12 h-6 rounded-full gradient-primary relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div></div></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm">Mostrar distancia</span><div className="w-12 h-6 rounded-full gradient-primary relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div></div></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm">Mostrar edad</span><div className="w-12 h-6 rounded-full gradient-primary relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div></div></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm">Modo invisible</span><div className="w-12 h-6 rounded-full bg-white/20 relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div></div></div>
          </>
        )}
        {activeTab === 'preferences' && (
          <>
            <div><label className="text-sm text-gray-400 mb-1 block">Rango de edad</label><div className="flex gap-3"><input type="number" defaultValue={22} className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-center" /><span className="self-center text-gray-500">-</span><input type="number" defaultValue={35} className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-center" /></div></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Distancia máxima</label><input type="range" min={1} max={100} defaultValue={50} className="w-full accent-nexora-500" /></div>
            <div><label className="text-sm text-gray-400 mb-2 block">Tipo de relación</label><div className="flex flex-wrap gap-2">{['Seria', 'Casual', 'Amistad'].map(v => <button key={v} className="px-3 py-1.5 rounded-full glass-light text-sm">{v}</button>)}</div></div>
          </>
        )}
        {activeTab === 'notifications' && (
          <>
            {['Nuevo match', 'Nuevo mensaje', 'Nuevo like', 'Super Like', 'Recomendaciones', 'Recordatorios'].map(n => (
              <div key={n} className="flex items-center justify-between py-2"><span className="text-sm">{n}</span><div className="w-12 h-6 rounded-full gradient-primary relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div></div></div>
            ))}
          </>
        )}
        {activeTab === 'security' && (
          <>
            <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm text-left px-4">Cambiar contraseña</button>
            <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm text-left px-4">Verificación en dos pasos</button>
            <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm text-left px-4">Sesiones activas</button>
            <button className="w-full py-3 rounded-xl glass-light hover:bg-white/10 transition text-sm text-left px-4">Cerrar sesión en otros dispositivos</button>
            <div className="pt-4 border-t border-white/10">
              <button className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">Eliminar cuenta</button>
            </div>
          </>
        )}
        {activeTab === 'blocked' && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No has bloqueado a ningún usuario</p>
          </div>
        )}
      </div>
    </div>
  );
}