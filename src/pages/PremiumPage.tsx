import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, Sparkles, ArrowRight, Shield, Eye, Heart } from 'lucide-react';

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'elite'>('plus');
  const [billing, setBilling] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const prices = {
    plus: { monthly: 12.99, quarterly: 9.99, annual: 7.99 },
    elite: { monthly: 24.99, quarterly: 19.99, annual: 14.99 },
  };

  const plusFeatures = [
    'Likes ilimitados',
    'Ver quién te dio Like',
    'Filtros avanzados',
    '5 Super Likes por semana',
    'Rewind (rehacer último swipe)',
    'Más visibilidad en descubrimiento',
    'Sin anuncios',
    'VibeSync mejorado',
  ];

  const eliteFeatures = [
    ...plusFeatures,
    'Prioridad máxima en descubrimiento',
    'Perfil destacado con borde dorado',
    'Estadísticas detalladas del perfil',
    'Mayor exposición semanal',
    'Filtros premium exclusivos',
    'VibeSync avanzado con insights',
    '1 Boost gratuito al mes',
    'Badge exclusivo Elite',
    'Soporte prioritario',
  ];

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">NEXORA Premium</h1>
          <p className="text-gray-400">Desbloquea todo el poder de la compatibilidad real.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 'monthly', label: 'Mensual' },
            { id: 'quarterly', label: 'Trimestral', save: '-23%' },
            { id: 'annual', label: 'Anual', save: '-38%' },
          ].map(b => (
            <button key={b.id} onClick={() => setBilling(b.id as any)} className={`px-4 py-2 rounded-full text-sm transition relative ${billing === b.id ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>
              {b.label}
              {b.save && <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-green-500 text-[9px] font-bold">{b.save}</span>}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Plus */}
          <motion.div whileHover={{ scale: 1.02 }} className={`rounded-2xl p-6 border-2 transition cursor-pointer ${selectedPlan === 'plus' ? 'border-nexora-500 bg-nexora-900/30' : 'border-white/10 glass-light'}`} onClick={() => setSelectedPlan('plus')}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-nexora-400" />
              <h2 className="text-xl font-bold">NEXORA Plus</h2>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">€{prices.plus[billing]}</span>
              <span className="text-gray-400 text-sm">/mes</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plusFeatures.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-nexora-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className={`w-full py-3 rounded-xl text-center font-medium text-sm transition ${selectedPlan === 'plus' ? 'gradient-primary' : 'glass-light'}`}>
              {selectedPlan === 'plus' ? '✓ Seleccionado' : 'Elegir Plus'}
            </div>
          </motion.div>

          {/* Elite */}
          <motion.div whileHover={{ scale: 1.02 }} className={`rounded-2xl p-6 border-2 transition cursor-pointer relative ${selectedPlan === 'elite' ? 'border-yellow-500 bg-yellow-900/10' : 'border-white/10 glass-light'}`} onClick={() => setSelectedPlan('elite')}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-black">RECOMENDADO</div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">NEXORA Elite</h2>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">€{prices.elite[billing]}</span>
              <span className="text-gray-400 text-sm">/mes</span>
            </div>
            <ul className="space-y-2 mb-6">
              {eliteFeatures.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className={`w-full py-3 rounded-xl text-center font-medium text-sm transition ${selectedPlan === 'elite' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'glass-light'}`}>
              {selectedPlan === 'elite' ? '✓ Seleccionado' : 'Elegir Elite'}
            </div>
          </motion.div>
        </div>

        {/* Boost Section */}
        <div className="gradient-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexora-400 to-pink-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Boost NEXORA</h3>
              <p className="text-xs text-gray-400">Aumenta tu visibilidad temporalmente</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { duration: '30 min', price: '€2.99', reach: '~500 personas' },
              { duration: '1 hora', price: '€4.99', reach: '~1000 personas' },
              { duration: '2 horas', price: '€7.99', reach: '~2000 personas' },
            ].map(b => (
              <button key={b.duration} className="p-3 rounded-xl glass-light hover:bg-white/10 transition text-center">
                <div className="text-sm font-bold">{b.duration}</div>
                <div className="text-xs text-nexora-300">{b.price}</div>
                <div className="text-[10px] text-gray-500 mt-1">{b.reach}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Super Like */}
        <div className="gradient-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Super Like</h3>
              <p className="text-xs text-gray-400">Destaca entre todos los likes</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-3">Envía una señal especial de interés. Tu Super Like aparece con un borde azul brillante y notifica al otro usuario inmediatamente.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>3x más probabilidades de match con Super Like</span>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-4 rounded-xl gradient-primary font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition pulse-glow">
          Suscribirme a NEXORA {selectedPlan === 'plus' ? 'Plus' : 'Elite'} <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Cancela cuando quieras. Pago seguro con Stripe. Sin compromisos.
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pago seguro</div>
          <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> Sin compromiso</div>
          <div className="flex items-center gap-1"><Heart className="w-3 h-3" /> Garantía 7 días</div>
        </div>
      </div>
    </div>
  );
}