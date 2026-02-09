'use client';

import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface BunnyUploaderProps {
  onUploadComplete?: (videoId: string) => void;
}

// PERHATIKAN: Ada kata 'default' di sini!
export default function BunnyUploader({ onUploadComplete }: BunnyUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatus('idle');

    try {
      const initRes = await fetch('/api/bunny/create', {
        method: 'POST',
        body: JSON.stringify({ title: file.name }),
      });

      if (!initRes.ok) throw new Error('Gagal inisialisasi upload');
      
      const { videoId, apiKey, libraryId } = await initRes.json();

      if (!videoId || !apiKey || !libraryId) throw new Error('Data config tidak lengkap');

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, true);
      
      xhr.setRequestHeader('AccessKey', apiKey);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setStatus('success');
          setUploading(false);
          if (onUploadComplete) onUploadComplete(videoId);
        } else {
          console.error('Bunny Reject:', xhr.responseText);
          setStatus('error');
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setStatus('error');
        setUploading(false);
      };

      xhr.send(file);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setUploading(false);
    }
  };

  return (
    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-center">
      {!uploading && status === 'idle' && (
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Klik untuk Upload Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
        </label>
      )}

      {uploading && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">Uploading... {progress}%</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-2 text-green-600">
          <CheckCircle className="w-8 h-8" />
          <span className="text-sm font-bold">Upload Berhasil!</span>
          <span className="text-xs text-gray-500">Jangan lupa klik "Add Lesson" di bawah</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-2 text-red-500">
          <XCircle className="w-8 h-8" />
          <span className="text-sm font-bold">Gagal Mengupload</span>
          <button onClick={() => setStatus('idle')} className="text-xs underline">Coba Lagi</button>
        </div>
      )}
    </div>
  );
}