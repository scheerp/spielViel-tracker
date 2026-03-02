'use client';

export default function StaticInfoSlide({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-8 text-center">
      <h1 className="text-5xl font-semibold text-primary">{title}</h1>
    </div>
  );
}
