import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { TopicsGrid } from '@/components/home/TopicsGrid';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { FeaturedFamilies } from '@/components/home/FeaturedFamilies';
import { AboutSection } from '@/components/home/AboutSection';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { Testimonials } from '@/components/home/Testimonials';
import { getSiteSettings } from '@/lib/settings';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export default async function HomePage() {
  const settings = await getSiteSettings();
  const locale = getServerLocale();

  return (
    <>
      <Hero settings={settings} locale={locale} />
      <StatsBar />
      <TopicsGrid />
      <FeaturedProjects locale={locale} />
      <FeaturedCourses locale={locale} />
      <FeaturedFamilies locale={locale} />
      <AboutSection />
      <ProcessTimeline />
      <FeaturedPosts locale={locale} />
      <Testimonials />
    </>
  );
}
