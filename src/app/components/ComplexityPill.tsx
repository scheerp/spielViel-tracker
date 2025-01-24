import { getComplexity } from '@lib/utils';

const ComplexityPill = ({ complexity }: { complexity: number }) => {
  const complexityData = getComplexity(complexity);
  if (complexity === 0) return null;
  return (
    <p
      className={`${complexityData?.color} w-[6.7rem] rounded-full text-center text-sm`}
    >
      {complexityData?.complexity}
    </p>
  );
};

export default ComplexityPill;
