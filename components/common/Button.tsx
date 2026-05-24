
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, disabled, onClick, ...props }) => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={isLoading || disabled}
      className="w-full flex justify-center items-center gap-2 bg-black/20 border-[3px] border-[#00ff41] text-[#00ff41] px-4 py-2 uppercase tracking-widest text-lg hover:bg-[#00ff41] hover:text-black focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-pulse focus:shadow-[0_0_35px_rgba(0,255,65,0.9)] active:shadow-[0_0_45px_#00ff41]"
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
