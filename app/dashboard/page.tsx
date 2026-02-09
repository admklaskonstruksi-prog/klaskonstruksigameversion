import { createClient } from "@/utils/supabase/server";
import { BookOpen, Users, DollarSign, UserCheck } from "lucide-react"; // Removed TrendingUp unused
import StudentMarketplace from "@/app/dashboard/components/StudentMarketplace";
import Link from "next/link";
import RevenueChart from "@/app/dashboard/components/RevenueChart";

// --- KOMPONEN BANTUAN KHUSUS ADMIN (Light Theme) ---
function AdminStatCard({ title, value, icon: Icon, iconBg, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function AdminQuickAction({ title, desc, href, bgClass, textClass, borderClass }: any) {
  return (
    <Link href={href} className={`block p-6 rounded-2xl border ${bgClass} ${borderClass} hover:opacity-90 transition-opacity`}>
      <h3 className={`font-bold text-lg mb-1 ${textClass}`}>{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Profile & Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user?.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  // ==========================================
  // LOGIC TAMPILAN ADMIN (Stats & Actions)
  // ==========================================
  if (isAdmin) {
    // KITA FETCH DATA DARI TABEL 'PURCHASES' UNTUK REVENUE
    const [coursesRes, usersRes, enrollmentsRes, purchasesRes] = await Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("enrollments").select("user_id"), // Hanya butuh user_id untuk hitung active learners
      supabase.from("purchases").select("amount, created_at") // <-- SUMBER REVENUE BARU
    ]);

    // 1. Hitung Active Learners (Unique Users di Enrollments)
    const activeLearnerIds = new Set(enrollmentsRes.data?.map((e: any) => e.user_id));
    const activeLearners = activeLearnerIds.size;

    // 2. Hitung Total Revenue (Sum amount dari purchases)
    const purchases = purchasesRes.data ?? [];
    const totalRevenue = purchases.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

    // 3. Siapkan Data untuk Grafik (6 Bulan Terakhir)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const last6Months: { label: string; revenue: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      // Tentukan bulan yang dicek
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const targetYear = d.getFullYear();
      const targetMonth = d.getMonth();

      // Filter purchase yang terjadi di bulan & tahun tersebut
      const monthRevenue = purchases.reduce((sum: number, p: any) => {
        const created = new Date(p.created_at);
        if (created.getFullYear() === targetYear && created.getMonth() === targetMonth) {
          return sum + (Number(p.amount) || 0);
        }
        return sum;
      }, 0);

      last6Months.push({ 
        label: `${monthNames[targetMonth]} ${targetYear}`, 
        revenue: monthRevenue 
      });
    }

    const stats = {
      courses: coursesRes.count ?? 0,
      users: usersRes.count ?? 0,
      activeLearners,
      revenue: totalRevenue,
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your KlasKonstruksi platform from this dashboard.</p>
        </div>

        {/* Grafik Revenue */}
        <RevenueChart data={last6Months} />

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard 
            title="Total Courses" 
            value={stats.courses} 
            icon={BookOpen} 
            iconBg="bg-blue-50" 
            iconColor="text-blue-600" 
          />
          <AdminStatCard 
            title="Total Users" 
            value={stats.users} 
            icon={Users} 
            iconBg="bg-green-50" 
            iconColor="text-green-600" 
          />
          <AdminStatCard 
            title="Active Learners" 
            value={stats.activeLearners} 
            icon={UserCheck} 
            iconBg="bg-purple-50" 
            iconColor="text-purple-600" 
          />
          <AdminStatCard 
            title="Total Revenue" 
            value={`Rp ${stats.revenue.toLocaleString("id-ID")}`} 
            icon={DollarSign} 
            iconBg="bg-yellow-50" 
            iconColor="text-yellow-600" 
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminQuickAction 
              title="Create New Course" 
              desc="Add a new course to the platform"
              href="/dashboard/courses"
              bgClass="bg-blue-50"
              borderClass="border-blue-100"
              textClass="text-blue-700"
            />
            <AdminQuickAction 
              title="Manage Users" 
              desc="View and manage all users"
              href="/dashboard/users"
              bgClass="bg-green-50"
              borderClass="border-green-100"
              textClass="text-green-700"
            />
            <AdminQuickAction 
              title="View Analytics" 
              desc="Monitor platform performance"
              href="/dashboard/analytics"
              bgClass="bg-purple-50"
              borderClass="border-purple-100"
              textClass="text-purple-700"
            />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIC TAMPILAN STUDENT (Gaming Marketplace)
  // ==========================================
  
  // A. Ambil CHAPTERS (Item yang dijual)
  const { data: allChapters, error: chapterError } = await supabase
    .from("chapters")
    .select(`
      *,
      courses (
        title,
        thumbnail_url
      )
    `)
    .order("course_id", { ascending: true }) 
    .order("level", { ascending: true });

  if (chapterError) {
    console.error("Error fetching chapters:", chapterError.message);
  }

  // B. Cek Chapter mana yang SUDAH DIBELI (Berdasarkan chapter_id)
  const { data: myEnrollments } = await supabase
    .from("enrollments") 
    .select("chapter_id") 
    .eq("user_id", user?.id);

  const enrolledChapterIds = new Set(myEnrollments?.map((e) => e.chapter_id)); 
  
  // C. Mapping Data untuk UI Marketplace
  const marketplaceItems = allChapters?.map((chapter: any, index: number) => ({
      id: chapter.id,
      title: chapter.title,           
      courseTitle: chapter.courses?.title || "Unknown Course",
      courseId: chapter.course_id, 
      price: chapter.price || 0,
      level: chapter.level || (index + 1),
      image_url: chapter.courses?.thumbnail_url || null, 
      
      // Owned jika ID Chapter ada di daftar enrollments
      owned: enrolledChapterIds.has(chapter.id), 
      
      imageColor: `bg-${['blue','green','yellow','red'][index % 4] || 'blue'}-900` 
  })) || [];

  return (
    <div>
      {/* Header Student (Gaming Theme) */}
      <div className="mb-10 relative">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{userName}</span>
        </h1>
        <p className="text-gray-400 mt-1 font-mono text-sm">
          &gt;&gt; STUDENT TERMINAL: ONLINE
        </p>
      </div>

      {/* Konten Marketplace */}
      <StudentMarketplace items={marketplaceItems} />
    </div>
  );
}