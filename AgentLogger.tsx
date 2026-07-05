import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  RefreshCcw, 
  Activity, 
  Settings,
  Database,
  Info,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { ManagedVault, AuditEvent } from './types';

interface VaultIntelligenceNodeProps {
  vault: ManagedVault;
  onBack: () => void;
  blackSwanActive: boolean;
  onAddLog: (message: string, type: 'info' | 'alert' | 'process') => void;
  onOpenAudit: () => void;
  onAddVaultEvent: (event: Omit<AuditEvent, 'id'>) => void;
}

// Mock holdings data for different vault types
const getMockHoldings = (type: string, name: string) => {
  const isDePIN = name.toUpperCase().includes('DEPIN') || type === 'DAO';
  const isAlpha = name.toUpperCase().includes('ALPHA') || type === 'Alpha';
  const isPersonal = type === 'Personal' && !isAlpha && !isDePIN;

  // For "Diversified Growth" (default or specifically named ones)
  const isGrowth = !isDePIN && !isAlpha && !isPersonal;

  const getRandomDrift = () => (Math.random() * 6 + 2).toFixed(1);

  if (isDePIN) {
    return [
      { asset: 'RNDR', balance: 8420, value: 84200, performance: 12.5, weight: 25, target: 25, drift: getRandomDrift() },
      { asset: 'FIL', balance: 12400, value: 68200, performance: -2.1, weight: 20, target: 20, drift: getRandomDrift() },
      { asset: 'HNT', balance: 42000, value: 54600, performance: 8.4, weight: 15, target: 20, drift: getRandomDrift() },
      { asset: 'THETA', balance: 15000, value: 45000, performance: 1.5, weight: 15, target: 15, drift: getRandomDrift() },
      { asset: 'SOL', balance: 1524.2, value: 243872, performance: 4.2, weight: 15, target: 10, drift: getRandomDrift() },
      { asset: 'USDC', balance: 34200, value: 34200, performance: 0, weight: 10, target: 10, drift: 0 },
    ];
  }

  if (isAlpha) {
    return [
      { asset: 'BTC', balance: 12.5, value: 812500, performance: 2.1, weight: 60, target: 55, drift: getRandomDrift() },
      { asset: 'ETH', balance: 142.8, value: 428400, performance: 1.8, weight: 25, target: 30, drift: getRandomDrift() },
      { asset: 'SOL', balance: 850.5, value: 136080, performance: -0.5, weight: 10, target: 10, drift: getRandomDrift() },
      { asset: 'USDC', balance: 68000, value: 68000, performance: 0, weight: 5, target: 5, drift: 0 },
    ];
  }

  if (isGrowth) {
    return [
      { asset: 'SOL', balance: 800, value: 128000, performance: 5.4, weight: 30, target: 25, drift: getRandomDrift() },
      { asset: 'LINK', balance: 4500, value: 81000, performance: 3.2, weight: 25, target: 25, drift: getRandomDrift() },
      { asset: 'ARB', balance: 32000, value: 38400, performance: -1.2, weight: 20, target: 20, drift: getRandomDrift() },
      { asset: 'PENDLE', balance: 12000, value: 72000, performance: 15.8, weight: 25, target: 30, drift: getRandomDrift() },
    ];
  }

  // Conservative/Personal
  return [
    { asset: 'BTC', balance: 0.8, value: 52000, performance: 1.2, weight: 30, target: 30, drift: getRandomDrift() },
    { asset: 'ETH', balance: 12.5, value: 38750, performance: 0.8, weight: 30, target: 25, drift: getRandomDrift() },
    { asset: 'USDC', balance: 48000, value: 48000, performance: 0, weight: 40, target: 45, drift: 0 },
  ];
};

const getAlphaCurveData = (vaultName: string) => {
  // Generate slightly different curves
  const seed = vaultName.length;
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    pnl: Math.sin((i + seed) * 0.3) * 5 + (i * 0.2) + 10
  }));
};

