import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AgentLoggerProps {
  logs: LogEntry[];
}

export const AgentLogger: React.FC<AgentLoggerProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getColorClass = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'text-accent'; // SoSo Green #00FFA3
      case 'alert':
        return 'text-danger'; // Alert Red #FF4B4B
      case 'process':
        return 'text-muted/60';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-black/80 border border-white/5 rounded-xl flex flex-col h-[300px] overflow-hidden shadow-inner shadow-black">
      <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">Neural_Vault_Logs</h4>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted/20" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="text-muted/20 h-full flex items-center justify-center italic">
              Initializing Secure Terminal...
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 items-start"
              >
                <span className="text-muted/40 shrink-0">[{log.timestamp}]</span>
                <span className={cn(getColorClass(log.type), "leading-relaxed break-words")}>
                  {log.message}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
