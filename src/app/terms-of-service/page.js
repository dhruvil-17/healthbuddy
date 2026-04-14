"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Scale } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-violet-600 hover:text-violet-700 font-bold mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-violet-100 p-4 rounded-2xl mb-6">
            <FileText className="h-12 w-12 text-violet-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: April 2026
          </p>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-violet-500" />
              Acceptance of Terms
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>By accessing or using HealthBuddy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-amber-500" />
              Medical Disclaimer
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>IMPORTANT:</strong> HealthBuddy is an AI-powered tool designed for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Always seek the advice of your physician or other qualified health provider</li>
                <li>Never disregard professional medical advice or delay in seeking it</li>
                <li>If you think you may have a medical emergency, call emergency services immediately</li>
                <li>Our AI symptom checker is for informational purposes only, not diagnosis</li>
                <li>We are not responsible for decisions made based on information from our platform</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>As a user of HealthBuddy, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Use the service for personal, non-commercial purposes</li>
                <li>Not attempt to reverse engineer or hack our systems</li>
                <li>Not use the service to harass, abuse, or harm others</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <XCircle className="h-6 w-6 mr-3 text-red-500" />
              Prohibited Uses
            </h2>
            <div className="text-gray-600 leading-relaxed">
              <p>You may NOT use HealthBuddy to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Diagnose or treat medical conditions without professional consultation</li>
                <li>Attempt to bypass security measures or access unauthorized data</li>
                <li>Spread false or misleading health information</li>
                <li>Use the service for illegal activities</li>
                <li>Impersonate others or provide false information</li>
                <li>Interfere with the operation of the service</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Scale className="h-6 w-6 mr-3 text-violet-500" />
              Limitation of Liability
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>To the fullest extent permitted by law, HealthBuddy shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Decisions made based on information from our platform</li>
                <li>Medical outcomes resulting from use of our service</li>
                <li>Service interruptions or downtime</li>
              </ul>
              <p className="mt-4"><strong>In no event shall our total liability exceed the amount you paid for the service, if any.</strong></p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Availability</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>We strive to maintain high availability but do not guarantee uninterrupted access. We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify, suspend, or discontinue the service at any time</li>
                <li>Limit access to certain features or content</li>
                <li>Update these terms with notice to users</li>
                <li>Terminate accounts that violate our policies</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>All content, features, and functionality of HealthBuddy are owned by us and protected by international copyright, trademark, and other intellectual property laws. You may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or logos without authorization</li>
                <li>Reverse engineer our software or algorithms</li>
                <li>Create derivative works based on our platform</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be resolved in the courts of appropriate jurisdiction in India.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="text-gray-600 leading-relaxed">
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="text-gray-600 leading-relaxed">
              <p className="mb-4">If you have questions about these Terms of Service, please contact us at:</p>
              <p className="font-semibold text-gray-900">legal@healthbuddy.ai</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
