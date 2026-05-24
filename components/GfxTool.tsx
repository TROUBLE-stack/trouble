import React, { useState, useCallback, useEffect } from 'react';
import { generateGfxConfig, GfxConfigOptions, analyzeErrorAndSuggestSolution } from '../services/geminiService';
import { Button } from './common/Button';
import { ErrorDisplay } from './common/ErrorDisplay';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import { ErrorAnalysis, HistoryType } from '../types';
import { addHistoryItem, getCache, setCache, getCacheKey } from '../utils/storage';
import { CopyToClipboardButton } from './common/CopyToClipboardButton';
import { LoadingOverlay } from './common/LoadingOverlay';
import { AdBanner } from './common/AdBanner';
import { useFeedback } from '../contexts/FeedbackContext';
import { 
    Smartphone, 
    Monitor, 
    Cpu, 
    CheckSquare, 
    Download, 
    Copy, 
    Tv, 
    Layers, 
    ShieldCheck, 
    Terminal, 
    Check, 
    Sparkles, 
    Flame, 
    Sliders,
    Settings as SettingsIcon,
    Layout,
    SlidersHorizontal,
    AlertTriangle
} from 'lucide-react';

const GFX_LOADING_MESSAGES = [
    "Compiling shader performance data...",
    "Analyzing device-specific rendering capabilities...",
    "Bypassing engine's default graphical locks...",
    "Calibrating resolution and texture parameters...",
    "Generating custom GFX override file...",
];

const RESOLUTION_MAP = [
    { value: 0, label: "960x540 (Low)", res: "960x540" },
    { value: 1, label: "1280x720 (HD)", res: "1280x720" },
    { value: 2, label: "1600x900 (HD+)", res: "1600x900" },
    { value: 3, label: "1920x1080 (FHD)", res: "1920x1080" },
    { value: 4, label: "2560x1440 (QHD)", res: "2560x1440" },
];

