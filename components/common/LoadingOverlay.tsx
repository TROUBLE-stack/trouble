import React from 'react';
import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
  children?: React.ReactNode; // To pass the AdBanner
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message, children }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4" aria-live="assertive" aria-busy="true">
      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
        <Spinner />
        <h2 className="text-2xl md:text-3xl uppercase tracking-wider animate-pulse">
          {message}
        </h2>
        <p className="text-lg text-[#00ff41]/70">Please wait, optimizing for your device...</p>
      </div>
      <div className="w-full max-w-4xl shrink-0">
        {children}
      </div>
    </div>
  );
};
