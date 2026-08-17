import React, { useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';

interface CopyShareButtonProps {
  sectionId: string;
  sectionTitle: string;
  className?: string;
  variant?: 'compact' | 'pill' | 'badge';
}

export const CopyShareButton: React.FC<CopyShareButtonProps> = ({
  sectionId,
  sectionTitle,
  className = '',
  variant = 'compact'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    url.hash = sectionId;

    // Use clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url.toString());
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url.toString();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (variant === 'pill') {
    return (
      <button
        onClick={handleCopy}
        title={`Copy deep link to ${sectionTitle}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all border cursor-pointer ${
          copied
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/20'
            : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/40'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-emerald-300">Link Copied</span>
          </>
        ) : (
          <>
            <Link2 className="w-3 h-3 text-cyan-400" />
            <span>Share Section</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        onClick={handleCopy}
        title={`Copy deep link to ${sectionTitle}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all border cursor-pointer ${
          copied
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
            : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/30'
        } ${className}`}
      >
        {copied ? <Check className="w-2.5 h-2.5" /> : <Share2 className="w-2.5 h-2.5 text-cyan-400" />}
        <span>{copied ? 'COPIED' : 'SHARE'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copy deep link to ${sectionTitle}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border cursor-pointer group ${
        copied
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80'
          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/40'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400 animate-in zoom-in-50 duration-200" />
          <span className="text-[11px] font-bold text-emerald-300">Deep Link Copied</span>
        </>
      ) : (
        <>
          <Link2 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[11px]">Copy Link</span>
        </>
      )}
    </button>
  );
};
