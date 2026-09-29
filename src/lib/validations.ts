import { z } from 'zod';

const VN_PHONE_REGEX = /^(0\d{9}|\+84\d{9})$/;

export const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string({ required_error: 'Vui lòng nhập số điện thoại' })
    .trim()
    .regex(VN_PHONE_REGEX, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(4000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export const commentSchema = z.object({
  content: z.string().min(2, 'Bình luận quá ngắn').max(2000),
  postId: z.string().cuid().optional(),
  courseId: z.string().cuid().optional(),
  parentId: z.string().cuid().optional(),
});
