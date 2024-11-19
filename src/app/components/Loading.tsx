import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-24 w-24 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
    </div>
  );
};

export default Loading;
