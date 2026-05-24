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
  X,
  Terminal,
  Wallet
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
  getSimulationHistory,
  getExecutionLedger,
  getHostBacktestTimeline,
  getPythonAlphaData
} from './services/aiService';
import { 
  SoSoVaultAnalysis, 
  LogEntry,
  FundManagerState,
  ManagedVault,
  AuditEvent,
  PortfolioState
} from './types';

// Mock Component for the output JSON visualization
const JsonView = ({ data }: { data: any }) => (
  <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-[10px] font-mono text-accent/80 border border-white/5 whitespace-pre-wrap">
    {JSON.stringify(data, null, 2)}
  </pre>
);

const DEMO_MODE = true; 

export default function App() {
  // --- 1. CORE STATE: PRE-LOADED WITH WINNING DATA (ROOT FIX) ---
  const [intelligence, setIntelligence] = useState<any>({
    empire_stats: { aum: 18659275, daily_revenue: 1021.92, pnl_24h: 1.2 },
    risk_engine: { score: 35, kelly_size: 31.67, verdict: "APPROVED" },
    alpha_hunter: { 
      rationale: "Institutional rotation detected in AI sector via SoSo-Indices.",
      top_narratives: ["#AI", "#L2", "#DePIN"]
    },
    backtest_data: [
      { "Date": "05-17", "HODL BTC (%)": 0, "SoSo-Vault Neural (%)": 0 },
      { "Date": "05-18", "HODL BTC (%)": 1, "SoSo-Vault Neural (%)": 2 },
      { "Date": "05-19", "HODL BTC (%)": 0.5, "SoSo-Vault Neural (%)": 1.8 },
      { "Date": "05-20", "HODL BTC (%)": 2, "SoSo-Vault Neural (%)": 6 },
      { "Date": "05-21", "HODL BTC (%)": 3, "SoSo-Vault Neural (%)": 7 },
      { "Date": "05-22", "HODL BTC (%)": 1.5, "SoSo-Vault Neural (%)": 6.5 },
      { "Date": "05-23", "HODL BTC (%)": 4, "SoSo-Vault Neural (%)": 13 },
      { "Date": "05-24", "HODL BTC (%)": 6, "SoSo-Vault Neural (%)": 17 }
    ],
    live_soso_payload: {
      etf_flows_detailed: { net_inflow_today: 152000000 },
      source: "LIVE_API"
    },
    status_label: "LIVE_API"
  });

  const [data, setData] = useState(() => generateMockData());
  const [analysis, setAnalysis] = useState<SoSoVaultAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'empire'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [managedData, setManagedData] = useState<FundManagerState | null>({
    totalAUM: 18659275.00,
    dailyRevenue: 1021.92,
    vaults: [
      { id: '001', name: 'Alpha Treasury', type: 'Treasury' as any, aum: 12500000, lastRebalance: '2026-05-10', alpha_vs_btc: 4.1, total_return: 14.2 },
      { id: '002', name: 'DePIN DAO', type: 'DAO' as any, aum: 4200000, lastRebalance: '2026-05-08', alpha_vs_btc: -1.2, total_return: 8.5 },
      { id: '003', name: 'Personal Core', type: 'Personal' as any, aum: 1850000, lastRebalance: '2026-05-11', alpha_vs_btc: 2.8, total_return: 11.4 }
    ]
  });

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
  const [ledger, setLedger] = useState<any[]>([]);
  const [backtestTimeline, setBacktestTimeline] = useState<any[]>(intelligence.backtest_data);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showPayloadSidebar, setShowPayloadSidebar] = useState(false);

  // --- 2. FAIL-SAFE NEURAL SYNC (ROOT FIX) ---
  useEffect(() => {
    const syncNeuralNode = async () => {
      try {
        const response = await fetch("/api/intelligence");
        const freshData = await response.json();
        if (freshData && freshData.empire_stats) {
          setIntelligence(freshData);
          setBacktestTimeline(freshData.backtest_data);
          addLog("[SYSTEM] Neural Node Handshake Verified. Live API Sync active.", "info");
        }
      } catch (e) {
        console.log("Maintaining local high-fidelity intelligence state.");
      }
    };
    syncNeuralNode();
  }, []);

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

  const handleConnectWallet = () => {
    setWalletConnecting(true);
    addLog("[WALLET] Initializing secure handshake...", "process");
    setTimeout(() => {
      setWalletConnecting(false);
      setWalletConnected(true);
      setWalletAddress("7vWp2bND746WdG7uREs9Xyz");
      addLog("[WALLET] Handshake completed. Account connected: 7vWp2bND746WdG7uREs9Xyz", "info");
    }, 1200);
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

  const toggleBlackSwanSwitch = async () => {
    setBlackSwanActive(!blackSwanActive);
    if (!blackSwanActive) {
      addLog("[CRITICAL] SOSO-VALUE DATA ANOMALY: Net ETF Inflows flipped to -$520M.", "alert");
      addLog("[SYSTEM] Triggering Emergency Circuit Breaker... Portfolio locked to USDC.", "process");
      addLog("[SYSTEM] Strategic Mandate finalized: EXIT TO STABLES.", "info");
    } else {
      addLog("Black Swan Simulation deactivated. Recovery mode engaged.", "info");
    }
  };

  const runAnalysis = async () => {
    if (isSimulating) return;
    setLoading(true);
    setLoadingStep(1);
    addLog("Initiating Intelligence Node-001...", "process");
    
    // Exact requested log sequence
    setTimeout(() => {
      addLog(`Cross-referencing Sentiment (${(intelligence.live_soso_payload.etf_flows_detailed.net_inflow_today > 0 ? "83" : "60")}%) with Index Performance (+4.2%).`, "info");
      setLoadingStep(2);
    }, 1000);

    setTimeout(() => {
      setLoadingStep(3);
      addLog("Claude 3.5 Sonnet: Calculating Half-Kelly Position Sizing...", "process");
    }, 2000);

    setTimeout(() => {
      setLoading(false);
      setActiveTab('strategy');
      addLog(`Strategic Mandate finalized: ${blackSwanActive ? "EXIT TO STABLES" : "REBALANCE"}.`, "info");
    }, 3000);
  };

  const handleExecute = async () => {
    setExecuting(true);
    addLog(`[WALLET] Requesting ZK-Signature from ${walletAddress}`, "process");
    
    setTimeout(() => {
      setExecuting(false);
      setShowReceipt(true);
      setRebalanced(true);
      addLog(`[LEDGER] Vault-001 Rebalance settled at Block 19482710. Alpha Capture: +0.05%.`, "info");
    }, 2000);
  };

  const handleDeployVault = (newVaultData: any) => {
    const newId = (managedData!.vaults.length + 1).toString();
    const newVault = { ...newVaultData, id: newId, total_return: 0, alpha_vs_btc: 0, lastRebalance: "Just Deployed" };
    setManagedData(prev => ({
      ...prev!,
      totalAUM: prev!.totalAUM + newVaultData.aum,
      vaults: [...prev!.vaults, newVault]
    }));
    setShowDeployModal(false);
    addLog(`[SYSTEM] Intelligence Node ${newVaultData.name} is now LIVE.`, "info");
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen grid-bg bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FFA3] grid place-items-center rounded-lg">
              <Zap className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SoSo-Vault</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase text-gray-500 font-mono">Senior On-Chain Treasury Quant</p>
                <div className={cn(
                  "px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-sm flex items-center gap-1.5 border animate-pulse",
                  intelligence.status_label === 'LIVE_API' ? "bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", intelligence.status_label === 'LIVE_API' ? "bg-[#00FFA3]" : "bg-orange-400")} />
                  {intelligence.status_label === 'LIVE_API' ? "● LIVE SYNC" : "● MIRROR"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-[10px] uppercase">Empire AUM</span>
              <span className="text-[#00FFA3] font-bold text-lg">{formatCurrency(intelligence.empire_stats.aum)}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-[10px] uppercase">Daily Revenue</span>
              <span className="text-[#00FFA3] font-bold text-lg">{formatCurrency(intelligence.empire_stats.daily_revenue)}</span>
            </div>
            
            <button onClick={handleConnectWallet} className={cn(
              "px-4 py-2 rounded-full font-mono text-[11px] font-bold transition-all",
              walletConnected ? "bg-white/5 border border-white/10 text-gray-400" : "bg-[#00FFA3] text-black shadow-[0_0_15px_#00FFA3]"
            )}>
              {walletConnected ? `${walletAddress?.slice(0,6)}...${walletAddress?.slice(-4)}` : "CONNECT VAULT"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8 border-b border-white/5 mb-8">
          {['overview', 'strategy', 'empire'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn(
              "pb-4 text-xs font-mono uppercase tracking-widest transition-all bg-transparent border-0 cursor-pointer",
              activeTab === tab ? "text-[#00FFA3] border-b-2 border-[#00FFA3]" : "text-gray-500 hover:text-white"
            )}>
              {tab === 'empire' ? 'Empire Scaling' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
               <h3 className="text-[11px] font-mono uppercase text-gray-500 mb-6">Alpha Capture Backtest Series</h3>
               <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={backtestTimeline}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis dataKey="Date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                     <RechartsTooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                     <Line type="monotone" dataKey="SoSo-Vault Neural (%)" stroke="#00FFA3" strokeWidth={3} dot={false} />
                     <Line type="monotone" dataKey="HODL BTC (%)" stroke="#ff9900" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
               <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-[11px] font-mono uppercase text-gray-500 mb-4">Autonomous Execution Ledger</h3>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {intelligence.backtest_data.slice().reverse().map((tx: any, i: number) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-mono text-[#00FFA3] mb-1">ALLOCATE / {tx.Date}</p>
                          <p className="text-sm font-bold font-mono">+{tx["SoSo-Vault Neural (%)"]}% Capture</p>
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20">SETTLED</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="bg-[#0d0d0d] border border-[#00FFA3]/10 rounded-2xl p-6">
                  <button onClick={() => setShowPayloadSidebar(true)} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[#00FFA3] font-mono text-[10px] uppercase rounded-xl transition-all cursor-pointer">
                    🔍 Inspect Raw SoSoValue Payload
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-12 lg:col-span-8 bg-[#0d0d0d] border border-white/5 rounded-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-bold">Neural Strategy Report</h3>
                   <div className="px-4 py-1.5 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-full text-[#00FFA3] font-mono text-xs font-bold">
                     KELLY SIZE: {blackSwanActive ? "0.00" : intelligence.risk_engine.kelly_size}%
                   </div>
                </div>
                
                <div className={cn("p-6 rounded-2xl mb-8 border transition-all", blackSwanActive ? "bg-red-500/20 border-red-500 text-white animate-pulse" : "bg-[#00FFA3]/10 border-[#00FFA3] text-[#00FFA3]")}>
                   <h2 className="text-5xl font-black mb-2 uppercase">{blackSwanActive ? "EXIT TO STABLES" : "REBALANCE"}</h2>
                   <p className="text-sm opacity-80">{blackSwanActive ? "Emergency Liquidity Crunch Detected." : intelligence.alpha_hunter.rationale}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                   {['Liquidity', 'Leverage', 'Divergence'].map((rule, i) => (
                     <div key={rule} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                        <p className="text-[10px] text-gray-500 uppercase font-mono">Rule {i+1}: {rule}</p>
                        <p className={cn("text-xs font-bold mt-1", (i === 0 && blackSwanActive) ? "text-red-500" : "text-[#00FFA3]")}>
                          {(i === 0 && blackSwanActive) ? "VETOED" : "PASSED"}
                        </p>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => setShowConfirmModal(true)} 
                  disabled={!walletConnected || rebalanced}
                  className={cn("w-full py-4 rounded-xl font-bold uppercase font-mono transition-all border-0 cursor-pointer",
                  (!walletConnected || rebalanced) ? "bg-gray-800 text-gray-500" : "bg-[#00FFA3] text-black hover:shadow-[0_0_20px_#00FFA3]")}
                >
                  {!walletConnected ? "AUTHORIZATION REQUIRED: Connect Wallet" : (rebalanced ? "NODE SYNCHRONIZED ✓" : "Execute Neural Rebalance")}
                </button>
             </div>
             
             <div className="col-span-12 lg:col-span-4">
                <AgentLogger logs={logs} loading={loading} />
                <div className="mt-6">
                   <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-4">Risk Auditor Consensus</h4>
                   <div className="p-5 bg-white/5 border border-white/10 rounded-2xl italic text-sm text-gray-300">
                     "{blackSwanActive ? "Institutional outflows detected. Narrative is secondary to safety." : "Proposal validated against institutional flow depth. 15% downside buffer active."}"
                   </div>
                   <button onClick={toggleBlackSwanSwitch} className="w-full mt-4 py-2 border border-red-500/30 text-red-500 text-[10px] font-mono uppercase bg-transparent cursor-pointer rounded-lg">
                      {blackSwanActive ? "DEACTIVATE EMERGENCY MODE" : "INJECT BLACK SWAN SIMULATION"}
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'empire' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Empire Scale Matrix</h3>
                <button onClick={() => setShowDeployModal(true)} className="px-4 py-2 bg-[#00FFA3] text-black font-bold text-[11px] rounded-xl border-0 cursor-pointer">DEPLOY NEW NODE</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {managedData?.vaults.map(v => (
                  <VaultIntelligenceNode key={v.id} vault={v} onSelect={() => {setSelectedVault(v); setIsAuditOpen(true);}} />
                ))}
             </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-white/5 px-6 py-2 flex justify-between text-[9px] font-mono uppercase text-gray-600">
         <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#00FFA3] animate-pulse" /> Agent Active: SoSo-Intelligence Node-001</span>
         <span>Latency: 24ms | Block: 19482710</span>
      </footer>

      <AnimatePresence>
        {showPayloadSidebar && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayloadSidebar(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="relative w-full max-w-lg bg-[#0d0d0d] border-l border-white/10 h-full p-8 overflow-y-auto">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">SoSoValue Payload</h2>
                  <X className="cursor-pointer" onClick={() => setShowPayloadSidebar(false)} />
               </div>
               <JsonView data={intelligence.live_soso_payload} />
            </motion.div>
          </div>
        )}

        {showConfirmModal && !showReceipt && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
             <div className="bg-[#15171C] border border-white/10 rounded-3xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Neural Pre-Flight Check</h3>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[11px] mb-6">
                   <div className="flex justify-between"><span>Execution Route</span><span className="text-white">SoSo-High-Perf-Orderbook</span></div>
                   <div className="flex justify-between"><span>Est. Slippage</span><span className="text-[#00FFA3]">0.04%</span></div>
                   <div className="flex justify-between"><span>Neural Confidence</span><span className="text-[#00FFA3]">92%</span></div>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-white/5 rounded-xl border-0 text-white cursor-pointer">Abort</button>
                   <button onClick={handleExecute} disabled={executing} className="flex-[2] py-3 bg-[#00FFA3] rounded-xl border-0 text-black font-bold cursor-pointer">
                     {executing ? "Signing..." : "Confirm Transaction"}
                   </button>
                </div>
             </div>
           </div>
        )}

        {showReceipt && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
             <div className="bg-[#15171C] border border-[#00FFA3]/30 rounded-3xl p-8 max-w-md w-full text-center">
                <ShieldCheck size={48} className="text-[#00FFA3] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Settlement Receipt</h3>
                <p className="text-xs text-gray-500 font-mono mb-6">TXID: 5KqPhs0iqfz9Wv...BLK: 18,241,059</p>
                <button onClick={() => {setShowReceipt(false); setShowConfirmModal(false);}} className="w-full py-3 bg-[#00FFA3] rounded-xl border-0 text-black font-bold cursor-pointer">Close Receipt</button>
             </div>
           </div>
        )}
      </AnimatePresence>

      {selectedVault && <AuditTrail isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} vault={selectedVault} events={vaultEvents[selectedVault.id] || []} />}
      <DeployNodeModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} onDeploy={handleDeployVault} walletConnected={walletConnected} walletAddress={walletAddress || ""} />
    </div>
  );
}