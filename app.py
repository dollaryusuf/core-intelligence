import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import random
import time
from datetime import datetime

# --- 1. SESSION STATE INITIALIZATION ---
if 'selected_vault' not in st.session_state: st.session_state.selected_vault = None
if 'black_swan' not in st.session_state: st.session_state.black_swan = False
if 'logs' not in st.session_state: st.session_state.logs = []
if 'portfolio_value' not in st.session_state: st.session_state.portfolio_value = 18550000.00
if 'rebalanced' not in st.session_state: st.session_state.rebalanced = False

# --- 2. CUSTOM STYLING (Institutional Dark Mode) ---
st.set_page_config(page_title="SoSo-Vault Core", layout="wide")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    
    .stApp { background-color: #050505; color: #e0e0e0; }
    [data-testid="stHeader"] { background: rgba(0,0,0,0); }
    
    /* Metrics Styling */
    [data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        color: #00FFA3 !important;
        font-size: 1.8rem !important;
    }
    
    /* Cards */
    .quant-card {
        background-color: #111;
        border: 1px solid #222;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #00FFA3;
        color: black;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        width: 100%;
    }
    
    .stButton>button:hover {
        background-color: #00cc82;
        box-shadow: 0 0 15px #00FFA366;
    }

    /* Logs */
    .log-container {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        background-color: #080808;
        padding: 10px;
        border: 1px solid #1a1a1a;
        height: 300px;
        overflow-y: auto;
    }
    </style>
""", unsafe_allow_html=True)

# --- 3. MOCK DATA GENERATORS ---
def get_etf_chart():
    x = np.linspace(0, 10, 100)
    y = np.sin(x) * 50 + random.randint(-20, 20)
    fig = go.Figure(data=go.Scatter(x=x, y=y, fill='tozeroy', line_color='#00FFA3'))
    fig.update_layout(margin=dict(l=0,r=0,t=0,b=0), height=150, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', showlegend=False)
    fig.update_xaxes(visible=False); fig.update_yaxes(visible=False)
    return fig

# --- 4. HEADER ---
c1, c2, c3, c4 = st.columns([1.5, 1, 1, 1])
with c1:
    st.markdown("### 🛡️ SoSo-Vault <span style='color:#00FFA3; font-size:12px;'>Core Intelligence</span>", unsafe_allow_html=True)
    st.caption("SENIOR ON-CHAIN TREASURY QUANT")
with c2: st.metric("EMPIRE AUM", f"${st.session_state.portfolio_value:,.0f}")
with c3: st.metric("DAILY REVENUE", f"${(st.session_state.portfolio_value * 0.02 / 365):,.2f}", "+2.1%")
with c4:
    if st.session_state.rebalanced:
        st.button("NODE SYNCHRONIZED ✓", disabled=True)
    else:
        if st.button("EXECUTE REBALANCE"):
            st.session_state.rebalanced = True
            st.rerun()

# --- 5. TABS ---
t1, t2, t3 = st.tabs(["OVERVIEW", "STRATEGY", "EMPIRE SCALING"])

with t1:
    col1, col2 = st.columns([1, 2])
    with col1:
        st.markdown("<div class='quant-card'>", unsafe_allow_html=True)
        st.write("📈 MARKET SENTIMENT")
        st.title("72%")
        st.caption("Improving: Strong institutional appetite.")
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.write("📊 INSTITUTIONAL ETF FLOWS")
        st.plotly_chart(get_etf_chart(), use_container_width=True)

with t2:
    if st.session_state.black_swan:
        st.error("🚨 BLACK SWAN DETECTED: RISK AUDITOR HAS SEIZED CONTROL")
    
    col_a, col_b = st.columns(2)
    with col_a:
        st.success("⚡ ALPHA HUNTER: Bullish on AI Scaling")
        st.warning("🛡️ RISK AUDITOR: Cautionary - ETF flows neutral")
    
    with col_b:
        st.session_state.black_swan = st.toggle("Trigger Black Swan Simulation")
        st.write("Neural Logs")
        st.markdown("""<div class='log-container'>
        [14:22] Querying SoSoValue API...<br>
