import React, { useState, useEffect } from 'react';
import { getDeviceProfile, saveDeviceProfile } from '../utils/storage';
import { DeviceProfileData } from '../types';
import { Button } from './common/Button';
import { detectDeviceHardware } from '../utils/deviceDetector';

export const DeviceProfile: React.FC = () => {
    const [profile, setProfile] = useState<DeviceProfileData>({});
    const [isSaved, setIsSaved] = useState(false);

    const [detectionSuccess, setDetectionSuccess] = useState('');

    const runAutoDetection = (force = false) => {
        const hardware = detectDeviceHardware();
        const updated: DeviceProfileData = {
            modelName: hardware.modelName,
            hardwareTier: hardware.hardwareTier,
            androidVersion: hardware.deviceType === "Android" ? hardware.osVersion : "",
            iosVersion: hardware.deviceType === "iPhone" ? hardware.osVersion : "",
            gpu: hardware.gpu
        };
        setProfile(updated);
        saveDeviceProfile(updated);
        setDetectionSuccess(`Auto-detect success: ${hardware.modelName} ${hardware.gpu ? `@ ${hardware.gpu}` : ''} (${hardware.hardwareTier})! Details saved.`);
        setTimeout(() => setDetectionSuccess(''), 5000);
    };

    useEffect(() => {
        const loadedProfile = getDeviceProfile();
        if (loadedProfile && loadedProfile.modelName) {
            setProfile(loadedProfile);
        } else {
            runAutoDetection();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        saveDeviceProfile(profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <section className="panel-glass p-6 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl uppercase tracking-wider text-center">My Device Profile</h2>
            <p className="text-center text-lg">Save your device details here to auto-fill them in other tools.</p>

            <div className="space-y-6">
                {false && (<> {/* --- PC Section --- */}
                <fieldset className="border border-[#00ff41]/30 p-4 space-y-4">
                    <legend className="px-2 text-xl">PC / Emulator Profile</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-lg">Emulator:</label>
                            <select name="emulator" value={profile.emulator || 'BlueStacks'} onChange={handleChange} className="custom-input custom-select">
                                <option>BlueStacks</option>
                                <option>MSI App Player</option>
                                <option>NoxPlayer</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-lg">Mouse DPI:</label>
                            <input type="text" name="dpi" value={profile.dpi || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 800" />
                        </div>
                        <div>
                            <label className="block text-lg">In-Game General Sensi:</label>
                            <input type="text" name="inGameGeneralSensi" value={profile.inGameGeneralSensi || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 50"/>
                        </div>
                        <div>
                            <label className="block text-lg">In-Game Red Dot Sensi:</label>
                            <input type="text" name="inGameRedDotSensi" value={profile.inGameRedDotSensi || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 60"/>
                        </div>
                        <div>
                            <label className="block text-lg">CPU:</label>
                            <input type="text" name="cpu" value={profile.cpu || ''} onChange={handleChange} className="custom-input" placeholder="e.g., Ryzen 5 5600X"/>
                        </div>
                        <div>
                            <label className="block text-lg">GPU:</label>
                            <input type="text" name="gpu" value={profile.gpu || ''} onChange={handleChange} className="custom-input" placeholder="e.g., RTX 3060"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-lg">RAM (GB):</label>
                            <input type="text" name="ram" value={profile.ram || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 16"/>
                        </div>
                    </div>
                </fieldset>

                </>)} {/* --- Mobile Section --- */}
                 <fieldset className="border border-[#00ff41]/30 p-4 space-y-4">
                    <legend className="px-2 text-xl flex flex-wrap justify-between items-center gap-2 w-full">
                        <span>Mobile Profile</span>
                        <button 
                            type="button" 
                            onClick={() => runAutoDetection(true)}
                            className="text-xs bg-[#00ff41]/20 border border-[#00ff41]/45 px-2.5 py-1 uppercase rounded text-[#00ff41] hover:bg-[#00ff41]/40 transition-all font-mono"
                        >
                            ⚡ Re-Detect Device
                        </button>
                    </legend>
                    {detectionSuccess && (
                        <div className="bg-[#00ff41]/10 border border-[#00ff41]/40 text-xs p-3 text-[#00ff41] font-mono animate-pulse">
                            &gt; {detectionSuccess}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-lg">Device Model:</label>
                            <input type="text" name="modelName" value={profile.modelName || ''} onChange={handleChange} className="custom-input" placeholder="e.g., Samsung S23" />
                        </div>
                        <div>
                            <label className="block text-lg">Graphics GPU:</label>
                            <input type="text" name="gpu" value={profile.gpu || ''} onChange={handleChange} className="custom-input" placeholder="e.g., Adreno 740" />
                        </div>
                        <div>
                            <label className="block text-lg">Android Version:</label>
                            <input type="text" name="androidVersion" value={profile.androidVersion || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 13" />
                        </div>
                         <div>
                            <label className="block text-lg">iOS Version:</label>
                            <input type="text" name="iosVersion" value={profile.iosVersion || ''} onChange={handleChange} className="custom-input" placeholder="e.g., 16.5" />
                        </div>
                    </div>
                </fieldset>
            </div>

            <Button onClick={handleSave}>
                {isSaved ? 'Profile Saved!' : 'Save My Profile'}
            </Button>
        </section>
    );
};
