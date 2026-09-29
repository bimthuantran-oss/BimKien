import { db } from '@/lib/db';
import { Building2, Users, GraduationCap, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

const ICONS: Record<string, React.ElementType> = {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
};

export async function StatsBar() {
  const locale = getServerLocale();
  let stats: { id: string; icon: string; value: string; label: string; labelEn: string | null }[] = [];
  try {
    stats = await db.statItem.findMany({ orderBy: { order: 'asc' } });
  } catch {
    stats = [];
  }

  if (stats.length === 0) {
    stats = [
      { id: '1', icon: 'Award', value: '8+', label: 'Năm kinh nghiệm BIM', labelEn: 'Years of BIM experience' },
      { id: '2', icon: 'Building2', value: '60+', label: 'Dự án đã triển khai', labelEn: 'Projects delivered' },
      { id: '3', icon: 'GraduationCap', value: '1.200+', label: 'Học viên đã đào tạo', labelEn: 'Learners trained' },
      { id: '4', icon: 'BookOpen', value: '150+', label: 'Bài viết chuyên môn', labelEn: 'Expert articles' },
      { id: '5', icon: 'CheckCircle2', value: '98%', label: 'Học viên hài lòng', labelEn: 'Learner satisfaction' },
    ];
  }

  return (
    <section className="relative z-10 -mt-14 md:-mt-16">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-800 shadow-card sm:grid-cols-3 md:grid-cols-5">
          {stats.map((s) => {
            const Icon = ICONS[s.icon] ?? Award;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-ink-900 px-4 py-7 text-center">
                <Icon className="text-accent-500" size={26} />
                <span className="font-display text-2xl font-extrabold text-white md:text-3xl">{s.value}</span>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-300">
                  {localized(s.label, s.labelEn, locale)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
