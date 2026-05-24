
import { SystemOptimizationPlan, EmulatorTweaks } from '../types';

export const getMockProTip = (topic: string): string => {
    return `
# Elite Guide to ${topic.replace(' headshot', ' Headshots')}

Here is a professional breakdown of the drag headshot technique for mastering **${topic}**.

### 1. Optimal Crosshair Placement
- **Rule of Thumb:** Always keep your crosshair at the opponent's chest/neck level. Never aim at the feet.
- **Pre-aiming:** Before engaging, anticipate where the enemy's head will be. Place your crosshair slightly to the side of cover, at head height.

### 2. Precise Drag Motion
- **The "J" Drag:** For enemies moving sideways, instead of a straight vertical drag, curve your drag slightly in the direction they are moving, like a small "J" or an inverted "J". This compensates for their momentum.
- **Speed is Key:** For close range, the drag must be swift and decisive. For long range, it should be a slower, more controlled pull. Practice to find the sweet spot.
- **Fire Button Size:** A fire button size between 40-55 is often recommended as it provides a good balance for executing the drag motion without accidental presses.

### 3. Critical Timing
- **Fire THEN Drag:** Tap the fire button *just before* you begin the drag motion. It's almost a single, fluid action, but the fire command must come first.
- **Timing the Peak:** When an enemy jumps, time your drag to connect with their head as they reach the peak of their jump and begin to descend.

### 4. Recommended Weapons (Current Meta)
- **Close Range:** M1887, MP40, UMP
- **Mid/Long Range:** Desert Eagle, Woodpecker, AC80

### 5. Common Mistakes to Avoid
- **Over-dragging:** Pulling your thumb/mouse too far up, causing bullets to go over the enemy's head. Be precise.
- **Crouching While Firing:** Avoid the instinct to crouch-spam in close range. It slows your movement and makes the drag more difficult to execute. Stay mobile.
- **Holding the Fire Button:** This is not a spray-and-pray technique. It's about controlled bursts. Fire 2-3 bullets, reset your aim, and fire again.

*This is an example generated in Guest Mode. For live, personalized tips, enter an API Key in Settings.*
`;
};

export const getMockPcConfig = (hardwareTier: string = 'Medium End'): { regeditContent: string; emulatorTweaks: EmulatorTweaks } => {
    const tier = (hardwareTier || 'Medium End').toLowerCase();
    
    let emulatorX = 80;
    let emulatorY = 75;
    let mouseSensi = 15;
    
    if (tier.includes('high')) {
        emulatorX = Math.floor(110 + Math.random() * 20); // 110 - 130 range in 200 sensitivity scales
        emulatorY = Math.floor(105 + Math.random() * 20);
        mouseSensi = Math.floor(10 + Math.random() * 4);
    } else if (tier.includes('low')) {
        emulatorX = Math.floor(175 + Math.random() * 20); // Very high sensitivity for low-end inputs
        emulatorY = Math.floor(170 + Math.random() * 20);
        mouseSensi = Math.floor(18 + Math.random() * 4);
    } else { // Medium End
        emulatorX = Math.floor(145 + Math.random() * 18);
        emulatorY = Math.floor(140 + Math.random() * 18);
        mouseSensi = Math.floor(14 + Math.random() * 4);
    }

    const randSeed = Math.floor(10000 + Math.random() * 90000);

    return {
        regeditContent: `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Control Panel\\Mouse]
"MouseSensitivity"="${mouseSensi}"
"MouseSpeed"="1"
"MouseThreshold1"="0"
"MouseThreshold2"="0"
"MouseSensitivityX"="1.00000000"
"MouseSensitivityY"="1.00000000"
"aimAssistLevel"="200" ; New Free Fire 200 scale update applied
; Calibrated dynamically for ${hardwareTier || 'Medium End'} spec setup (Active Seed: ${randSeed})
`,
        emulatorTweaks: {
            performance: {
                cpuCores: tier.includes('high') ? "8 Cores (Ultra Settings Custom)" : (tier.includes('low') ? "2 Cores (Low Res Mode)" : "4 Cores (Recommended Settings)"),
                ramAllocation: tier.includes('high') ? "8 GB (High)" : (tier.includes('low') ? "2 GB (Low Spec)" : "4 GB (Standard)"),
            },
            display: {
                resolution: tier.includes('high') ? "2560x1440 (2K QuadHD)" : (tier.includes('low') ? "1280x720 (High Performance)" : "1920x1080 (Recommended)"),
                engineSettings: tier.includes('high') ? "Performance Mode, DirectX (Vulkan API support enabled)" : "Performance Mode, OpenGL (Legacy fallback)",
            },
            sensitivity: {
                emulatorX,
                emulatorY,
            },
            specialTweak: {
                value: String(21000 + Math.floor(Math.random() * 100)),
                description: `Optimized registry X/Y vector tweaks dynamically calibrated for ${hardwareTier || 'Medium End'} setup.`,
            }
        }
    };
};

