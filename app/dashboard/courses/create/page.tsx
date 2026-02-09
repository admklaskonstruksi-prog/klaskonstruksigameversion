'use client';

import { useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import { createCourse } from "../actions"; 
import ImageUploader from '@/components/ImageUploader'; 

export default function CreateCoursePage() {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // State untuk pesan error

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrorMsg(''); // Reset error
    
    try {
      // Panggil Server Action
      const result = await createCourse(formData);
      
      // Jika server mengembalikan object error, tampilkan
      if (result?.error) {
        setErrorMsg(result.error);
        setLoading(false); // Stop loading biar bisa coba lagi
      }
      // Jika sukses, dia akan otomatis Redirect (pindah halaman)
      // Jadi kita tidak perlu set loading false (karena halaman ganti)
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan sistem. Coba refresh halaman.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/courses" 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500">Isi data dasar kursus Anda di sini.</p>
        </div>
      </div>

      {/* ALERT ERROR (Jika Gagal) */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM */}
      <form action={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kursus *</label>
          <input
            name="title"
            placeholder="Contoh: Belajar Menghitung RAB Dasar"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
          <textarea
            name="description"
            placeholder="Jelaskan apa yang akan dipelajari murid..."
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
          />
        </div>

        {/* Publish */}
        <div className="flex items-center p-4 border rounded-lg bg-gray-50">
          <label className="flex items-center gap-3 cursor-pointer w-full">
            <input
              type="checkbox"
              name="is_published"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="block font-medium text-gray-900">Langsung Publish?</span>
              <span className="text-xs text-gray-500">Kursus akan langsung tampil di katalog.</span>
            </div>
          </label>
        </div>

        {/* IMAGE UPLOADER */}
        <div>
          <ImageUploader 
            label="Cover Kursus / Thumbnail" 
            value={thumbnailUrl} 
            onChange={setThumbnailUrl} 
          />
          <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Course
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}