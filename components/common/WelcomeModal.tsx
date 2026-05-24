
import React from 'react';
import { Button } from './Button';

interface WelcomeModalProps {
    onKeySaved: () => void;
    onGuestMode: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onKeySaved }) => {

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="panel-glass p-6 max-w-lg w-full space-y-6 text-center">
                <h2 className="text-4xl uppercase tracking-wider">Welcome to trouble.exe</h2>
                <p className="text-[#00ff41]/80 text-lg">
                    AI-powered assistant for FF gamers. Ready to optimize?
                </p>
                <div className="space-y-3">
                     <Button onClick={onKeySaved} className="w-full text-xl py-3">
                        Continue
                     </Button>
                     <p className="text-sm text-[#00ff41]/60">The application is configured to securely access the Gemini API.</p>
                </div>
            </div>
        </div>
    );
};