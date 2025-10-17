
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className="w-full flex justify-center items-center gap-2 bg-transparent border-2 border-[#00ff41] text-[#00ff41] px-4 py-2 uppercase tracking-widest text-lg hover:bg-[#00ff41] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
