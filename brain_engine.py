import json
import os
from typing import Dict, Any

class BrainEngine:
    """
    The BrainEngine handles the 'Signal -> Reason -> Trade' loop using an 
    agentic reasoning workflow.
    """
    
    def __init__(self):
        self.role = "Senior Treasury Quant"
        self.analysis_steps = [
            "Macro Check (ETF flows)",
            "Sector Check (Indices)",
            "Sentiment Check (News)",
            "Risk Calculation"
        ]

    def get_system_prompt(self) -> str:
        return f"""
        ROLE: You are the "SoSo-Vault" Core Intelligence, an Elite {self.role}. 
        Your goal is to manage a multi-million dollar treasury using proprietary signals.

        ANALYSIS WORKFLOW (Strict Order):
        1. {self.analysis_steps[0]}: Analyze institutional appetite and liquidity via ETF net flows.
        2. {self.analysis_steps[1]}: Compare sector performance (AI, L2, etc.) against BTC base layer.
        3. {self.analysis_steps[2]}: Evaluate news mood and narrative velocity.
        4. {self.analysis_steps[3]}: Aggregate findings into a quantitative Global Risk Score (0-100).

        STRATEGIC FRAMEWORK:
        - Narrative Alpha: If a sector index is outperforming BTC AND Sentiment > 0.7, suggest a 10% shift into that sector.
        - Institutional Guardrail: If ETF Net Inflows are negative for 2 consecutive periods, increase Stablecoin allocation by 20%.
        - Volatility Buffer: If Funding Rates are excessively high (>0.05%), recommend reducing leverage.

        OUTPUT REQUIREMENTS:
        - Return ONLY a valid JSON object.
        - Must include: risk_score (0-100), recommended_action, and trade_rationale.
        """

    def format_prompt(self, market_state: Dict[str, Any], portfolio: Dict[str, Any]) -> str:
        return f"""
        SYSTEM_CONTEXT: {self.get_system_prompt()}
        
        INPUT_DATA:
        - Market State: {json.dumps(market_state, indent=2)}
        - Current Portfolio: {json.dumps(portfolio, indent=2)}
        
        Perform the 4-step analysis now.
        """

# This engine is used as a blueprint for the Intelligence Layer in the TypeScript server.
