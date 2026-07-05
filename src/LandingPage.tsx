/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import { ArrowUpRight, Link2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface OnChainLedgerEntry {
  id: string;
  txHash: string;
  action: string;
  timestamp: string;
  status: 'CONFIRMED' | 'PENDING' | 'BROADCASTING';
}

interface OnChainLedgerProps {
  entries: OnChainLedgerEntry[];
}

const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io/tx/';

export function OnChainLedger({ entries }: OnChainLedgerProps) {
  if (entries.length === 0) return null;

  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
        <Link2 size={14} className="text-accent" />
        On-Chain Audit Ledger &middot; Ethereum Sepolia
      </h3>
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-black/30 border border-white/5 rounded-xl font-mono flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  entry.status === 'CONFIRMED' ? "bg-accent animate-pulse" : "bg-amber-400 animate-pulse"
                )} />
                <span className="text-[10px] text-white font-bold">{entry.action}</span>
              </div>
              <div className="text-[9px] text-muted truncate mt-1">{entry.txHash}</div>
            </div>
            {entry.status === 'BROADCASTING' ? (
              <span className="text-[9px] text-amber-400 flex items-center gap-1 shrink-0">
                <Loader2 size={10} className="animate-spin" />
                Broadcasting...
              </span>
            ) : (
              <a
                href={`${SEPOLIA_EXPLORER}${entry.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[9px] text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                {entry.status} <ArrowUpRight size={10} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
