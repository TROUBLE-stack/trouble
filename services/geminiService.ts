import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTips = async (topic: string): Promise<string> => {
  try {
    const prompt = `Act as an expert FF (Free Fire) pro gamer and strategist. Provide a list of actionable pro tips for the following topic: "${topic}". Structure the response clearly. Use markdown-style headings for sections and bullet points for individual tips. Keep the tone sharp and to the point, like a real gamer giving advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating tips:", error);
    return "Error: Could not fetch tips from AI model. Please check your connection and API key.";
  }
};

export const generateHeadshotConfig = async (device: string): Promise<string> => {
  try {
    const prompt = `
Generate a JSON object representing optimal sensitivity and crosshair settings for an FF (Free Fire) player using a device identified as: "${device}".

Adhere to the following strict rules for generation:

1.  **Device Categorization:**
    *   If the device is an Android or iPhone model, analyze its name and known specifications to classify it into one of four tiers: High-End, Medium-End, Low-End, or Ultra Low-End.
    *   If no specific model is provided for "iPhone", classify it as a general High-End device.
    *   Classify iPad and PC Emulator as High-End devices.

2.  **Sensitivity Mapping (Inverse Logic):** The goal is to balance device performance with sensitivity. Powerful devices need lower sensitivity for precision, while less powerful devices need higher sensitivity to compensate.
    *   **High-End Devices:** Generate 'Low' sensitivity values. Each sensitivity setting must be an integer between 70 and 100.
    *   **Medium-End Devices:** Generate 'Medium' sensitivity values. Each setting must be an integer between 110 and 160.
    *   **Low-End Devices:** Generate 'High' sensitivity values. Each setting must be an integer between 170 and 200.
    *   **Ultra Low-End Devices:** Also generate 'High' sensitivity values. Each setting must be an integer between 170 and 200.

3.  **Output Format:**
    *   The sensitivity values must be integers within their specified ranges.
    *   Populate the 'deviceTier' field with the determined classification ('High-End', 'Medium-End', 'Low-End', or 'Ultra Low-End').
    *   The final output must be a perfectly formatted JSON object that adheres to the provided schema. Do not include any explanatory text outside the JSON structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deviceName: { type: Type.STRING },
            deviceTier: { type: Type.STRING, description: "The classification of the device: 'High-End', 'Medium-End', 'Low-End', or 'Ultra Low-End'." },
            generalSensitivity: { type: Type.INTEGER },
            redDotSensitivity: { type: Type.INTEGER },
            '2xScope': { type: Type.INTEGER },
            '4xScope': { type: Type.INTEGER },
            sniperScope: { type: Type.INTEGER },
            freeLook: { type: Type.INTEGER },
            crosshairType: { type: Type.STRING, enum: ['classic', 'new', 'dynamic'] },
            crosshairColor: { type: Type.STRING, enum: ['white', 'green', 'cyan', 'red'] },
            crosshairSize: { type: Type.INTEGER },
          },
          required: ['deviceName', 'deviceTier', 'generalSensitivity', 'redDotSensitivity', '2xScope', '4xScope', 'sniperScope', 'freeLook', 'crosshairType', 'crosshairColor', 'crosshairSize'],
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating config:", error);
    return `{"error": "Failed to generate configuration. The AI model might be unavailable or the request was malformed."}`;
  }
};