import { ComplexityMapping, ComplexityType } from '@lib/utils';

type ComplexityPillType = {
  complexityName?: ComplexityType;
  className?: string;
};

const ComplexityPill = ({ complexityName, className }: ComplexityPillType) => {
  if (!complexityName) return null;
  return (
    <p
      className={`${className} ${ComplexityMapping[complexityName].color} w-[6.8rem] rounded-full text-center text-sm font-semibold`}
    >
      {ComplexityMapping[complexityName].label}
    </p>
  );
};

export default ComplexityPill;
