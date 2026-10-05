import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { ArrowRight, ArrowLeft, Camera, Sparkles } from 'lucide-react';

const steps = [
  { id: 'basics', title: 'Lo básico', subtitle: 'Cuéntanos sobre ti' },
  { id: 'photos', title: 'Tus fotos', subtitle: 'Muestra tu mejor versión' },
  { id: 'about', title: 'Sobre ti', subtitle: 'Tu biografía y profesión' },
  { id: 'interests', title: 'Intereses', subtitle: '¿Qué te apasiona?' },
  { id: 'lifestyle', title: 'Estilo de vida', subtitle: 'Cómo vives tu día a día' },
  { id: 'relationship', title: 'Relación', subtitle: '¿Qué buscas?' },
  { id: 'personality', title: 'Personalidad', subtitle: 'Conócete mejor' },
  { id: 'complete', title: '¡Listo!', subtitle: 'Tu perfil está preparado' },
];

const interestOptions = ['Viajes', 'Fotografía', 'Yoga', 'Lectura', 'Cocina', 'Música', 'Cine', 'Deportes', 'Arte', 'Tecnología', 'Naturaleza', 'Baile', 'Meditación', 'Senderismo', 'Surf', 'Escritura', 'Gaming', 'Moda', 'Café', 'Vino'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', birthDate: '', gender: '', lookingFor: '', city: '',
    bio: '', profession: '', education: '', interests: [] as string[],
    hobbies: [] as string[], languages: [] as string[],
    relationshipType: '', familyImportance: '', lifestyle: '',
    travel: '', personality: '', values: '', dealbreakers: '', dateType: '',
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else { completeOnboarding(); navigate('/app/discover'); }
  };
  const prev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 8)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Tu nombre" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Fecha de nacimiento</label>
              <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Género</label>
              <div className="grid grid-cols-3 gap-3">
                {['Mujer', 'Hombre', 'Otro'].map(g => (
                  <button key={g} onClick={() => setFormData({...formData, gender: g})} className={`py-3 rounded-xl text-sm font-medium transition ${formData.gender === g ? 'gradient-primary' : 'glass-light hover:bg-white/10'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Ciudad</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Tu ciudad" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-6">Sube al menos 2 fotos para mostrar tu mejor versión</p>
            <div className="grid grid-cols-3 gap-3">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="aspect-square rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition cursor-pointer">
                  <Camera className="w-6 h-6 text-gray-500" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Las fotos claras y sonrientes tienen 3x más matches</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Biografía</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Cuéntanos algo interesante sobre ti..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm resize-none" maxLength={300} />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/300</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Profesión</label>
              <input type="text" value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} placeholder="¿A qué te dedicas?" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Educación</label>
              <input type="text" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} placeholder="Tu formación" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm" />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-sm text-gray-400 mb-4">Selecciona hasta 8 intereses</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button key={interest} onClick={() => toggleInterest(interest)} className={`px-4 py-2 rounded-full text-sm transition ${formData.interests.includes(interest) ? 'gradient-primary font-medium' : 'glass-light hover:bg-white/10'}`}>
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">{formData.interests.length}/8 seleccionados</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">¿Qué importancia tiene la familia para ti?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Muy alta', 'Moderada', 'Baja'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, familyImportance: v})} className={`py-2.5 rounded-xl text-sm ${formData.familyImportance === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">¿Te gusta viajar?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Me encanta', 'De vez en cuando', 'Prefiero quedarme'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, travel: v})} className={`py-2.5 rounded-xl text-sm ${formData.travel === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Estilo de vida</label>
              <div className="grid grid-cols-2 gap-2">
                {['Activo', 'Tranquilo', 'Equilibrado', 'Aventurero'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, lifestyle: v})} className={`py-2.5 rounded-xl text-sm ${formData.lifestyle === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <label className="text-sm text-gray-400 mb-3 block">¿Qué tipo de relación buscas?</label>
            <div className="space-y-3">
              {['Relación seria', 'Algo casual', 'Conocer personas', 'Amistad', 'Aún no lo sé'].map(v => (
                <button key={v} onClick={() => setFormData({...formData, relationshipType: v})} className={`w-full py-3 px-4 rounded-xl text-sm text-left transition ${formData.relationshipType === v ? 'gradient-primary font-medium' : 'glass-light hover:bg-white/10'}`}>{v}</button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">¿Eres más introvertido o extrovertido?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Introvertido', 'Ambivertido', 'Extrovertido'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, personality: v})} className={`py-2.5 rounded-xl text-sm ${formData.personality === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">¿Qué valoras más en una relación?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Confianza', 'Comunicación', 'Humor', 'Aventura', 'Lealtad', 'Libertad'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, values: v})} className={`py-2.5 rounded-xl text-sm ${formData.values === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">¿Qué tipo de citas prefieres?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Tranquilas', 'Aventureras', 'Culturales', 'Gastronómicas'].map(v => (
                  <button key={v} onClick={() => setFormData({...formData, dateType: v})} className={`py-2.5 rounded-xl text-sm ${formData.dateType === v ? 'gradient-primary' : 'glass-light'}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">¡Tu perfil está listo!</h2>
            <p className="text-gray-400 text-sm mb-6">Es hora de descubrir personas increíbles que encajan contigo.</p>
            <div className="gradient-card rounded-xl p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexora-400 to-pink-400"></div>
                <div>
                  <div className="font-medium">{formData.name || 'Usuario'}</div>
                  <div className="text-xs text-gray-400">{formData.city || 'Tu ciudad'}</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Progress */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Paso {currentStep + 1} de {steps.length}</span>
            <span className="text-xs text-nexora-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-1">{steps[currentStep].title}</h2>
              <p className="text-gray-400 text-sm mb-6">{steps[currentStep].subtitle}</p>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 0 && (
            <button onClick={prev} className="px-6 py-3 rounded-xl glass-light hover:bg-white/10 transition font-medium text-sm">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button onClick={next} className="flex-1 py-3 rounded-xl gradient-primary hover:opacity-90 transition font-semibold text-sm flex items-center justify-center gap-2">
            {currentStep === steps.length - 1 ? 'Comenzar a explorar' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}