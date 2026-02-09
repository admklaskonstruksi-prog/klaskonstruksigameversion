"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MonitorPlay, Loader2, AlertCircle } from "lucide-react";
import { completeMission, updateLessonProgress } from "../../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Library ID dari env (wajib sama dengan di Bunny Stream dashboard)
const getLibraryId = () =>
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "299616"
    : process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "299616";

// Normalisasi video_id (Bunny pakai GUID, kadang ada spasi/garis)
function normalizeVideoId(videoId: string | null | undefined): string {
  if (!videoId || typeof videoId !== "string") return "";
  return videoId.trim().replace(/\s/g, "");
}

export default function MissionTerminal({
  chapter,
  lessons,
}: {
  chapter: { id: string; title: string; level?: number };
  lessons: Array<{ id: string; title: string; description?: string; video_id?: string; duration?: number }>;
}) {
  const router = useRouter();
  const libraryId = getLibraryId();

  const [activeLesson, setActiveLesson] = useState(lessons[0] ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [watchedLessons, setWatchedLessons] = useState<Set<string>>(new Set());
  // Detik yang sudah ditonton per lesson (untuk progress berdasarkan durasi)
  const [watchedSecondsByLesson, setWatchedSecondsByLesson] = useState<Record<string, number>>({});
  const progressSyncRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  // Hitung progress: berdasarkan durasi jika ada, else berdasarkan jumlah video yang dibuka
  const getProgressPercent = useCallback(() => {
    if (lessons.length === 0) return 0;
    if (totalDuration > 0) {
      const watchedTotal = lessons.reduce((sum, l) => {
        const dur = l.duration || 0;
        const watched = watchedSecondsByLesson[l.id] ?? 0;
        return sum + Math.min(watched, dur);
      }, 0);
      return Math.min(99, Math.round((watchedTotal / totalDuration) * 100));
    }
    return Math.min(99, Math.round((watchedLessons.size / lessons.length) * 100));
  }, [lessons, totalDuration, watchedSecondsByLesson, watchedLessons.size]);

  const progressPercent = getProgressPercent();

  // Saat ganti video: tandai dibuka + mulai hitung durasi tontonan
  useEffect(() => {
    if (activeLesson && lessons.some((l) => l.id === activeLesson.id)) {
      setWatchedLessons((prev) => new Set(prev).add(activeLesson.id));
    }
  }, [activeLesson?.id, lessons]);

  // Timer: setiap 5 detik tambah 5 detik tontonan untuk video aktif (dibatasi oleh duration)
  useEffect(() => {
    if (!activeLesson || !libraryId) return;
    const duration = activeLesson.duration ?? 0;
    const interval = setInterval(() => {
      setWatchedSecondsByLesson((prev) => {
        const current = prev[activeLesson.id] ?? 0;
        const cap = duration > 0 ? duration : 999999;
        const next = Math.min(current + 5, cap);
        return { ...prev, [activeLesson.id]: next };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeLesson?.id, activeLesson?.duration, libraryId]);

  // Sync progress ke server (debounce)
  useEffect(() => {
    if (progressSyncRef.current) clearTimeout(progressSyncRef.current);
    progressSyncRef.current = setTimeout(() => {
      updateLessonProgress(chapter.id, progressPercent);
      progressSyncRef.current = null;
    }, 800);
    return () => {
      if (progressSyncRef.current) clearTimeout(progressSyncRef.current);
    };
  }, [progressPercent, chapter.id]);

  // Lesson dianggap "selesai ditonton" jika: durasi >= 80% atau tidak ada durasi dan sudah dibuka
  const isLessonWatched = (lesson: (typeof lessons)[0]) => {
    const dur = lesson.duration ?? 0;
    const watched = watchedSecondsByLesson[lesson.id] ?? 0;
    if (dur > 0) return watched >= dur * 0.8;
    return watchedLessons.has(lesson.id);
  };

  const isAllWatched =
    lessons.length > 0 && lessons.every((l) => isLessonWatched(l));

  const handleCompleteMission = async () => {
    if (!isAllWatched) return;
    setIsSubmitting(true);
    const result = await completeMission(chapter.id);
    if (result.success) {
      toast.success("MISSION ACCOMPLISHED!");
      router.push(`/dashboard/learning-path?justCompleted=${encodeURIComponent(chapter.id)}`);
    } else {
      toast.error("Gagal update status");
    }
    setIsSubmitting(false);
  };

  const videoId = activeLesson ? normalizeVideoId(activeLesson.video_id) : "";
  const hasValidVideo = Boolean(videoId && libraryId);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/learning-path"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-red-600/20 text-red-500 border border-red-600/30 px-2 py-0.5 rounded uppercase tracking-wider">
                Level {chapter.level ?? 1}
              </span>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">
                {chapter.title}
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">
              {isAllWatched
                ? "ALL OBJECTIVES CLEARED - READY TO COMPLETE"
                : "MISSION IN PROGRESS..."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative w-full aspect-video bg-black rounded-2xl border-2 border-gray-800 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {activeLesson ? (
              hasValidVideo ? (
                <iframe
                  key={videoId}
                  src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`}
                  loading="lazy"
                  className="w-full h-full border-none"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title={activeLesson.title}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-500" />
                  <p className="text-white font-mono text-sm">
                    Video belum tersedia atau Video ID tidak valid.
                  </p>
                  <p className="text-gray-500 text-xs font-mono">
                    Pastikan Video ID di modul benar dan Library ID (env: NEXT_PUBLIC_BUNNY_LIBRARY_ID) sesuai dashboard Bunny Stream.
                  </p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 font-mono">
                VIDEO SIGNAL LOST // PILIH OBJECTIVE
              </div>
            )}
          </div>

          <div className="mt-6 p-6 bg-[#120808] border border-red-900/20 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeLesson?.title || "Select a video"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {activeLesson?.description || "No description available."}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col h-full bg-[#120808] border-l border-white/5 lg:bg-transparent lg:border-none">
          <div className="flex items-center gap-2 mb-4 px-1">
            <MonitorPlay className="text-orange-500" size={18} />
            <h3 className="font-bold text-gray-300 uppercase tracking-wider text-sm">
              Objectives ({lessons.filter(isLessonWatched).length}/{lessons.length}) — {progressPercent}%
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {lessons.map((lesson, idx) => {
              const isActive = activeLesson?.id === lesson.id;
              const watched = isLessonWatched(lesson);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? "bg-red-900/20 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                      : "bg-[#1a0505] border-white/5 hover:border-white/10 hover:bg-[#200a0a]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  )}
                  <div className="flex gap-4">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        watched
                          ? "bg-green-600 text-white"
                          : isActive
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {watched ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold mb-1 line-clamp-2 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
                      >
                        {lesson.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] text-red-400 font-bold animate-pulse">
                          ● PLAYING NOW
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleCompleteMission}
              disabled={!isAllWatched || isSubmitting}
              className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                isAllWatched
                  ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 cursor-pointer"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} />
                  {isAllWatched
                    ? "MARK MISSION COMPLETE"
                    : "WATCH ALL VIDEOS"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
