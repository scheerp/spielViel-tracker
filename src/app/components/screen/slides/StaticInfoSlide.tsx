'use client';

import Image from 'next/image';

const StaticInfoSlide = ({
  title,
  imageSrc,
  imageAlt,
}: {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-background px-8 text-center">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          width={800}
          height={500}
          sizes="70vw"
          className="max-h-[50vh] w-auto max-w-[70vw] object-contain"
        />
      )}
      <h1 className="text-5xl font-semibold text-primary">{title}</h1>
    </div>
  );
};

export default StaticInfoSlide;
