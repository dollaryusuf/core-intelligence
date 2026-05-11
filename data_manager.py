from typing import List, Dict, Optional
from pydantic import BaseModel, Field
import random
import time

class MarketState(BaseModel):
    sentiment_score: float = Field(..., ge=0, le=1)
    top_narratives: List[str]
    sector_performance_map: Dict[str, float]
    etf_net_flows: List[float]
    funding_rates: float
    timestamp: float = Field(default_factory=time.time)

class SoSoClient:
    def __init__(self, api_key: Optional[str] = None, mock_mode: bool = True):
        self.api_key = api_key
        self.mock_mode = mock_mode

    def fetch_sentiment(self) -> Dict:
        if self.mock_mode:
            return {
                "score": round(0.6 + random.random() * 0.3, 2),
                "hashtags": ["#AI", "#L2", "#BTC", "#DePIN"]
            }
        # Real API logic would go here
        return {}

    def fetch_index_data(self) -> Dict[str, float]:
        if self.mock_mode:
            return {
                "AI": round(5 + random.random() * 15, 2),
                "L2": round(random.random() * 8, 2),
                "DePIN": round(-5 + random.random() * 10, 2),
                "RWA": round(2 + random.random() * 12, 2)
            }
        return {}

    def fetch_macro_flows(self) -> List[float]:
        if self.mock_mode:
            return [round(-100 + random.random() * 300, 2) for _ in range(5)]
        return []

    def get_market_state(self) -> MarketState:
        sentiment = self.fetch_sentiment()
        indices = self.fetch_index_data()
        flows = self.fetch_macro_flows()
        
        return MarketState(
            sentiment_score=sentiment["score"],
            top_narratives=sentiment["hashtags"],
            sector_performance_map=indices,
            etf_net_flows=flows,
            funding_rates=round(0.01 + random.random() * 0.06, 3)
        )

# Example usage (if running in a Python environment)
if __name__ == "__main__":
    client = SoSoClient(mock_mode=True)
    state = client.get_market_state()
    print(f"Current Market State: {state.model_dump_json(indent=2)}")
