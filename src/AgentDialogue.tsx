/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface AgentDialogueProps {
  alphaHunterLine: string;
  riskAuditorLine: string;
}

/**
 * Turns the abstract "two agents debate a trade" logic into a readable
 * two-line conversation, so a non-quant judge can follow the reasoning at
 * a glance rather than parsing a wall of technical text.
 */
export function AgentDialogue({ alphaHunterLine, riskAuditorLine }: AgentDialogueProps) {
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
      <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5">
        Consensus Dialogue
        <InfoTooltip>The debate between LLM market sentiment and Python risk auditing.</InfoTooltip>
      </h3>

      {/* Alpha Hunter — left side */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start gap-2.5"
      >
        <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 grid place-items-center shrink-0">
          <BrainCircuit size={13} className="text-accent" />
        </div>
        <div className="max-w-[85%]">
          <p className="text-[9px] font-mono uppercase tracking-widest text-accent/70 mb-1">Alpha Hunter</p>
          <div className="bg-accent/5 border border-accent/15 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
            <p className="text-[12px] text-white/90 leading-snug">{alphaHunterLine}</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Auditor — right side */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="flex items-start gap-2.5 flex-row-reverse"
      >
        <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 grid place-items-center shrink-0">
          <ShieldCheck size={13} className="text-amber-400" />
        </div>
        <div className="max-w-[85%]">
          <p className="text-[9px] font-mono uppercase tracking-widest text-amber-400/70 mb-1 text-right">Risk Auditor</p>
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl rounded-tr-sm px-3.5 py-2.5">
            <p className="text-[12px] text-white/90 leading-snug">{riskAuditorLine}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
