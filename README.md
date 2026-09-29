# BIMKien — Nền tảng BIM, Portfolio & Khóa học

Website hợp nhất 3 mảng: **Portfolio dự án**, **Blog kiến thức BIM** và **Nền tảng khóa học** (chương/bài, video,
tài liệu đính kèm, theo dõi tiến độ). Có trang quản trị `/admin` đầy đủ CRUD cho toàn bộ nội dung.

## Vì sao chọn stack này

**Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth (Auth.js v5)**, thay vì
WordPress, vì:

- Trang có 3 mô hình dữ liệu quan hệ chặt (bài viết ↔ chuyên mục/tag, khóa học ↔ chương ↔ bài học ↔ tiến độ học
  theo từng user, dự án ↔ thư viện ảnh) — Prisma + Postgres mô hình hóa và truy vấn việc này rõ ràng, type-safe
  hơn nhiều so với custom post type của WordPress.
- Tính năng "theo dõi tiến độ học", "đăng ký khóa học", "yêu thích bài viết" là logic ứng dụng thực sự (có
  trạng thái theo từng người dùng), phù hợp với một web app thay vì một CMS nội dung tĩnh.
- Toàn bộ code (frontend, API, database schema) nằm trong một repo TypeScript duy nhất, dễ bảo trì, dễ tự vận
  hành về lâu dài mà không phụ thuộc hệ sinh thái plugin của bên thứ ba.
- Deploy dễ dàng, chi phí thấp/miễn phí với Vercel (hosting) + Neon hoặc Supabase (Postgres serverless).

Đánh đổi: quản trị nội dung yêu cầu qua trang `/admin` tự xây (không có hệ sinh thái plugin như WordPress), nhưng
trang quản trị đã được thiết kế đơn giản, tiếng Việt, không cần biết code để sử dụng hàng ngày.

## Yêu cầu môi trường

