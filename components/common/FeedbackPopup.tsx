import React from 'react';
import { useFeedback } from '../../contexts/FeedbackContext';

export const FeedbackPopup: React.FC = () => {
    const { feedbackMessage, isVisible } = useFeedback();

    if (!feedbackMessage) {
        return null;
    }

    return (
        <div 
            role="status"
            aria-live="polite"
            className={`fixed bottom-5 right-5 z-50 transition-all duration-500 transform ${
                isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}
        >
            <div className="panel-glass p-4 border-2 border-[#00ff41] shadow-[0_0_25px_rgba(0,255,65,0.7)]">
                <p className="text-lg font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {feedbackMessage}
                </p>
            </div>
        </div>
    );
};
