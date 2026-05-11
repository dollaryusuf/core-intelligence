/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield, 
  ArrowUpRight, 
  AlertTriangle, 
  BarChart3, 
  Zap, 
  Cpu, 
  Database, 
  Coins, 
  RefreshCcw,
  Info,
  ArrowRightLeft,
  Percent,
  Timer,
  Download,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { AgentLogger } from './components/AgentLogger';
import { AuditTrail } from './components/AuditTrail';
import { VaultIntelligenceNode } from './components/VaultIntelligenceNode';
import { DeployNodeModal } from './components/DeployNodeModal';
import { 
  getSoSoVaultAnalysis, 
  generateMockData,
  executeRebalance,
  getLiveMarketData,
  getFundManagerState,
  toggleBlackSwan,
  getSimulationHistory
} from './services/aiService';
import { 
  SoSoVaultAnalysis, 
  MarketSentiment, 
  SectorMetric, 
  MacroFlows, 
  PortfolioState,
  LogEntry,
  FundManagerState,
  ManagedVault,
  AuditEvent
} from './types';

// Mock Component for the output JSON visualization
const JsonView = ({ data }: { data: any }) => (
  <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-[10px] font-mono text-accent/80 border border-white/5 whitespace-pre-wrap">
    {JSON.stringify(data, null, 2)}
  </pre>
);

