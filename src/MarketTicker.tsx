/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from './lib/utils';
import { fetchLiveTickerData, TickerItem, TickerPayload } from './lib/aiService';

interface MarketTickerProps {
  intelligence: any;
  /**
   * Fired every time a fresh (non-cached-on-the-client) ticker payload is
   * fetched, so the parent can stash the raw JSON + soso-api-request-id in
   * the Evidence Vault for judges to verify.
   */
  onEvidence?: (payload: TickerPayload) => void;
}

const POLL_INTERVAL_MS = 60_000;

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="w-[60px] h-[20px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? '#34d399' : '#fb7185'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketTicker({ intelligence, onEvidence }: MarketTickerProps) {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [source, setSource] = useState<'LIVE_API' | 'SIMULATED' | 'MIXED'>('SIMULATED');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const poll = async () => {
      const payload = await fetchLiveTickerData();
      if (!mountedRef.current) return;
      setTickerItems(payload.items);
      const sources = new Set(payload.items.map((it) => it.source));
      setSource(sources.size > 1 ? 'MIXED' : (payload.items[0]?.source ?? 'SIMULATED'));
      onEvidence?.(payload);
    };

    poll(); // fetch immediately on mount, don't wait for the first interval tick
    const id = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fall back to whatever the dashboard's own `intelligence` blob has on the
  // very first paint, before the first ticker poll resolves, so the bar
  // isn't empty for a beat.
  const displayItems: TickerItem[] = tickerItems.length > 0
    ? tickerItems
    : (() => {
        const prices = intelligence?.live_data?.crypto_prices || { BTC: 64500.0, ETH: 3480.0, SOL: 155.0 };
        const sentimentScore = intelligence?.live_data?.sentiment_score ?? 0.72;
        return [
          { label: 'BTC', price: Number(prices.BTC ?? 0), change24h: 1.2, sparkline: [], source: 'SIMULATED' as const },
          { label: 'ETH', price: Number(prices.ETH ?? 0), change24h: 0.8, sparkline: [], source: 'SIMULATED' as const },
          { label: 'SOL', price: Number(prices.SOL ?? 0), change24h: -0.4, sparkline: [], source: 'SIMULATED' as const },
          { label: 'SOSO_SENTIMENT', price: Number(sentimentScore) * 100, change24h: 2.1, sparkline: [], source: 'SIMULATED' as const },
        ];
      })();

  // Duplicate items so the marquee loops seamlessly
  const track = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full max-w-full overflow-hidden bg-black/60 border-b border-white/5 relative z-50">
      <div className="flex items-center whitespace-nowrap animate-[ticker-scroll_28s_linear_infinite] hover:[animation-play-state:paused]">
        {track.map((item, i) => {
          const positive = item.change24h >= 0;
          const priceDisplay = item.label === 'SOSO_SENTIMENT'
            ? `${item.price.toFixed(1)}`
            : `$${item.price.toLocaleString(undefined, { maximumFractionDigits: item.price < 10 ? 2 : 0 })}`;

          return (
            <div
              key={`${item.label}-${i}`}
              className="flex items-center gap-2 px-6 py-1.5 border-r border-white/5 shrink-0 font-mono"
            >
              <span className="text-[9px] uppercase tracking-widest text-muted">{item.label}</span>
              <span className="text-[11px] font-bold text-white">{priceDisplay}</span>
              <span className={cn(
                'flex items-center gap-0.5 text-[10px] font-bold',
                positive ? 'text-emerald-400' : 'text-rose-400'
              )}>
                {positive ? '↗' : '↘'} {Math.abs(item.change24h).toFixed(1)}%
              </span>
              {item.sparkline.length > 1 && <Sparkline data={item.sparkline} positive={positive} />}
            </div>
          );
        })}
      </div>
      {/* Tiny corner tag so it's visible at a glance whether this bar is live or simulated,
          consistent with the rest of the app's transparency-first labeling. */}
      <div className="absolute top-1 right-2 text-[8px] font-mono uppercase tracking-widest text-slate-600 pointer-events-none hidden sm:block">
        {source === 'LIVE_API' ? '● live' : source === 'MIXED' ? '● mixed' : '● sim'}
      </div>
    </div>
  );
}