export const GfxTool: React.FC = () => {
    const [resolutionIndex, setResolutionIndex] = useState(1); // Default to 1280x720 (HD)
    const [options, setOptions] = useState<GfxConfigOptions>({
        resolution: RESOLUTION_MAP[1].res,
        graphicsApi: 'Vulkan (Recommended)',
        fps: '90',
        antiAliasing: 'Disabled',
        shadows: 'Disabled',
        textureQuality: 'Medium',
        deviceProfile: 'Mid-Range Device',
        renderQuality: 'Medium',
        anisotropicFiltering: 'Disabled',
        effectsQuality: 'Medium',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorAnalysis | null>(null);
    const [gfxConfig, setGfxConfig] = useState<string>('');
    const [loadingMessage, setLoadingMessage] = useState('Initializing...');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [resultsViewMode, setResultsViewMode] = useState<'visual' | 'raw'>('visual');
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
    const { showFeedback } = useFeedback();

    // Load from cache on initial render
    useEffect(() => {
        const cacheKey = getCacheKey('gfx-config', 'last_generated');
        const cachedConfig = getCache<string>(cacheKey);
        if (cachedConfig) {
            setGfxConfig(cachedConfig);
        }
    }, []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOptions(prev => ({ ...prev, [name]: value }));
    };

    const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(e.target.value, 10);
        setResolutionIndex(newIndex);
        setOptions(prev => ({...prev, resolution: RESOLUTION_MAP[newIndex].res}));
    };

    const handleGenerateConfig = async () => {
        setIsLoading(true);
        setError(null);
        // Do not clear config, keep showing cached version while loading

        let messageIndex = 0;
        setLoadingMessage(GFX_LOADING_MESSAGES[messageIndex]);
        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % GFX_LOADING_MESSAGES.length;
            setLoadingMessage(GFX_LOADING_MESSAGES[messageIndex]);
        }, 1500);

        try {
            const generatedConfig = await generateGfxConfig(options);
            setGfxConfig(generatedConfig);

            const cacheKey = getCacheKey('gfx-config', 'last_generated');
            setCache(cacheKey, generatedConfig);

            addHistoryItem({
                type: HistoryType.GFX_CONFIG,
                data: generatedConfig,
                timestamp: Date.now(),
                context: `${options.deviceProfile} @ ${options.resolution}`
            });
            showFeedback('GFX Config Updated Successfully!');
            setResultsViewMode('visual');
            setCompletedSteps({});
        } catch (e) {
            let errorMessage = "An unknown error occurred.";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            const analyzedError = await analyzeErrorAndSuggestSolution(errorMessage);
            setError(analyzedError);
        } finally {
            clearInterval(intervalId);
            setIsLoading(false);
        }
    };
    
    const executeDownload = () => {
        if (!gfxConfig) return;
        const element = document.createElement("a");
        const file = new Blob([gfxConfig], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = "gamer_config.ini";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const getRecommendation = useCallback((setting: string, value: string): string => {
        const profile = options.deviceProfile;
        const recommendations: { [key: string]: { [key: string]: string[] } } = {
            "Low-End Device": {
                fps: ["60"],
                shadows: ["Disabled"],
                textureQuality: ["Low"],
                renderQuality: ["Low"],
                effectsQuality: ["Low"],
                antiAliasing: ["Disabled"]
            },
            "Mid-Range Device": {
                fps: ["90"],
                shadows: ["Low"],
                textureQuality: ["Medium"],
                renderQuality: ["Medium"],
                effectsQuality: ["Medium"],
                antiAliasing: ["2x"]
            },
            "High-End Device": {
                fps: ["120"],
                shadows: ["Medium", "High"],
                textureQuality: ["High"],
                renderQuality: ["High"],
                effectsQuality: ["High"],
                antiAliasing: ["4x"]
            }
        };

        if (recommendations[profile]?.[setting]?.includes(value)) {
            return ' (Recommended)';
        }
        return '';
    }, [options.deviceProfile]);


    return (
        <section className="panel-glass p-6 space-y-6 max-w-4xl mx-auto">
            <LoadingOverlay isLoading={isLoading} message={loadingMessage}>
                <AdBanner key="gfx-loading-ad" />
            </LoadingOverlay>

            <h2 className="text-3xl uppercase tracking-wider text-center">Advanced GFX Tool</h2>
            <p className="text-center text-lg">Generate a custom `.ini` file to unlock your device's maximum graphical potential.</p>
            
            <fieldset className="border border-[#00ff41]/30 p-4 space-y-4">
                <legend className="px-2 text-xl">Core Settings</legend>
                 <div>
                    <label htmlFor="deviceProfile" className="block text-lg">Device Profile:</label>
                    <select id="deviceProfile" name="deviceProfile" value={options.deviceProfile} onChange={handleSelectChange} className="custom-input custom-select">
                        <option>Low-End Device</option>
                        <option>Mid-Range Device</option>
                        <option>High-End Device</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="resolution" className="block text-lg">Game Resolution:</label>
                    <input 
                        id="resolution"
                        type="range"
                        min="0"
                        max={RESOLUTION_MAP.length - 1}
                        step="1"
                        value={resolutionIndex}
                        onChange={handleResolutionChange}
                        className="w-full custom-slider"
                    />
                    <p className="text-center text-lg mt-2">{RESOLUTION_MAP[resolutionIndex].label}</p>
                </div>
            </fieldset>

            <fieldset className="border border-[#00ff41]/30 p-4 space-y-4">
                <legend className="px-2 text-xl">Detailed Graphics Control</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fps" className="block text-lg">FPS Limit:</label>
                        <select id="fps" name="fps" value={options.fps} onChange={handleSelectChange} className="custom-input custom-select">
                            {[ '30', '60', '90', '120'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('fps', val)}</option>
                            )}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="graphicsApi" className="block text-lg">Graphics API:</label>
                        <select id="graphicsApi" name="graphicsApi" value={options.graphicsApi} onChange={handleSelectChange} className="custom-input custom-select">
                            <option>OpenGL ES 3.1</option>
                            <option>Vulkan (Recommended)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="shadows" className="block text-lg">Shadows:</label>
                        <select id="shadows" name="shadows" value={options.shadows} onChange={handleSelectChange} className="custom-input custom-select">
                             {['Disabled', 'Low', 'Medium'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('shadows', val)}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="antiAliasing" className="block text-lg">Anti-Aliasing:</label>
                        <select id="antiAliasing" name="antiAliasing" value={options.antiAliasing} onChange={handleSelectChange} className="custom-input custom-select">
                           {['Disabled', '2x', '4x'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('antiAliasing', val)}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="textureQuality" className="block text-lg">Texture Quality:</label>
                        <select id="textureQuality" name="textureQuality" value={options.textureQuality} onChange={handleSelectChange} className="custom-input custom-select">
                             {['Low', 'Medium', 'High'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('textureQuality', val)}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="renderQuality" className="block text-lg">Render Quality:</label>
                        <select id="renderQuality" name="renderQuality" value={options.renderQuality} onChange={handleSelectChange} className="custom-input custom-select">
                            {['Low', 'Medium', 'High'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('renderQuality', val)}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="effectsQuality" className="block text-lg">Effects Quality:</label>
                        <select id="effectsQuality" name="effectsQuality" value={options.effectsQuality} onChange={handleSelectChange} className="custom-input custom-select">
                            {['Low', 'Medium', 'High'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('effectsQuality', val)}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="anisotropicFiltering" className="block text-lg">Anisotropic Filtering:</label>
                        <select id="anisotropicFiltering" name="anisotropicFiltering" value={options.anisotropicFiltering} onChange={handleSelectChange} className="custom-input custom-select">
                           {['Disabled', '2x', '4x', '8x', '16x'].map(val => 
                                <option key={val} value={val}>{val}{getRecommendation('anisotropicFiltering', val)}</option>
                            )}
                        </select>
                    </div>
                </div>
            </fieldset>

            <Button onClick={handleGenerateConfig} isLoading={isLoading}>
                APPLY
            </Button>

            {error && <ErrorDisplay error={error} />}

            <div aria-live="polite">
                {gfxConfig && (
                    <div className="space-y-6 pt-4 border-t border-[#00ff41]/20">
                        {/* Beautiful Segmented View Control */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black border border-[#00ff41]/30 p-4">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-[#00ff41]">
                                    <Sparkles className="w-5 h-5 animate-pulse text-[#00ff41]" />
                                    <span>GFX CALIBRATION MASTER COMPLETED!</span>
                                </h3>
                                <p className="text-xs text-[#00ff41]/70 mt-1">
                                    Custom game engine render values optimized for {options.deviceProfile}.
                                </p>
                            </div>
                            <div className="flex bg-black border border-[#00ff41]/40 p-1 w-full sm:w-auto">
                                <button
                                    onClick={() => setResultsViewMode('visual')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs uppercase font-bold transition-all ${
                                        resultsViewMode === 'visual'
                                            ? 'bg-[#00ff41] text-black'
                                            : 'text-[#00ff41] hover:bg-[#00ff41]/10'
                                    }`}
                                >
                                    <Layout className="w-4.5 h-4.5" />
                                    <span>Interactive HUD (Clean)</span>
                                </button>
                                <button
                                    onClick={() => setResultsViewMode('raw')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs uppercase font-bold transition-all ${
                                        resultsViewMode === 'raw'
                                            ? 'bg-[#00ff41] text-black'
                                            : 'text-[#00ff41] hover:bg-[#00ff41]/10'
                                    }`}
                                >
                                    <Terminal className="w-4.5 h-4.5" />
                                    <span>Raw Config INI</span>
                                </button>
                            </div>
                        </div>

                        {/* --- VIEW MODE 1: VISUAL HUD DASHBOARD (NO CONFUSION) --- */}
                        {resultsViewMode === 'visual' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Left half: Configured specifications mapping */}
                                <div className="md:col-span-6 bg-black border border-[#00ff41]/30 p-5 space-y-4">
                                    <h4 className="text-lg font-bold text-[#00ff41] flex items-center gap-2 border-b border-[#00ff41]/20 pb-2">
                                        <SlidersHorizontal className="w-5 h-5 text-[#00ff41]" />
                                        <span>GFX ENGINE SPECIFICATIONS</span>
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">TARGET RESOLUTION</span>
                                            <span className="text-sm font-bold text-white block">{options.resolution}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">FPS VELOCITY LOCK</span>
                                            <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                                <span>{options.fps} FPS</span>
                                                <Flame className="w-3.5 h-3.5 text-[#00ff41] animate-pulse" />
                                            </span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">GRAPHICS API DRIVER</span>
                                            <span className="text-sm font-bold text-white block">{options.graphicsApi}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">ANTI-ALIASING LEVEL</span>
                                            <span className="text-sm font-bold text-white block">{options.antiAliasing}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">TEXTURE FIDELITY</span>
                                            <span className="text-sm font-bold text-white block">{options.textureQuality}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">PIPELINE RENDER DEPTH</span>
                                            <span className="text-sm font-bold text-white block">{options.renderQuality}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">GAME EFFECTS DETAIL</span>
                                            <span className="text-sm font-bold text-white block">{options.effectsQuality}</span>
                                        </div>
                                        <div className="bg-black border border-[#00ff41]/20 p-2.5 rounded">
                                            <span className="text-[#00ff41]/60 font-mono text-[10px] block">ANISOTROPIC SCAN</span>
                                            <span className="text-sm font-bold text-white block">{options.anisotropicFiltering}</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-3 flex justify-between text-xs font-mono">
                                        <span className="text-[#00ff41]/80">DEVICE SCALE PRESET:</span>
                                        <span className="text-[#00ff41] font-bold uppercase">{options.deviceProfile}</span>
                                    </div>
                                </div>

                                {/* Right half: Application Steps checklist */}
                                <div className="md:col-span-6 bg-black border border-[#00ff41]/30 p-5 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-[#00ff41] flex items-center gap-2 border-b border-[#00ff41]/20 pb-2">
                                            <CheckSquare className="w-5 h-5 text-[#00ff41]" />
                                            <span>APPLICATION SAFE-GUARD MAP</span>
                                        </h4>
                                        <p className="text-xs text-white/70 leading-relaxed mb-3 mt-1 text-sans">
                                            Follow these steps logically to mount this performance graphics config without affecting standard user files.
                                        </p>

                                        {(() => {
                                            const steps = [
                                                { id: 'gfx_download', text: "Download the gamer_config.ini override file." },
                                                { id: 'gfx_locate', text: "Open any mobile/PC file manager app and navigate to game files folder: 'Android/data/com.dts.freefireth/files/'" },
                                                { id: 'gfx_backup', text: "Create a copy of original 'user_custom.ini' inside a safe backup folder." },
                                                { id: 'gfx_replace', text: "Paste the custom downloaded file into that game files directory." },
                                                { id: 'gfx_read_only', text: "Optional: set the new file permissions to 'Read Only' so system updates don't wipe your custom presets." }
                                            ];

                                            return (
                                                <div className="space-y-2 text-xs font-sans">
                                                    {steps.map((step) => (
                                                        <label
                                                            key={step.id}
                                                            className={`flex items-start gap-2.5 p-2 border transition-all cursor-pointer select-none rounded-[3px] ${
                                                                completedSteps[step.id]
                                                                    ? 'bg-[#00ff41]/10 border-[#00ff41]/40 text-white/50 line-through'
                                                                    : 'bg-black/50 border-[#00ff41]/15 hover:border-[#00ff41]/45 text-white'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={!!completedSteps[step.id]}
                                                                onChange={(e) => setCompletedSteps(prev => ({ ...prev, [step.id]: e.target.checked }))}
                                                                className="mt-0.5 w-4 h-4 rounded-sm border-[#00ff41]/40 text-black bg-black focus:ring-[#00ff41] focus:ring-offset-0"
                                                            />
                                                            <span>{step.text}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="pt-2 flex flex-wrap gap-2 text-xs">
                                        <Button onClick={() => setIsConfirmOpen(true)}>
                                            Download gamer_config.ini
                                        </Button>
                                        <Button variant="secondary" onClick={() => {
                                            navigator.clipboard.writeText(gfxConfig);
                                            showFeedback("GFX settings template copied to clipboard!");
                                        }}>
                                            Copy Config Source
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- VIEW MODE 2: RAW TEXT/CODE AREA --- */}
                        {resultsViewMode === 'raw' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-black border border-[#00ff41]/25 p-3 rounded-t">
                                    <span className="text-xs font-mono text-[#00ff41]">gamer_config.ini</span>
                                    <CopyToClipboardButton textToCopy={gfxConfig} />
                                </div>
                                <pre className="bg-black/95 border-x border-b border-[#00ff41]/30 p-4 h-96 overflow-y-auto scrollbar-thin text-xs text-[#00ff41] font-mono whitespace-pre-wrap break-words">
                                    {gfxConfig}
                                </pre>
                                <div className="flex justify-start">
                                    <Button onClick={() => setIsConfirmOpen(true)}>
                                        Download gamer_config.ini
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeDownload}
                title="Confirm GFX File Download"
            >
                <div className="space-y-2">
                    <p>You are about to download <span className="font-bold text-white">gamer_config.ini</span>.</p>
                    <p className="text-yellow-400 text-sm">Modifying game files can be risky. Ensure you have backed up your original settings. The app developer is not responsible for any issues.</p>
                    <p>Are you sure you want to proceed?</p>
                </div>
            </ConfirmationDialog>
        </section>
    );
};