/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import {
  ChevronRight,
  Eye,
  ArrowUpRight,
  Radio,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { CONTRACT_ADDRESS, AUTHORIZED_AUDITOR, SEPOLIA_CHAIN_ID } from './lib/contract';

interface LandingPageProps {
  /** Fired when "Launch Terminal" is clicked — parent should mount the ConnectionGate next. */
  onLaunch: () => void;
  /** Fired when "Enter as Guest" is clicked — skips the wallet handshake entirely, straight to View-Only dashboard. */
  onGuestMode: () => void;
}

const TELEMETRY = [
  { label: 'NETWORK_LATENCY', value: '< 40ms' },
  { label: 'SOURCE', value: 'SOSO_VALUE_PROD_API' },
  { label: 'GOVERNANCE_LOCK', value: 'ENABLED' },
];

const MODULES = [
  {
    index: '01',
    tag: 'ALPHA_HUNTER',
    title: 'Alpha Hunter',
    kind: 'LLM',
    body: 'Narrative Synthesis & Sentiment Scoring. Real-time extraction of high-conviction signals from the SoSoValue News Feed.',
  },
  {
    index: '02',
    tag: 'RISK_AUDITOR',
    title: 'Risk Auditor',
    kind: 'PYTHON',
    body: 'The Finality Gate. Mandatory VETO rules based on ETF Net Inflows and mathematical Position Sizing (Half-Kelly).',
  },
  {
    index: '03',
    tag: 'SENTINEL_MOBILITY',
    title: 'Sentinel Mobility',
    kind: 'TELEGRAM',
    body: '24/7 Global Oversight. Full-duplex Telegram integration for mobile alerts and on-chain trade execution.',
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
      className="fixed inset-0 z-40 bg-black overflow-y-auto"
    >
      {/* Background Intelligence layer: hairline grid + soft central mesh glow, no neon */}
      <div
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
      {/* Scanner sweep — reinforces the "live financial system" feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scanner pointer-events-none" />

      <div className="relative z-10 min-h-full flex flex-col">
        {/* Header — system breadcrumb, not a logo lockup */}
        <div className="max-w-6xl w-full mx-auto px-6 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 tracking-wide">
            <span className="text-emerald-500/80 border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 rounded">
              TERMINAL
            </span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">SO-SO</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-500">CORE_INTEL</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-600">
            <Cpu size={12} className="text-slate-600" />
            NODE::SEPOLIA-01
          </div>
        </div>

        {/* Hero — vertically centered, px-6 so nothing touches the screen edge on mobile */}
        <div className="max-w-4xl w-full mx-auto px-6 pt-16 pb-14 text-center flex-1 flex flex-col items-center justify-center">
          {/* Status badges */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-500 border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              LIVE
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 border border-white/10 px-2.5 py-1 rounded-full">
              v2.0.0-PROD
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-bold tracking-tighter leading-[1.08] font-sans bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent"
          >
            SOSO-VAULT: <span className="text-emerald-500">NEURAL CONSENSUS PROTOCOL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed"
          >
            Autonomous Treasury Intelligence for the Solo-Operator. Bridging SoSoValue Institutional
            Data with Hard-Coded Quant Governance.
          </motion.p>

          {/* Telemetry strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider"
          >
            {TELEMETRY.map((t, i) => (
              <span key={t.label} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-700 mr-4">&middot;</span>}
                {t.label}: <span className="text-emerald-500/80">{t.value}</span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-4"
          >
            {/* Ghost button — dark emerald, sharp 1px border, glows on hover rather than a solid block */}
            <button
              onClick={onLaunch}
              className={[
                'group relative px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-sm font-mono',
                'bg-emerald-500/5 text-emerald-400 border border-emerald-500/40',
                'hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300',
                'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300',
                'flex items-center gap-3',
              ].join(' ')}
            >
              <ShieldCheck size={16} className="relative z-10" />
              <span className="relative z-10">Launch Terminal</span>
              <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={onGuestMode}
              className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-white/50 transition-colors"
            >
              <Eye size={12} />
              Enter as Guest (View-Only Mode)
            </button>
          </motion.div>
        </div>

        {/* Feature modules — "Technical Data Sheet" cards, scrolling right-to-left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full overflow-hidden pb-16"
        >
          <div className="flex gap-5 w-max animate-[ticker-scroll_28s_linear_infinite] hover:[animation-play-state:paused]">
            {[...MODULES, ...MODULES, ...MODULES].map((m, i) => (
              <div
                key={`${m.title}-${i}`}
                className="relative overflow-hidden shrink-0 w-[320px] p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl animate-card-ambient hover:[animation-play-state:paused] hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] transition-colors"
                style={{ animationDelay: `${(i % MODULES.length) * 1.2}s` }}
              >
                {/* Occasional scan line, staggered per card so they don't all fire in sync */}
                <div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-card-scan pointer-events-none"
                  style={{ animationDelay: `${(i % MODULES.length) * 0.6}s` }}
                />

                <div className="flex items-center justify-between mb-5 text-[9px] font-mono uppercase tracking-widest text-slate-500">
                  <span>MODULE_{m.index} // {m.tag}</span>
                  <span className="text-emerald-500/60">{m.kind}</span>
                </div>

                {/* Sharp vector accent instead of a boxed icon avatar */}
                <div className="w-6 h-px bg-emerald-500/50 mb-3" />

                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 font-sans">{m.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audit Status Bar — command-line footer, the trust anchor of the whole page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="border-t border-white/10 bg-black"
        >
          <div className="max-w-6xl w-full mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest">
              <Radio size={11} className="text-emerald-500/70" />
              GOVERNANCE_NETWORK: ETH_SEPOLIA (CHAIN_{SEPOLIA_CHAIN_ID})
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-slate-400">
              <a
                href={`https://sepolia.etherscan.io/address/${AUTHORIZED_AUDITOR}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                AUDITOR_HANDSHAKE: [{AUTHORIZED_AUDITOR.slice(0, 4)}...{AUTHORIZED_AUDITOR.slice(-4)}]
                <ArrowUpRight size={9} />
              </a>
              <span className="text-slate-700">|</span>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                CONTRACT_SETTLEMENT: [{CONTRACT_ADDRESS.slice(0, 4)}...{CONTRACT_ADDRESS.slice(-4)}]
                <ArrowUpRight size={9} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
