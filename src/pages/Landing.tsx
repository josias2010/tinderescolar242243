import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Zap, MessageCircle, Users, Star, ChevronDown, Check, Menu, X, Sparkles, Globe, Lock, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: 'VibeSync', desc: 'Compatibilidad dinámica que evoluciona con cada interacción' },
    { icon: <Shield className="w-6 h-6" />, title: 'Seguridad Total', desc: 'Verificación de perfiles y protección avanzada' },
    { icon: <MessageCircle className="w-6 h-6" />, title: 'Chat Premium', desc: 'Conversaciones fluidas con herramientas inteligentes' },
    { icon: <Heart className="w-6 h-6" />, title: 'Match Real', desc: 'Conexiones genuinas basadas en compatibilidad' },
    { icon: <Users className="w-6 h-6" />, title: 'Comunidad', desc: 'Millones de personas buscando lo mismo que tú' },
    { icon: <Star className="w-6 h-6" />, title: 'Experiencia Premium', desc: 'Diseño elegante y funcionalidades exclusivas' },
  ];

  const steps = [
    { num: '01', title: 'Crea tu perfil', desc: 'Cuéntanos sobre ti, tus intereses y lo que buscas' },
    { num: '02', title: 'Descubre personas', desc: 'Explora perfiles compatibles con VibeSync' },
    { num: '03', title: 'Conecta', desc: 'Da like, super like o guarda para después' },
    { num: '04', title: 'Conversa', desc: 'Chatea con tus matches en tiempo real' },
    { num: '05', title: 'Conócense', desc: 'Planifica tu primera cita con nuestras ideas' },
  ];

  const testimonials = [
    { name: 'María & Carlos', text: 'Nos conocimos en NEXORA hace 6 meses. VibeSync acertó al 94%. ¡Ahora vivimos juntos!', rating: 5 },
    { name: 'Laura', text: 'La mejor app de citas que he usado. La verificación de perfiles me da mucha confianza.', rating: 5 },
    { name: 'Andrés & Sofía', text: 'Ambos buscábamos algo serio. NEXORA nos conectó y 3 meses después somos pareja.', rating: 5 },
  ];

  const faqs = [
    { q: '¿Qué es VibeSync?', a: 'VibeSync es nuestro algoritmo exclusivo de compatibilidad dinámica. Analiza tus preferencias, intereses, respuestas del onboarding y actividad en la plataforma para calcular una puntuación de compatibilidad que evoluciona con el tiempo.' },
    { q: '¿Es seguro usar NEXORA?', a: 'Absolutamente. Implementamos verificación de perfiles, moderación de contenido, sistema de reportes y bloqueos, y nunca mostramos tu ubicación exacta. Tu seguridad es nuestra prioridad.' },
    { q: '¿Puedo usar NEXORA gratis?', a: 'Sí, el plan gratuito incluye crear perfil, descubrir personas, likes diarios, matches y chat. Los planes Premium ofrecen funciones adicionales como likes ilimitados y filtros avanzados.' },
    { q: '¿Cómo funciona la verificación?', a: 'Puedes verificar tu perfil mediante un proceso seguro que confirma tu identidad sin almacenar documentos. Los perfiles verificados muestran una insignia ✓ que genera confianza.' },
    { q: '¿Puedo cambiar mis preferencias?', a: 'Sí, puedes actualizar tus preferencias, fotos y perfil en cualquier momento desde la configuración. VibeSync se actualizará automáticamente.' },
    { q: '¿Cómo cancelo mi suscripción?', a: 'Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta. Seguirás teniendo acceso hasta el final del período pagado.' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NEXORA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition">Funciones</a>
            <a href="#how" className="text-sm text-gray-300 hover:text-white transition">Cómo funciona</a>
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition">Planes</a>
            <a href="#faq" className="text-sm text-gray-300 hover:text-white transition">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">Iniciar sesión</button>
            <button onClick={() => navigate('/auth?mode=register')} className="px-5 py-2 text-sm font-semibold rounded-full gradient-primary hover:opacity-90 transition">Crear cuenta</button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden glass border-t border-white/10 overflow-hidden">
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-sm text-gray-300" onClick={() => setMobileMenu(false)}>Funciones</a>
                <a href="#how" className="block text-sm text-gray-300" onClick={() => setMobileMenu(false)}>Cómo funciona</a>
                <a href="#pricing" className="block text-sm text-gray-300" onClick={() => setMobileMenu(false)}>Planes</a>
                <a href="#faq" className="block text-sm text-gray-300" onClick={() => setMobileMenu(false)}>FAQ</a>
                <button onClick={() => navigate('/auth')} className="w-full py-2 text-sm text-gray-300">Iniciar sesión</button>
                <button onClick={() => navigate('/auth?mode=register')} className="w-full py-2.5 text-sm font-semibold rounded-full gradient-primary">Crear cuenta</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-nexora-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexora-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-nexora-300 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>La nueva forma de conectar</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Conecta con quien<br />
              <span className="gradient-text">realmente encaja</span> contigo.
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              NEXORA utiliza VibeSync, nuestro algoritmo de compatibilidad dinámica, para conectarte con personas que comparten tus valores, intereses y visión de vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/auth?mode=register')} className="px-8 py-4 text-lg font-semibold rounded-full gradient-primary hover:opacity-90 transition pulse-glow flex items-center justify-center gap-2">
                Crear cuenta gratis <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/auth')} className="px-8 py-4 text-lg font-semibold rounded-full glass-light hover:bg-white/10 transition">
                Iniciar sesión
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Gratis</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Seguro</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Verificado</div>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="mt-16 relative">
            <div className="flex justify-center gap-4 sm:gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-40 sm:w-56 h-60 sm:h-80 rounded-2xl bg-gradient-to-br ${['from-purple-500/30 to-pink-500/30', 'from-blue-500/30 to-cyan-500/30', 'from-emerald-500/30 to-teal-500/30'][i]} border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center p-4 ${i === 1 ? 'scale-110 z-10' : 'opacity-70'}`}>
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${['from-purple-400 to-pink-400', 'from-blue-400 to-cyan-400', 'from-emerald-400 to-teal-400'][i]} mb-3`}></div>
                  <div className="text-sm font-medium">Valentina, 26</div>
                  <div className="text-xs text-gray-400 mt-1">Madrid</div>
                  <div className="mt-3 px-3 py-1 rounded-full bg-nexora-600/30 text-xs text-nexora-300">
                    {92 - i * 3}% compatible
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">En 5 simples pasos, conecta con personas que realmente encajan contigo.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="gradient-card rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-3">{step.num}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VibeSync Feature */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexora-900/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-nexora-300 mb-4">
              <Zap className="w-4 h-4" /> Exclusivo de NEXORA
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">VibeSync</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Nuestro algoritmo de compatibilidad dinámica que evoluciona con cada interacción. No solo analiza tu perfil estático, sino que aprende de tus preferencias reales.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="gradient-card rounded-2xl p-6 hover:border-nexora-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="gradient-card rounded-3xl p-8 sm:p-12 text-center">
            <Lock className="w-12 h-12 text-nexora-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Tu seguridad es nuestra prioridad</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">Verificación de perfiles, moderación de contenido, sistema de reportes y nunca mostramos tu ubicación exacta. Conecta con tranquilidad.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Perfiles verificados</div>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Privacidad total</div>
              </div>
              <div className="text-center">
                <Lock className="w-8 h-8 text-nexora-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Datos encriptados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Historias de conexión</h2>
            <p className="text-gray-400">Miles de personas ya encontraron su match en NEXORA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="gradient-card rounded-2xl p-6">
                <div className="flex gap-1 mb-4">{Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-300 text-sm mb-4">"{t.text}"</p>
                <div className="text-sm font-medium text-nexora-300">{t.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planes para todos</h2>
            <p className="text-gray-400">Elige el plan que mejor se adapte a ti.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="gradient-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">€0<span className="text-sm text-gray-400">/mes</span></div>
              <ul className="space-y-3 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Crear perfil completo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 15 likes diarios</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Matches y chat</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> VibeSync básico</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Filtros básicos</li>
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className="w-full py-3 rounded-full glass-light hover:bg-white/10 transition font-medium">Comenzar gratis</button>
            </div>
            {/* Plus */}
            <div className="rounded-2xl p-6 border-2 border-nexora-500 relative bg-gradient-to-b from-nexora-900/50 to-dark-800">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-xs font-bold">POPULAR</div>
              <h3 className="text-xl font-bold mb-2">NEXORA Plus</h3>
              <div className="text-3xl font-bold mb-4">€12.99<span className="text-sm text-gray-400">/mes</span></div>
              <ul className="space-y-3 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> Likes ilimitados</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> Ver quién te dio Like</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> Filtros avanzados</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> 5 Super Likes/semana</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> Rewind</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nexora-400" /> Sin anuncios</li>
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className="w-full py-3 rounded-full gradient-primary hover:opacity-90 transition font-medium">Elegir Plus</button>
            </div>
            {/* Elite */}
            <div className="gradient-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">NEXORA Elite</h3>
              <div className="text-3xl font-bold mb-4">€24.99<span className="text-sm text-gray-400">/mes</span></div>
              <ul className="space-y-3 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Todo en Plus</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Prioridad en descubrimiento</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Perfil destacado</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Estadísticas del perfil</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> VibeSync avanzado</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Boost mensual incluido</li>
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className="w-full py-3 rounded-full glass-light hover:bg-white/10 transition font-medium">Elegir Elite</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="gradient-card rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-4 text-sm text-gray-400">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tu próxima conexión puede estar más cerca de lo que imaginas.</h2>
          <p className="text-gray-400 mb-8">Únete a miles de personas que ya encontraron su match en NEXORA.</p>
          <button onClick={() => navigate('/auth?mode=register')} className="px-8 py-4 text-lg font-semibold rounded-full gradient-primary hover:opacity-90 transition pulse-glow">
            Comenzar ahora — Es gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                <span className="font-bold">NEXORA</span>
              </div>
              <p className="text-sm text-gray-500">Conecta con quien realmente encaja contigo.</p>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition">Planes</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition">VibeSync</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition">Reportar usuario</a></li>
                <li><a href="#" className="hover:text-white transition">Comunidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2026 NEXORA. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full glass-light flex items-center justify-center hover:bg-white/10 transition text-sm">𝕏</a>
              <a href="#" className="w-8 h-8 rounded-full glass-light flex items-center justify-center hover:bg-white/10 transition text-sm">IG</a>
              <a href="#" className="w-8 h-8 rounded-full glass-light flex items-center justify-center hover:bg-white/10 transition text-sm">TT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}