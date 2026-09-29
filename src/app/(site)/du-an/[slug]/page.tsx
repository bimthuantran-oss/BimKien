import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { projectTypeLabel } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

async function getProject(slug: string) {
  return db.project.findUnique({ where: { slug }, include: { images: { orderBy: { order: 'asc' } } } });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  const locale = getServerLocale();
  return {
    title: localized(project.metaTitle || project.title, project.metaTitleEn, locale),
    description: localized(project.metaDescription || project.summary, project.metaDescriptionEn, locale),
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project || project.status !== 'PUBLISHED') notFound();

  const locale = getServerLocale();
  const t = getDictionary(locale);
  const title = localized(project.title, project.titleEn, locale);
  const summary = localized(project.summary, project.summaryEn, locale);
  const content = localized(project.content, project.contentEn, locale);

  const facts: { label: string; value: string }[] = [
    { label: t.projects.projectType, value: projectTypeLabel(project.projectType, locale) },
    ...(project.investor ? [{ label: t.projects.investor, value: project.investor }] : []),
    ...(project.location ? [{ label: t.projects.location, value: project.location }] : []),
    ...(project.scale ? [{ label: t.projects.scale, value: project.scale }] : []),
    ...(project.completedYear ? [{ label: t.projects.completedYear, value: String(project.completedYear) }] : []),
  ];

  return (
    <article className="pb-24">
      <div className="relative flex min-h-[380px] items-end bg-ink-950">
        {project.coverImage ? (
          <>
            <Image src={project.coverImage} alt={title} fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
          </>
        ) : null}
        <div className="container-wide relative py-14">
          <Badge>{projectTypeLabel(project.projectType, locale)}</Badge>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold text-white md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-ink-300">{summary}</p>
        </div>
      </div>

      <div className="container-wide mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="prose-bim" dangerouslySetInnerHTML={{ __html: content }} />

          {project.images.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {project.images.map((img) => (
                <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image src={img.url} alt={img.caption || title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}

          {project.bimModelUrl ? (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-bold text-ink-900">{t.projects.bimModel}</h2>
              <div className="aspect-video overflow-hidden rounded-xl border border-ink-100">
                <iframe src={project.bimModelUrl} className="h-full w-full" allowFullScreen loading="lazy" />
              </div>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-xl border border-ink-100 bg-ink-50 p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-ink-900">{t.projects.projectInfo}</h3>
          <dl className="space-y-3 text-sm">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 border-b border-ink-100 pb-3">
                <dt className="text-ink-500">{f.label}</dt>
                <dd className="text-right font-semibold text-ink-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </article>
  );
}
