"use client";
import React from "react";
import { Bell, Search, User, Menu, Heart } from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

const Navbar = ({ toggleSidebar, userProfile }) => {
  return (
    <nav className="glass-nav sticky top-0 z-50 h-20 px-6 sm:px-10 flex items-center justify-between">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all duration-300"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="lg:hidden flex items-center space-x-2">
          <Heart className="h-7 w-7 text-primary-600" />
          <span className="font-bold text-xl tracking-tight">HealthCare+</span>
        </div>
      </div>

      {/* Global Search (Placeholder) */}
      <div className="hidden md:flex items-center space-x-3 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-2xl w-96 group focus-within:bg-white focus-within:border-primary-500 focus-within:shadow-lg focus-within:shadow-primary-500/10 transition-all duration-300">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search symptoms, facilities, medications..." 
          className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 group">
          <Bell className="h-6 w-6" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white group-hover:scale-110" />
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">
              {userProfile?.full_name || "User"}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-primary-500 leading-none">
              Premium Plan
            </p>
          </div>
          <Avatar 
            src={userProfile?.avatar_url} 
            name={userProfile?.full_name} 
            size="md" 
            className="cursor-pointer border-2 border-white shadow-md ring-1 ring-gray-100"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
