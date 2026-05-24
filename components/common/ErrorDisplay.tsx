import React from 'react';
import { ErrorAnalysis } from '../../types';

interface ErrorDisplayProps {
    error: ErrorAnalysis;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    return (
        <div role="status" className="bg-red-900/50 border-2 border-red-500/70 p-4 space-y-3 panel-glass">
            <h3 className="text-2xl font-bold text-red-300">एक समस्या हुई!</h3>
            <p className="text-red-200 text-lg">{error.explanation}</p>
            <div>
                <h4 className="font-bold text-red-200">इसे ठीक करने के लिए आप यह प्रयास कर सकते हैं:</h4>
                <ul className="list-decimal list-inside mt-2 text-red-200 space-y-1">
                    {error.solutionSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};