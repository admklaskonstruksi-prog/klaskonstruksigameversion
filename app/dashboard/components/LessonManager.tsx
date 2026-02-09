"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Video, Edit2, GripVertical, Save, X, Search, Film, UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import BunnyUploader from "@/components/BunnyUploader";
import { deleteLesson, saveLesson } from "@/app/dashboard/courses/actions";
import { getBunnyVideos, BunnyVideo } from "../actions/bunnyUtils";

// Helper format durasi
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function LessonManager({
  chapterId,
  initialLessons,
}: {
  chapterId: string;
  initialLessons: any[];
}) {
  const [lessons, setLessons] = useState(initialLessons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Tab State (Upload vs Library)
  const [sourceTab, setSourceTab] = useState<"upload" | "library">("upload");
  const [libraryVideos, setLibraryVideos] = useState<BunnyVideo[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const LIB_ID = "587133"; // Library ID Bunny.net Anda

  // Auto fetch library saat tab dibuka
  useEffect(() => {
    if (sourceTab === "library" && libraryVideos.length === 0) {
      fetchLibrary();
    }
  }, [sourceTab]);

  const fetchLibrary = async (query = "") => {
    setIsLoadingLibrary(true);
    const result = await getBunnyVideos(query);
    if (result.success && result.data) {
      setLibraryVideos(result.data);
    } else {
      toast.error("Gagal memuat library.");
    }
    setIsLoadingLibrary(false);
  };

  const handleOpenModal = (lesson?: any) => {
    if (lesson) {
      setEditingLesson(lesson);
      setTitle(lesson.title);
      setDescription(lesson.description || "");
      setVideoId(lesson.video_id);
      setSourceTab("library"); // Default ke library jika edit
    } else {
      setEditingLesson(null);
      setTitle("");
      setDescription("");
      setVideoId("");
      setSourceTab("upload");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!title || !videoId) {
      toast.error("Judul dan Video wajib diisi!");
      return;
    }
    setIsSaving(true);
    try {
      const result = await saveLesson(chapterId, {
        id: editingLesson?.id,
        title,
        description,
        video_id: videoId,
      });

      if (result.success) {
        toast.success("Berhasil disimpan!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        toast.error("Gagal: " + result.error);
      }
    } catch (e) {
      toast.error("Error sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus video ini?")) return;
    const result = await deleteLesson(id);
    if (result.success) {
      setLessons(lessons.filter((l) => l.id !== id));
      toast.success("Terhapus.");
    }
  };

  return (
    <div className="mt-4">
      {/* List Lessons */}
      <div className="space-y-3">
        {lessons.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 text-sm">
            Belum ada materi video di chapter ini.
          </div>
        )}

        {lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="cursor-move text-gray-400"><GripVertical size={18} /></div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                <Video size={18} />
              </div>
              <div className="truncate">
                <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Film size={10} /> {lesson.video_id ? 'Video Terlampir' : 'No Video'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenModal(lesson)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(lesson.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => handleOpenModal()} className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition font-medium">
        <Plus size={18} /> Tambah Video Materi
      </button>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{editingLesson ? "Edit Materi" : "Tambah Materi"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Video 1..." value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              {/* --- BAGIAN TAB (TOMBOL PILIHAN) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Video</label>
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                  <button onClick={() => setSourceTab("upload")} className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition ${sourceTab === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
                    <UploadCloud size={16} /> Upload Baru
                  </button>
                  <button onClick={() => setSourceTab("library")} className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition ${sourceTab === "library" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
                    <Film size={16} /> Pilih dari Library
                  </button>
                </div>

                {/* Content Tab Upload */}
                {sourceTab === "upload" && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
                    {videoId ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2"><CheckCircle size={32} /></div>
                        <p className="text-green-700 font-medium">Video Terupload!</p>
                        <p className="text-xs text-gray-500 mb-4">ID: {videoId}</p>
                        <button onClick={() => setVideoId("")} className="text-sm text-red-500 underline">Ganti Video</button>
                      </div>
                    ) : (
                      <BunnyUploader onUploadComplete={(id) => setVideoId(id)} />
                    )}
                  </div>
                )}

                {/* Content Tab Library */}
                {sourceTab === "library" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                      <input type="text" placeholder="Cari video..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') fetchLibrary(searchQuery) }} />
                    </div>
                    
                    <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 custom-scrollbar p-2 grid grid-cols-2 gap-2">
                      {isLoadingLibrary ? (
                        <div className="col-span-2 flex items-center justify-center h-40 text-gray-400"><Loader2 className="animate-spin mr-2" /> Memuat...</div>
                      ) : libraryVideos.length === 0 ? (
                        <div className="col-span-2 flex items-center justify-center h-40 text-gray-400 text-sm">Tidak ada video.</div>
                      ) : (
                        libraryVideos.map((video) => (
                          <div key={video.guid} onClick={() => setVideoId(video.guid)} className={`cursor-pointer rounded-lg border p-2 hover:shadow-md transition relative ${videoId === video.guid ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}>
                            <div className="aspect-video bg-black rounded overflow-hidden relative mb-2">
                              <img src={`https://vz-${LIB_ID}.b-cdn.net/${video.guid}/${video.thumbnailFileName}`} alt={video.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/placeholder-video.png")} />
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">{formatDuration(video.length)}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-800 line-clamp-2">{video.title}</p>
                            {videoId === video.guid && <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5"><CheckCircle size={12} /></div>}
                          </div>
                        ))
                      )}
                    </div>
                    {videoId && <p className="text-xs text-green-600 font-medium text-right">Video ID: {videoId}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />} Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}