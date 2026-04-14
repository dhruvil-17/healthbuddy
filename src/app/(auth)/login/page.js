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
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Activity,
  AlertCircle
} from 'lucide-react'
import { signIn } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await signIn(email, password)
      
      if (authError) {
        setError(authError.message)
      } else {
        // middleware handles redirection once cookies are set
        // but it's good to trigger it now
        router.refresh()
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent italic tracking-tight">
              HealthBuddy
            </span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Signing in to your private healthcare dashboard.</p>
        </div>

        <GlassCard className="p-10 border-transparent shadow-2xl relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center italic">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                {error}
              </div>
            )}
            
            <Input
              label="EMAIL ADDRESS"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              icon={Mail}
            />
            
            <div className="relative">
              <Input
                label="SECURE PASSWORD"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                icon={Lock}
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-primary-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl font-black italic shadow-xl shadow-primary-500/20"
                isLoading={loading}
                rightIcon={loading ? null : ArrowRight}
              >
                {loading ? 'Authenticating...' : 'Sign in to Account'}
              </Button>
            </div>
          </form>
        </GlassCard>
        
        <div className="flex flex-col items-center space-y-6">
          <p className="text-sm font-bold text-gray-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-black italic ml-1">
              Join for Free
            </Link>
          </p>
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Security Status */}
      <div className="hidden lg:flex absolute bottom-10 right-10 items-center space-x-3 opacity-40">
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400">
            End-to-End <br /> Encrypted
          </div>
        </div>
        <Activity className="h-8 w-8 text-slate-400" />
      </div>
    </div>
  )
}