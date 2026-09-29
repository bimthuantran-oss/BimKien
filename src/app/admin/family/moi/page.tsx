import { db } from '@/lib/db';
import { FamilyForm } from '@/components/admin/FamilyForm';

export const metadata = { title: 'Family mới · Admin' };

export default async function NewFamilyPage() {
  const categories = await db.familyCategory.findMany({ orderBy: { name: 'asc' } });
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Thêm family mới</h2>
      <FamilyForm categories={categories} />
    </div>
  );
}
