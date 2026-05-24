
import React, { useState, useCallback, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './components/Header';
import { ProTips } from './components/ProTips';
import { ConfigGenerator } from './components/ConfigGenerator';
import { Tabs } from './components/common/Tabs';
import { GfxTool } from './components/GfxTool';
import { MatrixBackground } from './components/MatrixBackground';
import { SystemOptimizer } from './components/SystemOptimizer';
import { DeviceProfile } from './components/DeviceProfile';
import { History } from './components/History';
import { AdBanner } from './components/common/AdBanner';
import { Settings } from './components/Settings';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { FeedbackPopup } from './components/common/FeedbackPopup';
import { NetworkStatusIndicator } from './components/common/NetworkStatusIndicator';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const TABS = [
    { id: 'pro-tips', label: '🔥 Pro Tips' },
    { id: 'config-generator', label: '🎯 Get Sensi' },
    { id: 'gfx-tool', label: '⚡ GFX Tool' },
    { id: 'system-optimizer', label: '🚀 Speed Up' },
    { id: 'profile', label: '👤 Profile'},
    { id: 'settings', label: '🛠️ Settings'},
    { id: 'history', label: '⏳ History'},
];

const SPONSORS = [
    { name: 'Quantum Systems', link: 'https://example.com/quantum' },
    { name: 'Cyberdyne Inc.', link: 'https://example.com/cyberdyne' },
    { name: 'Zero-Day LLC', link: 'https://example.com/zeroday' },
    { name: 'Glitch Energy', link: 'https://example.com/glitch' }
];

// Fix: Made children optional to resolve JSX validation error when children are passed between tags.
interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

// Fix: Using React.Component explicitly to ensure state and props properties are correctly inherited and recognized by TypeScript.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Crash report:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full bg-black flex flex-col items-center justify-center p-8 text-center text-[#00ff41] font-mono">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">CRITICAL_SYSTEM_FAILURE</h1>
          <p className="mb-6 opacity-70">A fatal error has occurred in the main process.</p>
          <button onClick={() => window.location.reload()} className="border-2 border-[#00ff41] px-8 py-3 uppercase hover:bg-[#00ff41] hover:text-black transition-all font-bold">
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
 
 const AppContent: React.FC = () => {
   const [isFxEnabled, setIsFxEnabled] = useState(true);
   const [activeTab, setActiveTab] = useState('pro-tips');
   const [currentSponsor, setCurrentSponsor] = useState(0);
   const { t } = useLanguage();

   useEffect(() => {
    const sponsorInterval = setInterval(() => {
        setCurrentSponsor(prev => (prev + 1) % SPONSORS.length);
    }, 8000);
    return () => clearInterval(sponsorInterval);
   }, []);
 
   const toggleFx = useCallback(() => {
      setIsFxEnabled(prev => !prev);
   }, []);
 
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'pro-tips': return <ProTips />;
            case 'config-generator': return <ConfigGenerator />;
            case 'gfx-tool': return <GfxTool />;
            case 'system-optimizer': return <SystemOptimizer />;
            case 'profile': return <DeviceProfile />;
            case 'settings': return <Settings isFxEnabled={isFxEnabled} toggleFx={toggleFx} />;
            case 'history': return <History />;
            default: return <ProTips />;
        }
    }

    const dynamicTabs = [
        { id: 'pro-tips', label: t('tab_pro_tips') },
        { id: 'config-generator', label: t('tab_config_generator') },
        { id: 'gfx-tool', label: t('tab_gfx_tool') },
        { id: 'system-optimizer', label: t('tab_system_optimizer') },
        { id: 'profile', label: t('tab_profile') },
        { id: 'settings', label: t('tab_settings') },
        { id: 'history', label: t('tab_history') },
    ];
 
   return (
      <FeedbackProvider>
        <MatrixBackground isEnabled={isFxEnabled} />
        <div className={`fixed inset-0 flex flex-col text-[#00ff41] selection:bg-[#00ff41] selection:text-black ${!isFxEnabled ? 'low-spec' : ''}`}>
        
        <header className="w-full px-2 sm:px-4 pt-2 shrink-0 z-10">
          <Header />
          <div className="mt-2 sm:mt-4">
            <Tabs tabs={dynamicTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </header>

        <main className="flex-grow overflow-y-auto scrollbar-thin mt-2 pb-24">
            <div className="container mx-auto max-w-4xl px-2">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {renderActiveTab()}
                </div>
                <div className="mt-8 mb-4">
                    <AdBanner key={activeTab} />
                </div>
            </div>
        </main>

        <footer className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d]/80 backdrop-blur-md p-3 border-t border-[#00ff41]/20 flex justify-between items-center z-20">
             <div className="flex flex-col">
                <span className="text-xs opacity-50 hidden sm:inline">trouble.exe // Elite Assistant</span>
                <a href={SPONSORS[currentSponsor].link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold animate-shimmer hover:underline">
                    &gt; {SPONSORS[currentSponsor].name}
                </a>
             </div>
             
             <div className="flex items-center gap-4">
                 <NetworkStatusIndicator />
                 <button 
                    onClick={toggleFx} 
                    className={`px-3 py-1 text-xs border border-[#00ff41]/30 rounded transition-all ${isFxEnabled ? 'bg-[#00ff41]/20' : 'bg-red-900/20 text-red-400'}`}
                 >
                    {t('fx_label')} {isFxEnabled ? 'ON' : 'OFF'}
                 </button>
             </div>
           </footer>
       </div>
       <FeedbackPopup />
      </FeedbackProvider>
   );
 };

 const App: React.FC = () => {
   return (
    <ErrorBoundary>
      <LanguageProvider>
         <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
   );
 };
 
 export default App;
