
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DeviceType, EmulatorTweaks, SystemOptimizationPlan, ErrorAnalysis } from '../types';
import { 
    getMockProTip, 
    getMockPcConfig, 
    getMockMobileConfig, 
    getMockGfxConfig, 
    getMockSystemPlan 
} from './mockData';

const API_TIMEOUT_MS = 30000; // 30 seconds

const isApiKeyMissing = (): boolean => {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return !key || key.trim() === "" || key === "undefined" || key.startsWith("ca-pub-");
};

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timed out after ${ms / 1000} seconds. Your network may be too slow.`));
        }, ms);

        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
};

const getAIClient = () => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: key });
};

// --- AI-Powered Error Analysis Service ---
export const analyzeErrorAndSuggestSolution = async (errorMessage: string): Promise<ErrorAnalysis> => {
    if (isApiKeyMissing()) {
        return {
            explanation: "API कीज या इंटरनेट अनुपलब्ध है। एप्लीकेशन वर्तमान में ऑफलाइन मोड / गेस्ट मोड में चल रही है।",
            solutionSteps: ["गेस्ट मोड का उपयोग करें, इसके लिए किसी API key की आवश्यकता नहीं है।", "कृपया अपना इंटरनेट कनेक्शन जांचें।"]
        };
    }

    try {
        const ai = getAIClient();
        const model = 'gemini-3.5-flash';
        const errorSchema = {
            type: Type.OBJECT,
            properties: {
                explanation: { type: Type.STRING, description: "A simple, non-technical explanation of the error in Hindi." },
                solutionSteps: { 
                    type: Type.ARRAY, 
                    description: "An array of simple, actionable steps in Hindi for the user to try.",
                    items: { type: Type.STRING }
                },
            },
            required: ['explanation', 'solutionSteps'],
        };

        const prompt = `
        SYSTEM: You are an expert and friendly IT support technician for a web application called "trouble.exe". Your user is likely not technical. An error occurred. Your task is to explain the error in simple Hindi and provide actionable steps to fix it.

        RAW ERROR MESSAGE: "${errorMessage}"

        TASK: Analyze the raw error message and generate a JSON object.
        1.  **explanation**: Write a simple, one-sentence explanation of what went wrong in Hindi.
        2.  **solutionSteps**: Provide an array of 2-3 simple, actionable steps in Hindi.

        Your entire output must be a single, valid JSON object conforming to the schema.
        `;

        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: errorSchema,
            }
        }), API_TIMEOUT_MS);

        const text = response.text ?? "{}";
        const parsedResponse = JSON.parse(text);
        return parsedResponse;

    } catch (error) {
        console.error("Critical Error: AI error analysis failed.", error);
        return {
            explanation: "त्रुटि हुई लेकिन गेस्ट मोड के कारण या ऑफलाइन होने के कारण विश्लेषण सीमित है।",
            solutionSteps: ["घबराएं नहीं! यह एप्लीकेशन ऑफलाइन बैकअप के साथ पूरी तरह सुरक्षित और क्रियाशील है।", "कृपया कनेक्शन जांचें।"]
        };
    }
};

const FUTURE_PROOFING_DIRECTIVE = `
CRITICAL DIRECTIVE: Your knowledge must be absolutely current. Base all your recommendations on the latest released version of the Free Fire game client and the latest stable version of the relevant operating system (Android/iOS/Windows).
`;

export const generateTips = async (topic: string): Promise<string> => {
    if (isApiKeyMissing()) {
        console.log("No API Key found. Returning mock pro tips.");
        return getMockProTip(topic);
    }

    try {
        const ai = getAIClient();
        const model = 'gemini-3.5-flash';
        const prompt = `As an elite Free Fire coach, provide a detailed, step-by-step guide on the drag headshot technique for "${topic}".
