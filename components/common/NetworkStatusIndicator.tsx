import React, { useState, useEffect } from 'react';

// Extend the Navigator interface to include the experimental connection property
declare global {
    interface Navigator {
        connection?: {
            effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
            addEventListener: (type: 'change', listener: EventListener) => void;
            removeEventListener: (type: 'change', listener: EventListener) => void;
        };
    }
}

export const NetworkStatusIndicator: React.FC = () => {
    const [isSlowNetwork, setIsSlowNetwork] = useState(false);

    useEffect(() => {
        const connection = navigator.connection;

        const updateNetworkStatus = () => {
            if (connection) {
                const type = connection.effectiveType;
                setIsSlowNetwork(type.includes('2g') || type === '3g');
            }
        };

        updateNetworkStatus(); // Initial check

        connection?.addEventListener('change', updateNetworkStatus);

        return () => {
            connection?.removeEventListener('change', updateNetworkStatus);
        };
    }, []);

    if (!isSlowNetwork) {
        return null;
    }

    return (
        <div className="hidden md:flex items-center gap-2 text-yellow-400" title="Slow network detected. AI responses may take longer.">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs">Slow Network</span>
        </div>
    );
};