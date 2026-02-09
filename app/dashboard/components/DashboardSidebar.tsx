"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Map, Settings, LogOut, Sword, Crown
} from "lucide-react";

interface DashboardSidebarProps {
  user: {
    fullName: string;
    role: string;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  // Helper untuk cek active state (termasuk sub-path)
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-72 fixed h-full bg-[#120808] border-r border-red-900/30 hidden md:flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      
      {/* Logo Area */}
      <div className="h-24 flex items-center px-8 border-b border-red-900/20 bg-[url('/grid-pattern.png')] bg-opacity-10">
         <div className="flex items-center gap-2">
            <span className="font-black text-xl uppercase tracking-wider text-white drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
              Klas<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Konstruksi</span>
            </span>
         </div>
      </div>

      {/* User Stats (Character Profile) */}
      <div className="p-6 border-b border-red-900/20 bg-gradient-to-b from-[#1a0505] to-transparent relative overflow-hidden">
         {/* Dekorasi Background Glow */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none"></div>

         <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-600 to-red-700 p-0.5 shadow-[0_0_20px_rgba(234,88,12,0.4)]">
               <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center overflow-hidden border border-white/10">
                  <Sword size={28} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
               </div>
            </div>
            <div className="overflow-hidden">
               <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user.fullName}</p>
               <div className="flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                    {user.role === 'admin' ? 'Game Master' : 'Online'}
                 </p>
               </div>
            </div>
         </div>
         
         {/* XP Bar */}
         <div className="relative z-10">
           <div className="flex justify-between text-[10px] text-orange-200/60 font-mono mb-1">
              <span>LVL 1 NOVICE</span>
              <span>450 / 1000 XP</span>
           </div>
           <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-red-900/30">
              <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 w-[45%] shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
           </div>
         </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto">
        <div className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-900/80 mb-3">Main Menu</div>
        
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Marketplace" 
          active={isActive("/dashboard") && pathname === "/dashboard"} 
        />
        
        {/* REVISI: Mengembalikan label menjadi 'My Learning Path' */}
        {user.role !== 'admin' && (
           <NavItem 
             href="/dashboard/learning-path" 
             icon={<Map size={20} />} 
             label="My Learning Path" 
             active={isActive("/dashboard/learning-path")} 
           />
        )}
        
        {user.role === 'admin' && (
           <>
              <div className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-900/80 mb-3 mt-8">GM Tools</div>
              <NavItem href="/dashboard/courses/create" icon={<Crown size={20} />} label="Create Quest" active={isActive("/dashboard/courses/create")} />
           </>
        )}

        <div className="mt-8">
           {/* Opsional: Kembalikan nama 'System Config' jadi 'Settings' jika mau */}
           <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" active={isActive("/dashboard/settings")} />
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-red-900/20 bg-[#0f0505] relative">
        <form action="/auth/signout" method="post"> 
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500/70 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-widest group border border-transparent hover:border-red-900/30">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Disconnect
          </button>
        </form>
      </div>
    </aside>
  );
}

// Komponen Item Menu dengan Efek Active Glow
function NavItem({ href, icon, label, active }: any) {
  return (
    <Link href={href} className={`
      relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300 group overflow-hidden rounded-xl mx-2
      ${active 
        ? 'text-white bg-gradient-to-r from-red-900/80 to-transparent border-l-4 border-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.3)]' 
        : 'text-gray-500 hover:text-red-200 hover:bg-white/5 border-l-4 border-transparent'
      }
    `}>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-50 blur-sm"></div>
      )}

      <span className={`relative z-10 transition-all duration-300 ${active ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] scale-110' : 'group-hover:text-red-500'}`}>
        {icon}
      </span>

      <span className={`relative z-10 font-bold text-xs uppercase tracking-widest transition-all duration-300 ${active ? 'translate-x-1' : ''}`}>
        {label}
      </span>

      <div className={`absolute right-2 w-1.5 h-1.5 rounded-full bg-red-500 transition-all duration-300 ${active ? 'opacity-100 shadow-[0_0_10px_red]' : 'opacity-0 group-hover:opacity-50'}`}></div>
    </Link>
  )
}