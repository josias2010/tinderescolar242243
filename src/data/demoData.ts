export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  distance: number;
  bio: string;
  profession: string;
  education: string;
  interests: string[];
  hobbies: string[];
  languages: string[];
  relationshipType: string;
  personality: string;
  verified: boolean;
  premium: boolean;
  photos: string[];
  compatibility: number;
  vibeSync: number;
  vibeReasons: string[];
  online: boolean;
  lastActive: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  unread: number;
  pinned: boolean;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'emoji' | 'image';
}

const photoColors = [
  'from-purple-400 to-pink-400',
  'from-blue-400 to-cyan-400',
  'from-emerald-400 to-teal-400',
  'from-orange-400 to-red-400',
  'from-pink-400 to-rose-400',
  'from-indigo-400 to-purple-400',
  'from-yellow-400 to-orange-400',
  'from-teal-400 to-blue-400',
];

const names = [
  'Valentina', 'Sofía', 'Camila', 'Isabella', 'Mariana', 'Luciana', 'Daniela', 'Andrea',
  'Carolina', 'Gabriela', 'Alejandra', 'Natalia', 'Paula', 'Laura', 'Martina', 'Emilia',
  'Mateo', 'Sebastián', 'Daniel', 'Alejandro', 'Nicolás', 'Diego', 'Andrés', 'Carlos',
  'Javier', 'Tomás', 'Ricardo', 'Fernando', 'Miguel', 'Rafael'
];

const cities = ['Madrid', 'Barcelona', 'Buenos Aires', 'Ciudad de México', 'Bogotá', 'Lima', 'Santiago', 'Montevideo'];
const professions = ['Diseñadora UX', 'Médica', 'Abogada', 'Ingeniera de Software', 'Arquitecta', 'Chef', 'Fotógrafa', 'Psicóloga', 'Marketing Digital', 'Profesora', 'Emprendedora', 'Periodista', 'Abogado', 'Ingeniero Civil', 'Músico', 'Director Creativo'];
const educations = ['Universidad Complutense', 'UNAM', 'Universidad de los Andes', 'PUC', 'UBA', 'UPC', 'Universidad de Palermo', 'MIT Online'];
const interests = ['Viajes', 'Fotografía', 'Yoga', 'Lectura', 'Cocina', 'Música', 'Cine', 'Deportes', 'Arte', 'Tecnología', 'Naturaleza', 'Baile', 'Meditación', 'Senderismo', 'Surf', 'Escritura'];
const hobbies = ['Correr', 'Pintar', 'Tocar guitarra', 'Cocinar', 'Jardinería', 'Buceo', 'Escalada', 'Bailar salsa', 'Ajedrez', 'Podcasts'];
const languages = ['Español', 'Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán'];
const relationshipTypes = ['Relación seria', 'Algo casual', 'Conocer personas', 'Amistad', 'Relación abierta'];
const personalities = ['Introvertida', 'Extrovertida', 'Ambivertida', 'Aventurera', 'Reflexiva', 'Creativa'];

const bios = [
  'Apasionada por descubrir nuevos lugares y conectar con personas interesantes. La vida es mejor con buenas conversaciones.',
  'Amante del arte, la música y las largas caminatas por la ciudad. Busco alguien que comparta mi curiosidad por el mundo.',
  'Creo en las conexiones genuinas y las risas compartidas. Si te gusta explorar, ya tenemos algo en común.',
  'Inspirada por los atardeceres, los buenos libros y las conversaciones profundas. Busco autenticidad.',
  'Vivo entre proyectos creativos y aventuras espontáneas. Me encantaría compartir mis descubrimientos contigo.',
  'La vida es una aventura y busco un compañero de viaje. Si te gusta reír y soñar, hablemos.',
  'Equilibrio entre tranquilidad y emoción. Disfruto tanto un café tranquilo como una noche de baile.',
  'Optimista incurable con pasión por la fotografía y los viajes. Cada día es una nueva oportunidad.',
];

const vibeReasonsPool = [
  'Ambos disfrutan viajar y explorar nuevos lugares.',
  'Comparten interés por el arte y la cultura.',
  'Tienen valores similares sobre las relaciones.',
  'Ambos buscan una conexión genuina y profunda.',
  'Comparten estilo de vida activo y saludable.',
  'Tienen objetivos de vida compatibles.',
  'Ambos valoran la comunicación abierta.',
  'Comparten pasión por la música y el entretenimiento.',
  'Tienen ritmos sociales compatibles.',
  'Ambos disfrutan de la naturaleza y actividades al aire libre.',
];

