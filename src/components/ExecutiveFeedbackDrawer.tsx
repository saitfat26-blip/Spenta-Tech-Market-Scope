import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, CheckCircle2, Download, Filter, TrendingUp, Reply, Sparkles, Map } from 'lucide-react';
import { FeedbackComment, FeedbackReply, FeedbackPriority } from '../types';
import { D3SentimentChart } from './D3SentimentChart';
import { D3FeedbackHeatmap } from './D3FeedbackHeatmap';

interface ExecutiveFeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: FeedbackComment[];
  setComments: React.Dispatch<React.SetStateAction<FeedbackComment[]>>;
}

const AI_SUGGESTIONS = [
  "Can you provide more specific details on this?",
  "We've logged this for the Q3 strategy review.",
  "Great point, this aligns with our current roadmap.",
  "Let's schedule a deep dive on this next week."
];

export const ExecutiveFeedbackDrawer: React.FC<ExecutiveFeedbackDrawerProps> = ({ isOpen, onClose, comments, setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [section, setSection] = useState('General Question');
  const [newCommentPriority, setNewCommentPriority] = useState<FeedbackPriority>('General Feedback');
  const [filterCategory, setFilterCategory] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | FeedbackPriority>('All');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Math.random().toString(36).substring(7),
        text: newComment,
        section,
        priority: newCommentPriority,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        replies: []
      }
    ]);
    setNewComment('');
  };

  const handleReplySubmit = (commentId: string, e: React.FormEvent | null, forcedText?: string) => {
    if (e) e.preventDefault();
    const submitText = forcedText || replyText;
    if (!submitText.trim()) return;

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: Math.random().toString(36).substring(7),
              text: submitText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return c;
    }));
    setReplyText('');
    setReplyingTo(null);
  };

  const downloadJsonSummary = () => {
    const dataStr = JSON.stringify(comments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'executive-feedback-summary.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredComments = useMemo(() => {
    let result = comments;
    if (filterCategory !== 'All') {
      result = result.filter(c => c.section === filterCategory);
    }
    if (priorityFilter !== 'All') {
      result = result.filter(c => (c.priority || 'General Feedback') === priorityFilter);
    }
    return result;
  }, [comments, filterCategory, priorityFilter]);

  const mockSentimentData = useMemo(() => {
    return Array.from({length: 30}).map((_, i) => ({
      day: i,
      score: 50 + Math.random() * 40 + (i * 0.5) // Trending up slightly
    }));
  }, []);

  const heatmapData = useMemo(() => {
    const sections = ['General Question', 'Dual-Engine Model', 'Technical Architecture', 'Financials & Valuation', 'Milestones & Roadmap'];
    return sections.map(s => ({
      section: s,
      count: comments.filter(c => c.section === s).length
    }));
  }, [comments]);

  const renderCommentWithTags = (text: string) => {
    // Regex to match @[Section Name]
    const parts = text.split(/(@\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('@[') && part.endsWith(']')) {
        const sectionName = part.substring(2, part.length - 1);
        return (
          <span 
            key={i} 
            className="text-cyan-400 font-bold bg-cyan-500/10 px-1 rounded cursor-pointer hover:bg-cyan-500/20 transition-colors inline-block"
            onClick={() => {
              // Convert typical names to IDs or use standard scroll
              // In this app, many sections have specific IDs. If it doesn't map exactly, we'll try to find an H2 with that text.
              const el = Array.from(document.querySelectorAll('h2, h3, div[id]')).find(e => e.textContent?.includes(sectionName) || e.id.includes(sectionName.toLowerCase().replace(/\s/g, '-')));
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.classList.add('ring-2', 'ring-cyan-400', 'transition-all');
                setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 3000);
                onClose(); // close drawer when jumping to section
              }
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
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
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-slate-950 border-l border-slate-800 z-[100] shadow-2xl flex flex-col"
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

            <div className="flex-1 overflow-y-auto">
              
              {/* Sentiment Dashboard */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> OVERALL SENTIMENT
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    OPTIMISTIC
                  </div>
                </div>
                <div className="h-16 w-full">
                  <D3SentimentChart data={mockSentimentData} />
                </div>
                
                {/* Heatmap */}
                <div className="mt-4">
                  <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                    <Map className="w-3.5 h-3.5" /> COMMENT DENSITY MAP
                  </div>
                  <D3FeedbackHeatmap data={heatmapData} />
                </div>
                
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 mt-4 pb-2">
                  <button onClick={() => setPriorityFilter('All')} className={`text-[10px] font-mono px-2 py-1 rounded border ${priorityFilter === 'All' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>All</button>
                  <button onClick={() => setPriorityFilter('Critical Inquiry')} className={`text-[10px] font-mono px-2 py-1 rounded border ${priorityFilter === 'Critical Inquiry' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>Critical Inquiries</button>
                  <button onClick={() => setPriorityFilter('Strategic Suggestion')} className={`text-[10px] font-mono px-2 py-1 rounded border ${priorityFilter === 'Strategic Suggestion' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>Strategic Suggestions</button>
                  <button onClick={() => setPriorityFilter('General Feedback')} className={`text-[10px] font-mono px-2 py-1 rounded border ${priorityFilter === 'General Feedback' ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>General</button>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="flex-1 relative">
                    <Filter className="w-3 h-3 absolute left-2.5 top-2 text-slate-500" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-md py-1.5 pl-7 pr-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Categories</option>
                      <option value="General Question">General Question</option>
                      <option value="Dual-Engine Model">Dual-Engine Model</option>
                      <option value="Technical Architecture">Technical Architecture</option>
                      <option value="Financials & Valuation">Financials & Valuation</option>
                      <option value="Milestones & Roadmap">Milestones & Roadmap</option>
                    </select>
                  </div>
                  <button 
                    onClick={downloadJsonSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs font-mono text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {filteredComments.length === 0 ? (
                  <div className="text-center text-slate-500 font-mono text-xs mt-4">
                    No annotations found.
                  </div>
                ) : (
                  filteredComments.map((c) => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                        <div className="flex gap-2 items-center">
                          <span className="text-cyan-500 font-bold border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded">
                            {c.section}
                          </span>
                          {c.priority && c.priority !== 'General Feedback' && (
                            <span className={`font-bold border px-2 py-0.5 rounded ${c.priority === 'Critical Inquiry' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
                              {c.priority}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{c.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{renderCommentWithTags(c.text)}</p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400/70 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Recorded
                        </div>
                        <button 
                          onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                          className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                        >
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="mt-3 pl-3 border-l-2 border-slate-700 space-y-2">
                          {c.replies.map(r => (
                            <div key={r.id} className="bg-slate-950 p-2.5 rounded border border-slate-800">
                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mb-1">
                                <span className="text-indigo-400 font-bold">Spenta Team</span>
                                <span>{r.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-400">{r.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      {replyingTo === c.id && (
                        <div className="mt-3">
                          <form onSubmit={(e) => handleReplySubmit(c.id, e)} className="relative">
                            <textarea
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type a reply..."
                              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 pr-8 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none h-16"
                            />
                            <button
                              type="submit"
                              className="absolute right-2 bottom-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors disabled:opacity-50"
                              disabled={!replyText.trim()}
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </form>
                          {/* AI Suggestions */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <div className="text-[9px] font-mono text-slate-500 w-full flex items-center gap-1 mb-0.5"><Sparkles className="w-3 h-3 text-indigo-400" /> AI Suggestions</div>
                            {AI_SUGGESTIONS.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleReplySubmit(c.id, null, suggestion)}
                                className="text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded px-2 py-1 text-left transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Dual-Engine Model">Dual-Engine Model</option>
                    <option value="Technical Architecture">Technical Architecture</option>
                    <option value="Financials & Valuation">Financials & Valuation</option>
                    <option value="Milestones & Roadmap">Milestones & Roadmap</option>
                  </select>
                  <select
                    value={newCommentPriority}
                    onChange={(e) => setNewCommentPriority(e.target.value as FeedbackPriority)}
                    className={`w-1/3 bg-slate-950 border border-slate-700 rounded-lg p-2 text-[10px] font-mono focus:outline-none focus:border-cyan-500 transition-colors ${
                      newCommentPriority === 'Critical Inquiry' ? 'text-rose-400' : newCommentPriority === 'Strategic Suggestion' ? 'text-indigo-400' : 'text-slate-300'
                    }`}
                  >
                    <option value="General Feedback">General</option>
                    <option value="Strategic Suggestion">Strategic</option>
                    <option value="Critical Inquiry">Critical</option>
                  </select>
                </div>
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your question or annotation... Use @[Section Name] to tag."
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

