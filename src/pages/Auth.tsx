import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Completa todos los campos'); return; }
    if (mode === 'register' && !name) { setError('Ingresa tu nombre'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        login(email, password);
        navigate('/app/discover');
      } else {
        register({ email, name });
        navigate('/onboarding');
      }
      setLoading(false);
    }, 800);
  };

  const handleSocial = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      register({ email: `user@${provider}.com`, name: 'Usuario' });
      navigate('/onboarding');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexora-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {mode === 'login' ? 'Inicia sesión para continuar conectando' : 'Únete a NEXORA y encuentra tu match'}
          </p>
        </div>

        <div className="gradient-card rounded-2xl p-6 sm:p-8">
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleSocial('google')} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-light hover:bg-white/10 transition text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
              Google
            </button>
            <button onClick={() => handleSocial('apple')} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-light hover:bg-white/10 transition text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500">o con email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-gray-500 focus:border-nexora-500 transition" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-gray-500 focus:border-nexora-500 transition" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-gray-500 focus:border-nexora-500 transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" /> Recordarme
                </label>
                <button type="button" className="text-nexora-400 hover:text-nexora-300">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-primary hover:opacity-90 transition font-semibold text-sm disabled:opacity-50">
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          <button className="w-full mt-3 py-3 rounded-xl glass-light hover:bg-white/10 transition font-medium text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Continuar con teléfono
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-nexora-400 hover:text-nexora-300 font-medium">
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>

        <p className="text-center mt-4 text-xs text-gray-600">
          Al continuar, aceptas nuestros Términos y Política de Privacidad.
        </p>
      </motion.div>
    </div>
  );
}