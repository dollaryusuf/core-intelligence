import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SoSoClient } from "./src/services/dataManager.ts";
import { MarketSentiment, SectorMetric, MacroFlows, FundManagerState, ManagedVault } from "./src/types.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize the SoSoClient (Strictly for Data Management)
const sosoClient = new SoSoClient(process.env.SOSO_VALUE_API_KEY, true);

// Quant Reasoning Logic (The "Intelligence" Layer)
const apiKey = process.env.GEMINI_API_KEY;
const isPlaceholder = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10;
const ai = new GoogleGenAI({ apiKey: (isPlaceholder ? "MOCK_KEY" : apiKey) as string });

function calculateKellyAllocation(confidenceScore: number, riskRewardRatio: number = 1.5): number {
  /**
   * Half-Kelly Criterion for Treasury Management
   * f = (bp - q) / b
   */
  const p = confidenceScore / 100;
  const q = 1 - p;
  const b = riskRewardRatio;
  
  const kellyF = (b * p - q) / b;
  const safeAllocation = Math.max(0, kellyF / 2);
  return Math.round(safeAllocation * 10000) / 100; // Return as percentage with 2 decimals
}

function getSimulatedResponse(marketState: any, portfolio: any): any {
  const isBullish = marketState.sentiment_score > 0.7;
  const etfOutflows = marketState.etf_net_flows.some((f: number) => f < -500); 
  const confidenceScore = isBullish ? 78 : 45;
  const kellySize = calculateKellyAllocation(confidenceScore);
  
  const riskScore = isBullish ? 35 : 75;
  const action = (isBullish && !etfOutflows && kellySize > 5) ? "REBALANCE" : "HOLD";
  
  return {
    "analysis": {
      "market_regime": isBullish ? "Bullish" : "Sideways",
      "primary_signal": "Institutional Data (Simulated)",
      "sentiment_analysis": "Simulation: Market showing signs of narrative rotation into AI and L2 sectors.",
      "chain_of_thought": {
        "macro_check": "Simulation: ETF flows are trending positive, indicating strong spot demand.",
        "sector_check": "Simulation: AI and L2 outperforming BTC by significant margins.",
        "sentiment_velocity": "Simulation: Social sentiment is rapidly improving based on recent retail inflows.",
        "global_risk_score": riskScore
      }
    },
    "risk_engine": {
      "risk_score": riskScore,
      "risk_level": isBullish ? "Moderate" : "Conservative",
      "circuit_breaker_active": false
    },
    "allocation_plan": {
      "action": action,
      "target_weights": {
        "BTC": 0.40,
        "ETH": 0.20,
        "SOL": 0.15,
        "STABLES": 0.15,
        "SECTOR_INDEX": 0.10
      },
      "trade_instructions": action === "REBALANCE" ? "1. Sell 5% BTC into USDC. 2. Layer into high-Beta AI and L2 indices." : "No action required. Portfolio remains within safety bounds.",
      "trade_rationale": "Simulation: Consensus reached. Alpha Hunter opportunity validated by Risk Auditor."
    },
    "reasoning_narrative": "Simulation: High-conviction play on current narrative alpha. Risk parameters remains within optimal bounds.",
    "signal_attribution": marketState.top_news || [],
    "debate_log": {
      "alpha_hunter": "Aggressive rotation into AI and L2 looks optimal given the current narrative velocity and BTC dominance plateau.",
      "risk_auditor": {
        "status": etfOutflows ? "VETOED" : "APPROVED",
        "risk_assessment": {
          "institutional_alignment": etfOutflows ? "Low" : "High",
          "leverage_risk": "Safe",
          "volatility_buffer": "15% downside protection active"
        },
        "criticism": etfOutflows ? "Alpha Hunter is ignoring blatant institutional distribution." : "Proposal is acceptable but requires tight trailing stops.",
        "governance_adjustments": {
          "proposed_reduction": etfOutflows ? "100%" : "0%",
          "required_stable_buffer": "15%"
        },
        "confidence_score": confidenceScore,
        "safe_size_limit": kellySize,
        "final_verdict_summary": "Simulation: Compliance review complete. Strategy aligns with treasury mandates."
      }
    }
  };
}

