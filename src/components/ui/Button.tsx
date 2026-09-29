import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'outline-dark' | 'ghost';

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  'outline-dark': 'btn-outline-dark',
  ghost: 'btn-ghost',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
};

export function Button({
  children,
  variant = 'primary',
  className,
  icon,
  href,
  ...rest
}: CommonProps & ({ href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>)) {
  return (
    <Link href={href} className={cn(variantClass[variant], className)} {...rest}>
      {children}
      {icon}
    </Link>
  );
}

export function ButtonAction({
  children,
  variant = 'primary',
  className,
  icon,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(variantClass[variant], className)} {...rest}>
      {children}
      {icon}
    </button>
  );
}
