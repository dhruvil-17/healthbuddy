# AI Health Assistant

Next.js 15 + Supabase + OpenRouter (GPT-4o-mini) powered health companion app.

## ✨ Features

- **Personalized Health Tips** powered by OpenRouter/GPT-4o-mini (diet, exercise, mental health, preventive care)
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
AI: OpenRouter with OpenAI GPT-4o-mini
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
OPENROUTER_API_KEY=your_openrouter_key
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
POST /api/health-tips → ensureProfile → OpenRouter/GPT-4o-mini → Save to DB
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

## � User Workflow Documentation

### First-Time User Journey

#### 1. **Registration & Authentication**
```
1. Visit landing page (/)
2. Click "Start Monitoring Free" or "Register"
3. Sign up using email/password (Supabase Auth)
4. Email verification (if enabled)
5. Redirect to onboarding
```

#### 2. **Profile Onboarding**
```
1. Complete user profile form:
   - Age (number)
   - Gender (male/female/other)
   - Location (city/region)
   - Preferred language
   - Emergency contact name & phone
   - Existing medical conditions (optional)
2. Submit profile
3. Redirect to dashboard
```

#### 3. **Dashboard Overview**
```
Upon login, user sees:
- Total symptom check reports
- Active medicine reminders count
- Medication adherence rate (today)
- Latest health tip
- Quick access to all features
```

### Daily Usage Workflows

#### **Symptom Checker Workflow**
```
1. Navigate to Symptom Checker (/symptom-checker)
2. Describe symptoms in text input
3. Click "Analyze Symptoms"
4. AI analyzes symptoms and provides:
   - Severity assessment (low/medium/high)
   - Possible conditions
   - Recommended actions
   - Warning signs to watch
5. View result in modal/card
6. Result automatically saved to history
7. View past analyses in History section (infinite scroll)
```

#### **Health Tips Workflow**
```
1. Navigate to Health Tips (/health-tips)
2. Select category:
   - General Tips
   - Diet & Nutrition
   - Exercise Guidelines
   - Mental Health
   - Preventive Care
3. Click "Generate Tips"
4. AI generates personalized recommendations based on:
   - User's age & gender
   - Existing conditions
   - Location (regional considerations)
5. View recommendations in categorized cards
6. Tips saved to history automatically
7. View past tips in History section
```

#### **Medicine Reminders Workflow**

**Creating Reminders:**
```
1. Navigate to Reminders (/reminders)
2. Click "Add Reminder"
3. Fill in:
   - Medicine name
   - Dosage
   - Times (multiple times per day)
   - Start date
   - End date (optional)
4. Set frequency (daily/weekly)
5. Click "Save"
```

**Daily Medicine Tracking:**
```
1. View today's scheduled medicines on Reminders page
2. For each medicine:
   - Click "Taken" when consumed
   - Click "Missed" if skipped
   - Click "Skipped" if intentionally skipped
   - Add optional notes
3. View adherence rate on dashboard
4. View medication logs in History section
```

**Editing/Deleting Reminders:**
```
1. Navigate to Reminders (/reminders)
2. Click on reminder card
3. Edit details or click "Delete"
4. Confirm deletion
```

#### **Facility Finder Workflow**
```
1. Navigate to Facility Finder (/find-facility)
2. Enter city name
3. Select facility type (optional):
   - Hospital
   - Clinic
   - Pharmacy
   - Diagnostic Center
   - All
4. Set search radius (default: 10km)
5. Click "Search"
6. View results sorted by:
   - Emergency services (first)
   - Rating (highest first)
   - Name (alphabetical)
7. Scroll for more results (infinite scroll)
8. Click on facility to view details
9. View past searches in Search History
```

#### **Emergency SOS Workflow**
```
1. Click SOS button (available on multiple pages)
2. System sends emergency alert to:
   - Emergency contacts from profile
   - Pre-configured emergency services
3. SMS sent via Twilio (if configured)
4. Toast notification confirms SOS activation
5. Contact receives message with:
   - User's name
   - Emergency nature
   - Location (if available)
```

### Profile Management Workflow

#### **Updating Profile**
```
1. Navigate to Profile (/profile)
2. Edit any field:
   - Age
   - Gender
   - Location
   - Emergency contact
   - Existing conditions
3. Click "Save Changes"
4. Changes update AI recommendations automatically
```

#### **Viewing History**
```
1. Navigate to respective feature page
2. Scroll to History section
3. View past entries with:
   - Timestamp
   - Key details
   - Status (for medicines)
4. Use infinite scroll to load more
```

### Navigation Flow

```
Landing Page
├── Unauthenticated: Shows landing page
├── Authenticated: Redirects to dashboard
└── Auth Flow:
    ├── Register → Onboarding → Dashboard
    ├── Login → Dashboard
    └── Forgot Password → Reset → Login

Dashboard
├── Symptom Checker → AI Analysis → History
├── Health Tips → Category Selection → AI Tips → History
├── Reminders → Create/Edit → Daily Tracking → History
├── Facility Finder → Search → Results → Details
├── Profile → Edit → Save
└── Emergency SOS → Alert Sent → Confirmation
```

### Error Handling Workflows

#### **Authentication Errors**
```
- Invalid credentials: Show error message
- Session expired: Redirect to login
- Network error: Show retry option
```

#### **AI Service Errors**
```
- OpenRouter API timeout: Show "Service unavailable" message
- Invalid input: Show validation error
- Rate limit exceeded: Show "Try again later" message
```

#### **Database Errors**
```
- Profile save failed: Show error, offer retry
- Reminder creation failed: Show error
- History fetch failed: Show error, offer refresh
```

### Mobile Responsiveness

All features work on:
- Desktop (1024px+)
- Tablet (768px-1023px)
- Mobile (<768px)

Mobile-specific adaptations:
- Bottom navigation bar
- Touch-optimized buttons
- Swipe gestures for history
- Simplified layouts for small screens

## �� Security

- Service role key for admin ops (profile creation)
- RLS enabled on all tables
- Client-side anon key for reads only
- Protected routes with profile checks

## 🚀 Deployment (Vercel)

```
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENROUTER_API_KEY
vercel --prod
```

## 🤝 Contributing

1. Fork & PR
2. Follow TypeScript/ESLint rules
3. Test API endpoints
4. Update README for new features

## 📄 License

