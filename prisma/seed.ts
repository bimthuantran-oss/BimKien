import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const db = new PrismaClient();

const COVER = (seed: string) => `https://images.unsplash.com/${seed}?q=80&w=1600&auto=format&fit=crop`;

export async function main() {
  console.log('Seeding...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await db.user.upsert({
    where: { email: 'admin@bimkien.vn' },
    update: {},
    create: { name: 'Quản trị viên', email: 'admin@bimkien.vn', phone: '0900000001', passwordHash, role: 'ADMIN' },
  });
  const editor = await db.user.upsert({
    where: { email: 'editor@bimkien.vn' },
    update: {},
    create: { name: 'Biên tập viên', email: 'editor@bimkien.vn', phone: '0900000002', passwordHash, role: 'EDITOR' },
  });
  const student1 = await db.user.upsert({
    where: { email: 'hocvien1@bimkien.vn' },
    update: {},
    create: { name: 'Nguyễn Văn An', email: 'hocvien1@bimkien.vn', phone: '0900000003', passwordHash, role: 'STUDENT' },
  });
  const student2 = await db.user.upsert({
    where: { email: 'hocvien2@bimkien.vn' },
    update: {},
    create: { name: 'Trần Thị Bình', email: 'hocvien2@bimkien.vn', phone: '0900000004', passwordHash, role: 'STUDENT' },
  });

  // ---------- Site settings ----------
  const existingSettings = await db.siteSetting.findFirst();
  const settingsData = {
    siteName: 'BIMKien',
    tagline: 'Chia sẻ kiến thức BIM, giới thiệu dự án và đào tạo chuyên sâu cho cộng đồng kiến trúc – xây dựng.',
    taglineEn:
      'Sharing BIM knowledge, showcasing projects, and providing in-depth training for the architecture & construction community.',
    phone: '+84 98 765 4321',
    email: 'contact@bimkien.vn',
    address: '123 Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP. Hồ Chí Minh',
    facebookUrl: 'https://facebook.com',
    youtubeUrl: 'https://youtube.com',
    linkedinUrl: 'https://linkedin.com',
    heroTitleLine1: 'KIẾN TẠO GIÁ TRỊ',
    heroTitleLine1En: 'CREATING VALUE',
    heroTitleLine2: 'BẰNG BIM.',
    heroTitleLine2En: 'WITH BIM.',
    heroSubtitle:
      'BIMKien chia sẻ kiến thức chuyên sâu về BIM, giới thiệu các dự án đã triển khai và cung cấp khóa học thực chiến cho cộng đồng kiến trúc – xây dựng.',
    heroSubtitleEn:
      'BIMKien shares in-depth BIM knowledge, showcases completed projects, and offers hands-on courses for the architecture & construction community.',
    defaultMetaTitle: 'BIMKien — BIM, Kiến trúc & Đào tạo',
    defaultMetaTitleEn: 'BIMKien — BIM, Architecture & Training',
    defaultMetaDescription:
      'Nền tảng chia sẻ kiến thức BIM, giới thiệu dự án kiến trúc và khóa học Revit/BIM thực chiến.',
    defaultMetaDescriptionEn: 'A platform for BIM knowledge, architecture project showcases, and hands-on Revit/BIM courses.',
    paymentInstructionsEn:
      'Bank transfer details: [Bank name] - Account No. [account number] - Account holder [name]. Transfer note: [Your name] purchase family [family name]. After transferring, please contact us via Zalo/hotline for fast approval.',
  };
  if (existingSettings) {
    await db.siteSetting.update({ where: { id: existingSettings.id }, data: settingsData });
  } else {
    await db.siteSetting.create({ data: settingsData });
  }

  await db.statItem.deleteMany();
  await db.statItem.createMany({
    data: [
      { icon: 'Award', value: '8+', label: 'Năm kinh nghiệm BIM', labelEn: 'Years of BIM experience', order: 0 },
      { icon: 'Building2', value: '60+', label: 'Dự án đã triển khai', labelEn: 'Projects delivered', order: 1 },
      { icon: 'GraduationCap', value: '1.200+', label: 'Học viên đã đào tạo', labelEn: 'Learners trained', order: 2 },
      { icon: 'BookOpen', value: '150+', label: 'Bài viết chuyên môn', labelEn: 'Expert articles', order: 3 },
      { icon: 'CheckCircle2', value: '98%', label: 'Học viên hài lòng', labelEn: 'Learner satisfaction', order: 4 },
    ],
  });

  // ---------- Categories ----------
  const categoriesData = [
    { name: 'Kiến thức nền tảng BIM', nameEn: 'BIM Fundamentals', slug: 'kien-thuc-nen-tang' },
    { name: 'Tiêu chuẩn & quy định', nameEn: 'Standards & Regulations', slug: 'tieu-chuan-quy-dinh' },
    { name: 'Phần mềm & công cụ', nameEn: 'Software & Tools', slug: 'phan-mem-cong-cu' },
    { name: 'Ứng dụng thiết kế', nameEn: 'Design Application', slug: 'ung-dung-thiet-ke' },
    { name: 'Case study dự án', nameEn: 'Project Case Studies', slug: 'case-study' },
  ];
  const categories = [];
  for (const c of categoriesData) {
    categories.push(await db.category.upsert({ where: { slug: c.slug }, update: { nameEn: c.nameEn }, create: c }));
  }

  // ---------- Posts ----------
  const postsData = [
    {
      title: 'BIM là gì? Tổng quan về Building Information Modeling',
      titleEn: 'What is BIM? An Overview of Building Information Modeling',
      excerpt:
        'Khái niệm BIM, sự khác biệt so với CAD truyền thống, và lý do vì sao BIM đang trở thành tiêu chuẩn bắt buộc trong ngành xây dựng.',
      excerptEn:
        'The concept of BIM, how it differs from traditional CAD, and why BIM is becoming a mandatory standard in the construction industry.',
      category: categories[0],
      tags: ['BIM cơ bản', 'Tổng quan'],
      cover: COVER('photo-1503387762-592deb58ef4e'),
    },
    {
      title: 'Lộ trình áp dụng BIM tại Việt Nam giai đoạn 2023-2030',
      titleEn: "Vietnam's BIM Adoption Roadmap 2023-2030",
      excerpt: 'Phân tích chính sách, lộ trình bắt buộc áp dụng BIM theo quyết định của Chính phủ và tác động đến doanh nghiệp.',
      excerptEn: "An analysis of government policy, the mandatory BIM rollout roadmap, and its impact on businesses.",
      category: categories[1],
      tags: ['Chính sách', 'Việt Nam'],
      cover: COVER('photo-1590986456866-a4bce0d84b04'),
    },
    {
      title: 'So sánh các phần mềm BIM phổ biến: Revit, ArchiCAD, Tekla',
      titleEn: 'Comparing Popular BIM Software: Revit, ArchiCAD, Tekla',
      excerpt: 'Đánh giá ưu nhược điểm của các phần mềm BIM hàng đầu để lựa chọn công cụ phù hợp với quy mô dự án.',
      excerptEn: 'Weighing the pros and cons of leading BIM software to help you choose the right tool for your project scale.',
      category: categories[2],
      tags: ['Revit', 'ArchiCAD', 'Phần mềm'],
      cover: COVER('photo-1581091012184-7c8d02c3f5a9'),
    },
    {
      title: 'Ứng dụng BIM trong thiết kế MEP và phát hiện xung đột (Clash Detection)',
      titleEn: 'Applying BIM to MEP Design and Clash Detection',
      excerpt: 'Quy trình phối hợp đa bộ môn, sử dụng Navisworks để phát hiện và xử lý xung đột trước khi thi công.',
      excerptEn: 'A multi-discipline coordination workflow using Navisworks to detect and resolve clashes before construction.',
      category: categories[3],
      tags: ['MEP', 'Clash Detection', 'Navisworks'],
      cover: COVER('photo-1581091226825-a6a2a5aee158'),
    },
    {
      title: 'Case study: Phối hợp BIM trong dự án tòa nhà văn phòng 25 tầng',
      titleEn: 'Case Study: BIM Coordination on a 25-Story Office Tower',
      excerpt: 'Chia sẻ thực tế quy trình triển khai BIM từ giai đoạn thiết kế cơ sở đến thi công tại một dự án văn phòng lớn.',
      excerptEn: 'A real-world look at the BIM workflow from schematic design through construction on a large office project.',
      category: categories[4],
      tags: ['Case study', 'Văn phòng'],
      cover: COVER('photo-1486406146926-c627a92ad1ab'),
    },
    {
      title: 'Dynamo cơ bản: Tự động hóa quy trình làm việc trong Revit',
      titleEn: 'Dynamo Basics: Automating Workflows in Revit',
      excerpt: 'Hướng dẫn nhập môn lập trình trực quan với Dynamo để tăng tốc các tác vụ lặp lại trong Revit.',
      excerptEn: 'An introduction to visual programming with Dynamo to speed up repetitive tasks in Revit.',
      category: categories[2],
      tags: ['Dynamo', 'Tự động hóa'],
      cover: COVER('photo-1487014679447-9f8336841d58'),
    },
  ];

  for (let i = 0; i < postsData.length; i++) {
    const p = postsData[i];
    const slug = p.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const content = `<p>${p.excerpt}</p><h2>Giới thiệu</h2><p>Nội dung chi tiết về ${p.title.toLowerCase()} sẽ được cập nhật bởi đội ngũ biên tập BIMKien. Bài viết này đóng vai trò minh họa cấu trúc nội dung mẫu cho hệ thống.</p><h2>Kết luận</h2><p>Ứng dụng đúng quy trình sẽ giúp doanh nghiệp tối ưu chi phí và tiến độ dự án.</p>`;
    const contentEn = `<p>${p.excerptEn}</p><h2>Introduction</h2><p>Detailed content about "${p.titleEn}" will be updated by the BIMKien editorial team. This article illustrates the sample content structure for the system.</p><h2>Conclusion</h2><p>Applying the right workflow helps businesses optimize cost and project timelines.</p>`;

    await db.post.upsert({
      where: { slug },
      update: {
        titleEn: p.titleEn,
        excerptEn: p.excerptEn,
        contentEn,
        metaTitleEn: p.titleEn,
        metaDescriptionEn: p.excerptEn,
      },
      create: {
        title: p.title,
        titleEn: p.titleEn,
        slug,
        excerpt: p.excerpt,
        excerptEn: p.excerptEn,
        content,
        contentEn,
        coverImage: p.cover,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - (postsData.length - i) * 3 * 24 * 60 * 60 * 1000),
        viewCount: Math.floor(Math.random() * 500) + 20,
        authorId: i % 2 === 0 ? admin.id : editor.id,
        categoryId: p.category.id,
        metaTitle: p.title,
        metaTitleEn: p.titleEn,
        metaDescription: p.excerpt,
        metaDescriptionEn: p.excerptEn,
        tags: {
          connectOrCreate: p.tags.map((name) => ({
            where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
            create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
          })),
        },
      },
    });
  }

  const firstPost = await db.post.findFirst({ orderBy: { publishedAt: 'desc' } });
  if (firstPost) {
    await db.comment.deleteMany({ where: { postId: firstPost.id } });
    const c1 = await db.comment.create({
      data: { content: 'Bài viết rất hữu ích, cảm ơn team BIMKien!', authorId: student1.id, postId: firstPost.id },
    });
    await db.comment.create({
      data: { content: 'Đồng ý, mong có thêm bài về ứng dụng thực tế.', authorId: student2.id, postId: firstPost.id, parentId: c1.id },
    });
    await db.favoritePost.upsert({
      where: { userId_postId: { userId: student1.id, postId: firstPost.id } },
      update: {},
      create: { userId: student1.id, postId: firstPost.id },
    });
  }

  // ---------- Projects ----------
  const projectsData = [
    {
      title: 'Tòa nhà văn phòng Summit Corporate Hub',
      titleEn: 'Summit Corporate Hub Office Tower',
      summary: 'Cao ốc văn phòng hạng A ứng dụng BIM toàn trình từ thiết kế đến bàn giao.',
      summaryEn: 'A Grade-A office tower with full BIM adoption from design through handover.',
      projectType: 'thuong-mai',
      investor: 'Công ty CP Đầu tư Summit',
      location: 'Quận 1, TP. Hồ Chí Minh',
      scale: '25 tầng, 32.000 m²',
      completedYear: 2023,
      cover: COVER('photo-1486406146926-c627a92ad1ab'),
    },
    {
      title: 'Khu biệt thự Horizon Heights Villas',
      titleEn: 'Horizon Heights Villas',
      summary: 'Quần thể biệt thự cao cấp phối hợp thiết kế kiến trúc – kết cấu bằng BIM.',
      summaryEn: 'A high-end villa community with architecture-structure design coordinated through BIM.',
      projectType: 'dan-dung',
      investor: 'Horizon Land',
      location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
      scale: '18 căn biệt thự, 4.500 m²',
      completedYear: 2022,
      cover: COVER('photo-1613977257363-707ba9348227'),
    },
    {
      title: 'Nhà máy Alpha Logistics Park',
      titleEn: 'Alpha Logistics Park Factory',
      summary: 'Tổ hợp nhà xưởng công nghiệp ứng dụng BIM để tối ưu hệ thống MEP.',
      summaryEn: 'An industrial warehouse complex using BIM to optimize MEP systems.',
      projectType: 'cong-nghiep',
      investor: 'Alpha Industrial JSC',
      location: 'Bình Dương',
      scale: '45.000 m² nhà xưởng',
      completedYear: 2021,
      cover: COVER('photo-1565793298595-6a879b1d9492'),
    },
    {
      title: 'The Grand Boulevard — Khu phức hợp hỗn hợp',
      titleEn: 'The Grand Boulevard — Mixed-Use Complex',
      summary: 'Dự án hỗn hợp căn hộ – thương mại quy mô lớn, phối hợp BIM đa bộ môn.',
      summaryEn: 'A large-scale residential-commercial mixed-use project with multi-discipline BIM coordination.',
      projectType: 'thuong-mai',
      investor: 'Grand Development Group',
      location: 'TP. Hà Nội',
      scale: '2 tháp 35 tầng, 60.000 m²',
      completedYear: 2024,
      cover: COVER('photo-1545324418-cc1a3fa10c00'),
    },
  ];

  for (const p of projectsData) {
    const slug = p.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const content = `<p>${p.summary}</p><h2>Phạm vi triển khai BIM</h2><p>Đội ngũ BIMKien phối hợp cùng chủ đầu tư triển khai mô hình LOD 300-400 cho các bộ môn Kiến trúc, Kết cấu và MEP, phục vụ kiểm soát xung đột và bóc tách khối lượng.</p>`;
    const contentEn = `<p>${p.summaryEn}</p><h2>BIM Scope</h2><p>The BIMKien team worked with the investor to develop LOD 300-400 models for the Architecture, Structure, and MEP disciplines, supporting clash control and quantity takeoff.</p>`;

    await db.project.upsert({
      where: { slug },
      update: {
        titleEn: p.titleEn,
        summaryEn: p.summaryEn,
        contentEn,
        metaTitleEn: p.titleEn,
        metaDescriptionEn: p.summaryEn,
      },
      create: {
        title: p.title,
        titleEn: p.titleEn,
        slug,
        summary: p.summary,
        summaryEn: p.summaryEn,
        content,
        contentEn,
        coverImage: p.cover,
        projectType: p.projectType,
        investor: p.investor,
        location: p.location,
        scale: p.scale,
        completedYear: p.completedYear,
        status: 'PUBLISHED',
        metaTitle: p.title,
        metaTitleEn: p.titleEn,
        metaDescription: p.summary,
        metaDescriptionEn: p.summaryEn,
      },
    });
  }

  // ---------- Courses ----------
  const revitCourse = await db.course.upsert({
    where: { slug: 'revit-kien-truc-tu-co-ban-den-nang-cao' },
    update: {
      titleEn: 'Revit Architecture: From Basics to Advanced',
      descriptionEn:
        'A course to help you master Autodesk Revit for architectural modeling, drawing production, and multi-discipline coordination under a standard BIM workflow.',
      metaTitleEn: 'Revit Architecture Course: Basics to Advanced',
      metaDescriptionEn: 'Learn Revit from A to Z: modeling, drawing production, BIM coordination.',
    },
    create: {
      title: 'Revit Kiến trúc: Từ cơ bản đến nâng cao',
      titleEn: 'Revit Architecture: From Basics to Advanced',
      slug: 'revit-kien-truc-tu-co-ban-den-nang-cao',
      description:
        'Khóa học giúp bạn làm chủ Autodesk Revit để dựng mô hình kiến trúc, xuất bản vẽ và phối hợp bộ môn theo quy trình BIM chuẩn.',
      descriptionEn:
        'A course to help you master Autodesk Revit for architectural modeling, drawing production, and multi-discipline coordination under a standard BIM workflow.',
      level: 'BEGINNER',
      price: 0,
      status: 'PUBLISHED',
      coverImage: COVER('photo-1503387762-592deb58ef4e'),
      metaTitle: 'Khóa học Revit Kiến trúc cơ bản đến nâng cao',
      metaTitleEn: 'Revit Architecture Course: Basics to Advanced',
      metaDescription: 'Học Revit từ A-Z: dựng mô hình, xuất bản vẽ, phối hợp BIM.',
      metaDescriptionEn: 'Learn Revit from A to Z: modeling, drawing production, BIM coordination.',
    },
  });

  const bimCourse = await db.course.upsert({
    where: { slug: 'quan-ly-du-an-bim-thuc-chien' },
    update: {
      titleEn: 'Hands-On BIM Project Management',
      descriptionEn:
        'A course for BIM Coordinators/Managers: setting up a BEP, coordination workflows, and model quality control.',
      metaTitleEn: 'Hands-On BIM Project Management Course',
      metaDescriptionEn: 'BIM Manager training: BEP, coordination workflows, quality control.',
    },
    create: {
      title: 'Quản lý dự án BIM thực chiến',
      titleEn: 'Hands-On BIM Project Management',
      slug: 'quan-ly-du-an-bim-thuc-chien',
      description: 'Khóa học dành cho BIM Coordinator/Manager: thiết lập BEP, quy trình phối hợp và kiểm soát chất lượng mô hình.',
      descriptionEn:
        'A course for BIM Coordinators/Managers: setting up a BEP, coordination workflows, and model quality control.',
      level: 'ADVANCED',
      price: 1500000,
      status: 'PUBLISHED',
      coverImage: COVER('photo-1581091226825-a6a2a5aee158'),
      metaTitle: 'Khóa học quản lý dự án BIM thực chiến',
      metaTitleEn: 'Hands-On BIM Project Management Course',
      metaDescription: 'Đào tạo BIM Manager: BEP, quy trình phối hợp, kiểm soát chất lượng.',
      metaDescriptionEn: 'BIM Manager training: BEP, coordination workflows, quality control.',
    },
  });

  async function seedChaptersAndLessons(
    courseId: string,
    chapters: { title: string; titleEn: string; lessons: { title: string; titleEn: string }[] }[]
  ) {
    await db.chapter.deleteMany({ where: { courseId } }); // reseed fresh each run (cascades to lessons/attachments)

    for (let ci = 0; ci < chapters.length; ci++) {
      const chapter = await db.chapter.create({
        data: { courseId, title: chapters[ci].title, titleEn: chapters[ci].titleEn, order: ci },
      });
      for (let li = 0; li < chapters[ci].lessons.length; li++) {
        const lesson = chapters[ci].lessons[li];
        await db.lesson.create({
          data: {
            chapterId: chapter.id,
            title: lesson.title,
            titleEn: lesson.titleEn,
            slug: lesson.title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[̀-ͯ]/g, '')
              .replace(/đ/g, 'd')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-'),
            order: li,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            content: `<p>Nội dung bài học "${lesson.title}" — video hướng dẫn kèm giải thích chi tiết từng bước thực hiện trong Revit.</p>`,
            contentEn: `<p>Lesson content for "${lesson.titleEn}" — a video walkthrough with detailed step-by-step guidance in Revit.</p>`,
            durationMin: 10 + li * 3,
          },
        });
      }
    }
  }

  await seedChaptersAndLessons(revitCourse.id, [
    {
      title: 'Làm quen với Revit',
      titleEn: 'Getting Started with Revit',
      lessons: [
        { title: 'Giới thiệu giao diện Revit', titleEn: 'Introduction to the Revit Interface' },
        { title: 'Thiết lập dự án và Levels/Grids', titleEn: 'Project Setup and Levels/Grids' },
        { title: 'Family cơ bản', titleEn: 'Basic Families' },
      ],
    },
    {
      title: 'Dựng mô hình kiến trúc',
      titleEn: 'Building the Architectural Model',
      lessons: [
        { title: 'Tường, cửa, cửa sổ', titleEn: 'Walls, Doors, Windows' },
        { title: 'Sàn, mái và cầu thang', titleEn: 'Floors, Roofs, and Stairs' },
        { title: 'Nội thất và ghi chú', titleEn: 'Interiors and Annotations' },
      ],
    },
    {
      title: 'Xuất bản vẽ & phối hợp',
      titleEn: 'Drawing Production & Coordination',
      lessons: [
        { title: 'Tạo mặt bằng, mặt cắt, hồ sơ in ấn', titleEn: 'Creating Plans, Sections, and Print Sets' },
        { title: 'Liên kết mô hình kết cấu/MEP', titleEn: 'Linking Structural/MEP Models' },
      ],
    },
  ]);

  await seedChaptersAndLessons(bimCourse.id, [
    {
      title: 'Thiết lập quy trình BIM',
      titleEn: 'Setting Up the BIM Workflow',
      lessons: [
        { title: 'Xây dựng BEP (BIM Execution Plan)', titleEn: 'Building a BEP (BIM Execution Plan)' },
        { title: 'Thiết lập CDE và phân quyền', titleEn: 'Setting Up a CDE and Permissions' },
      ],
    },
    {
      title: 'Phối hợp đa bộ môn',
      titleEn: 'Multi-Discipline Coordination',
      lessons: [
        { title: 'Quy trình Clash Detection với Navisworks', titleEn: 'Clash Detection Workflow with Navisworks' },
        { title: 'Quản lý issue và tiến độ phối hợp', titleEn: 'Managing Issues and Coordination Progress' },
      ],
    },
  ]);

  await db.enrollment.upsert({
    where: { userId_courseId: { userId: student1.id, courseId: revitCourse.id } },
    update: {},
    create: { userId: student1.id, courseId: revitCourse.id },
  });
  await db.enrollment.upsert({
    where: { userId_courseId: { userId: student2.id, courseId: revitCourse.id } },
    update: {},
    create: { userId: student2.id, courseId: revitCourse.id },
  });
  await db.enrollment.upsert({
    where: { userId_courseId: { userId: student2.id, courseId: bimCourse.id } },
    update: {},
    create: { userId: student2.id, courseId: bimCourse.id },
  });

  const firstChapterLessons = await db.lesson.findMany({
    where: { chapter: { courseId: revitCourse.id } },
    orderBy: [{ chapter: { order: 'asc' } }, { order: 'asc' }],
    take: 2,
  });
  for (const lesson of firstChapterLessons) {
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: student1.id, lessonId: lesson.id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: student1.id, lessonId: lesson.id, completed: true, completedAt: new Date() },
    });
  }

  await db.comment.deleteMany({ where: { courseId: revitCourse.id } });
  await db.comment.create({
    data: { content: 'Giảng viên giảng dễ hiểu, mình đã dựng được mô hình đầu tiên!', authorId: student1.id, courseId: revitCourse.id },
  });

  // ---------- Thư viện Family Revit ----------
  await db.familyDownload.deleteMany();
  await db.familyAccess.deleteMany();
  await db.familyPurchaseRequest.deleteMany();
  await db.family.deleteMany();

  const familyCategoriesData = [
    { name: 'Cửa', nameEn: 'Doors', slug: 'cua' },
    { name: 'Nội thất', nameEn: 'Furniture', slug: 'noi-that' },
    { name: 'Thiết bị vệ sinh', nameEn: 'Sanitary Fixtures', slug: 'thiet-bi-ve-sinh' },
    { name: 'Chiếu sáng', nameEn: 'Lighting', slug: 'chieu-sang' },
    { name: 'Kết cấu', nameEn: 'Structure', slug: 'ket-cau' },
  ];
  const familyCategories = [];
  for (const c of familyCategoriesData) {
    familyCategories.push(
      await db.familyCategory.upsert({ where: { slug: c.slug }, update: { nameEn: c.nameEn }, create: c })
    );
  }

  const storageDir = path.join(process.cwd(), 'storage', 'families');
  await mkdir(storageDir, { recursive: true });

  const familiesData = [
    {
      title: 'Cửa đi 1 cánh - Nhôm kính',
      titleEn: 'Single Door - Aluminum & Glass',
      description: 'Family cửa đi 1 cánh khung nhôm kính, đầy đủ tham số kích thước, LOD 300, tương thích Revit 2020 trở lên.',
      descriptionEn: 'A single-leaf aluminum-glass door family with full size parameters, LOD 300, compatible with Revit 2020 and later.',
      category: familyCategories[0],
      preview: COVER('photo-1509644851169-2acc08aa25b5'),
      price: 0,
    },
    {
      title: 'Bộ bàn ghế phòng họp 8 chỗ',
      titleEn: '8-Seat Meeting Table & Chair Set',
      description: 'Family nội thất bàn ghế phòng họp, có sẵn vật liệu và biến thể màu sắc, tối ưu dung lượng file.',
      descriptionEn: 'A meeting room furniture family with built-in materials and color variants, optimized for small file size.',
      category: familyCategories[1],
      preview: COVER('photo-1524758631624-e2822e304c36'),
      price: 0,
    },
    {
      title: 'Bồn cầu treo tường cao cấp',
      titleEn: 'Premium Wall-Hung Toilet',
      description: 'Family thiết bị vệ sinh chi tiết cao, kèm thông số kỹ thuật lắp đặt, phù hợp hồ sơ thiết kế MEP.',
      descriptionEn: 'A high-detail sanitary fixture family with installation specs, suitable for MEP design documentation.',
      category: familyCategories[2],
      preview: COVER('photo-1620626011761-996317b8d101'),
      price: 150000,
    },
    {
      title: 'Đèn thả trần trang trí',
      titleEn: 'Decorative Pendant Light',
      description: 'Family đèn chiếu sáng trang trí, có tham số bật/tắt ánh sáng, dùng cho phối cảnh nội thất.',
      descriptionEn: 'A decorative lighting family with an on/off light parameter, ideal for interior renderings.',
      category: familyCategories[3],
      preview: COVER('photo-1524758631624-e2822e304c36'),
      price: 0,
    },
    {
      title: 'Hệ khung kèo thép mái nhà xưởng',
      titleEn: 'Steel Roof Truss System',
      description: 'Family kết cấu khung kèo thép tham số hóa theo khẩu độ, phục vụ dựng nhanh mô hình nhà xưởng công nghiệp.',
      descriptionEn: 'A parametric steel truss structural family driven by span, for quickly modeling industrial warehouse buildings.',
      category: familyCategories[4],
      preview: COVER('photo-1581091226825-a6a2a5aee158'),
      price: 250000,
    },
  ];

  for (const f of familiesData) {
    const slug = f.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const fileName = `${slug}.rfa`;
    const placeholderContent = `Đây là file mẫu placeholder cho family "${f.title}". Hãy vào /admin/family để tải lên file .rfa thật.`;
    const storagePath = `families/${slug}.txt`;
    await writeFile(path.join(process.cwd(), 'storage', storagePath), placeholderContent, 'utf-8');

    await db.family.upsert({
      where: { slug },
      update: {},
      create: {
        title: f.title,
        titleEn: f.titleEn,
        slug,
        description: f.description,
        descriptionEn: f.descriptionEn,
        previewImage: f.preview,
        categoryId: f.category.id,
        softwareInfo: 'Revit 2020 trở lên',
        price: f.price,
        status: 'PUBLISHED',
        fileUrl: storagePath,
        fileName,
        fileSize: Buffer.byteLength(placeholderContent, 'utf-8'),
        downloadCount: Math.floor(Math.random() * 300) + 5,
        metaTitle: f.title,
        metaTitleEn: f.titleEn,
        metaDescription: f.description,
        metaDescriptionEn: f.descriptionEn,
      },
    });
  }

  const paidFamily = await db.family.findFirst({ where: { price: { gt: 0 } } });
  if (paidFamily) {
    await db.familyPurchaseRequest.deleteMany({ where: { familyId: paidFamily.id } });
    await db.familyPurchaseRequest.create({
      data: { userId: student2.id, familyId: paidFamily.id, note: 'Mình đã chuyển khoản, nhờ admin duyệt giúp.' },
    });
  }

  // ---------- Contacts ----------
  await db.contact.deleteMany();
  await db.contact.createMany({
    data: [
      {
        name: 'Lê Văn Cường',
        email: 'cuong.le@example.com',
        phone: '0912345678',
        subject: 'Tư vấn triển khai BIM cho dự án nhà máy',
        message: 'Chào BIMKien, công ty tôi đang cần tư vấn triển khai BIM cho dự án nhà máy sản xuất. Mong được hỗ trợ báo giá.',
      },
      {
        name: 'Phạm Thị Dung',
        email: 'dung.pham@example.com',
        subject: 'Hỏi về khóa học Revit',
        message: 'Khóa học Revit có hỗ trợ cấp chứng chỉ hoàn thành không ạ?',
      },
    ],
  });

  console.log('Seed hoàn tất!');
  console.log('Tài khoản demo (mật khẩu: Password123!):');
  console.log('  admin@bimkien.vn   — Quản trị viên');
  console.log('  editor@bimkien.vn  — Biên tập viên');
  console.log('  hocvien1@bimkien.vn — Học viên');
  console.log('  hocvien2@bimkien.vn — Học viên');
}

// Only auto-run when executed directly (tsx prisma/seed.ts) — skipped when
// imported as a module (e.g. by the one-time /api/internal-seed route).
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
