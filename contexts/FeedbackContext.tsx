import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface FeedbackContextType {
  feedbackMessage: string | null;
  isVisible: boolean;
  showFeedback: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const showFeedback = useCallback((message: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setFeedbackMessage(message);
    setIsVisible(true);

    const newTimeoutId = window.setTimeout(() => {
      setIsVisible(false);
      // Allow fade-out animation to complete before clearing the message
      setTimeout(() => setFeedbackMessage(null), 500); 
    }, 3000);

    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  return (
    <FeedbackContext.Provider value={{ feedbackMessage, isVisible, showFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
