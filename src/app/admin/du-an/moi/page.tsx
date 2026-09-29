import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata = { title: 'Dự án mới · Admin' };

export default function NewProjectPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Tạo dự án mới</h2>
      <ProjectForm />
    </div>
  );
}
