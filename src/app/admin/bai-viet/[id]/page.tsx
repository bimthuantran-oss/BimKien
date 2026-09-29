import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PostForm } from '@/components/admin/PostForm';

export const metadata = { title: 'Sửa bài viết · Admin' };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    db.post.findUnique({ where: { id: params.id }, include: { tags: true } }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Sửa bài viết</h2>
      <PostForm categories={categories} initial={post} />
    </div>
  );
}
