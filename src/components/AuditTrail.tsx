import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  FileJson, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Settings,
  Terminal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AuditEvent, ManagedVault } from '../types';

interface AuditTrailProps {
  isOpen: boolean;
  onClose: () => void;
  vault: ManagedVault;
  events: AuditEvent[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ isOpen, onClose, vault, events }) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(events[0]?.id || null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showPayload, setShowPayload] = useState<string | null>(null);

  const getActionColor = (action: AuditEvent['action']) => {
    switch (action) {
      case 'REBALANCE': return 'bg-accent';
      case 'VETO':
      case 'CIRCUIT BREAKER': return 'bg-danger';
      case 'GOVERNANCE': return 'bg-cyan-400';
      case 'HOLD': return 'bg-muted';
      case 'NODE_SYNCHRONIZED': return 'bg-accent animate-pulse shadow-[0_0_8px_rgba(0,255,163,0.6)]';
      default: return 'bg-white';
    }
  };

  const getActionLabel = (action: AuditEvent['action']) => {
    if (action === 'GOVERNANCE') return 'GOVERNANCE SYNC';
    if (action === 'NODE_SYNCHRONIZED') return 'NODE SYNCHRONIZED';
    return action;
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'Signal', 'Verdict'];
    const rows = events.map(e => [e.timestamp, e.action, e.signal, e.verdict]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${vault.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0d0d0d] border-l border-[#1a1a1a] z-[70] flex flex-col font-mono shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Compliance & Audit Trail</h3>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] text-muted">{vault.name} // Node-00{vault.id}</p>
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-accent/5 border border-accent/20 rounded">
                    <span className="text-[8px] font-bold text-accent">DEV_MODE</span>
                    <button 
                      onClick={() => setIsDevMode(!isDevMode)}
                      className={cn(
                        "w-6 h-3 rounded-full relative transition-colors",
                        isDevMode ? "bg-accent" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isDevMode ? 12 : 2 }}
                        className="absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/5" />

                <div className="space-y-6">
                  {events.map((event, idx) => (
                    <div key={event.id} className="relative pl-10">
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute left-[9px] top-1.5 w-1.5 h-1.5 rounded-full z-10",
                        getActionColor(event.action)
                      )} />
                      
                      {/* Event Card */}
                      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                        <div 
                          onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[9px] text-muted uppercase block">{event.timestamp}</span>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                                  event.action === 'REBALANCE' ? "bg-accent/10 text-accent" : 
                                  event.action === 'VETO' || event.action === 'CIRCUIT BREAKER' ? "bg-danger/10 text-danger" :
                                  event.action === 'GOVERNANCE' ? "bg-cyan-400/10 text-cyan-400" :
                                  event.action === 'NODE_SYNCHRONIZED' ? "bg-accent/10 text-accent" :
                                  "bg-white/10 text-white"
                                )}>
                                  {getActionLabel(event.action)}
                                </span>
                              </div>
                            </div>
                            {event.payload && (
                              <div className="p-1 text-muted">
                                {expandedEvent === event.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </div>
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedEvent === event.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                <div className="space-y-3">
                                  <p className="text-[11px] text-white/90 leading-relaxed">
                                    <span className="text-accent/60 mr-2">SIGNAL:</span>
                                    {event.signal}
                                  </p>
                                  <p className="text-[11px] text-muted italic leading-relaxed">
                                    <span className="text-white/40 mr-2 uppercase not-italic">Verdict:</span>
                                    {event.verdict}
                                  </p>
                                </div>

                                {/* Insights or Raw Payload */}
                                {isDevMode ? (
                                  <div className="space-y-2">
                                    <button 
                                      onClick={() => setShowPayload(showPayload === event.id ? null : event.id)}
                                      className="w-full py-2 bg-white/5 rounded-lg border border-white/5 text-[9px] text-accent uppercase font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                                    >
                                      <FileJson size={10} /> 
                                      {showPayload === event.id ? "Minimize Internal Logs" : "Expand Internal_Neural_Logs"}
                                    </button>
                                    
                                    <AnimatePresence>
                                      {showPayload === event.id && event.payload && (
                                        <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="p-3 bg-black/60 rounded-lg border border-white/5 space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[8px] text-muted uppercase flex items-center gap-1">
                                                <Terminal size={10} /> RAW_QUANT_PAYLOAD
                                              </span>
                                            </div>
                                            <pre className="text-[9px] text-accent/80 overflow-x-auto p-2 font-mono scroll-bottom">
                                              {JSON.stringify(event.payload, null, 2)}
                                            </pre>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ) : (
                                  event.insights && (
                                    <div className="mt-4 p-4 bg-accent/[0.02] rounded-xl border border-accent/10 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1 h-3 bg-accent rounded-full" />
                                        <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Neural Executive Summary</span>
                                      </div>
                                      <ul className="space-y-2">
                                        {event.insights.map((insight, i) => (
                                          <li key={i} className="flex gap-2 text-[10px] text-white/70 leading-relaxed group">
                                            <span className="text-accent group-hover:translate-x-0.5 transition-transform text-[8px] leading-5">•</span>
                                            {insight}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-black/20 space-y-3">
              <button 
                onClick={exportToCSV}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Download size={14} /> Export CSV for Compliance
              </button>
              <div className="flex items-center justify-center gap-2 text-[8px] text-muted uppercase">
                <Lock size={10} /> Cryptographically Signed Ledger v1.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
