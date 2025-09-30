/**
 * Localization Module
 * Handles multi-language support and text localization
 */
export default class Localization {
    constructor(emulator) {
        this.emulator = emulator;
    }

    localization(text, log) {
        if (typeof text === "undefined" || text.length === 0) return;
        text = text.toString();
        if (text.includes("EmulatorJS v")) return text;
        if (this.emulator.config.langJson) {
            if (typeof log === "undefined") log = true;
            if (typeof this.emulator.config.langJson[text] === "string") {
                if (log && !this.emulator.missingLang.includes(text)) {
                    this.emulator.missingLang.push(text);
                    console.log("Translation key found:", text, "->", this.emulator.config.langJson[text]);
                }
                return this.emulator.config.langJson[text];
            } else {
                if (log && !this.emulator.missingLang.includes(text)) {
                    this.emulator.missingLang.push(text);
                    console.warn("Missing translation key:", text);
                }
            }
        }
        return text;
    }

    getDefaultText() {
        return {
            "Loading...": "Loading...",
            "Start Game": "Start Game",
            "Screenshot": "Screenshot",
            "Quick Save": "Quick Save",
            "Quick Load": "Quick Load",
            "SAVED STATE TO SLOT": "Saved state to slot",
            "FAILED TO SAVE STATE": "Failed to save state",
            "LOADED STATE FROM SLOT": "Loaded state from slot",
            "FAILED TO LOAD STATE": "Failed to load state",
            "Network Error": "Network Error",
            "Error downloading core": "Error downloading core",
            "Outdated graphics driver": "Outdated graphics driver",
            "Outdated EmulatorJS version": "Outdated EmulatorJS version",
            "Error for site owner": "Error for site owner",
            "Check console": "Check console",
            "Download Game Core": "Download Game Core",
            "Download Game Data": "Download Game Data",
            "Download Game State": "Download Game State",
            "Decompress Game Core": "Decompress Game Core",
            "Decompress Game Data": "Decompress Game Data",
            "EmulatorJS": "EmulatorJS",
            "Settings": "Settings",
            "Close": "Close",
            "Enabled": "Enabled",
            "Disabled": "Disabled",
            "Requires restart": "Requires restart",
            "Shaders": "Shaders",
            "WebGL2": "WebGL2",
            "Virtual Gamepad": "Virtual Gamepad",
            "Menu Bar Button": "Menu Bar Button",
            "visible": "visible",
            "hidden": "hidden",
            "Volume": "Volume",
            "Netplay not connected": "Netplay not connected",
            "Connect to Room": "Connect to Room",
            "Click to resume Emulator": "Click to resume Emulator"
        };
    }

    setLanguage(langCode) {
        this.emulator.config.language = langCode;
        // 这里可以加载相应的语言包
    }

    getCurrentLanguage() {
        return this.emulator.config.language || 'en';
    }

    mergeLanguage(langJson) {
        if (!this.emulator.config.langJson) {
            this.emulator.config.langJson = {};
        }
        Object.assign(this.emulator.config.langJson, langJson);
    }

    getMissingKeys() {
        return this.emulator.missingLang || [];
    }

    clearMissingKeys() {
        this.emulator.missingLang = [];
    }

    validateLanguage(langJson) {
        const defaultText = this.getDefaultText();
        const missing = [];
        for (const key in defaultText) {
            if (!langJson[key]) {
                missing.push(key);
            }
        }
        return missing;
    }

    getSupportedLanguages() {
        return ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru'];
    }

    detectBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.split('-')[0];
    }

    loadLanguage(langCode) {
        // 这里可以实现动态加载语言包的逻辑
        return Promise.resolve({});
    }

    autoLoadLanguage() {
        const browserLang = this.detectBrowserLanguage();
        const supportedLangs = this.getSupportedLanguages();
        if (supportedLangs.includes(browserLang)) {
            this.setLanguage(browserLang);
        }
    }
}
