import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata = { title: 'Sửa dự án · Admin' };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!project) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Sửa dự án</h2>
      <ProjectForm initial={project} />
    </div>
  );
}
