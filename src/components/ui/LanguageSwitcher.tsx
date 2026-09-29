'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        'flex items-center rounded-full border p-0.5 text-xs font-bold',
        dark ? 'border-white/15' : 'border-ink-200'
      )}
    >
      {(['vi', 'en'] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={cn(
            'rounded-full px-2.5 py-1 uppercase transition-colors',
            locale === code
              ? 'bg-accent-500 text-white'
              : dark
                ? 'text-ink-300 hover:text-white'
                : 'text-ink-500 hover:text-ink-900'
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