- [Node.js 20 LTS](https://nodejs.org/) trở lên
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (chạy PostgreSQL cục bộ) — hoặc một
  PostgreSQL server có sẵn (local/cloud)
- Git

## Cài đặt lần đầu

```bash
# 1. Cài dependency
npm install

# 2. Tạo file .env.local từ mẫu
cp .env.example .env.local
# Mở .env.local, tạo AUTH_SECRET bằng lệnh: openssl rand -base64 32

# 3. Bật PostgreSQL bằng Docker (cổng 5433 để không đụng dự án khác trên máy)
docker compose -f docker/docker-compose.yml up -d

# 4. Tạo bảng trong database
npm run db:migrate

# 5. Seed dữ liệu mẫu (4 tài khoản demo, 6 bài viết, 4 dự án, 2 khóa học có bài học)
npm run db:seed

# 6. Chạy dev server
npm run dev
```

Mở http://localhost:3000 — trang chủ hiển thị ngay với dữ liệu mẫu. Trang quản trị tại
http://localhost:3000/admin (đăng nhập bằng tài khoản admin bên dưới).

> Không có Docker? Trỏ `DATABASE_URL` trong `.env.local` tới bất kỳ PostgreSQL 14+ nào (Neon, Supabase, Railway,
> hoặc cài đặt cục bộ), rồi chạy lại bước 4-6.

## Tài khoản demo (sau khi seed)

Mật khẩu chung: `Password123!`

| Email | Vai trò |
|---|---|
| admin@bimkien.vn | Quản trị viên (toàn quyền `/admin`) |
| editor@bimkien.vn | Biên tập viên (quản lý nội dung, không quản lý người dùng) |
| hocvien1@bimkien.vn | Học viên (đã đăng ký khóa học Revit) |
| hocvien2@bimkien.vn | Học viên |

## Các lệnh hay dùng

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm run start` | Build & chạy bản production |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Tạo/cập nhật migration Prisma (dev) |
| `npm run db:seed` | Chạy lại seed dữ liệu mẫu |
| `npm run db:studio` | Mở Prisma Studio để xem/sửa dữ liệu trực quan |

## Cấu trúc thư mục

```
src/
  app/
    (site)/            Các trang công khai: trang chủ, blog, dự án, khóa học, liên hệ, đăng nhập/ký...
    admin/              Trang quản trị (yêu cầu role ADMIN/EDITOR)
    api/                Route handlers: đăng ký, liên hệ, bình luận, yêu thích, tiến độ học, upload...
  components/
    ui/                 Component dùng chung (Button, Badge, Container, SectionHeading...)
    layout/             Header, Footer
    home/                Các section trang chủ (Hero, Stats, Featured Projects...)
    blog/ courses/ comments/ contact/   Component theo domain
    admin/               Sidebar, form CRUD, rich text editor, biểu đồ dashboard
  lib/
    actions/            Server Actions cho toàn bộ CRUD trong /admin
    db.ts               Prisma client singleton
    auth.ts             Cấu hình NextAuth (Credentials + JWT)
    settings.ts          Đọc cấu hình site (cache trong bộ nhớ)
    upload.ts            Lưu file upload vào public/uploads
prisma/
  schema.prisma          Toàn bộ data model
  seed.ts                 Script seed dữ liệu mẫu
```

## Model dữ liệu chính

`User` (role ADMIN/EDITOR/STUDENT) · `Post` + `Category` + `Tag` · `Project` + `ProjectImage` ·
`Course` + `Chapter` + `Lesson` + `Attachment` · `Enrollment` + `LessonProgress` · `Comment` (dùng chung cho
Post và Course, hỗ trợ reply 1 cấp) · `FavoritePost` · `Contact` · `SiteSetting` · `StatItem` · `ViewEvent`
(phục vụ biểu đồ lượt xem trong dashboard).

## Bảo mật đã áp dụng

- Mật khẩu hash bằng `bcryptjs`, không bao giờ lưu plaintext.
- Session dùng JWT (NextAuth v5, Credentials provider).
- Mọi route `/admin/**` và Server Action quản trị đều gọi `requireStaff()`/`requireAdmin()` để chặn truy cập
  trái phép; các thao tác nhạy cảm (đổi vai trò, khóa tài khoản, cài đặt site) yêu cầu đúng role `ADMIN`.
- Form liên hệ có honeypot field + rate limit theo IP (5 lần / 10 phút) để hạn chế spam cơ bản.
- Upload file giới hạn 8MB, chỉ chấp nhận qua API đã xác thực quyền biên tập viên trở lên.

## Giới hạn hiện tại & gợi ý nâng cấp

- **Lưu trữ ảnh/tài liệu**: hiện lưu trực tiếp vào `public/uploads` trên ổ đĩa server — phù hợp khi tự host
  bằng Docker/VPS (dữ liệu persist qua volume), **không phù hợp khi deploy lên Vercel** (filesystem serverless
  không persist). Nếu deploy Vercel, hãy thay `src/lib/upload.ts` bằng Vercel Blob, Cloudflare R2 hoặc AWS S3.
- **Phản hồi liên hệ**: admin trả lời được lưu trong hệ thống (`/admin/lien-he`) nhưng chưa tự động gửi email
  cho người gửi — có thể tích hợp Resend/SMTP nếu cần gửi email thật.
- **Sắp xếp chương/bài học**: dùng nút lên/xuống thay vì kéo-thả, đơn giản và không cần thư viện ngoài.
- **Testimonial trang chủ**: nội dung tĩnh trong `src/components/home/Testimonials.tsx` (không có trong yêu
  cầu CRUD ban đầu) — có thể chuyển thành model CRUD nếu cần chỉnh sửa qua `/admin`.

## Triển khai (Deploy)

### Phương án khuyến nghị: Vercel + Neon/Supabase

1. Tạo database PostgreSQL miễn phí trên [Neon](https://neon.tech) hoặc [Supabase](https://supabase.com), lấy
   connection string.
2. Đẩy code lên GitHub, import project vào [Vercel](https://vercel.com).
3. Khai báo biến môi trường trên Vercel: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` (URL production),
   `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`.
4. Chạy migration lên database production (chạy cục bộ, trỏ `DATABASE_URL` tới DB production):
   ```bash
   npm run db:migrate:deploy
   npm run db:seed   # tuỳ chọn, nếu muốn có dữ liệu mẫu ban đầu
   ```
5. Deploy. **Lưu ý**: thay hệ thống upload file sang dịch vụ lưu trữ đối tượng (xem mục Giới hạn ở trên) trước
   khi đưa vào sử dụng thật.

### Phương án tự host (VPS + Docker, giữ nguyên upload nội bộ)

Tương tự dự án `CDE Portal` trong cùng thư mục cha: build image, chạy bằng `docker compose up -d --build`,
đặt Caddy/Nginx phía trước để tự cấp HTTPS, mount volume cho `public/uploads` và cấu hình PostgreSQL container
hoặc managed database. Cách này giữ được tính năng upload file cục bộ mà không cần đổi sang S3/R2.
