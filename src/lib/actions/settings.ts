'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { saveUploadedFile } from '@/lib/upload';
import { invalidateSiteSettingsCache } from '@/lib/settings';

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const existing = await db.siteSetting.findFirst();

  const logoFile = formData.get('logoUrl');
  const heroFile = formData.get('heroImage');

  let logoUrl = existing?.logoUrl ?? null;
  if (logoFile instanceof File && logoFile.size > 0) {
    logoUrl = await saveUploadedFile(logoFile, 'logos');
  }
  let heroImage = existing?.heroImage ?? null;
  if (heroFile instanceof File && heroFile.size > 0) {
    heroImage = await saveUploadedFile(heroFile, 'covers');
  }

  const data = {
    siteName: String(formData.get('siteName') || 'BIMKien'),
    tagline: String(formData.get('tagline') || '') || null,
    taglineEn: String(formData.get('taglineEn') || '').trim() || null,
    phone: String(formData.get('phone') || '') || null,
    email: String(formData.get('email') || '') || null,
    address: String(formData.get('address') || '') || null,
    facebookUrl: String(formData.get('facebookUrl') || '') || null,
    youtubeUrl: String(formData.get('youtubeUrl') || '') || null,
    linkedinUrl: String(formData.get('linkedinUrl') || '') || null,
    zaloUrl: String(formData.get('zaloUrl') || '') || null,
    heroTitleLine1: String(formData.get('heroTitleLine1') || '') || null,
    heroTitleLine1En: String(formData.get('heroTitleLine1En') || '').trim() || null,
    heroTitleLine2: String(formData.get('heroTitleLine2') || '') || null,
    heroTitleLine2En: String(formData.get('heroTitleLine2En') || '').trim() || null,
    heroSubtitle: String(formData.get('heroSubtitle') || '') || null,
    heroSubtitleEn: String(formData.get('heroSubtitleEn') || '').trim() || null,
    defaultMetaTitle: String(formData.get('defaultMetaTitle') || '') || null,
    defaultMetaTitleEn: String(formData.get('defaultMetaTitleEn') || '').trim() || null,
    defaultMetaDescription: String(formData.get('defaultMetaDescription') || '') || null,
    defaultMetaDescriptionEn: String(formData.get('defaultMetaDescriptionEn') || '').trim() || null,
    paymentInstructions: String(formData.get('paymentInstructions') || '') || null,
    paymentInstructionsEn: String(formData.get('paymentInstructionsEn') || '').trim() || null,
    logoUrl,
    heroImage,
  };

  if (existing) {
    await db.siteSetting.update({ where: { id: existing.id }, data });
  } else {
    await db.siteSetting.create({ data });
  }

  invalidateSiteSettingsCache();
  revalidatePath('/', 'layout');
}
