'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import { signUp } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await signUp(
        formData.email, 
        formData.password,
        { full_name: formData.fullName }
      )
      
      if (authError) {
        // Check if error is about user already registered
        if (authError.message?.toLowerCase().includes('already') || 
            authError.message?.toLowerCase().includes('registered') ||
            authError.message?.toLowerCase().includes('exists')) {
          setError('This email is already registered. Please sign in instead.')
        } else {
          setError(authError.message)
        }
      } else {
        // Check if user was actually created (data.user should exist)
        if (!data?.user && !data?.session) {
          setError('Failed to create account. Please try again.')
          setLoading(false)
          return
        }
        
        // Check if user has a recovery_sent_at (indicates existing user who may need password reset)
        if (data?.user?.recovery_sent_at) {
          setError('This email is already registered. Please sign in or use forgot password to reset your password.')
          setLoading(false)
          return
        }
        
        // Check if identities array is empty (indicates existing user without identity)
        // New users should have an identity object in the array
        if (data?.user?.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please sign in instead.')
          setLoading(false)
          return
        }
        
        // Check if user was created more than 1 minute ago (indicates existing user)
        const userCreatedAt = new Date(data?.user?.created_at);
        const now = new Date();
        const timeDiff = (now - userCreatedAt) / 1000; // difference in seconds
        
        if (timeDiff > 60) {
          setError('This email is already registered. Please sign in instead.')
          setLoading(false)
          return
        }
        
        // If session exists, redirect to onboarding immediately
        // If session is null (email confirmation required), we show success state
        if (data?.session) {
          router.push('/onboarding')
        } else {
          setIsSuccess(true)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />
        
        <GlassCard className="max-w-lg w-full p-10 text-center space-y-8 relative z-10 border-transparent shadow-2xl">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-emerald-100 rounded-3xl flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/20">
              <Mail className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tight">Check Your Inbox!</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              We've sent a confirmation link to:
            </p>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-4 mx-4">
              <p className="text-primary-700 font-black text-lg break-all">{formData.email}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left space-y-3">
            <p className="text-amber-800 font-black text-sm uppercase tracking-wider flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Important Steps:
            </p>
            <ol className="space-y-3 text-gray-700 font-medium text-sm">
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">1</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">2</span>
                <span>Find the email from <strong>HealthBuddy</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">3</span>
                <span>Click the <strong>"Verify Email"</strong> button</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">4</span>
                <span>Check your <strong>spam folder</strong> if you don't see it within 2 minutes</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-gray-400 text-sm font-medium">
              After verifying, you'll be automatically redirected to complete your profile.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full h-14 rounded-2xl font-black italic shadow-xl shadow-primary-500/20" rightIcon={ArrowRight}>
                I've Verified My Email - Continue
              </Button>
            </Link>
            <p className="text-gray-400 text-xs">
              Didn't receive the email? Check your spam folder or try registering again.
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />
      
      <div className="max-w-md w-full space-y-10 relative z-10">
        <div className="space-y-4 text-center">
          <Link href="/" className="inline-flex items-center space-x-3 group mb-2">
            <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-linear-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent italic tracking-tight">
              HealthBuddy
            </span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Join the Community</h1>
          <p className="text-gray-500 font-medium">Create your secure medical profile and start tracking your wellness today.</p>
        </div>

        <GlassCard className="p-10 border-transparent shadow-2xl relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center italic">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            <Input
              label="FULL NAME"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              icon={User}
            />
            
            <Input
              label="EMAIL ADDRESS"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              icon={Mail}
            />
            
            <div className="relative">
              <Input
                label="SECURE PASSWORD"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                icon={Lock}
              />
              <button
                type="button"
                className="absolute right-4 top-9.5 text-gray-400 hover:text-primary-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <Input
              label="CONFIRM PASSWORD"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              icon={ShieldCheck}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl font-black italic shadow-xl shadow-primary-500/20"
                isLoading={loading}
                rightIcon={loading ? null : Sparkles}
              >
                {loading ? 'Securing Profile...' : 'Create My Free Account'}
              </Button>
            </div>
          </form>
        </GlassCard>
        
        <div className="flex flex-col items-center space-y-6">
          <p className="text-sm font-bold text-gray-500">
            Already a member?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-black italic ml-1">
              Sign in to Dashboard
            </Link>
          </p>
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Security Badge */}
      <div className="hidden lg:flex absolute bottom-10 left-10 items-center space-x-3 opacity-40">
        <ShieldCheck className="h-8 w-8 text-slate-400" />
        <div className="text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400">
          AES-256 <br /> Data Protection
        </div>
      </div>
    </div>
  )
}
