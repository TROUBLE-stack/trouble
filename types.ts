// Fix: Removed circular self-import of 'EmulatorTweaks' and 'SystemOptimizationPlan' as they are defined within this file.

export enum DeviceType {
  ANDROID = "Android",
  IPHONE = "iPhone"
}

export interface EmulatorTweaks {
  performance: {
    cpuCores: string;
    ramAllocation: string;
  };
  display: {
    resolution: string;
    engineSettings: string;
  };
  sensitivity: {
    emulatorX: number;
    emulatorY: number;
  };
  specialTweak?: {
    value: string;
    description: string;
  };
}

export interface OptimizationStep {
  title: string;
  shortDescription: string;
  detailedSteps: string;
}

export interface SystemOptimizationPlan {
  checklist: OptimizationStep[];
  adbCommands: string;
}

export interface ErrorAnalysis {
  explanation: string;
  solutionSteps: string[];
}

// --- New Types for History and Profile ---

export enum HistoryType {
    PRO_TIP = 'Pro Tip',
    MOBILE_CONFIG = 'Mobile Config',
    GFX_CONFIG = 'GFX Config',
    SYSTEM_PLAN = 'System Optimization Plan',
}

export type HistoryItemData = 
    | string 
    | SystemOptimizationPlan;

export interface HistoryItem {
    id: string;
    type: HistoryType;
    timestamp: number;
    data: HistoryItemData;
    // For context, we can store what generated it
    context?: string; 
}

export interface DeviceProfileData {
    // Mobile
    modelName?: string;
    androidVersion?: string;
    iosVersion?: string;
    hardwareTier?: string;
    gpu?: string;
}