import { cookies } from 'next/headers';
import { LOCALE_COOKIE, DEFAULT_LOCALE, type Locale } from './locale';

export function getServerLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value === 'en' ? 'en' : DEFAULT_LOCALE;
}
