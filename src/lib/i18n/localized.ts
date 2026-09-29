import type { Locale } from './locale';

/** Picks the localized value of a translatable content field, falling back to Vietnamese when English is empty. */
export function localized(vi: string, en: string | null | undefined, locale: Locale): string {
  if (locale === 'en' && en && en.trim().length > 0) return en;
  return vi;
}

/** Same as `localized`, but tolerant of a nullable Vietnamese base value (e.g. optional settings fields). */
export function localizedOptional(
  vi: string | null | undefined,
  en: string | null | undefined,
  locale: Locale
): string | null {
  if (locale === 'en' && en && en.trim().length > 0) return en;
  return vi ?? null;
}