app.post("/api/analyze", async (req, res) => {
  const { portfolio } = req.body;

  try {
    const marketState = await sosoClient.getMarketState();
    
    // Extract data for the context
    const sentiment = {
      score: marketState.sentiment_score,
      velocity: marketState.sentiment_score > 0.7 ? "improving" : "decaying",
      topNarratives: marketState.top_narratives,
      newsMood: marketState.sentiment_score > 0.75 ? "Bullish trend confirmed by institutional metrics." : "Consolidation regime with mixed signals.",
      topNews: marketState.top_news
    };

    // Fallback to Simulation Mode if API Key is known to be bad
    if (isPlaceholder) {
      console.warn("Generating simulated multi-agent consensus (No valid API key).");
      return res.json(getSimulatedResponse(marketState, portfolio));
    }

    try {
      // PHASE 1: Alpha Hunter Proposal
      if (isBlackSwanGlobal) {
        const blackSwanResponse = getSimulatedResponse(marketState, portfolio);
        res.json({
          ...blackSwanResponse,
          analysis: {
            ...blackSwanResponse.analysis,
            sentiment_analysis: "BLACK SWAN DETECTED. Institutional exodus in progress. Circuit breakers triggered.",
            chain_of_thought: {
              ...blackSwanResponse.analysis.chain_of_thought,
              global_risk_score: 99
            }
          },
          risk_engine: {
            ...blackSwanResponse.risk_engine,
            risk_score: 99,
            risk_level: "Conservative",
            circuit_breaker_active: true
          },
          allocation_plan: {
            ...blackSwanResponse.allocation_plan,
            action: "EXIT TO STABLES",
            trade_rationale: "EMERGENCY OVERRIDE: Institutional ETF Outflows exceeded $500M in 4 hours. Market liquidity is evaporating. Strategic alpha is secondary to principal preservation."
          },
          reasoning_narrative: "VETO INITIATED: Institutional ETF Outflows >$500M detected. Narrative hype decoupled from liquidity. Protecting principal.",
          debate_log: {
            alpha_hunter: "Narrative decay is absolute. All growth assets are in freefall.",
            risk_auditor: {
              status: "VETOED",
              risk_assessment: {
                institutional_alignment: "Low",
                leverage_risk: "Extreme",
                volatility_buffer: "DISABLED"
              },
              criticism: "Institutional ETF Outflows exceeded $500M in 4 hours. Market liquidity is evaporating. Strategic alpha is secondary to principal preservation.",
              governance_adjustments: {
                proposed_reduction: "100%",
                required_stable_buffer: "100%"
              },
              confidence_score: 0,
              safe_size_limit: 0,
              final_verdict_summary: "Circuit breaker active. Vault in safe mode."
            }
          }
        });
        return;
      }

    const alphaPrompt = `
        ROLE: You are the "Alpha Hunter", a high-conviction momentum quant.
        GOAL: Identify the maximum alpha opportunity in the current market.
        
        DATA:
        - Sentiment: ${JSON.stringify(sentiment)}
        - Sectors: ${JSON.stringify(marketState.sector_performance_map)}
        - Portfolio: $${portfolio.totalValue} (${portfolio.holdings.map((h: any) => h.asset).join(', ')})
        
        Output valid JSON:
        {
          "proposal": "REBALANCE" | "HOLD",
          "target_weights": {"BTC": 0.0, ...},
          "rationale": "Why this specific trade?"
        }
      `;

      const alphaResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: alphaPrompt }] }],
        config: { responseMimeType: "application/json" }
      });
      const alphaDecision = JSON.parse(alphaResponse.text.trim());

      // PHASE 2: Risk Auditor Review
      const riskPrompt = `
        ROLE: You are the Senior Risk Compliance Officer & Quantitative Auditor for SoSo-Vault. Your sole objective is capital preservation. 
        You are naturally skeptical, risk-averse, and suspicious of "retail froth" and "narrative hype" not backed by institutional liquidity.
        
        TASK: Review the proposal from the "Alpha Hunter" and apply strict guardrails.
        
        DATA:
        - Alpha Hunter Proposal: ${JSON.stringify(alphaDecision)}
        - Market Sentiment: ${marketState.sentiment_score}
        - ETF Flows: ${marketState.etf_net_flows.join(', ')}
        - Funding Rates: ${marketState.funding_rates}%
        
        STRATEGIC MANDATES:
        1. Institutional Reality Check: If Strategy is "REBALANCE" but ETF flows are negative/neutral, flag as "Retail Exit Trap" & reduce size.
        2. Leverage Brake: If Funding > 0.04%, warn of "Long Squeeze" and advocate for stables.
        3. Divergence Detector: If Sentiment is high but Sector Indices lag, label it "Unsubstantiated Hype."
        4. Kelly Criterion: f = (bp-q)/b. Use HALF-KELLY (f/2) as max shift.
        
        Output valid JSON exactly matching this schema:
        {
          "audit_status": "APPROVED" | "DOWNSIZED" | "VETOED",
          "risk_assessment": {
            "institutional_alignment": "High" | "Low",
            "leverage_risk": "Safe" | "Caution" | "Extreme",
            "volatility_buffer": "string"
          },
          "criticism": "Brutal 1-sentence critique",
          "governance_adjustments": {
            "proposed_reduction": "string",
            "required_stable_buffer": "string"
          },
          "confidence_score": 0-100,
          "final_verdict_summary": "Professional executive summary"
        }
      `;

      const riskResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: riskPrompt }] }],
        config: { responseMimeType: "application/json" }
      });
      const riskAudit = JSON.parse(riskResponse.text.trim());

      // PHASE 3: Synthesis
      const synthesisPrompt = `
        Synthesize the final strategy from this internal debate.
        
        ALPHA HUNTER PROPOSAL: ${JSON.stringify(alphaDecision)}
        RISK AUDITOR ANALYSIS: ${JSON.stringify(riskAudit)}
        
        Return the FULL SoSoVaultAnalysis JSON SCHEMA.
        
        Important Rules:
        - "debate_log.alpha_hunter" is the hunter's rationale.
        - "debate_log.risk_auditor" is the full riskAudit object.
        - "allocation_plan.action" must be derived from riskAudit.audit_status (VETOED -> HOLD, others -> as proposed or modified).
        - Update "allocation_plan" target weights if Risk Auditor suggests a reduction or stable buffer.
        - "signal_attribution" MUST contain exactly 3 news headlines from the context that best support this final strategy. Each news headline must have "title" and "description".
      `;

      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: synthesisPrompt }] }],
        config: { responseMimeType: "application/json" }
      });
      
      const parsed = JSON.parse(finalResponse.text.trim());
      res.json(parsed);

    } catch (apiError: any) {
      if (apiError.message?.includes("API key not valid") || apiError.message?.includes("400")) {
        console.error("Gemini API Error (Invalid Key). Falling back to simulation...");
        return res.json(getSimulatedResponse(marketState, portfolio));
      }
      throw apiError;
    }
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
      error: "Intelligence Engine Failure",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.post("/api/execute", async (req, res) => {
  const { action, target_weights, portfolio } = req.body;
  
  console.log(`[EXECUTION_REQUEST] Action: ${action}`);

  try {
    // Execution Guardrails
    const slippageLimit = 0.02; // 2%
    const maxDrawdownLimit = 0.10; // 10%
    
    // Simulated validation
    const simulatedSlippage = 0.005; 
    const simulatedImpact = 0.01;

    if (simulatedSlippage > slippageLimit) {
      return res.status(400).json({ error: "Trade rejected: Slippage exceeds 2% buffer." });
    }

    if (simulatedImpact > maxDrawdownLimit) {
      return res.status(400).json({ error: "Trade rejected: Drawdown risk exceeds 10% safety threshold." });
    }

    // Simulate trade execution and logging
    console.log("[STORAGE] Logging executed trades to simulated vault ledger...");
    
    // In a real app, we'd update a database or emit an on-chain TX
    const executionResult = {
      status: "executed",
      timestamp: new Date().toISOString(),
      summary: `Successfully rebalanced portfolio to target weights: ${JSON.stringify(target_weights)}`,
      pnl_estimate: "+0.05%"
    };

    res.json(executionResult);
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ error: "Execution Engine Fault" });
  }
});

