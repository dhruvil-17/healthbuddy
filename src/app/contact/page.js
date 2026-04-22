"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error('Failed to send message', {
          description: data.error || 'Unknown error'
        });
      }
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-indigo-50 py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-violet-600 hover:text-violet-700 font-bold mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-violet-100 p-4 rounded-2xl mb-6">
            <MessageSquare className="h-12 w-12 text-violet-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-violet-100 p-3 rounded-xl">
                  <Mail className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">support@healthbuddy.ai</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-violet-100 p-3 rounded-xl">
                  <Phone className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">+91 1800-HEALTH-1</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-violet-100 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600 text-sm">Gandhinagar, Gujarat</p>
                  <p className="text-gray-500 text-xs mt-1">India</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-violet-50/50">
              <h3 className="font-bold text-gray-900 mb-3">Emergency?</h3>
              <p className="text-gray-600 text-sm mb-3">
                If you have a medical emergency, please call emergency services immediately.
              </p>
              <p className="text-red-600 font-bold text-sm">108 (India Emergency)</p>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <p className="text-green-800 font-bold">Thank you for your message!</p>
                  <p className="text-green-600 text-sm mt-2">We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        placeholder="Your name"
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        placeholder="your@email.com"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                      aria-required="true"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </GlassCard>

            <GlassCard className="p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Is HealthBuddy free to use?</h4>
                  <p className="text-gray-600 text-xs">Yes, our core features are free. We may offer premium features in the future.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">How accurate is the symptom checker?</h4>
                  <p className="text-gray-600 text-xs">Our AI provides general information only. Always consult a healthcare professional for medical advice.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Is my health data secure?</h4>
                  <p className="text-gray-600 text-xs">Yes, we use industry-standard encryption and security measures to protect your data. See our Privacy Policy for details.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
