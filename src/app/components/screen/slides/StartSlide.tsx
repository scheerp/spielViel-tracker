'use client';

import Image from 'next/image';
import AnimatedLogoBurst from './AnimatedLogoBurst';

type StartSlideProps = {
  animationNonce?: number;
};

export default function StartSlide({ animationNonce = 0 }: StartSlideProps) {
  const logoSrc = `/logo.svg?cycle=${animationNonce}`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#6E294C]">
      <Image
        src="/splash.png"
        alt="Hintergrund"
        fill
        priority
        sizes="100vw"
        className="my-10 scale-[1.07]"
      />
      <Image
        src="/border.svg"
        alt="border"
        fill
        sizes="100vw"
        className="z-10 scale-[0.94]"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <Image
          src="/glow.png"
          alt="glow"
          width={1600}
          height={900}
          sizes="80vw"
          className="animate-glow-pop w-[80vw] object-contain"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[73%] z-20 -translate-y-1/2 bg-foreground py-20 text-center">
        <p className="animate-welcome-pop font-comic z-30 text-8xl font-semibold tracking-wide text-backgroundDark">
          Herzlich willkommen
        </p>
      </div>

      <div className="absolute bottom-[26.5%] z-40 flex w-full justify-center px-8">
        <AnimatedLogoBurst
          className="w-[85vw] max-w-[1300px]"
          logoSrc={logoSrc}
        />
      </div>
    </div>
  );
}
