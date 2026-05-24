/**
 * Unified Automated Phone Detection Engine for Android & iOS
 * Dual-layer WebGL signature match and User Agent string mapping
 */

export interface DetectedHardware {
    modelName: string;
    osVersion: string;
    deviceType: "Android" | "iPhone";
    hardwareTier: "Low End" | "Medium End" | "High End";
    gpu: string;
    cores: number;
}

export const detectDeviceHardware = (): DetectedHardware => {
    const ua = navigator.userAgent;
    const canvas = document.createElement('canvas');
    let gpu = 'Unknown GPU';
    
    try {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_ID) || 'Unknown GPU';
            }
        }
    } catch (e) {
        // WebGL block handled
    }

    const cores = navigator.hardwareConcurrency || 8;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    
    // Fallback guesses
    let modelName = isIos ? 'iPhone' : (isAndroid ? 'Android Phone' : 'Mobile Phone');
    let osVersion = isIos ? '17.0' : '13';
    let deviceType: "Android" | "iPhone" = isIos ? "iPhone" : "Android";
    let hardwareTier: "Low End" | "Medium End" | "High End" = 'Medium End';

    // Parse Android version
    if (isAndroid) {
        const match = ua.match(/Android\s+([0-9\.]+)/i);
        if (match) osVersion = match[1];
    } else if (isIos) {
        const match = ua.match(/OS\s+([0-9_]+)/i);
        if (match) osVersion = match[1].replace(/_/g, '.');
    }

    // Modern detection for Brands via User Agent string matching
    if (isAndroid) {
        const matchModel = ua.match(/\(Linux; Android\s+[^;]+;\s+([^;\)]+)/i);
        if (matchModel && matchModel[1]) {
            let parsedModel = matchModel[1].trim();
            if (parsedModel.includes("Build/")) {
                parsedModel = parsedModel.split("Build/")[0].trim();
            }
            modelName = parsedModel;
        }

        // Expanded mapping table for popular device model codes to human-readable terms
        const upperModel = modelName.toUpperCase();
        
        // --- SAMSUNG ---
        if (upperModel.includes("SM-S928")) {
            modelName = "Samsung Galaxy S24 Ultra";
        } else if (upperModel.includes("SM-S926")) {
            modelName = "Samsung Galaxy S24+";
        } else if (upperModel.includes("SM-S921")) {
            modelName = "Samsung Galaxy S24";
        } else if (upperModel.includes("SM-S918")) {
            modelName = "Samsung Galaxy S23 Ultra";
        } else if (upperModel.includes("SM-S916")) {
            modelName = "Samsung Galaxy S23+";
        } else if (upperModel.includes("SM-S911")) {
            modelName = "Samsung Galaxy S23";
        } else if (upperModel.includes("SM-S908")) {
            modelName = "Samsung Galaxy S22 Ultra ";
        } else if (upperModel.includes("SM-S906")) {
            modelName = "Samsung Galaxy S22+";
        } else if (upperModel.includes("SM-S901")) {
            modelName = "Samsung Galaxy S22";
        } else if (upperModel.includes("SM-G998")) {
            modelName = "Samsung Galaxy S21 Ultra";
        } else if (upperModel.includes("SM-G996")) {
            modelName = "Samsung Galaxy S21+";
        } else if (upperModel.includes("SM-G991")) {
            modelName = "Samsung Galaxy S21";
        } else if (upperModel.includes("SM-A546")) {
            modelName = "Samsung Galaxy A54 5G";
        } else if (upperModel.includes("SM-A556")) {
            modelName = "Samsung Galaxy A55 5G";
        } else if (upperModel.includes("SM-A356")) {
            modelName = "Samsung Galaxy A35 5G";
        } else if (upperModel.includes("SM-A346")) {
            modelName = "Samsung Galaxy A34 5G";
        } else if (upperModel.includes("SM-F946")) {
            modelName = "Samsung Galaxy Z Fold 5";
        } else if (upperModel.includes("SM-F731")) {
            modelName = "Samsung Galaxy Z Flip 5";
        } else if (upperModel.startsWith("SM-")) {
            // General formatting forSM devices
            const samsungSeries = upperModel.replace("SM-", "");
            modelName = `Samsung Galaxy (${samsungSeries})`;
        }
        // --- GOOGLE PIXEL ---
        else if (upperModel.includes("PIXEL 8 PRO")) {
            modelName = "Google Pixel 8 Pro";
        } else if (upperModel.includes("PIXEL 8")) {
            modelName = "Google Pixel 8";
        } else if (upperModel.includes("PIXEL 7 PRO")) {
            modelName = "Google Pixel 7 Pro";
        } else if (upperModel.includes("PIXEL 7")) {
            modelName = "Google Pixel 7 ";
        } else if (upperModel.includes("PIXEL 6 PRO")) {
            modelName = "Google Pixel 6 Pro";
        } else if (upperModel.includes("PIXEL 6")) {
            modelName = "Google Pixel 6";
        } else if (upperModel.includes("PIXEL")) {
            modelName = "Google Pixel Phone";
        }
        // --- ONEPLUS ---
        else if (upperModel.includes("CPH2581") || upperModel.includes("CPH2583") || upperModel.includes("ONEPLUS 12")) {
            modelName = "OnePlus 12 5G";
        } else if (upperModel.includes("CPH2447") || upperModel.includes("CPH2449") || upperModel.includes("ONEPLUS 11")) {
            modelName = "OnePlus 11 5G";
        } else if (upperModel.includes("CPH2411") || upperModel.includes("ONEPLUS 10T")) {
            modelName = "OnePlus 10T 5G";
        } else if (upperModel.includes("CPH2411") || upperModel.includes("ONEPLUS 10 PRO") || upperModel.includes("NE2215")) {
            modelName = "OnePlus 10 Pro";
        } else if (upperModel.includes("KB2001") || upperModel.includes("ONEPLUS 8T")) {
            modelName = "OnePlus 8T";
        } else if (upperModel.includes("ONEPLUS")) {
            // General capitalisation
            modelName = modelName.replace(/oneplus/i, "OnePlus");
        }
        // --- POCO & REDMI & XIAOMI ---
        else if (upperModel.includes("23049PCD8I") || upperModel.includes("POCO F5")) {
            modelName = "POCO F5 5G Gaming Phone";
        } else if (upperModel.includes("POCO X6") || upperModel.includes("POCO X6 PRO")) {
            modelName = "POCO X6 Pro 5G";
        } else if (upperModel.includes("POCO F6") || upperModel.includes("POCO F6 PRO")) {
            modelName = "POCO F6 Pro 5G";
        } else if (upperModel.includes("POCO X5")) {
            modelName = "POCO X5 5G";
        } else if (upperModel.includes("POCO M6")) {
            modelName = "POCO M6 Pro";
        } else if (upperModel.includes("POCO")) {
            modelName = `Xiaomi POCO (${modelName})`;
        } else if (upperModel.includes("M2101K7") || upperModel.includes("REDMI NOTE 10")) {
            modelName = "Xiaomi Redmi Note 10 Pro";
        } else if (upperModel.includes("REDMI NOTE 11") || upperModel.includes("2201117TY")) {
            modelName = "Xiaomi Redmi Note 11";
        } else if (upperModel.includes("REDMI NOTE 12") || upperModel.includes("22101316G")) {
            modelName = "Xiaomi Redmi Note 12";
        } else if (upperModel.includes("REDMI NOTE 13") || upperModel.includes("23129RAA4G")) {
            modelName = "Xiaomi Redmi Note 13 Series";
        } else if (upperModel.includes("REDMI")) {
            modelName = `Xiaomi Redmi (${modelName.replace(/redmi/i, "").trim() || "Note"})`;
        } else if (upperModel.includes("XIAOMI 14") || upperModel.includes("23127PN0CG")) {
            modelName = "Xiaomi 14 Flagship";
        } else if (upperModel.includes("XIAOMI 13") || upperModel.includes("2211133G")) {
            modelName = "Xiaomi 13 Pro";
        } else if (upperModel.includes("XIAOMI")) {
            modelName = `Xiaomi Phone (${modelName})`;
        }
        // --- iQOO & VIVO ---
        else if (upperModel.includes("V2303") || upperModel.includes("IQOO NEO 7")) {
            modelName = "iQOO Neo 7";
        } else if (upperModel.includes("IQOO NEO") || upperModel.includes("IQOO")) {
            modelName = `iQOO Gaming Phone (${modelName})`;
        } else if (upperModel.includes("VIVO")) {
            modelName = `Vivo Smart Phone (${modelName.replace(/vivo/i, "").trim()})`;
        }
        // --- REALME ---
        else if (upperModel.includes("RMX")) {
            const realmeModelNum = upperModel.match(/RMX\d+/);
            const numStr = realmeModelNum ? ` (${realmeModelNum[0]})` : "";
            modelName = `Realme High-Performance Phone${numStr}`;
        }
        // --- ASUS ROG ---
        else if (upperModel.includes("ROG PHONE") || upperModel.includes("ASUS_AI2205")) {
            modelName = "ASUS ROG Phone Series";
        }
        // --- MOTOROLA ---
        else if (upperModel.includes("XT2") || upperModel.includes("MOTO")) {
            modelName = `Motorola Moto Phone (${modelName.replace(/moto/i, "").trim() || ""})`;
        }
        // --- Fallback clean-up for other Android devices ---
        else {
            // If the model starts with generic text and has brand patterns
            const brandMatch = ua.match(/(Samsung|Google|OnePlus|Xiaomi|Redmi|Poco|Vivo|OPPO|Realme|Motorola|Asus|ROG|Sony|Huawei|Nokia|Infinix|Tecno|Lenovo|HTC|Lge)/i);
            if (brandMatch) {
                const brand = brandMatch[1];
                const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
                if (!modelName.toLowerCase().includes(brand.toLowerCase())) {
                    modelName = `${capitalizedBrand} ${modelName}`;
                }
            }
        }
    }

    // Precise iOS models mapping by Resolution Height/Width & Pixel Ratio
    const gpuLower = gpu.toLowerCase();
    if (isIos) {
        deviceType = "iPhone";
        const w = window.screen.width * window.devicePixelRatio;
        const h = window.screen.height * window.devicePixelRatio;
        
        if ((w === 1290 && h === 2796) || (w === 2796 && h === 1290)) {
            modelName = 'iPhone 15 Pro Max / 14 Pro Max';
        } else if ((w === 1179 && h === 2556) || (w === 2556 && h === 1179)) {
            modelName = 'iPhone 15 Pro / 14 Pro';
        } else if ((w === 1284 && h === 2778) || (w === 2778 && h === 1284)) {
            modelName = 'iPhone 13 Pro Max / 14 Plus';
        } else if ((w === 1170 && h === 2532) || (w === 2532 && h === 1170)) {
            modelName = 'iPhone 13 Pro / 14 / 12 Pro';
        } else if ((w === 1242 && h === 2688) || (w === 2688 && h === 1242)) {
            modelName = 'iPhone 11 Pro Max / XS Max';
        } else if ((w === 1125 && h === 2436) || (w === 2436 && h === 1125)) {
            modelName = 'iPhone 11 Pro / XS / X';
        } else if ((w === 828 && h === 1792) || (w === 1792 && h === 828)) {
            modelName = 'iPhone 11 / XR';
        } else if ((w === 750 && h === 1334) || (w === 1334 && h === 750)) {
            modelName = 'iPhone SE (3rd Gen) / 8';
        } else {
            modelName = 'Apple iPhone';
        }
        hardwareTier = 'High End';
    } else {
        // Detect Android GPU and assign hardware tier
        if (gpuLower.includes('adreno')) {
            const numMatch = gpuLower.match(/adreno\s*\(ts\)?\s*(\d+)/i) || gpuLower.match(/adreno\s*(\d+)/i);
            if (numMatch && numMatch[1]) {
                const adrenoModel = parseInt(numMatch[1], 10);
                if (adrenoModel >= 730) {
                    hardwareTier = 'High End';
                    if (modelName === 'Android Phone') {
                        modelName = adrenoModel === 750 ? 'Snapdragon 8 Gen 3 Premium Phone' : 'Snapdragon 8 Gen 2 / Gen 1 Premium Phone';
                    }
                } else if (adrenoModel >= 650) {
                    hardwareTier = 'High End';
                    if (modelName === 'Android Phone') modelName = 'Snapdragon 865/888 High-Performance Phone';
                } else if (adrenoModel >= 618) {
                    hardwareTier = 'Medium End';
                    if (modelName === 'Android Phone') modelName = 'Mid-Range Snapdragon Phone';
                } else {
                    hardwareTier = 'Low End';
                    if (modelName === 'Android Phone') modelName = 'Entry-Level Snapdragon Phone';
                }
            }
        } else if (gpuLower.includes('mali')) {
            if (gpuLower.includes('g710') || gpuLower.includes('g715') || gpuLower.includes('g720') || gpuLower.includes('g77') || gpuLower.includes('g78') || gpuLower.includes('immortalis')) {
                hardwareTier = 'High End';
                if (modelName === 'Android Phone') modelName = 'MediaTek Dimensity Flagship Phone';
            } else if (gpuLower.includes('g57') || gpuLower.includes('g68') || gpuLower.includes('g52') || gpuLower.includes('g72') || gpuLower.includes('g76') || gpuLower.includes('g610')) {
                hardwareTier = 'Medium End';
                if (modelName === 'Android Phone') modelName = 'MediaTek Dimensity Mid-Range Phone';
            } else {
                hardwareTier = 'Low End';
                if (modelName === 'Android Phone') modelName = 'Low-End Mali Graphics Phone';
            }
        } else if (cores >= 8) {
            hardwareTier = 'Medium End';
        } else {
            hardwareTier = 'Low End';
        }
    }

    // Ensure the GPU has a readable, highly accurate fallback based on the detected mobile model name!
    let finalGpu = gpu;

    // Clean up ANGLE, SwiftShader or generic WebGL formatting junk
    if (finalGpu) {
        finalGpu = finalGpu
            .replace(/^angle\s*\(([^)]+)\)/i, '$1') // Extract contents of "ANGLE (...)"
            .replace(/direct3d.*/i, '')             // Remove D3D trailing junk
            .replace(/vs_.*_ps_.*/i, '')            // Remove pixel shader version numbers
            .replace(/nvidia\s+corporation/i, 'NVIDIA')
            .replace(/google\s+swiftshader/i, 'Google SwiftShader (Software Renderer)')
            .trim();
    }

    // Heuristics mapping for Mobile GPU fallback and detail-enrichment
    const lowerModel = modelName.toLowerCase();
    
    if (isIos) {
        if (lowerModel.includes("15 pro max") || lowerModel.includes("15 pro")) {
            finalGpu = "Apple A17 Pro GPU (6-core)";
        } else if (lowerModel.includes("14 pro max") || lowerModel.includes("14 pro")) {
            finalGpu = "Apple A16 Bionic GPU (5-core)";
        } else if (lowerModel.includes("13 pro") || lowerModel.includes("13 pro max") || lowerModel.includes("14") || lowerModel.includes("14 plus")) {
            finalGpu = "Apple A15 Bionic GPU (5-core)";
        } else if (lowerModel.includes("iphone 13") || lowerModel.includes("13 mini") || lowerModel.includes("se (3rd gen)")) {
            finalGpu = "Apple A15 Bionic GPU (4-core)";
        } else if (lowerModel.includes("12 pro") || lowerModel.includes("12 pro max") || lowerModel.includes("12")) {
            finalGpu = "Apple A14 Bionic GPU (4-core)";
        } else if (lowerModel.includes("11 pro") || lowerModel.includes("11 pro max") || lowerModel.includes("11")) {
            finalGpu = "Apple A13 Bionic GPU (4-core)";
        } else if (lowerModel.includes("xs") || lowerModel.includes("xs max") || lowerModel.includes("xr")) {
            finalGpu = "Apple A12 Bionic GPU (4-core)";
        } else if (lowerModel.includes("x") || lowerModel.includes("8")) {
            finalGpu = "Apple A11 Bionic GPU (3-core)";
        } else {
            finalGpu = "Apple GPU (Metal-accelerated)";
        }
    } else {
        // Android specific fallbacks
        if (finalGpu === 'Unknown GPU' || finalGpu === '' || finalGpu.length < 3 || finalGpu.toLowerCase().includes('google') || finalGpu.toLowerCase().includes('software') || finalGpu.toLowerCase().includes('vm') || finalGpu.toLowerCase().includes('llvmpipe')) {
            // Deduced GPU from popular high-end names
            if (lowerModel.includes("s24 ultra")) {
                finalGpu = "Adreno 750 (Snapdragon 8 Gen 3)";
            } else if (lowerModel.includes("s24+") || lowerModel.includes("s24")) {
                finalGpu = "Xclipse 940 (Samsung Exynos 2400) / Adreno 750";
            } else if (lowerModel.includes("s23 ultra") || lowerModel.includes("s23+") || lowerModel.includes("s23") || lowerModel.includes("oneplus 12") || lowerModel.includes("oneplus 11") || lowerModel.includes("poco f6 pro")) {
                finalGpu = "Adreno 740 (Snapdragon 8 Gen 2)";
            } else if (lowerModel.includes("s22 ultra") || lowerModel.includes("s22+") || lowerModel.includes("s22") || lowerModel.includes("oneplus 10 pro") || lowerModel.includes("rog phone 6")) {
                finalGpu = "Adreno 730 (Snapdragon 8 Gen 1)";
            } else if (lowerModel.includes("s21 ultra") || lowerModel.includes("s21+") || lowerModel.includes("s21")) {
                finalGpu = "Adreno 660 / Mali-G78 MP14";
            } else if (lowerModel.includes("a55")) {
                finalGpu = "Xclipse 530 (Samsung Exynos 1480)";
            } else if (lowerModel.includes("a54")) {
                finalGpu = "Mali-G68 MP5 (Samsung Exynos 1380)";
            } else if (lowerModel.includes("pixel 8")) {
                finalGpu = "Mali-G715-Immortalis MC10 (Tensor G3)";
            } else if (lowerModel.includes("pixel 7")) {
                finalGpu = "Mali-G710 MC10 (Tensor G2)";
            } else if (lowerModel.includes("pixel 6")) {
                finalGpu = "Mali-G78 MP20 (Tensor G1)";
            } else if (lowerModel.includes("poco f5")) {
                finalGpu = "Adreno 725 (Snapdragon 7+ Gen 2)";
            } else if (lowerModel.includes("poco x6 pro")) {
                finalGpu = "Mali-G615 MC6 (Dimensity 8300-Ultra)";
            } else if (lowerModel.includes("redmi note 10 pro")) {
                finalGpu = "Adreno 618";
            } else if (lowerModel.includes("redmi note 11")) {
                finalGpu = "Adreno 610";
            } else if (lowerModel.includes("redmi note 12")) {
                finalGpu = "Adreno 619";
            } else if (lowerModel.includes("redmi note 13")) {
                finalGpu = "Mali-G57 MC2";
            } else if (lowerModel.includes("xiaomi 14")) {
                finalGpu = "Adreno 750 (Snapdragon 8 Gen 3)";
            } else if (lowerModel.includes("xiaomi 13")) {
                finalGpu = "Adreno 740";
            } else if (lowerModel.includes("iqoo neo 7")) {
                finalGpu = "Mali-G710 MC10 (Dimensity 9000+)";
            } else {
                // If it contains a generic, default back to Mali/Adreno based on hardwareConcurrency
                finalGpu = cores >= 8 ? "Adreno 642L / Mali-G71" : "Mali-G52 MC2 / Adreno 610";
            }
        }
    }

    return {
        modelName,
        osVersion,
        deviceType,
        hardwareTier,
        gpu: finalGpu,
        cores
    };
};
