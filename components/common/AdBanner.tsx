import React, { useState, useEffect } from 'react';
import { getAffiliateDeals, AffiliateDeal, trackAffiliateClick } from '../../utils/storage';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sparkles, Trophy, ExternalLink, ShieldCheck, Zap, Award } from 'lucide-react';

export const AdBanner: React.FC = () => {
    const { language } = useLanguage();
    const [deals, setDeals] = useState<AffiliateDeal[]>([]);

    useEffect(() => {
        const loadedDeals = getAffiliateDeals();
        setDeals(loadedDeals);
    }, []);

    const isHindi = language === 'hi';

    // Helper to ensure link is absolute
    const getFormattedLink = (url: string) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    if (deals.length === 0) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto w-full px-4 sm:px-0" id="affiliate-ads-container">
            {/* Header banner indicating sponsored deals */}
            <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-[#00ff41]/60 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00ff41] animate-pulse" />
                    {isHindi ? "// विशेष ई-स्पोर्ट्स पार्टनर डील्स //" : "// VERIFIED ESPORTS SPONSORS & PARTNERS //"}
                </span>
                <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/30 px-2 py-0.5 border border-yellow-500/30 rounded flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {isHindi ? "क्लिक करके कमाएं" : "SUPPORT BY CLICKING"}
                </span>
            </div>

            {/* Grid of highly polished native aggregate sponsor ads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deals.map((deal) => {
                    const title = isHindi ? deal.titleHi : deal.titleEn;
                    const desc = isHindi ? deal.descHi : deal.descEn;
                    const cleanProvider = deal.provider.split(':')[1]?.trim() || deal.provider;

                    return (
                        <section 
                            key={deal.id}
                            id={`ad-deal-${deal.id}`} 
                            className="bg-black/80 hover:bg-black/95 border-2 border-[#00ff41]/25 hover:border-[#00ff41] rounded p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(0,255,65,0.25)] group"
                            aria-label={`Sponsor: ${cleanProvider}`}
                        >
                            {/* Decorative cyber grid overlay */}
                            <div className="absolute top-0 right-0 p-1 opacity-[0.03] text-[9px] font-mono select-none pointer-events-none text-right">
                                EXT-01<br/>SVR-X
                            </div>

                            <div className="space-y-3">
                                {/* Sponsor Header Badges */}
                                <div className="flex justify-between items-center border-b border-[#00ff41]/10 pb-2">
                                    <span className="text-[9px] font-mono uppercase bg-[#00ff41]/10 text-[#00ff41] px-1.5 py-0.5 border border-[#00ff41]/20 rounded font-bold">
                                        {cleanProvider}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Award className="w-3 h-3 text-yellow-500" />
                                        <span className="text-[9px] font-mono text-white/50 lowercase">active</span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#00ff41] transition-colors leading-tight min-h-[40px] flex items-center">
                                        {title}
                                    </h4>
                                    <p className="text-white/70 text-xs font-sans font-medium leading-relaxed line-clamp-3">
                                        {desc}
                                    </p>
                                </div>
                            </div>

                            {/* Verification Tag & Action Button */}
                            <div className="mt-4 pt-3 border-t border-[#00ff41]/10 flex flex-col gap-2">
                                <div className="flex items-center gap-1.5 text-[10px] text-[#00ff41]/80 font-mono">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#00ff41] shrink-0" />
                                    <span>{isHindi ? "100% वेरिफाइड एवं सुरक्षित" : "100% Safe & Verified"}</span>
                                </div>

                                <a 
                                    id={`btn-ad-link-${deal.id}`}
                                    href={getFormattedLink(deal.link)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => trackAffiliateClick(deal.id)}
                                    className="w-full text-center inline-flex items-center justify-center gap-1.5 bg-[#00ff41] hover:bg-black text-black hover:text-[#00ff41] border border-[#00ff41] py-2 px-3 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm rounded-sm"
                                >
                                    <span>{isHindi ? "अभी प्राप्त करें" : "CLAIM OFFER"}</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};
