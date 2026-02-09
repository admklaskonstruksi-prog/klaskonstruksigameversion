"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Users, BarChart3, Settings, LogOut 
} from "lucide-react";

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Manage Users", href: "/dashboard/users", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 fixed h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">KK</div>
            <span className="font-bold text-gray-800 text-lg">KlasKonstruksi</span>
         </div>
      </div>
      
      {/* User */}
      <div className="p-6 pb-2">
         <div className="flex items-center gap-3 mb-6 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
               {user.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
               <p className="text-sm font-bold text-gray-800 truncate">{user.fullName}</p>
               <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">Admin</span>
            </div>
         </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <item.icon size={18} /> {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
         <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"><LogOut size={18} /> Sign Out</button>
         </form>
      </div>
    </aside>
  );
}