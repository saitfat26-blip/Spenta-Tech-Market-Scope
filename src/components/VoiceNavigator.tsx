import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';

export const VoiceNavigator: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript.toLowerCase();
            handleCommand(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCommand = (cmd: string) => {
    setTranscript(`Command: ${cmd}`);
    
    // Simple command parsing
    if (cmd.includes('jump to') || cmd.includes('go to') || cmd.includes('open') || cmd.includes('show')) {
      if (cmd.includes('dual engine') || cmd.includes('engines')) {
        scrollTo('dual-engines');
      } else if (cmd.includes('financial') || cmd.includes('unit economics') || cmd.includes('valuation')) {
        scrollTo('unit-economics');
      } else if (cmd.includes('architecture') || cmd.includes('fusion stack') || cmd.includes('technical')) {
        scrollTo('fusion-stack');
      } else if (cmd.includes('roadmap') || cmd.includes('milestone')) {
        scrollTo('rd-roadmap');
      } else if (cmd.includes('value exchange') || cmd.includes('exchange')) {
        scrollTo('value-exchange');
      } else if (cmd.includes('contact') || cmd.includes('globe') || cmd.includes('global')) {
        scrollTo('dual-shore-globe');
      }
    }
    
    setTimeout(() => setTranscript(''), 3000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-cyan-400', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 3000);
    }
  };

  if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
      {transcript && (
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 text-cyan-400 font-mono text-xs px-3 py-1.5 rounded animate-pulse">
          {transcript}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isListening 
            ? 'bg-rose-500/20 text-rose-400 border-2 border-rose-500 animate-pulse' 
            : 'bg-slate-900 text-cyan-500 border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50'
        }`}
        title="Voice Navigation (Say 'Jump to Dual Engines')"
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>
    </div>
  );
};
