/**
 * Core Management Module
 * Handles game core initialization and game lifecycle management
 */
export default class CoreManagement {
    constructor(emulator) {
        this.emulator = emulator;
    }

    initGameCore(js, wasm, thread) {
        // 替换 var EJS_Runtime 为 window.EJS_Runtime 以确保在微前端环境中能正确挂载
        let modifiedJs = js;
        if (js instanceof Uint8Array) {
            // 将 Uint8Array 转换为字符串
            const jsString = new TextDecoder().decode(js);
            // 替换 var EJS_Runtime 为 window.EJS_Runtime (考虑可能有多个空格)
            const modifiedJsString = jsString.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
            // 将修改后的字符串转换回 Uint8Array
            modifiedJs = new TextEncoder().encode(modifiedJsString);
        } else if (typeof js === 'string') {
            modifiedJs = js.replace(/var EJS_Runtime =/g, 'window.EJS_Runtime =');
        }

        let script = this.emulator.createElement("script");
        script.src = URL.createObjectURL(new Blob([modifiedJs], { type: "application/javascript" }));
        script.id = "game-core-script"
        script.addEventListener("load", () => {
            // 在微前端环境下尝试从不同位置获取 EJS_Runtime
            if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_WINDOW__) {
                // 尝试从微前端的 window 代理对象获取
                window.EJS_Runtime = window.__MICRO_APP_WINDOW__.EJS_Runtime;
            }

            // 如果还是获取不到，尝试从 proxyWindow 获取
            if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_PROXY_WINDOW__) {
                const proxyWindow = window.__MICRO_APP_PROXY_WINDOW__;
                if (proxyWindow.__MICRO_APP_WINDOW__ && proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime) {
                    window.EJS_Runtime = proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime;
                }
            }

            // 如果还是获取不到，尝试从 window.parent 获取
            if (typeof window.EJS_Runtime !== "function" && window.parent && window.parent.EJS_Runtime) {
                window.EJS_Runtime = window.parent.EJS_Runtime;
            }

            // 如果还是获取不到，尝试从 window.top 获取
            if (typeof window.EJS_Runtime !== "function" && window.top && window.top.EJS_Runtime) {
                window.EJS_Runtime = window.top.EJS_Runtime;
            }

            if (typeof window.EJS_Runtime !== "function") {
                this.emulator.startGameError("Failed to load runtime");
                return;
            }
            this.emulator.Module = window.EJS_Runtime(this.emulator);
            this.downloadFiles();
        })
        script.addEventListener("error", () => {
            this.emulator.startGameError("Failed to load core script");
        })
        document.head.appendChild(script);
    }

    /**
     * Download and initialize game files
     */
    async downloadFiles() {
        (async () => {
            this.emulator.gameManager = new window.EJS_GameManager(this.emulator.Module, this.emulator);
            await this.emulator.gameManager.loadExternalFiles();
            await this.emulator.gameManager.mountFileSystems();
            this.emulator.callEvent("saveDatabaseLoaded", this.emulator.gameManager.FS);
            if (this.emulator.getCore() === "ppsspp") {
                await this.emulator.gameManager.loadPpssppAssets();
            }
            await this.emulator.downloadRom();
            await this.emulator.downloadBios();
            await this.emulator.downloadStartState();
            await this.emulator.downloadGameParent();
            await this.emulator.downloadGamePatch();
            this.emulator.startGame();
        })();
    }

    async startGame() {
        if (this.emulator.started) return;
        this.emulator.started = true;
        this.emulator.callEvent("start");
    }

    checkStarted() {
        return new Promise(async (resolve) => {
            await this.emulator.sleep(10);
            if (this.emulator.gameManager && this.emulator.gameManager.isRunning && this.emulator.gameManager.isRunning()) {
                resolve();
            } else {
                this.checkStarted().then(resolve);
            }
        });
    }

    checkSupportedOpts() {
        return this.emulator.gameManager.supportedOpts || {};
    }

    getSavExt() {
        return this.emulator.saveFileExt;
    }

    restart() {
        this.emulator.callEvent("restart");
        this.emulator.gameManager.restart();
    }

    pause() {
        if (this.emulator.gameManager && this.emulator.gameManager.pause) {
            this.emulator.gameManager.pause();
            this.emulator.paused = true;
        }
    }

    play() {
        if (this.emulator.gameManager && this.emulator.gameManager.play) {
            this.emulator.gameManager.play();
            this.emulator.paused = false;
        }
    }

    fastForward() {
        this.emulator.isFastForward = !this.emulator.isFastForward;
        if (this.emulator.gameManager && this.emulator.gameManager.setFastForward) {
            this.emulator.gameManager.setFastForward(this.emulator.isFastForward);
        }
    }

    slowMotion() {
        this.emulator.isSlowMotion = !this.emulator.isSlowMotion;
        if (this.emulator.gameManager && this.emulator.gameManager.setSlowMotion) {
            this.emulator.gameManager.setSlowMotion(this.emulator.isSlowMotion);
        }
    }

    rewind() {
        if (this.emulator.gameManager && this.emulator.gameManager.rewind) {
            this.emulator.gameManager.rewind();
        }
    }

    quickSave(slot = "1") {
        if (this.emulator.gameManager && this.emulator.gameManager.quickSave && this.emulator.gameManager.quickSave(slot)) {
            this.emulator.displayMessage(this.emulator.localization("SAVED STATE TO SLOT") + " " + slot);
        } else {
            this.emulator.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
        }
    }

    quickLoad(slot = "1") {
        if (this.emulator.gameManager && this.emulator.gameManager.quickLoad) {
            this.emulator.gameManager.quickLoad(slot);
            this.emulator.displayMessage(this.emulator.localization("LOADED STATE FROM SLOT") + " " + slot);
        } else {
            this.emulator.displayMessage(this.emulator.localization("FAILED TO LOAD STATE"));
        }
    }

    getDiskCount() {
        if (this.emulator.gameManager && this.emulator.gameManager.getDiskCount) {
            return this.emulator.gameManager.getDiskCount();
        }
        return 1;
    }

    switchDisk(disk) {
        if (this.emulator.gameManager && this.emulator.gameManager.switchDisk) {
            this.emulator.gameManager.switchDisk(disk);
        }
    }

    getCoreInfo() {
        if (this.emulator.gameManager && this.emulator.gameManager.getCoreInfo) {
            return this.emulator.gameManager.getCoreInfo();
        }
        return {};
    }

    getGameManager() {
        return this.emulator.gameManager;
    }

    getModule() {
        return this.emulator.Module;
    }

    isRunning() {
        if (this.emulator.gameManager && this.emulator.gameManager.isRunning) {
            return this.emulator.gameManager.isRunning();
        }
        return false;
    }

    getGameState() {
        if (this.emulator.gameManager && this.emulator.gameManager.getGameState) {
            return this.emulator.gameManager.getGameState();
        }
        return null;
    }

    setGameOption(option, value) {
        if (this.emulator.gameManager && this.emulator.gameManager.setGameOption) {
            this.emulator.gameManager.setGameOption(option, value);
        }
    }

    getGameOption(option) {
        if (this.emulator.gameManager && this.emulator.gameManager.getGameOption) {
            return this.emulator.gameManager.getGameOption(option);
        }
        return null;
    }

    saveGameSettings() {
        if (this.emulator.gameManager && this.emulator.gameManager.saveGameSettings) {
            this.emulator.gameManager.saveGameSettings();
        }
    }

    loadGameSettings() {
        if (this.emulator.gameManager && this.emulator.gameManager.loadGameSettings) {
            this.emulator.gameManager.loadGameSettings();
        }
    }

    reset() {
        if (this.emulator.gameManager && this.emulator.gameManager.reset) {
            this.emulator.gameManager.reset();
        }
    }

    hardReset() {
        if (this.emulator.gameManager && this.emulator.gameManager.hardReset) {
            this.emulator.gameManager.hardReset();
        }
    }
}
