'use client'
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/utils/profileService';
import { useProtectedProfile } from '@/hooks/useProtectedProfile';
import Loader from '@/components/ui/Loader';
import { useRouter } from 'next/navigation';
import { ProfileEditPage } from '@/components/ProfileEditPage';
import { User, MapPin, Calendar, Languages, Phone, Heart, Edit, ArrowLeft, Lock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { profile, loading, setProfile } = useProtectedProfile()

  const handleSave = async (profileData) => {
    try {
      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      // Error saving profile - will show error toast
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20">
          <div className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-2xl bg-white/20" />
            <Skeleton className="h-12 w-64 bg-white/20" />
            <Skeleton className="h-6 w-full max-w-md bg-white/20" />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="grid sm:grid-cols-2 gap-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full sm:col-span-2" />
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100 bg-red-50/30">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-20" />
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100 bg-primary-900">
              <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
              <Skeleton className="h-16 w-full bg-white/20" />
            </GlassCard>

            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show read-only view by default
  if (!isEditing) {
    return (
      <div className="space-y-10 pb-20">
        {/* Header Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20">
          <div className="relative z-10 space-y-4 max-w-2xl flex flex-col md:flex-row items-center space-x-8">
            <Avatar name={profile?.full_name} size="xl" className="border-4 border-white/20" />
            <div className="space-y-3">
              <Badge variant="glass" className="bg-white/20 border-white/30 text-white">
                <User className="h-3.5 w-3.5 mr-2" />
                My Profile
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
                {profile?.full_name || 'User Profile'}
              </h1>
              <p className="text-lg text-primary-50/80 font-medium leading-relaxed">
                View and manage your personal health information.
              </p>
            </div>
          </div>
          <User className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
        </section>

        {/* Profile Details */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center">
                  <User className="h-6 w-6 mr-3 text-primary-600" />
                  Basic Information
                </h2>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="h-10 px-6 rounded-xl font-bold"
                  leftIcon={Edit}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.full_name || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Age</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.age || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Gender</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.gender || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Preferred Language</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.preferred_language || 'English'}</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Location</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.location || 'Not set'}</p>
                </div>
              </div>
            </GlassCard>

            {/* Emergency Contact */}
            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
                <Phone className="h-6 w-6 mr-3 text-red-500" />
                Emergency Contact
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Contact Name</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.emergency_contact_name || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Contact Phone</label>
                  <p className="text-lg font-semibold text-gray-900">{profile?.emergency_contact_phone || 'Not set'}</p>
                </div>
              </div>
            </GlassCard>

            {/* Medical Conditions */}
            <GlassCard className="p-10 border-transparent shadow-xl ring-1 ring-gray-100 bg-red-50/30">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
                <Heart className="h-6 w-6 mr-3 text-red-500" />
                Medical Conditions
              </h2>

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {profile?.existing_conditions && profile.existing_conditions.length > 0 ? (
                  profile.existing_conditions.map((condition, i) => (
                    <Badge key={i} variant="danger" className="py-2.5 px-4 rounded-xl">
                      <span className="font-bold">{condition}</span>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center w-full py-4 italic">No conditions added</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100 bg-primary-900 text-white border-transparent" hover={false}>
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-primary-300" />
                <span className="font-extrabold uppercase tracking-widest text-[10px]">Profile Status</span>
              </div>
              <p className="text-sm font-medium text-primary-50/80 leading-relaxed italic">
                Your profile is {profile ? 'complete' : 'incomplete'}. Complete profiles receive 40% more accurate AI health insights.
              </p>
            </GlassCard>

            <div className="space-y-4 sticky top-24">
              <Button
                variant="primary"
                className="w-full h-14 rounded-2xl text-lg font-extrabold shadow-2xl shadow-primary-500/30"
                onClick={() => setIsEditing(true)}
                leftIcon={Edit}
              >
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                className="w-full h-12 rounded-2xl font-bold"
                onClick={() => router.push('/change-password')}
                leftIcon={Lock}
              >
                Change Password
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-2xl font-bold text-gray-500"
                onClick={() => router.push('/dashboard')}
                leftIcon={ArrowLeft}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show edit form
  return (
    <ProfileEditPage
      initialProfile={profile}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}