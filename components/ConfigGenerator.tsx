
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateConfig, ConfigOptions, analyzeErrorAndSuggestSolution } from '../services/geminiService';
import { Button } from './common/Button';
import { DeviceType, ErrorAnalysis, HistoryType, DeviceProfileData } from '../types';
import { detectDeviceHardware } from '../utils/deviceDetector';
import { ErrorDisplay } from './common/ErrorDisplay';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import { getDeviceProfile, saveDeviceProfile, addHistoryItem, getCache, setCache, getCacheKey } from '../utils/storage';
import { CopyToClipboardButton } from './common/CopyToClipboardButton';
import { LoadingOverlay } from './common/LoadingOverlay';
import { AdBanner } from './common/AdBanner';
import { useFeedback } from '../contexts/FeedbackContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Smartphone, 
    Monitor, 
    Cpu, 
    Sliders, 
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
    Settings as SettingsIcon, 
    MousePointer,
    Layout
} from 'lucide-react';

interface ExtractedSensitivities {
    general: number;
    redDot: number;
    scope2x: number;
    scope4x: number;
    sniperScope: number;
    freeLook: number;
}

interface ExtractedPhoneSettings {
    dpi: string;
    pointerSpeed: string;
    refreshRate: string;
    proTip?: string;
}

const extractSensitivities = (text: string): ExtractedSensitivities => {
    const sensi = {
        general: 155,
        redDot: 160,
        scope2x: 148,
        scope4x: 138,
        sniperScope: 115,
        freeLook: 120,
    };

    if (!text) return sensi;

    try {
        if (text.trim().startsWith('{')) {
            const parsed = JSON.parse(text);
            const inGame = parsed.inGameSettings || parsed;
            
            const extractVal = (obj: any, keys: string[]): number | null => {
                for (const key of keys) {
                    if (obj[key] !== undefined) {
                        const val = parseInt(obj[key], 10);
                        if (!isNaN(val)) return val;
                    }
                }
                return null;
            };

            sensi.general = extractVal(inGame, ['general', 'General', 'generalSensi']) ?? sensi.general;
            sensi.redDot = extractVal(inGame, ['redDot', 'red_dot', 'Red Dot', 'redDotSensi']) ?? sensi.redDot;
            sensi.scope2x = extractVal(inGame, ['2xScope', '2xScope', '2x_scope', '2x Scope', 'scope2x']) ?? sensi.scope2x;
            sensi.scope4x = extractVal(inGame, ['4xScope', '4xScope', '4x_scope', '4x Scope', 'scope4x']) ?? sensi.scope4x;
            sensi.sniperScope = extractVal(inGame, ['sniperScope', 'sniper_scope', 'Sniper Scope', 'sniperScopeSensi', 'sniper']) ?? sensi.sniperScope;
            sensi.freeLook = extractVal(inGame, ['freeLook', 'free_look', 'Free Look', 'freeLookSensi']) ?? sensi.freeLook;
            
            return sensi;
        }
    } catch (e) {
        // Fallback to regex
    }

    const findMatch = (pattern: RegExp, defaultVal: number): number => {
        const match = text.match(pattern);
        if (match && match[1]) {
            const val = parseInt(match[1], 10);
            if (!isNaN(val)) return val;
        }
        return defaultVal;
    };

    sensi.general = findMatch(/(?:general|generalSensi|general sensi|General Sensi|General)\s*[:*~-]*\s*(\d+)/i, sensi.general);
    sensi.redDot = findMatch(/(?:redDot|red_dot|Red Dot|Red\s*Dot)\s*[:*~-]*\s*(\d+)/i, sensi.redDot);
    sensi.scope2x = findMatch(/(?:2xScope|2x_scope|2x\s*Scope|2x|Scope2x)\s*[:*~-]*\s*(\d+)/i, sensi.scope2x);
    sensi.scope4x = findMatch(/(?:4xScope|4x_scope|4x\s*Scope|4x|Scope4x)\s*[:*~-]*\s*(\d+)/i, sensi.scope4x);
    sensi.sniperScope = findMatch(/(?:sniperScope|sniper_scope|Sniper\s*Scope|Sniper|SniperScope)\s*[:*~-]*\s*(\d+)/i, sensi.sniperScope);
    sensi.freeLook = findMatch(/(?:freeLook|free_look|Free\s*Look|FreeLook)\s*[:*~-]*\s*(\d+)/i, sensi.freeLook);

    return sensi;
};

