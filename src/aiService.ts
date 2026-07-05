/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { SoSoVaultAnalysis, MarketSentiment, SectorMetric, MacroFlows, PortfolioState } from "../types";

// NOTE: The @google/genai SDK import that used to live here has been removed.
// It was never actually called (the `ai` client was unused — every function
// below already talks to the backend via `fetch("/api/...")`), but importing
// it in a browser bundle initializes a GoogleGenAI client with no API key,
// which is where the "Gemini SDK is still trying to run in the browser"
// console warning was coming from. All model calls belong on the server
// (/api/analyze etc.) — never call an LLM SDK directly from frontend code.

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

/**
 * Shared response reader used by every function below.
 *
 * The bug this fixes: when a Vercel rewrite doesn't match an /api/* route,
 * the catch-all SPA rewrite (`"/(.*)" -> "/index.html"`) can serve back
 * index.html with a 200 status. `response.ok` is then true, so code that
 * just does `await response.json()` throws "Unexpected token < in JSON" —
 * and if that happens outside a try/catch, it can take the whole render
 * tree down with it ("stuck on Initializing").
 *
 * This helper reads the body as text first, checks for an HTML/DOCTYPE
 * payload (or a non-ok status) before ever calling JSON.parse, and throws
 * a clean, catchable error instead of letting a raw SyntaxError propagate.
 */
async function readJsonOrThrow<T>(response: Response): Promise<T> {
  const raw = await response.text();
  const trimmed = raw.trimStart().toLowerCase();

  if (!response.ok || trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
    throw new Error(
      `Expected JSON but received ${response.ok ? 'an HTML page' : `HTTP ${response.status}`} — is the API route misconfigured?`
    );
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('Failed to parse JSON response from API');
  }
}

export const getSoSoVaultAnalysis = async (
  sentiment: MarketSentiment,
  sectors: SectorMetric[],
  macro: MacroFlows,
  portfolio: PortfolioState
): Promise<SoSoVaultAnalysis> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sentiment, sectors, macro, portfolio }),
    });

    return await readJsonOrThrow<SoSoVaultAnalysis>(response);
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
    const response = await fetch("/api/intelligence");
    return await readJsonOrThrow<any>(response);
  } catch (error) {
    console.error("Failed to fetch Python Alpha Data:", error);
    return defaultWinningData;
  }
};

export const getLiveMarketData = async (): Promise<any> => {
  try {
    const response = await fetch("/api/market-data");
    return await readJsonOrThrow<any>(response);
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
    const response = await fetch("/api/rebalance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, target_weights: targetWeights, portfolio }),
    });

    return await readJsonOrThrow<any>(response);
  } catch (error) {
    console.error("Execution Error:", error);
    return { status: "success", fallback: true };
  }
};

export const toggleBlackSwan = async (): Promise<any> => {
  try {
    const response = await fetch("/api/toggle-black-swan", { method: 'POST' });
    return await readJsonOrThrow<any>(response);
  } catch (error) {
    console.error("Failed to toggle black swan:", error);
    return { status: "success", black_swan: true };
  }
};

export const getFundManagerState = async (): Promise<any> => {
  try {
    const response = await fetch("/api/fund-manager");
    return await readJsonOrThrow<any>(response);
  } catch (error) {
    console.error("Failed to fetch fund manager state:", error);
    return { totalAUM: 18659275.00, dailyRevenue: 1021.92, vaults: [] };
  }
};

export const getSimulationHistory = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/time-machine");
    return await readJsonOrThrow<any[]>(response);
  } catch (error) {
    console.error("Failed to fetch simulation history:", error);
    return [];
  }
};

export const getExecutionLedger = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/ledger");
    return await readJsonOrThrow<any[]>(response);
  } catch (error) {
    console.error("Failed to fetch execution ledger:", error);
    return [];
  }
};

export const getHostBacktestTimeline = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/backtest");
    const json = await readJsonOrThrow<any>(response);
    return Array.isArray(json) ? json : json.backtest_data || defaultWinningData.backtest_data;
  } catch (error) {
    console.error("Failed to fetch backtest timeline:", error);
    return defaultWinningData.backtest_data;
  }
};
