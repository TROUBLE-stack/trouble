import React, { useState } from 'react';

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // You could add an error state here if needed
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-black/50 border border-[#00ff41]/50 px-3 py-1 text-sm hover:bg-[#00ff41] hover:text-black transition-all duration-300"
      disabled={isCopied}
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
};
