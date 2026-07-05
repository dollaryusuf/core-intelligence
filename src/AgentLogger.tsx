import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Database, 
  Cpu, 
  Zap, 
  Shield, 
  Activity, 
  ArrowRight,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DeployNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (vault: { name: string; aum: number; type: string; mandate: string; ownerAddress?: string }) => void;
  walletConnected?: boolean;
  walletAddress?: string | null;
}

export const DeployNodeModal: React.FC<DeployNodeModalProps> = ({ isOpen, onClose, onDeploy, walletConnected = false, walletAddress = null }) => {
  const [step, setStep] = useState<'form' | 'provisioning' | 'success'>('form');
  const [name, setName] = useState('');
  const [aum, setAum] = useState(100000);
  const [mandate, setMandate] = useState('Market Neutral');
  const [syncLevel, setSyncLevel] = useState('High-Performance');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && walletAddress) {
      setOwnerAddress(walletAddress);
    }
  }, [isOpen, walletAddress]);

  const provisioningLogs = [
    "[SYSTEM] Allocating Neural Compute for Cluster Node...",
    "[SYSTEM] Establishing encrypted handshake with SoSoValue API...",
    "[NETWORK] Opening secure RPC tunnel to Solana Mainnet-Beta...",
    "[SYSTEM] Injecting Auditor-Protocol v4.2 into local environment...",
    "[SECURITY] Hardening vault multi-sig with ZK-proof attestation...",
    "[SYSTEM] Synchronizing historical index data... SUCCESS.",
    "[GOVERNANCE] Initializing Agent policy: CAP_PRESERVATION_V1",
    "[SYSTEM] Booting Neural Intelligence Node... STABLE."
  ];

  const handleStartDeployment = async () => {
    if (!name) return;
    setStep('provisioning');
    
    for (let i = 0; i < provisioningLogs.length; i++) {
      setLogs(prev => [...prev, provisioningLogs[i]]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    }

    setTimeout(() => {
      setStep('success');
    }, 500);
  };

  const handleFinalize = () => {
    onDeploy({
      name,
      aum,
      type: mandate === 'Aggressive Alpha' ? 'Alpha' : mandate === 'Market Neutral' ? 'DAO' : 'Personal',
      mandate,
      ownerAddress: ownerAddress || undefined
    });
    // Reset state for next time
    setStep('form');
    setName('');
    setAum(100000);
    setOwnerAddress('');
    setLogs([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-[#0F1115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 grid place-items-center">
              <Database size={18} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold tracking-tight uppercase">Provision_New_Intelligence_Node</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 'form' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest">Node Identity</label>
                <input 
                  type="text" 
                  placeholder="e.g., L2 Summer Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest">Owner Wallet Address</label>
                <input 
                  type="text" 
                  placeholder="e.g., 0x71C... (or autodetected bound address)"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-accent outline-none font-mono text-xs"
                />
                {!walletConnected ? (
                  <p className="text-[9px] text-amber-500/80 font-mono tracking-wide">
                    ⚠️ CONNECT VAULT to lock this node configuration with hardware wallet synchronization. (Non-Custodial Protocol)
                  </p>
                ) : (
                  <p className="text-[9px] text-accent font-mono tracking-wide">
                    ✓ SECURE HANDSHAKE ACTIVE: Locked to active non-custodial bound proxy.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest">Initial AUM Target</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-mono">$</span>
                    <input 
                      type="number" 
                      value={aum}
                      onChange={(e) => setAum(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white focus:border-accent outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest">Core Mandate</label>
                  <select 
                    value={mandate}
                    onChange={(e) => setMandate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-accent outline-none font-mono appearance-none"
                  >
                    <option value="Aggressive Alpha">Aggressive Alpha</option>
                    <option value="Market Neutral">Market Neutral</option>
                    <option value="Capital Preservation">Capital Preservation</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-accent" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">SoSo-API Sync Level</p>
                    <p className="text-[10px] text-muted">Optimize for institutional liquidity flows</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSyncLevel(l => l === 'Standard' ? 'High-Performance' : 'Standard')}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all",
                    syncLevel === 'High-Performance' ? "bg-accent text-black" : "bg-white/10 text-muted"
                  )}
                >
                  {syncLevel}
                </button>
              </div>

              <button 
                onClick={handleStartDeployment}
                disabled={!name}
                className="w-full py-5 bg-accent text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Initiate Deployment <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 'provisioning' && (
            <div className="space-y-6">
              <div className="h-64 bg-black/60 rounded-2xl border border-white/5 p-6 font-mono overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-2 mb-4 text-accent">
                   <Terminal size={14} />
                   <span className="text-[10px] uppercase font-bold">Node Provisioning Terminal</span>
                </div>
                <div className="space-y-2">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] text-white/80 leading-relaxed font-mono"
                    >
                      {log}
                    </motion.div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-accent inline-block align-middle" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-muted">
                 <Activity size={16} className="animate-pulse text-accent" />
                 <span className="text-[11px] uppercase tracking-widest animate-pulse">Establishing Governance Matrix...</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="w-20 h-20 bg-accent/20 border border-accent/40 rounded-full grid place-items-center mx-auto mb-6 relative">
                 <div className="absolute inset-0 bg-accent rounded-full blur-[40px] opacity-20" />
                 <CheckCircle2 size={40} className="text-accent relative z-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tighter uppercase">Node_Online</h3>
                <p className="text-muted text-sm font-mono tracking-widest uppercase">Intelligence Node {name} is now LIVE and Synchronized.</p>
              </div>

              <button 
                onClick={handleFinalize}
                className="w-full py-5 bg-accent text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:glow-accent transition-all"
              >
                Access Intelligence Node
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
