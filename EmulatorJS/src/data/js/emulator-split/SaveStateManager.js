/**
 * 存档管理模块
 * 负责处理游戏存档的保存、加载和管理
 */
export class SaveStateManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.autoSaveInterval = null;
        this.autoSaveEnabled = this.emulator.config.autoSave !== false;
        this.autoSaveIntervalTime = this.emulator.config.autoSaveInterval || 300000; // 默认5分钟
    }

    init() {
        // 初始化自动保存
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }

        // 监听游戏状态变化
        this.emulator.on("pause", () => {
            this.saveState();
        });

        this.emulator.on("exit", () => {
            this.saveState();
            this.stopAutoSave();
        });
    }

    startAutoSave() {
        if (this.autoSaveInterval) return;

        this.autoSaveInterval = setInterval(() => {
            if (this.emulator.started && !this.emulator.paused) {
                this.saveState();
            }
        }, this.autoSaveIntervalTime);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    saveState() {
        if (!this.emulator.started || this.emulator.paused) return;

        try {
            const state = this.emulator.gameManager.getState();

            // 在浏览器中保存存档
            if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
                this.emulator.storage.states.put(this.emulator.getBaseFileName() + ".state", state);
                this.emulator.displayMessage(this.emulator.localization("Auto-saved to browser"));
            }

            // 触发保存事件
            this.emulator.callEvent("saveState", {
                state: state
            });

        } catch (e) {
            console.error("Failed to save state", e);
        }
    }

    loadState() {
        if (!this.emulator.started) return;

        // 从浏览器加载存档
        if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
            this.emulator.storage.states.get(this.emulator.getBaseFileName() + ".state").then(e => {
                this.emulator.gameManager.loadState(e);
                this.emulator.displayMessage(this.emulator.localization("Auto-loaded from browser"));
            }).catch(e => {
                console.error("Failed to load state from browser", e);
            });
        }

        // 触发加载事件
        this.emulator.callEvent("loadState");
    }

    exportSave() {
        if (!this.emulator.started) return;

        try {
            const state = this.emulator.gameManager.getState();
            const blob = new Blob([state]);
            const url = URL.createObjectURL(blob);
            const a = this.emulator.createElement("a");
            a.href = url;
            a.download = this.emulator.getBaseFileName() + ".state";
            a.click();
            URL.revokeObjectURL(url);

            this.emulator.displayMessage(this.emulator.localization("Save exported successfully"));
        } catch (e) {
            console.error("Failed to export save", e);
            this.emulator.displayMessage(this.emulator.localization("Failed to export save"));
        }
    }

    importSave() {
        if (!this.emulator.started) return;

        const input = this.emulator.createElement("input");
        input.type = "file";
        input.accept = ".state";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const state = new Uint8Array(event.target.result);
                    this.emulator.gameManager.loadState(state);
                    this.emulator.displayMessage(this.emulator.localization("Save imported successfully"));
                } catch (e) {
                    console.error("Failed to import save", e);
                    this.emulator.displayMessage(this.emulator.localization("Failed to import save"));
                }
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    }

    deleteSave() {
        if (!this.emulator.started) return;

        if (confirm(this.emulator.localization("Are you sure you want to delete the save?"))) {
            try {
                this.emulator.storage.states.delete(this.emulator.getBaseFileName() + ".state");
                this.emulator.displayMessage(this.emulator.localization("Save deleted successfully"));
            } catch (e) {
                console.error("Failed to delete save", e);
                this.emulator.displayMessage(this.emulator.localization("Failed to delete save"));
            }
        }
    }

    getSaveCount() {
        return this.emulator.storage.states.keys().length;
    }

    listSaves() {
        return this.emulator.storage.states.keys();
    }
}
