/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Floating "Neural Glass" header — shared control bar for both the Landing
 * Page and the Dashboard. Drop it in once per screen and pass a ref to
 * whatever element actually scrolls (the page uses an inner
 * `overflow-y-auto` container rather than window scroll, so useScroll needs
 * to be pointed at that container explicitly).
 *
 * Usage:
 *   const scrollRef = useRef<HTMLDivElement>(null);
 *   <div ref={scrollRef} className="fixed inset-0 overflow-y-auto">
 *     <FloatingHeader scrollContainerRef={scrollRef} />
 *     ...page content...
 *   </div>
 */
import { useRef, type RefObject } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';

export interface TickerItem {
  label: string;
  value: string;
  positive?: boolean;
}

interface FloatingHeaderProps {
  /** Ref to the actual scrolling element. Falls back to window scroll if omitted. */
  scrollContainerRef?: RefObject<HTMLElement>;
  /** Live price/sentiment strip. Sensible demo defaults are provided so this
   *  renders correctly even before real data is wired in. */
  tickerItems?: TickerItem[];
  /** e.g. "NODE::SEPOLIA-01" — shown as a secondary breadcrumb on wide screens. */
  nodeLabel?: string;
  versionTag?: string;
}

const DEFAULT_TICKER: TickerItem[] = [
  { label: 'BTC/USD', value: '$64,512', positive: true },
  { label: 'ETH/USD', value: '$3,481', positive: true },
  { label: 'SOL/USD', value: '$154.8', positive: false },
  { label: 'SENTIMENT', value: '72% BULLISH', positive: true },
  { label: 'ETF FLOW', value: '+$152.4M', positive: true },
];

export function FloatingHeader({
  scrollContainerRef,
  tickerItems = DEFAULT_TICKER,
  nodeLabel = 'NODE::SEPOLIA-01',
  versionTag = 'V2.0.0-PROD',
}: FloatingHeaderProps) {
  const fallbackRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll(
    scrollContainerRef ? { container: scrollContainerRef } : { container: fallbackRef }
  );

  // Shrink + darken over the first 160px of scroll. Clamped via useTransform
  // so it never overshoots past that range.
  const paddingY = useTransform(scrollY, [0, 160], [18, 8]);
  const bgOpacity = useTransform(scrollY, [0, 160], [0.4, 0.82]);
  const scale = useTransform(scrollY, [0, 160], [1, 0.94]);
  const titleSize = useTransform(scrollY, [0, 160], [15, 13]);

  return (
    <motion.div
      style={{ scale }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <motion.div
        style={{
          paddingTop: paddingY,
          paddingBottom: paddingY,
          backgroundColor: useTransform(bgOpacity, (o) => `rgba(0,0,0,${o})`),
        }}
        className="pointer-events-auto relative w-[95%] max-w-7xl rounded-full border border-white/10 backdrop-blur-xl shadow-2xl px-6 flex items-center justify-between gap-4 overflow-hidden transition-colors"
      >
        {/* Neural pulse border — a 1px emerald glow that travels along the
            bottom edge on a 5s loop, independent of the shrink/scale above. */}
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden rounded-full">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-neural-pulse shadow-[0_0_8px_2px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Left: identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center shrink-0">
            <Terminal size={13} className="text-emerald-500" />
          </div>
          <motion.span
            style={{ fontSize: titleSize }}
            className="font-bold tracking-tight text-white whitespace-nowrap animate-title-glow"
          >
            SoSo-Vault
          </motion.span>
          <span className="hidden lg:inline text-[10px] font-mono text-slate-500 tracking-wide pl-2 border-l border-white/10 ml-1">
            {nodeLabel}
          </span>
        </div>

        {/* Center: live market ticker — always visible regardless of scroll depth */}
        <div className="hidden md:flex flex-1 min-w-0 overflow-hidden mask-fade-x">
          <div className="flex gap-6 whitespace-nowrap animate-[ticker-scroll_22s_linear_infinite]">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
                <span className="text-slate-500 uppercase tracking-wider">{item.label}</span>
                <span className={item.positive === false ? 'text-danger font-bold' : 'text-emerald-400 font-bold'}>
                  {item.value}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: system status + version */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
            <Activity size={10} className="text-emerald-500/70" />
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.15em] text-slate-400 border border-white/10 px-2.5 py-1 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            {versionTag}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
