/**
 * EmulatorJS Game Manager Module
 * 处理游戏生命周期、状态保存/加载等功能
 */

export class GameManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.gameManager = null;
    }

    /**
     * 初始化游戏核心
     */
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
            // 如果是字符串，则直接替换
            modifiedJs = js.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
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

            this.emulator.initModule(wasm, thread);
        });
        document.body.appendChild(script);
    }

    /**
     * 开始游戏
     */
    startGame() {
        try {
            const args = [];
            if (this.emulator.debug) args.push("-v");
            args.push("/" + this.emulator.fileName);
            if (this.emulator.debug) console.log(args);
            this.emulator.Module.callMain(args);
            if (typeof this.emulator.config.softLoad === "number" && this.emulator.config.softLoad > 0) {
                this.emulator.resetTimeout = setTimeout(() => {
                    this.restart();
                }, this.emulator.config.softLoad * 1000);
            }
            this.emulator.Module.resumeMainLoop();
            this.emulator.checkSupportedOpts();
            this.setupDisksMenu();
            // hide the disks menu if the disk count is not greater than 1
            if (!(this.getDiskCount() > 1)) {
                this.emulator.diskParent.style.display = "none";
            }
            this.emulator.setupSettingsMenu();
            this.emulator.loadSettings();
            this.emulator.updateCheatUI();
            this.emulator.updateGamepadLabels();
            if (!this.emulator.muted) this.emulator.setVolume(this.emulator.volume);
            if (this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
            this.emulator.textElem.remove();
            this.emulator.textElem = null;
            this.emulator.game.classList.remove("ejs_game");
            this.emulator.game.classList.add("ejs_canvas_parent");
            this.emulator.game.appendChild(this.emulator.canvas);
            this.emulator.handleResize();
            this.emulator.started = true;
            this.emulator.paused = false;
            if (this.emulator.touch) {
                this.emulator.virtualGamepad.style.display = "";
            }
            this.emulator.handleResize();
            if (this.emulator.config.fullscreenOnLoad) {
                try {
                    this.emulator.toggleFullscreen(true);
                } catch (e) {
                    if (this.emulator.debug) console.warn("Could not fullscreen on load");
                }
            }
            this.emulator.menu.open();
            if (this.emulator.isSafari && this.emulator.isMobile) {
                //Safari is --- funny
                this.emulator.checkStarted();
            }
        } catch (e) {
            console.warn("Failed to start game", e);
            this.emulator.startGameError(this.emulator.localization("Failed to start game"));
            this.emulator.callEvent("exit");
            return;
        }
        this.emulator.callEvent("start");
    }

    /**
     * 重新启动游戏
     */
    restart() {
        if (this.gameManager && this.gameManager.restart) {
            this.gameManager.restart();
        }
    }

    /**
     * 获取磁盘数量
     */
    getDiskCount() {
        if (this.gameManager && typeof this.gameManager.getDiskCount === 'function') {
            return this.gameManager.getDiskCount();
        }
        return 0;
    }

    /**
     * 设置磁盘菜单
     */
    setupDisksMenu() {
        // 磁盘菜单设置逻辑
        if (this.gameManager && this.gameManager.setupDisksMenu) {
            this.gameManager.setupDisksMenu();
        }
    }

    /**
     * 保存游戏状态
     */
    quickSave(slot) {
        if (this.gameManager && typeof this.gameManager.quickSave === 'function') {
            return this.gameManager.quickSave(slot);
        }
        return false;
    }

    /**
     * 加载游戏状态
     */
    quickLoad(slot) {
        if (this.gameManager && typeof this.gameManager.quickLoad === 'function') {
            this.gameManager.quickLoad(slot);
        }
    }

    /**
     * 获取游戏状态
     */
    getState() {
        if (this.gameManager && typeof this.gameManager.getState === 'function') {
            return this.gameManager.getState();
        }
        return null;
    }

    /**
     * 加载游戏状态
     */
    loadState(state) {
        if (this.gameManager && typeof this.gameManager.loadState === 'function') {
            this.gameManager.loadState(state);
        }
    }

    /**
     * 检查是否支持状态保存
     */
    supportsStates() {
        if (this.gameManager && typeof this.gameManager.supportsStates === 'function') {
            return this.gameManager.supportsStates();
        }
        return false;
    }

    /**
     * 模拟输入
     */
    simulateInput(player, button, value) {
        if (this.gameManager && typeof this.gameManager.simulateInput === 'function') {
            this.gameManager.simulateInput(player, button, value);
        }
    }

    /**
     * 设置作弊码
     */
    setCheat(index, enabled, code) {
        if (this.gameManager && typeof this.gameManager.setCheat === 'function') {
            this.gameManager.setCheat(index, enabled, code);
        }
    }

    /**
     * 重置作弊码
     */
    resetCheat() {
        if (this.gameManager && typeof this.gameManager.resetCheat === 'function') {
            this.gameManager.resetCheat();
        }
    }

    /**
     * 保存游戏存档
     */
    saveSaveFiles() {
        if (this.gameManager && typeof this.gameManager.saveSaveFiles === 'function') {
            this.gameManager.saveSaveFiles();
        }
    }

    /**
     * 加载游戏存档
     */
    loadSaveFiles() {
        if (this.gameManager && typeof this.gameManager.loadSaveFiles === 'function') {
            this.gameManager.loadSaveFiles();
        }
    }

    /**
     * 获取保存文件路径
     */
    getSaveFilePath() {
        if (this.gameManager && typeof this.gameManager.getSaveFilePath === 'function') {
            return this.gameManager.getSaveFilePath();
        }
        return "game.srm";
    }

    /**
     * 获取保存文件
     */
    getSaveFile() {
        if (this.gameManager && typeof this.gameManager.getSaveFile === 'function') {
            return this.gameManager.getSaveFile();
        }
        return null;
    }

    /**
     * 切换主循环
     */
    toggleMainLoop(paused) {
        if (this.gameManager && typeof this.gameManager.toggleMainLoop === 'function') {
            this.gameManager.toggleMainLoop(paused);
        }
    }

    /**
     * 获取视频尺寸
     */
    getVideoDimensions(type) {
        if (this.gameManager && typeof this.gameManager.getVideoDimensions === 'function') {
            return this.gameManager.getVideoDimensions(type);
        }
        return type === "aspect" ? 1.333333 : (type === "width" ? 256 : 224);
    }

    /**
     * 截图
     */
    screenshot() {
        if (this.gameManager && typeof this.gameManager.screenshot === 'function') {
            return this.gameManager.screenshot();
        }
        return null;
    }

    /**
     * 切换着色器
     */
    toggleShader(enabled) {
        if (this.gameManager && typeof this.gameManager.toggleShader === 'function') {
            this.gameManager.toggleShader(enabled);
        }
    }

    /**
     * 录制屏幕
     */
    screenRecord() {
        // 屏幕录制逻辑
        return {
            stop: () => {
                // 停止录制逻辑
            }
        };
    }
}
