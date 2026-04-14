"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-violet-600 hover:text-violet-700 font-bold mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-violet-100 p-4 rounded-2xl mb-6">
            <Shield className="h-12 w-12 text-violet-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: April 2026
          </p>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-3 text-violet-500" />
              Information We Collect
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email, phone number)</li>
                <li>Health information (symptoms, medications, reminders)</li>
                <li>Location data (for finding nearby healthcare facilities)</li>
                <li>Usage data and interactions with our platform</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-3 text-violet-500" />
              How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our healthcare services</li>
                <li>Send medication reminders and health tips</li>
                <li>Find nearby healthcare facilities</li>
                <li>Analyze symptoms using AI (not for medical diagnosis)</li>
                <li>Communicate with you about your account</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-3 text-violet-500" />
              Data Security
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for all data in transit</li>
                <li>Secure storage with encrypted databases</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Compliance with healthcare data protection regulations</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="h-6 w-6 mr-3 text-violet-500" />
              Your Rights
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of data collection (where legally permitted)</li>
                <li>Export your data in a portable format</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sharing Your Information</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With healthcare providers (with your consent)</li>
                <li>With emergency contacts (for SOS features)</li>
                <li>As required by law or to protect our rights</li>
                <li>With service providers who assist our operations</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="text-gray-600 leading-relaxed">
              <p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
              <p className="font-semibold text-gray-900">privacy@healthbuddy.ai</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
