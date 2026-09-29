import type { Locale } from './i18n/locale';

export const PROJECT_TYPES: Record<string, string> = {
  'dan-dung': 'Công trình dân dụng',
  'thuong-mai': 'Công trình thương mại',
  'cong-nghiep': 'Công trình công nghiệp',
  'ha-tang': 'Hạ tầng & khác',
};

export const PROJECT_TYPES_EN: Record<string, string> = {
  'dan-dung': 'Residential building',
  'thuong-mai': 'Commercial building',
  'cong-nghiep': 'Industrial building',
  'ha-tang': 'Infrastructure & other',
};

export function projectTypeLabel(type: string, locale: Locale): string {
  const map = locale === 'en' ? PROJECT_TYPES_EN : PROJECT_TYPES;
  return map[type] ?? type;
}

export const COURSE_LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
};

export const COURSE_LEVEL_LABEL_EN: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export function courseLevelLabel(level: string, locale: Locale): string {
  const map = locale === 'en' ? COURSE_LEVEL_LABEL_EN : COURSE_LEVEL_LABEL;
  return map[level] ?? level;
}

export const DEFAULT_CATEGORIES = [
  { name: 'Kiến thức nền tảng BIM', slug: 'kien-thuc-nen-tang' },
  { name: 'Tiêu chuẩn & quy định', slug: 'tieu-chuan-quy-dinh' },
  { name: 'Phần mềm & công cụ', slug: 'phan-mem-cong-cu' },
  { name: 'Ứng dụng thiết kế', slug: 'ung-dung-thiet-ke' },
  { name: 'Case study dự án', slug: 'case-study' },
];
