-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "FamilyCategory" ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "defaultMetaDescriptionEn" TEXT,
ADD COLUMN     "defaultMetaTitleEn" TEXT,
ADD COLUMN     "heroSubtitleEn" TEXT,
ADD COLUMN     "heroTitleLine1En" TEXT,
ADD COLUMN     "heroTitleLine2En" TEXT,
ADD COLUMN     "paymentInstructionsEn" TEXT,
ADD COLUMN     "taglineEn" TEXT;
