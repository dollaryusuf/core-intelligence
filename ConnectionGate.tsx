/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from './lib/utils';

interface TickerItem {
  label: string;
  value: string;
  delta?: number;
}

interface MarketTickerProps {
  intelligence: any;
}

export function MarketTicker({ intelligence }: MarketTickerProps) {
  const prices = intelligence?.live_data?.crypto_prices || { BTC: 64500.0, ETH: 3480.0, SOL: 155.0 };
  const sentimentScore = intelligence?.live_data?.sentiment_score ?? 0.72;
  const sentimentLabel = intelligence?.live_data?.sentiment_label ?? 'Bullish';
  const etfFlows = intelligence?.live_data?.etf_net_flows || [];
  const lastFlow = etfFlows.length > 0 ? etfFlows[etfFlows.length - 1] : 152.4;

  const items: TickerItem[] = [
    { label: 'BTC/USD', value: `$${Number(prices.BTC ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, delta: 1.2 },
    { label: 'ETH/USD', value: `$${Number(prices.ETH ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, delta: 0.8 },
    { label: 'SOL/USD', value: `$${Number(prices.SOL ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, delta: -0.4 },
    { label: 'SOSO SENTIMENT', value: `${(sentimentScore * 100).toFixed(0)}% ${sentimentLabel}`, delta: sentimentScore >= 0.5 ? 1 : -1 },
    { label: 'ETF NET FLOW', value: `${lastFlow >= 0 ? '+' : ''}$${Number(lastFlow).toFixed(1)}M`, delta: lastFlow },
  ];

  // Duplicate items so the marquee loops seamlessly
  const track = [...items, ...items, ...items];

  return (
    <div className="w-full max-w-full overflow-hidden bg-black/60 border-b border-white/5 relative z-50">
      <div className="flex whitespace-nowrap animate-[ticker-scroll_28s_linear_infinite] hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-6 py-1.5 border-r border-white/5 shrink-0 font-mono"
          >
            <span className="text-[9px] uppercase tracking-widest text-muted">{item.label}</span>
            <span className="text-[11px] font-bold text-white">{item.value}</span>
            {typeof item.delta === 'number' && (
              <span className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold",
                item.delta >= 0 ? "text-accent" : "text-danger"
              )}>
                {item.delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
