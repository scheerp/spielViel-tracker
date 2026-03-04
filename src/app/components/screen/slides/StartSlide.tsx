'use client';

import Image from 'next/image';

export default function StartSlide() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src="/bg_2500.png"
        alt="Hintergrund"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-8">
        <Image
          src="/logo.svg"
          alt="Spiel Viel Logo"
          width={1200}
          height={500}
          priority
          sizes="(max-width: 1280px) 85vw, 1200px"
          style={{ height: 'auto' }}
          className="h-auto w-[85vw] max-w-[1200px] object-contain"
        />
      </div>
    </div>
  );
}
