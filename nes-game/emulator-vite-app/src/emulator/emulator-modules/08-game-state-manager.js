/**
 * Game State Manager Module
 * Manages saving, loading, and persistence of game states and settings
 */
export default class GameStateManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    initializeStateStorage() {
        // Initialize state storage functionality
        if (!this.emulator.storage) {
            this.emulator.storage = {};
        }
        if (!this.emulator.storage.states) {
            // Initialize state storage
            this.emulator.storage.states = {
                put: async (key, data) => {
                    // Implementation for storing state data
                },
                get: async (key) => {
                    // Implementation for retrieving state data
                    return null;
                }
            };
        }
    }

    quickSave(slot = "1") {
        if (this.emulator.gameManager && this.emulator.gameManager.quickSave) {
            const success = this.emulator.gameManager.quickSave(slot);
            if (success) {
                this.emulator.displayMessage(this.emulator.localization("SAVED STATE TO SLOT") + " " + slot);
            } else {
                this.emulator.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
            }
            return success;
        }
        return false;
    }

    quickLoad(slot = "1") {
        if (this.emulator.gameManager && this.emulator.gameManager.quickLoad) {
            this.emulator.gameManager.quickLoad(slot);
            this.emulator.displayMessage(this.emulator.localization("LOADED STATE FROM SLOT") + " " + slot);
            return true;
        }
        return false;
    }

    saveSettings() {
        if (!window.localStorage || this.emulator.config.disableLocalStorage || !this.emulator.settingsLoaded) return;
        if (!this.emulator.started && !this.emulator.failedToStart) return;
        const coreSpecific = {
            controlSettings: this.emulator.controls,
            settings: this.emulator.settings,
            cheats: this.emulator.cheats
        };
        const ejs_settings = {
            settings: this.emulator.allSettings
        };
        localStorage.setItem("ejs-settings", JSON.stringify(ejs_settings));
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(coreSpecific));
    }

    getSettingValue(setting) {
        if (this.emulator.settings && this.emulator.settings[setting] !== undefined) {
            return this.emulator.settings[setting];
        }
        return this.emulator.preGetSetting(setting);
    }

    setSettingValue(setting, value) {
        if (!this.emulator.settings) {
            this.emulator.settings = {};
        }
        this.emulator.settings[setting] = value;
        this.emulator.allSettings[setting] = value;
        this.saveSettings();
    }

    getLocalStorageKey() {
        let identifier = (this.emulator.config.gameId || 1) + "-" + this.emulator.getCore(true);
        if (typeof this.emulator.config.gameName === "string") {
            identifier += "-" + this.emulator.config.gameName;
        } else if (typeof this.emulator.config.gameUrl === "string" && !this.emulator.config.gameUrl.toLowerCase().startsWith("blob:")) {
            identifier += "-" + this.emulator.config.gameUrl;
        } else if (this.emulator.config.gameUrl instanceof File) {
            identifier += "-" + this.emulator.config.gameUrl.name;
        }
        return identifier;
    }

    getCoreSettings() {
        if (!window.localStorage || this.emulator.config.disableLocalStorage) {
            if (this.emulator.config.defaultOptions) {
                let rv = "";
                for (const k in this.emulator.config.defaultOptions) {
                    let value = isNaN(this.emulator.config.defaultOptions[k]) ? `"${this.emulator.config.defaultOptions[k]}"` : this.emulator.config.defaultOptions[k];
                    rv += `${k}=${value}\n`;
                }
                return rv;
            }
            return "";
        }
        let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
        if (coreSpecific) {
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (!(coreSpecific.settings instanceof Object)) throw new Error("Not a JSON object");
                let rv = "";
                for (const k in coreSpecific.settings) {
                    let value = isNaN(coreSpecific.settings[k]) ? `"${coreSpecific.settings[k]}"` : coreSpecific.settings[k];
                    rv += `${k}=${value}\n`;
                }
                return rv;
            } catch (e) {
                console.warn("Failed to parse core settings:", e);
            }
        }
        return "";
    }

    loadSettings() {
        if (!window.localStorage || this.emulator.config.disableLocalStorage) return;
        this.emulator.settingsLoaded = true;
        let ejs_settings = localStorage.getItem("ejs-settings");
        let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
        if (coreSpecific) {
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (!(coreSpecific.controlSettings instanceof Object) || !(coreSpecific.settings instanceof Object) || !Array.isArray(coreSpecific.cheats)) return;
                this.emulator.controls = coreSpecific.controlSettings;
                this.emulator.settings = coreSpecific.settings;
                this.emulator.cheats = coreSpecific.cheats;
            } catch (e) {
                console.warn("Failed to load settings:", e);
            }
        }
        if (ejs_settings) {
            try {
                ejs_settings = JSON.parse(ejs_settings);
                if (ejs_settings.settings instanceof Object) {
                    this.emulator.allSettings = ejs_settings.settings;
                }
            } catch (e) {
                console.warn("Failed to load global settings:", e);
            }
        }
    }

    saveStateToBrowser(state) {
        if (this.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
            this.emulator.storage.states.put(this.emulator.getBaseFileName() + ".state", state);
            this.emulator.displayMessage(this.emulator.localization("SAVE SAVED TO BROWSER"));
        }
    }

    loadStateFromBrowser() {
        if (this.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
            this.emulator.storage.states.get(this.emulator.getBaseFileName() + ".state").then(e => {
                if (e) {
                    this.emulator.gameManager.loadState(e);
                    this.emulator.displayMessage(this.emulator.localization("SAVE LOADED FROM BROWSER"));
                }
            });
        }
    }
}
