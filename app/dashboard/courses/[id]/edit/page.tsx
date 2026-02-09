import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import LessonManager from '@/components/LessonManager';
import CourseEditForm from '@/components/CourseEditForm';

export default async function EditCoursePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const courseId = params.id;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single();
  if (!course) notFound();

  // Ambil Data Struktur (Chapters + Lessons)
  const { data: chapters } = await supabase
    .from('chapters')
    .select(`
      id, title, level, price, position, prerequisite_chapter_id,
      lessons ( id, title, video_id, chapter_id, position )
    `)
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  const sortedChapters = chapters?.map((chapter: any) => ({
    ...chapter,
    lessons: chapter.lessons?.sort((a: any, b: any) => a.position - b.position)
  })) || [];

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20"> {/* pb-20 agar tombol fixed tidak menutupi konten */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-500">Kelola detail kursus, kurikulum, dan harga modul.</p>
      </div>

      {/* FORM WRAPPER: Input Info + LessonManager + Tombol Simpan */}
      <CourseEditForm course={course}>
        <LessonManager courseId={courseId} chapters={sortedChapters} />
      </CourseEditForm>

    </div>
  );
}