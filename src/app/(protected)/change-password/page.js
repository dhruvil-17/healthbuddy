"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { useProtectedUser } from "@/hooks/useProtectedUser";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useProtectedUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please make sure both passwords are identical.'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password too short', {
        description: 'Password must be at least 6 characters long.'
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Same password', {
        description: 'New password must be different from current password.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        toast.error('Failed to change password', {
          description: data.error || 'Unknown error'
        });
      }
    } catch (error) {
      toast.error('Failed to change password', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />
        
        <GlassCard className="max-w-lg w-full p-10 text-center space-y-8 relative z-10 border-transparent shadow-2xl">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-emerald-100 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tight">Password Changed Successfully!</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Your password has been successfully updated. You can continue using your new password.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />
      
      <div className="max-w-md w-full space-y-10 relative z-10">
        <div className="space-y-4 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold mb-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Change Password</h1>
          <p className="text-gray-500 font-medium">Update your password to keep your account secure.</p>
        </div>

        <GlassCard className="p-10 border-transparent shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-bold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  minLength={6}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  minLength={6}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Changing...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </form>
        </GlassCard>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center text-blue-800 font-black text-sm uppercase tracking-wider">
            <ShieldCheck className="h-5 w-5 mr-2" />
            Security Tips
          </div>
          <ul className="text-gray-600 text-xs space-y-1">
            <li>• Use at least 6 characters</li>
            <li>• Include a mix of letters, numbers, and symbols</li>
            <li>• Don't reuse passwords from other accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
