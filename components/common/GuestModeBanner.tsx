
import React from 'react';

export const GuestModeBanner: React.FC = () => {
    return (
        <div className="bg-yellow-900/50 text-yellow-300 text-center p-2 text-sm border-b border-yellow-500/50">
            You are currently in **Guest Mode**. Results are examples. Go to Settings to enter an API key for live AI generation.
        </div>
    );
};
