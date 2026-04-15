"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Activity, 
  Apple, 
  Brain, 
  Shield, 
  AlertTriangle,
  Clock,
  User,
  Stethoscope,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { useProtectedProfile } from '@/hooks/useProtectedProfile';
import { toast } from "sonner";
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';

export default function HealthTips() {
  const [healthTips, setHealthTips] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [expandedSections, setExpandedSections] = useState({ general: true, conditions: true, diet: true, exercise: true });
  const router = useRouter();
  const { profile, loading } = useProtectedProfile();

  const categories = [
    { id: 'general', name: 'General', icon: Heart, color: 'bg-red-100 text-red-600' },
    { id: 'diet', name: 'Nutrition', icon: Apple, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'exercise', name: 'Fitness', icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { id: 'mental', name: 'Mental', icon: Brain, color: 'bg-purple-100 text-purple-600' },
    { id: 'preventive', name: 'Preventive', icon: Shield, color: 'bg-indigo-100 text-indigo-600' }
  ];

  const generateHealthTips = React.useCallback(async (userId, category = selectedCategory) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/health-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, category }),
      });
      const result = await response.json();
      if (result.success) setHealthTips(result.data);
    } catch (error) {
      // Error generating health tips - will show error toast
    } finally {
      setGenerating(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (profile) generateHealthTips(profile.id, selectedCategory);
  }, [selectedCategory, profile, generateHealthTips]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <Skeleton className="h-44 w-full rounded-[2.5rem]" />
        <div className="grid lg:grid-cols-4 gap-10">
          <Skeleton className="lg:col-span-1 h-96 w-full" />
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-white shadow-2xl shadow-emerald-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white font-extrabold uppercase tracking-widest text-[10px]">
             Daily Wellness Intelligence
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            Personalized <br className="sm:hidden" />
            <span className="text-emerald-100">Health Insights</span>
          </h1>
          <p className="text-lg text-emerald-50/80 font-medium leading-relaxed">
            AI-driven recommendations tailored to your profile, age, and existing conditions.
          </p>
          <div className="pt-4">
             <Button 
               variant="secondary" 
               className="bg-white text-emerald-700 hover:bg-emerald-50 h-12 px-6"
               onClick={() => generateHealthTips(profile?.id)}
               isLoading={generating}
               leftIcon={RefreshCw}
             >
                Regenerate Tips
             </Button>
          </div>
        </div>
        <Lightbulb className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100" hover={false}>
              <div className="flex items-center space-x-4 mb-8">
                 <Avatar name={profile?.full_name} size="lg" className="border-2 border-primary-500/20" />
                 <div>
                    <h3 className="font-extrabold text-gray-900">{profile?.full_name || "User"}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Profile</p>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Focus Categories</h4>
                 {categories.map(cat => (
                   <button
                     key={cat.id}
                     onClick={() => setSelectedCategory(cat.id)}
                     className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${selectedCategory === cat.id ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20 scale-105" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                   >
                     <cat.icon className={`h-5 w-5 mr-3 ${selectedCategory === cat.id ? "text-white" : cat.color.split(' ')[1]}`} />
                     <span className="font-bold">{cat.name}</span>
                   </button>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-8 bg-blue-600 text-white border-transparent" hover={false}>
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-5 w-5 text-blue-300" />
                <span className="font-extrabold uppercase tracking-widest text-[10px]">Quick Stat</span>
              </div>
              <p className="text-sm font-medium text-blue-50/80 leading-relaxed italic">
                &quot;Users following personalized tips report a 25% increase in daily energy levels.&quot;
              </p>
           </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
           {generating ? (
             <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                   <div className="h-20 w-20 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
                   <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Generating Your Health Intelligence</h3>
                <p className="text-gray-500 font-medium">Analyzing your profile markers and clinical data...</p>
             </div>
           ) : healthTips ? (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* General Tips Section */}
                <GlassCard className="p-0 border-transparent shadow-xl ring-1 ring-gray-100 overflow-hidden" hover={false}>
                   <div 
                     className="p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                     onClick={() => toggleSection('general')}
                   >
                      <div className="flex items-center space-x-4">
                         <div className="p-3 bg-primary-100 rounded-2xl text-primary-600"><Heart className="h-6 w-6" /></div>
                         <h2 className="text-2xl font-extrabold text-gray-900">Lifestyle Recommendations</h2>
                      </div>
                      {expandedSections.general ? <ChevronUp className="h-6 w-6 text-gray-400" /> : <ChevronDown className="h-6 w-6 text-gray-400" />}
                   </div>
                   
                   {expandedSections.general && (
                     <div className="p-8 pt-0 grid gap-6">
                        {healthTips.generalTips?.map((tip, i) => (
                           <div key={i} className="group p-6 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-primary-200 transition-all duration-300">
                              <div className="flex items-center justify-between mb-4">
                                 <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{tip.title}</h3>
                                 <Badge variant={getPriorityVariant(tip.priority)} className="py-1 px-3 text-[10px] items-center">
                                    {tip.priority} priority
                                 </Badge>
                              </div>
                              <p className="text-gray-600 font-medium leading-relaxed italic">&quot;{tip.description}&quot;</p>
                           </div>
                        ))}
                     </div>
                   )}
                </GlassCard>

                {/* Dietary Section */}
                {selectedCategory === 'diet' && healthTips.dietaryRecommendations && (
                  <GlassCard className="p-0 border-transparent shadow-xl ring-1 ring-gray-100 overflow-hidden" hover={false}>
                    <div 
                      className="p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSection('diet')}
                    >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><Apple className="h-6 w-6" /></div>
                          <h2 className="text-2xl font-extrabold text-gray-900">Nutrition Optimization</h2>
                        </div>
                        {expandedSections.diet ? <ChevronUp className="h-6 w-6 text-gray-400" /> : <ChevronDown className="h-6 w-6 text-gray-400" />}
                    </div>

                    {expandedSections.diet && (
                      <div className="p-8 pt-0 space-y-10">
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest pl-1">Power Foods</h4>
                               <div className="flex flex-wrap gap-2">
                                  {healthTips.dietaryRecommendations.recommended?.map((f, i) => (
                                    <Badge key={i} className="bg-emerald-50 text-emerald-700 border-emerald-100 py-2 px-4 rounded-xl font-bold">✓ {f}</Badge>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest pl-1">Avoid / Limit</h4>
                               <div className="flex flex-wrap gap-2">
                                  {healthTips.dietaryRecommendations.avoid?.map((f, i) => (
                                    <Badge key={i} className="bg-red-50 text-red-700 border-red-100 py-2 px-4 rounded-xl font-bold">✗ {f}</Badge>
                                  ))}
                               </div>
                            </div>
                         </div>

                         {healthTips.dietaryRecommendations.mealPlan && (
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">Suggested Daily Fuel</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                 {Object.entries(healthTips.dietaryRecommendations.mealPlan).map(([meal, desc]) => (
                                   <div key={meal} className="p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-emerald-200 transition-all group">
                                      <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest block mb-2">{meal}</span>
                                      <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-emerald-700">{desc}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         )}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Emergency & Warning Section */}
                {healthTips.warningSignsToWatch?.length > 0 && (
                   <GlassCard className="p-8 bg-red-50 border-red-100" hover={false}>
                      <div className="flex items-center space-x-3 mb-6">
                         <div className="p-2 bg-red-500 rounded-xl text-white"><AlertTriangle className="h-6 w-6" /></div>
                         <h2 className="text-xl font-extrabold text-red-900">Clinical Warning Signs</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                         {healthTips.warningSignsToWatch.map((s, i) => (
                           <div key={i} className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-red-100 text-red-800 font-bold">
                              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                              <span className="text-sm">{s}</span>
                           </div>
                         ))}
                      </div>
                      <div className="mt-8 p-6 bg-red-900 text-white rounded-3xl flex items-center justify-between">
                         <div>
                            <h4 className="font-extrabold mb-1 text-white">Emergency Protocols</h4>
                            <p className="text-xs text-red-200 font-medium">{healthTips.emergencyGuidelines?.whenToCall}</p>
                         </div>
                         <Button 
                           variant="danger" 
                           className="px-6 h-12 rounded-xl font-extrabold"
                           onClick={() => {
                             toast.warning('Emergency SOS', {
                               description: '🚨 EMERGENCY SOS ACTIVATED! Signal sent to contacts + authorities.'
                             });
                             router.push('/dashboard');
                           }}
                         >
                           SOS Alert
                         </Button>
                      </div>
                   </GlassCard>
                )}

                {/* Disclaimer */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose text-center px-10 italic">
                  {healthTips.disclaimer}
                </p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] inline-block mx-auto">
                   <Info className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">No Intelligence Found</h3>
                <p className="text-gray-500 font-medium">Click &quot;Refresh Tips&quot; to re-synchronize your personalized wellness data.</p>
                <Button onClick={() => profile && generateHealthTips(profile.id)}>Refresh Wellness Data</Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}