function generateProfiles(): UserProfile[] {
  return names.map((name, i) => {
    const isFemale = i < 16;
    const age = 23 + Math.floor(Math.random() * 15);
    const city = cities[i % cities.length];
    const compatibility = 70 + Math.floor(Math.random() * 25);
    const vibeSync = 65 + Math.floor(Math.random() * 30);
    const shuffledReasons = [...vibeReasonsPool].sort(() => Math.random() - 0.5);
    
    return {
      id: `user_${i + 1}`,
      name,
      age,
      city,
      country: 'España',
      distance: Math.floor(Math.random() * 30) + 1,
      bio: bios[i % bios.length],
      profession: professions[i % professions.length],
      education: educations[i % educations.length],
      interests: interests.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 3)),
      hobbies: hobbies.sort(() => Math.random() - 0.5).slice(0, 3),
      languages: languages.slice(0, 2 + Math.floor(Math.random() * 2)),
      relationshipType: relationshipTypes[i % relationshipTypes.length],
      personality: personalities[i % personalities.length],
      verified: Math.random() > 0.3,
      premium: Math.random() > 0.7,
      photos: [photoColors[i % photoColors.length], photoColors[(i + 3) % photoColors.length]],
      compatibility,
      vibeSync,
      vibeReasons: shuffledReasons.slice(0, 3),
      online: Math.random() > 0.5,
      lastActive: Math.random() > 0.5 ? 'Ahora' : `Hace ${Math.floor(Math.random() * 60)} min`,
    };
  });
}

function generateConversations(profiles: UserProfile[]): Conversation[] {
  const matchedProfiles = profiles.slice(0, 8);
  return matchedProfiles.map((profile, i) => ({
    id: `conv_${i + 1}`,
    userId: profile.id,
    messages: [
      { id: `msg_${i}_1`, senderId: profile.id, text: '¡Hola! Vi que ambos nos gusta viajar. ¿Cuál ha sido tu destino favorito?', timestamp: '10:30', read: true, type: 'text' },
      { id: `msg_${i}_2`, senderId: 'current_user', text: '¡Hola! Me encanta Japón, la cultura y la comida son increíbles. ¿Y tú?', timestamp: '10:32', read: true, type: 'text' },
      { id: `msg_${i}_3`, senderId: profile.id, text: 'Italia sin duda. Roma me robó el corazón 😍', timestamp: '10:35', read: true, type: 'text' },
      { id: `msg_${i}_4`, senderId: 'current_user', text: '¡Qué bueno! Roma es mágica. ¿Has visitado Florencia también?', timestamp: '10:37', read: true, type: 'text' },
      { id: `msg_${i}_5`, senderId: profile.id, text: i % 2 === 0 ? '¡Sí! Florencia es hermosa. Deberíamos ir juntos algún día 😊' : 'Todavía no, pero está en mi lista. ¿Me recomiendas algo?', timestamp: '10:40', read: i % 2 === 0, type: 'text' },
    ],
    unread: i % 3 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
    pinned: i === 0,
    lastMessage: i % 2 === 0 ? '¡Sí! Florencia es hermosa. Deberíamos ir juntos algún día 😊' : 'Todavía no, pero está en mi lista.',
    lastMessageTime: '10:40',
  }));
}

export const profiles = generateProfiles();
export const conversations = generateConversations(profiles);

export const currentUser = {
  id: 'current_user',
  name: 'Tú',
  age: 28,
  city: 'Madrid',
  country: 'España',
  bio: 'Apasionado por la tecnología y las buenas conversaciones.',
  profession: 'Desarrollador de Software',
  education: 'Universidad Politécnica',
  interests: ['Tecnología', 'Viajes', 'Música', 'Fotografía'],
  hobbies: ['Correr', 'Cocinar', 'Leer'],
  languages: ['Español', 'Inglés'],
  relationshipType: 'Relación seria',
  plan: 'free' as 'free' | 'plus' | 'elite',
  likesUsed: 8,
  likesLimit: 15,
  superLikesUsed: 0,
  superLikesLimit: 3,
  boostsUsed: 0,
};

export const icebreakers = [
  '¿Cuál es tu viaje soñado?',
  '¿Cuál es tu comida favorita?',
  '¿Qué cosa te hace reír fácilmente?',
  '¿Cuál es la última serie que te enganchó?',
  '¿Qué harías en un día perfecto?',
  '¿Cuál es tu lugar favorito en la ciudad?',
  '¿Qué libro cambiaría tu vida?',
  '¿Cuál es tu canción favorita ahora mismo?',
];

export const dateIdeas = [
  { type: 'Café', icon: '☕', description: 'Un café tranquilo para conocerse mejor' },
  { type: 'Restaurante', icon: '🍽️', description: 'Una cena en un lugar especial' },
  { type: 'Caminata', icon: '🚶', description: 'Un paseo por la ciudad al atardecer' },
  { type: 'Cine', icon: '🎬', description: 'Ver una película juntos' },
  { type: 'Playa', icon: '🏖️', description: 'Un día relajante frente al mar' },
  { type: 'Evento', icon: '🎵', description: 'Un concierto o evento cultural' },
  { type: 'Actividad', icon: '🎨', description: 'Una clase de arte o cocina juntos' },
  { type: 'Virtual', icon: '💻', description: 'Una videollamada para romper el hielo' },
];

export const adminStats = {
  totalUsers: 48520,
  activeUsers: 12340,
  newUsersToday: 234,
  totalMatches: 89430,
  messagesToday: 45200,
  reports: 23,
  revenue: 124500,
  premiumUsers: 8920,
  conversionRate: 18.4,
  dau: 12340,
  mau: 34500,
};