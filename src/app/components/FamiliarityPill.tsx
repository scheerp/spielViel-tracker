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
      className={`${className} text-shadow-outline-dark rounded-full border-[3px] border-foreground text-center text-white ${mapping.color}`}
    >
      {mapping.label}
    </p>
  );
};

export default FamiliarityPill;
