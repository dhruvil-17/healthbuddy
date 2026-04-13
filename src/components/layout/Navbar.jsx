

import { Bell, Search, User, Menu, Heart } from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import {useState} from "react";
import {useRouter} from "next/navigation";

const Navbar = ({ toggleSidebar, userProfile }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const mockNotifications = [
    { id: 1, title: "New medicine reminder", time: "2 min ago", type: "reminder" },
    { id: 2, title: "Symptom analysis complete", time: "1 hour ago", type: "analysis" },
    { id: 3, title: "Health tip updated", time: "Yesterday", type: "tip" }
  ];
  const router = useRouter();
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
          <span className="font-bold text-xl tracking-tight">HealthBuddy</span>
        </div>
      </div>


      {/* Right Actions */}
      <div className="flex items-center space-x-4">
<button 
          className="relative p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 group"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-6 w-6" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white group-hover:scale-110" />
        </button>
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mockNotifications.map(notif => (
                <div key={notif.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'reminder' ? 'bg-primary-500' : notif.type === 'analysis' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button className="w-full text-left p-2 rounded-xl hover:bg-gray-50 font-medium text-primary-600 text-sm">View all notifications</button>
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            {/* <p className="text-sm font-bold text-gray-900 leading-none mb-1">
              {userProfile?.full_name || "User"}
            </p> */}
          
          </div>
          <Avatar 
            src={userProfile?.avatar_url} 
            name={userProfile?.full_name} 
            size="md" 
            className="cursor-pointer border-2 border-white shadow-md ring-1 ring-gray-100"
            onClick={() => router.push("/profile")}
            
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