app.get("/api/market-data", async (req, res) => {
  try {
    const marketState = await sosoClient.getMarketState();
    
    // Map internal mock state to frontend types
    const sentiment: MarketSentiment = {
      score: marketState.sentiment_score,
      velocity: marketState.sentiment_score > 0.7 ? 'improving' : 'decaying',
      topNarratives: marketState.top_narratives,
      newsMood: marketState.sentiment_score > 0.75 
        ? "Bullish trend confirmed by institutional metrics." 
        : "Consolidation regime with mixed signals."
    };

    const sectors: SectorMetric[] = Object.entries(marketState.sector_performance_map).map(([name, perf]) => ({
      name,
      performanceVsBtc: perf as number,
      sentiment: marketState.sentiment_score // Approximation
    }));

    const macro: MacroFlows = {
      etfInflows: marketState.etf_net_flows,
      fundingRate: marketState.funding_rates,
      institutionalSignal: marketState.sentiment_score > 0.8 ? 'Strong Buy' : 'Neutral'
    };

    // We don't return partial portfolio here, that's handled by mock or DB
    res.json({ sentiment, sectors, macro });
  } catch (error) {
    console.error("Market Data Fetch Error:", error);
    res.status(500).json({ error: "Market Data Layer Offline" });
  }
});

let isBlackSwanGlobal = false;

