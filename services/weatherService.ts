
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Cleans the response text by removing potential markdown code blocks 
 * that the model might include despite requested JSON output.
 */
function cleanJsonResponse(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text.replace(/```json\n?|```/g, '').trim();
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Get the current weather and a 5-day forecast for ${city}. Include location name, temperature in Celsius, condition, humidity, wind speed, and visibility. Provide a brief, engaging AI advice snippet for clothing/activities. Respond in valid JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          country: { type: Type.STRING },
          current: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              description: { type: Type.STRING },
              humidity: { type: Type.NUMBER },
              windSpeed: { type: Type.NUMBER },
              feelsLike: { type: Type.NUMBER },
              visibility: { type: Type.NUMBER },
            },
            required: ["temp", "condition", "humidity", "windSpeed"],
          },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayName: { type: Type.STRING },
                high: { type: Type.NUMBER },
                low: { type: Type.NUMBER },
                condition: { type: Type.STRING },
              },
              required: ["dayName", "high", "low", "condition"]
            }
          },
          aiAdvice: { type: Type.STRING },
        },
        required: ["location", "current", "forecast", "aiAdvice"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to retrieve weather data.");
  
  try {
    const cleanedText = cleanJsonResponse(text);
    return JSON.parse(cleanedText) as WeatherData;
  } catch (err) {
    console.error("JSON Parsing Error at text length:", text.length, err);
    throw new Error("The weather intelligence system returned a malformed response. Please try searching again.");
  }
}