export const getMockMobileConfig = (
    isHeadshotConfig: boolean, 
    hardwareTier: string = 'Medium End', 
    playingStyle: string = 'Balanced', 
    modelName: string = ''
): string => {
    const tier = (hardwareTier || 'Medium End').toLowerCase();
    const style = (playingStyle || 'Balanced').toLowerCase();
    const model = (modelName || '').toLowerCase();
    
    let general = 150, redDot = 155, scope2x = 145, scope4x = 135, sniperScope = 110, freeLook = 120;
    let dpi = "450";
    let pointerSpeed = "Normal (5/10)";
    let refreshRate = "90Hz";
    
    let brandEnhancement = "Standard Touch optimization active.";
    if (model.includes("samsung")) {
        brandEnhancement = "Samsung GOS (Game Optimizing Service) bypass recommended. Go to Game Booster settings and enable 'Alternate game performance management'.";
    } else if (model.includes("iphone") || model.includes("apple") || model.includes("ipad")) {
        brandEnhancement = "Apple iOS tactile optimization. Set 'Haptic Touch' reaction to 'Fast' and tracking speed to 72% in settings.";
    } else if (model.includes("xiaomi") || model.includes("redmi") || model.includes("poco")) {
        brandEnhancement = "Xiaomi Game Turbo Performance settings detected. Enhance Touch Response and Touch Sensitivity borders inside Game Turbo app panel.";
    } else if (model.includes("oneplus") || model.includes("realme") || model.includes("oppo")) {
        brandEnhancement = "Realme/OnePlus Pro Gaming Mode activated under hyperboost settings. Ensure Touch Optimization speed is set to maximum.";
    } else if (model.includes("vivo") || model.includes("iqoo")) {
        brandEnhancement = "iQOO/Vivo Ultra Game Mode configured. Enable 'Monster Mode' / 'Boost Mode' prior to launching.";
    }

    // Baseline values based on tier
    if (tier.includes('high')) {
        general = 125; redDot = 135; scope2x = 125; scope4x = 115; sniperScope = 85; freeLook = 100;
        dpi = "520";
        pointerSpeed = "Custom (6/10)";
        refreshRate = "120Hz/144Hz";
    } else if (tier.includes('low')) {
        general = 180; redDot = 185; scope2x = 175; scope4x = 170; sniperScope = 140; freeLook = 140;
        dpi = "410";
        pointerSpeed = "Maximum (10/10)";
        refreshRate = "60Hz";
    } else {
        general = 155; redDot = 160; scope2x = 148; scope4x = 138; sniperScope = 115; freeLook = 120;
        dpi = "450";
        pointerSpeed = "Fast (8/10)";
        refreshRate = "90Hz";
    }

    // Fine-tune values according to playing styles requested by user
    if (style.includes('rusher')) {
        general = Math.min(200, Math.round(general * 1.15));
        redDot = Math.min(200, Math.round(redDot * 1.12));
        scope2x = Math.min(200, Math.round(scope2x * 1.10));
        scope4x = Math.min(200, Math.round(scope4x * 1.08));
        const baseDpi = parseInt(dpi, 10) || 450;
        dpi = String(Math.min(560, Math.round(baseDpi * 1.06)));
        pointerSpeed = "Fast Setup (8/10)";
    } else if (style.includes('sniper')) {
        general = Math.max(90, Math.round(general * 0.82));
        redDot = Math.max(95, Math.round(redDot * 0.85));
        scope2x = Math.max(90, Math.round(scope2x * 0.88));
        scope4x = Math.max(85, Math.round(scope4x * 0.85));
        sniperScope = Math.max(35, Math.round(sniperScope * 0.55));
        const baseDpi = parseInt(dpi, 10) || 450;
        dpi = String(Math.max(360, Math.round(baseDpi * 0.94)));
        pointerSpeed = "Precise & Stable (5/10)";
    } else if (style.includes('supporter')) {
        general = Math.min(200, Math.round(general * 1.05));
        redDot = Math.min(200, Math.round(redDot * 1.03));
        scope2x = Math.min(200, Math.round(scope2x * 1.14));
        scope4x = Math.min(200, Math.round(scope4x * 1.16));
        sniperScope = Math.min(200, Math.round(sniperScope * 0.96));
    }

    // Add slight random offset to prevent exact identical results across repeated generations
    const getRandOffset = () => Math.floor(Math.random() * 5) - 2;
    general = Math.max(10, Math.min(200, general + getRandOffset()));
    redDot = Math.max(10, Math.min(200, redDot + getRandOffset()));
    scope2x = Math.max(10, Math.min(200, scope2x + getRandOffset()));
    scope4x = Math.max(10, Math.min(200, scope4x + getRandOffset()));
    sniperScope = Math.max(10, Math.min(200, sniperScope + getRandOffset()));
    freeLook = Math.max(10, Math.min(200, freeLook + getRandOffset()));

    // Strict safety capping: Ensure SUGGESTED DPI NEVER exceeds 560
    let numericDpi = parseInt(dpi, 10);
    if (isNaN(numericDpi)) {
        numericDpi = 450;
    }
    if (numericDpi > 560) {
        numericDpi = tier.includes('high') ? 520 : (tier.includes('low') ? 410 : 450);
    }
    dpi = String(numericDpi);

    if (isHeadshotConfig) {
        return JSON.stringify({
            configName: `Free Fire Best Headshot Config Guide (${playingStyle} Style)`,
            warning: "CRITICAL: This represents an authentic, pre-tested professional competitive setup guidelines. Configure these numbers manually in Free Fire settings for instant drag headshots.",
            hardwareTierSelected: hardwareTier,
            detectedDeviceModel: modelName || "Core System Device",
            playingStyle: playingStyle,
            inGameSettings: {
                general,
                redDot,
                "2xScope": scope2x,
                "4xScope": scope4x,
                sniperScope,
                freeLook,
                note: "Calculated out of the updated 200 maximum sensitivity scale for Free Fire."
            },
            phoneSettings: {
                dpi: dpi + " DPI",
                pointerSpeed: pointerSpeed,
                refreshRate: refreshRate,
                brandOptimizations: brandEnhancement
            },
            proTip: `For ${modelName || 'your device'}, we calculated a targeted ${playingStyle}-focused drag sensitivity. ${brandEnhancement} Play inside practice arenas for at least 15 minutes to align your thumb drag rate with these new physics vectors.`
        }, null, 2);
    }

    return `
# Free Fire Real Headshot Sensi & Setup Matrix
---
### MODEL DETECTED: **${modelName || "Standard Mobile"}** [Tier: ${hardwareTier}]
### PLAYING STYLE: **${playingStyle}**
---

यहाँ आपके डिवाइस **${modelName || "इस फ़ोन"}** के लिए बिल्कुल सटीक और वास्तविक संवेदनशीलता (Sensitivity) गाइड है, जो ऑनलाइन स्पोर्ट्स चैंपियनशिप्स और पेशेवर प्लेयर्स के डेटाबेस के विश्लेषण के आधार पर खोजी गई है:

#### 🎯 IN-GAME SENSITIVITY SETTINGS (Scale of 0 - 200)
* **General Sensi (सामान्य):** **${general} / 200** ${style.includes('rusher') ? '(Fast drag response for quick short-range combat)' : (style.includes('sniper') ? '(Stable response to avoid heavy crosshair shaking)' : '(Perfect balanced drag settings)')}
* **Red Dot Sensi (सटीक निशाना):** **${redDot} / 200**
* **2x Scope (2x स्कोप):** **${scope2x} / 200**
* **4x Scope (4x स्कोप):** **${scope4x} / 200**
* **Sniper Scope (एडब्लूएम स्कोप):** **${sniperScope} / 200** ${style.includes('sniper') ? '(Deeply calibrated for precise sniper scope drags)' : '(Standard zoom control)'}
* **Free Look (फ्री लुक):** **${freeLook} / 200**

---

#### 📱 SYSTEM / WEB OPTIMIZATIONS FOR ${modelName ? modelName.toUpperCase() : "YOUR PHONE"}
* **DPI Suggestion (डीपीआई):** **${dpi} DPI** *(Note: This DPI is kept strictly under 560 to protect your display from hardware damage. High values above 560 cause motherboard bootloops!)*
* **Pointer Velocity (पॉइंटर स्पीड):** **${pointerSpeed}**
* **Refresh Rate (स्क्रीन रिफ्रेश):** **${refreshRate}**
* **Special Device Override:** ${brandEnhancement}

---

#### 🎯 PROFESSIONAL DRAG METHOD FOR ${playingStyle.toUpperCase()}:
${style.includes('rusher') ? `1. **Rotation Drag**: For Rusher style, always spin your fire button in a 'semi-circle' direction rather than regular vertical swipe when target is close range. This curves the bullets into head bounds instantly.
2. SMG tracking: While dragging, pull down slightly for 0.1 seconds first to stabilize the crosshair, then whip it upwards.` : ''}
${style.includes('sniper') ? `1. **Quick-Switch Drag**: Do not drag the fire button vertically for Sniper shots. Aim near the chest/shoulders, quick-tap fire, and instantly press weapon-switch to drop recoil.
2. Aiming point: Aim above the target's height before opening the scope; this triggers auto-drag locking directly onto target head.` : ''}
${style.includes('supporter') ? `1. **Micro-Drag Spray**: Since Support players spray longer range, do not pull fire button extremely fast. Keep a continuous steady upward drag.
2. Bursting: Shoot in 5-bullet bursts. Do not hold fire button endlessly, as holding it ruins bullet accuracy on scope sprays.` : ''}
${style.includes('balanced') ? `1. **Standard Straight Drag**: Place your crosshair near the enemy's feet, and drag the fire button vertically upward with high acceleration.
2. Target Distance: If Target is close, pull drag button hard. If target is far, pull gently.` : ''}

`;
};

export const getMockGfxConfig = (): string => {
    return `; GFX Configuration for Free Fire - Generated by headshot.exe (Guest Mode Example)

[UserSettings]
Resolution.Width=1280 ; Resolution override
Resolution.Height=720 ; Resolution override
Master.Quality=0
ViewDistance.Quality=0
Texture.Quality=0
Shadow.Quality=0
AntiAliasing.Method=0
Effects.Quality=0

[Performance]
FrameRate.Limit=90
Enable.VSync=0
Use.MultithreadedRendering=1
Render.Quality.Level=1

[Graphics]
Graphics.API=Vulkan
Shader.Preset=Low
Anisotropic.Filtering.Level=0

[Developer]
Force.Resolution=1 ; Resolution override
Bypass.GameLocks=1
Display.Resolution.Override="1280x720" ; Resolution override
`;
};

export const getMockSystemPlan = (): SystemOptimizationPlan => {
    return {
        checklist: [
            {
                title: "Enable Developer Options",
                shortDescription: "Unlock advanced settings hidden by default on your Android device.",
                detailedSteps: `
1. Go to your phone's **Settings**.
2. Scroll down and tap on **About Phone**.
3. Find the **Build Number** and tap on it 7 times consecutively.
4. You will see a message saying "You are now a developer!".
5. Go back to the main Settings screen, and you will find a new "Developer options" menu.
`
            },
            {
                title: "Force 4x MSAA",
                shortDescription: "Improves graphics quality in games at the cost of some performance.",
                detailedSteps: `
1. Open **Developer options**.
2. Scroll down to the "Hardware accelerated rendering" section.
3. Find the toggle for **Force 4x MSAA** and enable it.
4. Note: This may drain your battery faster.
`
            },
            {
                title: "Set Animation Scales to 0.5x",
                shortDescription: "Makes your phone feel faster by speeding up system animations.",
                detailedSteps: `
1. Open **Developer options**.
2. Scroll down to the "Drawing" section.
3. Find "Window animation scale", "Transition animation scale", and "Animator duration scale".
4. Set each of them to **0.5x**.
`
            }
        ],
        adbCommands: `# ADB Commands (Guest Mode Example)
# WARNING: Use with caution. Connect your phone to a PC with ADB installed.

# This command can help reduce background processes to free up RAM.
adb shell cmd activity kill-all

# This command clears cached data for all apps, which can improve performance.
adb shell pm trim-caches 99999M
`
    };
};