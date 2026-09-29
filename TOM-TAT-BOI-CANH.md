# Tóm tắt bối cảnh dự án BIMKien

File này ghi lại các quyết định, lý do, và bối cảnh phát sinh trong quá trình xây dựng dự án qua trao đổi với
Claude — dùng để bất kỳ ai (kể cả một phiên Claude Code mới) đọc lại và nắm bắt nhanh mà không cần hỏi lại từ đầu.
Hướng dẫn cài đặt/vận hành kỹ thuật xem tại [README.md](README.md).

## 1. Bối cảnh & mục tiêu

- Đây là website mới, độc lập, **không liên quan** đến 2 dự án khác nằm cùng thư mục cha
  (`E:\1.CongViecDangThucHien\7.SoDoBIM\CDE\`): `CDE Portal` (hệ thống nội bộ khác) và `blog-bim` (bản Astro tĩnh
  cũ, không dùng nữa — vẫn được giữ nguyên, không đụng vào).
- Mục đích: nền tảng chia sẻ kiến thức BIM, giới thiệu dự án, cung cấp khóa học, và thư viện family Revit
  (miễn phí + trả phí) cho cộng đồng kiến trúc – xây dựng Việt Nam.
- Người vận hành chính (admin) không rành code sâu — mọi thao tác quản lý nội dung đều làm qua trang `/admin`,
  không cần sửa code.

## 2. Stack công nghệ & lý do chọn

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth v5 — chọn thay vì WordPress
vì dữ liệu có nhiều quan hệ chặt (khóa học ↔ chương ↔ bài học ↔ tiến độ học theo từng user, family ↔ quyền tải
theo từng user...), cần logic ứng dụng thực sự (không chỉ nội dung tĩnh). Chi tiết đầy đủ xem mục "Vì sao chọn
stack này" trong README.md.

## 3. Các quyết định thiết kế quan trọng (và lý do)

### 3.1. Mua family Revit trả phí — duyệt thủ công, KHÔNG phải cổng thanh toán thật
Khi bấm "Mua ngay", hệ thống chỉ tạo **yêu cầu mua** (`FamilyPurchaseRequest`), admin tự xác nhận đã nhận tiền
(chuyển khoản/Momo ngoài hệ thống) rồi duyệt tại `/admin/family/yeu-cau` → hệ thống tự mở khóa tải file.
**Lý do**: tích hợp cổng thanh toán thật (VNPay/Momo/ZaloPay/Stripe) cần tài khoản merchant riêng của bạn, không
thể tự làm thay. Nếu sau này muốn thanh toán online thật, đây là việc cần làm thêm — không quá phức tạp để nối
vào flow đã có sẵn.

### 3.2. File upload lưu cục bộ trên ổ đĩa server (`public/uploads/` và `storage/`)
- Ảnh (bìa bài viết, dự án, khóa học, family...) lưu tại `public/uploads/` — truy cập công khai qua URL trực tiếp.
- File family Revit (.rfa) lưu tại `storage/` (**ngoài** `public/`) — cố ý để không ai tải trực tiếp qua URL, chỉ
  tải được qua API có kiểm tra đăng nhập/quyền mua (`/api/family/[id]/download`).
- **Giới hạn quan trọng**: cách này chỉ hoạt động khi tự host bằng Docker/VPS (ổ đĩa persist lâu dài). Nếu sau
  này deploy lên Vercel, ổ đĩa serverless không giữ file lâu dài — cần đổi sang S3/Cloudflare R2/Vercel Blob.

### 3.3. Đăng ký bắt buộc Email + Số điện thoại
Theo yêu cầu bổ sung sau — số điện thoại là trường bắt buộc khi đăng ký (định dạng VN: `0xxxxxxxxx` hoặc
`+84xxxxxxxxx`), có kiểm tra trùng số điện thoại giữa các tài khoản.

### 3.4. Testimonial (đánh giá học viên) ở trang chủ là nội dung tĩnh
Không có trong yêu cầu CRUD ban đầu nên đang hardcode trong
`src/components/home/Testimonials.tsx`, sửa trực tiếp trong code nếu cần đổi nội dung.

### 3.5. Song ngữ Việt/Anh — chỉ trang công khai, KHÔNG dịch giao diện admin
Website có nút chuyển VI/EN ở góc phải Header (lưu lựa chọn qua cookie `NEXT_LOCALE`, không đổi URL). Toàn bộ
menu, nút bấm, nhãn... của trang công khai đã dịch (xem `src/lib/i18n/messages/vi.ts` và `en.ts`). Nội dung do
admin nhập (bài viết, dự án, khóa học, family...) có **thêm cột `*En`** riêng cho từng trường (VD: `titleEn`,
`contentEn`) — nếu admin không nhập bản tiếng Anh, trang sẽ tự hiển thị bản tiếng Việt (cơ chế fallback trong
`src/lib/i18n/localized.ts`).
**Lý do KHÔNG dịch giao diện `/admin`**: người dùng trang quản trị chỉ có bạn (nói tiếng Việt), dịch giao diện
admin không phục vụ mục tiêu "song ngữ cho khách truy cập" mà chỉ tốn thêm khối lượng công việc rất lớn. Form
admin chỉ thêm ô nhập "(Tiếng Anh)" cạnh mỗi trường nội dung — nhãn ô vẫn tiếng Việt.
**Giới hạn**: `StatItem` (số liệu ở trang chủ/giới thiệu) và nội dung admin khác chưa có cột `*En` — hiện tại các
số liệu này hiển thị tiếng Việt ở cả 2 ngôn ngữ.

## 4. Tài khoản demo (sau khi `npm run db:seed`)

Mật khẩu chung: `Password123!`

| Email | Vai trò |
|---|---|
| admin@bimkien.vn | Quản trị viên |
| editor@bimkien.vn | Biên tập viên |
| hocvien1@bimkien.vn | Học viên |
| hocvien2@bimkien.vn | Học viên (có sẵn 1 yêu cầu mua family đang chờ duyệt, dùng để test flow duyệt mua) |

## 5. Trạng thái hiện tại

Đã hoàn thành và kiểm thử (typecheck, lint, build production sạch lỗi):
- Toàn bộ trang công khai: Trang chủ, Blog, Dự án, Khóa học (có theo dõi tiến độ học), **Family Revit** (thư
  viện, tải miễn phí cần đăng nhập, mua trả phí cần duyệt), Giới thiệu, Liên hệ, Đăng ký/Đăng nhập
- Trang quản trị `/admin` đầy đủ: Dashboard có biểu đồ, CRUD Bài viết/Dự án/Khóa học/Family, quản lý Người dùng,
  duyệt Bình luận, hộp thư Liên hệ, duyệt Yêu cầu mua Family, Cài đặt chung

## 6. Việc CHƯA làm (nếu muốn phát triển tiếp)

- Tích hợp cổng thanh toán thật cho family trả phí (xem mục 3.1)
- Gửi email thật khi admin trả lời liên hệ (hiện chỉ lưu trong hệ thống, xem trong `/admin/lien-he`)
- Chuyển file upload sang S3/R2 nếu deploy Vercel (xem mục 3.2)
- CRUD cho Testimonial trang chủ (hiện đang tĩnh, xem mục 3.4)
- Kéo-thả sắp xếp chương/bài học (hiện dùng nút lên/xuống, đơn giản nhưng chưa phải kéo-thả)
- Link chia sẻ công khai thật (chưa deploy — xem README mục Triển khai, khuyến nghị Vercel + Neon/Supabase)

## 7. Bối cảnh môi trường phát sinh trong quá trình làm (không ảnh hưởng đến code)

Trong lúc phát triển, máy đang dùng lúc đó (máy công ty) không có Docker/quyền admin và mạng chặn cổng
database — nên tạm dùng PostgreSQL portable (`pgsql-portable/`, không nằm trong zip này) để chạy thử tại chỗ.
**Việc này không liên quan gì đến code** — ở máy khác (nhà, có Docker + quyền admin + mạng bình thường), chỉ cần
làm đúng theo README.md (Docker) là chạy được, không cần quan tâm chi tiết này.
