// 核心模块 - 包含EmulatorJS类的基本定义和核心功能

export class EmulatorJS {
    constructor(element, config) {
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.initControlVars();
        this.debug = (window.EJS_DEBUG_XX === true);
        // if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);
        this.config.settingsLanguage = window.EJS_settingsLanguage || false;
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];
        
        // 处理element参数，支持DOM元素和CSS选择器字符串
        this.setElements(element);
        
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }
        
        // 移除重复的isMobile属性设置，只保留getter
        this.hasTouchScreen = (function () {
            if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
                if (navigator.maxTouchPoints > 0) {
                    return true;
                }
            } else {
                if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                    return true;
                } else if (window.TouchEvent || ("ontouchstart" in window)) {
                    return true;
                }
            }
            return false;
        })();
        this.canvas = this.createElement("canvas");
        this.canvas.classList.add("ejs_canvas");
        this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
        this.videoRotationChanged = false;
        this.capture = this.capture || {};
        this.capture.photo = this.capture.photo || {};
        this.capture.photo.source = ["canvas", "retroarch"].includes(this.capture.photo.source) ? this.capture.photo.source : "canvas";
        this.capture.photo.format = (typeof this.capture.photo.format === "string") ? this.capture.photo.format : "png";
        this.capture.photo.upscale = (typeof this.capture.photo.upscale === "number") ? this.capture.photo.upscale : 1;
        this.capture.video = this.capture.video || {};
        this.capture.video.format = (typeof this.capture.video.format === "string") ? this.capture.video.format : "detect";
        this.capture.video.upscale = (typeof this.capture.video.upscale === "number") ? this.capture.video.upscale : 1;
        this.capture.video.fps = (typeof this.capture.video.fps === "number") ? this.capture.video.fps : 30;
        this.capture.video.videoBitrate = (typeof this.capture.video.videoBitrate === "number") ? this.capture.video.videoBitrate : 2.5 * 1024 * 1024;
        this.capture.video.audioBitrate = (typeof this.capture.video.audioBitrate === "number") ? this.capture.video.audioBitrate : 192 * 1024;
        this.bindListeners();
        this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
        this.fullscreen = false;
        this.enableMouseLock = false;
        this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
        this.webgl2Enabled = (() => {
            let setting = this.preGetSetting("webgl2Enabled");
            if (setting === "disabled" || !this.supportsWebgl2) {
                return false;
            } else if (setting === "enabled") {
                return true;
            }
            return null;
        })();
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

        this.game.classList.add("ejs_game");
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }

        if (Array.isArray(this.config.cheats)) {
            for (let i = 0; i < this.config.cheats.length; i++) {
                const cheat = this.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }

        this.createStartButton();
        this.handleResize();
    }
    
    setElements(element) {
        const game = this.createElement("div");
        let elem;
        // 处理element参数，支持DOM元素和CSS选择器字符串
        if (typeof element === "string") {
            // 如果是CSS选择器字符串，则查找对应的DOM元素
            elem = document.querySelector(element);
            if (!elem) {
                throw new Error(`Element with selector '${element}' not found`);
            }
        } else if (element instanceof HTMLElement) {
            // 如果已经是DOM元素，则直接使用
            elem = element;
        } else {
            throw new Error("Invalid element parameter. Expected a DOM element or CSS selector string.");
        }
        
        elem.innerHTML = "";
        elem.appendChild(game);
        this.game = game;

        this.elements = {
            main: this.game,
            parent: elem
        }
        this.elements.parent.classList.add("ejs_parent");
        this.elements.parent.setAttribute("tabindex", -1);
    }
    
    destory() {
        if (!this.started) return;
        this.callEvent("exit");
    }
    
    getCores() {
        let rv = {
            "atari5200": ["a5200"],
            "vb": ["beetle_vb"],
            "nds": ["melonds", "desmume", "desmume2015"],
            "arcade": ["fbneo", "fbalpha2012_cps1", "fbalpha2012_cps2"],
            "nes": ["fceumm", "nestopia"],
            "gb": ["gambatte"],
            "coleco": ["gearcoleco"],
            "segaMS": ["smsplus", "genesis_plus_gx", "picodrive"],
            "segaMD": ["genesis_plus_gx", "picodrive"],
            "segaGG": ["genesis_plus_gx"],
            "segaCD": ["genesis_plus_gx", "picodrive"],
            "sega32x": ["picodrive"],
            "sega": ["genesis_plus_gx", "picodrive"],
            "lynx": ["handy"],
            "mame": ["mame2003_plus", "mame2003"],
            "ngp": ["mednafen_ngp"],
            "pce": ["mednafen_pce"],
            "pcfx": ["mednafen_pcfx"],
            "psx": ["pcsx_rearmed", "mednafen_psx_hw"],
            "ws": ["mednafen_wswan"],
            "gba": ["mgba"],
            "n64": ["mupen64plus_next", "parallel_n64"],
            "3do": ["opera"],
            "psp": ["ppsspp"],
            "atari7800": ["prosystem"],
            "snes": ["snes9x"],
            "atari2600": ["stella2014"],
            "jaguar": ["virtualjaguar"],
            "segaSaturn": ["yabause"],
            "amiga": ["puae"],
            "c64": ["vice_x64sc"],
            "c128": ["vice_x128"],
            "pet": ["vice_xpet"],
            "plus4": ["vice_xplus4"],
            "vic20": ["vice_xvic"],
            "dos": ["dosbox_pure"]
        };
        if (this.isSafari && this.isMobile) {
            rv.n64 = rv.n64.reverse();
        }
        return rv;
    }
    
    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }
    
    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }
    
    getCore(generic) {
        const cores = this.getCores();
        const core = this.config.system;
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
            return core;
        }
        const gen = this.getCore(true);
        if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
            return this.preGetSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return core;
    }
    
    createElement(type) {
        return document.createElement(type);
    }
    
    addEventListener(element, listener, callback) {
        const listeners = listener.split(" ");
        let rv = [];
        for (let i = 0; i < listeners.length; i++) {
            element.addEventListener(listeners[i], callback);
            const data = { cb: callback, elem: element, listener: listeners[i] };
            rv.push(data);
            // 将监听器添加到跟踪数组中
            if (!this._eventListeners) this._eventListeners = [];
            this._eventListeners.push(data);
        }
        return rv;
    }
    
    removeEventListener(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].elem.removeEventListener(data[i].listener, data[i].cb);
        }
    }
    
    downloadFile(path, progressCB, notWithPath, opts) {
        return new Promise(async cb => {
            const fileData = this.toData(path); //check other data types
            if (fileData) {
                fileData.then((game) => {
                    if (opts && opts.method === "HEAD") {
                        cb({ headers: {} });
                    } else {
                        cb({ headers: {}, data: game });
                    }
                })
                return;
            }
            const basePath = notWithPath ? "" : this.config.dataPath;
            path = basePath + path;
            if (!notWithPath && this.config.filePaths && typeof this.config.filePaths[path.split("/").pop()] === "string") {
                path = this.config.filePaths[path.split("/").pop()];
            }
            let url;
            try { url = new URL(path) } catch (e) { };
            if (url && !["http:", "https:"].includes(url.protocol)) {
                //Most commonly blob: urls. Not sure what else it could be
                if (opts && opts.method === "HEAD") {
                    cb({ headers: {} });
                    return;
                }
                try {
                    let res = await fetch(path)
                    if ((opts && opts.type && opts.type.toLowerCase() === "arraybuffer") || !(opts && opts.type)) {
                        res = await res.arrayBuffer();
                    } else {
                        res = await res.text();
                        try { res = JSON.parse(res) } catch (e) { }
                    }
                    if (path.startsWith("blob:")) URL.revokeObjectURL(path);
                    cb({ data: res, headers: {} });
                } catch (e) {
                    cb(-1);
                }
                return;
            }
            const xhr = new XMLHttpRequest();
            if (progressCB instanceof Function) {
                xhr.addEventListener("progress", (e) => {
                    const progress = e.total ? " " + Math.floor(e.loaded / e.total * 100).toString() + "%" : " " + (e.loaded / 1048576).toFixed(2) + "MB";
                    progressCB(progress);
                });
            }
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    let data = xhr.response;
                    if (xhr.status.toString().startsWith("4") || xhr.status.toString().startsWith("5")) {
                        cb(-1);
                        return;
                    }
                    try { data = JSON.parse(data) } catch (e) { }
                    if (data instanceof ArrayBuffer) {
                        data = new Uint8Array(data);
                    }
                    cb({ data, headers: xhr.getAllResponseHeaders() });
                }
            };
            xhr.onerror = function () {
                cb(-1);
            };
            if (opts && opts.responseType) {
                xhr.responseType = opts.responseType;
            } else {
                xhr.responseType = "arraybuffer";
            }
            if (opts && opts.method) {
                xhr.open(opts.method, path);
            } else {
                xhr.open("GET", path);
            }
            xhr.send();
        });
    }
    
    toData(path, checkOnly) {
        if (path === undefined) return false;
        if (this.config.locateFile) {
            const test = this.config.locateFile(path);
            if (test) path = test;
        }
        if (typeof path === "string") {
            if (path.startsWith("data:")) {
                if (checkOnly) return true;
                return new Promise(async (resolve) => {
                    const dataUrl = path;
                    const data = dataUrl.split(",")[1];
                    const binary = atob(data);
                    const array = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        array[i] = binary.charCodeAt(i);
                    }
                    resolve(array.buffer);
                });
            }
            if (path.startsWith("blob:")) {
                if (checkOnly) return true;
                return new Promise(async (resolve) => {
                    const response = await fetch(path);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsArrayBuffer(blob);
                });
            }
        } else if (path instanceof File) {
            if (checkOnly) return true;
            return new Promise(async (resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsArrayBuffer(path);
            });
        } else if (path instanceof Uint8Array) {
            if (checkOnly) return true;
            return new Promise(async (resolve) => {
                resolve(path.buffer);
            });
        } else if (path instanceof ArrayBuffer) {
            if (checkOnly) return true;
            return new Promise(async (resolve) => {
                resolve(path);
            });
        }
        if (checkOnly) return false;
        return false;
    }
    
    checkCompression(data, message, callback) {
        // 简化的压缩检查实现
        if (callback) {
            callback("game.file", data);
        }
        return Promise.resolve({ "game.file": data });
    }
    
    callEvent(event, data) {
        // 简单的事件调用实现
        console.log("Event called:", event, data);
    }
    
    createText() {
        if (!this.textElem) {
            this.textElem = this.createElement("div");
            this.textElem.classList.add("ejs_text");
            this.game.appendChild(this.textElem);
        }
    }
    
    localization(key) {
        // 简单的本地化实现
        const translations = {
            "Download Game Data": "Download Game Data",
            "Loading new game...": "Loading new game...",
            "Loading new game files...": "Loading new game files...",
            "Network Error": "Network Error",
            "Error processing game data": "Error processing game data",
            "Failed to switch game": "Failed to switch game",
            "Error downloading game files": "Error downloading game files",
            "Failed to start game": "Failed to start game",
            "Download Game Core": "Download Game Core",
            "Decompress Game Core": "Decompress Game Core",
            "Outdated EmulatorJS version": "Outdated EmulatorJS version",
            "Error loading EmulatorJS runtime": "Error loading EmulatorJS runtime",
            "Outdated graphics driver": "Outdated graphics driver",
            "Error for site owner": "Error for site owner",
            "Check console": "Check console",
            "SAVED STATE TO SLOT": "SAVED STATE TO SLOT",
            "FAILED TO SAVE STATE": "FAILED TO SAVE STATE",
            "LOADED STATE FROM SLOT": "LOADED STATE FROM SLOT",
            "Screenshot": "Screenshot",
            "Start Screen Recording": "Start Screen Recording",
            "Stop Screen Recording": "Stop Screen Recording",
            "Quick Save": "Quick Save",
            "Quick Load": "Quick Load",
            "Play/Pause": "Play/Pause",
            "Restart": "Restart",
            "Mute": "Mute",
            "Unmute": "Unmute",
            "Fullscreen": "Fullscreen",
            "Save State": "Save State",
            "Load State": "Load State",
            "Netplay": "Netplay",
            "Save Sav Files": "Save Sav Files",
            "Load Sav Files": "Load Sav Files",
            "Settings": "Settings"
        };
        return translations[key] || key;
    }
    
    saveInBrowserSupported() {
        return !!window.indexedDB;
    }
    
    get isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    
    get isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    preGetSetting(key) {
        // 简单实现
        return null;
    }
    
    versionAsInt(version) {
        // 将版本号转换为整数进行比较
        const parts = version.split('.');
        let result = 0;
        for (let i = 0; i < parts.length; i++) {
            result = result * 1000 + parseInt(parts[i]);
        }
        return result;
    }
    
    screenshot(callback) {
        // 截图功能
        if (!this.canvas) {
            console.warn("Canvas not available for screenshot");
            return;
        }
        
        this.canvas.toBlob((blob) => {
            callback(blob, "png");
        }, "image/png");
    }
    
    screenRecord() {
        // 屏幕录制功能
        if (!this.capture || !this.capture.video) {
            console.warn("Screen capture not available");
            return null;
        }

        const captureFps = this.getSettingValue("screenRecordingFPS") || this.capture.video.fps;
        const captureFormat = this.getSettingValue("screenRecordFormat") || this.capture.video.format;
        const captureUpscale = this.getSettingValue("screenRecordUpscale") || this.capture.video.upscale;
        const captureVideoBitrate = this.getSettingValue("screenRecordVideoBitrate") || this.capture.video.videoBitrate;
        const captureAudioBitrate = this.getSettingValue("screenRecordAudioBitrate") || this.capture.video.audioBitrate;
        const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
        const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        
        let width = 800;
        let height = 600;
        let frameAspect = this.canvas.width / this.canvas.height;
        let canvasAspect = width / height;
        let offsetX = 0;
        let offsetY = 0;

        // 计算录制画布尺寸
        if (frameAspect > canvasAspect) {
            height = width / frameAspect;
            offsetY = (600 - height) / 2;
        } else {
            width = height * frameAspect;
            offsetX = (800 - width) / 2;
        }

        // 创建录制画布
        const captureCanvas = this.createElement("canvas");
        captureCanvas.width = 800 * captureUpscale;
        captureCanvas.height = 600 * captureUpscale;
        captureCanvas.style.display = "none";
        this.elements.parent.appendChild(captureCanvas);

        const ctx = captureCanvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);

        // 缩放和绘制主画布内容
        const scale = captureUpscale;
        ctx.scale(scale, scale);
        ctx.translate(offsetX, offsetY);

        // 动画循环
        let animation = true;
        let chunks = [];
        let lastFrameTime = 0;

        const draw = (timestamp) => {
            if (!animation) return;

            // 控制帧率
            if (timestamp - lastFrameTime >= (1000 / captureFps)) {
                lastFrameTime = timestamp;
                ctx.clearRect(0, 0, 800, 600);
                ctx.drawImage(this.canvas, 0, 0, 800, 600);
            }

            requestAnimationFrame(draw);
        };

        requestAnimationFrame(draw);

        // 创建媒体录制器
        const stream = captureCanvas.captureStream(captureFps);
        const options = {
            mimeType: `video/${captureFormat};codecs=vp9`,
            videoBitsPerSecond: captureVideoBitrate,
            audioBitsPerSecond: captureAudioBitrate
        };

        const recorder = new MediaRecorder(stream, options);
        
        recorder.addEventListener("dataavailable", e => {
            chunks.push(e.data);
        });
        
        recorder.addEventListener("stop", () => {
            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            const date = new Date();
            const a = document.createElement("a");
            a.href = url;
            a.download = this.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + "." + captureFormat;
            a.click();

            animation = false;
            captureCanvas.remove();
        });
        
        recorder.start();

        // 存储录制器引用以便清理
        this.recorder = recorder;

        return recorder;
    }
    
    displayMessage(message, time) {
        // 显示消息
        if (!this.msgElem) {
            this.msgElem = this.createElement("div");
            this.msgElem.classList.add("ejs_message");
            this.elements.parent.appendChild(this.msgElem);
        }
        
        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(() => {
            this.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000);
        
        this.msgElem.innerText = message;
    }
    
    selectFile(accept) {
        // 选择文件
        return new Promise((resolve) => {
            const input = this.createElement("input");
            input.type = "file";
            if (accept) {
                input.accept = accept;
            }
            input.onchange = (e) => {
                resolve(e.target.files[0]);
            };
            input.click();
        });
    }
    
    saveAs(blob, filename) {
        // 保存文件
        const url = URL.createObjectURL(blob);
        const a = this.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    handleResize() {
        // 处理窗口大小调整
        if (!this.canvas) return;
        
        const parent = this.elements.parent;
        const canvas = this.canvas;
        
        // 获取父元素的尺寸
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        
        // 计算宽高比
        const aspectRatio = this.gameManager ? this.gameManager.getVideoDimensions("aspect") : (4/3);
        
        // 根据父元素尺寸和宽高比计算canvas尺寸
        let width, height;
        if (parentWidth / parentHeight > aspectRatio) {
            height = parentHeight;
            width = height * aspectRatio;
        } else {
            width = parentWidth;
            height = width / aspectRatio;
        }
        
        // 设置canvas尺寸
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        
        // 居中显示
        canvas.style.marginLeft = ((parentWidth - width) / 2) + "px";
        canvas.style.marginTop = ((parentHeight - height) / 2) + "px";
    }
    
    toggleFullscreen(force) {
        // 切换全屏模式
        const element = this.elements.parent;
        
        if (force === true || (force !== false && !document.fullscreenElement)) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    setVolume(volume) {
        // 设置音量
        this.volume = volume;
        if (this.Module && this.Module.setVolume) {
            this.Module.setVolume(volume);
        }
    }
    
    getSettingValue(key) {
        // 获取设置值
        console.log("Getting setting value for key:", key);
        // 获取设置值的具体实现
        return null;
    }
    
    checkSupportedOpts() {
        if (!this.gameManager.supportsStates()) {
            this.elements.bottomBar.saveState[0].style.display = "none";
            this.elements.bottomBar.loadState[0].style.display = "none";
            this.elements.bottomBar.netplay[0].style.display = "none";
            this.elements.contextMenu.save.style.display = "none";
            this.elements.contextMenu.load.style.display = "none";
        }
        if (typeof this.config.gameId !== "number" || !this.config.netplayUrl || this.netplayEnabled === false) {
            this.elements.bottomBar.netplay[0].style.display = "none";
        }
    }
    
    // 添加缺失的方法
    initControlVars() {
        // 初始化控制变量
        this.defaultControllers = {};
        this.controls = {};
        this.gamepadLabels = [];
        this.gamepadSelection = [];
    }
    
    buildButtonOptions(buttonOpts) {
        // 构建按钮选项
        return buttonOpts || {};
    }
    
    preGetSetting(setting) {
        // 预获取设置
        return null;
    }
    
    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            color = color.toLowerCase();
            if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
                if (color.length === 4) {
                    let rv = "#";
                    for (let i = 1; i < 4; i++) {
                        rv += color.slice(i, i + 1) + color.slice(i, i + 1);
                    }
                    color = rv;
                }
                let rv = [];
                for (let i = 1; i < 7; i += 2) {
                    rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
                }
                return rv.join(", ");
            }
            return null;
        }
        if (!color || getColor(color) === null) {
            this.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
            return;
        }
        this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
    }
    
    setupAds(ads, width, height) {
        // 广告设置
        console.log("Setup ads:", ads, width, height);
    }
    
    bindListeners() {
        // 绑定监听器
        console.log("Bind listeners");
    }
    
    createStartButton() {
        // 创建开始按钮
        const button = this.createElement("div");
        button.classList.add("ejs_start_button");
        let border = 0;
        if (typeof this.config.backgroundImg === "string") {
            button.classList.add("ejs_start_button_border");
            border = 1;
        }
        button.innerText = (typeof this.config.startBtnName === "string") ? this.config.startBtnName : this.localization("Start Game");
        if (this.config.alignStartButton == "top") {
            button.style.bottom = "calc(100% - 20px)";
        } else if (this.config.alignStartButton == "center") {
            button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
        }
        this.elements.parent.appendChild(button);
        this.addEventListener(button, "touchstart", () => {
            this.touch = true;
        })
        this.addEventListener(button, "click", this.startButtonClicked.bind(this));
        if (this.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.callEvent("ready");
        }, 20);
    }
    
    startButtonClicked(e) {
        this.callEvent("start-clicked");
        if (e.pointerType === "touch") {
            this.touch = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
            e.target.remove();
        } else {
            e.remove();
        }
        this.createText();
        this.downloadGameCore();
    }
    
    createText() {
        // 创建文本元素
        this.textElem = this.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
    }
    
    localization(text, log) {
        if (typeof text === "undefined" || text.length === 0) return;
        text = text.toString();
        if (text.includes("EmulatorJS v")) return text;
        if (this.config.langJson) {
            if (typeof log === "undefined") log = true;
            if (!this.config.langJson[text] && log) {
                if (!this.missingLang.includes(text)) this.missingLang.push(text);
                console.log(`Translation not found for '${text}'. Language set to '${this.config.language}'`);
            }
            return this.config.langJson[text] || text;
        }
        return text;
    }
    
    downloadGameCore() {
        // 下载游戏核心
        console.log("Download game core");
    }
    
    on(event, func) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) this.functions[event] = [];
        this.functions[event].push(func);
    }
    
    callEvent(event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return 0;
        this.functions[event].forEach(e => e(data));
        return this.functions[event].length;
    }
    
    handleResize() {
        // 处理大小调整
        console.log("Handle resize");
    }
    
    get isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

// 不需要额外的导出语句，因为类定义时已经使用了export
