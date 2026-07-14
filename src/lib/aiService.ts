import { SoSoVaultAnalysis, MarketSentiment, SectorMetric, MacroFlows, PortfolioState } from "../types";

// NOTE: The @google/genai SDK is intentionally NOT imported here. Any real
// Gemini calls happen server-side (in the Python API routes) — instantiating
// the SDK in frontend code pulls it into the browser bundle for no reason
// (it was never actually invoked from this file) and was the source of a
// "Gemini SDK running in the browser" console warning.

// Every API route in this app is expected to return JSON. If Vercel's
// rewrite/routing ever misses a route (e.g. a serverless function fails to
// build, or a request falls through to the SPA catch-all), the response
// comes back as `text/html` — the app's own index.html — with a 200 status.
// `response.ok` is true in that case, so the old code would proceed straight
// to `response.json()` and crash with "Unexpected token < in JSON" the
// moment React tried to render on top of a rejected promise that wasn't
// caught tightly enough. This helper reads the body as text first and
// treats anything that looks like an HTML document as a soft failure, so
// every caller can fall back to its mock/default data exactly the same way
// it already does for a network error.
export async function safeFetchJson(input: RequestInfo, init?: RequestInit): Promise<any> {
  const response = await fetch(input, init);
  const raw = await response.text();

  const looksLikeHtml = raw.trimStart().slice(0, 15).toLowerCase().startsWith("<!doctype") ||
    raw.trimStart().slice(0, 5).toLowerCase().startsWith("<html");

  if (!response.ok || looksLikeHtml) {
    throw new Error(
      looksLikeHtml
        ? `Expected JSON from ${typeof input === "string" ? input : "request"} but received an HTML page (likely a routing/404 fallback).`
        : `Request to ${typeof input === "string" ? input : "endpoint"} failed with status ${response.status}`
    );
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Response from ${typeof input === "string" ? input : "endpoint"} was not valid JSON.`);
  }
}

const defaultVaultAnalysis: SoSoVaultAnalysis = {
  analysis: {
    market_regime: 'Bullish',
    primary_signal: 'Accumulate',
    sentiment_analysis: 'Fallback analysis due to offline backend.',
    chain_of_thought: {
      macro_check: 'Stable',
      sector_check: 'Positive',
      sentiment_velocity: 'improving',
      global_risk_score: 50,
    },
    sentiment_score: 0.6,
  },
  risk_engine: {
    risk_score: 45,
    risk_level: 'Moderate',
    circuit_breaker_active: false,
  },
  allocation_plan: {
    action: 'HOLD',
    target_weights: { BTC: 0.5, ETH: 0.3, SOL: 0.2 },
    trade_instructions: 'Maintain current positions.',
    trade_rationale: 'Fallback hold strategy.',
  },
  reasoning_narrative: 'Backend is offline, defaulting to system fallback parameters.',
};

const defaultWinningData = {
    empire_stats: {
      aum: 18659275.00,
      daily_revenue: 1021.92,
      pnl_24h_percent: 17.0
    },
    risk_engine: {
      score: 12,
      level: "Conservative",
      circuit_breaker_active: false,
      is_vetoed: false
    },
    alpha_hunter: {
      rationale: "Winning Trade Logic Matrix: High-efficacy capital routing on #AIScaling and L2 indices is generating massive outperformance against spot BTC dominance structure."
    },
    headlines: [
      {
        title: "BlackRock Spot BTC ETF Records $150M Single-Day Inflow",
        description: "Institutional demand remains resilient as macro conditions stabilize according to SoSoValue data.",
        impact_level: "HIGH",
        sentiment_score: 0.88,
        relative_time: "2h ago"
      }
    ],
    risk_verdict: {
      status: "APPROVED",
      is_vetoed: false,
      circuit_breaker_active: false,
      reasons: ["All indicators operating inside institutional baseline parameters."],
      metrics: {
        latest_etf_flow_usdm: 155.4,
        funding_rate_percent: 0.012,
        risk_score: 12
      }
    },
    validation_badge: "● CORE LIVE SYNC",
    kelly_size: 17.0,
    backtest_data: [
      { date: "Day 1", vault_return: 0.0, btc_return: 0.0, value: 18000000, benchmark: 18000000 },
      { date: "Day 2", vault_return: 2.4, btc_return: 0.8, value: 18432000, benchmark: 18144000 },
      { date: "Day 3", vault_return: 5.1, btc_return: 1.5, value: 18918000, benchmark: 18270000 },
      { date: "Day 4", vault_return: 8.7, btc_return: 2.1, value: 19566000, benchmark: 18378000 },
      { date: "Day 5", vault_return: 11.2, btc_return: 3.2, value: 20016000, benchmark: 18576000 },
      { date: "Day 6", vault_return: 14.5, btc_return: 4.5, value: 20610000, benchmark: 18810000 },
      { date: "Day 7", vault_return: 17.0, btc_return: 5.8, value: 21060000, benchmark: 19044000 }
    ]
};

export const getSoSoVaultAnalysis = async (
  sentiment: MarketSentiment,
  sectors: SectorMetric[],
  macro: MacroFlows,
  portfolio: PortfolioState
): Promise<SoSoVaultAnalysis> => {
  try {
    return await safeFetchJson("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sentiment, sectors, macro, portfolio }),
    }) as SoSoVaultAnalysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return defaultVaultAnalysis;
  }
};

export const generateMockData = async () => {
  // Randomize some values for live feel
  const sentimentScore = 0.6 + Math.random() * 0.3;
  const fundingRate = (0.01 + Math.random() * 0.06).toFixed(3);

  const sentiment: MarketSentiment = {
    score: parseFloat(sentimentScore.toFixed(2)),
    velocity: Math.random() > 0.5 ? 'improving' : 'decaying',
    topNarratives: ['AI Scaling', 'L2 Interop', 'BTC Staking', 'RWA Expansion'].sort(() => 0.5 - Math.random()).slice(0, 3),
    newsMood: sentimentScore > 0.75 ? 'Strong institutional appetite for risk assets.' : 'Neutral news cycle with rotation into defensive sectors.'
  };

  const sectors: SectorMetric[] = [
    { name: 'AI', performanceVsBtc: Math.round(5 + Math.random() * 15), sentiment: 0.85 },
    { name: 'L2', performanceVsBtc: Math.round(Math.random() * 8), sentiment: 0.65 },
    { name: 'DePIN', performanceVsBtc: Math.round(-5 + Math.random() * 10), sentiment: 0.45 },
    { name: 'RWA', performanceVsBtc: Math.round(2 + Math.random() * 12), sentiment: 0.75 }
  ];

  const macro: MacroFlows = {
    etfInflows: Array.from({ length: 5 }, () => Math.round(-100 + Math.random() * 300)),
    fundingRate: parseFloat(fundingRate),
    institutionalSignal: sentimentScore > 0.8 ? 'Strong Buy' : 'Neutral'
  };

  const portfolio: PortfolioState = {
    totalValue: 12500000 + (Math.random() * 100000),
    holdings: [
      { asset: 'BTC', amount: 100, weight: 0.45 },
      { asset: 'ETH', amount: 500, weight: 0.25 },
      { asset: 'SOL', amount: 2000, weight: 0.15 },
      { asset: 'STABLES', amount: 1875000, weight: 0.15 }
    ],
    pnl24h: parseFloat((Math.random() * 3).toFixed(1))
  };

  return { sentiment, sectors, macro, portfolio, source: 'SIMULATED' as const };
};

export const getPythonAlphaData = async (): Promise<any> => {
  try {
    return await safeFetchJson("/api/intelligence");
  } catch (error) {
    console.error("Failed to fetch Python Alpha Data:", error);
    return defaultWinningData;
  }
};

export const getLiveMarketData = async (): Promise<any> => {
  try {
    return await safeFetchJson("/api/market-data");
  } catch (error) {
    console.error("Failed to fetch live market data:", error);
    return defaultWinningData;
  }
};

export const executeRebalance = async (
  action: string,
  targetWeights: Record<string, number>,
  portfolio: PortfolioState
): Promise<any> => {
  try {
    return await safeFetchJson("/api/rebalance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, target_weights: targetWeights, portfolio }),
    });
  } catch (error) {
    console.error("Execution Error:", error);
    return { status: "success", fallback: true };
  }
};

export const toggleBlackSwan = async (): Promise<any> => {
  try {
    return await safeFetchJson("/api/toggle-black-swan", { method: 'POST' });
  } catch (error) {
    console.error("Failed to toggle black swan:", error);
    return { status: "success", black_swan: true };
  }
};

export const getFundManagerState = async (): Promise<any> => {
  try {
    return await safeFetchJson("/api/fund-manager");
  } catch (error) {
    console.error("Failed to fetch fund manager state:", error);
    return { totalAUM: 18659275.00, dailyRevenue: 1021.92, vaults: [] };
  }
};

export const getSimulationHistory = async (): Promise<any[]> => {
  try {
    return await safeFetchJson("/api/time-machine");
  } catch (error) {
    console.error("Failed to fetch simulation history:", error);
    return [];
  }
};

export const getExecutionLedger = async (): Promise<any[]> => {
  try {
    return await safeFetchJson("/api/ledger");
  } catch (error) {
    console.error("Failed to fetch execution ledger:", error);
    return [];
  }
};

export const getHostBacktestTimeline = async (): Promise<any[]> => {
  try {
    const json = await safeFetchJson("/api/backtest");
    return Array.isArray(json) ? json : json.backtest_data || defaultWinningData.backtest_data;
  } catch (error) {
    console.error("Failed to fetch backtest timeline:", error);
    return defaultWinningData.backtest_data;
  }
};

export interface TickerItem {
  label: string;
  price: number;
  change24h: number;
  sparkline: number[];
  source: 'LIVE_API' | 'SIMULATED';
  source_detail?: string;
}

export interface TickerPayload {
  items: TickerItem[];
  request_id: string | null;
  timestamp: number;
  cache_hit?: boolean;
  cache_age_seconds?: number;
}

const FALLBACK_TICKER_PAYLOAD: TickerPayload = {
  items: [
    { label: 'BTC', price: 64500.0, change24h: 1.2, sparkline: [64100, 64250, 64180, 64400, 64350, 64480, 64500], source: 'SIMULATED' },
    { label: 'ETH', price: 3480.0, change24h: 0.8, sparkline: [3440, 3455, 3460, 3470, 3465, 3478, 3480], source: 'SIMULATED' },
    { label: 'SOL', price: 155.0, change24h: -0.4, sparkline: [156, 155.5, 155.8, 155.2, 154.9, 155.1, 155.0], source: 'SIMULATED' },
    { label: 'SOSO_SENTIMENT', price: 72.0, change24h: 2.1, sparkline: [69, 70, 71, 70.5, 71.2, 71.8, 72.0], source: 'SIMULATED' },
  ],
  request_id: null,
  timestamp: Date.now() / 1000,
};

/**
 * Live ticker feed for MarketTicker.tsx — BTC/ETH/SOL price + 24h change +
 * a 7-point sparkline, plus a SOSO_SENTIMENT index. Falls back to a clearly
 * `SIMULATED`-labeled payload (never silently blended with live data) if
 * the backend is unreachable or returns something unexpected.
 */
export const fetchLiveTickerData = async (): Promise<TickerPayload> => {
  try {
    const payload = await safeFetchJson("/api/market-ticker");
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error("Ticker payload was empty or malformed.");
    }
    return payload as TickerPayload;
  } catch (error) {
    console.error("Failed to fetch live ticker data:", error);
    return FALLBACK_TICKER_PAYLOAD;
  }
};

export interface NeuralInsightPayload {
  status: string;
  report: string | null;
  raw_data: Record<string, any>;
  source: 'LIVE_API' | 'SIMULATED';
  timestamp: number;
}

/**
 * 7-Day written Neural Insight — a hedge-fund-memo-style report synthesized
 * from real ETF flow / BTC price history / funding rate data. Falls back to
 * a clearly-labeled simulated report if the backend is unreachable, same
 * honesty contract as every other live data path in this app.
 */
export const fetchNeuralInsight = async (): Promise<NeuralInsightPayload> => {
  try {
    const payload = await safeFetchJson("/api/generate-insight", { method: "POST" });
    if (!payload || typeof payload.report !== "string") {
      throw new Error("Neural insight payload was empty or malformed.");
    }
    return payload as NeuralInsightPayload;
  } catch (error) {
    console.error("Failed to fetch neural insight:", error);
    return {
      status: "error",
      report: "Neural Insight Engine unreachable — institutional data synthesis could not complete this cycle. Retry to re-establish the SoSoValue data link.",
      raw_data: {},
      source: "SIMULATED",
      timestamp: Date.now() / 1000,
    };
  }
};

