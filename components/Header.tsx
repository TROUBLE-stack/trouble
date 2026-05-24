
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="panel-glass p-4 rounded-b-xl border-t-0 text-center shadow-[0_0_20px_rgba(0,255,65,0.15)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-50"></div>
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.15em] drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]">
        TROUBLE<span className="text-white">.EXE</span>
        <span className="blinking-cursor ml-1">_</span>
      </h1>
      <p className="text-sm md:text-lg mt-1 tracking-[0.4em] text-[#00ff41]/60 font-mono">
        ( v1.2.5_STABLE )
      </p>
    </header>
  );
};
