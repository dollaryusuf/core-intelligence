from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
import random
import time
from sosovalue_service import SoSoValueService

class MarketState(BaseModel):
    sentiment_score: float = Field(..., ge=0, le=1)
    top_narratives: List[str]
    sector_performance_map: Dict[str, float]
    etf_net_flows: List[float]
    funding_rates: float
    timestamp: float = Field(default_factory=time.time)
    source: str = Field(..., pattern="^(LIVE_API|SIMULATED)$")

class SoSoClient:
    def __init__(self, api_key: Optional[str] = None, mock_mode: bool = True):
        self.api_key = api_key
        # Utilize the main SoSoValueService which handles mock fallback itself
        self.service = SoSoValueService(api_key=api_key)
        self.mock_mode = mock_mode

    def fetch_sentiment(self) -> Dict[str, Any]:
        result = self.service.fetch_news_sentiment()
        return {
            "score": result["sentiment_score"],
            "hashtags": result["top_narratives"],
            "source": result["source"]
        }

    def fetch_index_data(self) -> Dict[str, Any]:
        result = self.service.fetch_sector_performance()
        return {
            "sectors": result["sectors"],
            "source": result["source"]
        }

    def fetch_macro_flows(self) -> Dict[str, Any]:
        result = self.service.fetch_etf_data()
        return {
            "flows": result["historical_flows_weekly_trend"],
            "source": result["source"]
        }

    def get_market_state(self) -> MarketState:
        # Use our aggregated method for optimized call structures
        agg_state = self.service.get_aggregated_market_state()
        
        return MarketState(
            sentiment_score=agg_state["sentiment_score"],
            top_narratives=agg_state["top_narratives"],
            sector_performance_map=agg_state["sector_performance_map"],
            etf_net_flows=agg_state["etf_net_flows"],
            funding_rates=agg_state["funding_rates"],
            timestamp=agg_state["timestamp"],
            source=agg_state["source"]
        )

# Example usage (if running in a Python environment)
if __name__ == "__main__":
    client = SoSoClient()
    state = client.get_market_state()
    print(f"Current Market State: {state.model_dump_json(indent=2)}")

