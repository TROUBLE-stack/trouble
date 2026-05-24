import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'de' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav Tabs
    'tab_pro_tips': '🔥 Pro Tips',
    'tab_config_generator': '🎯 Get Sensi',
    'tab_gfx_tool': '⚡ GFX Tool',
    'tab_system_optimizer': '🚀 Speed Up',
    'tab_profile': '👤 Profile',
    'tab_settings': '🛠️ Settings',
    'tab_history': '⏳ History',

    // Settings Tab
    'settings_title': 'Settings',
    'settings_appearance': 'Appearance',
    'settings_visual_fx': 'Enable Visual Effects:',
    'settings_fx_desc': 'Disabling visual effects like the matrix background may improve performance on low-end devices.',
    'settings_data_mgmt': 'Data Management',
    'settings_clear_history': 'Clear all generation history:',
    'settings_clear_history_btn': 'Clear History',
    'settings_clear_profile': 'Clear saved device profile:',
    'settings_clear_profile_btn': 'Clear Profile',
    'settings_language': 'Application Language',
    'settings_language_desc': 'Choose your preferred language for interfaces, guides, and tools.',
    'settings_about': 'About',
    'settings_about_desc': 'An AI-powered assistant for FF gamers. Get pro tips and generate custom headshot configuration files to improve your gameplay.',
    'settings_version': 'Version 1.2.5 (Stable)',
    'clear_history_confirm_title': 'Confirm Clear History',
    'clear_history_confirm_desc': 'Are you sure you want to permanently delete all your generated history? This action cannot be undone.',
    'clear_profile_confirm_title': 'Confirm Clear Profile',
    'clear_profile_confirm_desc': 'Are you sure you want to delete your saved device profile? You will need to enter your details again.',
    'feedback_history_cleared': 'Generation history has been cleared.',
    'feedback_profile_cleared': 'Saved device profile has been cleared.',
    'feedback_lang_changed': 'Language changed successfully!',

    // Header & Footer
    'header_subtitle': 'AI Esports Calibration Engine',
    'active_profile_prefix': 'Active System Profile: ',
    'fx_label': 'FX:',

    // Pro Tips Tab
    'protips_title': 'Tactical AI Esports Assistant',
    'protips_desc': 'Generate precise drag-shot instructions, crosshair techniques, and weapon recoil patterns customized for your preferred weapons.',
    'protips_select_range_lbl': 'Assault Range / Gun Category:',
    'protips_select_range_placeholder': 'Select Gun Range Category Examples',
    'protips_btn_generate': 'GENERATE ADAPTIVE TACTICS',
    'protips_blueprint': 'DYNAMIC STRATEGIC BLUEPRINT',
    'protips_recoil': 'RECOIL CONTROL VECTOR',
    'protips_drag': 'DRAG SPEED METRIC',
    'protips_notes': 'TACTICAL NOTES',
    'protips_generating_toast': 'Generating tactical esports instructions...',
    'protips_success_toast': 'Tactical Esports Advice Generated!',

    // Config Generator Tab
    'config_title': 'Esports Calibration Panel',
    'config_desc': 'Analyze and align Free Fire sensitivity configurations matched directly to your touchscreen sampling limitations and hardware specs.',
    'config_quick_select': '⚡ Quick Select Phone:',
    'config_quick_select_desc': '* If your phone is not in the list, simply type its name in the box below.',
    'config_model_lbl': 'Device Model Name:',
    'config_android_ver_lbl': 'Android Version:',
    'config_ios_ver_lbl': 'iOS Version:',
    'config_dev_type': 'Device Type:',
    'config_hardware_tier': 'Hardware Spec Tier:',
    'config_play_style': '🎯 Choose your Playing Style:',
    'config_verified_lookup': 'REAL-TIME ONLINE ESPORTS LOOKUP & VERIFICATION ACTIVE',
    'config_verified_desc': 'Unlike simple random number generators, our system scans real Free Fire online databases, pro-player spreadsheets (White444, Ruok FF, Raistar settings), and matches standard sensitivity with your precise phone touch screen sample feedback limit.',
    'config_btn_generate': 'COMPUTE OPTIMAL SENSITIVITY',
    'config_output_title': 'COMPUTED ULTRA HIGH-PRECISION SECTOR CONFIG',
    'config_dpi_desc': 'This is your perfect screen resolution multiplier. It configures the timing of your touch vectors to ensure maximum drag speed.',
    'config_dpi': 'DPI ACCELERATOR',
    'config_pointer': 'POINTER CALIBRATION',
    'config_pointer_desc': 'Improves tracking accuracy and stabilizes recoil when sliding crosshair up.',
    'config_button_size': 'OPTIMAL FIRE BUTTON SIZE',
    'config_button_size_desc': 'Best button width to easily execute one-tap headshots without misfires.',
    'config_rules_title': 'CRITICAL SENSITIVITY CALIBRATOR INSTRUCTIONS',
    'config_toast_generating': 'Compiling custom sensitivity from pro database...',
    'config_toast_success': 'Sensitivity config computed successfully!',

    // Hardware Styles Config Generator Description
    'style_balanced_desc': 'Perfect drag-locking across all distances.',
    'style_balanced_title': 'Balanced',
    'style_rusher_desc': 'High-speed rotation drag for close SMG/Shotgun.',
    'style_rusher_title': 'Rusher',
    'style_sniper_desc': 'Stable AWM/M82B micro zoom dragging.',
    'style_sniper_title': 'Sniper',
    'style_supporter_desc': 'AR scope spray recoil compensation settings.',
    'style_supporter_title': 'Supporter',

    // GFX Tool Tab
    'gfx_title': 'Esports GFX Optimizer',
    'gfx_desc': 'Recalibrate graphics settings, frame-pacing, and resolution presets to align with competitive game standards and heat management thresholds.',
    'gfx_res': 'Resolution Preset',
    'gfx_fps': 'Frame Rate Ceiling',
    'gfx_shadows': 'Dynamic Shadows',
    'gfx_shadows_enabled': 'Enabled',
    'gfx_shadows_disabled': 'Disabled',
    'gfx_api': 'Hardware Render Backend',
    'gfx_btn': 'APPLY GRAPHICS PRESETS',
    'gfx_toast_generating': 'Applying graphics tweaks...',
    'gfx_toast_success': 'Graphics parameters deployed!',

    // Device Profile Tab
    'profile_title': 'Hardware Diagnostics Hub',
    'profile_desc': 'Continuous active diagnostics of your hardware parameters, graphics thread capabilities, and kernel touch response.',
    'profile_saving': 'Saving live profile...',
    'profile_saved': 'Device profile synced & saved.',

    // History Tab
    'history_title': 'Telemetry Retrieval Cache',
    'history_desc': 'Review and retrieve previously generated sensitivity models, custom tactical plans, and graphics configs stored in sandboxed local history.',
    'history_empty': 'History database cache is currently empty. Generated configs will be logged here.',
    'history_clear_all': 'CLEAR Telemetry Log',

    // System Optimizer Tab
    'sys_title': 'Ultimate Device Optimizer',
    'sys_desc': 'A 100% genuine optimization cockpit built to tune device performance. 0% generic animation, 100% transparent and actionable.',
    'sys_tab_copilot': 'Android Co-Pilot',
    'sys_tab_calibration': 'Active Hardware Calibration',
    'sys_tab_details': 'FF Smooth Mode Details',
    'sys_btn_recalibrate': 'RE-CALIBRATE EXPERT CO-PILOT',
    'sys_btn_generate': 'GENERATE AI TUNING MANUAL',
    'sys_toast_manual_success': 'Optimization Plan Generated Successfully!',
    'sys_flusher_title': 'RAM & CPU HEAP FLUSHER',
    'sys_flusher_desc': 'This forces dynamic VRAM framebuffers and layout render buffers to purge from your browser\'s workspace. It releases unreferenced memory to lighten browser tasks, leaving more resources open for games.',
    'sys_heap_reclaimed': 'TOTAL PHYSICAL HEAP MEMORY RECLAIMED: ',
    'sys_btn_flush': 'RUN PHYSICAL MEMORY FLUSHER',
    'sys_btn_flushing': 'FLUSHING MEMORY HEAP...',
    'sys_aligner_title': 'TACTILE INPUT RE-ALIGNER',
    'sys_aligner_desc': 'Measures touch digitizer frequency and timing jitter. We use native high-precision timers to align frame layout callbacks, recalibrating the tactile drag input.',
    'sys_touch_hz': 'TOUCH REFRESH',
    'sys_touch_jitter': 'TIMING JITTER',
    'sys_touch_optimization': 'DRAG THREAD RESPONSE SPEEDUP',
    'sys_optimized': 'Optimized',
    'sys_touch_placeholder': 'Tactile alignment statistics will display here once calibrated.',
    'sys_btn_start_calib': 'START IN-APP TOUCH CALIBRATION',
    'sys_calib_vector': 'CALIBRATING TOUCH VECTORS: ',
    'sys_drag_instructions': 'DRAG THUMB HERE REPEATEDLY WITHOUT RELEASING',

    // Smooth Mode details
    'smooth_heading': 'FREE FIRE LAG ELIMINATION BLUEPRINT',
    'smooth_sub': 'These are actual device settings to modify on your phone. 0% advertisements, 100% working rules. Implementing these parameters makes your Free Fire gameplay incredibly smooth.',
    'smooth_step1_title': 'DISABLE RAM PLUS / VIRTUAL RAM (STUTTER ELIMINATION)',
    'smooth_step1_why': 'Why do this: Most modern phones turn on "RAM Plus" or "Virtual RAM" by default. This uses internal storage flash which is up to 20x slower than real RAM. When Free Fire is running, this causes heavy frame drops, stuttering and micro-freezes.',
    'smooth_step1_how': 'How to change: Go to Settings > Battery and Device Care > Memory > RAM Plus and turn it OFF. Restart your phone, and the Free Fire micro-stutter will disappear.',
    'smooth_step2_title': 'ENABLE SYSTEM GRAPHICS DRIVER IN DEVELOPER OPTIONS',
    'smooth_step2_why': 'Why do this: Default Android graphics render paths can sometimes be outdated. Foricing standard system driver enables Free Fire to interact directly with your device GPU pipeline.',
    'smooth_step2_how': 'How to change: Go to Settings > Developer Options. Seek "Graphics Driver Preferences". Find "Free Fire", tap on it, change from "Default" to "System Graphics Driver".',
    'smooth_step3_title': 'FORCE DISABLE HW OVERLAYS (UNMATCHED STABILITY)',
    'smooth_step3_why': 'Why do this: This setting bypasses CPU compositing and hands display layouts directly to the GPU. This improves touch tracking, drag accuracy, and screen panning response.',
    'smooth_step3_how': 'How to change: Scroll to the bottom of Developer Options, search for "Disable HW overlays", and switch it ON.',
    'smooth_step4_title': 'UNRESTRICTED BATTERY LIMIT FOR FREE FIRE',
    'smooth_step4_why': 'Why do this: Android throttle CPU performance of games after a while to preserve battery. This leads to sudden frame rate drops during team fights.',
    'smooth_step4_how': 'How to change: Go to Settings > Apps > Free Fire > Battery, and switch from "Optimized" to "Unrestricted".',
    'smooth_step5_title': 'IN-GAME ENGINE SETTINGS (PRO META SETUP)',
    'smooth_step5_why': 'Why do this: Free Fire standard screen scales and shadow render shadows consume rendering performance unnecessarily.',
    'smooth_step5_how': 'How to change: Open Free Fire > Settings > Display > Graphics. Select Standard / Smooth and set High FPS to HIGH. Switch Auto-Scale to OFF.'
  },
  hi: {
    // Nav Tabs
    'tab_pro_tips': '🔥 प्रो टिप्स',
    'tab_config_generator': '🎯 सेंसेटिविटी सेटिंग्स',
    'tab_gfx_tool': '⚡ जीएफएक्स टूल',
    'tab_system_optimizer': '🚀 स्पीड बढ़ाएं',
    'tab_profile': '👤 प्रोफ़ाइल',
    'tab_settings': '🛠️ सेटिंग्स',
    'tab_history': '⏳ इतिहास',

    // Settings Tab
    'settings_title': 'सेटिंग्स',
    'settings_appearance': 'कस्टमाइजेशन / रूप-रंग',
    'settings_visual_fx': 'विजुअल इफेक्ट्स चालू करें:',
    'settings_fx_desc': 'मैट्रिक्स बैकग्राउंड जैसे भारी इफेक्ट्स को बंद करने से कम रैम या पुराने फ़ोन की गतिशीलता बेहतर हो जाती है।',
    'settings_data_mgmt': 'डेटा नियंत्रण',
    'settings_clear_history': 'जनरेट किया गया पुराना इतिहास साफ़ करें:',
    'settings_clear_history_btn': 'इतिहास साफ़ करें',
    'settings_clear_profile': 'सेव की गई फ़ोन प्रोफ़ाइल हटाएं:',
    'settings_clear_profile_btn': 'प्रोफ़ाइल साफ़ करें',
    'settings_language': 'एप्लिकेशन की भाषा',
    'settings_language_desc': 'इंटरफेस, मार्गदर्शिका और टूल के लिए अपनी पसंदीदा भाषा चुनें।',
    'settings_about': 'ऐप के बारे में',
    'settings_about_desc': 'फ्री फायर प्लेयर्स के लिए एक एआई-संचालित प्रो टूल। हेडशॉट सेंसिटिविटी और फ़ोन ऑप्टिमाइज़ेशन के लिए सही जानकारी देता है।',
    'settings_version': 'संस्करण 1.2.5 (स्थिर)',
    'clear_history_confirm_title': 'इतिहास हटाने की पुष्टि',
    'clear_history_confirm_desc': 'क्या आप वाकई अपने जनरेट किए गए इतिहास को डिलीट करना चाहते हैं? इसे वापस नहीं लाया जा सकेगा।',
    'clear_profile_confirm_title': 'प्रोफ़ाइल हटाने की पुष्टि',
    'clear_profile_confirm_desc': 'क्या आप अपनी प्रोफ़ाइल डिलीट करना चाहते हैं? आपको विवरण फिर से भरना होगा।',
    'feedback_history_cleared': 'जनरेशन इतिहास सफलतापूर्वक साफ़ कर दिया गया है।',
    'feedback_profile_cleared': 'फ़ोन प्रोफ़ाइल सफलतापूर्वक हटा दी गई है।',
    'feedback_lang_changed': 'भाषा सफलतापूर्वक बदल दी गई है!',

    // Header & Footer
    'header_subtitle': 'एआई ई-स्पोर्ट्स कैलिब्रेशन इंजन',
    'active_profile_prefix': 'सक्रिय सिस्टम प्रोफ़ाइल: ',
    'fx_label': 'विजुअल FX:',

    // Pro Tips Tab
    'protips_title': 'एआई ई-स्पोर्ट्स सहायक',
    'protips_desc': 'अपने हथियारों के अनुसार सटीक ड्रैग-शॉट तकनीक, क्रॉसहेयर नियंत्रण और रिकोइल नियंत्रण दिशा-निर्देश प्राप्त करें।',
    'protips_select_range_lbl': 'हथियार की श्रेणी चुनें:',
    'protips_select_range_placeholder': 'हथियार वर्ग का चयन करें',
    'protips_btn_generate': 'रणनीतिक टिप्स जनरेट करें',
    'protips_blueprint': 'रणनीतिक रूपरेखा',
    'protips_recoil': 'रिकोइल नियंत्रण वेक्टर',
    'protips_drag': 'ड्रैग स्पीड पैमाना',
    'protips_notes': 'विशेष रणनीतिक नोट्स',
    'protips_generating_toast': 'रणनीतिक टिप्स जनरेट हो रहे हैं...',
    'protips_success_toast': 'टिप्स जनरेट हो गए!',

    // Config Generator Tab
    'config_title': 'सेंसेटिविटी कैलिब्रेशन पैनल',
    'config_desc': 'अपने फोन के टच स्क्रीन रिफ्रेश रेट और हार्डवेयर क्षमता के अनुसार बिल्कुल सटीक संवेदनशीलता कॉन्फ़िगरेशन प्राप्त करें।',
    'config_quick_select': '⚡ अपना फ़ोन तुरंत चुनें:',
    'config_quick_select_desc': '* यदि आपका फ़ोन सूची में नहीं है, तो नीचे नाम लिखकर खोजें।',
    'config_model_lbl': 'फ़ोन मॉडल का नाम:',
    'config_android_ver_lbl': 'एंड्रॉयड वर्जन:',
    'config_ios_ver_lbl': 'iOS वर्जन:',
    'config_dev_type': 'डिवाइस प्रकार:',
    'config_hardware_tier': 'हार्डवेयर क्षमता स्तर:',
    'config_play_style': '🎯 खेलने का तरीका (स्टाइल):',
    'config_verified_lookup': 'रीयल-टाइम ऑनलाइन ई-स्पोर्ट्स डेटाबेस सक्रिय',
    'config_verified_desc': 'हमारा सिस्टम असली प्रो-खिलाडियों के सेटिंग्स डेटाबेस और आपके डिवाइस की टच स्क्रीन लिमिट दोनों का विश्लेषण करके असली सेंसिटिविटी प्रदान करता है।',
    'config_btn_generate': 'सर्वश्रेष्ठ सेंसिटिविटी की गणना करें',
    'config_output_title': 'उच्च सटीकता कॉन्फ़िगरेशन परिणाम',
    'config_dpi_desc': 'यह आपके स्क्रीन रेजोल्यूशन का परफेक्ट मल्टीप्लाईर है, जो ड्रैग की गति बढ़ाता है।',
    'config_dpi': 'डीपीआई एक्सीलेटर',
    'config_pointer': 'पॉइंटर कैलिब्रेशन',
    'config_pointer_desc': 'पॉइंटर की स्थिरता बढ़ाकर रिकोइल कम करता है।',
    'config_button_size': 'सर्वश्रेष्ठ फायर बटन साइज',
    'config_button_size_desc': 'कम जगह में हेडशॉट मारने के लिए परफेक्ट बटन चौड़ाई।',
    'config_rules_title': 'सेंसिटिविटी के जरूरी नियम व सावधानियां',
    'config_toast_generating': 'प्रो खिलाड़ी डेटाबेस से सेटिंग्स लोड हो रही हैं...',
    'config_toast_success': 'सेंसिटिविटी सेटिंग्स तैयार हैं!',

    // Hardware Styles Config
    'style_balanced_desc': 'सभी दूरी पर श्रेष्ठ ड्रैग-लॉक प्रदर्शन।',
    'style_balanced_title': 'संतुलित',
    'style_rusher_desc': 'शॉर्ट-रेंज एसएमजी/शॉटगन के लिए तेज रोटेशन ड्रैग।',
    'style_rusher_title': 'शॉर्ट-रेंज',
    'style_sniper_desc': 'स्थिर एीडब्ल्यूएम / स्नाइपर माइक्रो जूम ड्रैग।',
    'style_sniper_title': 'स्नाइपर',
    'style_supporter_desc': 'लॉन्ग-रेंज स्प्रे रिकोइल नियंत्रण सेटिंग।',
    'style_supporter_title': 'सपोर्टर',

    // GFX Tool Tab
    'gfx_title': 'जीएफएक्स ग्राफ़िक्स बूस्टर',
    'gfx_desc': 'गेम के तापमान और लैग को नियंत्रित करने के लिए गेम की अधिकतम फ्रेम्स, छाया और रेजोल्यूशन को सेट करें।',
    'gfx_res': 'रेजोल्यूशन प्रीसेट',
    'gfx_fps': 'फ्रेम प्रति सेकंड सीमा (FPS)',
    'gfx_shadows': 'डायनामिक शैडो',
    'gfx_shadows_enabled': 'सक्रिय',
    'gfx_shadows_disabled': 'निष्क्रिय',
    'gfx_api': 'ग्राफ़िक्स रेंडरर बैकएंड',
    'gfx_btn': 'ग्राफ़िक्स प्रीसेट सेट करें',
    'gfx_toast_generating': 'ट्वीक्स लागू हो रहे हैं...',
    'gfx_toast_success': 'ग्राफ़िक्स सेटिंग्स लागू कर दी गयी हैं!',

    // Device Profile Tab
    'profile_title': 'डिवाइस क्षमता जाँच केंद्र',
    'profile_desc': 'आपके हार्डवेयर फीचर्स, टच और ग्राफ़िक्स प्रोसेसर थ्रेड्स की कार्यक्षमता का लाइव विवरण देता है।',
    'profile_saving': 'प्रोफ़ाइल सुरक्षित हो रही है...',
    'profile_saved': 'फ़ोन प्रोफ़ाइल सफलतापूर्वक सिंक हो गई।',

    // History Tab
    'history_title': 'सुरक्षित इतिहास रिकॉर्ड',
    'history_desc': 'पहले उपयोग किए गए जीएफएक्स ट्वीक्स, ड्रैग मैनुअल और हेडशॉट सेटिंग्स तक पहुंचें जो लोकल डेटाबेस में सेव हैं।',
    'history_empty': 'इतिहास रिकॉर्ड खाली है। जनरेट किए गए ट्वीक्स यहाँ दिखाई देंगे।',
    'history_clear_all': 'टेलीमेट्री डेटा हटाएं',

    // System Optimizer Tab
    'sys_title': 'डिवाइस बूस्टर और स्पीड कंट्रोलर',
    'sys_desc': 'आपके डिवाइस को रिस्पॉन्सिव और तेज बनाने के लिए पूर्ण रूप से कार्य करने वाला सुसज्जित डैशबोर्ड।',
    'sys_tab_copilot': 'एंड्रॉइड सहायक',
    'sys_tab_calibration': 'हार्डवेयर टच कैलिब्रेशन',
    'sys_tab_details': 'सुपर स्मूथ मोड विवरण',
    'sys_btn_recalibrate': 'को-पायलट पुनः सक्रिय करें',
    'sys_btn_generate': 'एआई ट्यूनिंग मैनुअल प्राप्त करें',
    'sys_toast_manual_success': 'ऑप्टिमाइज़ेशन योजना तैयार कर ली गई है!',
    'sys_flusher_title': 'रैम और सीपीयू हीप फ्लशर',
    'sys_flusher_desc': 'यह ब्राउज़र की बेकार टेम्पररी फाइलों और ग्राफ़िक्स बफ़र्स को डिलीट करता है ताकि गेम खेलते समय फ़ोन में ज्यादा रैम खाली रहे।',
    'sys_heap_reclaimed': 'फ्लश की गई कुल रैम क्षमता: ',
    'sys_btn_flush': 'रैम फ्लशर चलाएं',
    'sys_btn_flushing': 'रैम साफ़ की जा रही है...',
    'sys_aligner_title': 'टच स्क्रीन रिस्पॉन्स सुदृढ़ीकरण',
    'sys_aligner_desc': 'यह आपके टच स्क्रीन के रिफ्रेश रेट और इनपुट अंतराल को सुधारकर उंगलियों के ड्रैग एक्शन को गेम में तुरंत रेंडर करता है।',
    'sys_touch_hz': 'टच रिफ्रेश रेट',
    'sys_touch_jitter': 'इनपुट देरी (Jitter)',
    'sys_touch_optimization': 'ड्रैग स्पीड सुदृढ़ीकरण',
    'sys_optimized': 'ऑप्टिमाइज़्ड',
    'sys_touch_placeholder': 'टच रिकॉर्ड आँकड़े कैलिब्रेशन के बाद यहाँ दिखेंगे।',
    'sys_btn_start_calib': 'स्क्रीन टच कैलिब्रेशन चालू करें',
    'sys_calib_vector': 'टच रिस्पॉन्स कैलिब्रेट हो रहा है: ',
    'sys_drag_instructions': 'अपनी अंगुली को बार-बार बिना उठाए इस बॉक्स पर ड्रैग करें।',

    // Smooth mode details
    'smooth_heading': 'फ्री फायर लैग समाप्त करने का ब्लूप्रिंट',
    'smooth_sub': 'ये असली सेटिंग्स हैं जो आपको अपने फोन में लगानी चाहिए, इनमें कोई दिखावा नहीं है। इन्हें बदलने के बाद गेम बिलकुल रुक कर नहीं चलेगा:',
    'smooth_step1_title': 'रैम प्लस / वर्चुअल रैम बंद करें (Stutter दूर करें)',
    'smooth_step1_why': 'क्यों करें: आज के फोनों में रैम बढ़ाने के नाम पर यह सेटिंग स्टोरेज का उपयोग करती है जो वास्तविक रैम से 20 गुना मंद है। इसके चालू रहने से गेम में भयंकर लैग होता है।',
    'smooth_step1_how': 'सेटिंग कैसे बदलें: Settings > बैटरी और डिवाइस केयर > मेमोरी > RAM Plus में जाएँ और तुरंत बंद (OFF) कर दें। फ़ोन रीस्टार्ट होने के बाद लैग मिट जाएगा।',
    'smooth_step2_title': 'डेवलपर ऑप्शन में सिस्टम ग्राफ़िक्स ड्राइवर ऑन करें',
    'smooth_step2_why': 'क्यों करें: यह गेम की फाइलों को सीधे आपके सबसे तेज़ ग्राफिक्स प्रोसेसर से जोड़ता है।',
    'smooth_step2_how': 'सेटिंग कैसे बदलें: डेवलपर ऑप्शंस में "Graphics Driver Preferences" ढूंढें। वहाँ Free Fire पर टैप करके डिफ़ॉल्ट से हटाकर "System Graphics Driver" चुन लें।',
    'smooth_step3_title': 'Disable HW overlays चालू करें',
    'smooth_step3_why': 'क्यों करें: यह स्क्रीन लेआउट रेंडर करने का कार्य सीपीयू से हटाकर सीधे जीपीयू को देता है। इससे ड्रैग करना मक्खन जैसा हो जाता है।',
    'smooth_step3_how': 'सेटिंग कैसे बदलें: डेवलपर ऑप्शंस के बिल्कुल नीचे स्क्रॉल करके "Disable HW overlays" को चालू (ON) करें।',
    'smooth_step4_title': 'फ्री फायर के लिए बैटरी सीमा को Unrestricted करें',
    'smooth_step4_why': 'क्यों करें: फ़ोन गेमिंग के वक्त प्रोसेसर को धीमा कर देता है ताकि बैटरी बचे। इसे हटाने से प्रोसेसर पूरी ताकत से गेम को चलाता है।',
    'smooth_step4_how': 'सेटिंग कैसे बदलें: Settings > Apps > Free Fire > Battery में जाएँ और "Unrestricted" का चयन करें।',
    'smooth_step5_title': 'गेम के भीतर सेटिंग्स को सुदृढ़ करें',
    'smooth_step5_why': 'क्यों करें: बाहरी परफॉरमेंस तभी काम करेगी जब गेम के अंदर फ़ालतू शैडोज बंद होंगे।',
    'smooth_step5_how': 'सेटिंग कैसे बदलें: गेम ओपन करें > सेटिंग्स > डिस्प्ले में ग्राफ़िक्स को "Smooth" या "Standard" रखें और FPS को "High" पर रखें। "Auto-Scale" बंद करें।'
  },
  de: {
    // Nav Tabs
    'tab_pro_tips': '🔥 Profi-Tipps',
    'tab_config_generator': '🎯 Sensi Holen',
    'tab_gfx_tool': '⚡ GFX-Tool',
    'tab_system_optimizer': '🚀 Beschleunigen',
    'tab_profile': '👤 Profil',
    'tab_settings': '🛠️ Einstellungen',
    'tab_history': '⏳ Verlauf',

    // Settings Tab
    'settings_title': 'Einstellungen',
    'settings_appearance': 'Aussehen',
    'settings_visual_fx': 'Visuelle Effekte:',
    'settings_fx_desc': 'Das Deaktivieren visueller Effekte wie des Matrix-Hintergrunds kann die Leistung auf älteren Geräten verbessern.',
    'settings_data_mgmt': 'Datenverwaltung',
    'settings_clear_history': 'Gesamten Verlauf löschen:',
    'settings_clear_history_btn': 'Verlauf löschen',
    'settings_clear_profile': 'Gespeichertes Geräteprofil löschen:',
    'settings_clear_profile_btn': 'Profil löschen',
    'settings_language': 'Sprache der Anwendung',
    'settings_language_desc': 'Wählen Sie Ihre bevorzugte Sprache für Oberflächen, Anleitungen und Tools.',
    'settings_about': 'Über uns',
    'settings_about_desc': 'Ein KI-gestützter Assistent für FF-Gamer. Holen Sie sich Profi-Tipps und erstellen Sie benutzerdefinierte Headshot-Konfigurationsdateien, um Ihr Gameplay zu verbessern.',
    'settings_version': 'Version 1.2.5 (Stabil)',
    'clear_history_confirm_title': 'Verlauf wirklich löschen',
    'clear_history_confirm_desc': 'Sind Sie sicher, dass Sie den gesamten Verlauf dauerhaft löschen möchten? Dies kann nicht rückgängig gemacht werden.',
    'clear_profile_confirm_title': 'Profil wirklich löschen',
    'clear_profile_confirm_desc': 'Sind Sie sicher, dass Sie Ihr gespeichertes Geräteprofil löschen möchten? Sie müssen Ihre Daten erneut eingeben.',
    'feedback_history_cleared': 'Der Generierungsverlauf wurde gelöscht.',
    'feedback_profile_cleared': 'Das gespeicherte Geräteprofil wurde gelöscht.',
    'feedback_lang_changed': 'Sprache erfolgreich geändert!',

    // Header & Footer
    'header_subtitle': 'KI Esports Kalibrierungs-Engine',
    'active_profile_prefix': 'Aktives Systemprofil: ',
    'fx_label': 'Effekte:',

    // Pro Tips Tab
    'protips_title': 'Taktischer KI-Esports-Assistent',
    'protips_desc': 'Erstellen Sie präzise Anweisungen für Drag-Shots, Fadenkreuztechniken und Waffen-Rückstoßmuster, die perfekt auf Ihre Lieblingswaffen abgestimmt sind.',
    'protips_select_range_lbl': 'Angriffsreichweite / Waffenkategorie:',
    'protips_select_range_placeholder': 'Wählen Sie eine Waffenkategorie',
    'protips_btn_generate': 'GENERIEREN SIE EFFEKTIVE TAKTIKEN',
    'protips_blueprint': 'DYNAMISCHER STRATEGISCHER ENTWURF',
    'protips_recoil': 'RÜCKSTOSSKONTROLLVEKTOR',
    'protips_drag': 'DRAG-GESCHWINDIGKEITSMETRIK',
    'protips_notes': 'TAKTISCHE HINWEISE',
    'protips_generating_toast': 'Generierung taktischer Esports-Anweisungen läuft...',
    'protips_success_toast': 'Taktische Esports-Tipps erfolgreich generiert!',

    // Config Generator Tab
    'config_title': 'Kalibrierungs-Panel',
    'config_desc': 'Analysieren und kalibrieren Sie Sensibilitätseinstellungen basierend auf Ihren Touchscreen-Abfrageraten und Hardware-Spezifikationen.',
    'config_quick_select': '⚡ Handy Schnell-Selektion:',
    'config_quick_select_desc': '* Wenn Ihr Modell fehlt, geben Sie den Namen unten manuell ein.',
    'config_model_lbl': 'Geräte-Modell:',
    'config_android_ver_lbl': 'Android Version:',
    'config_ios_ver_lbl': 'iOS Version:',
    'config_dev_type': 'Gerätetyp:',
    'config_hardware_tier': 'Spezifikationsstufe:',
    'config_play_style': '🎯 Wählen Sie Ihren Spielstil:',
    'config_verified_lookup': 'ECHTZEIT ESPORTS DATENABGLEICH AKTIV',
    'config_verified_desc': 'Im Gegensatz zu reinen Zufallsgeneratoren sucht unser System in echten FF-Online-Datenbanken und Profispieler-Setups, um die optimalen Werte für Ihren Touchscreen zu berechnen.',
    'config_btn_generate': 'OPTIMALE SENSIBILITÄT BERECHNEN',
    'config_output_title': 'BERECHNETE HOCHPRÄZISE KONFIGURATION',
    'config_dpi_desc': 'Ihr perfekter Bildschirmauflösungsmultiplikator zur Beschleunigung der Wischgesten.',
    'config_dpi': 'DPI ACCELERATOR',
    'config_pointer': 'ZEIGERKALIBRIERUNG',
    'config_pointer_desc': 'Erhöht die Verfolgungsgenauigkeit und stabilisiert den Rückstoß beim Ziehen des Fadenkreuzes.',
    'config_button_size': 'OPTIMALE FEUERKNOPF-GRÖSSE',
    'config_button_size_desc': 'Beste Breite des Feuerknopfes für schnelle Headshots.',
    'config_rules_title': 'WICHTIGE SENSIBILITÄTS-INSTRUKTIONEN',
    'config_toast_generating': 'Sensibilitätswerte werden aus der Profi-Datenbank abgerufen...',
    'config_toast_success': 'Empfindlichkeitswerte erfolgreich berechnet!',

    // Styles
    'style_balanced_desc': 'Perfekt ausgeglichene Dragshots über alle Distanzen.',
    'style_balanced_title': 'Ausgeglichen',
    'style_rusher_desc': 'Schnelles Wischen für den Nahkampf mit SMG/Shotgun.',
    'style_rusher_title': 'Rusher',
    'style_sniper_desc': 'Beständiges AWM/M82B Mikro-Mausziehen im Zoom.',
    'style_sniper_title': 'Scharfschütze',
    'style_supporter_desc': 'Rückstoßstabilisierung für langanhaltendes AR-Feuer.',
    'style_supporter_title': 'Unterstützer',

    // GFX Tool
    'gfx_title': 'Esports GFX Optimizer',
    'gfx_desc': 'Optimieren Sie Grafikeinstellungen, Bildpacing und Auflösungen für ein flüssigeres Spielerlebnis und besseres Wärmemanagement.',
    'gfx_res': 'Auflösungsverzeichnis',
    'gfx_fps': 'Bildfrequenzlimit' ,
    'gfx_shadows': 'Dynamische Schatten',
    'gfx_shadows_enabled': 'Aktiviert',
    'gfx_shadows_disabled': 'Deaktiviert',
    'gfx_api': 'Hardware-Rendering-Backend',
    'gfx_btn': 'GRAFIKTWEAKS SPEICHERN',
    'gfx_toast_generating': 'Grafikoptimierungen werden berechnet...',
    'gfx_toast_success': 'Grafikparameter erfolgreich angewendet!',

    // Diagnostics
    'profile_title': 'Hardware-Diagnosezentrum',
    'profile_desc': 'Laufende Überprüfung Ihrer Hardware-Ressourcen, Multi-Threading-Kapazitäten und Touchscreen-Leistung.',
    'profile_saving': 'Profil wird synchronisiert...',
    'profile_saved': 'Geräteprofil gespeichert.',

    // History
    'history_title': 'Generierungsarchiv',
    'history_desc': 'Verwalten und laden Sie bereits erstellte Empfindlichkeiten, Grafikeinstellungen und Taktikdateien aus Ihrem lokalen Cache.',
    'history_empty': 'Das Generierungsarchiv ist derzeit leer. Ihre Entwürfe erscheinen hier.',
    'history_clear_all': 'Verlauf Archiv leeren',

    // System Optimizer Tab
    'sys_title': 'Ultimativer System-Tuner',
    'sys_desc': 'Eine voll funktionsfähige Diagnoseumgebung zur Steigerung der Android-Effizienz. 100% genuine Optimierungen.',
    'sys_tab_copilot': 'Android Co-Pilot',
    'sys_tab_calibration': 'Hardware-Kalibrierung',
    'sys_tab_details': 'FF Smooth Mode Anleitung',
    'sys_btn_recalibrate': 'CO-PILOT AKTUALISIEREN',
    'sys_btn_generate': 'KI-LEISTUNGSBESCHREIBUNG GENERIEREN',
    'sys_toast_manual_success': 'Optimierungsplan erfolgreich erstellt!',
    'sys_flusher_title': 'RAM- & CPU-HEAP-LEERUNG',
    'sys_flusher_desc': 'Erzwingt das Löschen blockierter Grafikpuffer und temporärer Cache-Daten aus dem Arbeitsspeicher Ihres Browsers.',
    'sys_heap_reclaimed': 'FREIGEMACHTER ARBEITSSPEICHER: ',
    'sys_btn_flush': 'RAM FLUSHER AUSFÜHREN',
    'sys_btn_flushing': 'SPEICHER WIRD GELEERT...',
    'sys_aligner_title': 'BERÜHRUNGS-REAKTIONSTEST',
    'sys_aligner_desc': 'Misst die Frequenz des Berührungs-Digitizers und minimiert Abweichungen.',
    'sys_touch_hz': 'TOUCH ABFRAGERATE',
    'sys_touch_jitter': 'ZEIT-JITTER',
    'sys_touch_optimization': 'REAKTIONSZEIT-BENEFIT',
    'sys_optimized': 'Optimiert',
    'sys_touch_placeholder': 'Statistiken werden nach der Berührungskalibrierung angezeigt.',
    'sys_btn_start_calib': 'BERÜHRUNGSKALIBRIERUNG STARTEN',
    'sys_calib_vector': 'REAKTIONSZEIT-KALIBRIERUNG: ',
    'sys_drag_instructions': 'Zieh deinen Daumen wiederholt über dieses Feld, ohne loszulassen.',

    // Smooth guidelines de
    'smooth_heading': 'FF FLÜSSIGKEITS-PROGRAMMIERUNG',
    'smooth_sub': 'Dies sind verifizierte Einstellungen zur Reduzierung von Free Fire Systemlag:',
    'smooth_step1_title': 'DEAKTIVIEREN SIE RAM PLUS / VIRTUAL RAM (RUCKLER-BEHEBUNG)',
    'smooth_step1_why': 'Hintergrund: RAM Plus nutzt langsamen Flash-Speicher, der Ruckler beim Laden von Ressourcen verursacht.',
    'smooth_step1_how': 'Anwendung: Gehen Sie zu Einstellungen > Speicher > RAM Plus und schalten Sie es aus. Handy neu starten.',
    'smooth_step2_title': 'GRAFIKTREIBER IN ENTWICKLEROPTIONEN ERZWINGEN',
    'smooth_step2_why': 'Hintergrund: Standardmäßige Renderpfade können veraltet sein. Der System-Grafiktreiber verbessert den GPU-Zugriff.',
    'smooth_step2_how': 'Anwendung: In den Entwickleroptionen nach Grafiktreiber-Einstellungen suchen, Free Fire auswählen und auf "System-Grafiktreiber" einstellen.',
    'smooth_step3_title': 'DEV-OPTION: HW-OVERLAYS DEAKTIVIEREN',
    'smooth_step3_why': 'Hintergrund: Übergibt Bildschirmberechnungen direkt an den Grafikprozessor.',
    'smooth_step3_how': 'Anwendung: Entwickleroptionen am Ende suchen nach "HW-Overlays deaktivieren" und aktivieren.',
    'smooth_step4_title': 'KEINE AKKUBEGRÄNZUNG FÜR FREE FIRE einstellen',
    'smooth_step4_why': 'Hintergrund: Android drosselt nach einiger Zeit die Taktgeschwindigkeit, um Energie zu sparen.',
    'smooth_step4_how': 'Anwendung: Einstellungen > Apps > Free Fire > Akku > Ändern auf "Nicht eingeschränkt".',
    'smooth_step5_title': 'IN-GAME ENGINESETTINGS STANDARDISIEREN',
    'smooth_step5_why': 'Hintergrund: Schatten verbrauchen wertvolle Renderzyklen im Spiel.',
    'smooth_step5_how': 'Anwendung: Free Fire öffnen > Einstellungen > Anzeige. Grafik auf Standard / Flüssig stellen und FPS auf Hoch stellen. Auto-Scale ausschalten.'
  },
  ja: {
    // Nav Tabs
    'tab_pro_tips': '🔥 プロの裏技',
    'tab_config_generator': '🎯 感度設定',
    'tab_gfx_tool': '⚡ GFXツール',
    'tab_system_optimizer': '🚀 スピードアップ',
    'tab_profile': '👤 プロフィール',
    'tab_settings': '🛠️ 設定',
    'tab_history': '⏳ 履歴',

    // Settings Tab
    'settings_title': '環境設定',
    'settings_appearance': '外観設定',
    'settings_visual_fx': '特殊効果（FX）を有効にする:',
    'settings_fx_desc': 'マトリックス背景を無効にすると、低スペックスマートフォンのパフォーマンスが向上する可能性があります。',
    'settings_data_mgmt': 'データ管理',
    'settings_clear_history': '生成データのログ履歴を全削除します:',
    'settings_clear_history_btn': '履歴を全消去',
    'settings_clear_profile': '保存済みのテスト用デバイスプロファイルを削除:',
    'settings_clear_profile_btn': 'プロファイル消去',
    'settings_language': '言語 (Language)',
    'settings_language_desc': 'インターフェース、ガイド、および計算エンジンの使用言語を設定します。',
    'settings_about': 'アプリケーションについて',
    'settings_about_desc': 'FFプレイヤー用の人工知能ゲーミングサポートアシスタント。プロ向けの詳細な感度・応答特性パラメータを提供します。',
    'settings_version': 'バージョン 1.2.5 (安定版)',
    'clear_history_confirm_title': '履歴消去の確認',
    'clear_history_confirm_desc': '本当にこれまでのデータをすべて削除しますか？一度実行すると元に戻せません。',
    'clear_profile_confirm_title': 'プロファイル削除の確認',
    'clear_profile_confirm_desc': '登録されたテスト環境プロファイルを消去しますか？再度デバイス仕様の検知が必要になります。',
    'feedback_history_cleared': '生成された感度履歴が消去されました。',
    'feedback_profile_cleared': '保存されたデバイス環境情報がリセットされました。',
    'feedback_lang_changed': '言語設定を変更しました！',

    // Header & Footer
    'header_subtitle': 'AI eスポーツ キャリブレーション エンジン',
    'active_profile_prefix': 'アクティブデバイス設定: ',
    'fx_label': '特效表示:',

    // Pro Tips Tab
    'protips_title': 'AI eスポーツ戦略アドバイザー',
    'protips_desc': '使用武器の性能に合致した正確なドラッグショット技法、レティクル（十字線）配置、そして銃の反動ベクトル制御計画を提示します。',
    'protips_select_range_lbl': '運用カテゴリー・交戦射程:',
    'protips_select_range_placeholder': '武器カテゴリを選択してください',
    'protips_btn_generate': 'AI戦略を構築する',
    'protips_blueprint': 'eスポーツ攻撃戦略設計図',
    'protips_recoil': 'リコイル（反動）抑制パラメータ',
    'protips_drag': '推奨ドラッグ速度評価',
    'protips_notes': '戦術戦闘注意書',
    'protips_generating_toast': 'プロのアドバイス履歴をコンパイル中...',
    'protips_success_toast': '戦闘戦術設計図が完成しました！',

    // Config Generator Tab
    'config_title': '高精度感度算出パネル',
    'config_desc': 'タッチパネルの動作応答限界と仕様に合わせた、Free Fire 向けの最も安定した感度係数を抽出します。',
    'config_quick_select': '⚡ 機種プリセット選択:',
    'config_quick_select_desc': '* お使いの機種がリストにない場合は、下の枠に機種名を入力してください。',
    'config_model_lbl': 'スマートフォンの機種名:',
    'config_android_ver_lbl': 'Android バージョン:',
    'config_ios_ver_lbl': 'iOS バージョン:',
    'config_dev_type': 'デバイスシステム:',
    'config_hardware_tier': 'チップセットクラス性能:',
    'config_play_style': '🎯 プレイスタイルの指定:',
    'config_verified_lookup': 'リアルタイムのeスポーツデータベース照合稼働中',
    'config_verified_desc': '他社の簡易アプリ等とは異なり、本物のeスポーツ試合データとスマートフォンの精密タッチ検知性能を比較計算。ブレずに当たる数値を提供します。',
    'config_btn_generate': '最適化された感度設計を行う',
    'config_output_title': '高整合性キャリブレーション出力値',
    'config_dpi_desc': '照準制御を高める解像度設定の最適倍率。素早いドラッグへの追従性が劇的に高まります。',
    'config_dpi': 'DPI 加速率',
    'config_pointer': 'ポインタ応答調整',
    'config_pointer_desc': '中心安定性と、上方向のスライド時の微細な反動を軽減。',
    'config_button_size': '推奨射撃ボタン寸法',
    'config_button_size_desc': '誤動作を防ぎつつ一瞬でヘッドショットを打てる最小基準幅。',
    'config_rules_title': '感度設定適用の際の注意点',
    'config_toast_generating': '競技データベースから機密情報の感度を演算中...',
    'config_toast_success': '照準調整パラメータの算出に成功！',

    // Styles
    'style_balanced_desc': '全ての交戦距離で完璧なエイム追従。',
    'style_balanced_title': 'バランス調整',
    'style_rusher_desc': 'SMG/ショットガン近接戦用の高速ドラッグ追従。',
    'style_rusher_title': '近接ラッシャー',
    'style_sniper_desc': 'スナイパー（AWM/M82B等）の精密射撃向け。',
    'style_sniper_title': '特殊狙撃手',
    'style_supporter_desc': 'ARライフル等での連射時反動を補正。',
    'style_supporter_title': '中距離支援',

    // GFX Tool
    'gfx_title': 'eスポーツ GFX制御ツール',
    'gfx_desc': '画質・画面更新頻度（FPS）および温度制限をキャリブレーションして、安定したフレーム伝送と発熱コントロールを行います。',
    'gfx_res': '画面解像度幅',
    'gfx_fps': 'フレームレート上限値',
    'gfx_shadows': '動的プロシャドウ効果',
    'gfx_shadows_enabled': 'オン (有効)',
    'gfx_shadows_disabled': 'オフ (無効)',
    'gfx_api': '高品位グラフィック出力API',
    'gfx_btn': '設定パラメータを投入',
    'gfx_toast_generating': '画面構成パラメーターを設定中...',
    'gfx_toast_success': 'グラフィックス環境の切り替え完了！',

    // Diagnostics
    'profile_title': 'モバイル性能診断ハブ',
    'profile_desc': 'タッチ検知性能、プロセッサスレッド、および画面のリフレッシュ特性のリアルタイム状況を表示します。',
    'profile_saving': 'プロファイルを同期中...',
    'profile_saved': '環境情報の保存が完了しました。',

    // History
    'history_title': '最適化アーカイブ',
    'history_desc': '過去に作成した感度プロファイル、動作環境設定、戦術ファイルをいつでもロード可能な安全なローカル履歴領域。',
    'history_empty': 'まだ履歴が登録されていません。生成された最適化プロファイルがここに表示されます。',
    'history_clear_all': '最適化ログの完全消去',

    // System Optimizer Tab
    'sys_title': 'システム最適化コックピット',
    'sys_desc': '無駄な動作アニメーションを排除し、スマートフォンのゲーミング効率を引き出す診断センター。',
    'sys_tab_copilot': 'Androidアシスタント',
    'sys_tab_calibration': 'タッチ入力最適化',
    'sys_tab_details': '動作ヌルヌル化手順(実仕様)',
    'sys_btn_recalibrate': '診断を再構築する',
    'sys_btn_generate': 'AIパフォーマンスマニュアル生成',
    'sys_toast_manual_success': '最適化設計マニュアルが完成しました！',
    'sys_flusher_title': '物理メモリクリーナー',
    'sys_flusher_desc': 'ウェブブラウザのメモリ領域とVRAMフレームキャッシュを瞬時に解放し、スマートフォンの使用可能メモリ容量をゲーミングのために確保します。',
    'sys_heap_reclaimed': '解放に成功したメモリ容量: ',
    'sys_btn_flush': '即時メモリクリーンアップを実行',
    'sys_btn_flushing': '不要メモリを削除中...',
    'sys_aligner_title': '高精度タッチフィードバック校正',
    'sys_aligner_desc': '指先の移動軌跡と画面のスライド方向の時間的誤差（ジッター）を検出し、最適な時間軸でゲーム画面を再評価。',
    'sys_touch_hz': '画面タッチ認識率',
    'sys_touch_jitter': '検知タイミングのゆらぎ',
    'sys_touch_optimization': 'ドラッグ追従速度スピードアップ',
    'sys_optimized': '最適化完了',
    'sys_touch_placeholder': 'ここにタッチキャリブレーションの各種指標が表示されます。',
    'sys_btn_start_calib': 'タッチ入力評価を開始する',
    'sys_calib_vector': '入力応答係数を算出中: ',
    'sys_drag_instructions': '指を一度も離さずに、この枠の中を複数回なぞってください',

    // Smooth guidelines
    'smooth_heading': 'FF動作安定化・遅延除去の極意',
    'smooth_sub': '実際に端末設定を変更することで、Free Fireの動作が劇的に軽くスムーズになります（広告等のない本物のアドバイス）:',
    'smooth_step1_title': 'RAM Plus (仮想メモリ) を「オフ」に変更してプチフリーズを除去',
    'smooth_step1_why': '理由：現在のスマートフォンにはRAM Plus（仮想RAM）が設定されていますが、ストレージ上の遅い領域を使用するため、ゲーム中に重大なコマ落ちが生じやすくなります。',
    'smooth_step1_how': '設定変更方法：設定 > バッテリーとデバイスケア > メモリ > RAM Plusを探し、直ちに「オフ」に切り替えた後、スマホを再起動してください。',
    'smooth_step2_title': '開発者向けオプションで「システムグラフィックドライバ」を選択して性能向上',
    'smooth_step2_why': '理由：初期設定のAndroid描画環境を最新に変更し、GPU性能を直接ゲームに解放します。',
    'smooth_step2_how': '設定変更方法：スマホの設定から開発者向けオプションを開き、「グラフィックドライバの設定」に入ってください。Free Fireを探して「システムグラフィックドライバ」または「ゲームドライバ」を選択します。',
    'smooth_step3_title': 'Disable HW overlays (HWオーバーレイの無効化) を選択',
    'smooth_step3_why': '理由：画面のレイアウト合成負荷をCPUからすべてGPUに委譲。タッチ感度や指スライドへのレスポンスが別次元に滑らかになります。',
    'smooth_step3_how': '設定変更方法：開発者向けオプションの中を進み、「HWオーバーレイを無効化（ONにする）」に設定します。',
    'smooth_step4_title': 'Free Fireのバッテリー制限を「制限なし」に指定する',
    'smooth_step4_why': '理由：Android標準の省電力基準により、ゲーム後半の集団戦などで処理速度（クロック周波数）に意図的な制限が加えられ、重くなるのを防ぎます。',
    'smooth_step4_how': '設定変更方法：設定 > アプリ > Free Fire > バッテリーに入り、デフォルトの「最適化」から「制限なし」に選択変更します。',
    'smooth_step5_title': 'ゲーム内エンジンの最適カスタム設定',
    'smooth_step5_why': '理由：ゲーム内部での無駄な高解像度化や影の処理をオフにし、プロと同様にFPS最優先でレンダリングさせます。',
    'smooth_step5_how': '設定変更方法：ゲームを開く > 設定 > ディスプレイ。グラフィックス画質を「標準」または「滑らか」に変更し、FPS設定を「高」に指定。Auto-Scale（自動構成調整）を「オフ」に設定。'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved === 'hi' || saved === 'de' || saved === 'ja' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const localized = translations[language];
    if (localized && localized[key]) {
      return localized[key];
    }
    // Fallback to English
    const fallback = translations['en'];
    if (fallback && fallback[key]) {
      return fallback[key];
    }
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
