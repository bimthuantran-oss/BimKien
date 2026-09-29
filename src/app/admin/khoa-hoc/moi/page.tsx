import { CourseForm } from '@/components/admin/CourseForm';

export const metadata = { title: 'Khóa học mới · Admin' };

export default function NewCoursePage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Tạo khóa học mới</h2>
      <CourseForm />
    </div>
  );
}
