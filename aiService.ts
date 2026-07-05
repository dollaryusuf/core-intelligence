/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, EXECUTION_ABI } from '../lib/contract';

export interface PreparedExecution {
  /** Numeric/string signal id returned by /api/prepare-execution */
  signalId: string | number;
  /** Amount pre-formatted as a string so it can be safely turned into a BigInt (wei units, or token base units) */
  amount: string;
}

/**
 * Wraps wagmi's useWriteContract (send) + useWaitForTransactionReceipt (confirm)
 * around the `executeNeuralSignal` call on the deployed Sepolia contract.
 *
 * Usage:
 *   const { execute, status, hash, error } = useExecuteNeuralSignal();
 *   await execute({ signalId: "42", amount: "1000000000000000000" });
 */
export function useExecuteNeuralSignal() {
  const {
    writeContractAsync,
    data: hash,
    isPending: isSigning,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const execute = useCallback(
    async ({ signalId, amount }: PreparedExecution) => {
      // BigInt conversion happens right at the call site so callers can pass
      // plain strings/numbers straight from the JSON API response.
      const signalIdBig = BigInt(signalId);
      const amountBig = BigInt(amount);

      return writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: EXECUTION_ABI,
        functionName: 'executeNeuralSignal',
        args: [signalIdBig, amountBig],
      });
    },
    [writeContractAsync]
  );

  const status: 'idle' | 'signing' | 'broadcasting' | 'confirmed' | 'error' =
    writeError || receiptError
      ? 'error'
      : isConfirmed
      ? 'confirmed'
      : isConfirming
      ? 'broadcasting'
      : isSigning
      ? 'signing'
      : 'idle';

  return {
    execute,
    reset,
    hash,
    status,
    isSigning,
    isConfirming,
    isConfirmed,
    error: writeError || receiptError || null,
  };
}
