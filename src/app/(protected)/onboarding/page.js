"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { createUserProfile } from "@/utils/profileService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { useProtectedUser } from "@/hooks/useProtectedUser";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    existingConditions: [],
    preferredLanguage: "English",
    emergencyContactName: "",
    emergencyContactPhone: "",
    location: ""
  });
  
  const router = useRouter();
  const { user, loading: autLoading } = useProtectedUser();

  const conditions = [
    "Diabetes", "High Blood Pressure", "Asthma", "Heart Disease", 
    "Arthritis", "Kidney Disease", "Thyroid Issues", "Mental Health"
  ];

  const handleConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      existingConditions: prev.existingConditions.includes(condition)
        ? prev.existingConditions.filter(c => c !== condition)
        : [...prev.existingConditions, condition]
    }));
  };

  const handleNext = () => step < 3 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUserProfile({
        age: formData.age,
        gender: formData.gender,
        conditions: formData.existingConditions,
        language: formData.preferredLanguage,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        location: formData.location
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error('Profile Error', {
        description: "Failed to save profile. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (autLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader /></div>;

  return (
    <div className="min-h-screen bg-linear-to-r from-primary-50 to-violet-50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/20 rounded-full blur-[100px] -ml-48 -mb-48 animate-glow" />

      <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-10 items-center relative z-10">
        {/* Progress Sidebar */}
        <div className="lg:col-span-2 space-y-8 lg:pr-10">
          <Badge variant="primary" className="py-2 px-4 shadow-lg shadow-primary-500/10">
            <Sparkles className="h-4 w-4 mr-2 text-primary-500" />
            Healthcare Revolution
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1]">
            Let&apos;s build your <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Health Profile</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Welcome to HealthBuddy. Completing these steps helps us provide personalized AI insights tailored to your needs.
          </p>

          <div className="space-y-6 pt-4">
            {[
              { id: 1, title: "Identity", desc: "Basic details about you" },
              { id: 2, title: "Wellness", desc: "Your medical background" },
              { id: 3, title: "Security", desc: "Emergency & Location" }
            ].map(s => (
              <div key={s.id} className={`flex items-center space-x-4 transition-all duration-500 ${step === s.id ? "scale-105" : "opacity-40"}`}>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold transition-all duration-500 ${step >= s.id ? "bg-primary-600 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}>
                  {step > s.id ? <CheckCircle className="h-6 w-6" /> : s.id}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900">{s.title}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex items-center space-x-4">
            <Avatar name={user?.user_metadata?.full_name} size="lg" className="border-4 border-white shadow-xl shadow-primary-500/10" />
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
              <p className="text-lg font-extrabold text-gray-900">{user?.user_metadata?.full_name || "User"}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <GlassCard className="lg:col-span-3 p-8 sm:p-12 border-transparent shadow-2xl ring-1 ring-gray-100 min-h-125 flex flex-col">
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {step === 1 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                   <div className="p-3 bg-primary-100 rounded-2xl text-primary-600"><User className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-extrabold text-gray-900">Personal Details</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <Input 
                    label="How old are you?" 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    placeholder="Years"
                    icon={Calendar}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Your Gender</label>
                    <select
                      className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-13"
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Preferred Language</label>
                    <select
                      className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-13"
                      value={formData.preferredLanguage}
                      onChange={e => setFormData({...formData, preferredLanguage: e.target.value})}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                   <div className="p-3 bg-red-100 rounded-2xl text-red-600"><Heart className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-extrabold text-gray-900">Medical History</h2>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Select all that apply</p>
                <div className="grid grid-cols-2 gap-4">
                  {conditions.map(c => (
                    <button
                      key={c}
                      onClick={() => handleConditionToggle(c)}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-300 text-left ${formData.existingConditions.includes(c) ? "bg-primary-600 border-primary-600 text-white shadow-lg" : "bg-gray-50 border-gray-100 text-gray-500 hover:border-primary-200"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                   <div className="p-3 bg-accent-100 rounded-2xl text-accent-600"><ShieldCheck className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-extrabold text-gray-900">Safety & Access</h2>
                </div>
                <div className="grid gap-8">
                  <Input 
                    label="Emergency Contact Name" 
                    value={formData.emergencyContactName} 
                    onChange={e => setFormData({...formData, emergencyContactName: e.target.value})}
                    placeholder="Enter full name"
                    icon={User}
                  />
                  <Input 
                    label="Contact Phone" 
                    value={formData.emergencyContactPhone} 
                    onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})}
                    placeholder="10-digit number"
                    icon={Phone}
                  />
                  <Input 
                    label="Your Current Area" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="City / Region"
                    icon={MapPin}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 flex items-center justify-between border-t border-gray-100">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1}
              className={step === 1 ? "opacity-0 invisible" : ""}
              leftIcon={ArrowLeft}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={step === 1 && (!formData.age || !formData.gender)}
                className="px-10 h-14 rounded-2xl font-extrabold shadow-xl shadow-primary-500/20"
                rightIcon={ChevronRight}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                isLoading={loading}
                className="px-10 h-14 rounded-2xl font-extrabold shadow-xl shadow-primary-500/20"
                rightIcon={CheckCircle}
              >
                Complete Profile
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}