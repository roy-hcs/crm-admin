import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
    </div>
  );
};

export default LoadingSpinner;
