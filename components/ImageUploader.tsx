'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const toastId = toast.loading("Mengupload gambar...");

      // 1. Buat nama file unik (timestamp + random)
      // Ini menjamin gambar selalu baru tanpa perlu trik ?t= di url tampilan
      const fileExt = file.name.split('.').pop();
      const fileName = `thumbnails/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

      // 2. Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('course-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Ambil Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-assets')
        .getPublicUrl(fileName);

      // 4. Simpan URL
      onChange(publicUrl);
      toast.success("Gambar berhasil diupload!", { id: toastId });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Gagal upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      
      {value ? (
        // TAMPILAN JIKA GAMBAR ADA
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm group">
          <Image 
            fill 
            src={value} // REVISI: Hapus ?t=... agar tidak error hydration
            alt="Thumbnail Course" 
            className="object-cover" 
          />
          
          {/* Tombol Hapus / Ganti */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onChange('')}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition px-4 flex gap-2 items-center shadow-lg transform hover:scale-105"
              type="button"
            >
              <X className="w-4 h-4" />
              <span>Ganti Gambar</span>
            </button>
          </div>
        </div>
      ) : (
        // TAMPILAN AREA UPLOAD (KOSONG)
        <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition relative group">
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm text-blue-600 font-medium">Sedang mengupload...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition duration-200">
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-blue-600 hover:underline">Klik upload</span> atau drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Format JPG, PNG (Rasio 16:9)
                </p>
              </>
            )}
          </div>
          
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading} 
          />
        </label>
      )}
    </div>
  );
}