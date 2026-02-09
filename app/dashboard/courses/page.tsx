import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { PlusCircle, Pencil, BookOpen } from 'lucide-react';
import Image from 'next/image';
import DeleteCourseButton from '@/components/DeleteCourseButton';

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500">Kelola semua materi kursus Anda di sini.</p>
        </div>
        <Link 
          href="/dashboard/courses/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col">
            
            {/* Thumbnail */}
            <div className="relative h-48 w-full bg-gray-100 border-b">
              {course.thumbnail_url ? (
                <Image 
                  src={course.thumbnail_url} 
                  alt={course.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <BookOpen className="w-10 h-10" />
                </div>
              )}
              
              {/* Badge Status */}
              <div className="absolute top-3 right-3">
                 {course.is_published ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200 shadow-sm">
                    Published
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-4" title={course.title}>
                {course.title}
              </h3>
              
              {/* REVISI: Bagian Harga Dihapus dari sini */}
              
              <div className="mt-auto flex gap-2">
                <Link 
                  href={`/dashboard/courses/${course.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition font-medium text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Course
                </Link>
                
                <DeleteCourseButton courseId={course.id} />
              </div>
            </div>
          </div>
        ))}

        {courses?.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada kursus</h3>
            <p className="text-gray-500 mb-4">Mulai bagikan ilmu Anda sekarang.</p>
            <Link href="/dashboard/courses/create" className="text-blue-600 hover:underline font-medium">
              Buat kursus pertama &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}