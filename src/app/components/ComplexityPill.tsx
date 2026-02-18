import { ComplexityMapping, ComplexityType } from '@lib/utils';

type ComplexityPillType = {
  complexityName?: ComplexityType;
  className?: string;
};

const ComplexityPill = ({ complexityName, className }: ComplexityPillType) => {
  if (!complexityName) return null;
  return (
    <p
      className={`${className} ${ComplexityMapping[complexityName].color} text-shadow-outline-dark w-[6.8rem] rounded-full border-[3px] border-foreground text-center text-sm font-semibold text-white`}
    >
      {ComplexityMapping[complexityName].label}
    </p>
  );
};

export default ComplexityPill;
