
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-2 border-[#00ff41] p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-[0.2em]">
        trouble.exe
        <span className="blinking-cursor">_</span>
      </h1>
      <p className="text-lg mt-2 text-[#00ff41]/80">FF GAMER ENHANCEMENT UTILITY</p>
    </header>
  );
};
