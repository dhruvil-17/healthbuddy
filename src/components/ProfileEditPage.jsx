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
    emergency_contacts: [],
    location: '',
    existing_conditions: []
  });
  
  const [newCondition, setNewCondition] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProfile) {
      // Handle migration from single contact to multiple contacts
      const emergencyContacts = initialProfile.emergency_contacts || 
        (initialProfile.emergency_contact_name ? [{
          name: initialProfile.emergency_contact_name,
          phone: initialProfile.emergency_contact_phone || ''
        }] : []);
      
      setProfile({
        age: initialProfile.age?.toString() || '',
        gender: initialProfile.gender || '',
        preferred_language: initialProfile.preferred_language || 'English',
        emergency_contacts: emergencyContacts,
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
    
    // Validate emergency contacts
    profile.emergency_contacts.forEach((contact, index) => {
      if (contact.phone && !/^\d{10}$/.test(contact.phone.replace(/\s/g, ''))) {
        newErrors[`emergency_contact_${index}_phone`] = 'Invalid 10-digit phone number';
      }
    });
    
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

  const addEmergencyContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      const cleanPhone = newContact.phone.replace(/\s/g, '');
      if (/^\d{10}$/.test(cleanPhone)) {
        setProfile(prev => ({
          ...prev,
          emergency_contacts: [...prev.emergency_contacts, {
            name: newContact.name.trim(),
            phone: cleanPhone
          }]
        }));
        setNewContact({ name: '', phone: '' });
      }
    }
  };

  const removeEmergencyContact = (index) => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl flex flex-col md:flex-row items-center space-x-8">
           {/* <Avatar name={initialProfile?.full_name} size="xl" className="hidden md:flex border-4 border-white/20" /> */}
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
                  className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-13"
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
                  className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 font-medium h-13"
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
              Emergency Contacts
            </h2>
            
            {/* Add New Contact Form */}
            <div className="mb-6 p-6 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="text-lg font-bold text-red-900 mb-4">Add New Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Input 
                  label="Full Name" 
                  value={newContact.name} 
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contact person's name"
                  icon={User}
                />
                <Input 
                  label="Phone Number" 
                  value={newContact.phone} 
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="10-digit number"
                  icon={Phone}
                />
              </div>
              <Button 
                onClick={addEmergencyContact} 
                className="w-full sm:w-auto"
                leftIcon={Plus}
                disabled={!newContact.name.trim() || !newContact.phone.trim()}
              >
                Add Contact
              </Button>
            </div>
            
            {/* Existing Contacts */}
            <div className="space-y-4">
              {profile.emergency_contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Avatar name={contact.name} size="sm" className="border-2 border-red-200" />
                    <div>
                      <p className="font-bold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => removeEmergencyContact(index)}
                    leftIcon={X}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {profile.emergency_contacts.length === 0 && (
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center py-8 italic">
                  No emergency contacts added. Add at least one contact for safety.
                </p>
              )}
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
              <Button onClick={addCondition} className="h-13 shrink-0" leftIcon={Plus} />
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
