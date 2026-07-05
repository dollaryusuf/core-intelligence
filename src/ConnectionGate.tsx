/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import { ShieldCheck, Loader2, Eye, AlertTriangle } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { cn } from './lib/utils';

interface ConnectionGateProps {
  /** Lets the user skip authorization and browse the dashboard read-only. */
  onGuestMode: () => void;
}

/**
 * Post-splash "Institutional Handshake" gate.
 *
 * Uses wagmi's useAccount/useConnect directly against the injected EVM
 * provider (MetaMask, etc.) configured for Ethereum Sepolia in
 * src/lib/wagmiConfig.ts. Once `isConnected` flips true, App.tsx (which also
 * reads useAccount) stops rendering this gate and the dashboard fades in.
 */
export function ConnectionGate({ onGuestMode }: ConnectionGateProps) {
  const { isConnected, chainId } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();

  const wrongNetwork = isConnected && chainId !== sepolia.id;

  const handleConnect = () => {
    // Prefer the injected (MetaMask / browser EVM wallet) connector — it's
    // the only one configured for this hackathon build, so grab index 0.
    const injectedConnector = connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector, chainId: sepolia.id });
    }
  };

  return (
    <motion.div
      key="connection-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-black flex items-center justify-center overflow-hidden px-4"
    >
      {/* Ambient grid + glow backdrop, matching the LandingPage's institutional look */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-emerald-500/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-500/20 bg-[#0A0C10] shadow-[0_0_60px_rgba(16,185,129,0.08)] px-6 py-10 sm:px-10"
      >
        {/* Pulsing security / EVM indicator */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center">
            <span className="absolute inset-0 rounded-2xl border border-emerald-500/40 animate-ping" />
            <span className="text-emerald-500 text-2xl font-sans font-bold leading-none select-none">Ξ</span>
          </div>
        </div>

        <h1 className="text-center text-white font-bold tracking-tight text-base sm:text-lg uppercase font-mono">
          EVM Auditor Handshake Required
        </h1>
        <p className="text-center text-muted text-[12px] sm:text-[13px] leading-relaxed mt-3 font-sans">
          To access the SoSo-Vault Neural Consensus and trigger on-chain execution on Ethereum Sepolia, please authorize your auditor wallet.
        </p>

        <button
          onClick={handleConnect}
          disabled={isPending || connectors.length === 0}
          className={cn(
            "mt-8 w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[12px] font-mono",
            "flex items-center justify-center gap-2 transition-all",
            isPending || connectors.length === 0
              ? "bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20 cursor-wait"
              : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
          )}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Establishing Secure Link...
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Authorize Auditor Vault
            </>
          )}
        </button>

        {connectors.length === 0 && (
          <p className="mt-3 text-center text-[10px] font-mono text-amber-400/90 flex items-center justify-center gap-1.5">
            <AlertTriangle size={12} />
            No EVM wallet detected. Install MetaMask, or continue in View-Only Mode.
          </p>
        )}

        {error && (
          <p className="mt-3 text-center text-[10px] font-mono text-red-400/90">
            {error.message.length > 100 ? 'Connection request rejected or failed.' : error.message}
          </p>
        )}

        {wrongNetwork && (
          <p className="mt-3 text-center text-[10px] font-mono text-amber-400/90 flex items-center justify-center gap-1.5">
            <AlertTriangle size={12} />
            Connected, but not on Ethereum Sepolia — switch networks in your wallet.
          </p>
        )}

        <p className="mt-4 text-center text-[9px] uppercase tracking-[0.2em] text-emerald-500/30 font-mono">
          Ethereum Sepolia Testnet &middot; Non-Custodial &middot; Hardware Wallet Sync
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onGuestMode}
            disabled={isPending}
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors disabled:opacity-40"
          >
            <Eye size={12} />
            Enter in View-Only Mode
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
