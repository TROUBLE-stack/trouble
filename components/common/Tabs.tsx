
import React from 'react';

type Tab = {
  id: string;
  label: string;
};

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="panel-glass rounded-xl p-1 flex overflow-x-auto scrollbar-hide no-scrollbar snap-x">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-shrink-0 px-4 py-3 text-sm md:text-lg uppercase tracking-wider transition-all duration-300 snap-center rounded-lg ${
            activeTab === tab.id
              ? 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
              : 'text-[#00ff41]/50 hover:text-[#00ff41]/80 hover:bg-[#00ff41]/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
