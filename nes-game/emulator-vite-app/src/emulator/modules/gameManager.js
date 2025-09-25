// 游戏管理模块 - 包含EJS_GameManager类的定义

class EJS_GameManager {
    constructor(Module, EJS) {
        this.EJS = EJS;
        this.Module = Module;
        this.FS = this.Module.FS;
        this.functions = {
            restart: this.Module.cwrap("system_restart", "", []),
            saveStateInfo: this.Module.cwrap("save_state_info", "string", []),
            loadState: this.Module.cwrap("load_state", "number", ["string", "number"]),
            screenshot: this.Module.cwrap("cmd_take_screenshot", "", []),
            simulateInput: this.Module.cwrap("simulate_input", "null", ["number", "number", "number"]),
            toggleMainLoop: this.Module.cwrap("toggleMainLoop", "null", ["number"]),
            getCoreOptions: this.Module.cwrap("get_core_options", "string", []),
            setVariable: this.Module.cwrap("ejs_set_variable", "null", ["string", "string"]),
            setCheat: this.Module.cwrap("set_cheat", "null", ["number", "number", "string"]),
            resetCheat: this.Module.cwrap("reset_cheat", "null", []),
            toggleShader: this.Module.cwrap("shader_enable", "null", ["number"]),
            getDiskCount: this.Module.cwrap("get_disk_count", "number", []),
            getCurrentDisk: this.Module.cwrap("get_current_disk", "number", []),
            setCurrentDisk: this.Module.cwrap("set_current_disk", "null", ["number"]),
            getSaveFilePath: this.Module.cwrap("save_file_path", "string", []),
            saveSaveFiles: this.Module.cwrap("cmd_savefiles", "", []),
            supportsStates: this.Module.cwrap("supports_states", "number", []),
            loadSaveFiles: this.Module.cwrap("refresh_save_files", "null", []),
            toggleFastForward: this.Module.cwrap("toggle_fastforward", "null", ["number"]),
            setFastForwardRatio: this.Module.cwrap("set_ff_ratio", "null", ["number"]),
            toggleRewind: this.Module.cwrap("toggle_rewind", "null", ["number"]),
            setRewindGranularity: this.Module.cwrap("set_rewind_granularity", "null", ["number"]),
            toggleSlowMotion: this.Module.cwrap("toggle_slow_motion", "null", ["number"]),
            setSlowMotionRatio: this.Module.cwrap("set_sm_ratio", "null", ["number"]),
            getFrameNum: this.Module.cwrap("get_current_frame_count", "number", [""]),
            setVSync: this.Module.cwrap("set_vsync", "null", ["number"]),
            setVideoRoation: this.Module.cwrap("set_video_rotation", "null", ["number"]),
            getVideoDimensions: this.Module.cwrap("get_video_dimensions", "number", ["string"]),
            setKeyboardEnabled: this.Module.cwrap("ejs_set_keyboard_enabled", "null", ["number"])
        }

        this.writeFile("/home/web_user/.config/retroarch/retroarch.cfg", this.getRetroArchCfg());

        this.writeConfigFile();
        this.initShaders();
        this.setupPreLoadSettings();

        this.EJS.on("exit", () => {
            if (!this.EJS.failedToStart) {
                this.saveSaveFiles();
                this.functions.restart();
                this.saveSaveFiles();
            }
            this.toggleMainLoop(0);
            this.FS.unmount("/data/saves");
            // 处理音频上下文，防止切换游戏后还有上一个游戏的声音
            try {
                if (this.Module && this.Module.AL && this.Module.AL.currentCtx && this.Module.AL.currentCtx.audioCtx) {
                    const audioContext = this.Module.AL.currentCtx.audioCtx;
                    if (audioContext.state !== 'closed') {
                        // 暂停音频上下文
                        audioContext.suspend();
                        // 或者直接关闭音频上下文
                        // audioContext.close();
                    }
                }
            } catch (e) {
                console.warn("Failed to suspend audio context:", e);
            }
            setTimeout(() => {
                try {
                    this.Module.abort();
                } catch (e) {
                    console.warn(e);
                };
            }, 1000);
        })
    }
    
