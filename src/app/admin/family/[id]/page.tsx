import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { FamilyForm } from '@/components/admin/FamilyForm';

export const metadata = { title: 'Sửa family · Admin' };

export default async function EditFamilyPage({ params }: { params: { id: string } }) {
  const [family, categories] = await Promise.all([
    db.family.findUnique({ where: { id: params.id } }),
    db.familyCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!family) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Sửa family</h2>
      <FamilyForm categories={categories} initial={family} />
    </div>
  );
}
