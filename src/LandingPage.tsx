/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import {
  Terminal,
  ShieldCheck,
  Zap,
  Radio,
  Database,
  ArrowUpRight,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { CONTRACT_ADDRESS, AUTHORIZED_AUDITOR, SEPOLIA_CHAIN_ID } from '../lib/contract';

interface LandingPageProps {
  /** Fired when "Launch Terminal" is clicked — parent should mount the ConnectionGate next. */
  onLaunch: () => void;
  /** Fired when "Enter as Guest" is clicked — skips the wallet handshake entirely, straight to View-Only dashboard. */
  onGuestMode: () => void;
}

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Neural Consensus',
    body:
      'Every rebalance is a debate, not a decree. An Alpha Hunter agent proposes narrative-driven allocations; a hard-coded Risk Auditor cross-examines the proposal against deterministic quant rules — liquidity, leverage, and sentiment-divergence guardrails — before anything is greenlit.',
  },
  {
    icon: Database,
    title: 'Institutional Truth',
    body:
      'Live-wired to the SoSoValue production API for spot-ETF flows, news sentiment, and sector performance. When the upstream feed is unreachable, a labeled simulated fallback keeps the terminal running — the source is always disclosed, never hidden.',
  },
  {
    icon: Radio,
    title: 'Global Sentinel',
    body:
      '24/7 monitoring doesn\u2019t stop when the browser tab closes. A Telegram-connected sentinel pushes /status, /alpha, and /risk checks straight to your phone, so governance events reach you the moment they happen.',
  },
];

export function LandingPage({ onLaunch, onGuestMode }: LandingPageProps) {
  return (
    <motion.div
      key="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-slate-950 overflow-y-auto"
    >
      {/* Ambient backdrop — lightweight CSS gradients + grid, no heavy assets */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      <div className="relative z-10 min-h-full flex flex-col">
        {/* Top bar / logo */}
        <div className="max-w-6xl w-full mx-auto px-6 pt-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 grid place-items-center">
            <Terminal size={16} className="text-emerald-500" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">
            SoSo-Vault <span className="text-emerald-500 font-mono">/</span> Core Intelligence
          </span>
        </div>

        {/* Hero */}
        <div className="max-w-4xl w-full mx-auto px-6 pt-20 pb-16 text-center flex-1 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-emerald-500/70 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-full mb-6"
          >
            ● Ethereum Sepolia &middot; Institutional Wave 2
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]"
          >
            SoSo-Vault: Neural Consensus <span className="text-emerald-500">Quant Terminal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed"
          >
            Bridging institutional liquidity data with neural-optimized risk management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <button
              onClick={onLaunch}
              className={[
                'relative px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm font-mono',
                'bg-emerald-500 text-black hover:bg-emerald-400 transition-all',
                'shadow-[0_0_45px_rgba(16,185,129,0.4)] flex items-center gap-3',
              ].join(' ')}
            >
              <span className="absolute inset-0 rounded-2xl border border-emerald-400/60 animate-ping" />
              <ShieldCheck size={18} className="relative z-10" />
              <span className="relative z-10">Launch Terminal</span>
              <ChevronRight size={18} className="relative z-10" />
            </button>

            <button
              onClick={onGuestMode}
              className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-white/50 transition-colors"
            >
              <Eye size={12} />
              Enter as Guest (View-Only Mode)
            </button>
          </motion.div>
        </div>

        {/* Technical Highlights */}
        <div className="max-w-6xl w-full mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mb-4">
                  <h.icon size={18} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2">{h.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{h.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Governance Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-white/5 bg-black/40"
        >
          <div className="max-w-6xl w-full mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest">
              <ShieldCheck size={12} className="text-emerald-500/70" />
              Governance &middot; Ethereum Sepolia (Chain {SEPOLIA_CHAIN_ID})
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 uppercase tracking-widest">Auditor Wallet</span>
                <a
                  href={`https://sepolia.etherscan.io/address/${AUTHORIZED_AUDITOR}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {AUTHORIZED_AUDITOR.slice(0, 6)}...{AUTHORIZED_AUDITOR.slice(-4)}
                  <ArrowUpRight size={9} />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 uppercase tracking-widest">Execution Contract</span>
                <a
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
                  <ArrowUpRight size={9} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
