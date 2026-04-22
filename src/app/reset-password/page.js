"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { toast } from "sonner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  //preventing unauthorized access to reset-pasword page
useEffect(() => {
  const handleSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      toast.error('Invalid or expired reset link', {
        description: 'Please request a new password reset link.'
      });
      router.push('/forgot-password');
    } else {
      setIsLoading(false);
    }
  };

  handleSession();
}, []);



  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  setIsSubmitting(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      throw error;
    }

    setIsSuccess(true);

  } catch (error) {
    toast.error('Failed to reset password', {
      description: error.message,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tight">Password Reset Successful!</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Go to Login
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
          <Link href="/login" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold mb-2 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Reset Password</h1>
          <p className="text-gray-500 font-medium">Enter your new password below.</p>
        </div>

        <GlassCard className="p-10 border-transparent shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  minLength={6}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-primary-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  <span>Resetting...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        </GlassCard>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