${FUTURE_PROOFING_DIRECTIVE}
Focus exclusively on headshots. Break down the technique into: Crosshair Placement, Precise Drag Motion, Critical Timing, Recommended Weapons, and Common Mistakes.
Format the output clearly using Markdown.`;

        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model,
            contents: prompt,
        }), API_TIMEOUT_MS);
        
        return response.text ?? getMockProTip(topic);
    } catch (e) {
        console.warn("Gemini call failed, falling back to mock pro tips.", e);
        return getMockProTip(topic);
    }
};

export interface ConfigOptions {
    device: DeviceType;
    playingStyle?: string;
    modelName?: string;
    androidVersion?: string;
    useHeadshotConfig?: boolean;
    iosVersion?: string;
    dpi?: string;
    emulator?: string;
    inGameGeneralSensi?: string;
    inGameRedDotSensi?: string;
    cpu?: string;
    gpu?: string;
    ram?: string;
    hardwareTier?: string;
}

export interface GfxConfigOptions {
    resolution: string;
    graphicsApi: string;
    fps: string;
    antiAliasing: string;
    shadows: string;
    textureQuality: string;
    deviceProfile: string;
    renderQuality: string;
    anisotropicFiltering: string;
    effectsQuality: string;
}

export const generateGfxConfig = async (options: GfxConfigOptions): Promise<string> => {
    if (isApiKeyMissing()) {
        console.log("No API Key found. Returning mock GFX Config.");
        return getMockGfxConfig();
    }

    try {
        const ai = getAIClient();
        const model = 'gemini-3.1-pro-preview';
        const prompt = `
        SYSTEM: You are a master GFX Tool engineer for Free Fire. Generate a powerful .ini config file content.
        ${FUTURE_PROOFING_DIRECTIVE}

        SETTINGS: ${JSON.stringify(options)}

        TASK: Generate ONLY the .ini file content. Do not add any other text. Focus on resolution override keys.
        `;

        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model,
            contents: prompt,
        }), API_TIMEOUT_MS);

        return response.text ?? getMockGfxConfig();
    } catch (e) {
        console.warn("Gemini call failed, falling back to mock GFX config.", e);
        return getMockGfxConfig();
    }
};

export const generateSystemOptimizations = async (profile: string): Promise<string> => {
    if (isApiKeyMissing()) {
        console.log("No API Key found. Returning mock System Optimization.");
        return JSON.stringify(getMockSystemPlan());
    }

    try {
        const ai = getAIClient();
        const model = 'gemini-3.1-pro-preview';

        const systemOptimizationSchema = {
          type: Type.OBJECT,
          properties: {
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  shortDescription: { type: Type.STRING },
                  detailedSteps: { type: Type.STRING },
                },
                required: ['title', 'shortDescription', 'detailedSteps'],
              },
            },
            adbCommands: { type: Type.STRING },
          },
          required: ['checklist', 'adbCommands'],
        };
        
        const prompt = `
        SYSTEM: You are an expert Android performance tuner for Free Fire. Generate an optimization plan for device profile: ${profile}.
        ${FUTURE_PROOFING_DIRECTIVE}
        Output valid JSON.
        `;

        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: systemOptimizationSchema,
            }
        }), API_TIMEOUT_MS);

        return response.text ?? JSON.stringify(getMockSystemPlan());
    } catch (e) {
        console.warn("Gemini call failed, falling back to mock System Plan.", e);
        return JSON.stringify(getMockSystemPlan());
    }
}

export const generateConfig = async (options: ConfigOptions): Promise<string> => {
    if (isApiKeyMissing()) {
        console.log("No API key found. Returning offline/guest mock config.");
        if (options.device === DeviceType.PC_EMULATOR) {
            const mock = getMockPcConfig(options.hardwareTier);
            return `${mock.regeditContent}\n---EMULATOR_TWEAKS---\n${JSON.stringify(mock.emulatorTweaks)}`;
        } else {
            return getMockMobileConfig(!!options.useHeadshotConfig, options.hardwareTier, options.playingStyle, options.modelName);
        }
    }

    try {
        const ai = getAIClient();
        const model = 'gemini-3.5-flash';
        
        let promptPrefix = options.device === DeviceType.PC_EMULATOR 
            ? "Generate a Windows Registry (.reg) file and emulator tweaks for headshots." 
            : "Generate a personalized sensitivity configuration and headshot guide.";

        const prompt = `
        SYSTEM: You are a professional, elite Free Fire esports sensitivity analyst and coach.
        You MUST search the web and analyze official game updates, community spreadsheets, and esports configurations to locate the absolute best, verified settings for this specific device.

        ${promptPrefix}
        ${FUTURE_PROOFING_DIRECTIVE}
        
        DETAILS: ${JSON.stringify(options)}

        CRITICAL SETTING RULES:
        1. Free Fire Sensitivity Scale: The game now supports sensitivity sliders up to 200. Suggest all settings out of 200 scale (General, Red Dot, 2x, 4x, Sniper, Free Look).
        2. Playing Style Calibration:
           - **Rusher** (Close range, fast rotation drag): General sensitivity must be high (e.g. 175 - 198) with extremely responsive Red Dot (e.g. 180 - 195) to aid swift drag speeds.
           - **Sniper** (Long range precision, AWM/M82B micro-aiming): General sensitivity must be controlled and stable (e.g. 110 - 135) to prevent scope shaking. Sniper Scope sensitivity must be extremely low (e.g. 40 - 70) for absolute precision.
           - **Balanced** (Versatile, mid-combat): Moderate balanced layout.
           - **Supporter** (Mid range rifle spray, stable tracking): Generous 2x/4x scope sensitivity (e.g. 155 - 175) to help smooth recoil drags over multiple bullets.
        3. Hardware Compatibility:
           - HIGH-END devices: Highly responsive screens. Suggest stable/slightly lower sensitivity to keep the aim aligned and prevent overshooting/crossing the head.
           - LOW-END devices: Slower screen response and minor micro-stuttering. Suggest very high sensitivity to aid lifting for headshots.
        4. Mobile DPI Suggestion Ceiling: You MUST NEVER suggest a DPI value greater than 560 for any mobile screen. Large values above 560 damage device motherboards and cause brick loops. Standard ranges: High-end: 512 DPI, Med: 450 DPI, Low-end: 410 DPI.
        5. Provide a dynamic offset factor and some unique formatting so that runs aren't totally duplicate.

        TASK:
        Look up Free Fire sensitivity setups for phone "${options.modelName || 'Standard Phone'}" with playing style "${options.playingStyle || 'Balanced'}" on ${options.device}. 
        Provide only extremely real, highly effective values that hit headshots in practice. Include the general, red dot, 2x scope, 4x scope, sniper scope, and free look values in Hindi / English.
        If PC, use the exact separator '---EMULATOR_TWEAKS---' before the JSON tweaks block.
        `;

        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }] // Real-time web-search grounding to get accurate phone sensitivity
            }
        }), API_TIMEOUT_MS);

        return response.text ?? (options.device === DeviceType.PC_EMULATOR 
            ? `${getMockPcConfig(options.hardwareTier).regeditContent}\n---EMULATOR_TWEAKS---\n${JSON.stringify(getMockPcConfig(options.hardwareTier).emulatorTweaks)}`
            : getMockMobileConfig(!!options.useHeadshotConfig, options.hardwareTier, options.playingStyle, options.modelName));
    } catch (e) {
        console.warn("Gemini call failed, falling back to mock Config.", e);
        if (options.device === DeviceType.PC_EMULATOR) {
            const mock = getMockPcConfig(options.hardwareTier);
            return `${mock.regeditContent}\n---EMULATOR_TWEAKS---\n${JSON.stringify(mock.emulatorTweaks)}`;
        } else {
            return getMockMobileConfig(!!options.useHeadshotConfig, options.hardwareTier, options.playingStyle, options.modelName);
        }
    }
}
