'use client';

import ScreenRotatorWrapper from '@components/screen/ScreenRotatorWrapper';

export default function ScreenPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <ScreenRotatorWrapper />
    </main>
  );
}
