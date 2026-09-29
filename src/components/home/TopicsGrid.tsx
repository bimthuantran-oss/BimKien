'use client';

import Link from 'next/link';
import { Boxes, GraduationCap, FileStack, Building2, PenTool, ShieldCheck, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useLocale } from '@/components/providers/LocaleProvider';

const ICONS = [Boxes, ShieldCheck, PenTool, Building2, FileStack, GraduationCap];
const HREFS = [
  '/blog?category=kien-thuc-nen-tang',
  '/blog?category=tieu-chuan-quy-dinh',
  '/blog?category=phan-mem-cong-cu',
  '/blog?category=ung-dung-thiet-ke',
  '/blog?category=case-study',
  '/khoa-hoc',
];

export function TopicsGrid() {
  const { t } = useLocale();

  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.home.topicsEyebrow}
            title={t.home.topicsTitle}
            accent={t.home.topicsAccent}
            description={t.home.topicsDescription}
          />
          <Link href="/blog" className="btn-outline-dark shrink-0">
            {t.common.viewAll} {t.nav.blog.toLowerCase()}
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.topics.map((topic, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={topic.title} delay={i * 80}>
                <Link href={HREFS[i]} className="card-surface group flex h-full flex-col gap-4 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-500 group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink-900">{topic.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-ink-500">{topic.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    {t.common.readMore} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
