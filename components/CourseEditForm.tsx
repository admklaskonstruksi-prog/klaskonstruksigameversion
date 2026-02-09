'use client';

import { useState } from 'react';
import { updateCourse } from '@/app/dashboard/courses/actions'; 
import CourseImageForm from './CourseImageForm'; 
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Props menerima children
export default function CourseEditForm({ course, children }: { course: any, children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const toastId = toast.loading("Menyimpan data...");
    
    // Hapus Harga dari sini (karena pindah ke modul)
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const is_published = formData.get('is_published') === 'on';

    const result = await updateCourse(course.id, {
      title, description, thumbnail_url, is_published
    });

    setLoading(false);

    if (result?.error) {
      toast.error(result.error, { id: toastId });
    } else {
      toast.success("Perubahan berhasil disimpan!", { id: toastId });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* 1. BAGIAN ATAS: INFORMASI DASAR */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Informasi Dasar</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kursus</label>
          <input name="title" defaultValue={course.title} className="w-full p-2 border rounded-lg font-semibold text-lg" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" defaultValue={course.description} className="w-full p-2 border rounded-lg h-32" />
        </div>

        <CourseImageForm initialUrl={course.thumbnail_url} />

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
          <input type="checkbox" name="is_published" defaultChecked={course.is_published} className="w-5 h-5 text-blue-600 rounded" />
          <span className="font-medium text-gray-900">Publish Kursus Ini</span>
        </div>
      </div>

      {/* 2. BAGIAN TENGAH: KURIKULUM (Disisipkan lewat children) */}
      {children}

      {/* 3. BAGIAN BAWAH: TOMBOL SIMPAN */}
      <div className="sticky bottom-4 z-10">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-6 h-6 animate-spin" />}
          {loading ? "Menyimpan..." : "SIMPAN SEMUA PERUBAHAN"}
        </button>
      </div>
    </form>
  );
}