"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Generate URL-safe slug from title; tambah suffix jika perlu agar unik */
function slugFromTitle(title: string, suffix?: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const slug = base || "course";
  return suffix ? `${slug}-${suffix}` : slug;
}

// ==========================================
// 1. COURSE ACTIONS (FIX UNTUK ERROR INI)
// ==========================================

export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const price = Number(formData.get("price")) || 0;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || "";
  const is_published = formData.get("is_published") === "on";

  let slug = slugFromTitle(title);
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (existing) slug = slugFromTitle(title, Date.now().toString(36));

  const row: Record<string, unknown> = {
    user_id: user.id,
    slug,
    title,
    description,
    thumbnail_url,
    is_published,
  };
  if (price > 0) row.price = price;

  const { data, error } = await supabase
    .from("courses")
    .insert(row)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/courses");
  redirect(`/dashboard/courses/${data.id}/edit`);
}

type CourseUpdatePayload =
  | FormData
  | { title: string; description?: string; thumbnail_url?: string; is_published?: boolean; price?: number };

function normalizeCoursePayload(payload: CourseUpdatePayload) {
  if (payload instanceof FormData) {
    const title = payload.get("title") as string;
    const description = (payload.get("description") as string) || "";
    const thumbnail_url = (payload.get("thumbnail_url") as string) || "";
    const is_published = payload.get("is_published") === "on";
    const priceRaw = payload.get("price");
    const price = priceRaw !== null && priceRaw !== "" ? Number(priceRaw) : undefined;
    return { title, description, thumbnail_url, is_published, price };
  }
  const p = payload as { title: string; description?: string; thumbnail_url?: string; is_published?: boolean; price?: number };
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    thumbnail_url: p.thumbnail_url ?? "",
    is_published: p.is_published ?? false,
    price: p.price,
  };
}

export async function updateCourse(courseId: string, payload: CourseUpdatePayload) {
  const supabase = await createClient();

  const { title, description, thumbnail_url, is_published, price } = normalizeCoursePayload(payload);

  let slug = slugFromTitle(title);
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .neq("id", courseId)
    .limit(1)
    .maybeSingle();
  if (existing) slug = slugFromTitle(title, Date.now().toString(36));

  const row: Record<string, unknown> = {
    slug,
    title,
    description,
    thumbnail_url,
    is_published,
  };
  if (price !== undefined) row.price = price;

  const { error } = await supabase
    .from("courses")
    .update(row)
    .eq("id", courseId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: true };
}

// --- FUNGSI DELETE COURSE (YANG ERROR TADI) ---
export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/courses");
  return { success: true };
}


// ==========================================
// 2. CHAPTER ACTIONS
// ==========================================

export async function createChapter(
  courseId: string, 
  title: string, 
  level: number, 
  price: number, 
  prerequisiteId: string | null
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("chapters")
    .insert({
      course_id: courseId,
      title: title,
      level: level,
      price: price,
      prerequisite_chapter_id: prerequisiteId,
      position: 0 
    })
    .select()
    .single();

  if (error) return { error: error.message };
  
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: true, data };
}

export async function updateChapter(
  chapterId: string, 
  courseId: string, 
  data: { 
    title: string; 
    level: number; 
    price: number; 
    prerequisite_chapter_id: string | null 
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chapters")
    .update(data)
    .eq("id", chapterId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: true };
}

export async function deleteChapter(chapterId: string, courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", chapterId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: true };
}


// ==========================================
// 3. LESSON ACTIONS
// ==========================================

export async function createLesson(
  chapterId: string, 
  courseId: string, 
  title: string, 
  videoId: string, 
  description: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      chapter_id: chapterId,
      title: title,
      video_id: videoId,
      description: description,
      position: 0
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: true, data };
}

// Fungsi Save Lesson (Hybrid Create/Update) - Untuk LessonManager
export async function saveLesson(
    chapterId: string,
    data: { id?: string; title: string; description: string; video_id: string }
  ) {
    const supabase = await createClient();

    if (data.id) {
      // UPDATE
      const { error } = await supabase
        .from("lessons")
        .update({
          title: data.title,
          description: data.description,
          video_id: data.video_id,
        })
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      // CREATE: ambil course_id dari chapter
      const { data: chapter } = await supabase
        .from("chapters")
        .select("course_id")
        .eq("id", chapterId)
        .single();

      if (!chapter?.course_id) {
        return { error: "Chapter atau course tidak ditemukan." };
      }

      const { error } = await supabase
        .from("lessons")
        .insert({
          course_id: chapter.course_id,
          chapter_id: chapterId,
          title: data.title,
          description: data.description,
          video_id: data.video_id,
          position: 0,
        });

      if (error) return { error: error.message };
    }

    revalidatePath("/dashboard/courses");
    return { success: true };
  }

export async function deleteLesson(lessonId: string, courseId?: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId);

  if (error) return { error: error.message };

  // Revalidate tergantung parameter
  if (courseId) {
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
  } else {
    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard"); // Aman untuk merefresh semua
  }
  
  return { success: true };
}

// --- REORDER (OPSIONAL) ---
export async function reorderLessons(
  list: { id: string; position: number }[]
) {
  const supabase = await createClient();

  for (const item of list) {
    await supabase
      .from("lessons")
      .update({ position: item.position })
      .eq("id", item.id);
  }

  revalidatePath("/dashboard/courses");
  return { success: true };
}