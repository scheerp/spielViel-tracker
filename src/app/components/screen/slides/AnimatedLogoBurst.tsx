'use client';

import Image from 'next/image';

type AnimatedLogoBurstProps = {
  className?: string;
  logoSrc?: string;
};

export default function AnimatedLogoBurst({
  className = '',
  logoSrc = '/logo.svg',
}: AnimatedLogoBurstProps) {
  return (
    <div className={`relative aspect-[1583/910] w-full ${className}`}>
      <Image
        src={logoSrc}
        alt="Spiel Viel Logo"
        fill
        priority
        sizes="(max-width: 1280px) 85vw, 1200px"
        className="object-contain"
      />
    </div>
  );
}
