"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Heart,
  Loader2,
  AlertCircle,
  Info,
  Send,
  History,
  TrendingUp,
  Sparkles,
  Activity,
  ChevronRight
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { useProtectedProfile } from "@/hooks/useProtectedProfile";

export default function SymptomCheckerPage() {
  const router = useRouter();
  const { user, profile, loading: profileLoading } = useProtectedProfile();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/symptom-checker?userId=${user.id}&limit=5`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || !user) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        fetchHistory(); // Refresh history
      } else {
        alert(data.error || "Failed to analyze symptoms");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "danger";
      case "emergency": return "danger";
      default: return "neutral";
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <Skeleton className="h-40 w-full rounded-[2.5rem]" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-screen w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Medical Grade AI Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            AI Symptom <br className="sm:hidden" />
            <span className="text-primary-100">Checker</span>
          </h1>
          <p className="text-lg text-primary-50/80 font-medium leading-relaxed">
            Describe your concerns and get instant medical-grade insights powered by advanced AI.
          </p>
        </div>
        <Stethoscope className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      {/* Disclaimer */}
      <GlassCard className="bg-amber-50 border-amber-100 p-6 flex items-start space-x-4 border-l-8 border-l-amber-400" hover={false}>
        <div className="p-3 bg-amber-400 rounded-xl text-white">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 leading-none mb-1">Medical Disclaimer</h3>
          <p className="text-amber-800/80 text-sm font-bold">
            This tool provides information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. 
            <span className="text-amber-900 ml-1">In case of emergency, call 102 immediately.</span>
          </p>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Form */}
          <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-primary-600" />
              Describe Symptoms
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-extrabold text-gray-500 uppercase tracking-widest pl-1">
                  DETAILED DESCRIPTION
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. 'I've had a sharp pain in my upper abdomen for 2 days, and it gets worse after eating...'"
                  className="w-full min-h-[180px] p-6 rounded-3xl bg-gray-50/50 border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 focus:bg-white transition-all duration-300 text-lg font-medium outline-none resize-none placeholder:text-gray-400"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 rounded-[1.5rem] text-lg font-extrabold"
                isLoading={isAnalyzing}
                leftIcon={isAnalyzing ? null : Send}
              >
                {isAnalyzing ? "Processing Analysis..." : "Analyze Symptoms Now"}
              </Button>
            </form>
          </GlassCard>

          {/* Analysis Results Display */}
          {result && (
            <GlassCard className="p-10 border-transparent shadow-2xl animate-in fade-in slide-in-from-top-8 duration-700">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                  <h3 className="text-2xl font-extrabold text-gray-900">Analysis Insights</h3>
                  <Badge variant={getSeverityVariant(result.severity)} className="py-2 px-5 text-sm uppercase tracking-wider font-extrabold">
                     {result.severity} Priority
                  </Badge>
               </div>

               <div className="space-y-12">
                  {/* Possible Conditions */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">POSSIBLE CONDITIONS</h4>
                      <div className="space-y-3">
                        {result.possibleConditions?.map((c, i) => (
                          <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group hover:bg-white hover:border-primary-200 transition-colors">
                            <Info className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                            <span className="font-bold text-gray-800 leading-tight group-hover:text-primary-700">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">IMMEDIATE ACTIONS</h4>
                      <div className="space-y-3">
                        {result.recommendations?.immediate?.map((a, i) => (
                          <div key={i} className="flex items-start space-x-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 uppercase text-[10px] sm:text-xs font-extrabold tracking-tight">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800 mt-1">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Warning Signs */}
                  <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-red-400 uppercase tracking-widest">EMERGENCY RED FLAGS</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.warningSigns?.map((s, i) => (
                          <div key={i} className="flex items-center space-x-3 p-4 bg-red-50/80 rounded-2xl border border-red-100 text-red-900 font-bold">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Disclaimer Text */}
                  <div className="p-4 bg-gray-50 rounded-2xl text-[10px] sm:text-xs font-bold text-gray-400 text-center uppercase tracking-widest leading-loose italic">
                    {result.disclaimer}
                  </div>
               </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar: History & Tips */}
        <div className="space-y-10">
          <h2 className="text-2xl font-extrabold text-gray-900 px-2">History</h2>
          <div className="space-y-6">
            {history.length > 0 ? (
              history.map((check, i) => {
                const checkDate = new Date(check.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                return (
                  <GlassCard key={i} className="p-6 border-transparent bg-gray-50/50 hover:bg-white group cursor-pointer transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={getSeverityVariant(check.severity_level)} className="text-[10px] px-2.5">{check.severity_level}</Badge>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{checkDate}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 line-clamp-2 italic mb-3">"{check.symptoms_description}"</p>
                    <div className="flex items-center text-primary-500 text-[11px] font-extrabold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      VIEW DETAILS <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </div>
                  </GlassCard>
                );
              })
            ) : (
              <div className="p-10 text-center space-y-4">
                <div className="p-4 bg-gray-50 rounded-3xl inline-block mx-auto">
                  <History className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">No Recent Reports Found</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <GlassCard className="p-8 bg-primary-600 text-white border-transparent">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary-200" />
                <h3 className="font-extrabold text-lg uppercase tracking-widest text-[10px]">AI Insight</h3>
              </div>
              <p className="text-sm font-medium text-primary-50/80 leading-relaxed italic">
                {history.length > 0 
                  ? `You've checked ${history.length} reports recently. Be specific about symptoms for the most accurate AI guidance.` 
                  : "Welcome! Describe your symptoms clearly, including duration and intensity, for the most accurate analysis."}
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
