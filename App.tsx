
import React from 'react';
import { Header } from './components/Header';
import { ProTips } from './components/ProTips';
import { ConfigGenerator } from './components/ConfigGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black/80 text-[#00ff41] p-4 md:p-8 selection:bg-[#00ff41] selection:text-black">
      <div className="container mx-auto max-w-7xl">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProTips />
          <ConfigGenerator />
        </main>
        <footer className="text-center mt-12 text-sm text-[#00ff41]/50">
          <p>trouble.exe v1.0 | AI Assistance Protocol Engaged</p>
          <p>Disclaimer: This tool is for educational and entertainment purposes only. Use generated configurations responsibly.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
