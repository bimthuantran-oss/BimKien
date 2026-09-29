import { db } from '@/lib/db';

export const DEFAULT_SETTINGS = {
  id: 'default',
  siteName: 'BIMKien',
  tagline: 'Chia sẻ kiến thức BIM, giới thiệu dự án và đào tạo chuyên sâu',
  taglineEn: null as string | null,
  logoUrl: null as string | null,
  phone: '+84 98 765 4321',
  email: 'contact@bimkien.vn',
  address: '123 Đường BIM, Quận 1, TP. Hồ Chí Minh',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com',
  zaloUrl: null as string | null,
  heroTitleLine1: 'KIẾN TẠO GIÁ TRỊ',
  heroTitleLine1En: null as string | null,
  heroTitleLine2: 'BẰNG BIM.',
  heroTitleLine2En: null as string | null,
  heroSubtitle:
    'BIMKien chia sẻ kiến thức chuyên sâu về BIM, giới thiệu các dự án đã triển khai và cung cấp khóa học thực chiến cho cộng đồng kiến trúc – xây dựng.',
  heroSubtitleEn: null as string | null,
  heroImage: null as string | null,
  defaultMetaTitle: 'BIMKien — BIM, Kiến trúc & Đào tạo',
  defaultMetaTitleEn: null as string | null,
  defaultMetaDescription:
    'Nền tảng chia sẻ kiến thức BIM, giới thiệu dự án kiến trúc và khóa học Revit/BIM thực chiến.',
  defaultMetaDescriptionEn: null as string | null,
  paymentInstructions:
    'Chuyển khoản theo thông tin: [Tên ngân hàng] - STK [số tài khoản] - Chủ TK [tên]. Nội dung CK: [Tên bạn] mua family [tên family]. Sau khi chuyển khoản, vui lòng liên hệ Zalo/hotline để được duyệt tải nhanh.',
  paymentInstructionsEn: null as string | null,
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const existing = await db.siteSetting.findFirst();
    if (existing) {
      return {
        id: existing.id,
        siteName: existing.siteName || DEFAULT_SETTINGS.siteName,
        tagline: existing.tagline ?? DEFAULT_SETTINGS.tagline,
        taglineEn: existing.taglineEn,
        logoUrl: existing.logoUrl,
        phone: existing.phone ?? DEFAULT_SETTINGS.phone,
        email: existing.email ?? DEFAULT_SETTINGS.email,
        address: existing.address ?? DEFAULT_SETTINGS.address,
        facebookUrl: existing.facebookUrl ?? DEFAULT_SETTINGS.facebookUrl,
        youtubeUrl: existing.youtubeUrl ?? DEFAULT_SETTINGS.youtubeUrl,
        linkedinUrl: existing.linkedinUrl ?? DEFAULT_SETTINGS.linkedinUrl,
        zaloUrl: existing.zaloUrl,
        heroTitleLine1: existing.heroTitleLine1 ?? DEFAULT_SETTINGS.heroTitleLine1,
        heroTitleLine1En: existing.heroTitleLine1En,
        heroTitleLine2: existing.heroTitleLine2 ?? DEFAULT_SETTINGS.heroTitleLine2,
        heroTitleLine2En: existing.heroTitleLine2En,
        heroSubtitle: existing.heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle,
        heroSubtitleEn: existing.heroSubtitleEn,
        heroImage: existing.heroImage,
        defaultMetaTitle: existing.defaultMetaTitle ?? DEFAULT_SETTINGS.defaultMetaTitle,
        defaultMetaTitleEn: existing.defaultMetaTitleEn,
        defaultMetaDescription: existing.defaultMetaDescription ?? DEFAULT_SETTINGS.defaultMetaDescription,
        defaultMetaDescriptionEn: existing.defaultMetaDescriptionEn,
        paymentInstructions: existing.paymentInstructions ?? DEFAULT_SETTINGS.paymentInstructions,
        paymentInstructionsEn: existing.paymentInstructionsEn,
      };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
