
import { HistoryItem, DeviceProfileData } from '../types';

const HISTORY_KEY = 'headshot_exe_history';
const PROFILE_KEY = 'headshot_exe_profile';
const CACHE_PREFIX = 'headshot_exe_cache_';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to check if localStorage is available
const isStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

interface CacheEntry {
    timestamp: number;
    data: any;
}

export const getCacheKey = (type: string, context: string): string => {
    const sanitizedContext = context.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `${CACHE_PREFIX}${type}_${sanitizedContext}`;
};

export const setCache = (key: string, data: any): void => {
    if (!isStorageAvailable()) return;
    try {
        const entry: CacheEntry = {
            timestamp: Date.now(),
            data,
        };
        localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
        console.warn("Failed to save to cache", error);
    }
};

export const getCache = <T>(key: string): T | null => {
    if (!isStorageAvailable()) return null;
    try {
        const itemJSON = localStorage.getItem(key);
        if (!itemJSON) return null;

        const entry: CacheEntry = JSON.parse(itemJSON);
        if (Date.now() - entry.timestamp > CACHE_DURATION_MS) {
            localStorage.removeItem(key); 
            return null;
        }
        return entry.data as T;
    } catch (error) {
        return null;
    }
};

export const getHistory = (): HistoryItem[] => {
    if (!isStorageAvailable()) return [];
    try {
        const itemsJSON = localStorage.getItem(HISTORY_KEY);
        return itemsJSON ? JSON.parse(itemsJSON) : [];
    } catch (error) {
        return [];
    }
};

export const addHistoryItem = (item: Omit<HistoryItem, 'id'>): void => {
    if (!isStorageAvailable()) return;
    try {
        const history = getHistory();
        const newItem: HistoryItem = { ...item, id: new Date().toISOString() + Math.random() };
        const updatedHistory = [newItem, ...history].slice(0, 50);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.warn("Failed to save history", error);
    }
};

export const clearHistory = (): void => {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(HISTORY_KEY);
};

export const getDeviceProfile = (): DeviceProfileData | null => {
    if (!isStorageAvailable()) return null;
    try {
        const profileJSON = localStorage.getItem(PROFILE_KEY);
        return profileJSON ? JSON.parse(profileJSON) : null;
    } catch (error) {
        return null;
    }
};

export const saveDeviceProfile = (profile: DeviceProfileData): void => {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.warn("Failed to save device profile", error);
    }
};

export const clearDeviceProfile = (): void => {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(PROFILE_KEY);
};

export interface AffiliateDeal {
    id: string;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    link: string;
    provider: string;
}

const AFFILIATE_KEY = 'headshot_exe_affiliate_deals';

export const DEFAULT_AFFILIATE_DEALS: AffiliateDeal[] = [
    {
        id: 'winzo-diamonds',
        titleEn: '🎁 CLAIM 100+ FREE FF DIAMONDS',
        titleHi: '🎁 पाएं 100+ फ्री फायर डायमंड्स तुरंत',
        descEn: 'Install WinZO app & complete one game to get instant 100+ Diamonds in your Free Fire UID. Certified and safe.',
        descHi: 'WinZO ऐप इंस्टॉल करें और तुरंत अपने FF UID में पाएं 100 से अधिक डायमंड्स! 100% असली व सुरक्षित तरीका।',
        link: 'https://www.winzogames.com/',
        provider: 'Sponsor: WinZO Esports Network'
    },
    {
        id: 'bonus-diamonds',
        titleEn: '💎 FLAT 15% BONUS DIAMONDS TOP-UP',
        titleHi: '💎 पाएं 15% अतिरिक्त डायमंड्स टॉप-अप बोनस',
        descEn: 'Buy Diamonds from partner store to instantly acquire a 15% top-up bonus to unlock Elite Pass items.',
        descHi: 'कन्फर्म पार्टनर स्टोर CodaShop से डायमंड्स खरीदें और पाएं 15% अतिरिक्त बोनस अपनी आईडी में तुरंत।',
        link: 'https://www.codashop.com/',
        provider: 'Affiliate Partner: CodaShop India'
    },
    {
        id: 'precision-triggers',
        titleEn: '⚡ ESPORTS HIGH-SPEED FINGER SLEEVES (50% OFF)',
        titleHi: '⚡ हाई-स्पीड गेमिंग फिंगर स्लीव्स (50% छूट)',
        descEn: 'Improve touchscreen sensitivity by 200%. Prevent sweat stutters on mobile screen. Used by Esports Pros.',
        descHi: 'टचस्क्रीन की संवेदनशीलता को 2x बढ़ाएं। पसीने के कारण होने वाले लैग को रोकें। प्रो प्लेयर्स द्वारा उपयोगी।',
        link: 'https://www.amazon.in/',
        provider: 'e-Store Discount Code: GAMER50'
    }
];

export const getAffiliateDeals = (): AffiliateDeal[] => {
    if (!isStorageAvailable()) return DEFAULT_AFFILIATE_DEALS;
    try {
        const itemJSON = localStorage.getItem(AFFILIATE_KEY);
        if (!itemJSON) {
            localStorage.setItem(AFFILIATE_KEY, JSON.stringify(DEFAULT_AFFILIATE_DEALS));
            return DEFAULT_AFFILIATE_DEALS;
        }
        return JSON.parse(itemJSON);
    } catch (e) {
        return DEFAULT_AFFILIATE_DEALS;
    }
};

export const saveAffiliateDeals = (deals: AffiliateDeal[]): void => {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(AFFILIATE_KEY, JSON.stringify(deals));
    } catch (e) {
        console.warn("Failed to save affiliate deals", e);
    }
};

const CLICKS_KEY = 'headshot_exe_affiliate_clicks';

export const getAffiliateClicks = (): Record<string, number> => {
    if (!isStorageAvailable()) return {};
    try {
        const itemJSON = localStorage.getItem(CLICKS_KEY);
        return itemJSON ? JSON.parse(itemJSON) : {};
    } catch (e) {
        return {};
    }
};

export const trackAffiliateClick = (dealId: string): void => {
    if (!isStorageAvailable()) return;
    try {
        const clicks = getAffiliateClicks();
        clicks[dealId] = (clicks[dealId] || 0) + 1;
        localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
    } catch (e) {
        console.warn("Failed to track affiliate click", e);
    }
};

export const clearAffiliateClicks = (): void => {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(CLICKS_KEY);
};

export interface AdSenseConfig {
    enabled: boolean;
    publisherId: string;
    adSlotId: string;
    adMode: 'affiliate' | 'adsense' | 'hybrid';
}

const ADSENSE_CONFIG_KEY = 'headshot_exe_adsense_config';

export const DEFAULT_ADSENSE_CONFIG: AdSenseConfig = {
    enabled: false,
    publisherId: 'ca-pub-1234567890123456',
    adSlotId: '1234567890',
    adMode: 'hybrid'
};

export const getAdSenseConfig = (): AdSenseConfig => {
    if (!isStorageAvailable()) return DEFAULT_ADSENSE_CONFIG;
    try {
        const itemJSON = localStorage.getItem(ADSENSE_CONFIG_KEY);
        if (!itemJSON) {
            localStorage.setItem(ADSENSE_CONFIG_KEY, JSON.stringify(DEFAULT_ADSENSE_CONFIG));
            return DEFAULT_ADSENSE_CONFIG;
        }
        return JSON.parse(itemJSON);
    } catch (e) {
        return DEFAULT_ADSENSE_CONFIG;
    }
};

export const saveAdSenseConfig = (config: AdSenseConfig): void => {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(ADSENSE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
        console.warn("Failed to save adsense config", e);
    }
};



