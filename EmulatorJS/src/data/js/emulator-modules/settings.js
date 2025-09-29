/**
 * 模拟器设置模块
 * 包含所有配置和设置相关代码
 */

class EmulatorSettings {
    constructor(emulator) {
        this.emulator = emulator;
        this.config = {
            // 默认配置
            autosave: true,
            saveSlots: 10,
            saveInterval: 30000,
            controls: {
                keyboard: {
                    up: 'ArrowUp',
                    down: 'ArrowDown',
                    left: 'ArrowLeft',
                    right: 'ArrowRight',
                    a: 'KeyZ',
                    b: 'KeyX',
                    start: 'Enter',
                    select: 'Space'
                },
                gamepad: {
                    up: 12,
                    down: 13,
                    left: 14,
                    right: 15,
                    a: 0,
                    b: 1,
                    start: 9,
                    select: 8
                }
            },
            video: {
                scale: 2,
                filter: 'pixelated',
                aspectRatio: '4:3',
                fpsLimit: 60,
                vsync: true
            },
            audio: {
                volume: 0.8,
                sampleRate: 44100,
                bufferSize: 4096
            },
            netplay: {
                enabled: false,
                server: 'wss://netplay.example.com',
                playerName: 'Player',
                maxPlayers: 4,
                syncInterval: 10
            },
            system: {
                language: 'en',
                region: 'NTSC',
                biosEnabled: false
            }
        };
        this.loadConfig();
    }

    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('emulatorConfig');
            if (savedConfig) {
                this.config = JSON.parse(savedConfig);
                this.emulator.callEvent('configLoaded', this.config);
            }
        } catch (err) {
            console.error('Failed to load config:', err);
            this.emulator.callEvent('configError', err);
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('emulatorConfig', JSON.stringify(this.config));
            this.emulator.callEvent('configSaved', this.config);
        } catch (err) {
            console.error('Failed to save config:', err);
            this.emulator.callEvent('configError', err);
        }
    }

    get(key) {
        const keys = key.split('.');
        let value = this.config;
        
        for (const k of keys) {
            if (value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    set(key, value) {
        const keys = key.split('.');
        let obj = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!obj.hasOwnProperty(k)) {
                obj[k] = {};
            }
            obj = obj[k];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.saveConfig();
        this.emulator.callEvent('configChanged', { key, value });
    }

    reset() {
        this.config = {
            // 重置为默认配置...
        };
        this.saveConfig();
        this.emulator.callEvent('configReset');
    }

    importConfig(config) {
        try {
            if (typeof config === 'string') {
                config = JSON.parse(config);
            }
            this.config = config;
            this.saveConfig();
            this.emulator.callEvent('configImported', config);
            return true;
        } catch (err) {
            console.error('Failed to import config:', err);
            this.emulator.callEvent('configError', err);
            return false;
        }
    }

    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    // 视频设置方法
    setVideoSetting(key, value) {
        this.set(`video.${key}`, value);
        this.emulator.applyVideoSettings();
    }

    // 音频设置方法
    setAudioSetting(key, value) {
        this.set(`audio.${key}`, value);
        this.emulator.applyAudioSettings();
    }

    // 控制设置方法
    setControlSetting(type, button, value) {
        this.set(`controls.${type}.${button}`, value);
        this.emulator.applyControlSettings();
    }

    // 网络设置方法
    setNetplaySetting(key, value) {
        this.set(`netplay.${key}`, value);
        this.emulator.applyNetplaySettings();
    }

    // 系统设置方法
    setSystemSetting(key, value) {
        this.set(`system.${key}`, value);
        this.emulator.applySystemSettings();
    }

    // 其他设置方法...
}

export default EmulatorSettings;