/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Deployed contract details for the SoSo-Vault Execution Layer on Ethereum
 * Sepolia — SoSoVaultExecutor, Wave 2 production deployment.
 *
 * CONTRACT_ADDRESS: the live Sepolia deployment address. Overridable via
 *   VITE_CONTRACT_ADDRESS for future redeploys without touching this file.
 *
 * AUTHORIZED_AUDITOR: the wallet the contract's own `AUTHORIZED_AUDITOR()`
 *   getter should return. Kept here purely for UI display (Evidence Vault /
 *   "ON-CHAIN VERIFICATION" panel) — the source of truth is always the
 *   on-chain value, not this constant.
 *
 * EXECUTION_ABI: the full ABI emitted by the Sepolia deployment, as supplied
 *   by the contract's build artifact.
 */

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0x68E4412Ad8645cC45bD170fa4E4A745b0441bfEf') as `0x${string}`;

export const AUTHORIZED_AUDITOR = (import.meta.env.VITE_AUTHORIZED_AUDITOR ||
  '0x551B3c796dC89726BDAe006Ce9273dcFf8FB5414') as `0x${string}`;

export const SEPOLIA_CHAIN_ID = 11155111;

// Full ABI for the deployed SoSoVaultExecutor contract on Ethereum Sepolia.
export const EXECUTION_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'signalId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'executeNeuralSignal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'signalId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'executor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'SignalExecuted',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'bool', name: '_status', type: 'bool' }],
    name: 'toggleDemoMode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'AUTHORIZED_AUDITOR',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'executions',
    outputs: [
      { internalType: 'uint256', name: 'signalId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'executor', type: 'address' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'count', type: 'uint256' }],
    name: 'getRecentExecutions',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'signalId', type: 'uint256' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'address', name: 'executor', type: 'address' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        internalType: 'struct SoSoVaultExecutor.ExecutionRecord[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'publicDemoMode',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'signalExecuted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
