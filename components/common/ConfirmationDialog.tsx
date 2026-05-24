import React from 'react';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="panel-glass p-6 max-w-lg w-full space-y-4 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-3xl font-bold">{title}</h3>
        <div className="text-lg text-[#00ff41]/80">
          {children}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            onClick={onClose} 
            className="w-full bg-black/20 border-2 border-[#00ff41]/50 text-[#00ff41]/70 px-4 py-2 uppercase tracking-widest text-lg hover:bg-[#00ff41]/20 hover:text-[#00ff41] focus:outline-none transition-all duration-300"
          >
            Cancel
          </button>
          <Button onClick={handleConfirm} className="w-full">
            Confirm Download
          </Button>
        </div>
      </div>
    </div>
  );
};