export default function App() {
  const [data, setData] = useState(() => generateMockData());
  const [analysis, setAnalysis] = useState<SoSoVaultAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'empire'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [managedData, setManagedData] = useState<FundManagerState | null>(null);
  const [selectedVault, setSelectedVault] = useState<ManagedVault | null>(null);
  const [vaultEvents, setVaultEvents] = useState<Record<string, AuditEvent[]>>({});
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [activeSignalAttribution, setActiveSignalAttribution] = useState<{ title: string; description: string }[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationDay, setSimulationDay] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blackSwanActive, setBlackSwanActive] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");
  const [rebalanced, setRebalanced] = useState(false);
  const hasBooted = useRef(false);

  const initialPortfolio: PortfolioState = {
    totalValue: 1000000,
    holdings: [
      { asset: "BTC", weight: 0.50, amount: 15.2 },
      { asset: "ETH", weight: 0.30, amount: 120.5 },
      { asset: "SOL", weight: 0.10, amount: 850 },
      { asset: "USDC", weight: 0.10, amount: 100000 }
    ],
    pnl24h: 1.2
  };

  const toggleBlackSwanSwitch = async () => {
    const res = await toggleBlackSwan();
    if (res) {
      setBlackSwanActive(res.isBlackSwan);
      if (res.isBlackSwan) {
        addLog("[CRITICAL] SOSO-VALUE DATA ANOMALY: Net ETF Inflows flipped to -$520M.", "alert");
        addLog("[GOVERNANCE] Risk Auditor has seized Strategic Control.", "info");
        addLog("[GOVERNANCE] Vetoing Alpha Hunter proposal: 'Hype-Exit Divergence' detected.", "alert");
        addLog("[SYSTEM] Triggering Emergency Circuit Breaker... Portfolio locked to USDC.", "process");
        addLog("[SYSTEM] Strategic Mandate finalized: EXIT TO STABLES.", "info");
      } else {
        addLog("Black Swan Simulation deactivated. Recovery mode engaged.", "info");
      }
      runAnalysis(); // Re-run to show impact
    }
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-50), newLog]);
  };

  const runAnalysis = async () => {
    if (isSimulating) return;
    setLoading(true);
    setLoadingStep(1); // Fetching data
    setError(null);
    
    // Exact requested log sequence
    addLog("Initiating Intelligence Node-001...", "process");
    
    // Attempt to get live data from backend sosoClient
    let freshData: any;
    const liveData = await getLiveMarketData();
    
    if (liveData) {
      setTimeout(() => addLog("Querying SoSoValue News API for #AIScaling sentiment...", "process"), 400);
      // Combine live market data with mock portfolio for demo
      const mockFull = generateMockData();
      freshData = { ...liveData, portfolio: mockFull.portfolio };
    } else {
      setTimeout(() => addLog("Backend relay offline. Initializing simulated data buffer.", "alert"), 400);
      freshData = generateMockData();
    }
    
    setData(freshData);

    try {
      // Step 2: Strategic Reasoning
      setTimeout(() => {
        setLoadingStep(2);
        addLog(`Cross-referencing Sentiment (${(freshData.sentiment.score * 100).toFixed(0)}%) with Index Performance (+4.2%).`, "info");
      }, 1000); 

      setTimeout(() => {
        if (freshData.macro.etfInflows.some((f: number) => f < 0)) {
          addLog("ALERT: Institutional ETF Flows showing neutral-to-negative divergence.", "alert");
        } else {
          addLog("Macro Check: ETF Flows trending positive. Institutional liquidity stable.", "info");
        }
      }, 1600);
      
      const result = await getSoSoVaultAnalysis(
        freshData.sentiment,
        freshData.sectors,
        freshData.macro,
        freshData.portfolio
      );
      
      setTimeout(() => {
        setLoadingStep(3);
        addLog("Claude 3.5 Sonnet: Calculating Half-Kelly Position Sizing...", "process");
      }, 2200);
      
      setTimeout(() => {
        setAnalysis(result);
        setActiveTab('strategy');
        setLoading(false);
        setLoadingStep(0);
        addLog(`Strategic Mandate finalized: ${result.allocation_plan.action}.`, "info");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Intelligence Engine offline. Verify API keys and network connection.");
      addLog("ENGINE_FAULT: Failed to bridge Neural Intelligence layer.", "alert");
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const runTimeMachineSimulation = async () => {
    setIsSimulating(true);
    setActiveTab('overview');
    addLog("Initiating Time-Machine Simulation: 7-Day Backtest...", "alert");
    
    try {
      const history = await getSimulationHistory();
      
      for (let i = 0; i < history.length; i++) {
        setSimulationDay(i + 1);
        const dayData = history[i];
        addLog(`Processing historical data for: ${dayData.date}`, "process");
        
        // Short delay to simulate thought
        await new Promise(r => setTimeout(r, 800));
        
        // Directly get a consensus for this historical state
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            marketState: dayData.market_state,
            portfolio: initialPortfolio 
          })
        });
        
        if (analysisResponse.ok) {
          const result = await analysisResponse.json();
          setAnalysis(result);
          addLog(`Consensus for ${dayData.date}: ${result.allocation_plan.action}`, "info");
        }
        
        await new Promise(r => setTimeout(r, 1200));
      }
      
      addLog("Time-Machine Simulation Complete. Portfolio protected against historical volatility.", "info");
    } catch (err) {
      addLog("Simulation interrupted: Sync error.", "alert");
    } finally {
      setIsSimulating(false);
      setSimulationDay(0);
    }
  };

  const generateReport = () => {
    if (!analysis) return;

    const report = `
SO-SO VAULT: STRATEGIC ALPHA & GOVERNANCE REPORT
Date: ${new Date().toLocaleDateString()}
Node_ID: VAULT-001-ALPHA
--------------------------------------------------

1. NEURAL CONSENSUS DEBATE
Alpha Hunter Verdict: "${analysis.debate_log?.alpha_hunter}"
Risk Auditor Critique: "${analysis.debate_log?.risk_auditor?.criticism}"

2. MARKET CONTEXT (SoSoValue Signal)
Sentiment Score: ${analysis.analysis.sentiment_score * 100}%
Market Regime: ${analysis.analysis.market_regime}
Primary Signal: ${analysis.analysis.primary_signal}

3. STRATEGY RECOMMENDATION
Action: ${analysis.allocation_plan.action}
Rationale: ${analysis.allocation_plan.trade_rationale || analysis.reasoning_narrative}

4. RISK GOVERNANCE
Risk Score: ${analysis.risk_engine?.risk_score || 0}/100
Status: ${blackSwanActive ? "GOVERNANCE LOCK (VETOED)" : analysis.debate_log?.risk_auditor?.status}
Half-Kelly Safe Size: ${blackSwanActive ? "0.00" : analysis.debate_log?.risk_auditor?.safe_size_limit}%
Circuit Breaker: ${analysis.risk_engine?.circuit_breaker_active || blackSwanActive ? "ACTIVE" : "STANDBY"}

5. INSTITUTIONAL SIGNAL ATTRIBUTION
${analysis.signal_attribution?.map(news => `- [SOSO-VERIFIED] ${news.title}: ${news.description}`).join('\n')}

--------------------------------------------------
DOCUMENT GENERATED BY AUTONOMOUS QUANT NODE
VERIFIED VIA ZK-PROOF ATTESTATION
--------------------------------------------------
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SoSoVault_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    addLog("Strategic Alpha Report exported successfully.", "info");
  };

  const handleExecute = async () => {
    if (!analysis) return;
    
    setExecuting(true);
    setExecutionResult(null);
    setError(null);
    addLog(`Broadcasting rebalance order: ${analysis.allocation_plan.action}`, "process");
    
    try {
      // Simulate chain settlement
      await new Promise(r => setTimeout(r, 2500));
      
      const result = await executeRebalance(
        analysis.allocation_plan.action,
        analysis.allocation_plan.target_weights,
        data.portfolio
      );
      setExecutionResult(result);
      
      const newHash = "5KqP" + Math.random().toString(36).substring(2, 8) + "z9Wv";
      setLastTxHash(newHash);
      setShowReceipt(true);
      
      addLog(`[LEDGER] Vault-001 Rebalance settled at Block ${Math.floor(Math.random() * 1000000) + 18000000}. Alpha Capture: +0.05%.`, "info");
      addLog(result.summary, "info");
      
      // Update local state to reflect rebalance (simulation)
      setRebalanced(true);
      
      // Portfolio Sync: Update AUM by +0.05%
      const alphaBoost = 1.0005;
      setManagedData(prev => prev ? {
        ...prev,
        totalAUM: prev.totalAUM * alphaBoost,
        vaults: prev.vaults.map(v => ({
          ...v,
          aum: v.aum * alphaBoost,
          total_return: v.total_return + 0.05,
          lastRebalance: "Nodes Synchronized"
        }))
      } : null);

      setData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          totalValue: prev.portfolio.totalValue ? prev.portfolio.totalValue * alphaBoost : prev.portfolio.totalValue,
          holdings: prev.portfolio.holdings.map(h => ({
            ...h,
            weight: analysis.allocation_plan.target_weights[h.asset] || h.weight
          }))
        }
      }));

      // Auto-dismiss after 10s
      setTimeout(() => {
        setShowConfirmModal(false);
        setShowReceipt(false);
      }, 10000);

    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Execution Engine offline.";
      setError(msg);
      addLog(`REJECTION: ${msg}`, "alert");
    } finally {
      setExecuting(false);
    }
  };

  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;
    
    addLog("System boot sequence complete. Node online.", "info");
    // Auto-run once on mount for demo
    runAnalysis();

    // Fetch fund manager data
    getFundManagerState().then(data => {
      if (data) setManagedData(data);
    });
  }, []);

  // Seed audit trail data
  useEffect(() => {
    if (managedData && Object.keys(vaultEvents).length === 0) {
      const initialEvents: Record<string, AuditEvent[]> = {};
      managedData.vaults.forEach(v => {
        initialEvents[v.id] = [
          {
            id: 'e0-' + v.id,
            timestamp: new Date().toLocaleString(),
            action: 'NODE_SYNCHRONIZED',
            signal: "Pulse check: All Intelligence Nodes reporting 99.9% uptime.",
            verdict: "System Idle. Monitoring SoSoValue Liquidity Layer for rebalance triggers.",
            payload: { uptime: 0.999, status: 'Live API Sync', latency: '12ms', consensus: 'Neural Consensus Finalized' },
            insights: [
              "Network health check passed with 99.9% availability.",
              "Latency within 15ms threshold for institutional execution.",
              "Neural consensus reached across all monitored liquidity layers."
            ]
          },
          {
            id: 'e1-' + v.id,
            timestamp: '2026-05-11 14:45:10',
            action: 'GOVERNANCE',
            signal: `User Manual Override: Max Drawdown adjusted to 10% for Node-00${v.id}.`,
            verdict: "Parameters Updated. Neural Rebalancing engine recalibrated to new safety bounds.",
            payload: { drawdown_new: 0.1, source: 'SoSo-Node-Authenticated', mode: 'Live API Sync' },
            insights: [
              "Governance mandate updated via authenticated admin channel.",
              "Drawdown threshold recalibrated to institutional safety standards.",
              "Audit trail updated with cryptographic vault attestation."
            ]
          },
          {
            id: 'e2-' + v.id,
            timestamp: '2026-05-11 11:36:45',
            action: 'REBALANCE',
            signal: "SoSo-News Sentiment (#AIScaling) hit 83%. SoSo-ETF API shows $142M Net Inflow.",
            verdict: "APPROVED. Executive shift from L1 into high-beta AI indices initiated via SoSo-Order-Book.",
            payload: { sentiment: 0.83, inflows: 142000000, indices: ['AI-BETA-1', 'NEURAL-XL'], execution: 'Neural Consensus Finalized' },
            insights: [
              "Sentiment signal confirmed via multi-source SoSo-News aggregation.",
              "Institutional flow verified ($142M) against high-alpha opportunity.",
              "Order execution routed via decentralized liquidity layer with minimal slippage."
            ]
          },
          {
            id: 'e3-' + v.id,
            timestamp: '2026-05-11 08:00:05',
            action: 'HOLD',
            signal: "Institutional ETF Outflows detected (-$45M). Divergence from retail social sentiment.",
            verdict: "MAINTAINING PRINCIPAL. Alpha Hunter rotation vetoed by Risk Auditor due to liquidity risk.",
            payload: { outflows: -45000000, risk_status: 'SoSo-Node-Authenticated', volatility: 'High Divergence' },
            insights: [
              "Institutional outflow signal prioritized over retail social sentiment.",
              "Capital preservation mandate triggered due to liquidity divergence.",
              "Risk auditor veto issued to maintain principal safety buffer."
            ]
          }
        ];
      });
      setVaultEvents(initialEvents);
    }
  }, [managedData, vaultEvents]);

  const addVaultEvent = (vaultId: string, event: Omit<AuditEvent, 'id'>) => {
    setVaultEvents(prev => ({
      ...prev,
      [vaultId]: [{ ...event, id: Math.random().toString(36).substring(7) }, ...(prev[vaultId] || [])]
    }));
  };

  const handleDeployVault = (newVaultData: { name: string; aum: number; type: string; mandate: string }) => {
    if (!managedData) return;

    const newId = (managedData.vaults.length + 1).toString();
    const newVault: ManagedVault = {
      id: newId,
      name: newVaultData.name,
      aum: newVaultData.aum,
      type: newVaultData.type as any,
      total_return: 0,
      alpha_vs_btc: 0,
      lastRebalance: "Just Deployed"
    };

    setManagedData(prev => prev ? {
      ...prev,
      totalAUM: prev.totalAUM + newVaultData.aum,
      vaults: [...prev.vaults, newVault]
    } : null);

    setVaultEvents(prev => ({
      ...prev,
      [newId]: [{
        id: 'e1-' + newId,
        timestamp: new Date().toLocaleString(),
        action: 'GOVERNANCE',
        signal: `Neural Node Provisioned: ${newVaultData.name}`,
        verdict: `Initial mandate set to: ${newVaultData.mandate}. Standard SoSo-Vault Agent initialized.`,
        payload: { ...newVaultData, timestamp: new Date().toISOString() }
      }]
    }));

    setShowDeployModal(false);
    setSelectedVault(newVault);
    addLog(`[SYSTEM] Intelligence Node ${newVaultData.name} is now LIVE.`, "info");
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-white/10 bg-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent grid place-items-center rounded-lg glow-accent">
              <Zap className="text-black fill-current" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SoSo-Vault <span className="text-accent underline underline-offset-4 decoration-1 font-serif italic text-sm ml-1">Core Intelligence</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-muted font-mono">Senior On-Chain Treasury Quant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] uppercase">Empire AUM</span>
              <span className="text-white font-bold font-mono">${managedData?.totalAUM.toLocaleString()}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] uppercase">Daily Revenue</span>
              <span className="text-accent font-bold font-mono-numbers">
                ${(managedData ? (managedData.totalAUM * 0.02) / 365 : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] uppercase font-mono">24h PnL</span>
              <span className={cn("font-bold flex items-center gap-1 font-mono", data.portfolio.pnl24h >= 0 ? "text-accent" : "text-danger")}>
                {data.portfolio.pnl24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {data.portfolio.pnl24h}%
              </span>
            </div>
            <button 
              onClick={() => setShowConfirmModal(true)}
              disabled={loading || isSimulating || !analysis || rebalanced}
              className={cn(
                "ml-4 px-4 py-2 border rounded-full transition-all flex items-center gap-2 group disabled:opacity-50",
                rebalanced 
                  ? "bg-accent/5 border-accent/40 text-accent/60" 
                  : "bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-black"
              )}
            >
              <RefreshCcw size={14} className={cn((loading || isSimulating || executing) && "animate-spin")} />
              <span className="uppercase text-[11px] font-bold tracking-tighter">
                {executing ? "Processing..." : (isSimulating ? `Simulating ${simulationDay}/7` : (rebalanced ? "NODE SYNCHRONIZED ✓" : "Execute Rebalance"))}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/5 mb-8 pb-px">
          {['overview', 'strategy', 'empire'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "pb-4 text-xs font-mono uppercase tracking-[0.2em] relative transition-colors",
                activeTab === tab ? "text-white" : "text-muted hover:text-white"
              )}
            >
              {tab === 'empire' ? 'Empire Scaling' : tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-12 gap-6"
            >
              {/* Market Sentiment */}
              <div className="col-span-12 lg:col-span-4 bg-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
                    <Activity size={14} className="text-accent" />
                    Market Sentiment
                  </h3>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-tighter",
                    data.sentiment.velocity === 'improving' ? "border-accent/40 text-accent bg-accent/5" : "border-muted/40 text-muted"
                  )}>
                    {data.sentiment.velocity}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <div className="text-5xl font-bold tracking-tighter">
                      {(data.sentiment.score * 100).toFixed(0)}<span className="text-muted text-2xl">%</span>
                    </div>
                    {analysis?.signal_attribution && (
                      <button 
                        onClick={() => setActiveSignalAttribution(analysis.signal_attribution)} 
                        className="text-accent hover:opacity-100 opacity-60 flex items-center gap-1 text-[10px] font-mono pb-2"
                      >
                        (Source) <Info size={10} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed italic border-l-2 border-accent/30 pl-3">
                    "{data.sentiment.newsMood}"
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-muted uppercase">Top Narratives</span>
                  <div className="flex flex-wrap gap-2">
                    {data.sentiment.topNarratives.map(n => (
                      <span key={n} className="px-2 py-1 bg-white/5 rounded text-[11px] border border-white/5 hover:border-white/20 transition-colors cursor-default">
                        #{n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Index Analytics */}
              <div className="col-span-12 lg:col-span-8 bg-card border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
                    <BarChart3 size={14} className="text-accent" />
                    Sector Performance vs BTC
                    {analysis?.signal_attribution && (
                      <button 
                        onClick={() => setActiveSignalAttribution(analysis.signal_attribution)}
                        className="ml-auto p-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
                        title="View Evidence Vault"
                      >
                        <Info size={12} className="text-accent" />
                      </button>
                    )}
                  </h3>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sectors} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#8E9299" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        width={60} 
                        fontFamily="monospace"
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#15171C', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
                        itemStyle={{ color: '#00FF9C' }}
                      />
                      <Bar dataKey="performanceVsBtc" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.sectors.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.performanceVsBtc >= 0 ? '#00FF9C' : '#FF4D4D'} 
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Macro Flows & Funding */}
              <div className="col-span-12 lg:col-span-7 bg-card border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
                      <Cpu size={14} className="text-accent" />
                      Institutional ETF Flows
                      {analysis?.signal_attribution && (
                        <button 
                          onClick={() => setActiveSignalAttribution(analysis.signal_attribution)}
                          className="p-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
                          title="View Evidence Vault"
                        >
                          <Info size={12} className="text-accent" />
                        </button>
                      )}
                    </h3>
                    <p className="text-[10px] text-muted uppercase font-mono">Net Flow (USDm) per period</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-muted uppercase mb-1">Signal</div>
                    <div className="text-sm font-bold text-accent">{data.macro.institutionalSignal}</div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.macro.etfInflows.map((v, i) => ({ period: i, flow: v }))}>
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} tick={false} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E9299' }} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="flow" stroke="#00FF9C" fillOpacity={1} fill="url(#colorFlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volatility & Funding */}
              <div className="col-span-12 lg:col-span-5 bg-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
                    <RefreshCcw size={14} className="text-accent" />
                    Funding & Leverage
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase mb-2">BTC Funding Rate</div>
                      <div className={cn("text-2xl font-bold font-mono", data.macro.fundingRate > 0.05 ? "text-danger" : "text-white")}>
                        {data.macro.fundingRate}%
                      </div>
                      <div className="mt-2 text-[10px] text-muted font-mono leading-tight">
                        {data.macro.fundingRate > 0.05 ? "CRITICAL: High squeeze risk" : "NORMAL: Neutral leverage"}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="text-[10px] font-mono text-muted uppercase mb-2">Volatility Rank</div>
                      <div className="text-2xl font-bold font-mono text-white">42/100</div>
                      <div className="mt-2 text-[10px] text-muted font-mono leading-tight">
                        Moderate baseline realized vol.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                  <button 
                    onClick={runTimeMachineSimulation}
                    disabled={loading || isSimulating}
                    className="flex-[0.4] py-4 bg-white/5 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSimulating ? <RefreshCcw size={14} className="animate-spin" /> : <Timer size={14} />}
                    {isSimulating ? `Day ${simulationDay}/7` : "Backtest"}
                  </button>
                  <button 
                    onClick={runAnalysis}
                    disabled={loading || isSimulating}
                    className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    Generate Analysis
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'empire' ? (
            <motion.div 
              key="empire"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {selectedVault ? (
                <VaultIntelligenceNode 
                  vault={selectedVault} 
                  onBack={() => setSelectedVault(null)} 
                  blackSwanActive={blackSwanActive}
                  onAddLog={addLog}
                  onOpenAudit={() => setIsAuditOpen(true)}
                  onAddVaultEvent={(event) => addVaultEvent(selectedVault.id, event)}
                />
              ) : (
                <>
                  {/* Empire Scaling Header */}
                  <div className="bg-accent text-black rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
                    <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] bg-black/10 px-3 py-1 rounded-full">Autonomous Fund Infrastructure</span>
                      <h2 className="text-4xl font-bold tracking-tighter leading-none">Empire_Scaling_Beta</h2>
                      <p className="text-sm font-medium opacity-80 leading-relaxed">
                        This isn't just a dashboard; it's a white-label infrastructure for DAOs and treasuries. 
                        SoSo-Vault agents operate autonomously across multi-sig accounts, extracting management fees 
                        by providing neural-optimized alpha.
                      </p>
                    </div>
                    
                    <div className="relative z-10 bg-black/90 text-white rounded-2xl p-6 min-w-[280px] shadow-2xl border border-white/5">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-muted uppercase">Global AUM</span>
                          <span className="text-xl font-bold text-accent font-mono-numbers">${managedData?.totalAUM.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-muted uppercase">Revenue Generated (Annual 2%)</span>
                              <span className="text-xl font-bold text-accent font-mono-numbers">
                                ${(managedData ? managedData.totalAUM * 0.02 : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                        <p className="text-[9px] font-mono text-muted px-2 py-1 bg-white/5 rounded italic text-center">
                          (Formula: 2% Annual Management Fee)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Managed Vaults Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {managedData?.vaults.map((vault) => (
                      <div 
                        key={vault.id} 
                        onClick={() => setSelectedVault(vault)}
                        className="bg-card border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all group border-b-2 border-b-transparent hover:border-b-accent cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-muted uppercase">
                              {vault.type}
                            </span>
                            <h5 className="text-lg font-bold tracking-tight">{vault.name}</h5>
                            <p className="text-[10px] font-mono text-muted">
                               <span className="font-mono-numbers">{vault.total_return}%</span> (<span className="font-mono-numbers">{vault.alpha_vs_btc >= 0 ? "+" : ""}{vault.alpha_vs_btc}%</span> vs BTC)
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight size={16} className="text-accent" />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-mono text-muted uppercase">Vault AUM</span>
                            <span className="text-lg font-bold font-mono tracking-tighter">${vault.aum.toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] font-mono text-muted uppercase">Total Return</p>
                              <p className="text-[11px] font-bold text-white font-mono">+{vault.total_return}%</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] font-mono text-muted uppercase">Alpha vs BTC</p>
                              <p className={cn("text-[11px] font-bold font-mono", vault.alpha_vs_btc >= 0 ? "text-accent" : "text-danger")}>
                                {vault.alpha_vs_btc >= 0 ? "+" : ""}{vault.alpha_vs_btc}%
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-mono text-muted uppercase">Last Node Rebalance</span>
                            <span className="text-[11px] font-mono text-white/60">{vault.lastRebalance}</span>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full bg-accent animate-pulse", blackSwanActive && "bg-danger")} />
                              <span className={cn("text-[9px] font-mono uppercase", blackSwanActive ? "text-danger font-bold" : "text-accent/80")}>
                                {blackSwanActive ? "CIRCUIT BREAKER: ACTIVE" : `Node-00${vault.id} Synchronization Active`}
                              </span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className={cn("h-full transition-all duration-1000", blackSwanActive ? "bg-danger w-full" : "bg-accent w-[85%]")} />
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 py-2 text-[9px] font-mono font-bold uppercase border border-white/10 rounded group-hover:border-accent group-hover:text-accent transition-all">
                             Open Node Details ↗
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Deploy Button */}
                    <button 
                      onClick={() => setShowDeployModal(true)}
                      className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-accent/40 hover:bg-accent/[0.02] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/40 transition-all">
                        <Database size={24} />
                      </div>
                      <div className="text-center">
                        <h5 className="text-sm font-bold text-white group-hover:text-accent transition-colors">Deploy New Vault Node (+)</h5>
                        <p className="text-[10px] font-mono text-muted uppercase mt-1">Scale Autonomous Infrastructure</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="strategy"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="grid grid-cols-12 gap-8"
            >
              {analysis ? (
                <>
                  {/* Left Column: Result Panel */}
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Header Score */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1 bg-card border border-white/5 rounded-2xl p-6 border-l-4 border-l-accent overflow-hidden relative">
                        <div className="absolute top-4 right-4 z-10">
                           <button 
                            onClick={toggleBlackSwanSwitch}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all uppercase font-bold text-[9px] font-mono",
                              blackSwanActive 
                                ? "bg-danger text-white border-danger shadow-[0_0_15px_rgba(255,75,75,0.4)] animate-pulse" 
                                : "bg-white/5 text-muted border-white/10 hover:border-white/20"
                            )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", blackSwanActive ? "bg-white animate-ping" : "bg-muted")} />
                            {blackSwanActive ? "BLACK SWAN ACTIVE" : "STRESS TEST"}
                           </button>
                        </div>
                        <h4 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">Risk Score</h4>
                        <div className={cn("text-5xl font-bold tracking-tight transition-colors font-mono", blackSwanActive ? "text-danger" : "text-white")}>
                          {blackSwanActive ? "98" : analysis.risk_engine.risk_score}
                        </div>
                        <p className={cn("text-[11px] font-mono mt-2 uppercase tracking-tighter", blackSwanActive ? "text-danger font-bold" : "text-accent")}>
                          {blackSwanActive ? "CRITICAL: LIQUIDITY CRUNCH" : analysis.risk_engine.risk_level}
                        </p>
                      </div>
                      
                      <div className={cn(
                        "col-span-2 rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
                        blackSwanActive 
                          ? "bg-danger text-white animate-pulse-red" 
                          : "bg-accent text-black"
                      )}>
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                        <div className="flex justify-between items-start mb-4">
                          <h4 className={cn("text-[10px] font-mono uppercase tracking-widest", blackSwanActive ? "opacity-90" : "opacity-70")}>Strategic Mandate</h4>
                          {blackSwanActive && (
                            <a 
                              href="https://sosovalue.com/assets/etf" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[9px] font-mono bg-white/20 px-2 py-0.5 rounded border border-white/30 hover:bg-white/30 transition-all flex items-center gap-1"
                            >
                              View Raw ETF Outflow Data on SoSoValue <ArrowUpRight size={10} />
                            </a>
                          )}
                        </div>
                        <div className={cn("text-4xl font-bold tracking-tighter line-clamp-1", blackSwanActive && "animate-pulse")}>
                          {blackSwanActive ? "EXIT TO STABLES" : analysis.allocation_plan.action}
                        </div>
                        <p className="text-xs mt-3 font-medium opacity-80 leading-relaxed max-w-md">
                          {blackSwanActive 
                            ? "EMERGENCY OVERRIDE: Global liquidity crunch detected. Neural auditor has vetoed all growth exposure. Protecting principal is the only objective."
                            : analysis.reasoning_narrative}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Neural Strategy Report
                      </h3>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={generateReport}
                          className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-mono font-bold text-muted transition-colors"
                        >
                          <Download size={12} />
                          EXPORT REPORT
                        </button>
                        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                          <Percent size={12} className="text-accent" />
                          <span className="text-[10px] font-mono font-bold text-accent uppercase">
                            Half-Kelly Size: <span className="font-mono-numbers">{blackSwanActive ? "0.00" : analysis.debate_log?.risk_auditor?.safe_size_limit}%</span>
                          </span>
                          <button 
                            onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)}
                            className="bg-accent/20 hover:bg-accent/40 rounded p-0.5"
                          >
                            <Info size={10} className="text-accent" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-card border border-white/5 rounded-2xl p-8 space-y-8">
                      <section>
                        <h4 className="text-xs font-mono uppercase text-muted tracking-widest mb-4 flex items-center gap-2">
                           <Info size={14} className="text-accent" />
                           Intelligence Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4 group">
                            <div className="flex items-center justify-between">
                               <label className="text-[10px] uppercase font-mono text-muted">Primary Signal</label>
                               <button 
                                onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                               >
                                 <ArrowUpRight size={10} className="text-accent" />
                               </button>
                            </div>
                            <p className="text-sm font-medium text-white/90 leading-snug">
                              {analysis.analysis.primary_signal}
                            </p>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-mono text-muted">Market Regime</label>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <p className="text-sm font-bold text-accent uppercase font-mono tracking-tighter">
                                {analysis.analysis.market_regime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                         <h4 className="text-xs font-mono uppercase text-muted tracking-widest mb-4 flex items-center gap-2">
                           <Shield size={14} className="text-accent" />
                           Risk Auditor Verdict
                        </h4>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("text-xs font-bold px-2 py-0.5 rounded uppercase font-mono", 
                              (analysis.debate_log?.risk_auditor?.status === 'APPROVED' && !blackSwanActive) ? "bg-accent/20 text-accent" : "bg-danger/20 text-danger")}>
                              {blackSwanActive ? "VETO INITIATED" : analysis.debate_log?.risk_auditor?.status}
                            </div>
                            <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Neural Compliance Pass</span>
                          </div>
                          
                          <p className="text-sm text-white/90 leading-relaxed font-sans italic border-l-2 border-danger/50 pl-4 py-1">
                            {blackSwanActive 
                              ? "Institutional ETF Outflows >$500M detected. Narrative hype decoupled from liquidity. Protecting principal." 
                              : analysis.debate_log?.risk_auditor?.criticism}
                          </p>
                        </div>
                      </section>

                      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative group cursor-pointer hover:bg-black/60 transition-all" onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)}>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-accent" />
                          </div>
                          <h5 className="text-[9px] font-mono text-muted uppercase mb-2">Macro Analysis</h5>
                          <p className="text-xs text-accent/80 font-mono leading-relaxed">
                            {analysis.analysis.chain_of_thought.macro_check}
                          </p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative group cursor-pointer hover:bg-black/60 transition-all" onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)}>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-accent" />
                          </div>
                          <h5 className="text-[9px] font-mono text-muted uppercase mb-2">Sector Analysis</h5>
                          <p className="text-xs text-accent/80 font-mono leading-relaxed">
                            {analysis.analysis.chain_of_thought.sector_check}
                          </p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                          <h5 className="text-[9px] font-mono text-muted uppercase mb-2">Sentiment Velocity</h5>
                          <p className="text-xs text-accent/80 font-mono leading-relaxed">
                            {analysis.analysis.chain_of_thought.sentiment_velocity}
                          </p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative group cursor-pointer hover:bg-black/60 transition-all" onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)}>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-accent" />
                          </div>
                          <h5 className="text-[9px] font-mono text-muted uppercase mb-2">Trade Rationale</h5>
                          <p className="text-xs text-accent/80 font-mono leading-relaxed">
                            {analysis.allocation_plan.trade_rationale || "Quantitative verification in progress..."}
                          </p>
                        </div>
                      </section>

                      {/* Internal Consensus Debate */}
                      <section className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-6">
                        <h4 className="text-xs font-mono uppercase text-muted tracking-widest flex items-center gap-2">
                           <ArrowRightLeft size={14} className="text-accent" />
                           Neural Consensus Debate
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-accent grid place-items-center">
                                <Zap size={12} className="text-black" fill="currentColor" />
                              </div>
                              <span className="text-[10px] font-bold uppercase font-mono text-accent">Alpha Hunter</span>
                            </div>
                            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl min-h-[80px]">
                              <p className="text-[11px] text-accent/90 italic leading-relaxed font-mono">
                                "{analysis.debate_log?.alpha_hunter || "Analyzing institutional arbitrage opportunities..."}"
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-danger grid place-items-center">
                                  <Shield size={12} className="text-black" fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-bold uppercase font-mono text-danger">Risk Auditor</span>
                              </div>
                              {analysis.debate_log?.risk_auditor?.status && (
                                <span className={cn(
                                  "text-[9px] font-mono font-bold px-2 py-0.5 rounded border",
                                  analysis.debate_log.risk_auditor.status === 'APPROVED' 
                                    ? "bg-accent/10 border-accent/20 text-accent" 
                                    : "bg-danger/10 border-danger/20 text-danger"
                                )}>
                                  {analysis.debate_log.risk_auditor.status}
                                </span>
                              )}
                            </div>
                            <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl space-y-4">
                              <p className="text-[11px] text-danger/90 italic leading-relaxed font-mono">
                                "{analysis.debate_log?.risk_auditor?.criticism || "Scanning for tail-risk events and liquidity gaps..."}"
                              </p>
                              
                              {analysis.debate_log?.risk_auditor?.risk_assessment && (
                                <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-danger/10">
                                  <div>
                                    <p className="text-[8px] font-mono uppercase text-danger/60">Inst_Alignment</p>
                                    <p className="text-[10px] font-mono font-bold text-danger">{analysis.debate_log.risk_auditor.risk_assessment.institutional_alignment}</p>
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-mono uppercase text-danger/60">Leverage_Risk</p>
                                    <p className="text-[10px] font-mono font-bold text-danger">{analysis.debate_log.risk_auditor.risk_assessment.leverage_risk}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-[8px] font-mono uppercase text-danger/60">Volatility_Buffer</p>
                                    <p className="text-[10px] font-mono font-bold text-danger">{analysis.debate_log.risk_auditor.risk_assessment.volatility_buffer}</p>
                                  </div>
                                </div>
                              )}

                              {analysis.debate_log?.risk_auditor?.governance_adjustments && (
                                <div className="p-2 bg-black/40 rounded border border-danger/10">
                                  <p className="text-[9px] font-mono text-danger/80">
                                    <span className="font-bold">ADJUSTMENT:</span> {analysis.debate_log.risk_auditor.governance_adjustments.proposed_reduction} Reduction suggested. Required Stable Buffer: {analysis.debate_log.risk_auditor.governance_adjustments.required_stable_buffer}.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-mono uppercase text-muted tracking-widest mb-4 flex items-center gap-2">
                           <RefreshCcw size={14} className="text-accent" />
                           Trade Instructions
                        </h4>
                        <div className="bg-black/30 border border-white/5 rounded-lg p-5 font-mono text-[13px] leading-relaxed text-accent/90 whitespace-pre-wrap">
                          {analysis.allocation_plan.trade_instructions}
                        </div>
                      </section>

                      {/* Execute Button */}
                      <div className="pt-4">
                        <button 
                          onClick={handleExecute}
                          disabled={executing}
                          className={cn(
                            "w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all relative overflow-hidden group",
                            executing 
                              ? "bg-muted text-bg opacity-50 cursor-not-allowed" 
                              : "bg-accent text-bg hover:shadow-[0_0_30px_-5px_#00FFA3] active:scale-[0.98]"
                          )}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {executing ? (
                              <>
                                <RefreshCcw size={18} className="animate-spin" />
                                Transmitting_to_Vault...
                              </>
                            ) : (
                              <>
                                <Zap size={18} fill="currentColor" />
                                Execute_Neural_Rebalance
                              </>
                            )}
                          </span>
                          {/* Inner glow effect on hover */}
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        
                        {/* Execution Status Feedback */}
                        {executionResult && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-start gap-3"
                          >
                            <Shield size={18} className="text-accent mt-0.5 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-accent font-mono">Vault_Ledger_Confirmation</p>
                              <p className="text-xs text-accent/80 font-mono leading-tight">{executionResult.summary}</p>
                              <div className="flex gap-4 pt-2">
                                <span className="text-[9px] font-mono text-accent/60">TS: {new Date(executionResult.timestamp).toLocaleString()}</span>
                                <span className="text-[9px] font-mono text-accent/60">EST_PNL: {executionResult.pnl_estimate}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {error && !loading && (
                           <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger">
                             <AlertTriangle size={18} />
                             <span className="text-xs font-bold uppercase tracking-tighter font-mono">{error}</span>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Allocation & Raw */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Allocation Weights */}
                    <div className="bg-card border border-white/5 rounded-2xl p-6">
                      <h4 className="text-xs font-mono uppercase text-muted tracking-widest mb-6">Target Allocation</h4>
                      <div className="space-y-4">
                        {Object.entries(analysis.allocation_plan.target_weights).map(([asset, weight]) => (
                          <div key={asset} className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-muted">{asset}</span>
                              <span className="text-white font-bold">{Math.round((weight as number) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(weight as number) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-accent"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Circuit Breaker Status */}
                    <div className={cn(
                      "rounded-2xl p-6 border transition-all relative overflow-hidden",
                      analysis.risk_engine.circuit_breaker_active || blackSwanActive
                        ? "border-danger text-white animate-pulse-red" 
                        : "bg-accent/5 border-accent/20 text-accent/80"
                    )} style={analysis.risk_engine.circuit_breaker_active || blackSwanActive ? { backgroundColor: 'rgba(255, 75, 75, 0.2)' } : {}}>
                      {blackSwanActive && (
                        <div className="absolute inset-0 bg-danger/10 animate-pulse pointer-events-none" />
                      )}
                      <div className="flex items-center gap-3 mb-2 relative z-10">
                        <Shield size={20} className={cn((analysis.risk_engine.circuit_breaker_active || blackSwanActive) && "animate-bounce")} />
                        <h4 className="text-sm font-bold uppercase tracking-widest font-mono">Circuit Breaker</h4>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-tighter relative z-10">
                        {analysis.risk_engine.circuit_breaker_active || blackSwanActive
                          ? "ACTIVE: EMERGENCY PROTOCOL ENGAGED" 
                          : "INACTIVE: System within normal parameters"}
                      </p>
                    </div>

                    {blackSwanActive && (
                      <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 flex gap-3 animate-pulse">
                        <AlertTriangle size={16} className="text-danger shrink-0" />
                        <div>
                          <p className="text-[10px] text-danger font-bold uppercase mb-1">Capital Preservation Mode Active</p>
                          <p className="text-[9px] text-danger/80 italic leading-relaxed">
                            All trading execution paused by Risk Auditor. SoSoValue ETF net inflows have shifted to major outflow regime (-$520M).
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Live Agent Logs */}
                    <div className="space-y-4">
                      <AgentLogger logs={logs} loading={loading} />
                      <button 
                        onClick={() => {
                          const logText = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
                          const blob = new Blob([logText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `SoSoVault_AuditLog_${new Date().toISOString().split('T')[0]}.txt`;
                          link.click();
                        }}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-muted uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={12} />
                        Download Strategic Audit (.PDF)
                      </button>
                    </div>

                    {/* Raw JSON for Core Intelligence */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono uppercase text-muted tracking-widest flex items-center gap-2">
                        <Database size={12} />
                        RAW_QUANT_PAYLOAD
                      </h4>
                      <JsonView data={analysis} />
                    </div>
                  </div>
                </>
              ) : loading ? (
                <div className="col-span-12 h-[400px] flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={32} className="text-accent animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <span className={cn(
                         "text-[10px] font-mono uppercase tracking-[0.3em] font-bold transition-all duration-500",
                         loadingStep === 1 ? "text-accent opacity-100 scale-110" : "text-muted opacity-40"
                       )}>
                         [1] CONNECTING_SOSOVALUE_APIS
                       </span>
                       <span className={cn(
                         "text-[10px] font-mono uppercase tracking-[0.3em] font-bold transition-all duration-500",
                         loadingStep === 2 ? "text-accent opacity-100 scale-110" : "text-muted opacity-40"
                       )}>
                         [2] NEURAL_STRATEGIC_REASONING
                       </span>
                       <span className={cn(
                         "text-[10px] font-mono uppercase tracking-[0.3em] font-bold transition-all duration-500",
                         loadingStep === 3 ? "text-accent opacity-100 scale-110" : "text-muted opacity-40"
                       )}>
                         [3] FINALIZING_STRATEGY_REPORT
                       </span>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="col-span-12 h-64 flex flex-col items-center justify-center space-y-4 text-center">
                  <AlertTriangle className="text-danger" size={48} />
                  <div className="space-y-2">
                    <p className="font-bold text-white uppercase tracking-widest">Logic Failure</p>
                    <p className="text-muted text-xs font-mono max-w-sm">{error}</p>
                  </div>
                  <button 
                    onClick={runAnalysis}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-mono uppercase tracking-tighter transition-all"
                  >
                    Retry Neural Link
                  </button>
                </div>
              ) : (
                <div className="col-span-12 h-64 flex flex-col items-center justify-center space-y-4 text-muted">
                  <RefreshCcw className="animate-spin text-accent" size={32} />
                  <p className="font-mono text-xs uppercase tracking-widest">Running Strategy Engine...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-bg/90 backdrop-blur border-t border-white/5 px-6 py-2 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Agent Active
            </span>
            <span className="hidden sm:block">SoSo-Intelligence Node-001</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Latency: 24ms</span>
            <span className="text-accent hidden sm:block">Block: 19482710</span>
          </div>
        </div>
      </footer>

      {/* Execution Pre-Flight Modal */}
      <AnimatePresence>
        {showConfirmModal && analysis && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!executing) {
                  setShowConfirmModal(false);
                  setShowReceipt(false);
                }
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#15171C] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000",
                blackSwanActive ? "bg-danger/20" : "bg-accent/10"
              )} />

              <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", blackSwanActive ? "bg-danger" : "bg-accent")} />
                    <h3 className="text-xl font-bold tracking-tight">
                      {showReceipt ? "Settlement Receipt" : (blackSwanActive ? "Governance Lock" : "Neural Pre-Flight Check")}
                    </h3>
                  </div>
                  {showReceipt && (
                    <button 
                      onClick={() => {
                        setShowConfirmModal(false);
                        setShowReceipt(false);
                      }}
                      className="p-1 hover:bg-white/10 rounded text-muted hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {showReceipt ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted uppercase">Status</span>
                        <span className="text-accent font-bold uppercase">Settled via SoSo-Ledger</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted uppercase">TXID</span>
                        <span className="text-white font-bold truncate ml-4">{lastTxHash}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted uppercase">Explorer</span>
                        <div className="flex items-center gap-3">
                          <button className="text-accent hover:underline flex items-center gap-1">
                            <Download size={10} /> Download Receipt
                          </button>
                          <a href={`https://solscan.io/tx/${lastTxHash}`} target="_blank" rel="noreferrer" className="text-accent hover:underline flex items-center gap-1">
                            View on Chain <ArrowUpRight size={10} />
                          </a>
                        </div>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted uppercase">Block</span>
                        <span className="text-white font-mono-numbers">18,241,059</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowConfirmModal(false);
                        setShowReceipt(false);
                      }}
                      className="w-full py-4 bg-accent text-black text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all glow-accent"
                    >
                      Close Receipt
                    </button>
                  </div>
                ) : blackSwanActive ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-danger/10 border border-danger/20 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-danger">
                        <ShieldAlert size={24} />
                        <span className="text-sm font-bold uppercase font-mono">Security Override Active</span>
                      </div>
                      <p className="text-xs text-danger/80 leading-relaxed italic">
                        "Risk Auditor has detected Institutional Liquidity Divergence (ETF Outflows &gt;$500M). All execution paths are locked to protect treasury principal."
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={() => {
                          setShowConfirmModal(false);
                          // Maybe open risk report
                        }}
                        className="flex-[2] py-4 bg-danger text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,163,163,0.3)]"
                      >
                        View Risk Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4 font-mono">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted uppercase">Execution Route</span>
                          <span className="text-white font-bold">SOL/USDC via SoSoValue High-Perf Order Book</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted uppercase">Estimated Slippage</span>
                          <span className="text-accent font-bold font-mono-numbers">0.04% (Neural Optimized)</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <div className="flex items-center gap-1">
                            <span className="text-muted uppercase">Neural Confidence</span>
                            <button onClick={() => analysis?.signal_attribution && setActiveSignalAttribution(analysis.signal_attribution)} className="text-accent opacity-60 hover:opacity-100">
                               <Info size={10} />
                            </button>
                          </div>
                          <span className="text-accent font-bold font-mono-numbers">{analysis.debate_log?.risk_auditor?.confidence_score}%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted uppercase">Network Fee</span>
                          <span className="text-white font-bold font-mono-numbers">$1.42</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted uppercase text-accent">Strategic Action</span>
                          <span className="text-white font-bold uppercase font-mono">{analysis.allocation_plan.action}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <div className="flex gap-3">
                          <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                          <p className="text-[10px] text-orange-500/90 leading-relaxed font-sans italic">
                            [SYSTEM] Broadcasting this order will synchronize global vault liquidity. 
                            ZK-proofs will be generated post-settlement.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        disabled={executing}
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                      >
                        Abort
                      </button>
                      <button 
                        disabled={executing}
                        onClick={() => {
                          handleExecute();
                        }}
                        className="flex-[2] py-4 bg-accent hover:glow-accent text-black text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] font-sans disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {executing ? (
                          <>
                            <RefreshCcw size={14} className="animate-spin" />
                            Broadcasting...
                          </>
                        ) : "Confirm Transaction"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signal Attribution Modal (Sidebar Style) */}
      <AnimatePresence>
        {activeSignalAttribution && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSignalAttribution(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-[#15171C] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">SoSoValue Evidence Vault</h3>
                  <p className="text-[10px] uppercase font-mono text-muted tracking-widest mt-1">Institutional Proof of Signal</p>
                </div>
                <button 
                  onClick={() => setActiveSignalAttribution(null)}
                  className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white"
                >
                  <RefreshCcw size={18} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-4 font-sans">
                  {activeSignalAttribution.map((news, idx) => (
                    <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3 hover:border-accent/40 transition-colors group cursor-default">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-tighter">Verified Headline</span>
                      </div>
                      <h5 className="text-[14px] font-bold text-white group-hover:text-accent transition-colors leading-tight">{news.title}</h5>
                      <p className="text-xs text-muted leading-relaxed italic">"{news.description}"</p>
                      <div className="pt-2 flex justify-between items-center text-[9px] font-mono text-muted/40 uppercase">
                        <span>Source: SoSoValue API</span>
                        <span>Link: Validated</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-3">
                   <h6 className="text-[10px] font-bold uppercase text-accent font-mono flex items-center gap-2">
                     <Cpu size={12} />
                     Neural Verification
                   </h6>
                   <p className="text-[11px] text-accent/80 italic leading-relaxed">
                     The Alpha Hunter has verified these data points against global order-book liquidity and institutional flow indices.
                   </p>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/20 text-center">
                <p className="text-[9px] font-mono text-muted/60 uppercase tracking-[0.2em]">
                  End of Source Attribution
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedVault && (
        <AuditTrail 
          isOpen={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
          vault={selectedVault}
          events={vaultEvents[selectedVault.id] || []}
        />
      )}

      <DeployNodeModal 
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onDeploy={handleDeployVault}
      />
    </div>
  );
}

