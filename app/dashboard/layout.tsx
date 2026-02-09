import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardSidebar from "@/app/dashboard/components/DashboardSidebar"; 
import AdminSidebar from "@/app/dashboard/components/AdminSidebar"; 

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Ambil Profile Data
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .single();

  // --- PERBAIKAN LOGIC (PENTING) ---
  // Masalah Anda: ID di Auth berbeda dengan ID di Database Profile.
  // Solusi: Kita cek langsung Email-nya. Jika email admin, paksa jadi Admin.
  
  const isAdminEmail = user.email === "admin@klaskonstruksi.com"; // Cek Email Langsung
  const isDbAdmin = profile?.role === "admin";                    // Cek Database (Backup)
  
  // Jika salah satu benar, maka dia Admin
  const isAdmin = isAdminEmail || isDbAdmin;

  const userData = {
    fullName: profile?.full_name || user.email?.split("@")[0] || "Admin",
    email: user.email,
    role: isAdmin ? "admin" : "student"
  };

  // --- PEMISAH TAMPILAN ---

  if (isAdmin) {
    // === TAMPILAN ADMIN (LIGHT MODE / PUTIH) ===
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex font-sans">
        {/* Sidebar Admin (Putih) */}
        <AdminSidebar user={userData} />
        
        {/* Konten Utama Admin */}
        <main className="flex-1 md:ml-64 p-8 relative min-h-screen transition-all">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    );
  } 
  
  // === TAMPILAN STUDENT (DARK / GAMING MODE) ===
  return (
    <div className="min-h-screen bg-[#0a0505] text-white flex font-sans selection:bg-red-500 selection:text-white">
      {/* Sidebar Student (Hitam) */}
      <DashboardSidebar user={userData} />

      {/* Konten Utama Student */}
      <main className="flex-1 md:ml-72 p-8 relative min-h-screen transition-all duration-300 ease-in-out">
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#2a1010_1px,transparent_1px),linear-gradient(to_bottom,#2a1010_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.07] pointer-events-none z-0"></div>
          <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
            {children}
          </div>
      </main>
    </div>
  );
}