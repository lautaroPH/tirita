import "server-only";
import { db } from "./db";
import type { Level, Modality } from "./site";

export type Subject = {
  id: number;
  slug: string;
  name: string;
  level: Level;
  area: string | null;
};

export type SubjectTag = { name: string; area: string | null; level: Level };

export type TeacherSummary = {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string;
  rate_per_hour: number | null;
  modality: Modality;
  zone: string;
  social_url: string | null;
  subjects: SubjectTag[];
  rating: number | null;
  review_count: number;
};

export type Review = {
  id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export function subjectLabel(s: Pick<Subject, "name" | "area">) {
  return s.area ? `${s.name} – ${s.area}` : s.name;
}

export async function listSubjects(): Promise<Subject[]> {
  const rows = await db()`
    select id, slug, name, level, area from subjects order by sort, name`;
  return rows as Subject[];
}

function toSummary(r: Record<string, unknown>): TeacherSummary {
  return {
    ...(r as unknown as TeacherSummary),
    subjects: (r.subjects as SubjectTag[] | null) ?? [],
    rating: r.rating == null ? null : Number(r.rating),
    review_count: Number(r.review_count ?? 0),
  };
}

export async function searchTeachers(f: {
  subjectId: number | null;
  level: Level | null;
  modality: "presencial" | "online" | null;
}): Promise<TeacherSummary[]> {
  const rows = await db()`
    select t.id, t.name, t.photo_url, t.bio, t.rate_per_hour, t.modality, t.zone, t.social_url,
      (select json_agg(json_build_object('name', s.name, 'area', s.area, 'level', s.level) order by s.sort)
         from teacher_subjects ts join subjects s on s.id = ts.subject_id
        where ts.teacher_id = t.id) as subjects,
      (select round(avg(r.rating)::numeric, 1) from reviews r
        where r.teacher_id = t.id and r.status = 'approved') as rating,
      (select count(*)::int from reviews r
        where r.teacher_id = t.id and r.status = 'approved') as review_count
    from teachers t
    where t.status = 'approved' and not t.paused
      and (${f.subjectId}::int is null or exists (
            select 1 from teacher_subjects ts
             where ts.teacher_id = t.id and ts.subject_id = ${f.subjectId}::int))
      and (${f.level}::text is null or exists (
            select 1 from teacher_subjects ts join subjects s on s.id = ts.subject_id
             where ts.teacher_id = t.id and s.level = ${f.level}::text))
      and (${f.modality}::text is null or t.modality = ${f.modality}::text or t.modality = 'ambas')
    order by review_count desc, t.approved_at desc nulls last
    limit 100`;
  return rows.map(toSummary);
}

export async function getApprovedTeacher(id: string): Promise<TeacherSummary | null> {
  const rows = await db()`
    select t.id, t.name, t.photo_url, t.bio, t.rate_per_hour, t.modality, t.zone, t.social_url,
      (select json_agg(json_build_object('name', s.name, 'area', s.area, 'level', s.level) order by s.sort)
         from teacher_subjects ts join subjects s on s.id = ts.subject_id
        where ts.teacher_id = t.id) as subjects,
      (select round(avg(r.rating)::numeric, 1) from reviews r
        where r.teacher_id = t.id and r.status = 'approved') as rating,
      (select count(*)::int from reviews r
        where r.teacher_id = t.id and r.status = 'approved') as review_count
    from teachers t
    where t.id = ${id}::uuid and t.status = 'approved' and not t.paused`;
  return rows[0] ? toSummary(rows[0]) : null;
}

export async function getTeacherWhatsapp(id: string): Promise<{ name: string; whatsapp: string } | null> {
  const rows = await db()`
    select name, whatsapp from teachers where id = ${id}::uuid and status = 'approved' and not paused`;
  return (rows[0] as { name: string; whatsapp: string } | undefined) ?? null;
}

export async function listApprovedReviews(teacherId: string): Promise<Review[]> {
  const rows = await db()`
    select id, author_name, rating, comment, created_at from reviews
    where teacher_id = ${teacherId}::uuid and status = 'approved'
    order by created_at desc limit 50`;
  return rows as Review[];
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const rows = await db()`
    select id, slug, name, level, area from subjects where slug = ${slug}`;
  return (rows[0] as Subject | undefined) ?? null;
}
