
import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal } from "../types";

export const getMarketAnalysis = async (market: string): Promise<TradingSignal> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze ${market} market. 
    Act as a world-class analyst. 
    1. Pick a high-volume asset (e.g., BTC/USD, EUR/USD).
    2. Signal (BUY/SELL/NEUTRAL) for 1000pt move in 15min.
    3. Confidence (0-100), Target Price, Entry/Exit minutes, Lot Size for 200% profit.
    4. Short technical reasoning.`,
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
