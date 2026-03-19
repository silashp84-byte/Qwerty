
import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal } from "../types";

export const getMarketAnalysis = async (market: string): Promise<TradingSignal> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the current ${market} market conditions. 
    Act as a world-class financial analyst. Be assertive. 
    Pick a specific high-volume asset within the ${market} category (e.g., BTC/USD for Crypto, EUR/USD for Forex, or a major stock).
    Provide a clear trading signal (BUY, SELL, or NEUTRAL) for a potential move of 1000 points (or equivalent in current asset units) within the next 15 minutes.
    Include:
    1. A confidence score (0-100).
    2. A target price for this 15-minute window.
    3. The exact minute for entry (e.g., "14:05") and the expected minute for exit when hitting the target (e.g., "14:18").
    4. The recommended lot size to achieve a 200% profit on this 1000-point move, assuming a standard risk management profile.
    5. A short technical explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          direction: { type: Type.STRING, description: "BUY, SELL, or NEUTRAL" },
          confidence: { type: Type.NUMBER },
          price: { type: Type.STRING },
          targetPrice: { type: Type.STRING, description: "The 1000-point target price" },
          timeframe: { type: Type.STRING, description: "The 15-minute window" },
          market: { type: Type.STRING, description: "The specific asset name, e.g., BTC/USD" },
          entryTime: { type: Type.STRING, description: "Minute of entry" },
          exitTime: { type: Type.STRING, description: "Minute of exit hitting target" },
          lotSize: { type: Type.STRING, description: "Lot size for 200% profit" },
          reasoning: { type: Type.STRING },
          indicators: {
            type: Type.OBJECT,
            properties: {
              rsi: { type: Type.NUMBER },
              macd: { type: Type.STRING },
              trend: { type: Type.STRING }
            },
            required: ["rsi", "macd", "trend"]
          }
        },
        required: ["direction", "confidence", "price", "targetPrice", "timeframe", "market", "entryTime", "exitTime", "lotSize", "reasoning", "indicators"]
      }
    }
  });

  const signal = JSON.parse(response.text.trim());
  return {
    ...signal,
    timestamp: new Date().toLocaleTimeString()
  };
};
