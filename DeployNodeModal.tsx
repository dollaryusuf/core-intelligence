/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Terminal, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface RiskAuditFeedProps {
  isVetoed: boolean;
  etfFlow: number;
  kellySize?: number;
  loading?: boolean;
}

interface AuditStep {
  id: string;
  text: string;
  result: string;
  tone: 'accent' | 'amber' | 'danger';
}

export function RiskAuditFeed({ isVetoed, etfFlow, kellySize = 31.67, loading = false }: RiskAuditFeedProps) {
  const steps: AuditStep[] = [
    {
      id: 'flows',
      text: `Analyzing SoSoValue ETF Flows (${etfFlow >= 0 ? '+' : ''}$${etfFlow.toFixed(1)}M)...`,
      result: isVetoed ? 'FLAGGED' : 'OK',
      tone: isVetoed ? 'danger' : 'accent',
    },
    {
      id: 'kelly',
      text: 'Calculating Half-Kelly Position Size...',
      result: isVetoed ? '0.0x' : '0.5x',
      tone: 'amber',
    },
    {
      id: 'veto',
      text: 'Checking VETO conditions...',
      result: isVetoed ? 'VETOED' : 'CLEAR',
      tone: isVetoed ? 'danger' : 'accent',
    },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (loading) return;
    const timers = steps.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 450 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVetoed, etfFlow, loading]);

  const toneClasses: Record<AuditStep['tone'], string> = {
    accent: 'text-accent bg-accent/10 border-accent/30',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    danger: 'text-danger bg-danger/10 border-danger/30',
  };

  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <Shield size={14} className="text-amber-400" />
          Live Risk Audit Feed
        </h3>
        <span className={cn(
          "text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-tighter font-mono flex items-center gap-1",
          isVetoed ? "border-danger/40 text-danger bg-danger/5" : "border-accent/40 text-accent bg-accent/5"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isVetoed ? "bg-danger" : "bg-accent")} />
          Python Auditor Online
        </span>
      </div>

      <div className="space-y-2 font-mono relative z-10">
        {loading ? (
          <div className="text-[11px] text-muted/70 uppercase tracking-widest py-4 text-center animate-pulse">
            Booting Risk Engine...
          </div>
        ) : (
          <AnimatePresence>
            {steps.slice(0, visibleCount).map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-black/30 border border-white/5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal size={11} className="text-muted shrink-0" />
                  <span className="text-[10px] text-white/80 truncate">
                    Step {idx + 1}: {step.text}
                  </span>
                </div>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0",
                  toneClasses[step.tone]
                )}>
                  [{step.result}]
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {!loading && visibleCount >= steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 pt-2 text-[9px] uppercase tracking-widest text-muted"
          >
            <CheckCircle2 size={11} className={isVetoed ? "text-danger" : "text-accent"} />
            Audit trail finalized — hard-coded Python rules, zero discretion.
          </motion.div>
        )}
      </div>
    </div>
  );
}
