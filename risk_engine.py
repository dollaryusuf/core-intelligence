import logging
from typing import Dict, Any, List, Tuple

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RiskEngine")

class RiskEngine:
    """
    Hard-Coded Quantitative Risk Engine.
    Handles strict rule-based governance to bypass LLM overconfidence or hallucination.
    """
    def __init__(self):
        # Operational limits of the Risk Engine
        self.etf_outflow_threshold = -100000000.0  # -$100M Net Inflow
        self.funding_rate_limit = 0.05             # 0.05% Leverage limit
        self.sentiment_hype_bound = 0.80           # 80% AI Sentiment

    def calculate_kelly_size(self, win_probability: float, win_loss_ratio: float = 1.5) -> float:
        """
        Calculates position sizing mathematically using the Kelly Criterion.
        Uses Half-Kelly for conservative capital preservation.
        
        Formula: f* = (p * (b + 1) - 1) / b
        where:
        - p = probability of a positive outcome (win)
        - b = win/loss ratio (risk/reward ratio)
        """
        p = win_probability
        if p <= 0:
            return 0.0
        if p > 1.0:
            p = p / 100.0  # support percentage representations (e.g., 78 instead of 0.78)
            
        q = 1.0 - p
        b = win_loss_ratio
        
        if b <= 0:
            return 0.0
            
        # Standard Kelly Formula: f = (bp - q) / b
        kelly_f = (b * p - q) / b
        
        # Apply Half-Kelly as conservative sizing guardrail
        half_kelly = kelly_f / 2.0
        
        # Clamp between 0.0 (no allocation) and 1.0 (100% allocation limit)
        optimized_size = max(0.0, min(half_kelly, 1.0))
        return round(optimized_size * 100, 2)  # Return as readable percentage

    def evaluate_market_rules(self, market_state: Dict[str, Any], initial_proposal: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """
        Applies strict hardcoded mathematical filters to any quantitative/AI proposal.
        To avoid LLM overconfidence, these rules can VETO or override decisions deterministically.
        """
        override_logs = []
        modified_proposal = dict(initial_proposal)
        
        # Extract variables from state with robust defaults
        # 1. ETF Net Flows (Institutional Inflows)
        etf_flows_detailed = market_state.get("etf_flows_detailed", {})
        net_inflow_today = etf_flows_detailed.get("net_inflow_today", 0.0)
        
        # If detailed etf isn't present, check list level
        if not net_inflow_today and "etf_net_flows" in market_state:
            # If formatted as a list of daily floats, check the latest period
            flows = market_state["etf_net_flows"]
            if flows and isinstance(flows, list):
                # If floats are represented in millions (e.g. 152.4), convert to absolute
                net_inflow_today = flows[-1] * 1000000.0 if abs(flows[-1]) < 100000.0 else flows[-1]

        # 2. Funding Rates
        funding_rate = market_state.get("funding_rates", 0.0)
        
        # 3. AI Sentiment Score
        sentiment_score = market_state.get("sentiment_score", 0.5)
        
        # 4. Sector Index Performance
        sector_perf = market_state.get("sector_performance_map", {})
        if not sector_perf and "sectors" in market_state:
            sector_perf = market_state["sectors"]
            
        # Determine average index performance
        avg_sector_perf = 0.0
        if sector_perf:
            avg_sector_perf = sum(sector_perf.values()) / len(sector_perf)
        
        # --- Rule 1 (Liquidity Limit) ---
        # If institutional capital is fleeing (ETF net outflow < -$100M), force a VETO.
        # Reduce risk exposure completely and allocate 50% to Stablecoins immediately.
        if net_inflow_today < self.etf_outflow_threshold:
            override_logs.append("RULE_VETO: Heavy ETF outflow < -$100M detected (Liquidity Breach). Forcing allocation of 50% stables.")
            modified_proposal["action"] = "VETO"
            
            # Recalculate target weights
            target_weights = modified_proposal.get("target_weights", {})
            if target_weights:
                # Force allocation of 50% stablecoins
                remaining_weight = 0.50
                original_total_non_stables = sum(
                    w for asset, w in target_weights.items() if asset not in ["STABLES", "USDC"]
                ) or 1.0
                
                new_weights = {}
                for asset, w in target_weights.items():
                    if asset in ["STABLES", "USDC"]:
                        new_weights[asset] = 0.50
                    else:
                        new_weights[asset] = round((w / original_total_non_stables) * remaining_weight, 4)
                modified_proposal["target_weights"] = new_weights
            else:
                modified_proposal["target_weights"] = {
                    "BTC": 0.20,
                    "ETH": 0.15,
                    "SOL": 0.15,
                    "STABLES": 0.50
                }

        # --- Rule 2 (Leverage Limit) ---
        # If average funding rates exceed 0.05%, leverage or retail positioning is over-extended.
        # This blocks all execution or rebalancing parameters completely.
        if funding_rate > self.funding_rate_limit:
            override_logs.append(f"RULE_BLOCKED: Funding Rate is excessively high ({funding_rate}% > {self.funding_rate_limit}%). Blocking new rebalance execution.")
            modified_proposal["action"] = "HOLD"
            modified_proposal["rebalance_blocked"] = True

        # --- Rule 3 (Divergence Limit) ---
        # "Hype-Exit Divergence"
        # If sentiment score is high (> 80%) but overall sector indices are performing negatively,
        # it is a narrative trap. Reduce target positioning size by 70%.
        if sentiment_score > self.sentiment_hype_bound and avg_sector_perf < 0.0:
            override_logs.append("RULE_OVERRIDE: Sentiment >80% but Sector Performance is in negative distribution. Flagging 'Hype-Exit Divergence'. Reducing suggested size/weight alterations by 70%.")
            modified_proposal["divergence_detected"] = True
            modified_proposal["hype_exit_divergence"] = True
            
            target_weights = modified_proposal.get("target_weights", {})
            if target_weights:
                # Adjust risk size down (reallocate the difference to stables/safe assets)
                stables_key = "STABLES" if "STABLES" in target_weights else "USDC"
                original_stables = target_weights.get(stables_key, 0.0)
                
                adjusted_weights = {}
                accumulated_risk_retrenched = 0.0
                for asset, weight in target_weights.items():
                    if asset == stables_key:
                        continue
                    # Keep 30% of the risk weight adjustment (70% retrenchment), shift the difference to stables
                    retained_weight = round(weight * 0.30, 4)
                    accumulated_risk_retrenched += (weight - retained_weight)
                    adjusted_weights[asset] = retained_weight
                
                adjusted_weights[stables_key] = round(original_stables + accumulated_risk_retrenched, 4)
                modified_proposal["target_weights"] = adjusted_weights

        return modified_proposal, override_logs

if __name__ == "__main__":
    # Quantitative Test Execution
    print("=== Testing Quantitative Hardcoded Risk Engine ===")
    engine = RiskEngine()
    
    # Kelly Position Sizing test
    win_p = 0.68  # 68% confidence
    risk_r = 1.5  # Risk/Reward
    kelly = engine.calculate_kelly_size(win_p, risk_r)
    print(f"Kelly Optimized Sizing (Half-Kelly) for {win_p*100}% probability: {kelly}%")
    
    # Test Data Inflow
    mock_market = {
        "sentiment_score": 0.85,
        "sectors": {"AI": -2.3, "L2": -1.4, "DePIN": -3.1}, 
        "etf_flows_detailed": {"net_inflow_today": -120000000.0},
        "funding_rates": 0.06
    }
    
    initial_trade = {
        "action": "REBALANCE",
        "target_weights": {"BTC": 0.50, "ETH": 0.30, "SOL": 0.20, "STABLES": 0.0}
    }
    
    output, overrides = engine.evaluate_market_rules(mock_market, initial_trade)
    print("Overrun Logs generated:")
    for log in overrides:
        print(f" - {log}")
    print(f"Final Weights: {output.get('target_weights')}")
    print(f"Action Outcome: {output.get('action')}")
    print("==================================================")
