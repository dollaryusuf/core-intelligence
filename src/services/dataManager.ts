import { z } from "zod";

// Strict Typing: Zod Schema (Equivalent to Pydantic)
export const MarketStateSchema = z.object({
  sentiment_score: z.number().min(0).max(1),
  top_narratives: z.array(z.string()),
  sector_performance_map: z.record(z.string(), z.number()),
  etf_net_flows: z.array(z.number()),
  funding_rates: z.number(),
  top_news: z.array(z.object({
    title: z.string(),
    description: z.string(),
    impact_level: z.string().optional(),
    sentiment_score: z.number().optional(),
    relative_time: z.string().optional(),
  })).optional(),
  timestamp: z.number().optional(),
  source: z.enum(["LIVE_API", "SIMULATED"]),
  is_guest_mode: z.boolean().optional(),
  crypto_prices: z.object({
    BTC: z.number(),
    ETH: z.number(),
    SOL: z.number(),
    STABLES: z.number(),
    USDC: z.number(),
  }).optional(),
});

export type MarketState = z.infer<typeof MarketStateSchema>;

export class SoSoClient {
  private apiKey?: string;
  private mockMode: boolean;
  private baseUrl: string;
  private isGuestMode: boolean = false;

  constructor(apiKey?: string, mockMode: boolean = true) {
    this.apiKey = apiKey;
    this.mockMode = mockMode;
    this.baseUrl = "https://api.sosovalue.xyz";
    // If key is missing or is just placeholder (or mockMode is enabled explicitly without valid key),
    // mark as guest mode
    if (!this.hasValidKey()) {
      this.isGuestMode = true;
    }
  }

  getIsGuestMode(): boolean {
    return this.isGuestMode;
  }

