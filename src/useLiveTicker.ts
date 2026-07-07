/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef, useState } from 'react';
import { fetchLiveTickerData, TickerItem, TickerPayload } from './lib/aiService';

const POLL_INTERVAL_MS = 60_000;

/**
 * Polls /api/market-ticker every 60s (immediate fetch on mount, no waiting
 * for the first interval tick). Shared by MarketTicker.tsx (Dashboard) and
 * LandingPage.tsx (pre-gateway, via FloatingHeader) so both surfaces show
 * the same live data through one fetch/poll implementation rather than two
 * independently-drifting copies.
 */
export function useLiveTicker(onEvidence?: (payload: TickerPayload) => void) {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [source, setSource] = useState<'LIVE_API' | 'SIMULATED' | 'MIXED'>('SIMULATED');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const poll = async () => {
      const payload = await fetchLiveTickerData();
      if (!mountedRef.current) return;
      setItems(payload.items);
      const sources = new Set(payload.items.map((it) => it.source));
      setSource(sources.size > 1 ? 'MIXED' : (payload.items[0]?.source ?? 'SIMULATED'));
      onEvidence?.(payload);
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, source };
}
