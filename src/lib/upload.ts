import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');
// Files outside public/ are never served by direct URL — only through an authenticated API route.
const PRIVATE_STORAGE_ROOT = path.join(process.cwd(), 'storage');

const SAFE_EXT = /^[a-z0-9]{1,8}$/i;

// Vercel's filesystem is read-only in production, so once BLOB_READ_WRITE_TOKEN
// is present (auto-injected when a Blob store is linked to the project) uploads
// go to Vercel Blob instead of local disk. Local dev is untouched.
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

function safeExtOf(file: File): string {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  return SAFE_EXT.test(ext) ? ext : 'bin';
}

export async function saveUploadedFile(file: File, subdir: 'covers' | 'gallery' | 'attachments' | 'logos'): Promise<string> {
  const filename = `${randomUUID()}.${safeExtOf(file)}`;

  if (USE_BLOB) {
    const blob = await put(`uploads/${subdir}/${filename}`, file, { access: 'public' });
    return blob.url;
  }

  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${subdir}/${filename}`;
}

/**
 * Saves a file that must never be reachable by a direct public link — retrieved
 * only through the access-checked download API route. On Vercel Blob this relies
 * on the object's random unguessable path; the URL is never exposed to the client.
 */
export async function savePrivateFile(
  file: File,
  subdir: 'families'
): Promise<{ storagePath: string; size: number; originalName: string }> {
  const filename = `${randomUUID()}.${safeExtOf(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (USE_BLOB) {
    const blob = await put(`private/${subdir}/${filename}`, buffer, { access: 'public' });
    return { storagePath: blob.url, size: buffer.byteLength, originalName: file.name };
  }

  const dir = path.join(PRIVATE_STORAGE_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  const storagePath = path.join(subdir, filename);
  await writeFile(path.join(PRIVATE_STORAGE_ROOT, storagePath), buffer);

  return { storagePath: storagePath.replace(/\\/g, '/'), size: buffer.byteLength, originalName: file.name };
}

export async function readPrivateFile(storagePath: string): Promise<Buffer> {
  if (/^https?:\/\//.test(storagePath)) {
    const res = await fetch(storagePath);
    if (!res.ok) throw new Error('Failed to fetch private file from blob storage');
    return Buffer.from(await res.arrayBuffer());
  }

  const resolved = path.join(PRIVATE_STORAGE_ROOT, storagePath);
  if (!resolved.startsWith(PRIVATE_STORAGE_ROOT)) throw new Error('Invalid storage path');
  return readFile(resolved);
}

export function originalFileName(file: File): string {
  return file.name;
}