app.get("/api/fund-manager", async (req, res) => {
  // Static mock AUM for now
  const vaults: ManagedVault[] = [
    { id: '1', name: 'Alpha Treasury', type: 'Treasury', aum: 12500000, lastRebalance: '2024-05-10', alpha_vs_btc: 4.1, total_return: 14.2 },
    { id: '2', name: 'DePIN DAO', type: 'DAO', aum: 4200000, lastRebalance: '2024-05-08', alpha_vs_btc: -1.2, total_return: 8.5 },
    { id: '3', name: 'Personal Core', type: 'Personal', aum: 1850000, lastRebalance: '2024-05-11', alpha_vs_btc: 2.8, total_return: 11.4 },
  ];
  const totalAUM = vaults.reduce((acc, v) => acc + v.aum, 0);
  const dailyRevenue = (totalAUM * 0.02) / 365;

  const state: FundManagerState = { totalAUM, dailyRevenue, vaults, isBlackSwan: isBlackSwanGlobal };
  res.json(state);
});

app.post("/api/toggle-black-swan", (req, res) => {
  isBlackSwanGlobal = !isBlackSwanGlobal;
  res.json({ isBlackSwan: isBlackSwanGlobal });
});

app.get("/api/time-machine", async (req, res) => {
  const days = 7;
  const simulation = [];
  const sosoClient = new SoSoClient(undefined, true);

  for (let i = 0; i < days; i++) {
    const marketState = await sosoClient.getMarketState();
    // Inject some variance for simulation
    const dayOffset = (days - i);
    marketState.sentiment_score = Math.max(0.2, Math.min(0.9, marketState.sentiment_score + (Math.random() * 0.2 - 0.1)));
    marketState.etf_net_flows = marketState.etf_net_flows.map(f => f * (1 + (Math.random() * 0.4 - 0.2)));
    
    simulation.push({
      date: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      market_state: marketState
    });
  }
  res.json(simulation);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SoSo-Vault Core running on http://localhost:${PORT}`);
  });
}

startServer();
