import vi, { type Dictionary } from './messages/vi';
import en from './messages/en';
import type { Locale } from './locale';

export const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.vi;
}

export type { Dictionary };
