import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ExecutiveFeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  text: string;
  section: string;
  timestamp: string;
}

export const ExecutiveFeedbackDrawer: React.FC<ExecutiveFeedbackDrawerProps> = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [section, setSection] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Math.random().toString(36).substring(7),
        text: newComment,
        section,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setNewComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 z-[90] backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-slate-950 border-l border-slate-800 z-[100] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-2 text-cyan-400 font-heading font-bold">
                <MessageSquare className="w-5 h-5" />
                Executive Feedback
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center text-slate-500 font-mono text-xs mt-10">
                  No annotations yet. Leave a comment or question for the Spenta team.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span className="text-cyan-500 font-bold border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {c.section}
                      </span>
                      <span>{c.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300">{c.text}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400/70 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Recorded for Async Review
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSubmit} className="space-y-3">
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="General">General Question</option>
                  <option value="Dual-Engine">Dual-Engine Model</option>
                  <option value="Financials">Financials & Valuation</option>
                  <option value="Milestones">Milestones & Roadmap</option>
                </select>
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your question or annotation..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pr-10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors resize-none h-24"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bottom-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors disabled:opacity-50"
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
