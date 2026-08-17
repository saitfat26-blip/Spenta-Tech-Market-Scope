import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Clock, Target, ArrowRight } from 'lucide-react';

interface Sprint {
  id: string;
  phase: string;
  name: string;
  progress: number;
  projectedDate: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  details: string[];
}

const SPRINTS: Sprint[] = [
  {
    id: 's1',
    phase: 'R&D',
    name: 'Core Architecture Engine',
    progress: 100,
    projectedDate: 'Q1 2026',
    status: 'completed',
    details: ['Spanner DB Integration', 'Global state management', 'Security auditing']
  },
  {
    id: 's2',
    phase: 'R&D',
    name: 'WebXR Spatial Visualizer',
    progress: 85,
    projectedDate: 'Q3 2026',
    status: 'in-progress',
    details: ['Device-agnostic rendering pipeline', 'Multi-user real-time sync', 'Latency optimization']
  },
  {
    id: 's3',
    phase: 'Market Launch',
    name: 'Enterprise Beta Release',
    progress: 30,
    projectedDate: 'Q4 2026',
    status: 'in-progress',
    details: ['Onboarding top 10 waitlist partners', 'Compliance SOC2 certification', 'API Documentation']
  },
  {
    id: 's4',
    phase: 'Market Launch',
    name: 'Public GA & Scaling',
    progress: 0,
    projectedDate: 'Q1 2027',
    status: 'upcoming',
    details: ['Self-serve signup flow', 'Automated billing', 'Global CDN expansion']
  }
];

export const MilestonesSection: React.FC = () => {
  return (
    <section id="milestones" className="py-24 bg-[#0a0f16] relative border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold mb-4"
          >
            <Target className="w-4 h-4" />
            MAJOR MILESTONES
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Strategic Sprints & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Execution Tracking</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Real-time tracking of R&D and Market Launch phases, ensuring capital efficiency and predictable delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SPRINTS.map((sprint, index) => (
            <motion.div
              key={sprint.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
            >
              {sprint.status === 'in-progress' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              )}
              {sprint.status === 'completed' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded ${sprint.phase === 'R&D' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {sprint.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-200">{sprint.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    <Calendar className="w-3.5 h-3.5" />
                    {sprint.projectedDate}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 mb-4">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className={sprint.status === 'completed' ? 'text-emerald-400' : sprint.status === 'in-progress' ? 'text-cyan-400' : 'text-slate-500'}>
                    {sprint.status === 'completed' ? 'Completed' : sprint.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                  </span>
                  <span className="text-slate-300 font-bold">{sprint.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${sprint.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      sprint.status === 'completed' ? 'bg-emerald-500' : 
                      sprint.status === 'in-progress' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 
                      'bg-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <ul className="space-y-2">
                  {sprint.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                      {sprint.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      ) : sprint.status === 'in-progress' && i === 0 ? (
                        <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                      )}
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
