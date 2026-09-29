'use client';

import { useState, type FormEvent } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus('success');
      e.currentTarget.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t.common.genericError);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-10 text-center">
        <CheckCircle2 className="text-accent-500" size={40} />
        <p className="font-display text-lg font-bold text-ink-900">{t.contact.successTitle}</p>
        <p className="text-sm text-ink-500">{t.contact.successDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot field — hidden from real users, bots tend to fill every field */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t.contact.fullName} name="name" required />
        <Field label={t.contact.email} name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t.contact.phone} name="phone" />
        <Field label={t.contact.subject} name="subject" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-700">{t.contact.message}</label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-50 sm:w-auto">
        {status === 'loading' ? t.contact.sending : t.contact.sendButton} <Send size={16} />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
      />
    </div>
  );
}
