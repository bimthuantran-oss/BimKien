'use client';

import { useState, type FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

function LoginForm() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(t.auth.wrongCredentials);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="container-wide flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 p-8 shadow-card">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900">{t.auth.loginTitle}</h1>
        <p className="mb-6 text-sm text-ink-500">{t.auth.loginDescription}</p>

        <form onSubmit={onSubmit} className="space-y-4">
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
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.auth.password}</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? t.auth.loggingIn : t.auth.loginButton} <LogIn size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {t.auth.noAccount}{' '}
          <Link href="/dang-ky" className="font-semibold text-accent-600 hover:underline">
            {t.auth.registerNow}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
