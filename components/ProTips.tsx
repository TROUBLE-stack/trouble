
import React, { useState } from 'react';
import { generateTips } from '../services/geminiService';
import { Button } from './common/Button';

export const ProTips: React.FC = () => {
  const [topic, setTopic] = useState<string>('close range combat');
  const [tips, setTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTips = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTips('');
    const generatedTips = await generateTips(topic);
    if (generatedTips.startsWith('Error:')) {
      setError(generatedTips);
    } else {
      setTips(generatedTips);
    }
    setIsLoading(false);
  };

  return (
    <section className="border-2 border-[#00ff41]/50 p-6 space-y-4">
      <h2 className="text-3xl uppercase tracking-wider">Gemini Pro Tips</h2>
      <div className="space-y-2">
        <label htmlFor="topic-input" className="block text-lg">Enter a topic for FF:</label>
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sniper strategy"
          className="w-full bg-black/50 border-2 border-[#00ff41] p-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#00ff41]"
        />
      </div>
      <Button onClick={handleGetTips} isLoading={isLoading}>
        Generate Intel
      </Button>
      
      {error && <p className="text-red-500 bg-red-900/50 border border-red-500 p-2">{error}</p>}
      
      <div className="mt-4 bg-black/50 border border-[#00ff41]/30 p-4 h-96 overflow-y-auto scrollbar-thin">
        {isLoading && <p>ANALYZING DATA...</p>}
        {tips && (
           <pre className="whitespace-pre-wrap break-words text-base">{tips}</pre>
        )}
        {!tips && !isLoading && (
            <p className="text-[#00ff41]/60">Your generated tips will appear here. Enter a topic and click "Generate Intel" to begin.</p>
        )}
      </div>
    </section>
  );
};
