import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../utils/storage';
import { HistoryItem, HistoryType, SystemOptimizationPlan } from '../types';
import { Button } from './common/Button';
import { CopyToClipboardButton } from './common/CopyToClipboardButton';

const HistoryItemCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    const downloadFile = (content: string, fileName: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const renderContent = () => {
        switch (item.type) {
            case HistoryType.PRO_TIP:
            case HistoryType.GFX_CONFIG:
                return (
                    <div className="relative">
                        <pre className="whitespace-pre-wrap break-words font-sans bg-black/30 p-4 border border-[#00ff41]/20">{item.data as string}</pre>
                        <CopyToClipboardButton textToCopy={item.data as string} />
                    </div>
                );
            case HistoryType.MOBILE_CONFIG:
                 return (
                    <div className="relative">
                        <pre className="whitespace-pre-wrap break-words font-sans bg-black/30 p-4 border border-[#00ff41]/20">{item.data as string}</pre>
                        <CopyToClipboardButton textToCopy={item.data as string} />
                    </div>
                );
            case "PC Config" as HistoryType: {
                const pcData = item.data as any; return null;
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Regedit File:</h4>
                             <div className="relative">
                                <pre className="whitespace-pre-wrap break-words font-mono bg-black/30 p-4 border border-[#00ff41]/20 h-48 overflow-y-auto scrollbar-thin">{pcData.regeditContent}</pre>
                                <CopyToClipboardButton textToCopy={pcData.regeditContent} />
                            </div>
                            <Button onClick={() => downloadFile(pcData.regeditContent, `history_config.reg`)} className="mt-2 w-auto text-sm py-1">Download Again</Button>
                        </div>
                        {pcData.emulatorTweaks && <div>...Emulator Tweaks available...</div>}
                    </div>
                );
            }
            case HistoryType.SYSTEM_PLAN: {
                 const plan = item.data as SystemOptimizationPlan;
                 return (
                     <div className="space-y-4">
                        <h4 className="font-bold text-lg mb-2">ADB Commands:</h4>
                         <div className="relative">
                            <pre className="whitespace-pre-wrap break-words font-mono bg-black/30 p-4 border border-[#00ff41]/20 h-48 overflow-y-auto scrollbar-thin">{plan.adbCommands}</pre>
                            <CopyToClipboardButton textToCopy={plan.adbCommands} />
                        </div>
                        <div>...Checklist also available...</div>
                     </div>
                 );
            }
            default:
                return <p>Unsupported history item type.</p>;
        }
    };

    return (
        <div className="panel-glass p-4 transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left flex justify-between items-center">
                <div>
                    <p className="text-xl font-bold">{item.type} {item.context ? `(${item.context})` : ''}</p>
                    <p className="text-sm text-[#00ff41]/70">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="mt-4 border-t border-[#00ff41]/20 pt-4">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};

export const History: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClearHistory = () => {
        clearHistory();
        setHistory([]);
    };

    return (
        <section className="panel-glass p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl uppercase tracking-wider">Generation History</h2>
                 {history.length > 0 && (
                     <button onClick={handleClearHistory} className="bg-red-900/50 border border-red-500 px-3 py-1 text-sm hover:bg-red-700/50 transition-colors">
                         Clear History
                     </button>
                 )}
            </div>
           
            {history.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
                    {history.map(item => (
                       <HistoryItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-xl text-[#00ff41]/70">Your generated items will appear here.</p>
                    <p>Go to other tabs to generate tips, configs, or GFX files.</p>
                </div>
            )}
        </section>
    );
};
