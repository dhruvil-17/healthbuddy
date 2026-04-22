"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setEmail("");
        toast.success('Reset link sent', {
          description: data.message || 'Check your email for the reset link.'
        });
      } else {
        toast.error('Failed to send reset link', {
          description: data.error || 'Unknown error'
        });
      }
    } catch (error) {
      toast.error('Failed to send reset link', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />
        
        <GlassCard className="max-w-lg w-full p-10 text-center space-y-8 relative z-10 border-transparent shadow-2xl">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-emerald-100 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Mail className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tight">Check Your Inbox!</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              If your email is registered with us, we've sent a password reset link to:
            </p>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-4 mx-4">
              <p className="text-primary-700 font-bold text-lg">{email}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left space-y-3">
            <p className="text-amber-800 font-black text-sm uppercase tracking-wider flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Important Steps:
            </p>
            <ol className="space-y-3 text-gray-700 font-medium text-sm">
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">1</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">2</span>
                <span>Find the email from <strong>HealthBuddy</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">3</span>
                <span>Click the <strong>"Reset Password"</strong> button</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs mr-3 shrink-0 mt-0.5">4</span>
                <span>Check your <strong>spam folder</strong> if you don't see it within 2 minutes</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-gray-400 text-sm font-medium">
              The reset link will expire in 1 hour for your security.
            </p>
            <Link href="/login" className="inline-block">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
                Back to Login
              </button>
            </Link>
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
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Forgot Password?</h1>
          <p className="text-gray-500 font-medium">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <GlassCard className="p-10 border-transparent shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
                aria-required="true"
              />
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
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
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
