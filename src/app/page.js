"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle,
  Heart, 
  Shield, 
  Users, 
  Stethoscope, 
  Pill, 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Loader2
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user && !user.is_anonymous);
        
        if (!!user && !user.is_anonymous) {
          // User is authenticated, redirect to dashboard
          router.push("/dashboard");
        } else {
          // User is not authenticated, show landing page
          setLoading(false);
          setIsVisible(true);
        }
      } catch (error) {
        // If there's an error, show landing page
        setLoading(false);
        setIsVisible(true);
      }
    };
    
    checkAuth();
  }, [router]);

  // Show loader while checking authentication
  if (loading) {
    return (
      <Loader/>
    );
  }

  const features = [
    {
      icon: Stethoscope,
      title: "AI Symptom Checker",
      description: "Get instant AI-powered insights for your symptoms with personalized guidance.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Facility Finder",
      description: "Locate professional healthcare facilities near your immediate location.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Pill,
      title: "Medicine Reminders",
      description: "Smart tracking and timely alerts for your medication schedules.",
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary-200/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-accent-200/20 rounded-full blur-[100px] animate-glow" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-emerald-200/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-nav h-20 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent italic">
            HealthBuddy
          </span>
        </div>

        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button>Get Started</Button>
              </Link>
              <Link href="/register" className="block sm:hidden">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="primary" className="py-2 px-4">
              <Sparkles className="h-4 w-4 mr-2 text-primary-500 animate-pulse" />
              Revolutionizing Community Healthcare
            </Badge>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Your AI Powered <br />
              <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-emerald-500 bg-clip-text text-transparent">
                Health Companion
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Empowering communities with professional healthcare insights, 
              facility location, and smart medication tracking—all accessible in one premium platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-10" rightIcon={ArrowRight}>
                  Start Monitoring Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 text-lg px-10">
                  Explore Tools
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-6 pt-6">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-2xl border-4 border-white bg-primary-100 overflow-hidden shadow-sm relative flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">AI-Powered Health Monitoring</p>
                <p className="text-xs text-gray-500">Symptom analysis • Medicine reminders • Emergency SOS</p>
              </div>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm aspect-square">
              <Image
                src="/images/hero_bg.png"
                alt="HealthBuddy AI-powered healthcare monitoring dashboard showing symptom analysis, medicine reminders, and emergency SOS features"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            
            {/* Floating UI Elements */}
            <GlassCard className="absolute -top-10 -right-10 w-48 animate-float hidden md:block" hover={false}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="font-bold text-sm">Verified</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Medical data encrypted and secured.</p>
            </GlassCard>

            <GlassCard className="absolute -bottom-10 -left-10 w-56 animate-float hidden md:block" hover={false} style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="font-bold text-sm">Real-time</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-primary-500 rounded-full animate-pulse" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">System Health: 99.9%</p>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 sm:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto text-center mb-20 space-y-4">
          <Badge variant="info">Our Core Capabilities</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Designed for <span className="text-primary-600">Your Wellness</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Powerful features built to provide professional healthcare assistance to everyone, everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <GlassCard key={i} className="group cursor-pointer p-10 bg-slate-50/50 hover:bg-white border-transparent hover:border-primary-100">
              <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">{f.description}</p>
              <div className="mt-8 flex items-center text-primary-600 font-bold group-hover:translate-x-2 transition-transform"
              onClick={() => {router.push("/register")}} >
                Learn more <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold italic tracking-tight">HealthBuddy</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Making professional healthcare accessible and affordable for underserved communities worldwide through the power of AI.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-300">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/symptom-checker" className="hover:text-white transition-colors">Symptom Checker</Link></li>
                <li><Link href="/find-facility" className="hover:text-white transition-colors">Facility Finder</Link></li>
                <li><Link href="/reminders" className="hover:text-white transition-colors">Medication Tracker</Link></li>
                <li><Link href="/health-tips" className="hover:text-white transition-colors">Health Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-300">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              <strong className="text-slate-400">Medical Disclaimer:</strong> HealthBuddy is an AI-powered tool designed for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor or emergency services immediately.
            </p>
            <p className="text-slate-500 text-xs text-center">
              © 2026 HealthBuddy AI Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}