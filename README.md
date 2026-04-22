# 🏥 AI Health Assistant

<div align="center">

![AI Health Assistant](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Your Personal AI-Powered Health Companion**

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

<div align="center">

🤖 **AI-powered health insights** | 📊 **Medicine reminders** | 🏥 **Facility finder** | 🚨 **Emergency SOS**

</div>

---

## 📖 Overview

AI Health Assistant is a modern, full-stack healthcare application powered by Next.js 16, Supabase, and OpenAI's GPT-4o-mini. It provides personalized health recommendations, medication tracking, symptom analysis, and emergency assistance - all in one beautiful, responsive interface.

## ✨ Features

### 🤖 AI-Powered Health Insights
- **Personalized Health Tips** - AI-generated recommendations for diet, exercise, mental health, and preventive care
- **Symptom Checker** - Analyze symptoms with AI and receive severity assessments and recommended actions
- **Location-Aware Advice** - Health tips tailored to your region and local conditions

### 📊 Health Management
- **Medicine Reminders** - Create, track, and manage medication schedules with daily reminders
- **Medication Logs** - Track adherence, missed doses, and view medication history
- **Adherence Tracking** - Monitor your medication compliance rates over time

### 🏥 Emergency & Location Services
- **Facility Finder** - Find nearby hospitals, clinics, pharmacies, and diagnostic centers
- **Emergency SOS** - One-tap emergency alert to contacts and emergency services
- **Twilio Integration** - SMS notifications for emergency alerts (configurable)

### 🔐 Security & Authentication
- **Supabase Auth** - Secure authentication with email/password
- **Forgot Password** - Self-service password reset via email
- **Change Password** - Update password while logged in
- **Protected Routes** - All sensitive pages require authentication
- **Row Level Security** - Database-level access control

### 🎨 User Experience
- **Responsive Design** - Beautiful UI that works on desktop, tablet, and mobile
- **Glass Morphism UI** - Modern glass-card design with Tailwind CSS
- **Dark/Light Mode** - Theme support (coming soon)
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Turbopack
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide Icons** - Modern icon library
- **Sonner** - Toast notification library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication (Email/Password)
  - Row Level Security (RLS)
  - Real-time subscriptions
- **Next.js API Routes** - Serverless API endpoints

### AI & Services
- **OpenRouter** - AI API gateway
- **GPT-4o-mini** - OpenAI's efficient AI model
- **Twilio** - SMS service for emergency alerts (optional)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Vercel** - Deployment platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase project ([Create free account](https://supabase.com))
- An OpenRouter API key ([Get free key](https://openrouter.ai))
- (Optional) Twilio account for SMS alerts

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-health-assistant.git
cd ai-health-assistant
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# (Optional) Twilio Configuration for SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Supabase Database Setup

Run the SQL migration files in the `supabase/migrations/` directory:

```sql
-- Create user_profiles table
-- Create medicine_reminders table
-- Create medicine_logs table
-- Create health_tips_history table
-- Enable Row Level Security
-- Create performance indexes
```

Or use the Supabase Dashboard SQL Editor to run the migrations manually.

### 4. Configure Supabase Auth

In your Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (or your production URL)
3. Add to **Redirect URLs**:
   - `http://localhost:3000/**`
   - `http://localhost:3000/reset-password`
   - `http://localhost:3000/auth/callback`
4. Set **Email Confirmation Redirect URL**: `http://localhost:3000/auth/callback` (or your production URL)

**Note:** The `/auth/callback` route handles email verification and redirects users to the dashboard after successful verification.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Account

1. Click "Register" on the landing page
2. Fill in your email and password
3. Complete your profile onboarding
4. Start exploring the dashboard!

## 📁 Project Structure

```
ai-health-assistant/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                    # Authentication pages
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Registration page
│   │   │   └── forgot-password/      # Password reset request
│   │   ├── (protected)/              # Protected routes (require auth)
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── health-tips/          # AI health tips
│   │   │   ├── symptom-checker/      # Symptom analysis
│   │   │   ├── reminders/            # Medicine reminders
│   │   │   ├── find-facility/        # Facility finder
│   │   │   ├── profile/              # User profile
│   │   │   └── change-password/      # Change password (authenticated)
│   │   ├── reset-password/          # Password reset (from email link)
│   │   ├── contact/                  # Contact form
│   │   ├── page.js                   # Landing page
│   │   ├── layout.js                 # Root layout
│   │   └── api/                      # API routes
│   │       ├── health-tips/          # AI tips generation
│   │       ├── symptom-checker/      # Symptom analysis
│   │       ├── medicine-reminders/   # Medicine reminder CRUD
│   │       ├── medicine-logs/         # Medicine log tracking
│   │       ├── find-facility/        # Facility search
│   │       ├── sos/                  # Emergency SOS
│   │       ├── forgot-password/      # Password reset request
│   │       ├── change-password/      # Password change (authenticated)
│   │       └── reset-password/       # Password reset (from email)
│   ├── components/                    # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── ErrorBoundary.jsx         # Error boundary
│   │   └── ProfileEditPage.jsx       # Profile editing
│   ├── hooks/                        # Custom React hooks
│   │   ├── useProtectedProfile.js    # Auth + profile check
│   │   ├── useProtectedUser.js       # Auth check only
│   │   └── useSOS.js                 # SOS dispatch logic
│   ├── lib/                          # Utility libraries
│   │   ├── supabase-client.js        # Client-side Supabase
│   │   ├── supabase-server.js        # Server-side Supabase
│   │   └── auth.js                   # Auth utilities
│   └── utils/                        # Helper functions
│       ├── profileService.js         # Profile CRUD operations
│       └── smsService.js             # SMS utilities (optional)
├── supabase/
│   └── migrations/                   # Database migrations
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
├── next.config.js                    # Next.js configuration
└── README.md                         # This file
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

## 🔌 API Endpoints

### Health Tips
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health-tips` | POST | Generate AI health tips `{"userId": "...", "category": "diet"}` |
| `/api/health-tips` | GET | Get user tip history `?userId=...&limit=10` |

### Symptom Checker
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/symptom-checker` | POST | Analyze symptoms with AI `{"userId": "...", "symptoms": "..."}` |

### Medicine Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/medicine-reminders` | POST | Create medicine reminder |
| `/api/medicine-reminders` | GET | Get user reminders `?userId=...` |
| `/api/medicine-reminders/[id]` | PUT | Update reminder |
| `/api/medicine-reminders/[id]` | DELETE | Delete reminder |
| `/api/medicine-logs` | POST | Log medicine intake |
| `/api/medicine-logs` | GET | Get medication logs `?userId=...` |

### Facility Finder
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/find-facility` | POST | Search nearby facilities `{"city": "...", "type": "hospital"}` |

### Emergency
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sos` | POST | Send emergency SOS alert |

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/forgot-password` | POST | Request password reset email |
| `/api/reset-password` | POST | Reset password from email link |
| `/api/change-password` | POST | Change password (authenticated) |

### Dashboard
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Get dashboard statistics `?userId=...` |

## ⚙️ Environment Setup

### Required Supabase Tables

```sql
-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  location TEXT,
  preferred_language TEXT DEFAULT 'English',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  existing_conditions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medicine Reminders
CREATE TABLE medicine_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  times TEXT[] NOT NULL,
  frequency TEXT DEFAULT 'daily',
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medicine Logs
CREATE TABLE medicine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES medicine_reminders(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'taken', 'missed', 'skipped'
  notes TEXT,
  log_date DATE NOT NULL,
  log_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Health Tips History
CREATE TABLE health_tips_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tips_data JSONB NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tips_history ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can create profiles" ON user_profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Medicine Reminders Policies
CREATE POLICY "Users can view own reminders" ON medicine_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders" ON medicine_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON medicine_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON medicine_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Medicine Logs Policies
CREATE POLICY "Users can view own logs" ON medicine_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own logs" ON medicine_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health Tips History Policies
CREATE POLICY "Users can view own tips" ON health_tips_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tips" ON health_tips_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🎯 Usage

### Getting Started

1. **Register** - Create an account with email and password
2. **Complete Profile** - Fill in your health information for personalized recommendations
3. **Explore Dashboard** - View your health overview and quick actions

### Daily Workflow

**Health Tips**
- Navigate to Health Tips page
- Select a category (Diet, Exercise, Mental Health, Preventive)
- Click "Generate Tips" to get AI-powered recommendations
- Tips are automatically saved to your history

**Medicine Reminders**
- Go to Reminders page
- Click "Add Reminder" to create a new medication schedule
- Set medicine name, dosage, times, and frequency
- Track your daily intake (Taken/Missed/Skipped)
- View adherence rates on the dashboard

**Symptom Checker**
- Describe your symptoms in the Symptom Checker
- AI analyzes severity and provides recommendations
- Results are saved to your history for reference

**Facility Finder**
- Search for nearby hospitals, clinics, or pharmacies
- Filter by facility type and distance
- Get directions and contact information

**Emergency SOS**
- One-tap emergency alert from any page
- Sends SMS to your emergency contacts
- Includes your location (if available)
- Rate limited to prevent abuse

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

## 🔒 Security

### Authentication
- **Supabase Auth** - Secure email/password authentication
- **Session Management** - Automatic token refresh and session validation
- **Protected Routes** - Middleware-based route protection
- **Password Reset** - Secure password reset flow with email verification

### Data Security
- **Row Level Security (RLS)** - Database-level access control
- **Service Role Key** - Used only for server-side operations
- **Anon Key** - Limited client-side access
- **Environment Variables** - Sensitive data stored in environment variables

### API Security
- **Rate Limiting** - SOS endpoint rate limited (1 request per minute per user)
- **Input Validation** - All inputs validated before processing
- **Error Handling** - Generic error messages to prevent information leakage
- **HTTPS** - All API routes use HTTPS in production

### Best Practices
- Never commit `.env.local` files
- Rotate API keys regularly
- Use strong passwords
- Enable email verification in production
- Review audit logs in Supabase dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Set Environment Variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENROUTER_API_KEY
vercel env add NEXT_PUBLIC_BASE_URL
```

4. **Deploy**
```bash
vercel --prod
```

### Environment Variables for Production

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_production_openrouter_key

# (Optional) Twilio Configuration
TWILIO_ACCOUNT_SID=your_production_twilio_sid
TWILIO_AUTH_TOKEN=your_production_twilio_token
TWILIO_PHONE_NUMBER=your_production_twilio_number

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### Post-Deployment Checklist

- [ ] Update Supabase Auth redirect URLs
- [ ] Enable email verification in Supabase
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and error tracking
- [ ] Test all authentication flows
- [ ] Verify API endpoints are working
- [ ] Test password reset functionality

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/yourusername/ai-health-assistant.git
cd ai-health-assistant
```
3. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```
4. Install dependencies:
```bash
npm install
```
5. Set up your `.env.local` file
6. Make your changes
7. Test thoroughly
8. Commit and push:
```bash
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```
9. Create a Pull Request

### Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write clear, descriptive commit messages
- Add tests for new features
- Update the README if needed
- Ensure all API endpoints are tested
- Check for accessibility issues

### Reporting Issues

If you find a bug or have a suggestion:

1. Check existing issues first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com) - Backend-as-a-Service
- [OpenAI](https://openai.com) - AI model provider
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Lucide](https://lucide.dev) - Icon library

## � Support

- 📧 Email: support@yourdomain.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/ai-health-assistant/issues)
- 💡 Feature requests: [GitHub Discussions](https://github.com/yourusername/ai-health-assistant/discussions)

---

<div align="center">

**Made with ❤️ by [Your Name]**

[⬆ Back to Top](#-ai-health-assistant)

</div>
