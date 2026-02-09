'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, Loader2, BookOpen, Film, Layout, Pencil } from 'lucide-react';
import BunnyUploader from './BunnyUploader'; 
import { createChapter, updateChapter, deleteChapter, createLesson, deleteLesson } from '@/app/dashboard/courses/actions'; 
import toast from 'react-hot-toast'; 

interface Lesson {
  id: string; title: string; video_id: string; chapter_id: string; position: number;
}
interface Chapter {
  id: string; title: string; level: number; price: number; prerequisite_chapter_id?: string | null; position: number; lessons?: Lesson[];
}

interface LessonManagerProps { courseId: string; chapters: Chapter[]; }

export default function LessonManager({ courseId, chapters }: LessonManagerProps) {
  const router = useRouter();
  
  // States
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Chapter
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterLevel, setChapterLevel] = useState(1);
  const [chapterPrice, setChapterPrice] = useState<number | string>(0);
  const [chapterParentId, setChapterParentId] = useState('');

  // Form Lesson
  const [activeChapterId, setActiveChapterId] = useState(''); 
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [videoId, setVideoId] = useState('');

  const availableParents = chapters.filter((c) => (c.level || 1) === (chapterLevel - 1));

  // --- CHAPTER ACTIONS ---
  const openChapterModal = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapterId(chapter.id);
      setChapterTitle(chapter.title);
      setChapterLevel(chapter.level);
      setChapterPrice(chapter.price || 0);
      setChapterParentId(chapter.prerequisite_chapter_id || '');
    } else {
      setEditingChapterId(null);
      setChapterTitle(''); setChapterLevel(1); setChapterPrice(0); setChapterParentId('');
    }
    setIsChapterModalOpen(true);
  }

  const handleSaveChapter = async () => {
    if (!chapterTitle) return toast.error("Judul Modul wajib diisi");
    
    setLoading(true);
    try {
      const parent = chapterParentId === "" ? null : chapterParentId;
      const finalPrice = chapterPrice === "" ? 0 : Number(chapterPrice);

      let res;
      if (editingChapterId) {
        // ACTION EDIT
        res = await updateChapter(editingChapterId, courseId, { 
          title: chapterTitle, level: chapterLevel, price: finalPrice, prerequisite_chapter_id: parent 
        });
      } else {
        // ACTION CREATE
        res = await createChapter(courseId, chapterTitle, chapterLevel, finalPrice, parent);
      }

      if (res.error) toast.error(res.error);
      else {
        toast.success(editingChapterId ? "Modul diupdate!" : "Modul dibuat!");
        setIsChapterModalOpen(false);
        router.refresh();
      }
    } catch { toast.error("Error sistem"); } 
    finally { setLoading(false); }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Hapus Modul ini? Video di dalamnya akan hilang!")) return;
    const toastId = toast.loading("Menghapus modul...");
    await deleteChapter(id, courseId);
    toast.success("Modul dihapus", { id: toastId });
    router.refresh();
  };

  // --- LESSON ACTIONS ---
  const handleCreateLesson = async () => {
    if (!lessonTitle || !videoId) return toast.error("Judul dan Video wajib diisi");
    setLoading(true);
    try {
      const res = await createLesson(activeChapterId, courseId, lessonTitle, videoId, lessonDesc);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Video ditambahkan!");
        setIsLessonModalOpen(false);
        router.refresh();
      }
    } catch { toast.error("Error sistem"); } 
    finally { setLoading(false); }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Hapus video ini?")) return;
    const tId = toast.loading("Menghapus...");
    await deleteLesson(id, courseId);
    toast.success("Video dihapus", { id: tId });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kurikulum & Harga</h2>
          <p className="text-sm text-gray-500">Atur modul, harga per modul, dan materi video.</p>
        </div>
        <button type="button" onClick={() => openChapterModal()} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg flex gap-2 items-center">
          <Layout className="w-4 h-4" /> Buat Modul Baru
        </button>
      </div>

      <div className="space-y-6">
        {chapters.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada modul.</p>
          </div>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg"><Layout className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {chapter.title}
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Level {chapter.level}</span>
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      {chapter.price > 0 
                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(chapter.price) 
                        : 'Gratis'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setActiveChapterId(chapter.id); setLessonTitle(''); setVideoId(''); setIsLessonModalOpen(true); }} className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-50 flex items-center gap-1 font-medium"><Plus className="w-3 h-3" /> Video</button>
                  <button type="button" onClick={() => openChapterModal(chapter)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => handleDeleteChapter(chapter.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="divide-y">
                {chapter.lessons?.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition pl-12">
                    <div className="flex items-center gap-3"><GripVertical className="w-4 h-4 text-gray-300" /><Film className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-medium">{lesson.title}</span></div>
                    <button type="button" onClick={() => handleDeleteLesson(lesson.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CHAPTER */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">{editingChapterId ? "Edit Modul" : "Buat Modul Baru"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Modul</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} />
              </div>
              
              {/* INPUT HARGA (Bisa dihapus jadi kosong) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Harga Modul (IDR)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg mt-1" 
                  value={chapterPrice} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setChapterPrice(val === "" ? "" : Number(val));
                  }} 
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Level</label><select className="w-full p-2 border rounded-lg mt-1" value={chapterLevel} onChange={e => {setChapterLevel(Number(e.target.value)); setChapterParentId('');}}>{[1,2,3,4,5].map(l => <option key={l} value={l}>Level {l}</option>)}</select></div>
                <div><label className="text-sm font-medium text-gray-700">Syarat</label><select className="w-full p-2 border rounded-lg mt-1 disabled:bg-gray-100" value={chapterParentId} onChange={e => setChapterParentId(e.target.value)} disabled={chapterLevel === 1}><option value="">{chapterLevel === 1 ? "-" : "-- Pilih --"}</option>{availableParents.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setIsChapterModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
              <button type="button" onClick={handleSaveChapter} disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded-lg flex gap-2 items-center">{loading && <Loader2 className="animate-spin w-4 h-4" />} Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LESSON (REVISI: Tulisan Bunny.net dihapus) */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6">
            <h3 className="text-lg font-bold mb-4">Tambah Video Materi</h3>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700">Judul Video</label><input type="text" className="w-full p-2 border rounded-lg mt-1" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} /></div>
              <div><label className="text-sm font-medium text-gray-700">Deskripsi</label><textarea className="w-full p-2 border rounded-lg mt-1 h-20" value={lessonDesc} onChange={e => setLessonDesc(e.target.value)} /></div>
              <div>
                {/* REVISI DISINI: Label diubah */}
                <label className="text-sm font-medium text-gray-700 mb-2 block">ID Video Materi</label>
                {videoId ? <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg flex justify-between"><span>Video Ready: {videoId}</span><button onClick={() => setVideoId('')} className="text-xs underline text-red-500">Ubah</button></div> : <BunnyUploader onUploadComplete={setVideoId} />}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setIsLessonModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
              <button type="button" onClick={handleCreateLesson} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex gap-2 items-center">{loading && <Loader2 className="animate-spin w-4 h-4" />} Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}