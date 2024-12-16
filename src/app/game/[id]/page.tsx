import GameDetails from '@components/GameDetails';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: GamePageProps) => {
  const id = (await params).id;

  return <GameDetails gameId={id} />;
};

export default Page;
