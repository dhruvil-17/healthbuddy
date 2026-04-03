# AI Health Assistant

Next.js 15 + Supabase + Google Gemini AI powered health companion app.

## ✨ Features

- **Personalized Health Tips** powered by Gemini AI (diet, exercise, mental health, preventive care)
- **User Profile Management** (age, gender, conditions, location-aware advice)
- **Symptom Checker** 
- **Medicine Reminders & Logs**
- **Nearby Facility Finder**
- **Protected Routes** with Supabase Auth
- **Responsive UI** with Tailwind/shadcn

## 🛠 Tech Stack

```
Frontend: Next.js 15 App Router + React
Auth: Supabase Auth (service role + RLS)
AI: Google Gemini 2.5 Flash
Database: Supabase Postgres
UI: Tailwind CSS + shadcn/ui components
Utils: TypeScript + ESLint + Prettier
Deployment: Vercel ready
```

## 🚀 Quick Start

1. **Clone & Install**
```bash
git clone <repo>
cd ai-health-assistant
npm install
```

2. **Environment Variables** (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
```

3. **Supabase Setup**
```
Tables needed: user_profiles, health_tips_history
RLS enabled on user_profiles (service role bypasses)
```

4. **Run Development**
```bash
npm run dev
# http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                 # App Router pages & API routes
│   ├── (auth)/         # Login/Onboarding
│   ├── (protected)/    # Profile, Health Tips pages
│   ├── api/
│   │   ├── health-tips/route.js     # AI tips generation
│   │   ├── symptom-checker/route.js
│   │   └── medicine-*/route.js
├── components/          # UI Components + shadcn
├── hooks/              # Custom React hooks (useProtectedProfile, useAuthUser)
├── lib/                # Supabase clients (client/server)
└── utils/              # Profile service, helpers
```

## 🔑 Key Implementation Details

### 1. **Service Role Profile Creation**
```
src/lib/server/server.ts - createServerClient(service role)
src/api/health-tips/profile-fix.js - get-or-create logic
```
Auto-creates minimal user_profiles bypassing RLS.

### 2. **Health Tips Generation Flow**
```
POST /api/health-tips → ensureProfile → Gemini AI → Save to DB
Categories: general|diet|exercise|mental|preventive
Personalized by age/gender/conditions/location
```

### 3. **Protected Routes**
```
useProtectedProfile.js - Client-side auth + profile check
ProtectedWrapper.jsx - Route guards
```

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health-tips` | POST | Generate AI health tips `{"userId": "...", "category": "diet"}` |
| `/api/health-tips` | GET  | Get user tip history `?userId=...&limit=10` |
| `/api/medicine-reminders` | POST | Create medicine reminder |
| `/api/symptom-checker` | POST | Analyze symptoms |

## ⚙️ Environment Setup

**Required Supabase Tables:**
```sql
-- user_profiles (id uuid primary, age int, gender text, existing_conditions jsonb[])
-- health_tips_history (user_id uuid, tips_data jsonb, category text)
```

**RLS Policy Example (user_profiles):**
```sql
-- Enable for authenticated users (service role bypasses)
CREATE POLICY "Users can view own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);
```

## 🎯 Usage

1. **Auth** → Login with Supabase
2. **Onboarding** → Complete profile (auto-created minimal if missing)
3. **Health Tips** → Select category → Get AI recommendations
4. **History** → View past generated tips

## 🔒 Security

- Service role key for admin ops (profile creation)
- RLS enabled on all tables
- Client-side anon key for reads only
- Protected routes with profile checks

## 🚀 Deployment (Vercel)

```
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel --prod
```

## 🤝 Contributing

1. Fork & PR
2. Follow TypeScript/ESLint rules
3. Test API endpoints
4. Update README for new features

## 📄 License

