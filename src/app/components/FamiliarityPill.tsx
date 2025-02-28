import { FamiliarityValueMapping } from '@lib/utils';

type FamiliarityPillType = {
  familiarity?: number;
  className?: string;
};

const FamiliarityPill = ({ familiarity, className }: FamiliarityPillType) => {
  if (familiarity === undefined || familiarity === null) return null;
  const mapping = FamiliarityValueMapping[familiarity];
  if (!mapping) return null;
  return (
    <p
      className={`w-36 rounded-full text-center text-lg font-semibold ${className} ${mapping.color}`}
    >
      {mapping.label}
    </p>
  );
};

export default FamiliarityPill;
