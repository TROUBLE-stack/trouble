import React, { useState, useEffect } from 'react';
import { generateTips, analyzeErrorAndSuggestSolution } from '../services/geminiService';
import { Button } from './common/Button';
import { ErrorDisplay } from './common/ErrorDisplay';
import { ErrorAnalysis, HistoryType } from '../types';
import { addHistoryItem, getCache, setCache, getCacheKey } from '../utils/storage';
import { CopyToClipboardButton } from './common/CopyToClipboardButton';
import { LoadingOverlay } from './common/LoadingOverlay';
import { AdBanner } from './common/AdBanner';
import { useFeedback } from '../contexts/FeedbackContext';

const LOADING_MESSAGES = [
    "Querying elite gamer knowledge base...",
    "Analyzing weapon meta for optimal strategy...",
    "Breaking down advanced headshot mechanics...",
    "Compiling actionable pro tips...",
];

export const ProTips: React.FC = () => {
  const [topic, setTopic] = useState<string>('close range headshot');
  const [tips, setTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorAnalysis | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const { showFeedback } = useFeedback();

  // Load from cache on topic change
  useEffect(() => {
    const cacheKey = getCacheKey('pro-tips', topic);
    const cachedTips = getCache<string>(cacheKey);
    if (cachedTips) {
        setTips(cachedTips);
    } else {
        setTips(''); // Clear tips if nothing is cached for the new topic
    }
  }, [topic]);

  const handleGetTips = async () => {
    if (!topic.trim()) {
        setError({
            explanation: "कृपया एक विषय चुनें।",
            solutionSteps: ["टिप्स जेनरेट करने के लिए ड्रॉपडाउन से एक रेंज चुनें।"]
        });
        return;
    }
    setIsLoading(true);
    setError(null);
    // Do not clear tips, keep showing cached version while loading

    let messageIndex = 0;
    setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    const intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 1500);

    try {
        const generatedTips = await generateTips(topic);
        setTips(generatedTips);
        
        // Save to cache and history
        const cacheKey = getCacheKey('pro-tips', topic);
        setCache(cacheKey, generatedTips);
        addHistoryItem({
            type: HistoryType.PRO_TIP,
            data: generatedTips,
            timestamp: Date.now(),
            context: topic
        });

        showFeedback('Pro Tips Updated Successfully!');
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

  return (
    <section className="panel-glass p-6 space-y-6 max-w-4xl mx-auto">
      <LoadingOverlay isLoading={isLoading} message={loadingMessage}>
          <AdBanner key="protips-loading-ad" />
      </LoadingOverlay>

      <h2 className="text-3xl uppercase tracking-wider">Tips for Headshot</h2>
      <div className="space-y-2">
        <label htmlFor="topic-select" className="block text-lg">Select a headshot range:</label>
        <select
            id="topic-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="custom-input custom-select"
        >
            <option value="close range headshot">Close Range Headshot</option>
            <option value="extreme close range headshot">Extreme Close Range Headshot</option>
            <option value="medium range headshot">Medium Range Headshot</option>
            <option value="long range headshot">Long Range Headshot</option>
            <option value="extreme long range headshot">Extreme Long Range Headshot</option>
        </select>
      </div>
      <Button onClick={handleGetTips} isLoading={isLoading}>
        {tips && !isLoading ? 'Refresh Tips' : 'Generate Tips'}
      </Button>
      
      {error && <ErrorDisplay error={error} />}
      
      <div 
        aria-live="polite"
        className="bg-black/50 border border-[#00ff41]/30 p-4 min-h-[24rem] overflow-y-auto scrollbar-thin relative"
      >
        {tips && (
           <>
            <CopyToClipboardButton textToCopy={tips} />
            <pre className="whitespace-pre-wrap break-words text-base font-sans">{tips}</pre>
           </>
        )}
        {!tips && !isLoading && !error && (
            <p className="text-[#00ff41]/60">Your generated tips will appear here. Select a range and click "Generate Tips" to begin.</p>
        )}
      </div>
    </section>
  );
};