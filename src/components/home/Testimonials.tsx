'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLocale } from '@/components/providers/LocaleProvider';

export function Testimonials() {
  const { t: dict } = useLocale();
  const testimonials = dict.home.testimonials;
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-ink-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={dict.home.testimonialsEyebrow}
            title={dict.home.testimonialsTitle}
            accent={dict.home.testimonialsAccent}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:border-accent-500 hover:text-accent-500"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:border-accent-500 hover:text-accent-500"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setIndex(i)}
              className={`card-surface p-6 text-left transition-opacity ${i === index ? 'opacity-100 ring-2 ring-accent-500' : 'opacity-60 hover:opacity-100'}`}
            >
              <Quote className="mb-3 text-accent-500" size={24} />
              <p className="mb-5 text-sm leading-relaxed text-ink-600">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
                  {item.name[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{item.name}</p>
                  <p className="text-xs text-ink-400">{item.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
