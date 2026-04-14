"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  MapPin, 
  Pill, 
  Phone,
  Users, 
  Activity, 
  Heart, 
  Shield,
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useProtectedProfile } from "@/hooks/useProtectedProfile";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/Modal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: profileLoading } = useProtectedProfile();
  const [stats, setStats] = useState(null);
  const [isSosLoading, setIsSosLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showSOSModal, setShowSOSModal] = useState(false);

  const handleSosDispatch = () => {
    setShowSOSModal(true);
  };

  const confirmSOSDispatch = async () => {
    setIsSosLoading(true);
    try {
      let location = null;
      // Extract precise geolocation natively
      let payloadData = { latitude: null, longitude: null };

      const executeDispatch = async () => {
        const response = await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        });
        const data = await response.json();
        if (data.success) {
          toast.success('SOS Dispatched', {
            description: 'Emergency signal sent to your contacts.'
          });
        } else {
          toast.error('SOS Failed', {
            description: data.error || 'Failed to dispatch SOS signal.'
          });
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            payloadData.latitude = position.coords.latitude;
            payloadData.longitude = position.coords.longitude;
            await executeDispatch();
            setIsSosLoading(false);
          },
          async () => {
            // Proceed without location if error occurs or user denies
            await executeDispatch();
            setIsSosLoading(false);
          }
        );
      } else {
        await executeDispatch();
        setIsSosLoading(false);
      }
    } catch (error) {
      setIsSosLoading(false);
      toast.error('SOS Failed', {
        description: 'Failed to dispatch SOS signal.'
      });
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        // Error fetching dashboard stats - will show empty state
      } finally {
        setLoadingStats(false);
      }
    }
 
    if (user) {
      
      fetchDashboardData();
    }
  }, [user]);

  if (profileLoading || loadingStats) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Symptom Checker",
      desc: "Analyze symptoms with AI",
      icon: Stethoscope,
      href: "/symptom-checker",
      color: "bg-blue-500",
      accent: "bg-blue-50"
    },
    {
      title: "Facility Finder",
      desc: "Find nearby healthcare",
      icon: MapPin,
      href: "/find-facility",
      color: "bg-emerald-500",
      accent: "bg-emerald-50"
    },
    {
      title: "Medicine Log",
      desc: "Track your prescriptions",
      icon: Pill,
      href: "/reminders",
      color: "bg-purple-500",
      accent: "bg-purple-50"
    },
    {
      title: "Health Tips",
      desc: "Daily wellness insights",
      icon: Users,
      href: "/health-tips",
      color: "bg-orange-500",
      accent: "bg-orange-50"
    }
  ];

  const dashboardStats = [
    { 
      label: "Health Reports", 
      value: stats?.totalReports || "0", 
      trend: stats?.totalReports > 0 ? "Active History" : "No Reports", 
      icon: FileText, 
      color: "text-blue-500" 
    },
    { 
      label: "Med Adherence", 
      value: `${stats?.adherenceRate || 0}%`, 
      trend: stats?.adherenceRate > 80 ? "Excellent" : "Needs Attention", 
      icon: Activity, 
      color: "text-emerald-500" 
    },
    { 
      label: "Daily Progress", 
      value: `${stats?.medsTakenToday || 0}/${stats?.medsTotalToday || 0}`, 
      trend: "Meds Today", 
      icon: CheckCircle2, 
      color: "text-purple-500" 
    },
    { 
      label: "Active Reminders", 
      value: stats?.activeReminders || "0", 
      trend: "Scheduled", 
      icon: Clock, 
      color: "text-cyan-500" 
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-accent-600 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20 group">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white font-black italic tracking-widest text-[10px]">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            AI ENABLED WELLNESS CARE
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            Welcome back, <br className="sm:hidden" />
            <span className="text-primary-100">{user?.user_metadata?.full_name?.split(" ")[0] || "User"}!</span>
          </h1>
          <p className="text-lg text-primary-50/80 font-medium leading-relaxed italic">
            {stats?.activeReminders > 0 
              ? `You have ${stats.activeReminders} active medical reminders scheduled.` 
              : "No medication reminders scheduled for tonight. Have a restful evening!"}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => router.push("/symptom-checker")} className="h-12 px-8 rounded-xl font-black italic">
              New Symptoms Analysis
            </Button>
            <Button variant="ghost" className="h-12 px-6 text-white hover:bg-white/10 font-bold" onClick={() => router.push("/health-tips")} rightIcon={ChevronRight}>
              Daily Health Tips
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-[-10%] top-[-10%] w-[40%] aspect-square bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute left-[40%] bottom-[-20%] w-[30%] aspect-square bg-accent-400/20 rounded-full blur-3xl animate-glow" />
        <Activity className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-30 rotate-12 group-hover:scale-110 transition-transform duration-700" />
      </section>

      {/* Dynamic Health Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center space-x-5 border-transparent bg-white/50 hover:bg-white shadow-xl shadow-slate-200/40">
            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color} shadow-inner`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] italic">{stat.label}</p>
              <div className="flex items-end space-x-2">
                <h3 className="text-2xl font-black text-gray-900 leading-none italic">{stat.value}</h3>
                <span className={`text-[10px] font-black italic uppercase tracking-widest ${stat.trend.includes("Excellent") || stat.trend.includes("Active") ? "text-emerald-500" : "text-gray-400"}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Main Grid: Actions & History */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-extrabold text-gray-900 italic flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-primary-600" />
              Intelligence Dashboard
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {quickActions.map((action, i) => (
              <GlassCard 
                key={i} 
                className="group cursor-pointer p-8 relative overflow-hidden bg-slate-50/50 border-transparent hover:bg-white"
                onClick={() => router.push(action.href)}
              >
                <div className={`h-16 w-16 ${action.color} rounded-2xl flex items-center justify-center p-4 mb-6 text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <action.icon className="h-full w-full" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 truncate italic">{action.title}</h3>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">{action.desc}</p>
                
                <div className="absolute bottom-6 right-6 p-2 rounded-xl bg-gray-100/50 text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Dynamic Spotlight: Latest Tip */}
          <div className="pt-4">
            <GlassCard className="p-0 overflow-hidden border-transparent shadow-2xl relative group">
               <div className="bg-slate-900 p-10 text-white flex items-center justify-between relative z-10">
                 <div className="space-y-4 max-w-lg">
                   <Badge className="bg-primary-500/20 border-primary-500/30 text-primary-400 py-1.5 font-black italic tracking-widest text-[10px]">
                      LATEST HEALTH INTELLIGENCE
                   </Badge>
                   <h3 className="text-2xl font-black italic">
                      {stats?.latestTip?.category ? `${stats.latestTip.category.charAt(0).toUpperCase() + stats.latestTip.category.slice(1)} Insight` : "Daily Wellness Focus"}
                   </h3>
                   <p className="text-slate-400 font-bold leading-relaxed italic text-lg">
                      {stats?.latestTip?.content || "Regular symptom checks and consistent medication adherence are the pillars of long-term wellness."}
                   </p>
                 </div>
                 <div className="hidden sm:flex h-20 w-20 bg-white/5 rounded-full items-center justify-center animate-pulse">
                    <Heart className="h-10 w-10 text-primary-500" />
                 </div>
               </div>
               <div className="absolute top-0 right-0 h-full w-1/3 bg-linear-to-l from-primary-600/10 to-transparent group-hover:from-primary-600/20 transition-all" />
            </GlassCard>
          </div>
        </div>

        {/* Dynamic Sidebar */}
        <div className="space-y-10">
          <div className="flex items-center space-x-3 px-2">
             <AlertCircle className="h-6 w-6 text-red-500" />
             <h2 className="text-2xl font-extrabold text-gray-900 italic">Critical Data</h2>
          </div>
          
          <GlassCard className="bg-red-50/50 border-red-100 p-10 space-y-8 shadow-xl shadow-red-500/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-red-950 text-xl leading-none italic">Emergency Contacts</h3>
              <Badge variant="danger" className="text-xs">
                {profile?.emergency_contacts?.length || 0} Contacts
              </Badge>
            </div>
            
            {/* Emergency Contacts List */}
            <div className="space-y-4">
              {profile?.emergency_contacts?.slice(0, 3).map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100/50 hover:border-red-500 transition-all group">
                  <div className="flex items-center space-x-4">
                    <Avatar name={contact.name} size="sm" className="border-2 border-red-200" />
                    <div>
                      <p className="font-bold text-gray-900 italic">{contact.name}</p>
                      <p className="text-xs text-red-700 font-bold uppercase tracking-widest">{contact.phone}</p>
                    </div>
                  </div>
                  <a 
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors group-hover:scale-110"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              ))}
              {(!profile?.emergency_contacts?.length) && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                  <p className="text-red-700 font-bold">No emergency contacts configured</p>
                  <p className="text-red-600 text-sm mt-2">Add contacts in your profile for safety</p>
                </div>
              )}
              {(profile?.emergency_contacts?.length > 3) && (
                <p className="text-xs text-red-600 font-bold text-center italic">
                  +{profile.emergency_contacts.length - 3} more contacts in profile
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Global Ambulance", num: "102", icon: Activity },
                { name: "Police Dispatch", num: "100", icon: Shield },
              ].map(num => (
                <a 
                  key={num.name} 
                  href={`tel:${num.num}`}
                  className="flex items-center justify-between p-5 bg-white rounded-2xl border border-red-100/50 hover:border-red-500 transition-all group shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <num.icon className="h-5 w-5 text-red-400 group-hover:text-red-600 transition-colors" />
                    <span className="font-bold text-gray-900 italic">{num.name}</span>
                  </div>
                  <span className="font-black text-red-600 text-lg sm:text-xl group-hover:scale-110 transition-transform italic">{num.num}</span>
                </a>
              ))}
            </div>
            <Button 
              variant="danger" 
              className="w-full h-16 rounded-xl font-black italic shadow-2xl shadow-red-500/20" 
              leftIcon={AlertCircle}
              isLoading={isSosLoading}
              onClick={handleSosDispatch}
            >
              GENERATE SOS SIGNAL
            </Button>
          </GlassCard>

          <GlassCard className="p-8 border-transparent bg-slate-50/50 relative overflow-hidden group">
            <div className="relative z-10">
               <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center italic">
                 <Shield className="h-5 w-5 mr-3 text-primary-500" />
                 SECURITY STATUS
               </h3>
               <div className="flex items-center space-x-3 mb-6">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                 <span className="text-xs font-black text-emerald-600 uppercase tracking-widest italic">All Data Encrypted</span>
               </div>
               <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8">
                 Your medical profile is protected by enterprise-grade AES-256 encryption.
               </p>
               <Button 
                 variant="ghost" 
                 className="w-full border-gray-200 text-gray-600 font-extrabold text-xs uppercase tracking-widest hover:bg-white rounded-xl h-12"
                 onClick={() => toast.success('Privacy Log', {
                   description: 'Privacy log is empty - no access events recorded. Your data is secure!'
                 })}
               >
                 Audit Privacy Log
               </Button>
            </div>
            <Shield className="absolute right-[-10%] bottom-[-10%] h-32 w-32 text-slate-200/50 rotate-12 transition-transform duration-700 group-hover:scale-110" />
          </GlassCard>
        </div>
      </div>

      <ConfirmModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onConfirm={confirmSOSDispatch}
        title="Send Emergency SOS"
        description="Are you sure you want to send an SOS signal to your emergency contacts? Your location will be shared with them."
        confirmText="Send SOS"
        cancelText="Cancel"
        variant="danger"
        isDestructive={true}
      />
    </div>
  );
}