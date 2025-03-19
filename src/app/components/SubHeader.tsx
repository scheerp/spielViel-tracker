const SubHeader = ({
  children,
  hasGradient = false,
}: {
  children: React.ReactNode;
  hasGradient?: boolean;
}) => {
  return (
    <div
      className={`fixed z-20 flex h-28 w-full ${hasGradient && 'bg-gradient-to-b from-background from-70%'} px-2 py-4 pb-12 md:min-w-64`}
    >
      {children}
    </div>
  );
};

export default SubHeader;
