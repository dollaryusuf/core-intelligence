/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * RECONSTRUCTED FILE — not part of any previous upload. main.tsx imports
 * `wagmiConfig` from here to feed <WagmiProvider>, and ConnectionGate.tsx
 * grabs `connectors[0]` expecting it to be the injected browser wallet
 * (MetaMask etc.) scoped to Sepolia — this config matches that usage.
 *
 * If your original had additional connectors (WalletConnect, Coinbase
 * Wallet, etc.) or a custom RPC transport (e.g. an Alchemy/Infura URL),
 * add them here — this is the minimal config that satisfies what the
 * rest of the app currently calls.
 */
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
