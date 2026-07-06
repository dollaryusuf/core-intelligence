import csv
import os
import time
import tempfile
from datetime import datetime
from typing import Dict, Any, List

class ExecutionEngine:
    def __init__(self, log_file: str = None):
        # Vercel's serverless filesystem is read-only except for /tmp, and
        # even /tmp is ephemeral (wiped between cold starts) — this is a
        # demo trade log, not a durable store, so that's an acceptable
        # trade-off. Defaults to /tmp so this never tries to write into the
        # read-only deployment bundle itself.
        self.log_file = log_file or os.path.join(tempfile.gettempdir(), "trades.csv")
        self.slippage_limit = 0.02 # 2%
        self.max_drawdown_limit = 0.10 # 10%
        self._init_log()

    def _init_log(self):
        """Initializes the CSV log file with headers if it doesn't exist.
        Never raises — a logging failure should never take down the whole
        app, same defensive pattern as PerformanceManager's ledger writes."""
        try:
            if not os.path.exists(self.log_file):
                with open(self.log_file, mode='w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(["timestamp", "asset", "action", "amount", "price", "slippage", "pnl_impact"])
        except OSError as e:
            print(f"[ExecutionEngine] Could not initialize trade log at {self.log_file} (non-fatal): {e}")

    def validate_trade(self, trade_request: Dict[str, Any], current_market: Dict[str, Any]) -> bool:
        """
        Guardrails:
        - Checks for slippage > 2%
        - Checks for drawdown impact > 10%
        """
        print(f"[GUARDRAIL] Validating trade action: {trade_request.get('action')}")
        
        # Simulated Slippage Check
        estimated_slippage = trade_request.get("estimated_slippage", 0.005)
        if estimated_slippage > self.slippage_limit:
            print(f"[ALERT] Trade rejected: Slippage {estimated_slippage*100}% exceeds limit of {self.slippage_limit*100}%")
            return False

        # Simulated Drawdown Check
        potential_impact = trade_request.get("drawdown_impact", 0.01)
        if potential_impact > self.max_drawdown_limit:
            print(f"[ALERT] Trade rejected: Potential Drawdown {potential_impact*100}% exceeds safety threshold.")
            return False

        return True

    def execute_rebalance(self, target_weights: Dict[str, float], current_portfolio: Dict[str, Any]) -> Dict[str, Any]:
        """
        Skeleton for SoSoValue Execution API.
        Processes the rebalance and logs to CSV.
        """
        try:
            print("[EXECUTION] Initializing Rebalance Sequence...")
            
            # Logic for rebalancing would go here (connecting to Exchange/DEX)
            # For now, we simulate success
            results = {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "executed_trades": []
            }

            # Simulate logging a trade
            for asset, weight in target_weights.items():
                trade = {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "asset": asset,
                    "action": "REWEIGHT",
                    "amount": weight,
                    "price": 1.0, # Placeholder
                    "slippage": 0.001,
                    "pnl_impact": 0.0005
                }
                self._log_trade(trade)
                results["executed_trades"].append(trade)

            return results

        except Exception as e:
            print(f"[ERROR] Execution Failed: {str(e)}")
            return {"status": "failed", "error": str(e)}

    def _log_trade(self, trade_data: Dict[str, Any]):
        """Logs trade to trades.csv for PnL tracking. Never raises — a
        logging failure should never break trade execution itself."""
        try:
            with open(self.log_file, mode='a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([
                    trade_data["timestamp"],
                    trade_data["asset"],
                    trade_data["action"],
                    trade_data["amount"],
                    trade_data["price"],
                    trade_data["slippage"],
                    trade_data["pnl_impact"]
                ])
        except OSError as e:
            print(f"[ExecutionEngine] Could not write trade log at {self.log_file} (non-fatal): {e}")

if __name__ == "__main__":
    engine = ExecutionEngine()
    test_trade = {"action": "BUY", "estimated_slippage": 0.005, "drawdown_impact": 0.02}
    if engine.validate_trade(test_trade, {}):
        engine.execute_rebalance({"BTC": 0.5, "ETH": 0.3, "STABLES": 0.2}, {})
