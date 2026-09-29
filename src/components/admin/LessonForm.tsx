'use client';

import { useState } from 'react';
import { FileDown, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { saveLesson, deleteAttachment } from '@/lib/actions/courses';

type LessonInitial = {
  id: string;
  title: string;
  titleEn: string | null;
  videoUrl: string | null;
  content: string | null;
  contentEn: string | null;
  durationMin: number | null;
  attachments: { id: string; name: string; url: string }[];
};

export function LessonForm({ courseId, lesson }: { courseId: string; lesson: LessonInitial }) {
  const [content, setContent] = useState(lesson.content ?? '');
  const [contentEn, setContentEn] = useState(lesson.contentEn ?? '');

  return (
    <form action={saveLesson} className="space-y-6">
      <input type="hidden" name="id" value={lesson.id} />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="contentEn" value={contentEn} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <Field label="Tên bài học">
              <input
                name="title"
                required
                defaultValue={lesson.title}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung bài học">
              <RichTextEditor value={content} onChange={setContent} />
            </Field>
          </div>

          <div className="card-surface space-y-4 border border-dashed border-accent-300 p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </h3>
            <Field label="Tên bài học (Tiếng Anh)">
              <input
                name="titleEn"
                defaultValue={lesson.titleEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung bài học (Tiếng Anh)">
              <RichTextEditor value={contentEn} onChange={setContentEn} placeholder="Enter English content..." />
            </Field>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Tài liệu đính kèm</h3>
            {lesson.attachments.length > 0 ? (
              <ul className="space-y-2">
                {lesson.attachments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-2.5 text-sm">
                    <a href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-ink-700 hover:text-accent-600">
                      <FileDown size={15} /> {a.name}
                    </a>
                    <form action={deleteAttachment}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="lessonId" value={lesson.id} />
                      <input type="hidden" name="courseId" value={courseId} />
                      <button className="text-ink-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : null}
            <Field label="Thêm tài liệu (PDF, file mẫu...)">
              <input type="file" name="attachments" multiple className="w-full text-sm" />
            </Field>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface space-y-4 p-6">
            <Field label="Video URL (YouTube/Vimeo)">
              <input
                name="videoUrl"
                defaultValue={lesson.videoUrl ?? ''}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Thời lượng (phút)">
              <input
                type="number"
                name="durationMin"
                min={0}
                defaultValue={lesson.durationMin ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
          </div>

          <button type="submit" className="btn-primary w-full">
            Lưu bài học
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
      {children}
    </div>
  );
}
