export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M50,14 L18.8,32 L18.8,68 L50,86 L50,50 Z" fill="#FF6B1A" />
      <path d="M50,50 L18.8,32" stroke="#C7460A" strokeWidth="1.5" strokeOpacity="0.55" fill="none" />
      <path
        d="M50,14 L50,50 L50,86 L81.2,68 L81.2,32 Z"
        fill="none"
        stroke="#FF6B1A"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M50,50 L81.2,32" stroke="#FF6B1A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
