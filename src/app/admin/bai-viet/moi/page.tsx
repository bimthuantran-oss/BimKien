import { db } from '@/lib/db';
import { PostForm } from '@/components/admin/PostForm';

export const metadata = { title: 'Bài viết mới · Admin' };

export default async function NewPostPage() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Tạo bài viết mới</h2>
      <PostForm categories={categories} />
    </div>
  );
}
