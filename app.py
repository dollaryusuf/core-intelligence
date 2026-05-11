import streamlit as st
import os
import sys

# Tell Python to look inside the 'src' folder for your engines
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from brain_engine import TreasuryAgent
from data_manager import SoSoClient
# (Add any other imports from your src files here)

st.set_page_config(page_title="SoSo-Vault", layout="wide", initial_sidebar_state="expanded")

# --- MOCK DATA FALLBACK (The "Safe Mode" we discussed) ---
def get_mock_signals():
    return {
        "market_sentiment": {"score": 72, "narratives": ["#AIScaling", "#L2Interop"]},
        "index_performance": {"AI": 12.5, "L2": 4.2, "DePIN": -2.1, "RWA": 8.4},
        "macro_flows": {"etf_net_inflow": 142}
    }

# --- MAIN DASHBOARD UI ---
def main():
    st.title("🛡️ SoSo-Vault: Core Intelligence")
    
    # Initialize your engines
    # It will try to get the API key from Streamlit Secrets
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        st.warning("Running in Demo Mode (No API Key detected in Secrets)")
        signals = get_mock_signals()
    else:
        # If key exists, try to use your real data manager
        try:
            client = SoSoClient(api_key=os.getenv("SOSO_API_KEY"))
            signals = client.fetch_all_signals()
        except:
            signals = get_mock_signals()

    # --- RENDER YOUR DASHBOARD HERE ---
    # (Paste your Streamlit UI code here - the columns, the metrics, etc.)
    st.write("Neural Node Synchronization Active...")
    # ... (Rest of your UI code)

if __name__ == "__main__":
    main()
