/**
 * 模拟器核心设置模块
 * 包含基本配置和UI相关设置
 */

class EmulatorCoreSettings {
    constructor(emulator) {
        this.emulator = emulator;
        this.defaultConfig = {
            color: "#1aafff",
            alignStartButton: "bottom",
            backgroundColor: "rgb(51, 51, 51)",
            startBtnName: "Start Game",
            startOnLoad: false,
            backgroundImg: null,
            backgroundBlur: false,
            cheats: [],
            volume: 0.8,
            mute: false,
            fullscreen: false,
            aspectRatio: "4:3",
            scanlines: false,
            scanlineIntensity: 0.15,
            pixelPerfect: false,
            smoothing: true,
            showFPS: false,
            language: "en",
            localization: {}
        };
        this.config = {...this.defaultConfig};
        this.loadConfig();
    }

    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('emulatorConfig');
            if (savedConfig) {
                this.config = {
                    ...this.defaultConfig,
                    ...JSON.parse(savedConfig)
                };
            }
        } catch (e) {
            console.warn('Failed to load config:', e);
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('emulatorConfig', JSON.stringify(this.config));
        } catch (e) {
            console.warn('Failed to save config:', e);
        }
    }

    resetConfig() {
        this.config = {...this.defaultConfig};
        this.saveConfig();
    }

    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.saveConfig();
        this.emulator.callEvent('config-updated', this.config);
    }

    // 其他核心设置方法...
}

export default EmulatorCoreSettings;