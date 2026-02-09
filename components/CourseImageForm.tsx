'use client';

import { useState } from 'react';
// Karena satu folder, kita panggil pakai titik slash (./)
import ImageUploader from './ImageUploader'; 

interface CourseImageFormProps {
  initialUrl: string;
}

export default function CourseImageForm({ initialUrl }: CourseImageFormProps) {
  const [url, setUrl] = useState(initialUrl || '');

  return (
    <div className="space-y-2">
      <ImageUploader 
        label="Cover / Thumbnail Kursus" 
        value={url} 
        onChange={(newUrl) => setUrl(newUrl)} 
      />
      {/* Input hidden untuk kirim data ke Server Action */}
      <input type="hidden" name="thumbnail_url" value={url} />
    </div>
  );
}