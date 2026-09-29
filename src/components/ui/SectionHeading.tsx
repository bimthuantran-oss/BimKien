import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'reveal max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2
        className={cn(
          'font-display text-3xl font-bold leading-tight text-balance md:text-4xl',
          dark ? 'text-white' : 'text-ink-900'
        )}
      >
        {title} {accent ? <span className="text-accent-500">{accent}</span> : null}
      </h2>
      {description ? (
        <p className={cn('mt-4 text-base leading-relaxed', dark ? 'text-ink-200' : 'text-ink-500')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
