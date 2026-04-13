"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  Stethoscope, 
  MapPin, 
  Pill, 
  Users, 
  UserCircle, 
  LogOut, 
  LayoutDashboard,
  Heart,
  ChevronLeft,
  Menu
} from "lucide-react";
import { signOut } from "@/lib/auth";
import Button from "../ui/Button";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
    { name: "Facility Finder", href: "/find-facility", icon: MapPin },
    { name: "Medicine Reminders", href: "/reminders", icon: Pill },
    { name: "Health Tips", href: "/health-tips", icon: Users },
    { name: "My Profile", href: "/profile", icon: UserCircle },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen glass-sidebar z-70 shadow-2xl transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-72 group"}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center px-2 mb-8 mt-2 h-12 shrink-0 lg:justify-start lg:px-2">
            <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 shrink-0">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold ml-3 bg-linear-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300">
              <span className="lg:hidden">HealthBuddy</span>
             
              <span className="hidden lg:block lg:group-hover:inline ml-2">HealthBuddy</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="grow space-y-3 px-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => toggleSidebar()}
                className={`
                  flex items-center space-x-3 px-3 py-3.5 rounded-2xl transition-all duration-300 group/nav lg:justify-start
                  ${isActive(item.href) 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "text-gray-500 hover:bg-primary-50 hover:text-primary-600"
                  }
                `}
              >
                <item.icon className={`h-6 w-6 shrink-0 ${isActive(item.href) ? "" : "group-nav-hover:scale-110"}`} />
                <span className={`
                  font-bold whitespace-nowrap transition-all duration-300
                  ${isOpen ? "opacity-100 translate-x-0" : "lg:opacity-0 lg:-translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 group-hover:block"}
                `}>
                  {item.name}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive(item.href) && !isOpen && (
                    <div className="absolute -left-1 w-2 h-2 rounded-full bg-white opacity-100 lg:group-hover:hidden transition-opacity" />
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto px-1 pt-4 border-t border-white/20">
            <button 
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="flex items-center justify-center space-x-3 w-full px-3 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group/logout lg:justify-start"
            >
              <LogOut className="h-6 w-6 shrink-0 group-logout-hover:scale-110" />
              <span className={`
                font-bold whitespace-nowrap transition-all duration-300
                ${isOpen ? "opacity-100 translate-x-0" : "lg:opacity-0 lg:-translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 group-hover:block"}
              `}>
                Sign Out
              </span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
