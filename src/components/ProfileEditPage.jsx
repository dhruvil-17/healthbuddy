"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Languages, 
  Heart, 
  Save, 
  ArrowLeft, 
  Plus, 
  X,
  Shield,
  Sparkles,
  Info
} from 'lucide-react';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

export const ProfileEditPage = ({ initialProfile, onSave, onCancel }) => {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    preferred_language: 'English',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    location: '',
    existing_conditions: []
  });
  
  const [newCondition, setNewCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProfile) {
      setProfile({
        age: initialProfile.age?.toString() || '',
        gender: initialProfile.gender || '',
        preferred_language: initialProfile.preferred_language || 'English',
        emergency_contact_name: initialProfile.emergency_contact_name || '',
        emergency_contact_phone: initialProfile.emergency_contact_phone || '',
        location: initialProfile.location || '',
        existing_conditions: initialProfile.existing_conditions || []
      });
    }
  }, [initialProfile]);

  const validateForm = () => {
    const newErrors = {};
    if (!profile.age || profile.age < 1 || profile.age > 150) newErrors.age = 'Invalid age (1-150)';
    if (!profile.gender) newErrors.gender = 'Gender is required';
    if (!profile.preferred_language) newErrors.preferred_language = 'Language is required';
    if (profile.emergency_contact_phone && !/^\d{10}$/.test(profile.emergency_contact_phone.replace(/\s/g, ''))) {
      newErrors.emergency_contact_phone = 'Invalid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onSave({ ...profile, age: parseInt(profile.age) });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && !profile.existing_conditions.includes(newCondition.trim())) {
      setProfile(prev => ({
        ...prev,
        existing_conditions: [...prev.existing_conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (c) => {
    setProfile(prev => ({
      ...prev,
      existing_conditions: prev.existing_conditions.filter(cond => cond !== c)
    }));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl flex items-center space-x-8">
           <Avatar name={initialProfile?.full_name} size="xl" className="hidden md:flex border-4 border-white/20" />
           <div className="space-y-3">
              <Badge variant="glass" className="bg-white/20 border-white/30 text-white">
                <Shield className="h-3.5 w-3.5 mr-2" />
                Secure Profile Management
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
                Manage Your <br className="sm:hidden" />
                <span className="text-primary-100">Health Profile</span>
              </h1>
              <p className="text-lg text-primary-50/80 font-medium leading-relaxed">
                Keep your medical information up to date for better AI insights and emergency care.
              </p>
           </div>
        </div>
        <User className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
              <Info className="h-6 w-6 mr-3 text-primary-600" />
              Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <Input 
                label="Age" 
                type="number" 
                value={profile.age} 
                onChange={(e) => setProfile({...profile, age: e.target.value})}
                error={errors.age}
                placeholder="Years"
                icon={Calendar}
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Gender</label>
                <select 
                  className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-[52px]"
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 font-bold ml-1">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Preferred Language</label>
                <select 
                  className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-[52px]"
                  value={profile.preferred_language}
                  onChange={(e) => setProfile({...profile, preferred_language: e.target.value})}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <Input 
                label="Location" 
                value={profile.location} 
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                placeholder="City/Region"
                icon={MapPin}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
              <Phone className="h-6 w-6 mr-3 text-red-500" />
              Emergency Contact
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <Input 
                label="Full Name" 
                value={profile.emergency_contact_name} 
                onChange={(e) => setProfile({...profile, emergency_contact_name: e.target.value})}
                placeholder="Contact person's name"
                icon={User}
              />
              <Input 
                label="Phone Number" 
                value={profile.emergency_contact_phone} 
                onChange={(e) => setProfile({...profile, emergency_contact_phone: e.target.value})}
                error={errors.emergency_contact_phone}
                placeholder="10-digit number"
                icon={Phone}
              />
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Actions & Medical Conditions */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100 bg-red-50/30">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
              <Heart className="h-6 w-6 mr-3 text-red-500" />
              Medical Conditions
            </h2>
            
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="e.g. Asthma" 
                value={newCondition} 
                onChange={(e) => setNewCondition(e.target.value)} 
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
              />
              <Button onClick={addCondition} className="h-[52px] shrink-0   " leftIcon={Plus} />
            </div>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {profile.existing_conditions.map((c, i) => (
                <Badge key={i} variant="danger" className="py-2.5 px-4 rounded-xl flex items-center space-x-2 animate-in zoom-in-95">
                  <span className="font-bold">{c}</span>
                  <button onClick={() => removeCondition(c)} className="hover:text-red-900 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
              {profile.existing_conditions.length === 0 && (
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center w-full py-4 italic">No conditions added</p>
              )}
            </div>
          </GlassCard>

          <div className="space-y-4 sticky top-24">
             <Button 
               variant="primary" 
               className="w-full h-16 rounded-2xl text-lg font-extrabold shadow-2xl shadow-primary-500/30" 
               onClick={handleSubmit}
               isLoading={isLoading}
               leftIcon={Save}
             >
                Save Profile Changes
             </Button>
             <Button 
               variant="ghost" 
               className="w-full h-14 rounded-2xl font-bold text-gray-500" 
               onClick={onCancel}
             >
                Discard Changes
             </Button>

             <GlassCard className="p-8 mt-10 bg-primary-900 text-white border-transparent" hover={false}>
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="h-5 w-5 text-primary-300" />
                  <span className="font-extrabold uppercase tracking-widest text-[10px]">Security Tip</span>
                </div>
                <p className="text-sm font-medium text-primary-50/80 leading-relaxed italic">
                  "Complete profiles receive 40% more accurate AI health insights."
                </p>
             </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileEditPage };
