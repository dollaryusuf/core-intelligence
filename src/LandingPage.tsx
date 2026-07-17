/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Eye,
  ArrowUpRight,
  Radio,
  ShieldCheck,
  Github,
  Twitter,
  Send,
  LifeBuoy,
  FileText,
  Compass,
} from 'lucide-react';
import { CONTRACT_ADDRESS, AUTHORIZED_AUDITOR, SEPOLIA_CHAIN_ID } from './lib/contract';
import { FloatingHeader, TickerItem as HeaderTickerItem } from './FloatingHeader';
import { useLiveTicker } from './useLiveTicker';
import { TickerPayload } from './lib/aiService';
import { MethodologyModal } from './MethodologyModal';
import { InfoTooltip } from './InfoTooltip';

interface LandingPageProps {
  /** Fired when "Launch Terminal" is clicked — parent should mount the ConnectionGate next. */
  onLaunch: () => void;
  /** Fired when "Enter as Guest" is clicked — skips the wallet handshake entirely, straight to View-Only dashboard. */
  onGuestMode: () => void;
  /** Fired every time a fresh ticker payload is fetched, so App.tsx can
   * stash it in the Evidence Vault — same wiring as the Dashboard's
   * MarketTicker, so evidence syncs regardless of which screen fetched it. */
  onEvidence?: (payload: TickerPayload) => void;
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

const PROTOCOL_STEPS = [
  {
    op: 'OP_01',
    title: 'AUDITOR_HANDSHAKE',
    body: 'Authorize your EVM wallet at the gateway to unlock terminal access. Every execution is cryptographically tied to this authorized auditor address.',
  },
  {
    op: 'OP_02',
    title: 'NEURAL_SYNTHESIS',
    body: 'Navigate to the Strategy tab. Fetch 7 days of SoSoValue telemetry. The Alpha Hunter proposes, the Risk Auditor validates.',
  },
  {
    op: 'OP_03',
    title: 'ON-CHAIN_FINALITY',
    body: 'Approve rebalances via the Execution Hub. Watch your trade settle on Ethereum Sepolia with a verifiable transaction hash.',
  },
];

const TERMINAL_MAP = [
  { tag: '[01]', name: 'OVERVIEW', desc: 'Real-time market heartbeat & SoSoValue telemetry.' },
  { tag: '[02]', name: 'STRATEGY', desc: 'Neural report generation & Risk Auditor VETO checks.', hasVetoTooltip: true },
  { tag: '[03]', name: 'EMPIRE', desc: 'Global AUM impact & multi-vault synchronization.' },
  { tag: '[04]', name: 'EVIDENCE', desc: 'Raw JSON payloads & Etherscan audit ledger.' },
];

export function LandingPage({ onLaunch, onGuestMode, onEvidence }: LandingPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const { items } = useLiveTicker(onEvidence);

  const headerTickerItems: HeaderTickerItem[] | undefined = items.length > 0
    ? items.map((item) => ({
        label: item.label === 'SOSO_SENTIMENT' ? 'SENTIMENT' : `${item.label}/USD`,
        value: item.label === 'SOSO_SENTIMENT'
          ? `${item.price.toFixed(0)}% ${item.change24h >= 0 ? 'BULLISH' : 'BEARISH'}`
          : `$${item.price.toLocaleString(undefined, { maximumFractionDigits: item.price < 10 ? 2 : 0 })}`,
        positive: item.change24h >= 0,
      }))
    : undefined;

  return (
    <motion.div
      key="landing-page"
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-black overflow-y-auto"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scanner pointer-events-none" />

      <FloatingHeader scrollContainerRef={scrollRef} tickerItems={headerTickerItems} />

      {/* pb-12 clears the fixed sticky Auditor/Contract bar at the very bottom */}
      <div className="relative z-10 min-h-full flex flex-col pb-12">

        {/* ============================================================ */}
        {/* SECTION 1 — HERO. The hook.                                   */}
        {/* ============================================================ */}
        <div className="max-w-4xl w-full mx-auto px-6 pt-32 pb-14 text-center flex-1 flex flex-col items-center justify-center">
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
            SOSO-VAULT: <span className="text-emerald-500">NEURAL CONSENSUS PROTOCOL</span>{' '}
            <span className="inline-flex align-middle -translate-y-2">
              <InfoTooltip>The debate between LLM market sentiment and Python risk auditing.</InfoTooltip>
            </span>
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
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">
              (Restricted access: Logic observation only)
            </span>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2 — SYSTEM OPERATIONS. How to act.                    */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl w-full mx-auto px-6 pb-16"
        >
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-500/60">Operational Blueprint</span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-2 tracking-tight">System Operations — How to Navigate the Protocol</h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div className="hidden md:block absolute top-[19px] left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-emerald-500/10 via-emerald-500/50 to-emerald-500/10" />
            {PROTOCOL_STEPS.map((step, i) => (
              <div key={step.op} className="relative flex flex-col items-center md:items-start text-center md:text-left">
                <div className="relative z-10 w-10 h-10 rounded-full bg-black border border-emerald-500/40 grid place-items-center mb-4 font-mono text-[11px] font-bold text-emerald-400 shrink-0">
                  {i + 1}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500/60 mb-1">[{step.op}]</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-2 font-mono">{step.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed max-w-xs">{step.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 3 — THE NEURAL CORE. The tech behind it.              */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full pb-16"
        >
          <div className="text-center mb-8 px-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-500/60">
              [ SYSTEM_ARCHITECTURE // THE_NEURAL_CORE ]
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-5 w-max animate-[ticker-scroll_28s_linear_infinite] hover:[animation-play-state:paused]">
              {[...MODULES, ...MODULES, ...MODULES].map((m, i) => (
                <div
                  key={`${m.title}-${i}`}
                  className="relative overflow-hidden shrink-0 w-[320px] p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl animate-card-ambient hover:[animation-play-state:paused] hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] transition-colors"
                  style={{ animationDelay: `${(i % MODULES.length) * 1.2}s` }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-card-scan pointer-events-none"
                    style={{ animationDelay: `${(i % MODULES.length) * 0.6}s` }}
                  />

                  <div className="flex items-center justify-between mb-5 text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    <span>MODULE_{m.index} // {m.tag}</span>
                    <span className="text-emerald-500/60">{m.kind}</span>
                  </div>

                  <div className="w-6 h-px bg-emerald-500/50 mb-3" />

                  <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 font-sans">{m.title}</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    {m.body}
                    {m.tag === 'RISK_AUDITOR' && (
                      <span className="inline-flex align-middle ml-1">
                        <InfoTooltip>Mathematical risk model that optimizes trade size for maximum growth.</InfoTooltip>
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 4 — TERMINAL MAP. Where to go, the final reference    */}
        {/* before the footer.                                            */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl w-full mx-auto px-6 pb-16"
        >
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Compass size={12} className="text-emerald-500/70" />
              Terminal Map
            </h3>
            <div className="space-y-3">
              {TERMINAL_MAP.map((t) => (
                <div key={t.tag} className="flex items-start gap-3 text-[12px] font-mono">
                  <span className="text-emerald-400 font-bold shrink-0">{t.tag}</span>
                  <span className="text-white font-bold shrink-0">{t.name}:</span>
                  <span className="text-slate-400 flex-1">
                    {t.desc}
                    {t.hasVetoTooltip && (
                      <span className="inline-flex align-middle ml-1">
                        <InfoTooltip>Hard-coded Python rules that block trades during institutional outflows.</InfoTooltip>
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SECTION 5 — INSTITUTIONAL FOOTER. About / Whitepaper / Contact */}
        {/* ============================================================ */}
        <footer className="border-t border-white/5 bg-black">
          <div className="max-w-6xl w-full mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <nav className="flex flex-col gap-2.5">
              <span className="text-[9px] uppercase tracking-widest text-slate-600 mb-0.5">Protocol</span>
              <button
                onClick={() => setShowMethodology(true)}
                className="text-left text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <FileText size={11} /> About SoSo-Vault
              </button>
              <button
                onClick={() => setShowMethodology(true)}
                className="text-left text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <FileText size={11} /> Whitepaper (Methodology)
              </button>
              <a
                href="https://github.com/dollaryusuf/core-intelligence"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <Github size={11} /> GitHub Repository
              </a>
            </nav>

            <nav className="flex flex-col gap-2.5">
              <span className="text-[9px] uppercase tracking-widest text-slate-600 mb-0.5">Reach</span>
              <a
                href="mailto:yusufabiodun009@gmail.com"
                className="text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <LifeBuoy size={11} /> Technical Support
              </a>
              <a
                href="https://x.com/yusluvda"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <Twitter size={11} /> Twitter / X
              </a>
              <a
                href="https://t.me/sosovault_bot"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <Send size={11} /> Telegram Sentinel
              </a>
            </nav>
          </div>
        </footer>
      </div>

      {/* Sticky Auditor / Contract status bar — always visible at the
          bottom of the viewport, the trust anchor for the whole page. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/90 backdrop-blur-md"
      >
        <div className="max-w-6xl w-full mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono">
          <div className="flex items-center gap-2 text-slate-500 uppercase tracking-widest">
            <Radio size={11} className="text-emerald-500/70" />
            GOVERNANCE_NETWORK: ETH_SEPOLIA (CHAIN_{SEPOLIA_CHAIN_ID})
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-slate-400">
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

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
    </motion.div>
  );
}
