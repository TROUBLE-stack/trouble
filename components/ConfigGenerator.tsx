
import React, { useState } from 'react';
import { generateHeadshotConfig } from '../services/geminiService';
import { DeviceType } from '../types';
import { Button } from './common/Button';

export const ConfigGenerator: React.FC = () => {
  const [device, setDevice] = useState<DeviceType>(DeviceType.ANDROID);
  const [phoneName, setPhoneName] = useState<string>('');
  const [config, setConfig] = useState<string>('');
  const [deviceTier, setDeviceTier] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateConfig = async () => {
    setIsLoading(true);
    setError(null);
    setConfig('');
    setDeviceTier('');

    // Construct the device identifier string for the prompt
    let deviceIdentifier = device;
    if ((device === DeviceType.ANDROID || device === DeviceType.IPHONE) && phoneName.trim()) {
      deviceIdentifier = `${device} (Model: ${phoneName.trim()})`;
    }
    
    const generatedConfig = await generateHeadshotConfig(deviceIdentifier);
    try {
      // Prettify the JSON for display
      const parsedConfig = JSON.parse(generatedConfig);
      if (parsedConfig.error) {
        setError(parsedConfig.error)
      } else {
        setDeviceTier(parsedConfig.deviceTier || 'Unknown');
        // Remove the tier from the displayed config for a cleaner file
        const configToDisplay = { ...parsedConfig };
        delete configToDisplay.deviceTier;
        setConfig(JSON.stringify(configToDisplay, null, 2));
      }
    } catch (e) {
      setError("Failed to parse AI response as valid JSON.");
      setConfig(generatedConfig); // Show raw response on error
    }
    setIsLoading(false);
  };
  
  const handleDownload = () => {
    if (!config) return;
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trouble-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const placeholderText = device === DeviceType.ANDROID
    ? "e.g., Samsung S23 Ultra"
    : "e.g., iPhone 15 Pro";

  return (
    <section className="border-2 border-[#00ff41]/50 p-6 space-y-4">
      <h2 className="text-3xl uppercase tracking-wider">Headshot Config Generator</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="device-select" className="block text-lg">Select your device type:</label>
          <select
            id="device-select"
            value={device}
            onChange={(e) => setDevice(e.target.value as DeviceType)}
            className="w-full bg-black/50 border-2 border-[#00ff41] p-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#00ff41] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300ff41' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            {Object.values(DeviceType).map((d) => (
              <option key={d} value={d} className="bg-black text-[#00ff41]">{d}</option>
            ))}
          </select>
        </div>
        {(device === DeviceType.ANDROID || device === DeviceType.IPHONE) && (
            <div className="space-y-2">
              <label htmlFor="phone-name-input" className="block text-lg">Enter device model (optional):</label>
              <input
                id="phone-name-input"
                type="text"
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                placeholder={placeholderText}
                className="w-full bg-black/50 border-2 border-[#00ff41] p-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#00ff41]"
              />
            </div>
          )}
      </div>
      <Button onClick={handleGenerateConfig} isLoading={isLoading}>
        Generate Config File
      </Button>

      {deviceTier && !isLoading && !error && (
        <div className="text-center p-2 border border-[#00ff41]/50 bg-black/30">
          <p>Device Classification: <span className="font-bold text-lg text-white">{deviceTier}</span></p>
        </div>
      )}

      {error && <p className="text-red-500 bg-red-900/50 border border-red-500 p-2">{error}</p>}
      
      <div className="mt-4 bg-black/50 border border-[#00ff41]/30 p-4 h-96 overflow-y-auto scrollbar-thin">
        {isLoading && <p>CALIBRATING SENSITIVITY MATRIX...</p>}
        {config && (
           <pre className="whitespace-pre-wrap break-words text-base">{config}</pre>
        )}
        {!config && !isLoading && (
            <p className="text-[#00ff41]/60">Your generated config file will appear here. Select a device and click "Generate Config File".</p>
        )}
      </div>

       <Button onClick={handleDownload} disabled={!config || !!error}>
        Download File
      </Button>
    </section>
  );
};
