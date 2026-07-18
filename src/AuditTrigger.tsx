/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Code2 } from 'lucide-react';
import { cn } from './lib/utils';

interface AuditTriggerProps {
  onClick: () => void;
  /** [INSPECT_PAYLOAD] by default; pass "AUDIT_PROVENANCE" for the alternate label. */
  label?: 'INSPECT_PAYLOAD' | 'AUDIT_PROVENANCE';
  className?: string;
}

/**
 * Replaces the old subtle "(Source)" info-icon with a professional
 * "transparency feature" — a bordered chip with a live pulse dot, a
 * data-centric icon, and a glassmorphism tooltip explaining exactly why
 * clicking it matters (proof the data is real), not just what it is.
 */
export function AuditTrigger({ onClick, label = 'INSPECT_PAYLOAD', className }: AuditTriggerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-[10px] uppercase tracking-wider transition-colors',
          'bg-white/5 border-white/10 text-muted hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400',
          className
        )}
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <Code2 size={11} className="shrink-0" />
        [{label}]
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-60 p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-emerald-500/20 shadow-2xl pointer-events-none"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 mb-1">
              Institutional Verifiability
            </p>
            <p className="text-[11px] leading-relaxed text-white/90 normal-case tracking-normal">
              View the raw SoSoValue JSON response for this specific signal.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
