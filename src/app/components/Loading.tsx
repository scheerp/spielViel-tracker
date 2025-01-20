import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-48 md:py-32">
      <div className="h-24 w-24 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
    </div>
  );
};

export default Loading;
