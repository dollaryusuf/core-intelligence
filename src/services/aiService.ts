import { GoogleGenAI, Type } from "@google/genai";
import { SoSoVaultAnalysis, MarketSentiment, SectorMetric, MacroFlows, PortfolioState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

    if (!response.ok) {
      throw new Error("Failed to fetch analysis from intelligence layer");
    }

    const result = await response.json();
    return result as SoSoVaultAnalysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};

export const generateMockData = () => {
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

export const getLiveMarketData = async (): Promise<any> => {
  try {
    const response = await fetch("/api/market-data");
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch live market data:", error);
    return null;
  }
};

export const executeRebalance = async (
  action: string,
  targetWeights: Record<string, number>,
  portfolio: PortfolioState
): Promise<any> => {
  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, target_weights: targetWeights, portfolio }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Execution engine fault");
    }

    return await response.json();
  } catch (error) {
    console.error("Execution Error:", error);
    throw error;
  }
};

export const toggleBlackSwan = async (): Promise<any> => {
  try {
    const response = await fetch("/api/toggle-black-swan", { method: 'POST' });
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to toggle black swan:", error);
    return null;
  }
};

export const getFundManagerState = async (): Promise<any> => {
  try {
    const response = await fetch("/api/fund-manager");
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch fund manager state:", error);
    return null;
  }
};

export const getSimulationHistory = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/time-machine");
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch simulation history:", error);
    return [];
  }
};

export const getExecutionLedger = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/ledger");
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch execution ledger:", error);
    return [];
  }
};

export const getHostBacktestTimeline = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/backtest");
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch backtest timeline:", error);
    return [];
  }
};

