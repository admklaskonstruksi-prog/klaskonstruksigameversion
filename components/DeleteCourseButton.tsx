'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { deleteCourse } from '@/app/dashboard/courses/actions';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus KURSUS ini beserta semua materinya? Tindakan ini tidak bisa dibatalkan.")) return;

    setLoading(true);
    const toastId = toast.loading("Menghapus kursus...");

    try {
      const res = await deleteCourse(courseId);
      if (res.error) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success("Kursus berhasil dihapus", { id: toastId });
        // Halaman akan otomatis refresh berkat revalidatePath di server action
      }
    } catch (error) {
      toast.error("Gagal menghapus", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
      title="Hapus Kursus"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}