import Link from 'next/link';
import Image from 'next/image';
import { Layers, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { courseLevelLabel } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/locale';

export type CourseCardData = {
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  level: string;
  price: number;
  lessonCount: number;
};

export function CourseCard({ course, locale }: { course: CourseCardData; locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <Link href={`/khoa-hoc/${course.slug}`} className="card-surface group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-ink-100">
        {course.coverImage ? (
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <GraduationCap size={40} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant={course.price === 0 ? 'accent' : 'ink'}>
            {course.price === 0 ? t.common.free : `${course.price.toLocaleString('vi-VN')}đ`}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-accent-600">
          {courseLevelLabel(course.level, locale)}
        </span>
        <h3 className="font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-accent-600">
          {course.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{course.description}</p>
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
          <Layers size={14} /> {course.lessonCount} {t.common.lessons}
        </div>
      </div>
    </Link>
  );
}
