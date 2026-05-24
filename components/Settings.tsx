
import React, { useState, useEffect } from 'react';
import { 
    clearHistory, 
    clearDeviceProfile,
    getAffiliateDeals,
    saveAffiliateDeals,
    getAffiliateClicks,
    clearAffiliateClicks,
    DEFAULT_AFFILIATE_DEALS,
    AffiliateDeal,
    getAdSenseConfig,
    saveAdSenseConfig,
    AdSenseConfig
} from '../utils/storage';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import { Button } from './common/Button';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Receipt, Save, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';

interface SettingsProps {
    isFxEnabled: boolean;
    toggleFx: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isFxEnabled, toggleFx }) => {
    const { language, setLanguage, t } = useLanguage();
    const [isHistoryConfirmOpen, setIsHistoryConfirmOpen] = useState(false);
    const [isProfileConfirmOpen, setIsProfileConfirmOpen] = useState(false);
    const [feedback, setFeedback] = useState('');

    const showTempFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleClearHistory = () => {
        clearHistory();
        showTempFeedback(t('feedback_history_cleared'));
    };

    const handleClearProfile = () => {
        clearDeviceProfile();
        showTempFeedback(t('feedback_profile_cleared'));
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        showTempFeedback(t('feedback_lang_changed'));
    };

    const [deals, setDeals] = useState<AffiliateDeal[]>([]);
    const [clickStats, setClickStats] = useState<Record<string, number>>({});
    const [statsResetConfirm, setStatsResetConfirm] = useState(false);

    useEffect(() => {
        setDeals(getAffiliateDeals());
        setClickStats(getAffiliateClicks());
    }, []);

    const handleLinkChange = (id: string, newLink: string) => {
        setDeals(prev => prev.map(deal => deal.id === id ? { ...deal, link: newLink } : deal));
    };

    const handleSaveDeals = () => {
        saveAffiliateDeals(deals);
        showTempFeedback(language === 'hi' ? 'सभी एफिलिएंट विज्ञापन लिंक्स सफलतापूर्वक सेव कर दी गई हैं!' : 'All affiliate monetization links saved successfully!');
    };

    const handleResetDeals = () => {
        setDeals(DEFAULT_AFFILIATE_DEALS);
        saveAffiliateDeals(DEFAULT_AFFILIATE_DEALS);
        showTempFeedback(language === 'hi' ? 'लिंक्स को डिफ़ॉल्ट पर सेट कर दिया गया है' : 'Links reset to default values.');
    };

    const handleResetStats = () => {
        clearAffiliateClicks();
        setClickStats({});
        setStatsResetConfirm(false);
        showTempFeedback(language === 'hi' ? 'कमाई और क्लिक के आंकड़े रीसेट कर दिए गए हैं' : 'Click analytics stats reset to zero.');
    };

    return (
        <section className="panel-glass p-6 space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl uppercase tracking-wider text-center">{t('settings_title')}</h2>

            {/* Language Selector Settings */}
            <fieldset className="border border-[#00ff41]/30 p-4 space-y-4 rounded bg-black/20">
                <legend className="px-2 text-xl font-mono text-[#00ff41]">{t('settings_language')}</legend>
                <p className="text-sm text-white/70">
                    {t('settings_language_desc')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                        { code: 'en' as Language, name: '🇬🇧 English (EN)' },
                        { code: 'hi' as Language, name: '🇮🇳 Hindi (HI)' },
                        { code: 'de' as Language, name: '🇩🇪 German (DE)' },
                        { code: 'ja' as Language, name: '🇯🇵 Japanese (JA)' }
                    ].map((langItem) => {
                        const isCurrent = language === langItem.code;
                        return (
                            <button
                                key={langItem.code}
                                type="button"
                                onClick={() => handleLanguageChange(langItem.code)}
                                className={`px-3 py-2 text-xs font-mono border transition-all rounded outline-none ${
                                    isCurrent
                                        ? "bg-[#00ff41]/25 border-[#00ff41] text-white shadow-[0_0_10px_rgba(0,255,65,0.25)] font-bold"
                                        : "bg-black/50 border-[#00ff41]/20 text-[#00ff41]/80 hover:bg-[#00ff41]/10 hover:border-[#00ff41]/50"
                                }`}
                            >
                                {langItem.name}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Appearance Settings */}
            <fieldset className="border border-[#00ff41]/30 p-4 space-y-4 rounded bg-black/20">
                <legend className="px-2 text-xl font-mono text-[#00ff41]">{t('settings_appearance')}</legend>
                <div className="flex justify-between items-center">
                    <label htmlFor="fx-toggle" className="text-lg">{t('settings_visual_fx')}</label>
                    <button
                        id="fx-toggle"
                        onClick={toggleFx}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${isFxEnabled ? 'bg-[#00ff41]' : 'bg-black/50'} border border-[#00ff41]/40`}
                    >
                        <span className={`inline-block w-4 h-4 transform rounded-full transition-all duration-300 ${isFxEnabled ? 'bg-black translate-x-6' : 'bg-[#00ff41] translate-x-1'}`} />
                    </button>
                </div>
                <p className="text-sm text-[#00ff41]/60">
                    {t('settings_fx_desc')}
                </p>
            </fieldset>
            <fieldset className="border border-[#00ff41]/30 p-4 space-y-4 rounded bg-black/20">
                <legend className="px-2 text-xl font-mono text-[#00ff41]">{t('settings_data_mgmt')}</legend>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-lg text-white/80">{t('settings_clear_history')}</p>
                    <button onClick={() => setIsHistoryConfirmOpen(true)} className="w-full sm:w-auto bg-red-900/50 border border-red-500 px-4 py-2 text-sm hover:bg-red-700/50 transition-colors uppercase tracking-wider font-mono">
                        {t('settings_clear_history_btn')}
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-lg text-white/80">{t('settings_clear_profile')}</p>
                    <button onClick={() => setIsProfileConfirmOpen(true)} className="w-full sm:w-auto bg-red-900/50 border border-red-500 px-4 py-2 text-sm hover:bg-red-700/50 transition-colors uppercase tracking-wider font-mono">
                        {t('settings_clear_profile_btn')}
                    </button>
                </div>
            </fieldset>

            {/* Monetization Cockpit */}
            <fieldset className="border border-[#00ff41]/40 p-5 space-y-6 rounded bg-black/30 shadow-[0_4px_15px_rgba(0,255,65,0.05)]">
                <legend className="px-3 py-0.5 text-xl font-mono text-[#00ff41] bg-black border border-[#00ff41]/30 rounded flex items-center gap-1.5 font-bold">
                    <Receipt className="w-5 h-5 text-[#00ff41]" />
                    {language === 'hi' ? '💰 एफिलिएट कमाई कस्टमाइज़र' : '💰 AFFILIATE MONETIZATION COCKPIT'}
                </legend>
                
                <p className="text-sm text-white/80 leading-relaxed font-sans">
                    {language === 'hi' 
                        ? 'इस ऐप में 100% मुफ्त निष्क्रिय कमाई करने के लिए नीचे दिए गए विज्ञापनों को अपनी खुद की एफिलिएट/रेफरल लिंक्स (Affiliate/Referral Links) से बदलें। जब भी कोई यूजर विज्ञापनों पर क्लिक करके गेम खेलेगा या सामान खरीदेगा, सीधे आपके अकाउंट में पैसे जमा होंगे!'
                        : 'To unlock free offline commission earnings without paying for domain approvals, substitute the URLs below with your own personal affiliate or referral links. Standard user traffic will automatically redirect using your unique referral codes!'}
                </p>

                {/* Live Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-black/60 border border-[#00ff41]/20 rounded font-mono">
                    <div className="text-center sm:text-left space-y-1">
                        <span className="text-[10px] text-white/50 block uppercase tracking-wider">{language === 'hi' ? 'कुल विज्ञापन क्लिक' : 'TOTAL AD CTR CLICKS'}</span>
                        <div className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-1 text-[#00ff41]">
                            <BarChart3 className="w-5 h-5" />
                            <span>{Object.values(clickStats).reduce((a, b) => a + b, 0)}</span>
                        </div>
                    </div>
                    <div className="text-center sm:text-left space-y-1 border-t sm:border-t-0 sm:border-l border-[#00ff41]/10 sm:pl-4">
                        <span className="text-[10px] text-white/50 block uppercase tracking-wider">{language === 'hi' ? 'अनुमानित कुल कमाई' : 'ESTIMATED EARNINGS'}</span>
                        <div className="text-2xl font-bold text-[#00ff41] animate-pulse">
                            <span>₹{(Object.values(clickStats).reduce((a, b) => a + b, 0) * 25).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* STEP BY STEP SETUP GUIDE */}
                <div className="bg-[#00ff41]/5 border border-[#00ff41]/25 p-4 rounded space-y-3">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-[#00ff41] flex items-center gap-1">
                        <span className="animate-pulse">📌</span>
                        {language === 'hi' ? 'फ्री में विज्ञापन सेटअप और कमाई शुरू करने का आसान तरीका :' : 'HOW TO SETUP & EARN FOR FREE (STEP-BY-STEP) :'}
                    </h4>
                    
                    <ul className="text-xs text-white/90 space-y-2.5 list-none font-sans leading-relaxed">
                        {language === 'hi' ? (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">1.</span>
                                    <span>
                                        <strong>WinZO Esports Deal:</strong> WinZO’s Partner Program में मुफ्त रजिस्टर करें। अपनी रेफरल लिंक जनरेट करें और उसे नीचे पहले इनपुट बॉक्स में सेव करें। जब भी यूजर इसे इंस्टॉल करके गेम खेलेगा, आपको प्रत्येक रेफर का <b>₹15 - ₹40</b> मिलेगा।
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">2.</span>
                                    <span>
                                        <strong>CodaShop Diamonds:</strong> Codashop Affiliate या <b>EarnKaro / Curofit / vCommission</b> जैसी मुफ्त एप्स पर जाएं। Codashop का एफिलिएट यूआरएल जनरेट करें और दूसरे इनपुट बॉक्स में पेस्ट करें। यूजर्स के डायमंड्स टॉप-अप करने पर आपको निश्चित कमीशन मिलेगा।
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">3.</span>
                                    <span>
                                        <strong>Gaming Gear (Amazon):</strong> Amazon Associates प्रोग्राम पर मुफ्त रजिस्टर करें। Amazon पर उपलब्ध हाई-स्पीड Gaming Finger Sleeves या किसी भी गेमिंग एक्सेसरी का एफिलिएट लिंक जनरेट कर तीसरे इनपुट में डालें। इससे आपको प्रत्येक सेल पर <b>8% - 10%</b> तक बिक्री मूल्य का हिस्सा मिलेगा।
                                    </span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">1.</span>
                                    <span>
                                        <strong>WinZO Download Sponsor:</strong> Register for free with WinZO Partner Program. Copy your unique game invite link and paste it into the first slot below. Earn <b>₹15 - ₹40</b> per install.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">2.</span>
                                    <span>
                                        <strong>CodaShop Partner Link:</strong> Join CodaShop Affiliate directly or use free aggregators like <b>EarnKaro / vCommission</b>. Shorten your customized Codashop target link and paste it into the second slot to earn instantly on Top-Ups.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ff41] font-bold">3.</span>
                                    <span>
                                        <strong>Esports Finger Sleeves (Amazon):</strong> Register for free on Amazon Associates. Search any high-CTR "Gaming Finger Sleeves" on Amazon, get your tag-shortlink, and paste it into the third slot to earn <b>8% to 10%</b> share of any electronic product sale!
                                    </span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Configuration Inputs */}
                <div className="space-y-4">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-[#00ff41] border-b border-[#00ff41]/25 pb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#00ff41]" />
                        {language === 'hi' ? 'अपने एफिलिएट लिंक्स यहाँ कॉपी-पेस्ट करें :' : 'PASTE YOUR EARNING LINKS HERE :'}
                    </h4>

                    <div className="space-y-4 pt-1">
                        {deals.map(deal => {
                            const title = language === 'hi' ? deal.titleHi : deal.titleEn;
                            const desc = language === 'hi' ? deal.descHi : deal.descEn;
                            const clicks = clickStats[deal.id] || 0;

                            return (
                                <div key={deal.id} className="p-3.5 bg-black/40 border border-[#00ff41]/20 rounded relative hover:border-[#00ff41]/55 transition-colors group">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <div>
                                            <span className="text-[10px] bg-[#00ff41]/10 text-[#00ff41] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-bold mb-1 inline-block border border-[#00ff41]/10">
                                                {deal.provider}
                                            </span>
                                            <h5 className="text-sm font-bold text-white uppercase">{title}</h5>
                                        </div>
                                        <span className="text-[10px] font-mono text-[#00ff41]/60 shrink-0">
                                            {clicks} {clicks === 1 ? 'Click' : 'Clicks'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/60 mb-3">{desc}</p>
                                    
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={deal.link}
                                            onChange={(e) => handleLinkChange(deal.id, e.target.value)}
                                            placeholder="Insert your affiliate URL here"
                                            className="w-full bg-black/70 border border-[#00ff41]/30 p-2 text-xs font-mono text-white focus:border-[#00ff41] transition-colors outline-none rounded"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Control Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button 
                        onClick={handleSaveDeals}
                        className="flex-1 bg-[#00ff41] text-black hover:bg-black hover:text-[#00ff41] border border-[#00ff41] px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-colors rounded flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{language === 'hi' ? 'विज्ञापन सेटिंग्स सेव करें' : 'SAVE MONETIZATION CONFIG'}</span>
                    </button>
                    <button 
                        onClick={handleResetDeals}
                        className="bg-black border border-[#00ff41]/30 hover:border-[#00ff41] text-[#00ff41]/80 hover:text-white px-4 py-2.5 text-xs font-mono tracking-wider uppercase transition-colors rounded flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>{language === 'hi' ? 'रिसेट लिंक्स' : 'RESET LINKS'}</span>
                    </button>
                    {Object.values(clickStats).reduce((a, b) => a + b, 0) > 0 && (
                        <button 
                            onClick={() => setStatsResetConfirm(true)}
                            className="bg-red-950/20 border border-red-500/40 hover:border-red-500 text-red-400 px-4 py-2.5 text-xs font-mono tracking-wider uppercase transition-colors rounded flex items-center justify-center gap-1.5"
                        >
                            {language === 'hi' ? 'कमाई जीरो करें' : 'RESET STATS'}
                        </button>
                    )}
                </div>
            </fieldset>

            {/* About Section */}
            <fieldset className="border border-[#00ff41]/30 p-4 text-center rounded bg-black/20">
                <legend className="px-2 text-xl font-mono text-[#00ff41]">{t('settings_about')}</legend>
                <h3 className="text-2xl font-bold font-mono">trouble.exe</h3>
                <p className="text-[#00ff41]/80 font-mono">{t('settings_version')}</p>
                <p className="mt-2 text-white/80 max-w-xl mx-auto">{t('settings_about_desc')}</p>
            </fieldset>
            
            {feedback && (
                 <div className="text-center p-2 bg-black/50 border border-[#00ff41]/30 animate-pulse font-mono text-xs">
                    {feedback}
                </div>
            )}

            <ConfirmationDialog
                isOpen={isHistoryConfirmOpen}
                onClose={() => setIsHistoryConfirmOpen(false)}
                onConfirm={handleClearHistory}
                title={t('clear_history_confirm_title')}
            >
                 <p className="text-white font-sans">{t('clear_history_confirm_desc')}</p>
            </ConfirmationDialog>

            <ConfirmationDialog
                isOpen={isProfileConfirmOpen}
                onClose={() => setIsProfileConfirmOpen(false)}
                onConfirm={handleClearProfile}
                title={t('clear_profile_confirm_title')}
            >
                 <p className="text-white font-sans">{t('clear_profile_confirm_desc')}</p>
            </ConfirmationDialog>

            <ConfirmationDialog
                isOpen={statsResetConfirm}
                onClose={() => setStatsResetConfirm(false)}
                onConfirm={handleResetStats}
                title={language === 'hi' ? 'कमाई आंकड़े रीसेट करें?' : 'Reset Click Statistics?'}
            >
                 <p className="text-white font-sans">
                     {language === 'hi'
                         ? 'क्या आप वाकई क्लिक और कमाई के आंकड़ों को जीरो करना चाहते हैं? इतिहास और लिंक्स सुरक्षित रहेंगे।'
                         : 'Are you sure you want to clear your tracked click and commission statistics? Your links and cache will remain saved.'}
                 </p>
            </ConfirmationDialog>
        </section>
    );
};