    setupPreLoadSettings() {
        this.Module.callbacks.setupCoreSettingFile = (filePath) => {
            if (this.EJS.debug) console.log("Setting up core settings with path:", filePath);
            this.writeFile(filePath, this.EJS.getCoreSettings());
        }
    }
    
    mountFileSystems() {
        return new Promise(async resolve => {
            this.mkdir("/data");
            this.mkdir("/data/saves");
            this.FS.mount(this.FS.filesystems.IDBFS, { autoPersist: true }, "/data/saves");
            this.FS.syncfs(true, resolve);
        });
    }
    
    writeConfigFile() {
        if (!this.EJS.defaultCoreOpts.file || !this.EJS.defaultCoreOpts.settings) {
            return;
        }
        let output = "";
        for (const k in this.EJS.defaultCoreOpts.settings) {
            output += k + ' = "' + this.EJS.defaultCoreOpts.settings[k] + '"\n';
        }

        this.writeFile("/home/web_user/retroarch/userdata/config/" + this.EJS.defaultCoreOpts.file, output);
    }
    
    loadExternalFiles() {
        return new Promise(async (resolve, reject) => {
            if (this.EJS.config.externalFiles && this.EJS.config.externalFiles.constructor.name === "Object") {
                for (const key in this.EJS.config.externalFiles) {
                    await new Promise(done => {
                        this.EJS.downloadFile(this.EJS.config.externalFiles[key], null, true, { responseType: "arraybuffer", method: "GET" }).then(async (res) => {
                            if (res === -1) {
                                if (this.EJS.debug) console.warn("Failed to fetch file from '" + this.EJS.config.externalFiles[key] + "'. Make sure the file exists.");
                                return done();
                            }
                            let path = key;
                            if (key.trim().endsWith("/")) {
                                const invalidCharacters = /[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/ig;
                                let name = this.EJS.config.externalFiles[key].split("/").pop().split("#")[0].split("?")[0].replace(invalidCharacters, "").trim();
                                if (!name) return done();
                                const files = await this.EJS.checkCompression(new Uint8Array(res.data), this.EJS.localization("Decompress Game Assets"));
                                if (files["!!notCompressedData"]) {
                                    path += name;
                                } else {
                                    for (const k in files) {
                                        this.writeFile(path + k, files[k]);
                                    }
                                    return done();
                                }
                            }
                            try {
                                this.writeFile(path, res.data);
                            } catch (e) {
                                if (this.EJS.debug) console.warn("Failed to write file to '" + path + "'. Make sure there are no conflicting files.");
                            }
                            done();
                        });
                    })
                }
            }
            resolve();
        });
    }
    
    writeFile(path, data) {
        const parts = path.split("/");
        let current = "/";
        for (let i = 0; i < parts.length - 1; i++) {
            if (!parts[i].trim()) continue;
            current += parts[i] + "/";
            this.mkdir(current);
        }
        this.FS.writeFile(path, data);
    }
    
    mkdir(path) {
        try {
            this.FS.mkdir(path);
        } catch (e) { }
    }
    
    initShaders() {
        if (!this.EJS.config.shaders) return;
        this.mkdir("/shaders");
        for (let i = 0; i < this.EJS.config.shaders.length; i++) {
            this.FS.writeFile("/shaders/" + i + ".shader", this.EJS.config.shaders[i]);
        }
    }
    
    getRetroArchCfg() {
        let cfg = "";
        cfg += "autosave_interval = \"" + (this.EJS.config.autosave ? "60" : "0") + "\"\n";
        cfg += "screenshot_directory = \"/screenshots/\"\n";
        cfg += "block_sram_overwrite = \"false\"\n";
        cfg += "video_gpu_screenshot = \"false\"\n";
        cfg += "audio_latency = \"64\"\n";
        cfg += "video_top_portrait_viewport = \"true\"\n";
        cfg += "video_vsync = \"true\"\n";
        cfg += "video_smooth = \"" + (this.EJS.config.smooth ? "true" : "false") + "\"\n";
        cfg += "fastforward_ratio = \"3.0\"\n";
        cfg += "slowmotion_ratio = \"3.0\"\n";
        cfg += "rewind_granularity = \"6\"\n";
        cfg += "savefile_directory = \"/data/saves\"\n";
        return cfg;
    }
    
    clearEJSResetTimer() {
        if (this.EJS.resetTimeout) {
            clearTimeout(this.EJS.resetTimeout);
            this.EJS.resetTimeout = null;
        }
    }
    
    getState() {
        const state = this.functions.saveStateInfo().split("|");
        if (state[2] !== "1") {
            console.error(state[0]);
            throw new Error(state[0]);
        }
        const size = parseInt(state[0]);
        const dataStart = parseInt(state[1]);
        const data = this.Module.HEAPU8.subarray(dataStart, dataStart + size);
        return new Uint8Array(data);
    }
    
    loadState(state) {
        try {
            this.FS.unlink("game.state");
        } catch (e) { }
        this.FS.writeFile("/game.state", state);
        this.clearEJSResetTimer();
        this.functions.loadState("game.state", 0);
        setTimeout(() => {
            try {
                this.FS.unlink("game.state");
            } catch (e) { }
        }, 5000)
    }
    
    screenshot() {
        try {
            this.FS.unlink("screenshot.png");
        } catch (e) { }
        this.functions.screenshot();
        return new Promise(async resolve => {
            while (1) {
                try {
                    this.FS.stat("/screenshot.png");
                    return resolve(this.FS.readFile("/screenshot.png"));
                } catch (e) { }
                await new Promise(res => setTimeout(res, 50));
            }
        })
    }
    
    quickSave(slot) {
        if (!slot) slot = 1;
        let name = slot + "-quick.state";
        try {
            this.FS.unlink(name);
        } catch (e) { }
        try {
            let data = this.getState();
            this.FS.writeFile("/" + name, data);
        } catch (e) {
            return false;
        }
        return true;
    }
    
    quickLoad(slot) {
        if (!slot) slot = 1;
        (async () => {
            let name = slot + "-quick.state";
            this.clearEJSResetTimer();
            this.functions.loadState(name, 0);
        })();
    }
    
    simulateInput(player, index, value) {
        if (this.EJS.isNetplay) {
            this.EJS.netplay.simulateInput(player, index, value);
            return;
        }
        if ([24, 25, 26, 27, 28, 29].includes(index)) {
            if (index === 24 && value === 1) {
                const slot = this.EJS.settings["save-state-slot"] ? this.EJS.settings["save-state-slot"] : "1";
                if (this.quickSave(slot)) {
                    this.EJS.displayMessage(this.EJS.localization("SAVED STATE TO SLOT") + " " + slot);
                } else {
                    this.EJS.displayMessage(this.EJS.localization("FAILED TO SAVE STATE"));
                }
            }
            if (index === 25 && value === 1) {
                const slot = this.EJS.settings["save-state-slot"] ? this.EJS.settings["save-state-slot"] : "1";
                this.quickLoad(slot);
                this.EJS.displayMessage(this.EJS.localization("LOADED STATE FROM SLOT") + " " + slot);
            }
            if (index === 26 && value === 1) {
                let newSlot;
                try {
                    newSlot = parseFloat(this.EJS.settings["save-state-slot"] ? this.EJS.settings["save-state-slot"] : "1") + 1;
                } catch (e) {
                    newSlot = 1;
                }
                if (newSlot > 9) newSlot = 1;
                this.EJS.displayMessage(this.EJS.localization("SET SAVE STATE SLOT TO") + " " + newSlot);
                this.EJS.changeSettingOption("save-state-slot", newSlot.toString());
            }
            if (index === 27) {
                this.functions.toggleFastForward(this.EJS.isFastForward ? !value : value);
            }
            if (index === 29) {
                this.functions.toggleSlowMotion(this.EJS.isSlowMotion ? !value : value);
            }
            if (index === 28) {
                if (this.EJS.rewindEnabled) {
                    this.functions.toggleRewind(value);
                }
            }
            return;
        }
        this.functions.simulateInput(player, index, value);
    }
    
    getFileNames() {
        if (this.EJS.getCore() === "picodrive") {
            return ["bin", "gen", "smd", "md", "32x", "cue", "iso", "sms", "68k", "chd"];
        } else {
            return ["toc", "ccd", "exe", "pbp", "chd", "img", "bin", "iso"];
        }
    }
    
    createCueFile(fileNames) {
        try {
            if (fileNames.length > 1) {
                fileNames = fileNames.filter((item) => {
                    return this.getFileNames().includes(item.split(".").pop().toLowerCase());
                })
                fileNames = fileNames.sort((a, b) => {
                    if (isNaN(a.charAt()) || isNaN(b.charAt())) throw new Error("Incorrect file name format");
                    return (parseInt(a.charAt()) > parseInt(b.charAt())) ? 1 : -1;
                })
            }
        } catch (e) {
            if (fileNames.length > 1) {
                console.warn("Could not auto-create cue file(s).");
                return null;
            }
        }
        for (let i = 0; i < fileNames.length; i++) {
            if (fileNames[i].split(".").pop().toLowerCase() === "ccd") {
                console.warn("Did not auto-create cue file(s). Found a ccd.");
                return null;
            }
        }
        if (fileNames.length === 0) {
            console.warn("Could not auto-create cue file(s).");
            return null;
        }
        let baseFileName = fileNames[0].split("/").pop();
        if (baseFileName.includes(".")) {
            baseFileName = baseFileName.substring(0, baseFileName.length - baseFileName.split(".").pop().length - 1);
        }
        for (let i = 0; i < fileNames.length; i++) {
            const contents = " FILE \"" + fileNames[i] + "\" BINARY\n  TRACK 01 MODE1/2352\n   INDEX 01 00:00:00";
            this.FS.writeFile("/" + baseFileName + "-" + i + ".cue", contents);
        }
        if (fileNames.length > 1) {
            let contents = "";
            for (let i = 0; i < fileNames.length; i++) {
                contents += "/" + baseFileName + "-" + i + ".cue\n";
            }
            this.FS.writeFile("/" + baseFileName + ".m3u", contents);
        }
        return (fileNames.length === 1) ? baseFileName + "-0.cue" : baseFileName + ".m3u";
    }
    
    loadPpssppAssets() {
        return new Promise(resolve => {
            this.EJS.downloadFile("cores/ppsspp-assets.zip", null, false, { responseType: "arraybuffer", method: "GET" }).then((res) => {
                this.EJS.checkCompression(new Uint8Array(res.data), this.EJS.localization("Decompress Game Data")).then((pspassets) => {
                    if (pspassets === -1) {
                        this.EJS.textElem.innerText = this.localization("Network Error");
                        this.EJS.textElem.style.color = "red";
                        return;
                    }
                    this.mkdir("/PPSSPP");

                    for (const file in pspassets) {
                        const data = pspassets[file];
                        const path = "/PPSSPP/" + file;
                        const paths = path.split("/");
                        let cp = "";
                        for (let i = 0; i < paths.length - 1; i++) {
                            if (paths[i] === "") continue;
                            cp += "/" + paths[i];
                            if (!this.FS.analyzePath(cp).exists) {
                                this.FS.mkdir(cp);
                            }
                        }
                        if (!path.endsWith("/")) {
                            this.FS.writeFile(path, data);
                        }
                    }
                    resolve();
                })
            });
        })
    }
    
    setVSync(enabled) {
        this.functions.setVSync(enabled);
    }
    
    toggleMainLoop(playing) {
        this.functions.toggleMainLoop(playing);
    }
    
    getCoreOptions() {
        return this.functions.getCoreOptions();
    }
    
    setVariable(option, value) {
        this.functions.setVariable(option, value);
    }
    
    setCheat(index, enabled, code) {
        this.functions.setCheat(index, enabled, code);
    }
    
    resetCheat() {
        this.functions.resetCheat();
    }
    
    toggleShader(active) {
        this.functions.toggleShader(active);
    }
    
    getDiskCount() {
        return this.functions.getDiskCount();
    }
    
    getCurrentDisk() {
        return this.functions.getCurrentDisk();
    }
    
    setCurrentDisk(disk) {
        this.functions.setCurrentDisk(disk);
    }
    
    getSaveFilePath() {
        return this.functions.getSaveFilePath();
    }
    
    saveSaveFiles() {
        this.functions.saveSaveFiles();
        this.EJS.callEvent("saveSaveFiles", this.getSaveFile(false));
        //this.FS.syncfs(false, () => {});
    }
    
    supportsStates() {
        return !!this.functions.supportsStates();
    }
    
    getSaveFile(save) {
        if (save !== false) {
            this.saveSaveFiles();
        }
        const exists = this.FS.analyzePath(this.getSaveFilePath()).exists;
        return (exists ? this.FS.readFile(this.getSaveFilePath()) : null);
    }
    
    loadSaveFiles() {
        this.clearEJSResetTimer();
        this.functions.loadSaveFiles();
    }
    
    setFastForwardRatio(ratio) {
        this.functions.setFastForwardRatio(ratio);
    }
    
    toggleFastForward(active) {
        this.functions.toggleFastForward(active);
    }
    
    setSlowMotionRatio(ratio) {
        this.functions.setSlowMotionRatio(ratio);
    }
    
    toggleSlowMotion(active) {
        this.functions.toggleSlowMotion(active);
    }
    
    setRewindGranularity(value) {
        this.functions.setRewindGranularity(value);
    }
    
    getFrameNum() {
        return this.functions.getFrameNum();
    }
    
    setVideoRotation(rotation) {
        this.functions.setVideoRoation(rotation);
    }
    
    getVideoDimensions(type) {
        try {
            return this.functions.getVideoDimensions(type);
        } catch (e) {
            console.warn(e);
        }
    }
    
    setKeyboardEnabled(enabled) {
        this.functions.setKeyboardEnabled(enabled === true ? 1 : 0);
    }
    
    setAltKeyEnabled(enabled) {
        this.functions.setKeyboardEnabled(enabled === true ? 3 : 2);
    }
}

// 导出EJS_GameManager类
export { EJS_GameManager };

export function startGame() {
    try {
        const args = [];
        if (this.debug) args.push("-v");
        args.push("/" + this.fileName);
        if (this.debug) console.log(args);
        this.Module.callMain(args);
        if (typeof this.config.softLoad === "number" && this.config.softLoad > 0) {
            this.resetTimeout = setTimeout(() => {
                this.gameManager.restart();
            }, this.config.softLoad * 1000);
        }
        this.Module.resumeMainLoop();
        this.checkSupportedOpts();
        this.setupDisksMenu();
        // hide the disks menu if the disk count is not greater than 1
        if (!(this.gameManager.getDiskCount() > 1)) {
            this.diskParent.style.display = "none";
        }
        this.setupSettingsMenu();
        this.loadSettings();
        this.updateCheatUI();
        this.updateGamepadLabels();
        if (!this.muted) this.setVolume(this.volume);
        if (this.config.noAutoFocus !== true) this.elements.parent.focus();
        this.textElem.remove();
        this.textElem = null;
        this.game.classList.remove("ejs_game");
        this.game.classList.add("ejs_canvas_parent");
        this.game.appendChild(this.canvas);
        this.handleResize();
        this.started = true;
        this.paused = false;
        if (this.touch) {
            this.virtualGamepad.style.display = "";
        }
        this.handleResize();
        if (this.config.fullscreenOnLoad) {
            try {
                this.toggleFullscreen(true);
            } catch (e) {
                if (this.debug) console.warn("Could not fullscreen on load");
            }
        }
        this.menu.open();
        if (this.isSafari && this.isMobile) {
            //Safari is --- funny
            this.checkStarted();
        }
    } catch (e) {
        console.warn("Failed to start game", e);
        this.startGameError(this.localization("Failed to start game"));
        this.callEvent("exit");
        return;
    }
    this.callEvent("start");
}

export function destroy() {
    console.log("Destroying emulator instance");
    if (!this.started) return;
    this.callEvent("exit");
    
    // 清理资源
    if (this.Module) {
        // 暂停主循环
        if (this.Module.pauseMainLoop) {
            this.Module.pauseMainLoop();
        }
        
        // 清理游戏管理器资源
        if (this.gameManager) {
            try {
                // 退出文件系统
                if (this.gameManager.FS) {
                    this.gameManager.FS.quit();
                }
            } catch (e) {
                console.warn("Error unmounting file systems:", e);
            }
        }
    }
    
    // 停止正在进行的录制
    if (this.recorder && this.recorder.state === "recording") {
        this.recorder.stop();
    }
    
    // 清理事件监听器
    if (this._eventListeners) {
        for (let i = 0; i < this._eventListeners.length; i++) {
            const listener = this._eventListeners[i];
            listener.elem.removeEventListener(listener.listener, listener.cb);
        }
    }
    
    // 清理定时器
    if (this._timers) {
        for (let i = 0; i < this._timers.length; i++) {
            clearTimeout(this._timers[i]);
        }
    }
    
    // 清理间隔
    if (this._intervals) {
        for (let i = 0; i < this._intervals.length; i++) {
            clearInterval(this._intervals[i]);
        }
    }
    
    // 移除创建的元素
    if (this.game) {
        this.game.innerHTML = "";
    }
    
    // 重置状态变量
    this.started = false;
    this.fileName = null;
    
    console.log('EmulatorJS instance destroyed');
}

export async function switchGame(config) {
    console.log("Switching game with config:", config);
    
    // 确保模拟器已初始化
    if (!this.Module) {
        console.error("Cannot switch game: Emulator core not initialized");
        return Promise.reject("Emulator core not initialized");
    }
    
    try {
        // 暂停当前游戏
        if (this.Module && this.Module.pauseMainLoop) {
            this.Module.pauseMainLoop();
        }
        
        // 更新配置参数
        if (config.gameUrl) this.config.gameUrl = config.gameUrl;
        if (config.gameName) this.config.gameName = config.gameName;
        if (config.biosUrl) this.config.biosUrl = config.biosUrl;
        if (config.gamePatchUrl) this.config.gamePatchUrl = config.gamePatchUrl;
        if (config.gameParentUrl) this.config.gameParentUrl = config.gameParentUrl;
        
        // 显示加载界面
        if (this.textElem) {
            this.textElem.innerText = this.localization("Loading new game...");
        } else {
            this.createText();
            this.textElem.innerText = this.localization("Loading new game...");
        }
        
        // 清理当前游戏状态
        if (this.gameManager) {
            // 重启游戏管理器以清理旧游戏状态
            this.gameManager.restart();
            
            // 清理可能存在的旧游戏文件
            this.gameManager.cleanupGameFiles();
        }
        
        // 重新下载游戏文件并启动
        await this.downloadFiles();
        
        return Promise.resolve();
    } catch (error) {
        console.error("Error switching game:", error);
        this.startGameError(this.localization("Failed to switch game"));
        return Promise.reject(error);
    }
}

// ... other game management methods ...