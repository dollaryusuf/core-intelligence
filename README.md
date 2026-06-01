# SoSo-Vault: Neural Consensus Quant Terminal 🛡️📈

**Institutional-Grade Risk Management & Alpha Generation powered by SoSoValue API.**

SoSo-Vault is a high-fidelity quantitative terminal designed to bridge social sentiment intelligence with institutional ETF liquidity data. By utilizing a "Neural Consensus" architecture, the system gates high-conviction Alpha signals through a hard-coded Python Risk Auditor, ensuring capital preservation in volatile market conditions.

---

## 🏗️ System Architecture

- **Frontend:** React 18 (Vite) + Tailwind Institutional UI.
- **Backend:** Python 3.9 (Flask) deployed via Vercel Serverless Functions.
- **Data Layer:** Real-time ingestion of ETF Inflows/Outflows and Sentiment Indices via **SoSoValue Production API**.
- **Governance:** EVM-compatible Auditor Handshake (`0x42f...921`) for protocol-level overrides.
- **Sentinel:** Full-duplex Telegram Bot integration for real-time risk alerts and mobile queries.

## 🧠 Core Features: Wave 2 Milestone

### 1. Neural Consensus Engine
The vault operates on a dual-logic gate:
*   **Alpha Hunter (Intelligence):** Synthesizes market narratives and social sentiment.
*   **Risk Auditor (Python):** Automatically VETOs or scales positions based on SoSoValue ETF liquidity data. If institutional outflows are detected, the system forces a "Stability Mode" regardless of bullish sentiment.

### 2. Evidence Vault & Verifiability
Every trade signal includes a "Source of Truth" payload. Users can inspect the raw JSON from the SoSoValue API to verify the data driving the Neural Consensus.

### 3. Risk Sentinel (Telegram)
A mobile-first extension of the terminal. The Sentinel Bot provides:
*   Real-time push notifications for backtest triggers.
*   On-demand `/status` and `/risk` queries.
*   Verification of the EVM Auditor handshake.

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- SoSoValue API Key

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/soso-vault.git
   cd soso-vault