/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Github,
  Twitter,
  Mail,
  Send,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { cn } from './lib/utils';
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from './lib/contract';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TECH_STACK = [
  { name: 'React 18 / Vite', role: 'Terminal Frontend' },
  { name: 'Python / Flask', role: 'Neural Consensus Backend' },
  { name: 'SoSoValue API', role: 'Institutional Data Layer' },
  { name: 'Ethereum Sepolia', role: 'Governance & Settlement' },
];

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative w-full sm:max-w-lg h-full bg-[#0A0B0D] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 grid place-items-center">
                  <FileText size={16} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">System Documentation</h2>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Methodology &amp; Whitepaper</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg grid place-items-center text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close documentation"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 font-mono">
              {/* Neural Consensus */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit size={14} className="text-accent" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Neural Consensus</h3>
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Every trade decision runs through a two-agent gate. The <span className="text-white">Alpha Hunter</span> synthesizes
                  live market narrative and news sentiment into a candidate signal. That signal is never executed directly —
                  it must first clear the <span className="text-white">Risk Auditor</span>, a deterministic, hard-coded Python
                  process that has no exposure to sentiment or hype. If the Auditor's rules aren't satisfied, the signal is
                  vetoed outright, regardless of how confident the Alpha Hunter's narrative is.
                </p>
              </section>

              {/* Risk Parameters */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={14} className="text-accent" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Risk Parameters</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Position Sizing</p>
                    <p className="text-[12px] text-slate-300">
                      Half-Kelly Criterion — position size is capped at half of the full Kelly-optimal fraction, trading some
                      theoretical growth rate for materially lower drawdown variance. This is a deliberate conservatism: full
                      Kelly sizing is mathematically optimal but too volatile for a treasury instrument.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-1">SoSoValue VETO Threshold</p>
                    <p className="text-[12px] text-slate-300">
                      If live SoSoValue ETF flow data shows net outflows exceeding <span className="text-danger">-$100M</span> in
                      a given window, the Risk Auditor forces a blanket VETO on new risk-on allocations — institutional
                      capital flight overrides any bullish sentiment signal from the Alpha Hunter.
                    </p>
                  </div>
                </div>
              </section>

              {/* Technical Stack */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} className="text-accent" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Technical Stack</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TECH_STACK.map((t) => (
                    <div key={t.name} className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                      <p className="text-[11px] font-bold text-white">{t.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-muted mt-0.5">{t.role}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-1 text-[10px] text-muted hover:text-accent transition-colors"
                >
                  View Execution Contract on Sepolia (Chain {SEPOLIA_CHAIN_ID})
                  <ExternalLink size={9} />
                </a>
              </section>

              {/* Founder / Contact */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Founder / Lead Architect</h3>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    Quant Architect focused on agentic treasury management and institutional liquidity protocols.
                  </p>
                  <div className="flex flex-col gap-2 text-[11px]">
                    <a
                      href="https://github.com/dollaryusuf/portfolio"
                      target="_blank"
                      rel="noreferrer"
                      className={cn(linkClass)}
                    >
                      <Github size={13} /> github.com/dollaryusuf
                    </a>
                    <a
                      href="https://x.com/yusluvda"
                      target="_blank"
                      rel="noreferrer"
                      className={cn(linkClass)}
                    >
                      <Twitter size={13} /> @yusluvda
                    </a>
                    <a
                      href="mailto:yusufabiodun009@gmail.com"
                      className={cn(linkClass)}
                    >
                      <Mail size={13} /> yusufabiodun009@gmail.com
                    </a>
                    <a
                      href="https://t.me/sosovault_bot"
                      target="_blank"
                      rel="noreferrer"
                      className={cn(linkClass)}
                    >
                      <Send size={13} /> Telegram Sentinel Bot
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const linkClass = "flex items-center gap-2 text-slate-400 hover:text-accent transition-colors";
