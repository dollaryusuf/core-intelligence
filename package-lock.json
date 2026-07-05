// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/**
 * @title SoSoVaultExecutor
 * @notice Minimal on-chain execution layer for the SoSo-Vault Core
 *         Intelligence demo. Records each approved Neural Consensus signal
 *         (as prepared by the backend's /api/prepare-execution endpoint) as
 *         an immutable, publicly queryable on-chain event + struct — giving
 *         judges a real Ethereum Sepolia transaction to inspect on Etherscan.
 *
 * @dev    This is intentionally simple: it does NOT move funds, swap tokens,
 *         or hold custody of anything. It is a transparent "settlement
 *         attestation" contract — exactly matching the
 *         `executeNeuralSignal(uint256 signalId, uint256 amount)` ABI already
 *         wired into src/lib/contract.ts / useExecuteNeuralSignal.ts.
 *
 *         Deploy on Ethereum Sepolia via Remix:
 *           1. Compiler tab -> select 0.8.24 (or any 0.8.x), enable optimizer if you like.
 *           2. Deploy & Run Transactions tab -> Environment: "Injected Provider - MetaMask".
 *           3. Point MetaMask at the Sepolia test network, fund it from a faucet.
 *           4. Deploy, then copy the deployed address into VITE_CONTRACT_ADDRESS
 *              (or directly into src/lib/contract.ts CONTRACT_ADDRESS).
 *           5. Copy the ABI (Compilation Details -> ABI) into EXECUTION_ABI if
 *              you add fields beyond what's already stubbed there.
 */
contract SoSoVaultExecutor {
    /// @notice Emitted every time a Neural Consensus signal is executed on-chain.
    event SignalExecuted(
        uint256 indexed signalId,
        uint256 amount,
        address indexed executor,
        uint256 timestamp
    );

    /// @notice Emitted if governance rotates the authorized Risk Auditor address.
    event RiskAuditorUpdated(address indexed previousAuditor, address indexed newAuditor);

    struct ExecutionRecord {
        uint256 signalId;
        uint256 amount;
        address executor;
        uint256 timestamp;
    }

    /// @notice Full history of every execution, in call order.
    ExecutionRecord[] public executions;

    /// @notice signalId => true once it has been executed (prevents double-spend/replay of the same signal).
    mapping(uint256 => bool) public signalExecuted;

    /// @notice Optional off-chain "Risk Auditor" attestor address (e.g. the backend's signer key).
    ///         Left as address(0) by default, which disables the check entirely so any
    ///         connected auditor wallet can execute during the hackathon demo.
    address public riskAuditor;

    address public immutable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "SoSoVaultExecutor: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Executes (records) a Neural Consensus signal on-chain.
     * @dev    Mirrors the frontend's /api/prepare-execution payload 1:1:
     *         `signalId` and `amount` come straight from that endpoint's JSON
     *         response, BigInt-converted client-side before this call.
     * @param signalId Unique identifier for the approved signal (from the backend).
     * @param amount   Sized notional amount for this execution, in base units (wei).
     */
    function executeNeuralSignal(uint256 signalId, uint256 amount) external {
        require(!signalExecuted[signalId], "SoSoVaultExecutor: signal already executed");
        require(amount > 0, "SoSoVaultExecutor: amount must be greater than zero");

        signalExecuted[signalId] = true;
        executions.push(ExecutionRecord({
            signalId: signalId,
            amount: amount,
            executor: msg.sender,
            timestamp: block.timestamp
        }));

        emit SignalExecuted(signalId, amount, msg.sender, block.timestamp);
    }

    /// @notice Total number of executions recorded so far.
    function executionCount() external view returns (uint256) {
        return executions.length;
    }

    /// @notice Returns the most recent `count` executions, newest first.
    function getRecentExecutions(uint256 count) external view returns (ExecutionRecord[] memory) {
        uint256 total = executions.length;
        uint256 n = count > total ? total : count;
        ExecutionRecord[] memory result = new ExecutionRecord[](n);
        for (uint256 i = 0; i < n; i++) {
            result[i] = executions[total - 1 - i];
        }
        return result;
    }

    /// @notice Governance hook: rotate the (optional, currently unenforced) Risk Auditor address.
    function setRiskAuditor(address newAuditor) external onlyOwner {
        emit RiskAuditorUpdated(riskAuditor, newAuditor);
        riskAuditor = newAuditor;
    }
}
