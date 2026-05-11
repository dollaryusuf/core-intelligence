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
  })).optional(),
  timestamp: z.number().optional(),
});

export type MarketState = z.infer<typeof MarketStateSchema>;

export class SoSoClient {
  private apiKey?: string;
  private mockMode: boolean;

  constructor(apiKey?: string, mockMode: boolean = true) {
    this.apiKey = apiKey;
    this.mockMode = mockMode;
  }

  async fetchSentiment() {
    if (this.mockMode) {
      return {
        score: parseFloat((0.6 + Math.random() * 0.3).toFixed(2)),
        hashtags: ["#AI", "#L2", "#BTC", "#DePIN"].sort(() => 0.5 - Math.random()),
      };
    }
    // Real API logic here
    return { score: 0.5, hashtags: [] };
  }
  
  async fetchTopNews() {
    if (this.mockMode) {
      return [
        { 
          title: "BlackRock Spot BTC ETF Records $150M Single-Day Inflow", 
          description: "Institutional demand remains resilient as macro conditions stabilize according to SoSoValue data." 
        },
        { 
          title: "AI-Agents Sector Outperforms Market by 12% in Weekly Cycle", 
          description: "Neural compute narratives are driving capital rotation into high-beta AI tokens." 
        },
        { 
          title: "L2 Ecosystem TVL Hits Record High Amid Lower Gas Protocols", 
          description: "On-chain activity is shifting towards scalable layers, favoring platforms like Arbitrum and Base." 
        }
      ];
    }
    return [];
  }

  async fetchIndexData() {
    if (this.mockMode) {
      return {
        AI: parseFloat((5 + Math.random() * 15).toFixed(2)),
        L2: parseFloat((Math.random() * 8).toFixed(2)),
        DePIN: parseFloat((-5 + Math.random() * 10).toFixed(2)),
        RWA: parseFloat((2 + Math.random() * 12).toFixed(2)),
      };
    }
    return {};
  }

  async fetchMacroFlows() {
    if (this.mockMode) {
      return Array.from({ length: 5 }, () => parseFloat((-100 + Math.random() * 300).toFixed(2)));
    }
    return [];
  }

  async getMarketState(): Promise<MarketState> {
    const sentiment = await this.fetchSentiment();
    const indices = await this.fetchIndexData();
    const flows = await this.fetchMacroFlows();
    const news = await this.fetchTopNews();

    const rawData = {
      sentiment_score: sentiment.score,
      top_narratives: sentiment.hashtags,
      sector_performance_map: indices,
      etf_net_flows: flows,
      funding_rates: parseFloat((0.01 + Math.random() * 0.05).toFixed(3)),
      top_news: news,
      timestamp: Date.now(),
    };

    return MarketStateSchema.parse(rawData);
  }
}