  private hasValidKey(): boolean {
    const valid = !!(this.apiKey && !this.apiKey.startsWith("MY_") && this.apiKey.length >= 10);
    if (!valid) {
      this.isGuestMode = true;
    }
    return valid;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }
    return headers;
  }

  // Helper for requests with a timeout
  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 5000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  }

  async fetchSentiment(): Promise<{ score: number; hashtags: string[]; source: "LIVE_API" | "SIMULATED"; summary?: string; headlines?: any[] }> {
    if (!this.mockMode && this.hasValidKey()) {
      try {
        console.log("TypeScript: Fetching Sentiment from SoSoValue API...");
        const response = await this.fetchWithTimeout(`${this.baseUrl}/v1/news/sentiment/latest`, {
          method: "GET",
          headers: this.getHeaders()
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log("TypeScript: Live Sentiment data ingested successfully.");
          return {
            score: typeof data.score === "number" ? data.score : 0.78,
            hashtags: Array.isArray(data.narratives) ? data.narratives : ["#AI", "#L2", "#BTC", "#DePIN"],
            summary: data.summary || "Live API Sync: Positive sentiment detected across institutional channels.",
            headlines: data.headlines || [],
            source: "LIVE_API"
          };
        } else {
          if (response.status === 401 || response.status === 403) {
            this.isGuestMode = true;
          }
          console.warn(`TypeScript: Sentiment API returned status ${response.status}. Falling back to simulation.`);
        }
      } catch (err) {
        console.error("TypeScript Error fetching live Sentiment:", err, "Activating Simulation Fallback.");
      }
    }

    // High Fidelity Simulation fallback
    return {
      score: parseFloat((0.6 + Math.random() * 0.28).toFixed(2)),
      hashtags: ["#AI", "#L2", "#BTC", "#DePIN", "#RWA", "#SolanaBeta"].sort(() => 0.5 - Math.random()).slice(0, 4),
      summary: "Simulation mode: Institutional flow stabilizes, sustaining momentum indices.",
      source: "SIMULATED"
    };
  }
  
  async fetchTopNews(sentimentResult?: { source: "LIVE_API" | "SIMULATED"; headlines?: any[] }) {
    // If the Sentiment API already returned Headlines, reuse them directly to minimize fetch cycles.
    if (sentimentResult && sentimentResult.source === "LIVE_API" && sentimentResult.headlines && sentimentResult.headlines.length > 0) {
      return sentimentResult.headlines;
    }

    // Default mock headlines
    return [
      { 
        title: "BlackRock Spot BTC ETF Records $150M Single-Day Inflow", 
        description: "Institutional demand remains resilient as macro conditions stabilize according to SoSoValue data.",
        impact_level: "HIGH",
        sentiment_score: 0.88,
        relative_time: "12m ago"
      },
      { 
        title: "AI-Agents Sector Outperforms Market by 12% in Weekly Cycle", 
        description: "Neural compute narratives are driving capital rotation into high-beta AI tokens.",
        impact_level: "HIGH",
        sentiment_score: 0.74,
        relative_time: "2h ago"
      },
      { 
        title: "L2 Ecosystem TVL Hits Record High Amid Lower Gas Protocols", 
        description: "On-chain activity is shifting towards scalable layers, favoring platforms like Arbitrum and Base.",
        impact_level: "MEDIUM",
        sentiment_score: 0.62,
        relative_time: "4h ago"
      }
    ];
  }

  async fetchIndexData(): Promise<{ sectors: Record<string, number>; source: "LIVE_API" | "SIMULATED" }> {
    if (!this.mockMode && this.hasValidKey()) {
      try {
        console.log("TypeScript: Fetching Sector Performance from SoSoValue API...");
        const response = await this.fetchWithTimeout(`${this.baseUrl}/v1/indices/sector_performance`, {
          method: "GET",
          headers: this.getHeaders()
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log("TypeScript: Live Sector performance data ingested successfully.");
          return {
            sectors: data.sectors || {
              AI: 12.5,
              L2: 4.2,
              DePIN: 8.1,
              RWA: 3.7
            },
            source: "LIVE_API"
          };
        } else {
          if (response.status === 401 || response.status === 403) {
            this.isGuestMode = true;
          }
          console.warn(`TypeScript: Sector API returned status ${response.status}. Falling back to simulation.`);
        }
      } catch (err) {
        console.error("TypeScript Error fetching live Sectors:", err, "Activating Simulation Fallback.");
      }
    }

    return {
      sectors: {
        AI: parseFloat((5 + Math.random() * 12).toFixed(2)),
        L2: parseFloat((Math.random() * 7).toFixed(2)),
        DePIN: parseFloat((-3 + Math.random() * 11).toFixed(2)),
        RWA: parseFloat((2 + Math.random() * 10).toFixed(2)),
      },
      source: "SIMULATED"
    };
  }

  async fetchMacroFlows(): Promise<{ flows: number[]; source: "LIVE_API" | "SIMULATED" }> {
    if (!this.mockMode && this.hasValidKey()) {
      try {
        console.log("TypeScript: Fetching ETF Inflows from SoSoValue API...");
        const response = await this.fetchWithTimeout(`${this.baseUrl}/v1/market/etf/latest`, {
          method: "GET",
          headers: this.getHeaders()
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log("TypeScript: Live ETF inflows ingested successfully.");
          return {
            flows: Array.isArray(data.historicalTrend) ? data.historicalTrend : [152.4, 210.3, -42.0, 85.0, 115.2],
            source: "LIVE_API"
          };
        } else {
          if (response.status === 401 || response.status === 403) {
            this.isGuestMode = true;
          }
          console.warn(`TypeScript: ETF API returned status ${response.status}. Falling back to simulation.`);
        }
      } catch (err) {
        console.error("TypeScript Error fetching live ETF Flows:", err, "Activating Simulation Fallback.");
      }
    }

    return {
      flows: Array.from({ length: 5 }, () => parseFloat((-100 + Math.random() * 280).toFixed(2))),
      source: "SIMULATED"
    };
  }

  async fetchAssetPrices(): Promise<{ BTC: number; ETH: number; SOL: number; STABLES: number; USDC: number }> {
    const prices = { BTC: 64500.0, ETH: 3480.0, SOL: 155.0, STABLES: 1.0, USDC: 1.0 };
    try {
      console.log("TypeScript: Fetching live prices from Binance ticker...");
      const response = await this.fetchWithTimeout("https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22SOLUSDT%22%5D", {
        method: "GET"
      }, 3000);
      if (response.status === 200) {
        const data = await response.json();
        for (const item of data) {
          if (item.symbol === "BTCUSDT") prices.BTC = parseFloat(item.price);
          else if (item.symbol === "ETHUSDT") prices.ETH = parseFloat(item.price);
          else if (item.symbol === "SOLUSDT") prices.SOL = parseFloat(item.price);
        }
      }
    } catch (e) {
      console.warn("TypeScript Error fetching live prices from Binance, using dynamic simulated prices", e);
      // Fallback with small time-based fluctuation context
      const t = Date.now() / 1000;
      prices.BTC = Math.round((64500.0 + 250.0 * Math.sin(t / 60)) * 100) / 100;
      prices.ETH = Math.round((3480.0 + 15.0 * Math.sin(t / 60)) * 100) / 100;
      prices.SOL = Math.round((155.0 + 1.2 * Math.sin(t / 60)) * 100) / 100;
    }
    return prices;
  }

  async getMarketState(): Promise<MarketState> {
    const sentiment = await this.fetchSentiment();
    const indices = await this.fetchIndexData();
    const flows = await this.fetchMacroFlows();
    const news = await this.fetchTopNews(sentiment);
    const cryptoPrices = await this.fetchAssetPrices();

    // Determine the general aggregate source
    const aggregateSource: "LIVE_API" | "SIMULATED" = 
      (sentiment.source === "LIVE_API" && indices.source === "LIVE_API" && flows.source === "LIVE_API")
        ? "LIVE_API"
        : "SIMULATED";

    const rawData = {
      sentiment_score: sentiment.score,
      top_narratives: sentiment.hashtags,
      sector_performance_map: indices.sectors,
      etf_net_flows: flows.flows,
      funding_rates: parseFloat((0.01 + Math.random() * 0.04).toFixed(3)),
      top_news: news,
      timestamp: Date.now(),
      source: aggregateSource,
      is_guest_mode: this.getIsGuestMode(),
      crypto_prices: cryptoPrices
    };

    return MarketStateSchema.parse(rawData);
  }
}

