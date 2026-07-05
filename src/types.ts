/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * RECONSTRUCTED FILE — your real types.ts was not among the uploads (the
 * file uploaded under that name actually contained the main.tsx entry
 * point, see main.tsx). These shapes are inferred from how AuditTrail.tsx,
 * AgentLogger.tsx, and aiService.ts consume them. Please diff this against
 * your original if you still have it — in particular double-check
 * ManagedVault's fields, since only `vault.id` and `vault.name` are
 * actually referenced by the components I could see.
 */

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'alert' | 'process' | 'default';
  message: string;
}

export type AuditAction =
  | 'REBALANCE'
  | 'VETO'
  | 'CIRCUIT BREAKER'
  | 'GOVERNANCE'
  | 'HOLD'
  | 'NODE_SYNCHRONIZED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: AuditAction;
  signal: string;
  verdict: string;
  payload?: Record<string, unknown>;
  insights?: string[];
}

export interface ManagedVault {
  id: string | number;
  name: string;
  aum?: number;
  type?: string;
  mandate?: string;
  ownerAddress?: string;
}

export interface MarketSentiment {
  score: number;
  velocity: 'improving' | 'decaying';
  topNarratives: string[];
  newsMood: string;
}

export interface SectorMetric {
  name: string;
  performanceVsBtc: number;
  sentiment: number;
}

export interface MacroFlows {
  etfInflows: number[];
  fundingRate: number;
  institutionalSignal: string;
}

export interface PortfolioHolding {
  asset: string;
  amount: number;
  weight: number;
}

export interface PortfolioState {
  totalValue: number;
  holdings: PortfolioHolding[];
  pnl24h: number;
}

export interface SoSoVaultAnalysis {
  analysis: {
    market_regime: string;
    primary_signal: string;
    sentiment_analysis: string;
    chain_of_thought: {
      macro_check: string;
      sector_check: string;
      sentiment_velocity: string;
      global_risk_score: number;
    };
    sentiment_score: number;
  };
  risk_engine: {
    risk_score: number;
    risk_level: string;
    circuit_breaker_active: boolean;
  };
  allocation_plan: {
    action: string;
    target_weights: Record<string, number>;
    trade_instructions: string;
    trade_rationale: string;
  };
  reasoning_narrative: string;
}
