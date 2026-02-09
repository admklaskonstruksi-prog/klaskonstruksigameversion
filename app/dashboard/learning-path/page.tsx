import { createClient } from "@/utils/supabase/server";
import { Play, Check, MapPin, Film } from "lucide-react";
import Link from "next/link";
import MissionCompleteModal from "./MissionCompleteModal";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LearningPathPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const resolvedSearchParams = await searchParams;
  const justCompletedChapterId =
    typeof resolvedSearchParams.justCompleted === "string"
      ? resolvedSearchParams.justCompleted
      : null;

  // Fetch Enrollments dengan progress
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      progress,
      status,
      chapter_id,
      chapters (
        id,
        title,
        level,
        courses (
          id,
          title
        )
      )
    `)
    .eq("user_id", user?.id)
    .not('chapter_id', 'is', null); 

  if (error) console.error("Error path:", error);

  const myPath = enrollments?.map((e: any) => ({
    id: e.chapters.id,
    title: e.chapters.title,
    courseId: e.chapters.courses?.id,
    level: e.chapters.level,
    courseTitle: e.chapters.courses?.title,
    progress: e.progress || 0,
    status: e.status || "active"
  })).sort((a, b) => a.level - b.level) || [];

  // Modul berikutnya dalam course yang sama (untuk popup setelah mission complete)
  let nextChapterInCourse: {
    id: string;
    title: string;
    courseTitle: string;
    courseId: string;
    level: number;
    price: number;
    owned: boolean;
  } | null = null;

  if (justCompletedChapterId) {
    const completed = myPath.find((p) => p.id === justCompletedChapterId);
    const courseId = completed?.courseId;
    if (courseId) {
      const { data: allChaptersInCourse } = await supabase
        .from("chapters")
        .select("id, title, level, price, position, courses ( id, title )")
        .eq("course_id", courseId)
        .order("level", { ascending: true })
        .order("position", { ascending: true });
      const list = allChaptersInCourse ?? [];
      const idx = list.findIndex((c: any) => c.id === justCompletedChapterId);
      const nextChapter = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
      const enrolledChapterIds = new Set(myPath.map((p) => p.id));
      if (nextChapter) {
        nextChapterInCourse = {
          id: nextChapter.id,
          title: nextChapter.title,
          courseTitle: nextChapter.courses?.title ?? "",
          courseId: nextChapter.courses?.id ?? courseId,
          level: nextChapter.level ?? 0,
          price: nextChapter.price ?? 0,
          owned: enrolledChapterIds.has(nextChapter.id),
        };
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <MissionCompleteModal
        nextChapterInCourse={nextChapterInCourse}
        justCompletedChapterId={justCompletedChapterId}
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
          <MapPin className="text-red-500" /> Mission Map
        </h1>
        <p className="text-gray-500 font-mono text-sm">Your journey and progress tracker.</p>
      </div>

      {myPath.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-800 rounded-2xl p-12 bg-[#120808]">
           <p className="text-gray-500 mb-6 font-mono">No active missions found.</p>
           <Link href="/dashboard" className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl uppercase text-sm tracking-wider hover:bg-red-500 transition shadow-[0_0_20px_rgba(220,38,38,0.4)]">
             Go to Marketplace
           </Link>
        </div>
      ) : (
        <div className="relative pl-8 md:pl-0">
          {/* Garis Tengah */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-900/50 via-red-900/20 to-transparent -translate-x-1/2 z-0"></div>

          <div className="space-y-16 relative z-10">
            {myPath.map((item, index) => (
              <div key={item.id} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Card Content */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 group hover:scale-105 ${
                    item.status === 'completed' 
                        ? 'bg-[#0f291e] border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
                        : 'bg-[#1a0f0f] border-red-900/30 hover:border-red-500/50 shadow-lg'
                  }`}>
                    
                    {/* Level Label */}
                    <div className={`absolute -top-3 ${index % 2 === 0 ? 'md:right-6 right-auto left-6' : 'left-6'} px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-[#0a0505] border border-gray-700 text-gray-400`}>
                        Level {item.level}
                    </div>

                    <h3 className="text-lg font-bold uppercase mb-1 mt-2 text-white">{item.title}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">{item.courseTitle}</p>
                    
                    {/* --- PROGRESS BAR SECTION --- */}
                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                            <span>Progress</span>
                            <span className={item.status === 'completed' ? 'text-green-500' : 'text-orange-500'}>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-black h-2 rounded-full border border-white/5 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${item.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-red-600 to-orange-500'}`} 
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 ${index % 2 === 0 ? 'md:justify-end justify-start' : 'justify-start'}`}>
                      {item.status === 'completed' ? (
                         <>
                           <div className="px-6 py-2 bg-green-900/20 border border-green-600/50 text-green-400 font-bold rounded-lg uppercase text-xs tracking-wider flex items-center gap-2">
                             <Check size={16} /> Mission Complete
                           </div>
                           <Link
                             href={`/dashboard/play/${item.id}`}
                             className="px-6 py-2.5 bg-white/5 border border-white/20 text-white font-bold rounded-lg uppercase text-xs tracking-wider hover:bg-green-600 hover:border-green-600 hover:text-white transition flex items-center gap-2"
                           >
                             <Film size={12} /> Lihat Video
                           </Link>
                         </>
                      ) : (
                         <Link 
                           href={`/dashboard/play/${item.id}`} 
                           className="px-6 py-2.5 bg-white/5 border border-white/20 text-white font-bold rounded-lg uppercase text-xs tracking-wider hover:bg-orange-600 hover:border-orange-600 hover:text-white transition flex items-center gap-2 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                         >
                           <Play size={12} fill="currentColor" /> {item.progress > 0 ? "Continue Mission" : "Start Mission"}
                         </Link>
                      )}
                    </div>

                  </div>
                </div>

                {/* Center Node (Bulatan Tengah) */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-sm z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                     item.status === 'completed' ? 'bg-green-500 border-green-900 text-black scale-110' :
                     'bg-[#120808] border-red-900 text-red-500 group-hover:border-red-500 group-hover:text-red-400'
                  }`}>
                     {item.status === 'completed' ? <Check size={20} /> : index + 1}
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}