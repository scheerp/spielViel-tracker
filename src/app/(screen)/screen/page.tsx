'use client';

import ScreenRotatorWrapper from '@components/screen/ScreenRotatorWrapper';
import Loading from '@components/Loading';
import { Suspense } from 'react';

export default function ScreenPage() {
  return (
    <main className="h-screen w-screen overflow-x-hidden bg-background text-foreground">
      <Suspense fallback={<Loading />}>
        <ScreenRotatorWrapper />
      </Suspense>
    </main>
  );
}
