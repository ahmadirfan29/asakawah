import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-700">
      <div className="w-16 h-16 border-8 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
      {message && <p className="text-lg font-bold animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;