/**
 * EmulatorJS - Settings Manager Module
 * 设置管理
 */

export class SettingsManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.settings = {};
        this.defaultSettings = {};
        this.settingsStorage = null;
        this.currentMenu = null;
        this.menuContainer = null;
    }

    init() {
        this.initDefaultSettings();
        this.loadSettings();
        this.setupSettingsStorage();
    }

    initDefaultSettings() {
        this.defaultSettings = {
            // Video settings
            videoScale: 2,
            videoRotation: 0,
            videoSmooth: true,
            videoFilter: 0,
            shaders: "none",
            
            // Audio settings
            volume: 0.5,
            muted: false,
            
            // Input settings
            virtualGamepadEnabled: true,
            virtualGamepadOpacity: 0.7,
            virtualGamepadScale: 1.0,
            virtualGamepadLeftHanded: false,
            virtualGamepadAutoHide: false,
            lockMouse: false,
            
            // Performance settings
            fastForwardRatio: 2,
            slowMotionRatio: 0.5,
            rewindBuffer: false,
            
            // Save states
            saveStateSlots: 8,
            saveStateLocation: "browser",
            autoSave: false,
            
            // Display settings
            showFps: false,
            showStats: false,
            
            // Network settings
            netplayEnabled: false,
            
            // Other settings
            screenshotFormat: "png",
            screenshotUpscale: 1,
            screenRecordFormat: "webm",
            screenRecordUpscale: 1,
            screenRecordVideoBitrate: 2500000,
            screenRecordAudioBitrate: 192000,
            screenRecordFps: 30
        };
    }

    setupSettingsStorage() {
        if (!this.emulator.config.disableLocalStorage) {
            this.settingsStorage = new window.EJS_STORAGE("EmulatorJS-settings", "settings");
        }
    }

    loadSettings() {
        // Load settings from storage
        this.settings = { ...this.defaultSettings };
        
        if (this.settingsStorage) {
            this.settingsStorage.get("settings").then(storedSettings => {
                if (storedSettings) {
                    this.settings = { ...this.settings, ...storedSettings };
                    this.applySettings();
                }
            }).catch(err => {
                console.warn("Failed to load settings:", err);
            });
        }
        
        // Load settings from config
        if (this.emulator.config.defaultOptions) {
            this.settings = { ...this.settings, ...this.emulator.config.defaultOptions };
        }
    }

    saveSettings() {
        if (this.settingsStorage) {
            this.settingsStorage.put("settings", this.settings).catch(err => {
                console.warn("Failed to save settings:", err);
            });
        }
    }

    getSetting(key) {
        return this.settings[key] !== undefined ? this.settings[key] : this.defaultSettings[key];
    }

    getSettingValue(key) {
        return this.getSetting(key);
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySetting(key, value);
        this.emulator.callEvent("settingChanged", { key, value });
    }

    applySettings() {
        // Apply all settings
        for (const key in this.settings) {
            this.applySetting(key, this.settings[key]);
        }
    }

    applySetting(key, value) {
        switch (key) {
            case "volume":
                if (this.emulator.audioContext) {
                    this.emulator.volume = value;
                    this.emulator.updateVolume();
                }
                break;
                
            case "muted":
                if (this.emulator.audioContext) {
                    this.emulator.muted = value;
                    this.emulator.updateVolume();
                }
                break;
                
            case "virtualGamepadEnabled":
                if (this.emulator.virtualGamepad) {
                    if (value) {
                        this.emulator.virtualGamepad.show();
                    } else {
                        this.emulator.virtualGamepad.hide();
                    }
                }
                break;
                
            case "virtualGamepadOpacity":
                if (this.emulator.virtualGamepad) {
                    this.emulator.virtualGamepad.setOpacity(value);
                }
                break;
                
            case "virtualGamepadScale":
                if (this.emulator.virtualGamepad) {
                    this.emulator.virtualGamepad.setScale(value);
                }
                break;
                
            case "virtualGamepadLeftHanded":
                if (this.emulator.virtualGamepad) {
                    this.emulator.virtualGamepad.setLeftHanded(value);
                }
                break;
                
            case "virtualGamepadAutoHide":
                if (this.emulator.virtualGamepad) {
                    this.emulator.virtualGamepad.setAutoHide(value);
                }
                break;
                
            case "lockMouse":
                if (value && this.emulator.canvas && !this.emulator.inputManager.mouse.locked) {
                    this.emulator.inputManager.requestPointerLock();
                } else if (!value && this.emulator.inputManager.mouse.locked) {
                    this.emulator.inputManager.exitPointerLock();
                }
                break;
                
            case "showFps":
                if (this.emulator.fpsDisplay) {
                    this.emulator.fpsDisplay.style.display = value ? "block" : "none";
                }
                break;
                
            case "showStats":
                if (this.emulator.statsDisplay) {
                    this.emulator.statsDisplay.style.display = value ? "block" : "none";
                }
                break;
        }
    }

    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
        this.emulator.callEvent("settingsReset");
    }

    createSettingsMenu() {
        const menu = this.emulator.createElement("div");
        menu.className = "ejs_settings_menu";
        menu.style.padding = "20px";
        menu.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        menu.style.color = "white";
        menu.style.borderRadius = "8px";
        menu.style.minWidth = "350px";
        menu.style.maxHeight = "80vh";
        menu.style.overflowY = "auto";
        menu.style.position = "relative";

        // Title
        const title = this.emulator.createElement("h2");
        title.innerText = "Settings";
        title.style.marginBottom = "20px";
        title.style.color = "white";
        title.style.textAlign = "center";
        menu.appendChild(title);

        // Settings sections
        this.createVideoSettings(menu);
        this.createAudioSettings(menu);
        this.createInputSettings(menu);
        this.createPerformanceSettings(menu);
        this.createSaveStateSettings(menu);
        this.createDisplaySettings(menu);
        this.createCaptureSettings(menu);

        // Buttons
        const buttons = this.emulator.createElement("div");
        buttons.style.marginTop = "20px";
        buttons.style.display = "flex";
        buttons.style.justifyContent = "space-between";
        buttons.style.gap = "10px";

        const resetButton = this.emulator.createElement("button");
        resetButton.innerText = "Reset to Default";
        resetButton.style.flex = "1";
        resetButton.style.padding = "8px";
        resetButton.style.backgroundColor = "#f44336";
        resetButton.style.color = "white";
        resetButton.style.border = "none";
        resetButton.style.borderRadius = "4px";
        resetButton.style.cursor = "pointer";
        this.emulator.addEventListener(resetButton, "click", () => {
            this.resetSettings();
            this.emulator.closePopup();
            this.showSettingsMenu();
        });

        const closeButton = this.emulator.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.flex = "1";
        closeButton.style.padding = "8px";
        closeButton.style.backgroundColor = "#2196F3";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "4px";
        closeButton.style.cursor = "pointer";
        this.emulator.addEventListener(closeButton, "click", () => {
            this.emulator.closePopup();
        });

        buttons.appendChild(resetButton);
        buttons.appendChild(closeButton);
        menu.appendChild(buttons);

        return menu;
    }

    createVideoSettings(container) {
        const section = this.createSection("Video Settings", container);

        // Video rotation
        this.createSelectSetting(section, "Video Rotation", "videoRotation", [
            { value: 0, label: "0°" },
            { value: 1, label: "90°" },
            { value: 2, label: "180°" },
            { value: 3, label: "270°" }
        ]);

        // Video scale
        this.createSliderSetting(section, "Video Scale", "videoScale", 1, 4, 0.25, (value) => Math.round(value * 4) / 4);

        // Video smooth
        this.createCheckboxSetting(section, "Video Smoothing", "videoSmooth");

        // Shaders
        this.createSelectSetting(section, "Shaders", "shaders", [
            { value: "none", label: "None" },
            { value: "crt", label: "CRT" },
            { value: "scanlines", label: "Scanlines" },
            { value: "blur", label: "Blur" },
            { value: "2x", label: "2x" }
        ]);
    }

    createAudioSettings(container) {
        const section = this.createSection("Audio Settings", container);

        // Volume
        this.createSliderSetting(section, "Volume", "volume", 0, 1, 0.01, (value) => Math.round(value * 100) / 100);

        // Mute
        this.createCheckboxSetting(section, "Mute", "muted");
    }

    createInputSettings(container) {
        const section = this.createSection("Input Settings", container);

        // Virtual gamepad
        this.createCheckboxSetting(section, "Virtual Gamepad", "virtualGamepadEnabled");

        // Virtual gamepad opacity
        this.createSliderSetting(section, "Virtual Gamepad Opacity", "virtualGamepadOpacity", 0.1, 1, 0.01, (value) => Math.round(value * 100) / 100);

        // Virtual gamepad scale
        this.createSliderSetting(section, "Virtual Gamepad Scale", "virtualGamepadScale", 0.5, 2, 0.1, (value) => Math.round(value * 10) / 10);

        // Virtual gamepad left handed
        this.createCheckboxSetting(section, "Virtual Gamepad Left Handed", "virtualGamepadLeftHanded");

        // Virtual gamepad auto hide
        this.createCheckboxSetting(section, "Virtual Gamepad Auto Hide", "virtualGamepadAutoHide");

        // Lock mouse
        this.createCheckboxSetting(section, "Lock Mouse", "lockMouse");
    }

    createPerformanceSettings(container) {
        const section = this.createSection("Performance Settings", container);

        // Fast forward ratio
        this.createSliderSetting(section, "Fast Forward Speed", "fastForwardRatio", 1, 4, 0.25, (value) => Math.round(value * 4) / 4);

        // Slow motion ratio
        this.createSliderSetting(section, "Slow Motion Speed", "slowMotionRatio", 0.25, 1, 0.25, (value) => Math.round(value * 4) / 4);

        // Rewind buffer
        this.createCheckboxSetting(section, "Enable Rewind", "rewindBuffer");
    }

    createSaveStateSettings(container) {
        const section = this.createSection("Save State Settings", container);

        // Save state slots
        this.createSelectSetting(section, "Save State Slots", "saveStateSlots", [
            { value: 4, label: "4" },
            { value: 8, label: "8" },
            { value: 16, label: "16" },
            { value: 32, label: "32" }
        ]);

        // Save state location
        this.createSelectSetting(section, "Save State Location", "saveStateLocation", [
            { value: "browser", label: "Browser" },
            { value: "file", label: "File" }
        ]);

        // Auto save
        this.createCheckboxSetting(section, "Auto Save", "autoSave");
    }

    createDisplaySettings(container) {
        const section = this.createSection("Display Settings", container);

        // Show FPS
        this.createCheckboxSetting(section, "Show FPS", "showFps");

        // Show stats
        this.createCheckboxSetting(section, "Show Stats", "showStats");
    }

    createCaptureSettings(container) {
        const section = this.createSection("Capture Settings", container);

        // Screenshot format
        this.createSelectSetting(section, "Screenshot Format", "screenshotFormat", [
            { value: "png", label: "PNG" },
            { value: "jpg", label: "JPEG" },
            { value: "webp", label: "WebP" }
        ]);

        // Screenshot upscale
        this.createSelectSetting(section, "Screenshot Upscale", "screenshotUpscale", [
            { value: 0, label: "Native" },
            { value: 1, label: "1x" },
            { value: 2, label: "2x" },
            { value: 3, label: "3x" },
            { value: 4, label: "4x" }
        ]);

        // Screen record format
        this.createSelectSetting(section, "Screen Record Format", "screenRecordFormat", [
            { value: "webm", label: "WebM" },
            { value: "mp4", label: "MP4" }
        ]);

        // Screen record upscale
        this.createSelectSetting(section, "Screen Record Upscale", "screenRecordUpscale", [
            { value: 1, label: "1x" },
            { value: 2, label: "2x" },
            { value: 3, label: "3x" },
            { value: 4, label: "4x" }
        ]);

        // Screen record FPS
        this.createSelectSetting(section, "Screen Record FPS", "screenRecordFps", [
            { value: 15, label: "15" },
            { value: 24, label: "24" },
            { value: 30, label: "30" },
            { value: 60, label: "60" }
        ]);
    }

    createSection(title, container) {
        const section = this.emulator.createElement("div");
        section.style.marginBottom = "20px";
        section.style.padding = "15px";
        section.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        section.style.borderRadius = "6px";
        section.style.border = "1px solid rgba(255, 255, 255, 0.2)";

        const sectionTitle = this.emulator.createElement("h3");
        sectionTitle.innerText = title;
        sectionTitle.style.marginTop = "0";
        sectionTitle.style.marginBottom = "15px";
        sectionTitle.style.color = "white";
        sectionTitle.style.fontSize = "16px";
        section.appendChild(sectionTitle);

        container.appendChild(section);
        return section;
    }

    createCheckboxSetting(container, label, key) {
        const settingRow = this.createSettingRow(container);
        
        const nameLabel = this.emulator.createElement("label");
        nameLabel.innerText = label;
        nameLabel.style.flex = "1";
        nameLabel.style.cursor = "pointer";
        settingRow.appendChild(nameLabel);

        const checkbox = this.emulator.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.getSetting(key);
        checkbox.style.width = "20px";
        checkbox.style.height = "20px";
        checkbox.style.cursor = "pointer";
        this.emulator.addEventListener(checkbox, "change", () => {
            this.setSetting(key, checkbox.checked);
        });

        this.emulator.addEventListener(nameLabel, "click", () => {
            checkbox.checked = !checkbox.checked;
            this.setSetting(key, checkbox.checked);
        });

        settingRow.appendChild(checkbox);
    }

    createSliderSetting(container, label, key, min, max, step, formatter) {
        const settingRow = this.createSettingRow(container);
        
        const nameLabel = this.emulator.createElement("label");
        nameLabel.innerText = label + ":";
        nameLabel.style.flex = "1";
        nameLabel.style.marginRight = "10px";
        settingRow.appendChild(nameLabel);

        const slider = this.emulator.createElement("input");
        slider.type = "range";
        slider.min = min.toString();
        slider.max = max.toString();
        slider.step = step.toString();
        slider.value = this.getSetting(key).toString();
        slider.style.flex = "2";
        slider.style.cursor = "pointer";
        this.emulator.addEventListener(slider, "input", () => {
            const value = parseFloat(slider.value);
            this.setSetting(key, value);
            valueLabel.innerText = formatter(value);
        });

        const valueLabel = this.emulator.createElement("span");
        valueLabel.innerText = formatter(this.getSetting(key));
        valueLabel.style.minWidth = "50px";
        valueLabel.style.textAlign = "right";
        valueLabel.style.marginLeft = "10px";
        settingRow.appendChild(valueLabel);

        settingRow.appendChild(slider);
        settingRow.appendChild(valueLabel);
    }

    createSelectSetting(container, label, key, options) {
        const settingRow = this.createSettingRow(container);
        
        const nameLabel = this.emulator.createElement("label");
        nameLabel.innerText = label + ":";
        nameLabel.style.flex = "1";
        nameLabel.style.marginRight = "10px";
        settingRow.appendChild(nameLabel);

        const select = this.emulator.createElement("select");
        select.style.flex = "2";
        select.style.padding = "4px";
        select.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        select.style.color = "white";
        select.style.border = "1px solid rgba(255, 255, 255, 0.3)";
        select.style.borderRadius = "4px";
        select.style.cursor = "pointer";

        options.forEach(option => {
            const optionElement = this.emulator.createElement("option");
            optionElement.value = option.value.toString();
            optionElement.innerText = option.label;
            optionElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            optionElement.style.color = "white";
            if (option.value === this.getSetting(key)) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        this.emulator.addEventListener(select, "change", () => {
            const value = select.value;
            if (key === "videoRotation") {
                this.setSetting(key, parseInt(value));
            } else if (key === "saveStateSlots") {
                this.setSetting(key, parseInt(value));
            } else if (key === "screenRecordFps") {
                this.setSetting(key, parseInt(value));
            } else if (key === "screenshotUpscale") {
                this.setSetting(key, parseInt(value));
            } else if (key === "screenRecordUpscale") {
                this.setSetting(key, parseInt(value));
            } else {
                this.setSetting(key, value);
            }
        });

        settingRow.appendChild(select);
    }

    createSettingRow(container) {
        const row = this.emulator.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "10px";
        row.style.padding = "5px 0";
        
        container.appendChild(row);
        return row;
    }

    showSettingsMenu() {
        const menu = this.createSettingsMenu();
        const popup = this.emulator.uiManager.createPopup("Settings", {}, true);
        popup[1].appendChild(menu);
        this.emulator.game.appendChild(popup[0]);
        this.emulator.game.appendChild(popup[1]);
        this.emulator.currentPopup = popup[1];
        this.currentMenu = menu;
    }

    exportSettings() {
        const settingsData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            settings: this.settings
        };
        
        const dataStr = JSON.stringify(settingsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        
        const link = this.emulator.createElement("a");
        link.href = url;
        link.download = "emulatorjs-settings.json";
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importSettings(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.settings && typeof data.settings === "object") {
                        this.settings = { ...this.defaultSettings, ...data.settings };
                        this.saveSettings();
                        this.applySettings();
                        this.emulator.callEvent("settingsImported");
                        resolve(data.settings);
                    } else {
                        reject(new Error("Invalid settings file format"));
                    }
                } catch (err) {
                    reject(new Error("Failed to parse settings file: " + err.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error("Failed to read settings file"));
            };
            
            reader.readAsText(file);
        });
    }

    cleanup() {
        if (this.menuContainer && this.menuContainer.parentNode) {
            this.menuContainer.parentNode.removeChild(this.menuContainer);
        }
        this.currentMenu = null;
    }
}