export const VaultIntelligenceNode: React.FC<VaultIntelligenceNodeProps> = ({ vault, onBack, blackSwanActive, onAddLog, onOpenAudit, onAddVaultEvent }) => {
  const [holdings] = useState(getMockHoldings(vault.type, vault.name));
  const [pnlData] = useState(getAlphaCurveData(vault.name));
  const [drawdown, setDrawdown] = useState(15);
  const [frequency, setFrequency] = useState('Neural');
  const [strictness, setStrictness] = useState('Moderate');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate governance handshake
    await new Promise(r => setTimeout(r, 2000));
    
    onAddLog(`[GOVERNANCE] Received updated mandate for Node: ${vault.name}`, "info");
    onAddLog(`[GOVERNANCE] Max Drawdown recalibrated to ${drawdown}%`, "process");
    onAddLog(`[GOVERNANCE] Auditor Strictness set to: ${strictness}`, "info");
    onAddLog("[SYSTEM] Parameters synchronized with SoSoValue Liquidity Layer", "info");
    
    onAddVaultEvent({
      timestamp: new Date().toLocaleString(),
      action: 'GOVERNANCE',
      signal: `User updated mandate for Node: ${vault.name}`,
      verdict: `Max Drawdown recalibrated to ${drawdown}%. Auditor Strictness set to: ${strictness}. New guardrails active.`,
      payload: { drawdown, frequency, strictness, timestamp: new Date().toISOString() }
    });

    setLastSync(new Date().toLocaleTimeString());
    setIsSyncing(false);
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 3000);
  };

  const isRiskHigh = drawdown < 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10 group"
          >
            <ArrowLeft size={20} className="text-muted group-hover:text-white transition-colors" />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted">
            <span className="hover:text-accent cursor-pointer uppercase" onClick={onBack}>EMPIRE</span>
            <span className="opacity-30">/</span>
            <span className="text-white uppercase">{vault.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            <div className={cn("w-1.5 h-1.5 rounded-full bg-accent animate-pulse", blackSwanActive && "bg-danger")} />
            <span className={cn("text-[9px] font-mono font-bold uppercase", blackSwanActive ? "text-danger" : "text-accent")}>
              NODE-00{vault.id} SYNCHRONIZATION: 99.9%
            </span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg border border-white/10 text-muted hover:text-white transition-all">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-end justify-between gap-8 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">{vault.name} Intelligence Node</h2>
          <p className="text-muted text-xs font-medium uppercase tracking-widest">Autonomous Treasury Management via SoSo-Vault Agent v4.2</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted">Total Node AUM</p>
          <p className="text-xl font-bold font-mono tracking-tight text-accent mt-1">${vault.aum.toLocaleString()}</p>
          {vault.ownerAddress && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted mt-2">
              BOUND OWNER: <span className="text-accent underline font-bold font-mono text-[10px]">{vault.ownerAddress.slice(0, 6)}...{vault.ownerAddress.slice(-4)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Holdings Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#00FFA3] transition-colors">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                 <Database size={14} className="text-accent" />
                 Neural Holdings Table
               </h3>
               <div className="flex items-center gap-2 text-[10px] text-muted font-mono uppercase">
                 <motion.div 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ duration: 5, repeat: Infinity }}
                   className="w-1.5 h-1.5 rounded-full bg-accent" 
                 />
                 <Activity size={12} className="text-accent" />
                 Live Reconciliation
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest font-bold">Asset</th>
                    <th className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">Balance</th>
                    <th className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">USD Value</th>
                    <th className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">24h Perf</th>
                    <th className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">Drift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {holdings.map((h: any) => (
                    <tr key={h.asset} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 grid place-items-center font-bold text-xs text-accent">
                            {h.asset[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-accent transition-colors font-mono">{h.asset}</p>
                            <p className="text-[9px] text-muted uppercase tracking-widest font-mono">Native Chain</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <span className="font-mono text-white/80">{h.balance.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <span className="font-mono text-white/80">${h.value.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          "text-[11px] font-bold flex items-center justify-end gap-1 font-mono",
                          h.performance >= 0 ? "text-accent" : "text-danger"
                        )}>
                          {h.performance >= 0 ? "+" : ""}{h.performance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {(isRiskHigh || parseFloat(h.drift || "0") > drawdown) && (
                              <span title="New guardrail may trigger automated liquidation" className="text-orange-500 animate-pulse text-[10px]">⚠️</span>
                            )}
                            <span className="text-[10px] text-accent/80 font-mono font-bold">
                              {h.drift || (Math.abs(h.weight - h.target)).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000",
                                parseFloat(h.drift || "0") > drawdown ? "bg-orange-500" : "bg-accent"
                              )} 
                              style={{ width: `${Math.min(100, (parseFloat(h.drift || "1") * 10))}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alpha Curve Chart */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#00FFA3] transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                <TrendingUp size={14} className="text-accent" />
                Vault-Specific Alpha Curve (30D)
              </h3>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest block">Cumulative Alpha</span>
                <span className="text-sm font-bold text-accent font-mono">+{vault.alpha_vs_btc}% vs BTC</span>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData}>
                  <defs>
                    <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#8E9299', fontFamily: 'monospace' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#8E9299', fontFamily: 'monospace' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#15171C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#00FF9C', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#00FF9C" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAlpha)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 space-y-8 hover:border-[#00FFA3] transition-colors">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-accent" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">Node Guardrails</h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest">Max Drawdown Limit</label>
                  <span className="text-xs font-bold font-mono text-white">{drawdown}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  step="5" 
                  value={drawdown}
                  onChange={(e) => setDrawdown(parseInt(e.target.value))}
                  className="w-full accent-accent bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <p className="text-[9px] text-muted italic font-mono uppercase tracking-widest">Agent will auto-liquidate to USDC if breaches threshold.</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Rebalance Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Daily', 'Weekly', 'Neural'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={cn(
                        "py-2 text-[10px] font-mono border rounded-lg transition-all uppercase tracking-widest",
                        frequency === f ? "bg-accent border-accent text-black font-bold" : "bg-white/5 border-white/10 text-muted"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest block font-mono">Auditor Strictness</label>
                <select 
                  value={strictness}
                  onChange={(e) => setStrictness(e.target.value)}
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono px-3 text-white focus:border-accent outline-none appearance-none"
                >
                  <option value="Conservative">Conservative (High Bias for Cash)</option>
                  <option value="Moderate">Moderate (Standard Half-Kelly)</option>
                  <option value="Aggressive">Aggressive (Full Momentum Bias)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={cn(
                    "w-full py-4 font-bold uppercase tracking-widest rounded-xl transition-all text-[11px] flex items-center justify-center gap-2",
                    syncFeedback ? "bg-white/10 text-accent border border-accent/20" : "bg-accent text-black hover:glow-accent"
                  )}
                >
                  {isSyncing ? (
                    <>
                      <Settings size={14} className="animate-spin" />
                      Transmitting mandate...
                    </>
                  ) : syncFeedback ? (
                    "Governance Updated ✓"
                  ) : (
                    "Synchronize Guardrails"
                  )}
                </button>
               <button className="w-full py-3 bg-white/5 text-muted border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-mono flex items-center justify-center gap-2">
                  <RefreshCcw size={12} /> Reset Node to Defaults
               </button>
            </div>
          </div>

          {/* Institutional Integrity Card */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 space-y-4">
             <div className="flex items-center gap-2">
               <Shield size={16} className="text-accent" />
               <h4 className="text-[11px] font-mono font-bold text-accent uppercase">Institutional Integrity</h4>
             </div>
             <p className="text-[10px] text-muted leading-relaxed italic">
               {lastSync ? (
                 <>
                   Mandate Synchronized: <span className="text-white font-mono">{lastSync}</span>. 
                   All neural rebalancing for this node is now bound by the updated <span className="text-accent font-bold">[{strictness}]</span> guardrail.
                 </>
               ) : (
                 "This node is currently synchronized with SoSoValue's Real-time ETF Flow monitoring layer. All strategic shifts are validated against institutional liquidity depth."
               )}
             </p>
             <button 
               onClick={onOpenAudit}
               className="w-full py-2 border border-accent/30 text-accent text-[9px] font-mono font-bold uppercase rounded hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
             >
                View Audit Trail <ArrowUpRight size={10} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
