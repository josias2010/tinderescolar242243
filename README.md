# NEXORA - Plataforma de Citas Premium

<div align="center">

![NEXORA](https://img.shields.io/badge/NEXORA-Premium%20Dating-6C3AED?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)

**"Conecta con quien realmente encaja contigo"**

La plataforma de citas premium con VibeSync - nuestro algoritmo de compatibilidad dinámica.

[Demo](#) • [Documentación](DEPLOYMENT.md) • [Reportar Bug](#)

</div>

---

## 🌟 Características

### Para Usuarios
- ✅ **VibeSync** - Algoritmo de compatibilidad dinámica que evoluciona con cada interacción
- ✅ **Swipe System** - Descubre perfiles con gestos intuitivos
- ✅ **Chat en Tiempo Real** - Mensajería instantánea con typing indicators
- ✅ **Match Automático** - Cuando ambos se gustan, ¡es match!
- ✅ **Super Like** - Destaca con una señal especial de interés
- ✅ **Boost** - Aumenta tu visibilidad temporalmente
- ✅ **Favoritos** - Guarda perfiles para después
- ✅ **Planes Premium** - Plus y Elite con funciones exclusivas
- ✅ **Verificación** - Perfiles verificados con insignia ✓
- ✅ **Seguridad** - Reportes, bloqueos y moderación

### Para Administradores
- ✅ **Dashboard Completo** - Estadísticas en tiempo real
- ✅ **Gestión de Usuarios** - Ban, verificación, moderación
- ✅ **Moderación** - Sistema de reportes completo
- ✅ **Analytics** - Métricas de crecimiento y retención
- ✅ **Pagos** - Control de suscripciones y transacciones
- ✅ **Configuración** - Planes, precios, categorías

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  React + TypeScript + Vite + Tailwind + Framer Motion   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Supabase)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │  (Database)  │  │  (OAuth/OTP) │  │  (Images)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Realtime   │  │ Edge Funcs   │  │     RLS      │ │
│  │   (Chat)     │  │  (Stripe)    │  │  (Security)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Stripe     │  │    Twilio    │  │   Google     │ │
│  │  (Payments)  │  │   (SMS OTP)  │  │   (OAuth)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Stack Tecnológico

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - **PostgreSQL** - Database
  - **Authentication** - User auth (Email, Google, Apple, Phone)
  - **Storage** - File storage (avatars, photos)
  - **Realtime** - WebSocket connections
  - **Edge Functions** - Serverless functions (Deno)
  - **Row Level Security** - Database security

### Payments
- **Stripe** - Payment processing
  - Subscriptions (Plus, Elite)
  - One-time payments (Boost)
  - Webhooks (payment events)

### External APIs
- **Google OAuth** - Social login
- **Apple Sign In** - Social login
- **Twilio** - SMS OTP verification

---

## 🗄️ Base de Datos

### Tablas Principales

```sql
profiles              # Usuarios y perfiles
photos                # Fotos de perfil
interests             # Intereses disponibles
user_interests        # Intereses de usuarios
hobbies               # Hobbies disponibles
user_hobbies          # Hobbies de usuarios
languages             # Idiomas disponibles
user_languages        # Idiomas de usuarios
preferences           # Preferencias de búsqueda
vibesync_answers      # Respuestas del algoritmo
vibesync_scores       # Puntuaciones de compatibilidad
likes                 # Likes y super likes
matches               # Matches entre usuarios
conversations         # Conversaciones de chat
messages              # Mensajes
message_reads         # Lecturas de mensajes
notifications         # Notificaciones
favorites             # Perfiles favoritos
reports               # Reportes de usuarios
blocks                # Usuarios bloqueados
subscriptions         # Suscripciones premium
payments              # Historial de pagos
boosts                # Boosts de perfil
date_plans            # Planes de citas
security_events       # Eventos de seguridad
admin_users           # Usuarios administradores
```

### Relaciones Clave

```
profiles (1) ←→ (N) photos
profiles (1) ←→ (N) user_interests
profiles (1) ←→ (N) likes (from_user_id)
profiles (1) ←→ (N) likes (to_user_id)
profiles (N) ←→ (N) matches
matches (1) ←→ (1) conversations
conversations (1) ←→ (N) messages
profiles (1) ←→ (N) notifications
profiles (1) ←→ (1) subscriptions
```

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/yourusername/nexora.git
cd nexora
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase y Stripe.

### 4. Configurar Supabase

Sigue la [guía completa de despliegue](DEPLOYMENT.md) para:
- Crear proyecto en Supabase
- Ejecutar migraciones de base de datos
- Configurar Authentication
- Configurar Storage
- Desplegar Edge Functions

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre http://localhost:5173

---

## 📁 Estructura del Proyecto

```
nexora/
├── public/                 # Archivos estáticos
│   ├── manifest.json      # PWA manifest
│   └── icons/             # Iconos de la app
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Landing.tsx    # Landing page
│   │   ├── Auth.tsx       # Login/Registro
│   │   ├── Onboarding.tsx # Onboarding
│   │   ├── Dashboard.tsx  # Layout principal
│   │   ├── Discover.tsx   # Swipe/Descubrir
│   │   ├── ChatPage.tsx   # Chat
│   │   ├── MatchesPage.tsx # Matches
│   │   ├── ProfilePage.tsx # Perfil
│   │   ├── PremiumPage.tsx # Planes premium
│   │   └── AdminPage.tsx  # Panel admin
│   ├── lib/               # Servicios y utilidades
│   │   ├── supabase.ts    # Cliente Supabase
│   │   ├── auth.ts        # Autenticación
│   │   ├── profiles.ts    # Perfiles
│   │   ├── matches.ts     # Matches y likes
│   │   ├── messages.ts    # Chat
│   │   ├── notifications.ts # Notificaciones
│   │   ├── subscriptions.ts # Pagos
│   │   ├── reports.ts     # Reportes/bloqueos
│   │   └── admin.ts       # Admin
│   ├── data/              # Datos demo
│   │   └── demoData.ts    # Perfiles de prueba
│   ├── App.tsx            # Router principal
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globales
├── supabase/
│   ├── migrations/        # Migraciones SQL
│   │   └── 001_initial_schema.sql
│   └── functions/         # Edge Functions
│       ├── create-checkout-session/
│       ├── stripe-webhook/
│       └── calculate-vibesync/
├── .env.example           # Variables de entorno ejemplo
├── DEPLOYMENT.md          # Guía de despliegue
├── README.md              # Este archivo
├── package.json           # Dependencias
├── tsconfig.json          # TypeScript config
└── vite.config.ts         # Vite config
```

---

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que aseguran:

- ✅ Usuarios solo pueden ver perfiles activos y no baneados
- ✅ Usuarios solo pueden editar su propio perfil
- ✅ Likes y matches solo son visibles para los participantes
- ✅ Mensajes solo son visibles para participantes de la conversación
- ✅ Notificaciones solo son visibles para el propietario
- ✅ Reportes pueden ser creados por cualquier usuario
- ✅ Bloqueos solo son gestionables por el propietario

### Autenticación

- ✅ Email + Password con verificación
- ✅ Google OAuth
- ✅ Apple Sign In
- ✅ Phone OTP (Twilio)
- ✅ Sesiones seguras con JWT
- ✅ Refresh tokens automáticos

### Pagos

- ✅ Stripe Checkout (PCI compliant)
- ✅ Webhook signature verification
- ✅ Idempotency keys
- ✅ Test mode para desarrollo

---

## 💳 Modelos de Suscripción

### Free
- 15 likes/día
- 3 super likes/semana
- Filtros básicos
- VibeSync básico

### Plus (€12.99/mes)
- Likes ilimitados
- 5 super likes/semana
- Ver quién te dio like
- Filtros avanzados
- Rewind
- Sin anuncios

### Elite (€24.99/mes)
- Todo en Plus
- 10 super likes/semana
- Prioridad en descubrimiento
- Perfil destacado
- Estadísticas del perfil
- 4 boosts/mes
- VibeSync avanzado

---

## 🧪 Testing

### Pruebas Manuales

1. **Autenticación**
   - Registro con email
   - Login con Google/Apple
   - Recuperación de contraseña

2. **Perfiles**
   - Crear perfil completo
   - Subir fotos
   - Editar información

3. **Descubrimiento**
   - Swipe izquierda/derecha
   - Super like
   - Filtros

4. **Matches**
   - Match automático
   - Ver matches
   - Iniciar chat

5. **Chat**
   - Enviar mensajes
   - Recibir en tiempo real
   - Typing indicators

6. **Premium**
   - Checkout con Stripe
   - Webhook processing
   - Cancelar suscripción

### Stripe Test Mode

Usa estas tarjetas para probar:
- **Éxito:** `4242 4242 4242 4242`
- **Rechazo:** `4000 0000 0000 0002`
- Fecha: cualquier fecha futura
- CVC: cualquier 3 dígitos

---

## 📊 Monitoreo

### Supabase Dashboard

- **Database:** Performance, queries, connections
- **Auth:** Users, login attempts
- **Logs:** Edge Functions errors
- **Realtime:** Active connections

### Stripe Dashboard

- **Payments:** Transactions, refunds
- **Subscriptions:** Active, cancelled, churn
- **Webhooks:** Delivery status

### Métricas Clave

- DAU/MAU (Daily/Monthly Active Users)
- Tasa de conversión Free → Premium
- Matches por día
- Mensajes enviados
- Retención de usuarios
- Churn rate
- Revenue per user

---

## 🚀 Despliegue

### Frontend

Opciones recomendadas:
- **Vercel** (recomendado) - https://vercel.com
- **Netlify** - https://netlify.com
- **Cloudflare Pages** - https://pages.cloudflare.com
- **Supabase Hosting** (beta) - Integrado con Supabase

### Backend

- **Supabase** - Todo incluido (DB, Auth, Storage, Functions)

### Guía Completa

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas paso a paso.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propietario y confidencial.

---

## 🆘 Soporte

- **Documentación:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Email:** support@nexora.app

---

## 🙏 Agradecimientos

- **Supabase** - Backend completo y fácil de usar
- **Stripe** - Procesamiento de pagos seguro
- **React Team** - Increíble librería UI
- **Tailwind CSS** - Framework CSS moderno
- **Framer Motion** - Animaciones fluidas

---

<div align="center">

**Hecho con ❤️ para conectar personas**

[NEXORA](#) © 2026

</div>
