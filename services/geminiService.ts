
import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal } from "../types";

export const getMarketAnalysis = async (market: string): Promise<TradingSignal> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the current ${market} market conditions. 
    Act as a world-class financial analyst. Be assertive. 
    Provide a clear trading signal (BUY, SELL, or NEUTRAL), a confidence score (0-100), 
    and a short technical explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          direction: { type: Type.STRING, description: "BUY, SELL, or NEUTRAL" },
          confidence: { type: Type.NUMBER },
          price: { type: Type.STRING },
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
        required: ["direction", "confidence", "price", "reasoning", "indicators"]
      }
    }
  });

  const signal = JSON.parse(response.text.trim());
  return {
    ...signal,
    timestamp: new Date().toLocaleTimeString()
  };
};
