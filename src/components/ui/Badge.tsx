import { cn } from '@/lib/utils';

export function Badge({
  children,
  className,
  variant = 'accent',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'accent' | 'ink' | 'outline';
}) {
  const variants = {
    accent: 'bg-accent-500 text-white',
    ink: 'bg-ink-900 text-white',
    outline: 'border border-ink-200 text-ink-600',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
