import { useState } from 'react';
import { motion } from 'framer-motion';
import { adminStats, profiles } from '../data/demoData';
import { Users, MessageCircle, Heart, DollarSign, TrendingUp, Shield, AlertTriangle, Settings, BarChart3, CreditCard, Eye, Ban, Check, Search, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', icon: <BarChart3 className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'users', icon: <Users className="w-4 h-4" />, label: 'Usuarios' },
    { id: 'moderation', icon: <Shield className="w-4 h-4" />, label: 'Moderación' },
    { id: 'payments', icon: <CreditCard className="w-4 h-4" />, label: 'Pagos' },
    { id: 'analytics', icon: <TrendingUp className="w-4 h-4" />, label: 'Analytics' },
    { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-white/10 bg-dark-800/50 fixed h-full">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm">NEXORA</span>
              <p className="text-[10px] text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition ${activeSection === s.id ? 'gradient-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 px-4 h-12 flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${activeSection === s.id ? 'gradient-primary' : 'glass-light'}`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {activeSection === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard General</h1>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Usuarios totales', value: adminStats.totalUsers.toLocaleString(), icon: <Users className="w-5 h-5" />, change: '+12%', up: true, color: 'text-blue-400' },
                { label: 'Usuarios activos', value: adminStats.activeUsers.toLocaleString(), icon: <Eye className="w-5 h-5" />, change: '+8%', up: true, color: 'text-green-400' },
                { label: 'Matches totales', value: adminStats.totalMatches.toLocaleString(), icon: <Heart className="w-5 h-5" />, change: '+15%', up: true, color: 'text-pink-400' },
                { label: 'Ingresos (€)', value: `€${adminStats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, change: '+22%', up: true, color: 'text-yellow-400' },
                { label: 'Nuevos hoy', value: adminStats.newUsersToday.toString(), icon: <Users className="w-5 h-5" />, change: '+5%', up: true, color: 'text-purple-400' },
                { label: 'Mensajes hoy', value: adminStats.messagesToday.toLocaleString(), icon: <MessageCircle className="w-5 h-5" />, change: '+18%', up: true, color: 'text-cyan-400' },
                { label: 'Premium users', value: adminStats.premiumUsers.toLocaleString(), icon: <TrendingUp className="w-5 h-5" />, change: '+9%', up: true, color: 'text-orange-400' },
                { label: 'Reportes', value: adminStats.reports.toString(), icon: <AlertTriangle className="w-5 h-5" />, change: '-3%', up: false, color: 'text-red-400' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="gradient-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={stat.color}>{stat.icon}</span>
                    <span className={`text-xs flex items-center gap-0.5 ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Crecimiento de usuarios</h3>
                <div className="h-40 flex items-end gap-2">
                  {[40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 100].map((h, i) => (
                    <div key={i} className="flex-1 gradient-primary rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Ene</span><span>Jun</span><span>Dic</span>
                </div>
              </div>
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Conversión Free → Premium</h3>
                <div className="flex items-center justify-center h-40">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeDasharray={`${adminStats.conversionRate * 2.51} 251`} strokeLinecap="round" />
                      <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{adminStats.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="gradient-card rounded-xl p-6">
              <h3 className="font-semibold mb-4">Actividad reciente</h3>
              <div className="space-y-3">
                {[
                  { text: 'Nuevo usuario registrado: valentina@email.com', time: 'Hace 2 min', type: 'user' },
                  { text: 'Reporte #2345 - Foto inapropiada', time: 'Hace 15 min', type: 'report' },
                  { text: 'Nueva suscripción Elite: carlos@email.com', time: 'Hace 30 min', type: 'payment' },
                  { text: 'Verificación completada: maria@email.com', time: 'Hace 1 hora', type: 'verification' },
                  { text: 'Usuario bloqueado: spam_account_123', time: 'Hace 2 horas', type: 'block' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'report' ? 'bg-red-400' : activity.type === 'payment' ? 'bg-green-400' : activity.type === 'block' ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                    <span className="text-sm flex-1">{activity.text}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Buscar usuario..." className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm w-48 sm:w-64" />
              </div>
            </div>
            <div className="gradient-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-gray-400 font-medium">Usuario</th>
                      <th className="text-left p-3 text-gray-400 font-medium hidden sm:table-cell">Ciudad</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Estado</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Plan</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.slice(0, 10).map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.photos[0]}`}></div>
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-gray-500">{p.age} años</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell text-gray-400">{p.city}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${p.verified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {p.verified ? 'Verificado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${p.premium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-gray-400'}`}>
                            {p.premium ? 'Premium' : 'Free'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition" title="Ver"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition" title="Verificar"><Check className="w-3.5 h-3.5 text-green-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition" title="Bloquear"><Ban className="w-3.5 h-3.5 text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'moderation' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Moderación</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold text-red-400">{adminStats.reports}</div>
                <div className="text-xs text-gray-400">Reportes pendientes</div>
              </div>
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">5</div>
                <div className="text-xs text-gray-400">Fotos en revisión</div>
              </div>
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">142</div>
                <div className="text-xs text-gray-400">Resueltos hoy</div>
              </div>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h3 className="font-semibold mb-4">Reportes recientes</h3>
              <div className="space-y-3">
                {[
                  { id: '#2345', user: 'Usuario_234', reason: 'Foto inapropiada', severity: 'alta', time: 'Hace 15 min' },
                  { id: '#2344', user: 'Usuario_189', reason: 'Comportamiento abusivo', severity: 'alta', time: 'Hace 30 min' },
                  { id: '#2343', user: 'Usuario_456', reason: 'Perfil falso', severity: 'media', time: 'Hace 1 hora' },
                  { id: '#2342', user: 'Usuario_789', reason: 'Spam en mensajes', severity: 'baja', time: 'Hace 2 horas' },
                  { id: '#2341', user: 'Usuario_321', reason: 'Menor de edad sospechado', severity: 'crítica', time: 'Hace 3 horas' },
                ].map(report => (
                  <div key={report.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-2 h-2 rounded-full ${report.severity === 'crítica' ? 'bg-red-500' : report.severity === 'alta' ? 'bg-orange-500' : report.severity === 'media' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{report.reason}</div>
                      <div className="text-xs text-gray-500">{report.id} • {report.user}</div>
                    </div>
                    <span className="text-xs text-gray-500">{report.time}</span>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">Resolver</button>
                      <button className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">Ban</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'payments' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Pagos y Suscripciones</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">€{adminStats.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Ingresos del mes</div>
              </div>
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold">{adminStats.premiumUsers.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Suscriptores activos</div>
              </div>
              <div className="gradient-card rounded-xl p-4">
                <div className="text-2xl font-bold">{adminStats.conversionRate}%</div>
                <div className="text-xs text-gray-400">Tasa de conversión</div>
              </div>
            </div>
            <div className="gradient-card rounded-xl p-4">
              <h3 className="font-semibold mb-4">Transacciones recientes</h3>
              <div className="space-y-2">
                {[
                  { user: 'Carlos M.', plan: 'Elite', amount: '€24.99', date: 'Hoy', status: 'completado' },
                  { user: 'María L.', plan: 'Plus', amount: '€12.99', date: 'Hoy', status: 'completado' },
                  { user: 'Andrés R.', plan: 'Elite', amount: '€14.99', date: 'Ayer', status: 'completado' },
                  { user: 'Laura G.', plan: 'Plus', amount: '€9.99', date: 'Ayer', status: 'reembolso' },
                  { user: 'Sofía P.', plan: 'Elite', amount: '€24.99', date: 'Hace 2 días', status: 'completado' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-400 to-pink-400"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tx.user}</div>
                      <div className="text-xs text-gray-500">NEXORA {tx.plan}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{tx.amount}</div>
                      <div className={`text-xs ${tx.status === 'reembolso' ? 'text-red-400' : 'text-green-400'}`}>{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Analytics</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="gradient-card rounded-xl p-4 text-center">
                <div className="text-xl font-bold">{adminStats.dau.toLocaleString()}</div>
                <div className="text-xs text-gray-400">DAU</div>
              </div>
              <div className="gradient-card rounded-xl p-4 text-center">
                <div className="text-xl font-bold">{adminStats.mau.toLocaleString()}</div>
                <div className="text-xs text-gray-400">MAU</div>
              </div>
              <div className="gradient-card rounded-xl p-4 text-center">
                <div className="text-xl font-bold">4.2</div>
                <div className="text-xs text-gray-400">Matches promedio/día</div>
              </div>
              <div className="gradient-card rounded-xl p-4 text-center">
                <div className="text-xl font-bold">3.2%</div>
                <div className="text-xs text-gray-400">Churn rate</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Retención (últimos 7 días)</h3>
                <div className="h-32 flex items-end gap-1">
                  {[100, 85, 72, 65, 58, 52, 48].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gradient-to-t from-nexora-600 to-nexora-400 rounded-t-sm" style={{ height: `${v}%` }}></div>
                      <span className="text-[10px] text-gray-500">D{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Actividad por hora</h3>
                <div className="h-32 flex items-end gap-0.5">
                  {Array.from({ length: 24 }, (_, i) => {
                    const h = [20, 15, 10, 8, 5, 5, 10, 25, 40, 55, 60, 65, 70, 65, 60, 55, 50, 55, 65, 80, 90, 85, 70, 45][i];
                    return <div key={i} className="flex-1 bg-nexora-500/60 rounded-t-sm" style={{ height: `${h}%` }}></div>;
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                  <span>00:00</span><span>12:00</span><span>23:00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Configuración del Sistema</h1>
            <div className="space-y-4">
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Planes y Precios</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="font-medium mb-2">Free</div>
                    <div className="text-sm text-gray-400">Likes: 15/día</div>
                    <div className="text-sm text-gray-400">Super Likes: 3/semana</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="font-medium mb-2">Plus - €12.99/mes</div>
                    <div className="text-sm text-gray-400">Likes: Ilimitados</div>
                    <div className="text-sm text-gray-400">Super Likes: 5/semana</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="font-medium mb-2">Elite - €24.99/mes</div>
                    <div className="text-sm text-gray-400">Likes: Ilimitados</div>
                    <div className="text-sm text-gray-400">Super Likes: 10/semana</div>
                  </div>
                </div>
              </div>
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Categorías de Intereses</h3>
                <div className="flex flex-wrap gap-2">
                  {['Viajes', 'Fotografía', 'Yoga', 'Lectura', 'Cocina', 'Música', 'Cine', 'Deportes', 'Arte', 'Tecnología', 'Naturaleza', 'Baile', 'Meditación', 'Senderismo', 'Surf', 'Escritura', 'Gaming', 'Moda'].map(i => (
                    <span key={i} className="px-3 py-1 rounded-full glass-light text-xs">{i}</span>
                  ))}
                  <button className="px-3 py-1 rounded-full border border-dashed border-white/20 text-xs text-gray-400">+ Agregar</button>
                </div>
              </div>
              <div className="gradient-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Preguntas VibeSync</h3>
                <div className="space-y-2">
                  {['¿Qué importancia tiene la familia?', '¿Qué estilo de vida tienes?', '¿Te gusta viajar?', '¿Introvertido o extrovertido?', '¿Qué valoras en una relación?'].map((q, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                      <span className="text-xs text-nexora-400">Q{i + 1}</span>
                      <span className="text-sm flex-1">{q}</span>
                      <button className="text-xs text-gray-500 hover:text-white">Editar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}