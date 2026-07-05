/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * RECONSTRUCTED FILE — the file uploaded under the name "App.tsx" actually
 * contained the ConnectionGate component (see ConnectionGate.tsx), so your
 * real top-level App component wasn't part of this upload set. This is a
 * fresh implementation of Task 1's gating requirement. If your original
 * App.tsx had additional dashboard sections, polling intervals, modals,
 * etc. beyond what's stubbed below, port them back in under the
 * `renderDashboard()` section — that's the part most likely to differ
 * from what you had.
 */
import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAccount } from 'wagmi';
import { LandingPage } from './LandingPage';
import { ConnectionGate } from './ConnectionGate';
import { MarketTicker } from './MarketTicker';
import { AgentLogger } from './AgentLogger';
import { getPythonAlphaData } from '../lib/aiService';

type View = 'landing' | 'gate' | 'dashboard';

export default function App() {
  // View state drives which top-level screen is mounted. This is decided
  // BEFORE any data fetching — LandingPage never waits on `intelligence`.
  const [view, setView] = useState<View>('landing');
  const [isGuest, setIsGuest] = useState(false);

  const { isConnected } = useAccount();

  // Dashboard-only data. Intentionally not fetched until the user has
  // actually reached the dashboard (either by connecting a wallet past the
  // ConnectionGate, or by choosing Guest / View-Only mode).
  const [intelligence, setIntelligence] = useState<any>(null);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);

  const enterDashboard = useCallback(() => {
    setIsLoadingIntelligence(true);
    getPythonAlphaData()
      .then(setIntelligence)
      .finally(() => setIsLoadingIntelligence(false));
  }, []);

  // Once the wallet actually connects while sitting on the gate, fall
  // through to the dashboard automatically.
  useEffect(() => {
    if (view === 'gate' && isConnected) {
      setView('dashboard');
      enterDashboard();
    }
  }, [view, isConnected, enterDashboard]);

  const handleLaunch = () => setView('gate');

  const handleGuestMode = () => {
    setIsGuest(true);
    setView('dashboard');
    enterDashboard();
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <LandingPage key="landing" onLaunch={handleLaunch} onGuestMode={handleGuestMode} />
      )}

      {view === 'gate' && (
        <ConnectionGate key="gate" onGuestMode={handleGuestMode} />
      )}

      {view === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-bg text-white"
        >
          {isLoadingIntelligence ? (
            <div className="min-h-screen grid place-items-center font-mono text-muted text-xs uppercase tracking-widest animate-pulse">
              Initializing Neural Consensus Terminal...
            </div>
          ) : (
            <>
              <MarketTicker intelligence={intelligence} />
              {isGuest && (
                <div className="text-center text-[10px] font-mono uppercase tracking-widest text-amber-400/80 py-2 bg-amber-400/5 border-b border-amber-400/10">
                  View-Only Mode — connect a wallet to unlock execution
                </div>
              )}
              {/* TODO: restore the rest of your dashboard layout here —
                  vault cards, RiskAuditFeed, OnChainLedger, DeployNodeModal,
                  AuditTrail sidebar, etc. Those components are already
                  fixed up and ready to import; this stub only proves out
                  the gating behavior Task 1 asked for. */}
              <AgentLogger logs={[]} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
