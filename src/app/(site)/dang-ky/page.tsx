'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? t.common.genericError);
      setLoading(false);
      return;
    }

    await signIn('credentials', { email: payload.email, password: payload.password, redirect: false });
    setLoading(false);
    router.push('/');
    router.refresh();
  }

  return (
    <div className="container-wide flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 p-8 shadow-card">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900">{t.auth.registerTitle}</h1>
        <p className="mb-6 text-sm text-ink-500">{t.auth.registerDescription}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.auth.fullName}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.auth.email}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.auth.phone}</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="0912345678"
              pattern="^(0\d{9}|\+84\d{9})$"
              title="Số điện thoại Việt Nam hợp lệ, VD: 0912345678"
              className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.auth.password}</label>
            <PasswordInput
              name="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? t.auth.registering : t.auth.registerButton} <UserPlus size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {t.auth.haveAccount}{' '}
          <Link href="/dang-nhap" className="font-semibold text-accent-600 hover:underline">
            {t.auth.loginNow}
          </Link>
        </p>
      </div>
    </div>
  );
}
