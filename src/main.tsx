/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import {StrictMode, Component, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {WagmiProvider} from 'wagmi';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from './App.tsx';
import {wagmiConfig} from './lib/wagmiConfig';
import './index.css';

const queryClient = new QueryClient();

// Catches any render-time crash in App (or below) and surfaces it instead of
// leaving a permanently blank / stuck screen with no signal in the console.
class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message?: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }
  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('App Render Error:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black grid place-items-center font-mono text-red-400 text-sm px-6 text-center">
          <div>
            <p className="uppercase tracking-widest mb-2">System Fault</p>
            <p className="text-white/60 text-xs">{this.state.message || 'Unknown render error. Check the browser console for details.'}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      reconnectOnMount is explicitly OFF: with it on (the default), wagmi
      silently restores a previously-connected wallet from localStorage on
      page load, which flips `isConnected` to true before the user ever sees
      the LandingPage — skipping the gateway entirely and, combined with the
      old `data`-gated render, leaving a bare "Initializing..." screen with
      nothing mounted on top of it. Revisit re-enabling this once the
      gateway flow no longer depends on wallet state to decide what to render.
    */}
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
