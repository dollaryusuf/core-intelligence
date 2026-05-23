
export interface MarketSentiment {
  score: number; // 0 to 1
  velocity: 'improving' | 'decaying' | 'stable';
  topNarratives: string[];
  newsMood: string;
}

export interface SectorMetric {
  name: string;
  performanceVsBtc: number; // percentage
  sentiment: number; // 0 to 1
}

export interface MacroFlows {
  etfInflows: number[]; // Flow for last N periods
  fundingRate: number;
  institutionalSignal: 'Strong Buy' | 'Neutral' | 'Distribution';
}

export interface PortfolioState {
  totalValue: number;
  holdings: {
    asset: string;
    amount: number;
    weight: number;
  }[];
  pnl24h: number;
}

export interface SoSoVaultAnalysis {
  analysis: {
    market_regime: 'Bullish' | 'Bearish' | 'Sideways';
    primary_signal: string;
    sentiment_analysis: string;
    chain_of_thought: {
      macro_check: string;
      sector_check: string;
      sentiment_velocity: string;
      global_risk_score: number;
    };
  };
  risk_engine: {
    risk_score: number; // 0-100
    risk_level: 'Conservative' | 'Moderate' | 'Aggressive';
    circuit_breaker_active: boolean;
  };
  allocation_plan: {
    action: 'HOLD' | 'REBALANCE' | 'DE-RISK';
    target_weights: Record<string, number>;
    trade_instructions: string;
    trade_rationale: string;
  };
  reasoning_narrative: string;
  signal_attribution?: {
    title: string;
    description: string;
    impact_level?: 'HIGH' | 'MEDIUM' | 'LOW';
    sentiment_score?: number;
    relative_time?: string;
  }[];
  debate_log?: {
    alpha_hunter: string;
    risk_auditor: {
      status: string;
      risk_assessment: {
        institutional_alignment: string;
        leverage_risk: string;
        volatility_buffer: string;
      };
      criticism: string;
      governance_adjustments: {
        proposed_reduction: string;
        required_stable_buffer: string;
      };
      confidence_score: number;
      safe_size_limit: number;
      final_verdict_summary: string;
    };
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'alert' | 'process';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: 'REBALANCE' | 'HOLD' | 'VETO' | 'GOVERNANCE' | 'CIRCUIT BREAKER' | 'NODE_SYNCHRONIZED';
  signal: string;
  verdict: string;
  payload: any;
  insights?: string[];
}

export interface ManagedVault {
  id: string;
  name: string;
  type: 'Treasury' | 'DAO' | 'Personal';
  aum: number;
  lastRebalance: string;
  alpha_vs_btc: number;
  total_return: number;
}

export interface FundManagerState {
  totalAUM: number;
  dailyRevenue: number;
  vaults: ManagedVault[];
  isBlackSwan?: boolean;
}
