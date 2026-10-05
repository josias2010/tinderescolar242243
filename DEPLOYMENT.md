# NEXORA - Guía Completa de Despliegue

## 🚀 Arquitectura Técnica

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS + Framer Motion
- React Router
- Supabase Client

**Backend:**
- Supabase (Backend-as-a-Service)
  - PostgreSQL (Base de datos)
  - Authentication (Email, Google, Apple, Phone OTP)
  - Storage (Avatars, Photos)
  - Realtime (Chat, Notifications)
  - Edge Functions (Stripe, VibeSync)

**Pagos:**
- Stripe (Suscripciones, pagos únicos)

---

## 📋 Requisitos Previos

1. **Node.js** 18+ instalado
2. **Cuenta de Supabase** (https://supabase.com)
3. **Cuenta de Stripe** (https://stripe.com)
4. **Git** instalado

---

## 🔧 Paso 1: Configurar Supabase

### 1.1 Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Click en "New Project"
3. Configura:
   - **Name:** `nexora`
   - **Database Password:** (guárdala en un lugar seguro)
   - **Region:** Elige la más cercana a tus usuarios
   - **Pricing Plan:** Free (para empezar)

4. Espera a que el proyecto se inicialice (2-3 minutos)

### 1.2 Ejecutar migraciones de base de datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia el contenido de `supabase/migrations/001_initial_schema.sql`
3. Pégalo en el editor y click en **Run**
4. Verifica que todas las tablas se crearon correctamente en **Table Editor**

### 1.3 Configurar Authentication

1. Ve a **Authentication > Providers**
2. Configura los proveedores:

#### Email (ya viene configurado)
- Enable: ✅
- Confirm email: ✅

#### Google OAuth
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo o usa uno existente
3. Ve a **APIs & Services > Credentials**
4. Click en **Create Credentials > OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
7. Copia **Client ID** y **Client Secret**
8. En Supabase, ve a **Authentication > Providers > Google**
9. Pega el Client ID y Client Secret
10. Enable: ✅

#### Apple OAuth
1. Ve a https://developer.apple.com/account/
2. Crea un App ID con Sign in with Apple capability
3. Crea a Service ID
4. Registra un Key con Sign in with Apple enabled
5. En Supabase, ve a **Authentication > Providers > Apple**
6. Configura:
   - Apple ID
   - Team ID
   - Key ID
   - Private Key (el archivo .p8)
7. Enable: ✅

#### Phone (SMS OTP)
1. Ve a https://console.twilio.com/
2. Crea una cuenta gratuita
3. Copia **Account SID**, **Auth Token**, y **Phone Number**
4. En Supabase, ve a **Authentication > Providers > Phone**
5. Pega las credenciales de Twilio
6. Enable: ✅

### 1.4 Configurar Storage

1. Ve a **Storage**
2. Crea dos buckets:
   - **avatars** (Public: ✅)
   - **photos** (Public: ✅)
3. Las políticas RLS ya están configuradas en el SQL

### 1.5 Obtener credenciales

1. Ve a **Settings > API**
2. Copia:
   - **Project URL:** `https://YOUR_PROJECT_ID.supabase.co`
   - **anon public key:** `eyJhbGc...`

---

## 💳 Paso 2: Configurar Stripe

### 2.1 Crear productos en Stripe

1. Ve a https://dashboard.stripe.com/
2. Ve a **Products**
3. Crea los siguientes productos:

#### NEXORA Plus
- **Name:** NEXORA Plus
- **Description:** Plan Plus de NEXORA
- **Pricing model:** Recurring
- **Price:** €12.99/month
- Crea también:
  - €34.99/quarter (€9.99/month)
  - €95.99/year (€7.99/month)

#### NEXORA Elite
- **Name:** NEXORA Elite
- **Description:** Plan Elite de NEXORA
- **Pricing:** €24.99/month
- Crea también:
  - €59.99/quarter (€19.99/month)
  - €179.99/year (€14.99/month)

4. Copia los **Price IDs** de cada plan

### 2.2 Configurar Webhooks

1. Ve a **Developers > Webhooks**
2. Click en **Add endpoint**
3. Endpoint URL:
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copia el **Signing secret**

### 2.3 Obtener API Keys

1. Ve a **Developers > API keys**
2. Copia:
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

---

## 🌐 Paso 3: Configurar Variables de Entorno

### 3.1 Frontend (.env)

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe (solo publishable key en frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=NEXORA
```

### 3.2 Supabase Edge Functions

1. Ve a **Settings > Secrets** en Supabase
2. Agrega los siguientes secrets:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=https://your-domain.com
```

---

## 🚀 Paso 4: Desplegar Edge Functions

### 4.1 Instalar Supabase CLI

```bash
npm install -g supabase
```

### 4.2 Login en Supabase

```bash
supabase login
```

### 4.3 Vincular proyecto

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

### 4.4 Desplegar funciones

```bash
# Función de checkout
supabase functions deploy create-checkout-session

# Función de webhook
supabase functions deploy stripe-webhook

# Función de VibeSync
supabase functions deploy calculate-vibesync
```

---

## 🏗️ Paso 5: Construir y Desplegar Frontend

### 5.1 Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre http://localhost:5173

### 5.2 Build para producción

```bash
npm run build
```

Los archivos estarán en `dist/`

### 5.3 Desplegar en Supabase (recomendado)

1. Ve a **Hosting** en Supabase (beta)
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy

### 5.4 Alternativas de hosting

- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **Cloudflare Pages:** https://pages.cloudflare.com

---

## 🧪 Paso 6: Probar la Aplicación

### 6.1 Crear usuario de prueba

1. Abre la aplicación
2. Click en "Crear cuenta"
3. Usa un email de prueba
4. Completa el onboarding

### 6.2 Probar funcionalidades

- ✅ Registro e inicio de sesión
- ✅ Subir fotos de perfil
- ✅ Descubrir perfiles
- ✅ Dar like / super like
- ✅ Match automático
- ✅ Chat en tiempo real
- ✅ Notificaciones
- ✅ Favoritos
- ✅ Reportar / Bloquear
- ✅ Suscripción Premium (con Stripe test mode)

### 6.3 Stripe Test Mode

Usa estas tarjetas de prueba:
- **Éxito:** `4242 4242 4242 4242`
- **Rechazo:** `4000 0000 0000 0002`
- Cualquier fecha futura, cualquier CVC, cualquier código postal

---

## 📊 Paso 7: Panel de Administración

### 7.1 Crear usuario admin

1. Registra un usuario normalmente
2. En Supabase, ve a **SQL Editor**
3. Ejecuta:

```sql
INSERT INTO admin_users (id, role, is_active)
VALUES ('USER_UUID_HERE', 'super_admin', true);
```

Reemplaza `USER_UUID_HERE` con el UUID del usuario (lo encuentras en **Authentication > Users**)

### 7.2 Acceder al panel admin

1. Inicia sesión con el usuario admin
2. Ve a `/admin`
3. Ahora tienes acceso completo al panel de administración

---

## 🔒 Paso 8: Seguridad y Producción

### 8.1 Checklist de seguridad

- ✅ RLS (Row Level Security) habilitado en todas las tablas
- ✅ Variables de entorno seguras
- ✅ Stripe en modo test para pruebas
- ✅ Webhook signature verification
- ✅ CORS configurado correctamente
- ✅ Rate limiting en Edge Functions
- ✅ Backup automático de base de datos (Supabase lo hace)

### 8.2 Monitoreo

1. **Supabase Dashboard:**
   - Database > Performance
   - Logs > Edge Functions
   - Auth > Users

2. **Stripe Dashboard:**
   - Payments
   - Subscriptions
   - Webhooks

3. **Errores:**
   - Configura Sentry o similar para tracking de errores

### 8.3 Escalabilidad

- **Supabase Pro:** $25/month (8GB database, 250MB file storage)
- **Supabase Team:** $599/month (unlimited everything)
- **Stripe:** 2.9% + 30¢ por transacción

---

## 📱 Paso 9: PWA (Progressive Web App)

### 9.1 Configurar manifest

Edita `public/manifest.json`:

```json
{
  "name": "NEXORA",
  "short_name": "NEXORA",
  "description": "Conecta con quien realmente encaja contigo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f1a",
  "theme_color": "#6C3AED",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 9.2 Generar iconos

Usa https://realfavicongenerator.net/ para generar iconos para todos los dispositivos

---

## 🎯 Paso 10: Lanzamiento

### 10.1 Pre-lanzamiento

- [ ] Pruebas exhaustivas en múltiples dispositivos
- [ ] Optimización de imágenes
- [ ] SEO configurado
- [ ] Términos y condiciones
- [ ] Política de privacidad
- [ ] GDPR compliance (si aplica en Europa)

### 10.2 Lanzamiento

1. Cambia Stripe a **Live Mode**
2. Actualiza las API keys en producción
3. Configura dominio personalizado
4. Configura email transaccional (SendGrid, Mailgun)
5. Monitorea métricas clave:
   - Usuarios registrados
   - Tasa de conversión Free → Premium
   - Matches por día
   - Mensajes enviados
   - Ingresos

### 10.3 Marketing

- Product Hunt launch
- Social media campaigns
- Influencer partnerships
- Content marketing
- Referral program

---

## 🆘 Soporte y Recursos

### Documentación

- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **React:** https://react.dev
- **Tailwind:** https://tailwindcss.com

### Comunidad

- **Supabase Discord:** https://discord.supabase.com
- **Stripe Discord:** https://stripe.com/community

---

## 📝 Notas Importantes

1. **Costos estimados (startup):**
   - Supabase Free: $0
   - Stripe: 2.9% + 30¢ por transacción
   - Hosting (Vercel/Netlify): $0-20/month
   - **Total inicial:** ~$20/month

2. **Costos estimados (escala):**
   - Supabase Pro: $25/month
   - Stripe: 2.9% + 30¢ por transacción
   - Hosting: $20-50/month
   - **Total escala:** ~$50-100/month

3. **Tiempo de desarrollo:**
   - Setup inicial: 2-3 horas
   - Personalización: 1-2 semanas
   - Testing: 1 semana
   - **Total:** 2-3 semanas

---

## ✅ Checklist Final

- [ ] Supabase configurado
- [ ] Base de datos migrada
- [ ] Authentication configurado (Email, Google, Apple, Phone)
- [ ] Storage configurado
- [ ] Stripe configurado
- [ ] Edge Functions desplegadas
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado
- [ ] PWA configurada
- [ ] Admin user creado
- [ ] Pruebas completadas
- [ ] Monitoreo configurado
- [ ] Términos legales listos
- [ ] **¡Listo para lanzar!** 🚀

---

**¿Necesitas ayuda?**

Revisa la documentación de Supabase o contacta al soporte técnico.
