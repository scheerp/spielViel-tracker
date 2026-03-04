import GameDetails from '@components/GameDetails';
import Loading from '@components/Loading';
import { Suspense } from 'react';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: GamePageProps) => {
  const id = (await params).id;

  return (
    <Suspense fallback={<Loading />}>
      <GameDetails gameId={id} />
    </Suspense>
  );
};

export default Page;