const extractPhoneSettings = (text: string, currentTier: string): ExtractedPhoneSettings => {
    const isHigh = currentTier.toLowerCase().includes('high');
    const isLow = currentTier.toLowerCase().includes('low');
    
    const settings = {
        dpi: isHigh ? '520 DPI' : (isLow ? '410 DPI' : '450 DPI'),
        pointerSpeed: isHigh ? 'Custom (6/10)' : 'Maximum (10/10)',
        refreshRate: isHigh ? '120Hz/144Hz' : (isLow ? '60Hz' : '90Hz'),
        proTip: ''
    };

    if (!text) return settings;

    try {
        if (text.trim().startsWith('{')) {
            const parsed = JSON.parse(text);
            if (parsed.phoneSettings) {
                settings.dpi = parsed.phoneSettings.dpi || settings.dpi;
                settings.pointerSpeed = parsed.phoneSettings.pointerSpeed || settings.pointerSpeed;
                settings.refreshRate = parsed.phoneSettings.refreshRate || settings.refreshRate;
            }
            if (parsed.proTip) {
                settings.proTip = parsed.proTip;
            }
        }
    } catch (e) {}

    const dpiMatch = text.match(/(?:dpi|DPI)\s*[:*~-]*\s*(\d+)/i);
    if (dpiMatch && dpiMatch[1]) {
        settings.dpi = dpiMatch[1] + ' DPI';
    }

    const psMatch = text.match(/(?:pointerSpeed|pointer\s*speed)\s*[:*~-]*\s*([^\n\r,;:]+)/i);
    if (psMatch && psMatch[1]) {
        settings.pointerSpeed = psMatch[1].replace(/[}"',]/g, '').trim();
    }

    const rrMatch = text.match(/(?:refresh\s*rate|refreshRate|Refresh\s*Rate)\s*[:*~-]*\s*([^\n\r,;:]+)/i);
    if (rrMatch && rrMatch[1]) {
         settings.refreshRate = rrMatch[1].replace(/[}"',]/g, '').trim();
    }

    // STRICT SAFEKEEPING CAP: Ensure DPI suggestion NEVER exceeds 560 under any circumstances!
    if (settings.dpi) {
        const dpiValMatch = settings.dpi.match(/(\d+)/);
        if (dpiValMatch) {
            const dpiVal = parseInt(dpiValMatch[1], 10);
            if (dpiVal > 560) {
                const clampedVal = isHigh ? 520 : (isLow ? 410 : 450);
                settings.dpi = clampedVal + ' DPI';
            }
        }
    }

    return settings;
};

const PC_LOADING_MESSAGES = [
    "Connecting to AI mainframe...",
    "Analyzing emulator & DPI matrix...",
    "Assessing hardware configuration...",
    "Calibrating system-level sensitivity...",
    "Tuning X/Y axis for headshot vectors...",
    "Generating final .reg file...",
];

const ANDROID_LOADING_MESSAGES = [
    "Accessing mobile configuration database...",
    "Analyzing device model and OS version...",
    "Calculating optimal touch sensitivity...",
    "Adjusting for screen refresh rate...",
    "Generating personalized sensi...",
];


export const ConfigGenerator: React.FC = () => {
    const { t } = useLanguage();
    // Common State
    const [device, setDevice] = useState<DeviceType>(DeviceType.ANDROID);
    const [playingStyle, setPlayingStyle] = useState('Balanced');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorAnalysis | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Initializing...');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [downloadDetails, setDownloadDetails] = useState<{content: string, fileName: string} | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
    const { showFeedback } = useFeedback();

    // Result State
    const [regeditContent, setRegeditContent] = useState<string>('');
    const [emulatorTweaks, setEmulatorTweaks] = useState<any | null>(null);
    const [androidConfig, setAndroidConfig] = useState<string>('');
    const [detectionStatus, setDetectionStatus] = useState('Analyzing system signature...');
    const [resultsViewMode, setResultsViewMode] = useState<'visual' | 'raw'>('visual');
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

    // Mobile State
    const [modelName, setModelName] = useState('');
    const [androidVersion, setAndroidVersion] = useState('');
    const [iosVersion, setIosVersion] = useState('');
    const [useHeadshotConfig, setUseHeadshotConfig] = useState(false);
    const [hardwareTier, setHardwareTier] = useState('Medium End');

    // PC State
    const [dpi, setDpi] = useState('800');
    const [emulator, setEmulator] = useState('BlueStacks');
    const [inGameGeneralSensi, setInGameGeneralSensi] = useState('50');
    const [inGameRedDotSensi, setInGameRedDotSensi] = useState('60');
    const [cpu, setCpu] = useState('');
    const [gpu, setGpu] = useState('');
    const [ram, setRam] = useState('');
    
    // --- Validation ---
    const validate = useCallback((name: string, value: string): string | null => {
        const numValue = Number(value);
        switch (name) {
            case 'dpi':
                if (!value) return "DPI is required.";
                if (isNaN(numValue)) return "DPI must be a number.";
                if (numValue < 400 || numValue > 3600) return "DPI must be between 400 and 3600.";
                return null;
            case 'inGameGeneralSensi':
            case 'inGameRedDotSensi':
                if (!value) return "Sensitivity is required.";
                if (isNaN(numValue)) return "Must be a number.";
                if (numValue < 0 || numValue > 200) return "Must be between 0 and 200.";
                return null;
            case 'ram':
                 if (value && (isNaN(numValue) || numValue < 1 || numValue > 128)) {
                    return "RAM must be a number between 1 and 128.";
                 }
                return null;
            case 'modelName':
            case 'cpu':
            case 'gpu':
            case 'androidVersion':
            case 'iosVersion':
                if (value.length > 50) return "Input is too long (max 50 chars)."
                return null;
            default:
                return null;
        }
    }, []);

    // --- Effects ---
    const loadCachedResults = useCallback(() => {
        const context = `${modelName || device}-${useHeadshotConfig}-${hardwareTier}`;
        const cacheKey = getCacheKey(device, context);
        const cachedData = getCache<any>(cacheKey);

        if (cachedData) {
            setAndroidConfig(cachedData.androidConfig || '');
        }
    }, [device, modelName, useHeadshotConfig, hardwareTier]);

    useEffect(() => {
        loadCachedResults();
    }, [loadCachedResults]);

    // Profile Loading Helper
    const applyProfileData = useCallback((profile: DeviceProfileData) => {
        if (profile.modelName !== undefined) setModelName(profile.modelName);
        if (profile.androidVersion !== undefined) setAndroidVersion(profile.androidVersion);
        if (profile.iosVersion !== undefined) setIosVersion(profile.iosVersion);
        if (profile.hardwareTier !== undefined) setHardwareTier(profile.hardwareTier);
        if (profile.gpu !== undefined) setGpu(profile.gpu);
    }, []);

    // Effect for Auto Device Detection & Profile Loading
    useEffect(() => {
        const profile = getDeviceProfile();
        if (profile && profile.modelName) {
            applyProfileData(profile);
            const dev = profile.iosVersion ? DeviceType.IPHONE : DeviceType.ANDROID;
            setDevice(dev);
            setDetectionStatus(`Loaded saved profile: ${profile.modelName} ${profile.gpu ? `[@ ${profile.gpu}]` : ''} [Tier: ${profile.hardwareTier || 'Medium End'}]`);
            return;
        }

        const runAutoDetection = () => {
            const hardware = detectDeviceHardware();
            const dev = hardware.deviceType === "iPhone" ? DeviceType.IPHONE : DeviceType.ANDROID;
            setDevice(dev);
            setModelName(hardware.modelName);
            setHardwareTier(hardware.hardwareTier);
            setGpu(hardware.gpu);
            if (hardware.deviceType === "iPhone") {
                setIosVersion(hardware.osVersion);
                setAndroidVersion('');
            } else {
                setAndroidVersion(hardware.osVersion);
                setIosVersion('');
            }
            setDetectionStatus(`⚡ Auto-Detected Phone: ${hardware.modelName} (${hardware.gpu})`);
        };
        runAutoDetection();
    }, [applyProfileData]);

    // Effect to clear validation errors on device change
    useEffect(() => {
        setValidationErrors({});
        // Clear results when device type changes
        setRegeditContent('');
        setEmulatorTweaks(null);
        setAndroidConfig('');
        loadCachedResults(); // Try to load cache for the new device type
    }, [device, loadCachedResults]);


    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        const stateSetters: { [key: string]: React.Dispatch<React.SetStateAction<string>> } = {
            dpi: setDpi,
            inGameGeneralSensi: setInGameGeneralSensi,
            inGameRedDotSensi: setInGameRedDotSensi,
            cpu: setCpu,
            gpu: setGpu,
            ram: setRam,
            modelName: setModelName,
            androidVersion: setAndroidVersion,
            iosVersion: setIosVersion
        };

        if (stateSetters[name]) {
            stateSetters[name](value);
        }

        const errorMessage = validate(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: errorMessage }));
    };

    const handleSaveCurrentProfile = () => {
        const profileToSave: DeviceProfileData = {
            modelName,
            androidVersion,
            iosVersion,
            gpu,
            hardwareTier
        };
        saveDeviceProfile(profileToSave);
        showFeedback('Device profile saved successfully!');
    };

    const handleLoadSavedProfile = () => {
        const profile = getDeviceProfile();
        if (profile) {
            applyProfileData(profile);
            showFeedback('Device profile loaded.');
        } else {
            showFeedback('No saved profile found.');
        }
    };

    const handleGenerateConfig = async () => {
        setIsLoading(true);
        setError(null);

        const messages = ANDROID_LOADING_MESSAGES;
        let index = 0;
        setLoadingMessage(messages[index]);
        const intervalId = window.setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]);
        }, 1500);

        try {
            const options: ConfigOptions = {
                device,
                playingStyle,
                modelName,
                androidVersion,
                iosVersion,
                useHeadshotConfig,
                hardwareTier
            };

            const result = await generateConfig(options);
            const context = `${modelName || device}-${useHeadshotConfig}-${hardwareTier}`;
            const cacheKey = getCacheKey(device, context);

            setAndroidConfig(result);
            setCache(cacheKey, { androidConfig: result });
            addHistoryItem({
                type: HistoryType.MOBILE_CONFIG,
                data: result,
                timestamp: Date.now(),
                context: modelName || device
            });
            setResultsViewMode('visual');
            setCompletedSteps({});
            showFeedback('Configuration Updated Successfully!');
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

    const setupDownload = (content: string, fileName: string) => {
        if (!content.trim()) return;
        setDownloadDetails({ content, fileName });
        setIsConfirmOpen(true);
    };

    const executeDownload = () => {
        if (!downloadDetails) return;
        const { content, fileName } = downloadDetails;
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setDownloadDetails(null);
    };

    const handleDownloadConfigFile = () => {
        if (!androidConfig) return;
        try {
            const fullConfig = JSON.parse(androidConfig);
            const settingsToDownload = fullConfig.inGameSettings ? 
                JSON.stringify(fullConfig.inGameSettings, null, 2) :
                androidConfig;
            setupDownload(settingsToDownload, 'headshot_config.json');
        } catch (e) {
            setupDownload(androidConfig, 'sensitivity_guide.txt');
        }
    };


    // --- Render Helpers ---

    const renderPCInputs = () => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
             <div>
                <label className="block text-lg">Emulator:</label>
                <select value={emulator} onChange={e => setEmulator(e.target.value)} className="custom-input custom-select">
                    <option>BlueStacks</option>
                    <option>MSI App Player</option>
                    <option>NoxPlayer</option>
                    <option>Other</option>
                </select>
                <div className="h-5"></div>
            </div>
             <div>
                <label className="block text-lg">Mouse DPI:</label>
                <input type="text" name="dpi" value={dpi} onChange={handleInputChange} className={`custom-input ${validationErrors.dpi ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 800" />
                <p className="text-red-400 text-sm h-5">{validationErrors.dpi || ''}</p>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
               <div>
                   <label className="block text-lg">In-Game General Sensi:</label>
                   <input type="text" name="inGameGeneralSensi" value={inGameGeneralSensi} onChange={handleInputChange} className={`custom-input ${validationErrors.inGameGeneralSensi ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 50"/>
                   <p className="text-red-400 text-sm h-5">{validationErrors.inGameGeneralSensi || ''}</p>
               </div>
               <div>
                   <label className="block text-lg">In-Game Red Dot Sensi:</label>
                   <input type="text" name="inGameRedDotSensi" value={inGameRedDotSensi} onChange={handleInputChange} className={`custom-input ${validationErrors.inGameRedDotSensi ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 60"/>
                   <p className="text-red-400 text-sm h-5">{validationErrors.inGameRedDotSensi || ''}</p>
               </div>
           </div>
           <fieldset className="border border-[#00ff41]/30 p-4 space-y-4">
             <legend className="px-2 text-lg">PC Hardware (Optional)</legend>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                 <div>
                    <label className="block text-lg">CPU:</label>
                    <input type="text" name="cpu" value={cpu} onChange={handleInputChange} className={`custom-input ${validationErrors.cpu ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., Ryzen 5 5600X"/>
                    <p className="text-red-400 text-sm h-5">{validationErrors.cpu || ''}</p>
                </div>
                <div>
                    <label className="block text-lg">GPU:</label>
                    <input type="text" name="gpu" value={gpu} onChange={handleInputChange} className={`custom-input ${validationErrors.gpu ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., RTX 3060"/>
                    <p className="text-red-400 text-sm h-5">{validationErrors.gpu || ''}</p>
                </div>
                <div>
                    <label className="block text-lg">RAM (GB):</label>
                    <input type="text" name="ram" value={ram} onChange={handleInputChange} className={`custom-input ${validationErrors.ram ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 16"/>
                    <p className="text-red-400 text-sm h-5">{validationErrors.ram || ''}</p>
                </div>
             </div>
           </fieldset>
        </>
    );

    const renderMobileInputs = () => {
        const isAndroid = device === DeviceType.ANDROID;
        const isIos = device === DeviceType.IPHONE;
        const modelPlaceholder = isAndroid ? "e.g., Samsung Galaxy S23 Ultra" : "e.g., iPhone 14 Pro Max";

        const POPULAR_DEVICES = [
            { name: "S23 Ultra", brand: "Samsung", tier: "High End", type: DeviceType.ANDROID, ver: "14", gpu: "Adreno 740" },
            { name: "iPhone 15 Pro", brand: "Apple", tier: "High End", type: DeviceType.IPHONE, ver: "17.2", gpu: "Apple GPU" },
            { name: "Redmi Note 12", brand: "Xiaomi", tier: "Medium End", type: DeviceType.ANDROID, ver: "13", gpu: "Adreno 619" },
            { name: "POCO X5 Pro", brand: "POCO", tier: "Medium End", type: DeviceType.ANDROID, ver: "13", gpu: "Adreno 642L" },
            { name: "iQOO Neo 7", brand: "iQOO", tier: "High End", type: DeviceType.ANDROID, ver: "13", gpu: "Mali-G710" },
            { name: "Realme 11 Pro", brand: "Realme", tier: "Medium End", type: DeviceType.ANDROID, ver: "13", gpu: "Mali-G68" },
            { name: "OnePlus 11", brand: "OnePlus", tier: "High End", type: DeviceType.ANDROID, ver: "14", gpu: "Adreno 740" },
            { name: "Vivo T2x", brand: "Vivo", tier: "Low End", type: DeviceType.ANDROID, ver: "13", gpu: "Mali-G57" },
            { name: "Infinix Hot 30", brand: "Infinix", tier: "Low End", type: DeviceType.ANDROID, ver: "13", gpu: "Mali-G52" }
        ];

        return (
            <div className="space-y-4">
                <div className="space-y-2 p-3 bg-black/30 border border-[#00ff41]/20 rounded">
                    <span className="block text-xs text-[#00ff41]/85 font-bold font-mono uppercase tracking-wider">
                        {t('config_quick_select')}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        {POPULAR_DEVICES.map((d) => {
                            const isCurrent = modelName.toLowerCase().includes(d.name.toLowerCase());
                            return (
                                <button
                                    key={d.name}
                                    type="button"
                                    onClick={() => {
                                        setModelName(`${d.brand} ${d.name}`);
                                        setDevice(d.type);
                                        setHardwareTier(d.tier);
                                        setGpu(d.gpu);
                                        if (d.type === DeviceType.ANDROID) {
                                            setAndroidVersion(d.ver);
                                            setIosVersion('');
                                        } else {
                                            setIosVersion(d.ver);
                                            setAndroidVersion('');
                                        }
                                        setDetectionStatus(`🎯 Loaded Specific Pro Preset: ${d.brand} ${d.name} [Optimized: ${d.tier}]`);
                                        showFeedback(`Preset for ${d.brand} ${d.name} loaded successfully!`);
                                    }}
                                    className={`px-2 py-1 text-[11px] font-mono border transition-all rounded ${
                                        isCurrent
                                            ? "bg-[#00ff41]/25 border-[#00ff41] text-white shadow-[0_0_8px_rgba(0,255,65,0.3)] font-bold"
                                            : "bg-black/50 border-[#00ff41]/20 text-[#00ff41]/80 hover:bg-[#00ff41]/10 hover:border-[#00ff41]/50"
                                    }`}
                                >
                                    {d.brand} {d.name}
                                </button>
                            );
                        })}
                    </div>
                    <span className="block text-[10px] text-[#00ff41]/50 leading-none">
                        {t('config_quick_select_desc')}
                    </span>
                </div>

                <div>
                    <label className="block text-lg font-semibold text-[#00ff41]">{t('config_model_lbl')}</label>
                    <input type="text" name="modelName" value={modelName} onChange={handleInputChange} className={`custom-input ${validationErrors.modelName ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder={modelPlaceholder} />
                    <p className="text-red-400 text-sm h-5">{validationErrors.modelName || ''}</p>
                </div>
                {isAndroid && (
                    <div>
                        <label className="block text-lg font-semibold text-[#00ff41]">{t('config_android_ver_lbl')}</label>
                        <input type="text" name="androidVersion" value={androidVersion} onChange={handleInputChange} className={`custom-input ${validationErrors.androidVersion ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 13" />
                        <p className="text-red-400 text-sm h-5">{validationErrors.androidVersion || ''}</p>
                    </div>
                )}
                {isIos && (
                     <div>
                        <label className="block text-lg font-semibold text-[#00ff41]">{t('config_ios_ver_lbl')}</label>
                        <input type="text" name="iosVersion" value={iosVersion} onChange={handleInputChange} className={`custom-input ${validationErrors.iosVersion ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,50,50,0.5)]' : ''}`} placeholder="e.g., 16.5" />
                        <p className="text-red-400 text-sm h-5">{validationErrors.iosVersion || ''}</p>
                    </div>
                )}
                {isAndroid && (
                    <div className="flex items-center gap-3 bg-black/30 p-3 border border-[#00ff41]/20">
                        <input
                            type="checkbox"
                            id="headshotConfig"
                            checked={useHeadshotConfig}
                            onChange={(e) => setUseHeadshotConfig(e.target.checked)}
                            className="h-5 w-5 bg-black/50 border-[#00ff41] text-[#00ff41] focus:ring-[#00ff41]"
                        />
                        <label htmlFor="headshotConfig" className="text-lg">Generate Headshot Config File</label>
                    </div>
                )}
            </div>
        );
    };

    const getButtonText = () => {
        let baseText = '';
        if (device === DeviceType.IPHONE) baseText = 'Generate Sensi';
        else if (device === DeviceType.ANDROID) {
            baseText = useHeadshotConfig ? 'Generate Config File' : 'Generate Sensi';
        }

        const hasResult = !!androidConfig;
        return hasResult && !isLoading ? `Refresh ${baseText.split(' ').pop()}` : baseText;
    };

    const isFormInvalid = () => {
        const visibleFields = ['modelName', 'androidVersion', 'iosVersion'];
        return visibleFields.some(field => validationErrors[field] != null);
    };


    return (
        <section className="panel-glass p-6 space-y-6 max-w-4xl mx-auto">
             <LoadingOverlay isLoading={isLoading} message={loadingMessage}>
                <AdBanner key="config-loading-ad" />
            </LoadingOverlay>
            
            <h2 className="text-3xl uppercase tracking-wider">Configuration Generator</h2>
            
            {/* Live Automated Biometric / Device Telemetry Block */}
            <div className="border border-[#00ff41]/35 bg-black/40 p-4 space-y-3 relative overflow-hidden font-mono text-xs rounded shadow-[0_0_15px_rgba(0,255,65,0.05)]">
                {/* Decorative CSS keyframe animation for laser scan line */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes laserScan {
                        0% { top: 0%; opacity: 0.3; }
                        50% { top: 100%; opacity: 1; }
                        100% { top: 0%; opacity: 0.3; }
                    }
                    .animate-laser-scan {
                        animation: laserScan 4s ease-in-out infinite;
                    }
                `}} />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff41] shadow-[0_0_8px_#00ff41] animate-laser-scan pointer-events-none z-0"></div>
                
                <div className="flex flex-wrap justify-between items-center border-b border-[#00ff41]/20 pb-2 relative z-10">
                    <span className="text-[11px] uppercase text-[#00ff41]/80 font-bold tracking-widest">🧬 AUTOMATED MOBILE BIO-SCANNER</span>
                    <span className="text-[11px] bg-[#00ff41]/20 px-2.5 py-0.5 uppercase border border-[#00ff41]/40 animate-pulse text-[#00ff41] font-bold">
                        ● SCAN ACTIVE
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <div className="space-y-1.5 bg-black/30 p-3 border border-[#00ff41]/10 rounded hover:border-[#00ff41]/30 transition-all">
                        <span className="text-[10px] uppercase text-[#00ff41]/60 font-bold tracking-wider block">DETECTED MODEL BRAND:</span>
                        <div className="text-lg font-bold text-white flex items-center gap-2">
                            {device === DeviceType.IPHONE ? '🍎' : '🤖'} <span className="text-[#00ff41] tracking-wide">{modelName || "Detecting..."}</span>
                        </div>
                        <div className="text-[11px] text-[#00ff41]/80 mt-1">
                            OS Version Detected: <span className="text-white font-semibold">{device === DeviceType.IPHONE ? `iOS ${iosVersion || '17.0'}` : `Android ${androidVersion || '13'}`}</span>
                        </div>
                    </div>

                    <div className="space-y-1.5 bg-black/30 p-3 border border-[#00ff41]/10 rounded hover:border-[#00ff41]/30 transition-all">
                        <span className="text-[10px] uppercase text-[#00ff41]/60 font-bold tracking-wider block">CHIPSET & TELEMETRY TIER:</span>
                        <div className="text-sm font-semibold flex items-center justify-between text-[#00ff41]/90">
                            <span>Hardware profile:</span>
                            <span className="text-white border border-[#00ff41]/30 px-2 py-0.5 text-xs uppercase bg-[#00ff41]/25">
                                {hardwareTier || "Medium End"}
                            </span>
                        </div>
                        <div className="text-[11px] text-[#00ff41]/80 space-y-0.5 mt-1">
                            <div>Graphics GPU: <span className="text-white">{gpu || detectDeviceHardware().gpu}</span></div>
                            <div>CPU Cores Detected: <span className="text-white">{detectDeviceHardware().cores} Cores</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-[#00ff41]/70 bg-black/20 p-2 border border-[#00ff41]/20">
                <p>&gt; {detectionStatus}</p>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handleLoadSavedProfile}
                        className="flex-1 sm:flex-none bg-[#00ff41]/10 border border-[#00ff41]/40 px-3 py-1 text-xs uppercase hover:bg-[#00ff41]/20 transition-colors"
                    >
                        Load Profile
                    </button>
                    <button 
                        onClick={handleSaveCurrentProfile}
                        className="flex-1 sm:flex-none bg-[#00ff41]/10 border border-[#00ff41]/40 px-3 py-1 text-xs uppercase hover:bg-[#00ff41]/20 transition-colors"
                    >
                        Save Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-lg font-semibold text-[#00ff41] font-sans">{t('config_dev_type')}</label>
                    <select value={device} onChange={e => setDevice(e.target.value as DeviceType)} className="custom-input custom-select">
                        <option value={DeviceType.ANDROID}>Android</option>
                        <option value={DeviceType.IPHONE}>iPhone / iPad (iOS)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-semibold text-[#00ff41] font-sans">{t('config_hardware_tier')}</label>
                    <select value={hardwareTier} onChange={e => setHardwareTier(e.target.value)} className="custom-input custom-select">
                        <option value="Low End">Low-End (High Sensitivity for laggy displays)</option>
                        <option value="Medium End">Medium-End (Optimized for standard screens)</option>
                        <option value="High End">High-End (Slightly lower settings to prevent headshot overshoot)</option>
                    </select>
                </div>
            </div>

            {/* Visual Playing Styles Selector List */}
            <div className="space-y-3">
                <label className="block text-lg font-semibold text-[#00ff41] font-sans">
                    {t('config_play_style')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                        {
                            id: 'Balanced',
                            title: t('style_balanced_title'),
                            desc: t('style_balanced_desc'),
                            icon: Sliders
                        },
                        {
                            id: 'Rusher',
                            title: t('style_rusher_title'),
                            desc: t('style_rusher_desc'),
                            icon: Flame
                        },
                        {
                            id: 'Sniper',
                            title: t('style_sniper_title'),
                            desc: t('style_sniper_desc'),
                            icon: MousePointer
                        },
                        {
                            id: 'Supporter',
                            title: t('style_supporter_title'),
                            desc: t('style_supporter_desc'),
                            icon: Sparkles
                        }
                    ].map((style) => {
                        const IconComponent = style.icon;
                        const isSelected = playingStyle === style.id;
                        return (
                            <button
                                key={style.id}
                                type="button"
                                onClick={() => setPlayingStyle(style.id)}
                                className={`relative p-3.5 text-left border flex flex-col justify-between transition-all rounded duration-300 h-full ${
                                    isSelected 
                                        ? 'bg-[#00ff41]/10 border-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.15)] text-white' 
                                        : 'bg-black/40 border-[#00ff41]/20 text-white/80 hover:border-[#00ff41]/50'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full mb-1">
                                    <span className={`text-[13px] font-bold tracking-wide ${isSelected ? 'text-[#00ff41]' : ''}`}>
                                        {style.title}
                                    </span>
                                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#00ff41] animate-pulse' : 'opacity-60'}`} />
                                </div>
                                <p className="text-[11px] text-white/65 leading-tight">
                                    {style.desc}
                                </p>
                                {isSelected && (
                                    <div className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff41]"></span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Real Search Verification Card */}
            <div className="bg-black/50 border border-[#00ff41]/20 p-3.5 rounded text-xs space-y-1.5 font-mono">
                <div className="flex items-center gap-2 text-[#00ff41] font-bold">
                    <CheckSquare className="w-4 h-4 text-[#00ff41]" />
                    <span>{t('config_verified_lookup')}</span>
                </div>
                <p className="text-white/85 leading-relaxed">
                    {t('config_verified_desc')}
                </p>
            </div>

            {renderMobileInputs()}

            <Button onClick={handleGenerateConfig} isLoading={isLoading} disabled={isFormInvalid()}>
                {getButtonText()}
            </Button>

            {error && <ErrorDisplay error={error} />}

            {/* --- Results Section --- */}
            <div aria-live="polite">
                {!isLoading && (regeditContent || androidConfig) && (
                    <div className="space-y-6 pt-4 border-t border-[#00ff41]/20">
                        {/* Beautiful Segmented View Control to eliminate confusion */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black border border-[#00ff41]/30 p-4">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-[#00ff41]">
                                    <Sparkles className="w-5 h-5 animate-pulse text-[#00ff41]" />
                                    <span>YOUR HIGH-PRECISION CONFIGURATION GENERATED!</span>
                                </h3>
                                <p className="text-xs text-[#00ff41]/70 mt-1">
                                    Optimized dynamic values calibrated specifically for {hardwareTier} hardware level.
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
                                    <span>Raw Config File</span>
                                </button>
                            </div>
                        </div>

                        {/* --- VIEW MODE 1: VISUAL HUD DASHBOARD (NO CONFUSION) --- */}
                        {resultsViewMode === 'visual' && (
                            <div className="space-y-6">
                                {device !== DeviceType.PC_EMULATOR ? (
                                    /* MOBILE HUD VIEW */
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        
                                        {/* Row 1: Left column - Sensitivity Sliders Display (Take 7 cols) */}
                                        <div className="lg:col-span-7 bg-black border border-[#00ff41]/30 p-5 space-y-5">
                                            <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-3">
                                                <h4 className="text-xl font-bold flex items-center gap-2 text-[#00ff41]">
                                                    <Sliders className="w-5 h-5 text-[#00ff41]" />
                                                    <span>IN-GAME SENSITIVITY SETTINGS</span>
                                                </h4>
                                                <span className="text-xs bg-[#00ff41]/15 text-[#00ff41] px-2 py-0.5 rounded font-mono border border-[#00ff41]/30">
                                                    Updated (Max 200 Scale)
                                                </span>
                                            </div>

                                            {(() => {
                                                const sensi = extractSensitivities(androidConfig);
                                                const sliderList = [
                                                    { name: 'General Sensitivity', value: sensi.general, desc: 'Used for general sight movement and swift crosshair dragging' },
                                                    { name: 'Red Dot Sight', value: sensi.redDot, desc: 'Critical for lock accuracy without any scope zoom active' },
                                                    { name: '2x Scope Sight', value: sensi.scope2x, desc: 'Medium range sub-machine gun or rifle scope tracking' },
                                                    { name: '4x Scope Sight', value: sensi.scope4x, desc: 'Long range stability calibration' },
                                                    { name: 'Sniper Scope Sight', value: sensi.sniperScope, desc: 'Slow precision tracking for single shot rifles' },
                                                    { name: 'Free Look Sight', value: sensi.freeLook, desc: 'General surveillance view range' },
                                                ];

                                                return (
                                                    <div className="space-y-4">
                                                        {sliderList.map((item, idx) => {
                                                            const percent = Math.min(100, Math.max(0, (item.value / 200) * 100));
                                                            return (
                                                                <div key={idx} className="space-y-1.5">
                                                                    <div className="flex justify-between items-end text-sm">
                                                                        <div>
                                                                            <span className="font-bold text-[#00ff41]">{item.name}</span>
                                                                            <span className="block text-[11px] text-[#00ff41]/60 leading-none">{item.desc}</span>
                                                                        </div>
                                                                        <span className="font-mono text-lg font-bold text-[#00ff41]">
                                                                            {item.value} <span className="text-xs text-[#00ff41]/50">/ 200</span>
                                                                        </span>
                                                                    </div>
                                                                    {/* Custom styled neon progress bar */}
                                                                    <div className="h-3.5 bg-black border border-[#00ff41]/20 w-full relative overflow-hidden rounded-sm flex items-center">
                                                                        {/* Background grid markings for military/cyberpunk HUD look */}
                                                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:10%_100%] pointer-events-none" />
                                                                        <div 
                                                                            className="h-full bg-gradient-to-r from-[#00ff41]/40 to-[#00ff41] transition-all duration-500 ease-out relative"
                                                                            style={{ width: `${percent}%` }}
                                                                        >
                                                                            {/* Accent highlight strip at the edge */}
                                                                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white animate-pulse" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Right Column: Platform Calibration Matrix & Checklist (Take 5 cols) */}
                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                            {/* OS & Phone Hardware Optimizations */}
                                            {(() => {
                                                const phone = extractPhoneSettings(androidConfig, hardwareTier);
                                                return (
                                                    <div className="bg-black border border-[#00ff41]/30 p-5 space-y-4">
                                                        <h4 className="text-xl font-bold flex items-center gap-2 text-[#00ff41] border-b border-[#00ff41]/20 pb-2.5">
                                                            <Smartphone className="w-5 h-5 text-[#00ff41]" />
                                                            <span>PHONE SPEC CALIBRATION</span>
                                                        </h4>
                                                        
                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                            <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                                <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">Recommended DPI</span>
                                                                <span className="text-2xl font-bold font-mono text-[#00ff41] block">{phone.dpi}</span>
                                                                <span className="text-[10px] text-white/50 block">Set in Developer Options</span>
                                                            </div>
                                                            <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                                <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">Pointer Velocity</span>
                                                                <span className="text-xl font-bold font-mono text-[#00ff41] block truncate">{phone.pointerSpeed}</span>
                                                                <span className="text-[10px] text-white/50 block">Language & Input Speed</span>
                                                            </div>
                                                        </div>

                                                        <div className="border border-[#00ff41]/20 bg-[#00ff41]/5 p-3 space-y-1 text-xs">
                                                            <div className="flex justify-between font-mono">
                                                                <span className="text-[#00ff41]/70">SCREEN REFRESH RATE:</span>
                                                                <span className="text-[#00ff41] font-bold">{phone.refreshRate}</span>
                                                            </div>
                                                            <div className="flex justify-between font-mono">
                                                                <span className="text-[#00ff41]/70">CALIBRATION HARDWARE SPEC:</span>
                                                                <span className="text-[#00ff41] font-bold uppercase">{hardwareTier}</span>
                                                            </div>
                                                        </div>

                                                        {phone.proTip && (
                                                            <div className="p-3 bg-black/50 border-l-2 border-[#00ff41] text-xs text-[#00ff41]/90 italic">
                                                                💡 <span className="font-semibold text-white">Dynamic Safe Guard:</span> {phone.proTip}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* Interactive Step-by-Step Checklist */}
                                            <div className="bg-black border border-[#00ff41]/30 p-5 space-y-3 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#00ff41] flex items-center gap-2 border-b border-[#00ff41]/20 pb-2">
                                                        <CheckSquare className="w-5 h-5 text-[#00ff41]" />
                                                        <span>EASY APPLY CHECKLIST</span>
                                                    </h4>
                                                    <p className="text-xs text-[#00ff41]/70 mb-3 leading-relaxed">
                                                        Don't get confused! Follow these 5 quick steps in order to perfectly apply your calibrated headshot vectors.
                                                    </p>
                                                    
                                                    {(() => {
                                                        const sensi = extractSensitivities(androidConfig);
                                                        const phone = extractPhoneSettings(androidConfig, hardwareTier);
                                                        const steps = [
                                                            { id: 'step_sens', text: `Open Free Fire -> Sensitivity Settings and adjust the General slider exactly to ${sensi.general} and Red Dot to ${sensi.redDot}` },
                                                            { id: 'step_scopes', text: `Set 2x Scope to ${sensi.scope2x} and 4x Scope to ${sensi.scope4x}` },
                                                            { id: 'step_dpi', text: `Go to phone settings -> developer options -> set smallest width / DPI to ${phone.dpi.replace(/\D/g,'') || '640'}` },
                                                            { id: 'step_ptr', text: `Optimize pointer velocity slider to ${phone.pointerSpeed === 'Maximum (10/10)' ? 'Maximum (Full High)' : 'Balanced Level'}` },
                                                            { id: 'step_prac', text: "Launch Free Fire training grounds and drag fire button vertically for 10 minutes to lock muscle memory!" }
                                                        ];

                                                        return (
                                                            <div className="space-y-2 text-xs">
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

                                                <div className="pt-3 flex gap-2">
                                                    <Button 
                                                        onClick={() => {
                                                            const customSensi = extractSensitivities(androidConfig);
                                                            const simpleText = `FREE FIRE PERSONALIZED SENSITIVITY DESIGN\n` + 
                                                                               `======================================\n` + 
                                                                               `Hardware Specification: ${hardwareTier}\n\n` +
                                                                               `IN-GAME SETTINGS:\n` +
                                                                               `- General: ${customSensi.general}/200\n` +
                                                                               `- Red Dot: ${customSensi.redDot}/200\n` +
                                                                               `- 2x Scope: ${customSensi.scope2x}/200\n` +
                                                                               `- 4x Scope: ${customSensi.scope4x}/200\n` +
                                                                               `- Sniper: ${customSensi.sniperScope}/200\n` +
                                                                               `- Free Look: ${customSensi.freeLook}/200\n\n` +
                                                                               `PHONE SPECIFICATIONS:\n` +
                                                                               `- Advised DPI: ${extractPhoneSettings(androidConfig, hardwareTier).dpi}\n` +
                                                                               `- Pointer Speed: ${extractPhoneSettings(androidConfig, hardwareTier).pointerSpeed}\n`;
                                                            setupDownload(simpleText, 'headshot_sensi_calibrated.txt');
                                                        }}
                                                    >
                                                        Download settings file
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    /* PC EMULATOR HUD VIEW */
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        
                                        {/* Left col - Emulator matrix tiles (Take 6 cols) */}
                                        <div className="lg:col-span-6 bg-black border border-[#00ff41]/30 p-5 space-y-4">
                                            <h4 className="text-xl font-bold flex items-center gap-2 text-[#00ff41] border-b border-[#00ff41]/20 pb-2.5">
                                                <Monitor className="w-5 h-5 text-[#00ff41]" />
                                                <span>EMULATOR OPTIMIZATION SCHEMATICS</span>
                                            </h4>

                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                    <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">CPU Allocation</span>
                                                    <span className="text-base font-bold text-white block">{emulatorTweaks?.performance.cpuCores || '4 Cores (Recommended)'}</span>
                                                </div>
                                                <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                    <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">RAM Allocation</span>
                                                    <span className="text-base font-bold text-white block">{emulatorTweaks?.performance.ramAllocation || '4 GB (High Alloc)'}</span>
                                                </div>
                                                <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                    <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">Target Resolution</span>
                                                    <span className="text-base font-bold text-white block">{emulatorTweaks?.display.resolution || '1920x1080'}</span>
                                                </div>
                                                <div className="bg-black border border-[#00ff41]/25 p-3 rounded space-y-1">
                                                    <span className="text-[#00ff41]/60 uppercase tracking-wider block font-mono">DirectX/GL Mode</span>
                                                    <span className="text-base font-bold text-white block truncate">{emulatorTweaks?.display.engineSettings || 'Performance Mode, OpenGL'}</span>
                                                </div>
                                            </div>

                                            {/* In-Emulator Mouse Axis Sliders inside stylized bars */}
                                            <div className="space-y-3 bg-[#00ff41]/5 p-4 border border-[#00ff41]/20 rounded font-sans">
                                                <h5 className="font-bold text-xs text-[#00ff41] uppercase tracking-wider flex items-center gap-1">
                                                    <MousePointer className="w-3.5 h-3.5" />
                                                    <span>IN-EMULATOR CURSOR VELOCITY SENSITIVITY (200 Scale)</span>
                                                </h5>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-[#00ff41]/70">EMULATOR X-AXIS:</span>
                                                            <span className="font-mono font-bold text-[#00ff41]">{emulatorTweaks?.sensitivity.emulatorX || 120} / 200</span>
                                                        </div>
                                                        <div className="h-2 bg-black border border-[#00ff41]/20 rounded-sm overflow-hidden flex items-center">
                                                            <div className="h-full bg-[#00ff41]" style={{ width: `${((emulatorTweaks?.sensitivity.emulatorX || 120) / 200) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-[#00ff41]/70">EMULATOR Y-AXIS (Headshots):</span>
                                                            <span className="font-mono font-bold text-[#00ff41]">{emulatorTweaks?.sensitivity.emulatorY || 115} / 200</span>
                                                        </div>
                                                        <div className="h-2 bg-black border border-[#00ff41]/20 rounded-sm overflow-hidden flex items-center">
                                                            <div className="h-full bg-[#00ff41]" style={{ width: `${((emulatorTweaks?.sensitivity.emulatorY || 115) / 200) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {emulatorTweaks?.specialTweak && (
                                                <div className="p-3 bg-black border border-[#00ff41]/35 flex justify-between items-center gap-4">
                                                    <div className="flex-1">
                                                        <span className="text-[10px] text-[#00ff41]/60 font-mono tracking-widest block uppercase">SPECIAL SYSTEM VECTOR CODE</span>
                                                        <span className="text-xs text-white/80 font-sans leading-tight block">{emulatorTweaks.specialTweak.description}</span>
                                                    </div>
                                                    <div className="bg-black border-2 border-[#00ff41] text-[#00ff41] font-mono text-2xl font-bold px-3 py-1.5 shadow-[0_0_10px_rgba(0,255,65,0.4)] animate-pulse">
                                                        {emulatorTweaks.specialTweak.value}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right col - Windows Registry Hack & Checklist (Take 6 cols) */}
                                        <div className="lg:col-span-6 bg-black border border-[#00ff41]/30 p-5 flex flex-col justify-between space-y-4">
                                            <div>
                                                <h4 className="text-xl font-bold flex items-center gap-2 text-[#00ff41] border-b border-[#00ff41]/20 pb-2.5">
                                                    <Cpu className="w-5 h-5 text-[#00ff41]" />
                                                    <span>WINDOWS SYSTEM TWEAK (.REG)</span>
                                                </h4>
                                                <p className="text-xs text-white/70 leading-relaxed mb-3 mt-1.5 font-sans">
                                                    We have generated an optimized mouse acceleration bypass file script for Windows Registry keys. Double clicking this script sets perfect mouse linearity so headshoot cursors never jump or lock off target.
                                                </p>

                                                <div className="flex items-center gap-1.5 bg-black border border-[#00ff41]/20 p-2 text-xs font-mono text-[#00ff41] mb-4">
                                                    <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-ping" />
                                                    <span>WINDOWS REGISTRY KEY CALIBRATED SUCCESSFULLY</span>
                                                </div>

                                                <h5 className="text-sm font-bold text-[#00ff41] mb-2 flex items-center gap-1.5">
                                                    <CheckSquare className="w-4 h-4" />
                                                    <span>STEP-BY-STEP INTEGRATION STEPS:</span>
                                                </h5>

                                                {(() => {
                                                    const steps = [
                                                        { id: 'pc_step_download', text: "Download the Windows Registry .reg file using the button below." },
                                                        { id: 'pc_step_double', text: "Double-click the downloaded 'headshot_settings.reg' file on your emulator host system." },
                                                        { id: 'pc_step_confirm', text: "Click 'Yes / Confirm' on Windows prompt warnings to safe mount settings." },
                                                        { id: 'pc_step_cores', text: `Adjust emulator settings to match: ${emulatorTweaks?.performance.cpuCores || '4 Cores'} and ${emulatorTweaks?.performance.ramAllocation || '4GB RAM'}.` },
                                                        { id: 'pc_step_xy', text: `Inside emulator settings, manually set X Sensitivity to ${emulatorTweaks?.sensitivity.emulatorX || 120} and Y to ${emulatorTweaks?.sensitivity.emulatorY || 115}.` },
                                                    ];

                                                    return (
                                                        <div className="space-y-2 text-xs">
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

                                            <div className="pt-3 flex flex-wrap gap-3">
                                                <Button onClick={() => setupDownload(regeditContent, 'headshot_settings.reg')}>
                                                    Download Regedit File (.reg)
                                                </Button>
                                                <Button variant="secondary" onClick={() => {
                                                    navigator.clipboard.writeText(regeditContent);
                                                    showFeedback("Registry settings copied to clipboard!");
                                                }}>
                                                    Copy Registry Script
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- VIEW MODE 2: RAW TEXT/CODE AREA --- */}
                        {resultsViewMode === 'raw' && (
                            <div className="space-y-4">
                                {device === DeviceType.PC_EMULATOR ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-black border border-[#00ff41]/25 p-3 rounded-t">
                                            <span className="text-xs font-mono text-[#00ff41]">headshot_settings.reg</span>
                                            <CopyToClipboardButton textToCopy={regeditContent} />
                                        </div>
                                        <pre className="bg-black/90 border-x border-b border-[#00ff41]/30 p-4 h-96 overflow-y-auto scrollbar-thin text-xs text-[#00ff41] font-mono whitespace-pre-wrap break-words">
                                            {regeditContent}
                                        </pre>
                                        <div className="flex justify-start">
                                            <Button onClick={() => setupDownload(regeditContent, 'headshot_settings.reg')}>
                                                Download Regedit Script (.reg)
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-black border border-[#00ff41]/25 p-3 rounded-t">
                                            <span className="text-xs font-mono text-[#00ff41]">{useHeadshotConfig ? 'headshot_config.cfg' : 'sensitivity_plan.txt'}</span>
                                            <CopyToClipboardButton textToCopy={androidConfig} />
                                        </div>
                                        <pre className="bg-black/90 border-x border-b border-[#00ff41]/30 p-4 h-96 overflow-y-auto scrollbar-thin text-xs text-[#00ff41] font-mono whitespace-pre-wrap break-words">
                                            {androidConfig}
                                        </pre>
                                        <div className="flex justify-start">
                                            <Button onClick={useHeadshotConfig ? handleDownloadConfigFile : () => setupDownload(androidConfig, 'sensitivity.txt')}>
                                                {useHeadshotConfig ? 'Download .CFG File' : 'Download Sensi File'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeDownload}
                title="Confirm File Download"
            >
                {downloadDetails && (
                    <div className="space-y-2">
                        <p>You are about to download the following file:</p>
                        <p className="font-bold text-2xl text-white bg-black/30 p-2 border border-[#00ff41]/30">{downloadDetails.fileName}</p>
                        <p>Are you sure you want to proceed?</p>
                    </div>
                )}
            </ConfirmationDialog>

        </section>
    );
};
