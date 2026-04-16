"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useProtectedProfile } from "@/hooks/useProtectedProfile";
import Loader from "@/components/ui/Loader";

export default function ProtectedLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading } = useProtectedProfile();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`
          flex flex-col flex-1 h-screen transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}
        `}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          userProfile={profile}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
