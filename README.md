# SoSo-Vault: Neural Consensus Quant Terminal 🛡️📈

**Institutional-Grade Risk Management & Alpha Generation, powered by the SoSoValue API.**

SoSo-Vault is an autonomous Board of Directors for the on-chain treasury operator. It bridges social-sentiment intelligence with institutional ETF liquidity data through a **Neural Consensus** architecture — every high-conviction Alpha signal is gated through a hard-coded Python Risk Auditor before it can act, so a solo operator can manage a multi-million dollar treasury with the same evidentiary rigor as an institutional desk.

---

## 🏗️ System Architecture

- **Frontend:** React 18 (Vite) + Tailwind, with an institutional "Command Terminal" gateway.
- **Backend:** Python (Flask) on Vercel Serverless Functions.
- **Data Layer:** Live ingestion of currency prices, ETF flows, sector performance, and news from the **SoSoValue Production API** (`openapi.sosovalue.com`), with an honestly-labeled fallback chain (secondary market data → simulated) so the terminal never silently fakes a live number — every data point carries its own `source` tag (`LIVE_API` vs `SIMULATED`).
- **Governance:** EVM-compatible Auditor Handshake and on-chain execution contract on Ethereum Sepolia.
- **Sentinel:** Full-duplex Telegram Bot integration for mobile risk alerts and on-demand queries.

## 🧠 Core Features

### 1. Neural Consensus Engine
The vault operates on a dual-agent gate:
- **Alpha Hunter (Intelligence):** Synthesizes market narratives and live SoSoValue news into high-conviction signals.
- **Risk Auditor (Python):** Automatically VETOs or scales positions against live SoSoValue ETF flow data. If institutional outflows are detected, the system forces a "Stability Mode" regardless of bullish sentiment or social hype.

### 2. Evidence Vault & Verifiability
Every trade signal and ticker update includes a "Source of Truth" payload. Users can inspect the raw JSON from the SoSoValue API — including a per-request `soso-api-request-id` — to independently verify the exact data driving the Neural Consensus, not just trust a polished UI.

### 3. Risk Sentinel (Telegram)
A mobile-first extension of the terminal:
- Real-time push notifications for backtest triggers.
- On-demand `/status`, `/alpha`, and `/risk` queries.
- Verification of the EVM Auditor handshake from your phone.

### 4. Institutional Gateway
The public-facing Landing Page is a live "Command Terminal" — real-time SoSoValue pricing, sentiment, and on-chain governance details are visible before a visitor even connects a wallet, backed by the same live-data layer as the authenticated dashboard.

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- A SoSoValue API key (get one at [docs.sosovalue.xyz](https://docs.sosovalue.xyz/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dollaryusuf/core-intelligence.git
   cd core-intelligence
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and populate `SOSO_API_KEY`, `TELEGRAM_TOKEN`, `VITE_CONTRACT_ADDRESS`, and `VITE_AUTHORIZED_AUDITOR`.

3. **Frontend setup:**
   ```bash
   npm install
   npm run dev
   ```

4. **Backend setup:**
   The Flask backend lives in `/api`. For local testing:
   ```bash
   pip install -r requirements.txt
   ```

---

## 📊 Protocol Status

- **Current 7-Day Alpha Capture:** 17.0%
- **Execution Contract (Ethereum Sepolia):** `0x68E4412Ad8645cC45bD170fa4E4A745b0441bfEf`
- **Authorized Auditor Wallet:** `0x551B3c796dC89726BDAe006Ce9273dcFf8FB5414`
- **Protocol Status:** Wave 3 — Verifiability Update
