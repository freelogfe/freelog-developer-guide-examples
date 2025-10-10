
import { isSafari, isMobile } from "./utils";
import { getCores } from "./core";
import { getDefaultControllers, getKeyMap } from "./controller.js"
import { setElements, createContextMenu, createBottomMenuBar, createControlSettingMenu, createCheatsMenu, createNetplayMenu, createStartButton } from "./ui.js"
import { setVirtualGamepad } from "./virtualGamepad.js"
import { bindListeners, addEventListener, removeEventListener } from "./event.js"
export class EmulatorJS {

    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }
    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }
    getCore(generic) {
        const cores = getCores();
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

    downloadFile(path, progressCB, notWithPath, opts) {
        return new Promise(async cb => {
            const data = this.toData(path); //check other data types
            if (data) {
                data.then((game) => {
                    if (opts.method === "HEAD") {
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
                if (opts.method === "HEAD") {
                    cb({ headers: {} });
                    return;
                }
                try {
                    let res = await fetch(path)
                    if ((opts.type && opts.type.toLowerCase() === "arraybuffer") || !opts.type) {
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
                    cb({
                        data: data,
                        headers: {
                            "content-length": xhr.getResponseHeader("content-length")
                        }
                    });
                }
            }
            if (opts.responseType) xhr.responseType = opts.responseType;
            xhr.onerror = () => cb(-1);
            xhr.open(opts.method, path, true);
            xhr.send();
        })
    }
    toData(data, rv) {
        if (!(data instanceof ArrayBuffer) && !(data instanceof Uint8Array) && !(data instanceof Blob)) return null;
        if (rv) return true;
        return new Promise(async (resolve) => {
            if (data instanceof ArrayBuffer) {
                resolve(new Uint8Array(data));
            } else if (data instanceof Uint8Array) {
                resolve(data);
            } else if (data instanceof Blob) {
                resolve(new Uint8Array(await data.arrayBuffer()));
            }
            resolve();
        })
    }

    versionAsInt(ver) {
        if (ver.endsWith("-beta")) {
            return 99999999;
        }
        let rv = ver.split(".");
        if (rv[rv.length - 1].length === 1) {
            rv[rv.length - 1] = "0" + rv[rv.length - 1];
        }
        return parseInt(rv.join(""));
    }
    constructor(element, config) {
        this.defaultControllers = getDefaultControllers();
        this.keyMap = getKeyMap();
        this.addEventListener = addEventListener;
        this.removeEventListener = removeEventListener;
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts, this.defaultButtonAliases, this.defaultButtonOptions);
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
        setElements(element, this);
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

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
        createContextMenu(this);
        createBottomMenuBar(this);
        createControlSettingMenu(this);
        createCheatsMenu(this);
        createNetplayMenu(this);
        setVirtualGamepad(this);
        bindListeners(this);
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

        createStartButton();
        this.handleResize();
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
        const div = this.createElement("div");
        const time = (typeof this.config.adMode === "number" && this.config.adMode > -1 && this.config.adMode < 3) ? this.config.adMode : 2;
        div.classList.add("ejs_ad_iframe");
        const frame = this.createElement("iframe");
        frame.src = ads;
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("frameborder", "no");
        frame.style.width = width;
        frame.style.height = height;
        const closeParent = this.createElement("div");
        closeParent.classList.add("ejs_ad_close");
        const closeButton = this.createElement("a");
        closeParent.appendChild(closeButton);
        closeParent.setAttribute("hidden", "");
        div.appendChild(closeParent);
        div.appendChild(frame);
        if (this.config.adMode !== 1) {
            this.elements.parent.appendChild(div);
        }
        this.addEventListener(closeButton, "click", () => {
            div.remove();
        })

        this.on("start-clicked", () => {
            if (this.config.adMode === 0) div.remove();
            if (this.config.adMode === 1) {
                this.elements.parent.appendChild(div);
            }
        })

        this.on("start", () => {
            closeParent.removeAttribute("hidden");
            const time = (typeof this.config.adTimer === "number" && this.config.adTimer > 0) ? this.config.adTimer : 10000;
            if (this.config.adTimer === -1) div.remove();
            if (this.config.adTimer === 0) return;
            setTimeout(() => {
                div.remove();
            }, time);
        })

    }
    adBlocked(url, del) {
        if (del) {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } else {
            try {
                document.querySelector('div[class="ejs_ad_iframe"]').remove();
            } catch (e) { }
            this.config.adUrl = url;
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }
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

    // Start button

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
    // End start button
    createText() {
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
    checkCompression(data, msg, fileCbFunc) {
        if (!this.compression) {
            this.compression = new window.EJS_COMPRESSION(this);
        }
        if (msg) {
            this.textElem.innerText = msg;
        }
        return this.compression.decompress(data, (m, appendMsg) => {
            this.textElem.innerText = appendMsg ? (msg + m) : m;
        }, fileCbFunc);
    }
    checkCoreCompatibility(version) {
        if (this.versionAsInt(version.minimumEJSVersion) > this.versionAsInt(this.ejs_version)) {
            this.startGameError(this.localization("Outdated EmulatorJS version"));
            throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
        }
    }
    startGameError(message) {
        console.log(message);
        this.textElem.innerText = message;
        this.textElem.classList.add("ejs_error_text");

        this.setupSettingsMenu();
        this.loadSettings();

        this.menu.failedToStart();
        this.handleResize();
        this.failedToStart = true;
    }
    downloadGameCore() {
        this.textElem.innerText = this.localization("Download Game Core");
        if (!this.config.threads && this.requiresThreads(this.getCore())) {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("This core requires threads, but EJS_threads is not set!");
            return;
        }
        if (!this.supportsWebgl2 && this.requiresWebGL2(this.getCore())) {
            this.startGameError(this.localization("Outdated graphics driver"));
            return;
        }
        if (this.config.threads && typeof window.SharedArrayBuffer !== "function") {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            return;
        }
        const gotCore = (data) => {
            this.defaultCoreOpts = {};
            this.checkCompression(new Uint8Array(data), this.localization("Decompress Game Core")).then((data) => {
                let js, thread, wasm;
                for (let k in data) {
                    if (k.endsWith(".wasm")) {
                        wasm = data[k];
                    } else if (k.endsWith(".worker.js")) {
                        thread = data[k];
                    } else if (k.endsWith(".js")) {
                        js = data[k];
                    } else if (k === "build.json") {
                        this.checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                    } else if (k === "core.json") {
                        let core = JSON.parse(new TextDecoder().decode(data[k]));
                        this.extensions = core.extensions;
                        this.coreName = core.name;
                        this.repository = core.repo;
                        this.defaultCoreOpts = core.options;
                        this.enableMouseLock = core.options.supportsMouse;
                        this.retroarchOpts = core.retroarchOpts;
                        this.saveFileExt = core.save;
                    } else if (k === "license.txt") {
                        this.license = new TextDecoder().decode(data[k]);
                    }
                }

                if (this.saveFileExt === false) {
                    this.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
                this.initGameCore(js, wasm, thread);
            });
        }
        let version = this.ejs_version.endsWith("-beta") ? "nightly" : this.ejs_version;
        const report = "cores/reports/" + this.getCore() + ".json";
        this.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${report}`, null, true, { responseType: "text", method: "GET" }).then(async rep => {
            if (rep === -1 || typeof rep === "string" || typeof rep.data === "string") {
                rep = {};
            } else {
                rep = rep.data;
            }
            if (!rep.buildStart) {
                console.warn("Could not fetch core report JSON! Core caching will be disabled!");
                rep.buildStart = Math.random() * 100;
            }
            if (this.webgl2Enabled === null) {
                this.webgl2Enabled = rep.options ? rep.options.defaultWebGL2 : false;
            }
            if (this.requiresWebGL2(this.getCore())) {
                this.webgl2Enabled = true;
            }
            let threads = false;
            if (typeof window.SharedArrayBuffer === "function") {
                const opt = this.preGetSetting("ejs_threads");
                if (opt) {
                    threads = (opt === "enabled");
                } else {
                    threads = this.config.threads;
                }
            }

            let legacy = (this.supportsWebgl2 && this.webgl2Enabled ? "" : "-legacy");
            let filename = this.getCore() + (threads ? "-thread" : "") + legacy + "-wasm.data";
            if (!this.debug) {
                const result = await this.storage.core.get(filename);
                if (result && result.version === rep.buildStart) {
                    gotCore(result.data);
                    return;
                }
            }
            const corePath = "cores/" + filename;
            // let res = await this.downloadFile(corePath, (progress) => {
            // this.textElem.innerText = this.localization("Download Game Core") + progress;
            // }, false, { responseType: "arraybuffer", method: "GET" });
            // if (res === -1) {
            let res = await this.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${corePath}`, (progress) => {
                this.textElem.innerText = this.localization("Download Game Core") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                if (!this.supportsWebgl2) {
                    this.startGameError(this.localization("Outdated graphics driver"));
                } else {
                    this.startGameError(this.localization("Error downloading core") + " (" + filename + ")");
                }
                return;
            }
            console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
            // }
            gotCore(res.data);
            this.storage.core.put(filename, {
                version: rep.buildStart,
                data: res.data
            });
        });
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
            // 如果是字符串，则直接替换
            modifiedJs = js.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
        }

        let script = this.createElement("script");
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

            this.initModule(wasm, thread);
        });
        document.body.appendChild(script);
    }
    getBaseFileName(force) {
        //Only once game and core is loaded
        if (!this.started && !force) return null;
        if (force && this.config.gameUrl !== "game" && !this.config.gameUrl.startsWith("blob:")) {
            return this.config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
        }
        if (typeof this.config.gameName === "string") {
            const invalidCharacters = /[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/ig;
            const name = this.config.gameName.replace(invalidCharacters, "").trim();
            if (name) return name;
        }
        if (!this.fileName) return "game";
        let parts = this.fileName.split(".");
        parts.splice(parts.length - 1, 1);
        return parts.join(".");
    }
    saveInBrowserSupported() {
        return !!window.indexedDB && (typeof this.config.gameName === "string" || !this.config.gameUrl.startsWith("blob:"));
    }
    displayMessage(message, time) {
        if (!this.msgElem) {
            this.msgElem = this.createElement("div");
            this.msgElem.classList.add("ejs_message");
            this.elements.parent.appendChild(this.msgElem);
        }
        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(() => {
            this.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.msgElem.innerText = message;
    }
    downloadStartState() {
        return new Promise((resolve, reject) => {
            if (typeof this.config.loadState !== "string" && !this.toData(this.config.loadState, true)) {
                resolve();
                return;
            }
            this.textElem.innerText = this.localization("Download Game State");

            this.downloadFile(this.config.loadState, (progress) => {
                this.textElem.innerText = this.localization("Download Game State") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" }).then((res) => {
                if (res === -1) {
                    this.startGameError(this.localization("Error downloading game state"));
                    return;
                }
                this.on("start", () => {
                    setTimeout(() => {
                        this.gameManager.loadState(new Uint8Array(res.data));
                    }, 10);
                })
                resolve();
            });
        })
    }
    downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage) {
        return new Promise(async (resolve, reject) => {
            if ((typeof assetUrl !== "string" || !assetUrl.trim()) && !this.toData(assetUrl, true)) {
                return resolve(assetUrl);
            }
            const gotData = async (input) => {
                if (this.config.dontExtractBIOS === true) {
                    this.gameManager.FS.writeFile(assetUrl, new Uint8Array(input));
                    return resolve(assetUrl);
                }
                const data = await this.checkCompression(new Uint8Array(input), decompressProgressMessage);
                for (const k in data) {
                    const coreFilename = "/" + this.fileName;
                    const coreFilePath = coreFilename.substring(0, coreFilename.length - coreFilename.split("/").pop().length);
                    if (k === "!!notCompressedData") {
                        this.gameManager.FS.writeFile(coreFilePath + assetUrl.split("/").pop().split("#")[0].split("?")[0], data[k]);
                        break;
                    }
                    if (k.endsWith("/")) continue;
                    this.gameManager.FS.writeFile(coreFilePath + k.split("/").pop(), data[k]);
                }
            }

            this.textElem.innerText = progressMessage;
            if (!this.debug) {
                const res = await this.downloadFile(assetUrl, null, true, { method: "HEAD" });
                const result = await this.storage.rom.get(assetUrl.split("/").pop());
                if (result && result["content-length"] === res.headers["content-length"] && result.type === type) {
                    await gotData(result.data);
                    return resolve(assetUrl);
                }
            }
            const res = await this.downloadFile(assetUrl, (progress) => {
                this.textElem.innerText = progressMessage + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.startGameError(this.localization("Network Error"));
                resolve(assetUrl);
                return;
            }
            if (assetUrl instanceof File) {
                assetUrl = assetUrl.name;
            } else if (this.toData(assetUrl, true)) {
                assetUrl = "game";
            }
            await gotData(res.data);
            resolve(assetUrl);
            const limit = (typeof this.config.cacheLimit === "number") ? this.config.cacheLimit : 1073741824;
            if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported() && assetUrl !== "game") {
                this.storage.rom.put(assetUrl.split("/").pop(), {
                    "content-length": res.headers["content-length"],
                    data: res.data,
                    type: type
                })
            }
        });
    }
    downloadGamePatch() {
        return new Promise(async (resolve) => {
            this.config.gamePatchUrl = await this.downloadGameFile(this.config.gamePatchUrl, "patch", this.localization("Download Game Patch"), this.localization("Decompress Game Patch"));
            resolve();
        });
    }
    downloadGameParent() {
        return new Promise(async (resolve) => {
            this.config.gameParentUrl = await this.downloadGameFile(this.config.gameParentUrl, "parent", this.localization("Download Game Parent"), this.localization("Decompress Game Parent"));
            resolve();
        });
    }
    downloadBios() {
        return new Promise(async (resolve) => {
            this.config.biosUrl = await this.downloadGameFile(this.config.biosUrl, "bios", this.localization("Download Game BIOS"), this.localization("Decompress Game BIOS"));
            resolve();
        });
    }
    downloadRom() {
        const supportsExt = (ext) => {
            const core = this.getCore();
            if (!this.extensions) return false;
            return this.extensions.includes(ext);
        };

        return new Promise(resolve => {
            this.textElem.innerText = this.localization("Download Game Data");

            const gotGameData = (data) => {
                if (["arcade", "mame"].includes(this.getCore(true))) {
                    this.fileName = this.getBaseFileName(true);
                    this.gameManager.FS.writeFile(this.fileName, new Uint8Array(data));
                    resolve();
                    return;
                }

                const altName = this.getBaseFileName(true);

                let disableCue = false;
                if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x64sc", "vice_x128", "vice_xvic", "vice_xplus4", "vice_xpet", "puae"].includes(this.getCore()) && this.config.disableCue === undefined) {
                    disableCue = true;
                } else {
                    disableCue = this.config.disableCue;
                }

                let fileNames = [];
                this.checkCompression(new Uint8Array(data), this.localization("Decompress Game Data"), (fileName, fileData) => {
                    if (fileName.includes("/")) {
                        const paths = fileName.split("/");
                        let cp = "";
                        for (let i = 0; i < paths.length - 1; i++) {
                            if (paths[i] === "") continue;
                            cp += `/${paths[i]}`;
                            if (!this.gameManager.FS.analyzePath(cp).exists) {
                                this.gameManager.FS.mkdir(cp);
                            }
                        }
                    }
                    if (fileName.endsWith("/")) {
                        this.gameManager.FS.mkdir(fileName);
                        return;
                    }
                    if (fileName === "!!notCompressedData") {
                        this.gameManager.FS.writeFile(altName, fileData);
                        fileNames.push(altName);
                    } else {
                        this.gameManager.FS.writeFile(`/${fileName}`, fileData);
                        fileNames.push(fileName);
                    }
                }).then(() => {
                    let isoFile = null;
                    let supportedFile = null;
                    let cueFile = null;
                    let selectedCueExt = null;
                    fileNames.forEach(fileName => {
                        const ext = fileName.split(".").pop().toLowerCase();
                        if (supportedFile === null && supportsExt(ext)) {
                            supportedFile = fileName;
                        }
                        if (isoFile === null && ["iso", "cso", "chd", "elf"].includes(ext)) {
                            isoFile = fileName;
                        }
                        if (["cue", "ccd", "toc", "m3u"].includes(ext)) {
                            if (this.getCore(true) === "psx") {
                                //always prefer m3u files for psx cores
                                if (selectedCueExt !== "m3u") {
                                    if (cueFile === null || ext === "m3u") {
                                        cueFile = fileName;
                                        selectedCueExt = ext;
                                    }
                                }
                            } else {
                                //prefer cue or ccd files over toc or m3u
                                if (!["cue", "ccd"].includes(selectedCueExt)) {
                                    if (cueFile === null || ["cue", "ccd"].includes(ext)) {
                                        cueFile = fileName;
                                        selectedCueExt = ext;
                                    }
                                }
                            }
                        }
                    });
                    if (supportedFile !== null) {
                        this.fileName = supportedFile;
                    } else {
                        this.fileName = fileNames[0];
                    }
                    if (isoFile !== null && (supportsExt("iso") || supportsExt("cso") || supportsExt("chd") || supportsExt("elf"))) {
                        this.fileName = isoFile;
                    } else if (supportsExt("cue") || supportsExt("ccd") || supportsExt("toc") || supportsExt("m3u")) {
                        if (cueFile !== null) {
                            this.fileName = cueFile;
                        } else if (!disableCue) {
                            this.fileName = this.gameManager.createCueFile(fileNames);
                        }
                    }
                    resolve();
                });
            }
            const downloadFile = async () => {
                const res = await this.downloadFile(this.config.gameUrl, (progress) => {
                    this.textElem.innerText = this.localization("Download Game Data") + progress;
                }, true, { responseType: "arraybuffer", method: "GET" });
                if (res === -1) {
                    this.startGameError(this.localization("Network Error"));
                    return;
                }
                if (this.config.gameUrl instanceof File) {
                    this.config.gameUrl = this.config.gameUrl.name;
                } else if (this.toData(this.config.gameUrl, true)) {
                    this.config.gameUrl = "game";
                }
                gotGameData(res.data);
                const limit = (typeof this.config.cacheLimit === "number") ? this.config.cacheLimit : 1073741824;
                if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported() && this.config.gameUrl !== "game") {
                    this.storage.rom.put(this.config.gameUrl.split("/").pop(), {
                        "content-length": res.headers["content-length"],
                        data: res.data
                    })
                }
            }

            if (!this.debug) {
                this.downloadFile(this.config.gameUrl, null, true, { method: "HEAD" }).then(async (res) => {
                    const name = (typeof this.config.gameUrl === "string") ? this.config.gameUrl.split("/").pop() : "game";
                    const result = await this.storage.rom.get(name);
                    if (result && result["content-length"] === res.headers["content-length"] && name !== "game") {
                        gotGameData(result.data);
                        return;
                    }
                    downloadFile();
                })
            } else {
                downloadFile();
            }
        })
    }
    downloadFiles() {
        (async () => {
            this.gameManager = new window.EJS_GameManager(this.Module, this);
            await this.gameManager.loadExternalFiles();
            await this.gameManager.mountFileSystems();
            this.callEvent("saveDatabaseLoaded", this.gameManager.FS);
            if (this.getCore() === "ppsspp") {
                await this.gameManager.loadPpssppAssets();
            }
            await this.downloadRom();
            await this.downloadBios();
            await this.downloadStartState();
            await this.downloadGameParent();
            await this.downloadGamePatch();
            this.startGame();
        })();
    }
    initModule(wasmData, threadData) {
        if (typeof window.EJS_Runtime !== "function") {
            console.warn("EJS_Runtime is not defined!");
            this.startGameError(this.localization("Error loading EmulatorJS runtime"));
            throw new Error("EJS_Runtime is not defined!");
        }
        window.EJS_Runtime({
            noInitialRun: true,
            onRuntimeInitialized: null,
            arguments: [],
            preRun: [],
            postRun: [],
            canvas: this.canvas,
            callbacks: {},
            parent: this.elements.parent,
            print: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            printErr: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            totalDependencies: 0,
            locateFile: function (fileName) {
                if (this.debug) console.log(fileName);
                if (fileName.endsWith(".wasm")) {
                    return URL.createObjectURL(new Blob([wasmData], { type: "application/wasm" }));
                } else if (fileName.endsWith(".worker.js")) {
                    return URL.createObjectURL(new Blob([threadData], { type: "application/javascript" }));
                }
            },
            getSavExt: () => {
                if (this.saveFileExt) {
                    return "." + this.saveFileExt;
                }
                return ".srm";
            }
        }).then(module => {
            this.Module = module;
            this.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.startGameError(this.localization("Failed to start game"));
        });
    }
    startGame() {
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
            if (isSafari && isMobile) {
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
    checkStarted() {
        (async () => {
            let sleep = (ms) => new Promise(r => setTimeout(r, ms));
            let state = "suspended";
            let popup;
            while (state === "suspended") {
                if (!this.Module.AL) return;
                this.Module.AL.currentCtx.sources.forEach(ctx => {
                    state = ctx.gain.context.state;
                });
                if (state !== "suspended") break;
                if (!popup) {
                    popup = this.createPopup("", {});
                    const button = this.createElement("button");
                    button.innerText = this.localization("Click to resume Emulator");
                    button.classList.add("ejs_menu_button");
                    button.style.width = "25%";
                    button.style.height = "25%";
                    popup.appendChild(button);
                    popup.style["text-align"] = "center";
                    popup.style["font-size"] = "28px";
                }
                await sleep(10);
            }
            if (popup) this.closePopup();
        })();
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
    updateGamepadLabels() {
        for (let i = 0; i < this.gamepadLabels.length; i++) {
            this.gamepadLabels[i].innerHTML = ""
            const def = this.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.gamepadLabels[i].appendChild(def);
            for (let j = 0; j < this.gamepad.gamepads.length; j++) {
                const opt = this.createElement("option");
                opt.setAttribute("value", this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index);
                opt.innerText = this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index;
                this.gamepadLabels[i].appendChild(opt);
            }
            this.gamepadLabels[i].value = this.gamepadSelection[i] || "notconnected";
        }
    }
    createLink(elem, link, text, useP) {
        const elm = this.createElement("a");
        elm.href = link;
        elm.target = "_blank";
        elm.innerText = this.localization(text);
        if (useP) {
            const p = this.createElement("p");
            p.appendChild(elm);
            elem.appendChild(p);
        } else {
            elem.appendChild(elm);
        }
    }
    defaultButtonOptions = {
        playPause: {
            visible: true,
            icon: "play",
            displayName: "Play/Pause"
        },
        play: {
            visible: true,
            icon: '<svg viewBox="0 0 320 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>',
            displayName: "Play"
        },
        pause: {
            visible: true,
            icon: '<svg viewBox="0 0 320 512"><path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/></svg>',
            displayName: "Pause"
        },
        restart: {
            visible: true,
            icon: '<svg viewBox="0 0 512 512"><path d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"/></svg>',
            displayName: "Restart"
        },
        mute: {
            visible: true,
            icon: '<svg viewBox="0 0 640 512"><path d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"/></svg>',
            displayName: "Mute"
        },
        unmute: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"/></svg>',
            displayName: "Unmute"
        },
        settings: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>',
            displayName: "Settings"
        },
        fullscreen: {
            visible: true,
            icon: "fullscreen",
            displayName: "Fullscreen"
        },
        enterFullscreen: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z"/></svg>',
            displayName: "Enter Fullscreen"
        },
        exitFullscreen: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272zM296 240h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.5 12.5-32.76 .0002-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-78.06 78.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C272 229.3 282.7 240 296 240z"/></svg>',
            displayName: "Exit Fullscreen"
        },
        saveState: {
            visible: true,
            icon: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>',
            displayName: "Save State"
        },
        loadState: {
            visible: true,
            icon: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"/></svg>',
            displayName: "Load State"
        },
        screenRecord: {
            visible: true
        },
        gamepad: {
            visible: true,
            icon: '<svg viewBox="0 0 640 512"><path fill="currentColor" d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg>',
            displayName: "Control Settings"
        },
        cheat: {
            visible: true,
            icon: '<svg viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
            displayName: "Cheats"
        },
        volumeSlider: {
            visible: true
        },
        saveSavFiles: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 6.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M8 3H16V8.4C16 8.73137 15.7314 9 15.4 9H8.6C8.26863 9 8 8.73137 8 8.4V3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M12 12H1M1 12L4 9M1 12L4 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            displayName: "Export Save File"
        },
        loadSavFiles: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 7.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M16 3V8.4C16 8.73137 15.7314 9 15.4 9H13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M8 3V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12H12M12 12L9 9M12 12L9 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            displayName: "Import Save File"
        },
        quickSave: {
            visible: true
        },
        quickLoad: {
            visible: true
        },
        screenshot: {
            visible: true
        },
        cacheManager: {
            visible: true,
            icon: '<svg viewBox="0 0 1800 1800"><path d="M896 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5T231 896 128 768V598q119 84 325 127t443 43zm0 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128v-170q119 84 325 127t443 43zm0-384q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128V982q119 84 325 127t443 43zM896 0q208 0 385 34.5t280 93.5 103 128v128q0 69-103 128t-280 93.5T896 640t-385-34.5T231 512 128 384V256q0-69 103-128t280-93.5T896 0z"/></svg>',
            displayName: "Cache Manager"
        },
        exitEmulation: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460"><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 14.000061 7.636414 L 14.000061 4.5 C 14.000061 4.223877 13.776123 3.999939 13.5 3.999939 L 4.5 3.999939 C 4.223877 3.999939 3.999939 4.223877 3.999939 4.5 L 3.999939 19.5 C 3.999939 19.776123 4.223877 20.000061 4.5 20.000061 L 13.5 20.000061 C 13.776123 20.000061 14.000061 19.776123 14.000061 19.5 L 14.000061 16.363586 " transform="matrix(21.333333,0,0,21.333333,0,0)"/><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 9.999939 12 L 21 12 M 21 12 L 18.000366 8.499939 M 21 12 L 18 15.500061 " transform="matrix(21.333333,0,0,21.333333,0,0)"/></svg>',
            displayName: "Exit Emulation"
        },
        netplay: {
            visible: false,
            icon: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M364.215 192h131.43c5.439 20.419 8.354 41.868 8.354 64s-2.915 43.581-8.354 64h-131.43c5.154-43.049 4.939-86.746 0-128zM185.214 352c10.678 53.68 33.173 112.514 70.125 151.992.221.001.44.008.661.008s.44-.008.661-.008c37.012-39.543 59.467-98.414 70.125-151.992H185.214zm174.13-192h125.385C452.802 84.024 384.128 27.305 300.95 12.075c30.238 43.12 48.821 96.332 58.394 147.925zm-27.35 32H180.006c-5.339 41.914-5.345 86.037 0 128h151.989c5.339-41.915 5.345-86.037-.001-128zM152.656 352H27.271c31.926 75.976 100.6 132.695 183.778 147.925-30.246-43.136-48.823-96.35-58.393-147.925zm206.688 0c-9.575 51.605-28.163 104.814-58.394 147.925 83.178-15.23 151.852-71.949 183.778-147.925H359.344zm-32.558-192c-10.678-53.68-33.174-112.514-70.125-151.992-.221 0-.44-.008-.661-.008s-.44.008-.661.008C218.327 47.551 195.872 106.422 185.214 160h141.572zM16.355 192C10.915 212.419 8 233.868 8 256s2.915 43.581 8.355 64h131.43c-4.939-41.254-5.154-84.951 0-128H16.355zm136.301-32c9.575-51.602 28.161-104.81 58.394-147.925C127.872 27.305 59.198 84.024 27.271 160h125.385z"/></svg>',
            displayName: "Netplay"
        },
        diskButton: {
            visible: true,
            icon: '<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.109 473.109"><path d="M340.963,101.878H12.105C5.423,101.878,0,107.301,0,113.983v328.862c0,6.68,5.423,12.105,12.105,12.105h328.857 c6.685,0,12.104-5.426,12.104-12.105V113.983C353.067,107.301,347.647,101.878,340.963,101.878z M67.584,120.042h217.895v101.884 H67.584V120.042z M296.076,429.228H56.998V278.414h239.079V429.228z M223.947,135.173h30.269v72.638h-30.269V135.173z M274.13,315.741H78.933v-12.105H274.13V315.741z M274.13,358.109H78.933v-12.105H274.13V358.109z M274.13,398.965H78.933v-12.105 H274.13V398.965z M473.109,30.263v328.863c0,6.68-5.426,12.105-12.105,12.105H384.59v-25.724h31.528V194.694H384.59v-56.489h20.93 V36.321H187.625v43.361h-67.583v-49.42c0-6.682,5.423-12.105,12.105-12.105H461.01C467.695,18.158,473.109,23.581,473.109,30.263z M343.989,51.453h30.269v31.321c-3.18-1.918-6.868-3.092-10.853-3.092h-19.416V51.453z M394.177,232.021h-9.581v-12.105h9.581 V232.021z M384.59,262.284h9.581v12.105h-9.581V262.284z M384.59,303.14h9.581v12.104h-9.581V303.14z"/></svg>',
            displayName: "Disks"
        },
        contextMenu: {
            visible: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>',
            displayName: "Context Menu"
        }
    };
    defaultButtonAliases = {
        volume: "volumeSlider"
    };


    closePopup() {
        if (this.currentPopup !== null) {
            try {
                this.currentPopup.remove();
            } catch (e) { }
            this.currentPopup = null;
        }
    }
    //creates a full box popup.
    createPopup(popupTitle, buttons, hidden) {
        if (!hidden) this.closePopup();
        const popup = this.createElement("div");
        popup.classList.add("ejs_popup_container");
        this.elements.parent.appendChild(popup);
        const title = this.createElement("h4");
        title.innerText = this.localization(popupTitle);
        const main = this.createElement("div");
        main.classList.add("ejs_popup_body");

        popup.appendChild(title);
        popup.appendChild(main);

        const padding = this.createElement("div");
        padding.style["padding-top"] = "10px";
        popup.appendChild(padding);

        for (let k in buttons) {
            const button = this.createElement("a");
            if (buttons[k] instanceof Function) {
                button.addEventListener("click", (e) => {
                    buttons[k]();
                    e.preventDefault();
                });
            }
            button.classList.add("ejs_button");
            button.innerText = this.localization(k);
            popup.appendChild(button);
        }
        if (!hidden) {
            this.currentPopup = popup;
        } else {
            popup.style.display = "none";
        }

        return main;
    }
    selectFile() {
        return new Promise((resolve, reject) => {
            const file = this.createElement("input");
            file.type = "file";
            this.addEventListener(file, "change", (e) => {
                resolve(e.target.files[0]);
            })
            file.click();
        })
    }
    isPopupOpen() {
        return this.cheatMenu.style.display !== "none" || this.netplayMenu.style.display !== "none" || this.controlMenu.style.display !== "none" || this.currentPopup !== null;
    }
    isChild(first, second) {
        if (!first || !second) return false;
        const adown = first.nodeType === 9 ? first.documentElement : first;

        if (first === second) return true;

        if (adown.contains) {
            return adown.contains(second);
        }

        return first.compareDocumentPosition && first.compareDocumentPosition(second) & 16;
    }

    openCacheMenu() {
        (async () => {
            const list = this.createElement("table");
            const tbody = this.createElement("tbody");
            const body = this.createPopup("Cache Manager", {
                "Clear All": async () => {
                    const roms = await this.storage.rom.getSizes();
                    for (const k in roms) {
                        await this.storage.rom.remove(k);
                    }
                    tbody.innerHTML = "";
                },
                "Close": () => {
                    this.closePopup();
                }
            });
            const roms = await this.storage.rom.getSizes();
            list.style.width = "100%";
            list.style["padding-left"] = "10px";
            list.style["text-align"] = "left";
            body.appendChild(list);
            list.appendChild(tbody);
            const getSize = function (size) {
                let i = -1;
                do {
                    size /= 1024, i++;
                } while (size > 1024);
                return Math.max(size, 0.1).toFixed(1) + [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"][i];
            }
            for (const k in roms) {
                const line = this.createElement("tr");
                const name = this.createElement("td");
                const size = this.createElement("td");
                const remove = this.createElement("td");
                remove.style.cursor = "pointer";
                name.innerText = k;
                size.innerText = getSize(roms[k]);

                const a = this.createElement("a");
                a.innerText = this.localization("Remove");
                this.addEventListener(remove, "click", () => {
                    this.storage.rom.remove(k);
                    line.remove();
                })
                remove.appendChild(a);

                line.appendChild(name);
                line.appendChild(size);
                line.appendChild(remove);
                tbody.appendChild(line);
            }
        })();
    }
    getControlScheme() {
        if (this.config.controlScheme && typeof this.config.controlScheme === "string") {
            return this.config.controlScheme;
        } else {
            return this.getCore(true);
        }
    }


    setupKeys() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 30; j++) {
                if (this.controls[i][j]) {
                    this.controls[i][j].value = parseInt(this.keyLookup(this.controls[i][j].value));
                    if (this.controls[i][j].value === -1 && this.debug) {
                        delete this.controls[i][j].value;
                        console.warn("Invalid key for control " + j + " player " + i);
                    }
                }
            }
        }
    }
    keyLookup(controllerkey) {
        if (controllerkey === undefined) return 0;
        if (typeof controllerkey === "number") return controllerkey;
        controllerkey = controllerkey.toString().toLowerCase()
        const values = Object.values(this.keyMap);
        if (values.includes(controllerkey)) {
            const index = values.indexOf(controllerkey);
            return Object.keys(this.keyMap)[index];
        }
        return -1;
    }
    keyChange(e) {
        if (e.repeat) return;
        if (!this.started) return;
        if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            const num = this.controlPopup.getAttribute("button-num");
            const player = this.controlPopup.getAttribute("player-num");
            if (!this.controls[player][num]) {
                this.controls[player][num] = {};
            }
            this.controls[player][num].value = e.keyCode;
            this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.checkGamepadInputs();
            this.saveSettings();
            return;
        }
        if (this.settingsMenu.style.display !== "none" || this.isPopupOpen() || this.getSettingValue("keyboardInput") === "enabled") return;
        e.preventDefault();
        const special = [16, 17, 18, 19, 20, 21, 22, 23];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 30; j++) {
                if (this.controls[i][j] && this.controls[i][j].value === e.keyCode) {
                    // NES特殊处理：将X键映射到A键，Y键映射到B键
                    let mappedButton = j;
                    if ("nes" === this.getControlScheme()) {
                        if (j === 9) { // X键映射到A键(8)
                            mappedButton = 8;
                        } else if (j === 1) { // Y键映射到B键(0)
                            mappedButton = 0;
                        }
                    }
                    this.gameManager.simulateInput(i, mappedButton, (e.type === "keyup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
                }
            }
        }
    }
    gamepadEvent(e) {
        if (!this.started) return;
        const gamepadIndex = this.gamepadSelection.indexOf(this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index);
        if (gamepadIndex < 0) {
            return; // Gamepad not set anywhere
        }
        const value = function (value) {
            if (value > 0.5 || value < -0.5) {
                return (value > 0) ? 1 : -1;
            } else {
                return 0;
            }
        }(e.value || 0);
        if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            if ("buttonup" === e.type || (e.type === "axischanged" && value === 0)) return;
            const num = this.controlPopup.getAttribute("button-num");
            const player = parseInt(this.controlPopup.getAttribute("player-num"));
            if (gamepadIndex !== player) return;
            if (!this.controls[player][num]) {
                this.controls[player][num] = {};
            }
            this.controls[player][num].value2 = e.label;
            this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.checkGamepadInputs();
            this.saveSettings();
            return;
        }
        if (this.settingsMenu.style.display !== "none" || this.isPopupOpen()) return;
        const special = [16, 17, 18, 19, 20, 21, 22, 23];

        // NES特殊处理：将X键映射到A键，Y键映射到B键
        if ("nes" === this.getControlScheme()) {
            for (let i = 0; i < 4; i++) {
                if (gamepadIndex !== i) continue;
                for (let j = 0; j < 30; j++) {
                    if (!this.controls[i][j] || this.controls[i][j].value2 === undefined) {
                        continue;
                    }
                    const controlValue = this.controls[i][j].value2;

                    // 检查是否是X键(9)或Y键(1)
                    let mappedButton = j;
                    if (j === 9) { // X键映射到A键(8)
                        mappedButton = 8;
                    } else if (j === 1) { // Y键映射到B键(0)
                        mappedButton = 0;
                    }

                    if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                        // 处理NES的连发功能
                        if (j === 9 || j === 1) {
                            if (e.type === "buttondown") {
                                // 触发一次按键按下
                                this.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));

                                // 清除可能存在的旧定时器
                                if (this.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.controls[i][j].nesRapidFireInterval);
                                }

                                // 设置连发定时器
                                this.controls[i][j].nesRapidFireInterval = setInterval(() => {
                                    this.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));
                                    // 短暂延迟后释放按键，模拟点击效果
                                    setTimeout(() => {
                                        this.gameManager.simulateInput(i, mappedButton, 0);
                                    }, 30);
                                }, 100);
                            } else if (e.type === "buttonup") {
                                // 清除连发定时器
                                if (this.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.controls[i][j].nesRapidFireInterval);
                                    this.controls[i][j].nesRapidFireInterval = null;
                                }
                                // 触发按键释放
                                this.gameManager.simulateInput(i, mappedButton, 0);
                            }
                        } else {
                            // 非X/Y键的正常处理
                            this.gameManager.simulateInput(i, mappedButton, (e.type === "buttonup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
                        }
                    }
                }
            }
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (gamepadIndex !== i) continue;
            for (let j = 0; j < 30; j++) {
                if (!this.controls[i][j] || this.controls[i][j].value2 === undefined) {
                    continue;
                }
                const controlValue = this.controls[i][j].value2;

                if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                    this.gameManager.simulateInput(i, j, (e.type === "buttonup" ? 0 : (special.includes(j) ? 0x7fff : 1)));
                } else if (e.type === "axischanged") {
                    if (typeof controlValue === "string" && controlValue.split(":")[0] === e.axis) {
                        if (special.includes(j)) {
                            if (j === 16 || j === 17) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 16, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 17, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 17, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 16, 0);
                                }
                            } else if (j === 18 || j === 19) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 18, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 19, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 19, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 18, 0);
                                }
                            } else if (j === 20 || j === 21) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 20, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 21, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 21, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 20, 0);
                                }
                            } else if (j === 22 || j === 23) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 22, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 23, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 23, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 22, 0);
                                }
                            }
                        } else if (value === 0 || controlValue === e.label || controlValue === `${e.axis}:${value}`) {
                            this.gameManager.simulateInput(i, j, ((value === 0) ? 0 : 1));
                        }
                    }
                }
            }
        }
    }

    handleResize() {
        if (!this.game.parentElement) {
            return false;
        }
        if (this.virtualGamepad) {
            if (this.virtualGamepad.style.display === "none") {
                this.virtualGamepad.style.opacity = 0;
                this.virtualGamepad.style.display = "";
                setTimeout(() => {
                    this.virtualGamepad.style.display = "none";
                    this.virtualGamepad.style.opacity = "";
                }, 250)
            }
        }
        const positionInfo = this.elements.parent.getBoundingClientRect();
        this.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
        //This wouldnt work using :not()... strange.
        this.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);

        if (!this.handleSettingsResize) return;
        this.handleSettingsResize();
    }
    getElementSize(element) {
        let elem = element.cloneNode(true);
        elem.style.position = "absolute";
        elem.style.opacity = 0;
        elem.removeAttribute("hidden");
        element.parentNode.appendChild(elem);
        const res = elem.getBoundingClientRect();
        elem.remove();
        return {
            "width": res.width,
            "height": res.height
        };
    }
    saveSettings() {
        if (!window.localStorage || this.config.disableLocalStorage || !this.settingsLoaded) return;
        if (!this.started && !this.failedToStart) return;
        const coreSpecific = {
            controlSettings: this.controls,
            settings: this.settings,
            cheats: this.cheats
        }
        const ejs_settings = {
            volume: this.volume,
            muted: this.muted
        }
        localStorage.setItem("ejs-settings", JSON.stringify(ejs_settings));
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(coreSpecific));
    }
    getLocalStorageKey() {
        let identifier = (this.config.gameId || 1) + "-" + this.getCore(true);
        if (typeof this.config.gameName === "string") {
            identifier += "-" + this.config.gameName;
        } else if (typeof this.config.gameUrl === "string" && !this.config.gameUrl.toLowerCase().startsWith("blob:")) {
            identifier += "-" + this.config.gameUrl;
        } else if (this.config.gameUrl instanceof File) {
            identifier += "-" + this.config.gameUrl.name;
        } else if (typeof this.config.gameId !== "number") {
            console.warn("gameId (EJS_gameID) is not set. This may result in settings persisting across games.");
        }
        return "ejs-" + identifier + "-settings";
    }
    preGetSetting(setting) {
        if (window.localStorage && !this.config.disableLocalStorage) {
            let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (coreSpecific && coreSpecific.settings) {
                    return coreSpecific.settings[setting];
                }
            } catch (e) {
                console.warn("Could not load previous settings", e);
            }
        }
        if (this.config.defaultOptions && this.config.defaultOptions[setting]) {
            return this.config.defaultOptions[setting];
        }
        return null;
    }
    getCoreSettings() {
        if (!window.localStorage || this.config.disableLocalStorage) {
            if (this.config.defaultOptions) {
                let rv = "";
                for (const k in this.config.defaultOptions) {
                    let value = isNaN(this.config.defaultOptions[k]) ? `"${this.config.defaultOptions[k]}"` : this.config.defaultOptions[k];
                    rv += `${k} = ${value}\n`;
                }
                return rv;
            }
            return "";
        };
        let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
        if (coreSpecific) {
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (!(coreSpecific.settings instanceof Object)) throw new Error("Not a JSON object");
                let rv = "";
                for (const k in coreSpecific.settings) {
                    let value = isNaN(coreSpecific.settings[k]) ? `"${coreSpecific.settings[k]}"` : coreSpecific.settings[k];
                    rv += `${k} = ${value}\n`;
                }
                for (const k in this.config.defaultOptions) {
                    if (rv.includes(k)) continue;
                    let value = isNaN(this.config.defaultOptions[k]) ? `"${this.config.defaultOptions[k]}"` : this.config.defaultOptions[k];
                    rv += `${k} = ${value}\n`;
                }
                return rv;
            } catch (e) {
                console.warn("Could not load previous settings", e);
            }
        }
        return "";
    }
    loadSettings() {
        if (!window.localStorage || this.config.disableLocalStorage) return;
        this.settingsLoaded = true;
        let ejs_settings = localStorage.getItem("ejs-settings");
        let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
        if (coreSpecific) {
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (!(coreSpecific.controlSettings instanceof Object) || !(coreSpecific.settings instanceof Object) || !Array.isArray(coreSpecific.cheats)) return;
                this.controls = coreSpecific.controlSettings;
                this.checkGamepadInputs();
                for (const k in coreSpecific.settings) {
                    this.changeSettingOption(k, coreSpecific.settings[k]);
                }
                for (let i = 0; i < coreSpecific.cheats.length; i++) {
                    const cheat = coreSpecific.cheats[i];
                    let includes = false;
                    for (let j = 0; j < this.cheats.length; j++) {
                        if (this.cheats[j].desc === cheat.desc && this.cheats[j].code === cheat.code) {
                            this.cheats[j].checked = cheat.checked;
                            includes = true;
                            break;
                        }
                    }
                    if (includes) continue;
                    this.cheats.push(cheat);
                }

            } catch (e) {
                console.warn("Could not load previous settings", e);
            }
        }
        if (ejs_settings) {
            try {
                ejs_settings = JSON.parse(ejs_settings);
                if (typeof ejs_settings.volume !== "number" || typeof ejs_settings.muted !== "boolean") return;
                this.volume = ejs_settings.volume;
                this.muted = ejs_settings.muted;
                this.setVolume(this.muted ? 0 : this.volume);
            } catch (e) {
                console.warn("Could not load previous settings", e);
            }
        }
    }
    handleSpecialOptions(option, value) {
        if (option === "shader") {
            this.enableShader(value);
        } else if (option === "disk") {
            this.gameManager.setCurrentDisk(value);
        } else if (option === "virtual-gamepad") {
            this.toggleVirtualGamepad(value !== "disabled");
        } else if (option === "menu-bar-button") {
            this.elements.menuToggle.style.display = "";
            this.elements.menuToggle.style.opacity = value === "visible" ? 0.5 : 0;
        } else if (option === "virtual-gamepad-left-handed-mode") {
            this.toggleVirtualGamepadLeftHanded(value !== "disabled");
        } else if (option === "ff-ratio") {
            if (this.isFastForward) this.gameManager.toggleFastForward(0);
            if (value === "unlimited") {
                this.gameManager.setFastForwardRatio(0);
            } else if (!isNaN(value)) {
                this.gameManager.setFastForwardRatio(parseFloat(value));
            }
            setTimeout(() => {
                if (this.isFastForward) this.gameManager.toggleFastForward(1);
            }, 10)
        } else if (option === "fastForward") {
            if (value === "enabled") {
                this.isFastForward = true;
                this.gameManager.toggleFastForward(1);
            } else if (value === "disabled") {
                this.isFastForward = false;
                this.gameManager.toggleFastForward(0);
            }
        } else if (option === "sm-ratio") {
            if (this.isSlowMotion) this.gameManager.toggleSlowMotion(0);
            this.gameManager.setSlowMotionRatio(parseFloat(value));
            setTimeout(() => {
                if (this.isSlowMotion) this.gameManager.toggleSlowMotion(1);
            }, 10);
        } else if (option === "slowMotion") {
            if (value === "enabled") {
                this.isSlowMotion = true;
                this.gameManager.toggleSlowMotion(1);
            } else if (value === "disabled") {
                this.isSlowMotion = false;
                this.gameManager.toggleSlowMotion(0);
            }
        } else if (option === "rewind-granularity") {
            if (this.rewindEnabled) {
                this.gameManager.setRewindGranularity(parseInt(value));
            }
        } else if (option === "vsync") {
            this.gameManager.setVSync(value === "enabled");
        } else if (option === "videoRotation") {
            value = parseInt(value);
            if (this.videoRotationChanged === true || value !== 0) {
                this.gameManager.setVideoRotation(value);
                this.videoRotationChanged = true;
            } else if (this.videoRotationChanged === true && value === 0) {
                this.gameManager.setVideoRotation(0);
                this.videoRotationChanged = true;
            }
        } else if (option === "save-save-interval") {
            value = parseInt(value);
            if (this.saveSaveInterval && this.saveSaveInterval !== null) {
                clearInterval(this.saveSaveInterval);
                this.saveSaveInterval = null;
            }
            // Disabled
            if (value === 0 || isNaN(value)) return;
            if (this.started) this.gameManager.saveSaveFiles();
            if (this.debug) console.log("Saving every", value * 1000, "miliseconds");
            this.saveSaveInterval = setInterval(() => {
                if (this.started) this.gameManager.saveSaveFiles();
            }, value * 1000);
        } else if (option === "menubarBehavior") {
            this.createBottomMenuBarListeners();
        } else if (option === "keyboardInput") {
            this.gameManager.setKeyboardEnabled(value === "enabled");
        } else if (option === "altKeyboardInput") {
            this.gameManager.setAltKeyEnabled(value === "enabled");
        } else if (option === "lockMouse") {
            this.enableMouseLock = (value === "enabled");
        }
    }
    menuOptionChanged(option, value) {
        this.saveSettings();
        this.allSettings[option] = value;
        if (this.debug) console.log(option, value);
        if (!this.gameManager) return;
        this.handleSpecialOptions(option, value);
        this.gameManager.setVariable(option, value);
        this.saveSettings();
    }
    setupDisksMenu() {
        this.disksMenu = this.createElement("div");
        this.disksMenu.classList.add("ejs_settings_parent");
        const nested = this.createElement("div");
        nested.classList.add("ejs_settings_transition");
        this.disks = {};

        const home = this.createElement("div");
        home.style.overflow = "auto";
        const menus = [];
        this.handleDisksResize = () => {
            let needChange = false;
            if (this.disksMenu.style.display !== "") {
                this.disksMenu.style.opacity = "0";
                this.disksMenu.style.display = "";
                needChange = true;
            }
            let height = this.elements.parent.getBoundingClientRect().height;
            let w2 = this.diskParent.parentElement.getBoundingClientRect().width;
            let disksX = this.diskParent.getBoundingClientRect().x;
            if (w2 > window.innerWidth) disksX += (w2 - window.innerWidth);
            const onTheRight = disksX > (w2 - 15) / 2;
            if (height > 375) height = 375;
            home.style["max-height"] = (height - 95) + "px";
            nested.style["max-height"] = (height - 95) + "px";
            for (let i = 0; i < menus.length; i++) {
                menus[i].style["max-height"] = (height - 95) + "px";
            }
            this.disksMenu.classList.toggle("ejs_settings_center_left", !onTheRight);
            this.disksMenu.classList.toggle("ejs_settings_center_right", onTheRight);
            if (needChange) {
                this.disksMenu.style.display = "none";
                this.disksMenu.style.opacity = "";
            }
        }

        home.classList.add("ejs_setting_menu");
        nested.appendChild(home);
        let funcs = [];
        this.changeDiskOption = (title, newValue) => {
            this.disks[title] = newValue;
            funcs.forEach(e => e(title));
        }
        let allOpts = {};

        // TODO - Why is this duplicated?
        const addToMenu = (title, id, options, defaultOption) => {
            const span = this.createElement("span");
            span.innerText = title;

            const current = this.createElement("div");
            current.innerText = "";
            current.classList.add("ejs_settings_main_bar_selected");
            span.appendChild(current);

            const menu = this.createElement("div");
            menus.push(menu);
            menu.setAttribute("hidden", "");
            menu.classList.add("ejs_parent_option_div");
            const button = this.createElement("button");
            const goToHome = () => {
                const homeSize = this.getElementSize(home);
                nested.style.width = (homeSize.width + 20) + "px";
                nested.style.height = homeSize.height + "px";
                menu.setAttribute("hidden", "");
                home.removeAttribute("hidden");
            }
            this.addEventListener(button, "click", goToHome);

            button.type = "button";
            button.classList.add("ejs_back_button");
            menu.appendChild(button);
            const pageTitle = this.createElement("span");
            pageTitle.innerText = title;
            pageTitle.classList.add("ejs_menu_text_a");
            button.appendChild(pageTitle);

            const optionsMenu = this.createElement("div");
            optionsMenu.classList.add("ejs_setting_menu");

            let buttons = [];
            let opts = options;
            if (Array.isArray(options)) {
                opts = {};
                for (let i = 0; i < options.length; i++) {
                    opts[options[i]] = options[i];
                }
            }
            allOpts[id] = opts;

            funcs.push((title) => {
                if (id !== title) return;
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.toggle("ejs_option_row_selected", buttons[j].getAttribute("ejs_value") === this.disks[id]);
                }
                this.menuOptionChanged(id, this.disks[id]);
                current.innerText = opts[this.disks[id]];
            });

            for (const opt in opts) {
                const optionButton = this.createElement("button");
                buttons.push(optionButton);
                optionButton.setAttribute("ejs_value", opt);
                optionButton.type = "button";
                optionButton.value = opts[opt];
                optionButton.classList.add("ejs_option_row");
                optionButton.classList.add("ejs_button_style");

                this.addEventListener(optionButton, "click", (e) => {
                    this.disks[id] = opt;
                    for (let j = 0; j < buttons.length; j++) {
                        buttons[j].classList.remove("ejs_option_row_selected");
                    }
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                    goToHome();
                })
                if (defaultOption === opt) {
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                }

                const msg = this.createElement("span");
                msg.innerText = opts[opt];
                optionButton.appendChild(msg);

                optionsMenu.appendChild(optionButton);
            }

            home.appendChild(optionsMenu);

            nested.appendChild(menu);
        }

        if (this.gameManager.getDiskCount() > 1) {
            const diskLabels = {};
            let isM3U = false;
            let disks = {};
            if (this.fileName.split(".").pop() === "m3u") {
                disks = this.gameManager.Module.FS.readFile(this.fileName, { encoding: "utf8" }).split("\n");
                isM3U = true;
            }
            for (let i = 0; i < this.gameManager.getDiskCount(); i++) {
                // default if not an m3u loaded rom is "Disk x"
                // if m3u, then use the file name without the extension
                // if m3u, and contains a |, then use the string after the | as the disk label
                if (!isM3U) {
                    diskLabels[i.toString()] = "Disk " + (i + 1);
                } else {
                    // get disk name from m3u
                    const diskLabelValues = disks[i].split("|");
                    // remove the file extension from the disk file name
                    let diskLabel = diskLabelValues[0].replace("." + diskLabelValues[0].split(".").pop(), "");
                    if (diskLabelValues.length >= 2) {
                        // has a label - use that instead
                        diskLabel = diskLabelValues[1];
                    }
                    diskLabels[i.toString()] = diskLabel;
                }
            }
            addToMenu(this.localization("Disk"), "disk", diskLabels, this.gameManager.getCurrentDisk().toString());
        }

        this.disksMenu.appendChild(nested);

        this.diskParent.appendChild(this.disksMenu);
        this.diskParent.style.position = "relative";

        const homeSize = this.getElementSize(home);
        nested.style.width = (homeSize.width + 20) + "px";
        nested.style.height = homeSize.height + "px";

        this.disksMenu.style.display = "none";

        if (this.debug) {
            console.log("Available core options", allOpts);
        }

        if (this.config.defaultOptions) {
            for (const k in this.config.defaultOptions) {
                this.changeDiskOption(k, this.config.defaultOptions[k]);
            }
        }
    }
    getSettingValue(id) {
        return this.allSettings[id] || this.settings[id] || null;
    }
    setupSettingsMenu() {
        this.settingsMenu = this.createElement("div");
        this.settingsMenu.classList.add("ejs_settings_parent");
        const nested = this.createElement("div");
        nested.classList.add("ejs_settings_transition");
        this.settings = {};
        this.allSettings = {};
        const menus = [];
        let parentMenuCt = 0;

        const createSettingParent = (child, title, parentElement) => {
            const rv = this.createElement("div");
            rv.classList.add("ejs_setting_menu");

            if (child) {
                const menuOption = this.createElement("div");
                menuOption.classList.add("ejs_settings_main_bar");
                const span = this.createElement("span");
                span.innerText = title;

                menuOption.appendChild(span);
                parentElement.appendChild(menuOption);

                const menu = this.createElement("div");
                const menuChild = this.createElement("div");
                menus.push(menu);
                parentMenuCt++;
                menu.setAttribute("hidden", "");
                menuChild.classList.add("ejs_parent_option_div");
                const button = this.createElement("button");
                const goToHome = () => {
                    const homeSize = this.getElementSize(parentElement);
                    nested.style.width = (homeSize.width + 20) + "px";
                    nested.style.height = homeSize.height + "px";
                    menu.setAttribute("hidden", "");
                    parentElement.removeAttribute("hidden");
                }
                this.addEventListener(menuOption, "click", (e) => {
                    const targetSize = this.getElementSize(menu);
                    nested.style.width = (targetSize.width + 20) + "px";
                    nested.style.height = targetSize.height + "px";
                    menu.removeAttribute("hidden");
                    rv.scrollTo(0, 0);
                    parentElement.setAttribute("hidden", "");
                })
                const observer = new MutationObserver((list) => {
                    for (const k of list) {
                        for (const removed of k.removedNodes) {
                            if (removed === menu) {
                                menuOption.remove();
                                observer.disconnect();
                                const index = menus.indexOf(menu);
                                if (index !== -1) menus.splice(index, 1);
                                this.settingsMenu.style.display = "";
                                const homeSize = this.getElementSize(parentElement);
                                nested.style.width = (homeSize.width + 20) + "px";
                                nested.style.height = homeSize.height + "px";
                                // This SHOULD always be called before the game started - this SHOULD never be an issue
                                this.settingsMenu.style.display = "none";
                            }
                        }
                    }
                });
                this.addEventListener(button, "click", goToHome);

                button.type = "button";
                button.classList.add("ejs_back_button");
                menuChild.appendChild(button);
                const pageTitle = this.createElement("span");
                pageTitle.innerText = title;
                pageTitle.classList.add("ejs_menu_text_a");
                button.appendChild(pageTitle);

                // const optionsMenu = this.createElement("div");
                // optionsMenu.classList.add("ejs_setting_menu");
                // menu.appendChild(optionsMenu);

                menuChild.appendChild(rv);
                menu.appendChild(menuChild);
                nested.appendChild(menu);
                observer.observe(nested, {
                    childList: true,
                    subtree: true,
                });
            }

            return rv;
        }

        const checkForEmptyMenu = (element) => {
            if (element.firstChild === null) {
                element.parentElement.remove(); // No point in keeping an empty menu
                parentMenuCt--;
            }
        }

        const home = createSettingParent();

        this.handleSettingsResize = () => {
            let needChange = false;
            if (this.settingsMenu.style.display !== "") {
                this.settingsMenu.style.opacity = "0";
                this.settingsMenu.style.display = "";
                needChange = true;
            }
            let height = this.elements.parent.getBoundingClientRect().height;
            let w2 = this.settingParent.parentElement.getBoundingClientRect().width;
            let settingsX = this.settingParent.getBoundingClientRect().x;
            if (w2 > window.innerWidth) settingsX += (w2 - window.innerWidth);
            const onTheRight = settingsX > (w2 - 15) / 2;
            if (height > 375) height = 375;
            home.style["max-height"] = (height - 95) + "px";
            nested.style["max-height"] = (height - 95) + "px";
            for (let i = 0; i < menus.length; i++) {
                menus[i].style["max-height"] = (height - 95) + "px";
            }
            this.settingsMenu.classList.toggle("ejs_settings_center_left", !onTheRight);
            this.settingsMenu.classList.toggle("ejs_settings_center_right", onTheRight);
            if (needChange) {
                this.settingsMenu.style.display = "none";
                this.settingsMenu.style.opacity = "";
            }
        }
        nested.appendChild(home);

        let funcs = [];
        let settings = {};
        this.changeSettingOption = (title, newValue, startup) => {
            this.allSettings[title] = newValue;
            if (startup !== true) {
                this.settings[title] = newValue;
            }
            settings[title] = newValue;
            funcs.forEach(e => e(title));
        }
        let allOpts = {};

        const addToMenu = (title, id, options, defaultOption, parentElement, useParentParent) => {
            if (Array.isArray(this.config.hideSettings) && this.config.hideSettings.includes(id)) {
                return;
            }
            parentElement = parentElement || home;
            const transitionElement = useParentParent ? parentElement.parentElement.parentElement : parentElement;
            const menuOption = this.createElement("div");
            menuOption.classList.add("ejs_settings_main_bar");
            const span = this.createElement("span");
            span.innerText = title;

            const current = this.createElement("div");
            current.innerText = "";
            current.classList.add("ejs_settings_main_bar_selected");
            span.appendChild(current);

            menuOption.appendChild(span);
            parentElement.appendChild(menuOption);

            const menu = this.createElement("div");
            menus.push(menu);
            const menuChild = this.createElement("div");
            menu.setAttribute("hidden", "");
            menuChild.classList.add("ejs_parent_option_div");

            const optionsMenu = this.createElement("div");
            optionsMenu.classList.add("ejs_setting_menu");

            const button = this.createElement("button");
            const goToHome = () => {
                transitionElement.removeAttribute("hidden");
                menu.setAttribute("hidden", "");
                const homeSize = this.getElementSize(transitionElement);
                nested.style.width = (homeSize.width + 20) + "px";
                nested.style.height = homeSize.height + "px";
                transitionElement.removeAttribute("hidden");
            }
            this.addEventListener(menuOption, "click", (e) => {
                const targetSize = this.getElementSize(menu);
                nested.style.width = (targetSize.width + 20) + "px";
                nested.style.height = targetSize.height + "px";
                menu.removeAttribute("hidden");
                optionsMenu.scrollTo(0, 0);
                transitionElement.setAttribute("hidden", "");
                transitionElement.setAttribute("hidden", "");
            })
            this.addEventListener(button, "click", goToHome);

            button.type = "button";
            button.classList.add("ejs_back_button");
            menuChild.appendChild(button);
            const pageTitle = this.createElement("span");
            pageTitle.innerText = title;
            pageTitle.classList.add("ejs_menu_text_a");
            button.appendChild(pageTitle);

            let buttons = [];
            let opts = options;
            if (Array.isArray(options)) {
                opts = {};
                for (let i = 0; i < options.length; i++) {
                    opts[options[i]] = options[i];
                }
            }
            allOpts[id] = opts;

            funcs.push((title) => {
                if (id !== title) return;
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.toggle("ejs_option_row_selected", buttons[j].getAttribute("ejs_value") === settings[id]);
                }
                this.menuOptionChanged(id, settings[id]);
                current.innerText = opts[settings[id]];
            });

            for (const opt in opts) {
                const optionButton = this.createElement("button");
                buttons.push(optionButton);
                optionButton.setAttribute("ejs_value", opt);
                optionButton.type = "button";
                optionButton.value = opts[opt];
                optionButton.classList.add("ejs_option_row");
                optionButton.classList.add("ejs_button_style");

                this.addEventListener(optionButton, "click", (e) => {
                    this.changeSettingOption(id, opt);
                    for (let j = 0; j < buttons.length; j++) {
                        buttons[j].classList.remove("ejs_option_row_selected");
                    }
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                    goToHome();
                })
                if (defaultOption === opt) {
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                }

                const msg = this.createElement("span");
                msg.innerText = opts[opt];
                optionButton.appendChild(msg);

                optionsMenu.appendChild(optionButton);
            }

            menuChild.appendChild(optionsMenu);

            menu.appendChild(menuChild);
            nested.appendChild(menu);
        }
        const cores = getCores();
        const core = cores[this.getCore(true)];
        if (core && core.length > 1) {
            addToMenu(this.localization("Core" + " (" + this.localization("Requires restart") + ")"), "retroarch_core", core, this.getCore(), home);
        }
        if (typeof window.SharedArrayBuffer === "function" && !this.requiresThreads(this.getCore())) {
            addToMenu(this.localization("Threads"), "ejs_threads", {
                "enabled": this.localization("Enabled"),
                "disabled": this.localization("Disabled")
            }, this.config.threads ? "enabled" : "disabled", home);
        }

        const graphicsOptions = createSettingParent(true, "Graphics Settings", home);

        if (this.config.shaders) {
            const builtinShaders = {
                "2xScaleHQ.glslp": this.localization("2xScaleHQ"),
                "4xScaleHQ.glslp": this.localization("4xScaleHQ"),
                "crt-aperture.glslp": this.localization("CRT aperture"),
                "crt-beam": this.localization("CRT beam"),
                "crt-caligari": this.localization("CRT caligari"),
                "crt-easymode.glslp": this.localization("CRT easymode"),
                "crt-geom.glslp": this.localization("CRT geom"),
                "crt-lottes": this.localization("CRT lottes"),
                "crt-mattias.glslp": this.localization("CRT mattias"),
                "crt-yeetron": this.localization("CRT yeetron"),
                "crt-zfast": this.localization("CRT zfast"),
                "sabr": this.localization("SABR"),
                "bicubic": this.localization("Bicubic"),
                "mix-frames": this.localization("Mix frames"),
            };
            let shaderMenu = {
                "disabled": this.localization("Disabled"),
            };
            for (const shaderName in this.config.shaders) {
                if (builtinShaders[shaderName]) {
                    shaderMenu[shaderName] = builtinShaders[shaderName];
                } else {
                    shaderMenu[shaderName] = shaderName;
                }
            }
            addToMenu(this.localization("Shaders"), "shader", shaderMenu, "disabled", graphicsOptions, true);
        }

        if (this.supportsWebgl2 && !this.requiresWebGL2(this.getCore())) {
            addToMenu(this.localization("WebGL2") + " (" + this.localization("Requires restart") + ")", "webgl2Enabled", {
                "enabled": this.localization("Enabled"),
                "disabled": this.localization("Disabled")
            }, this.webgl2Enabled ? "enabled" : "disabled", graphicsOptions, true);
        }

        addToMenu(this.localization("FPS"), "fps", {
            "show": this.localization("show"),
            "hide": this.localization("hide")
        }, "hide", graphicsOptions, true);

        addToMenu(this.localization("VSync"), "vsync", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, "enabled", graphicsOptions, true);

        addToMenu(this.localization("Video Rotation"), "videoRotation", {
            "0": "0 deg",
            "1": "90 deg",
            "2": "180 deg",
            "3": "270 deg"
        }, this.videoRotation.toString(), graphicsOptions, true);

        const screenCaptureOptions = createSettingParent(true, "Screen Capture", home);

        addToMenu(this.localization("Screenshot Source"), "screenshotSource", {
            "canvas": "canvas",
            "retroarch": "retroarch"
        }, this.capture.photo.source, screenCaptureOptions, true);

        let screenshotFormats = {
            "png": "png",
            "jpeg": "jpeg",
            "webp": "webp"
        }
        if (isSafari) {
            delete screenshotFormats["webp"];
        }
        if (!(this.capture.photo.format in screenshotFormats)) {
            this.capture.photo.format = "png";
        }
        addToMenu(this.localization("Screenshot Format"), "screenshotFormat", screenshotFormats, this.capture.photo.format, screenCaptureOptions, true);

        const screenshotUpscale = this.capture.photo.upscale.toString();
        let screenshotUpscales = {
            "0": "native",
            "1": "1x",
            "2": "2x",
            "3": "3x"
        }
        if (!(screenshotUpscale in screenshotUpscales)) {
            screenshotUpscales[screenshotUpscale] = screenshotUpscale + "x";
        }
        addToMenu(this.localization("Screenshot Upscale"), "screenshotUpscale", screenshotUpscales, screenshotUpscale, screenCaptureOptions, true);

        const screenRecordFPS = this.capture.video.fps.toString();
        let screenRecordFPSs = {
            "30": "30",
            "60": "60"
        }
        if (!(screenRecordFPS in screenRecordFPSs)) {
            screenRecordFPSs[screenRecordFPS] = screenRecordFPS;
        }
        addToMenu(this.localization("Screen Recording FPS"), "screenRecordFPS", screenRecordFPSs, screenRecordFPS, screenCaptureOptions, true);

        let screenRecordFormats = {
            "mp4": "mp4",
            "webm": "webm"
        }
        for (const format in screenRecordFormats) {
            if (!MediaRecorder.isTypeSupported("video/" + format)) {
                delete screenRecordFormats[format];
            }
        }
        if (!(this.capture.video.format in screenRecordFormats)) {
            this.capture.video.format = Object.keys(screenRecordFormats)[0];
        }
        addToMenu(this.localization("Screen Recording Format"), "screenRecordFormat", screenRecordFormats, this.capture.video.format, screenCaptureOptions, true);

        const screenRecordUpscale = this.capture.video.upscale.toString();
        let screenRecordUpscales = {
            "1": "1x",
            "2": "2x",
            "3": "3x",
            "4": "4x"
        }
        if (!(screenRecordUpscale in screenRecordUpscales)) {
            screenRecordUpscales[screenRecordUpscale] = screenRecordUpscale + "x";
        }
        addToMenu(this.localization("Screen Recording Upscale"), "screenRecordUpscale", screenRecordUpscales, screenRecordUpscale, screenCaptureOptions, true);

        const screenRecordVideoBitrate = this.capture.video.videoBitrate.toString();
        let screenRecordVideoBitrates = {
            "1048576": "1 Mbit/sec",
            "2097152": "2 Mbit/sec",
            "2621440": "2.5 Mbit/sec",
            "3145728": "3 Mbit/sec",
            "4194304": "4 Mbit/sec"
        }
        if (!(screenRecordVideoBitrate in screenRecordVideoBitrates)) {
            screenRecordVideoBitrates[screenRecordVideoBitrate] = screenRecordVideoBitrate + " Bits/sec";
        }
        addToMenu(this.localization("Screen Recording Video Bitrate"), "screenRecordVideoBitrate", screenRecordVideoBitrates, screenRecordVideoBitrate, screenCaptureOptions, true);

        const screenRecordAudioBitrate = this.capture.video.audioBitrate.toString();
        let screenRecordAudioBitrates = {
            "65536": "64 Kbit/sec",
            "131072": "128 Kbit/sec",
            "196608": "192 Kbit/sec",
            "262144": "256 Kbit/sec",
            "327680": "320 Kbit/sec"
        }
        if (!(screenRecordAudioBitrate in screenRecordAudioBitrates)) {
            screenRecordAudioBitrates[screenRecordAudioBitrate] = screenRecordAudioBitrate + " Bits/sec";
        }
        addToMenu(this.localization("Screen Recording Audio Bitrate"), "screenRecordAudioBitrate", screenRecordAudioBitrates, screenRecordAudioBitrate, screenCaptureOptions, true);

        checkForEmptyMenu(screenCaptureOptions);

        const speedOptions = createSettingParent(true, "Speed Options", home);

        addToMenu(this.localization("Fast Forward"), "fastForward", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, "disabled", speedOptions, true);

        addToMenu(this.localization("Fast Forward Ratio"), "ff-ratio", [
            "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0", "unlimited"
        ], "3.0", speedOptions, true);

        addToMenu(this.localization("Slow Motion"), "slowMotion", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, "disabled", speedOptions, true);

        addToMenu(this.localization("Slow Motion Ratio"), "sm-ratio", [
            "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"
        ], "3.0", speedOptions, true);

        addToMenu(this.localization("Rewind Enabled" + " (" + this.localization("Requires restart") + ")"), "rewindEnabled", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, "disabled", speedOptions, true);

        if (this.rewindEnabled) {
            addToMenu(this.localization("Rewind Granularity"), "rewind-granularity", [
                "1", "3", "6", "12", "25", "50", "100"
            ], "6", speedOptions, true);
        }

        const inputOptions = createSettingParent(true, "Input Options", home);

        addToMenu(this.localization("Menubar Mouse Trigger"), "menubarBehavior", {
            "downward": this.localization("Downward Movement"),
            "anywhere": this.localization("Movement Anywhere"),
        }, "downward", inputOptions, true);

        addToMenu(this.localization("Direct Keyboard Input"), "keyboardInput", {
            "disabled": this.localization("Disabled"),
            "enabled": this.localization("Enabled"),
        }, ((this.defaultCoreOpts && this.defaultCoreOpts.useKeyboard === true) ? "enabled" : "disabled"), inputOptions, true);

        addToMenu(this.localization("Forward Alt key"), "altKeyboardInput", {
            "disabled": this.localization("Disabled"),
            "enabled": this.localization("Enabled"),
        }, "disabled", inputOptions, true);

        addToMenu(this.localization("Lock Mouse"), "lockMouse", {
            "disabled": this.localization("Disabled"),
            "enabled": this.localization("Enabled"),
        }, (this.enableMouseLock === true ? "enabled" : "disabled"), inputOptions, true);

        checkForEmptyMenu(inputOptions);

        if (this.saveInBrowserSupported()) {
            const saveStateOpts = createSettingParent(true, "Save States", home);
            addToMenu(this.localization("Save State Slot"), "save-state-slot", ["1", "2", "3", "4", "5", "6", "7", "8", "9"], "1", saveStateOpts, true);
            addToMenu(this.localization("Save State Location"), "save-state-location", {
                "download": this.localization("Download"),
                "browser": this.localization("Keep in Browser")
            }, "download", saveStateOpts, true);
            addToMenu(this.localization("System Save interval"), "save-save-interval", {
                "0": "Disabled",
                "30": "30 seconds",
                "60": "1 minute",
                "300": "5 minutes",
                "600": "10 minutes",
                "900": "15 minutes",
                "1800": "30 minutes"
            }, "300", saveStateOpts, true);
            checkForEmptyMenu(saveStateOpts);
        }

        if (this.touch || this.hasTouchScreen) {
            const virtualGamepad = createSettingParent(true, "Virtual Gamepad", home);
            addToMenu(this.localization("Virtual Gamepad"), "virtual-gamepad", {
                "enabled": this.localization("Enabled"),
                "disabled": this.localization("Disabled")
            }, isMobile ? "enabled" : "disabled", virtualGamepad, true);
            addToMenu(this.localization("Menu Bar Button"), "menu-bar-button", {
                "visible": this.localization("visible"),
                "hidden": this.localization("hidden")
            }, "visible", virtualGamepad, true);
            addToMenu(this.localization("Left Handed Mode"), "virtual-gamepad-left-handed-mode", {
                "enabled": this.localization("Enabled"),
                "disabled": this.localization("Disabled")
            }, "disabled", virtualGamepad, true);
            checkForEmptyMenu(virtualGamepad);
        }

        let coreOpts;
        try {
            coreOpts = this.gameManager.getCoreOptions();
        } catch (e) { }
        if (coreOpts) {
            const coreOptions = createSettingParent(true, "Backend Core Options", home);
            coreOpts.split("\n").forEach((line, index) => {
                let option = line.split("; ");
                let name = option[0];
                let options = option[1].split("|"),
                    optionName = name.split("|")[0].replace(/_/g, " ").replace(/.+\-(.+)/, "$1");
                options.slice(1, -1);
                if (options.length === 1) return;
                let availableOptions = {};
                for (let i = 0; i < options.length; i++) {
                    availableOptions[options[i]] = this.localization(options[i], this.config.settingsLanguage);
                }
                addToMenu(this.localization(optionName, this.config.settingsLanguage),
                    name.split("|")[0], availableOptions,
                    (name.split("|").length > 1) ? name.split("|")[1] : options[0].replace("(Default) ", ""),
                    coreOptions,
                    true);
            })
            checkForEmptyMenu(coreOptions);
        }

        /*
        this.retroarchOpts = [
            {
                title: "Audio Latency", // String
                name: "audio_latency", // String - value to be set in retroarch.cfg
                // options should ALWAYS be strings here...
                options: ["8", "16", "32", "64", "128"], // values
                options: {"8": "eight", "16": "sixteen", "32": "thirty-two", "64": "sixty-four", "128": "one hundred-twenty-eight"}, // This also works
                default: "128", // Default
                isString: false // Surround value with quotes in retroarch.cfg file?
            }
        ];*/

        if (this.retroarchOpts && Array.isArray(this.retroarchOpts)) {
            const retroarchOptsMenu = createSettingParent(true, "RetroArch Options" + " (" + this.localization("Requires restart") + ")", home);
            this.retroarchOpts.forEach(option => {
                addToMenu(this.localization(option.title, this.config.settingsLanguage),
                    option.name,
                    option.options,
                    option.default,
                    retroarchOptsMenu,
                    true);
            })
            checkForEmptyMenu(retroarchOptsMenu);
        }

        checkForEmptyMenu(graphicsOptions);
        checkForEmptyMenu(speedOptions);

        this.settingsMenu.appendChild(nested);

        this.settingParent.appendChild(this.settingsMenu);
        this.settingParent.style.position = "relative";

        this.settingsMenu.style.display = "";
        const homeSize = this.getElementSize(home);
        nested.style.width = (homeSize.width + 20) + "px";
        nested.style.height = homeSize.height + "px";

        this.settingsMenu.style.display = "none";

        if (this.debug) {
            console.log("Available core options", allOpts);
        }

        if (this.config.defaultOptions) {
            for (const k in this.config.defaultOptions) {
                this.changeSettingOption(k, this.config.defaultOptions[k], true);
            }
        }

        if (parentMenuCt === 0) {
            this.on("start", () => {
                this.elements.bottomBar.settings[0][0].style.display = "none";
            });
        }
    }
    createSubPopup(hidden) {
        const popup = this.createElement("div");
        popup.classList.add("ejs_popup_container");
        popup.classList.add("ejs_popup_container_box");
        const popupMsg = this.createElement("div");
        popupMsg.innerText = "";
        if (hidden) popup.setAttribute("hidden", "");
        popup.appendChild(popupMsg);
        return [popup, popupMsg];
    }

    defineNetplayFunctions() {
        function guidGenerator() {
            const S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
        this.netplay.url = this.config.netplayUrl;
        while (this.netplay.url.endsWith("/")) {
            this.netplay.url = this.netplay.url.substring(0, this.netplay.url.length - 1);
        }
        this.netplay.current_frame = 0;
        this.netplay.getOpenRooms = async () => {
            return JSON.parse(await (await fetch(this.netplay.url + "/list?domain=" + window.location.host + "&game_id=" + this.config.gameId)).text());
        }
        this.netplay.updateTableList = async () => {
            const addToTable = (id, name, current, max) => {
                const row = this.createElement("tr");
                row.classList.add("ejs_netplay_table_row");
                const addToHeader = (text) => {
                    const item = this.createElement("td");
                    item.innerText = text;
                    item.style.padding = "10px 0";
                    item.style["text-align"] = "center";
                    row.appendChild(item);
                    return item;
                }
                addToHeader(name).style["text-align"] = "left";
                addToHeader(current + "/" + max).style.width = "80px";

                const parent = addToHeader("");
                parent.style.width = "80px";
                this.netplay.table.appendChild(row);
                if (current < max) {
                    const join = this.createElement("button");
                    join.classList.add("ejs_netplay_join_button");
                    join.classList.add("ejs_button_button");
                    join.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
                    join.innerText = this.localization("Join");
                    parent.appendChild(join);
                    this.addEventListener(join, "click", (e) => {
                        this.netplay.joinRoom(id, name);
                    })
                    return join;
                }
            }
            const open = await this.netplay.getOpenRooms();
            //console.log(open);
            this.netplay.table.innerHTML = "";
            for (const k in open) {
                addToTable(k, open[k].room_name, open[k].current, open[k].max);//todo: password
            }
        }
        this.netplay.showOpenRoomDialog = () => {
            const popups = this.createSubPopup();
            this.netplayMenu.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent"); //Hehe
            const popup = popups[1];

            const header = this.createElement("div");
            const title = this.createElement("h2");
            title.innerText = this.localization("Create a room");
            title.classList.add("ejs_netplay_name_heading");
            header.appendChild(title);
            popup.appendChild(header);

            const main = this.createElement("div");

            main.classList.add("ejs_netplay_header");
            const rnhead = this.createElement("strong");
            rnhead.innerText = this.localization("Room Name");
            const rninput = this.createElement("input");
            rninput.type = "text";
            rninput.setAttribute("maxlength", 20);

            const maxhead = this.createElement("strong");
            maxhead.innerText = this.localization("Max Players");
            const maxinput = this.createElement("select");
            maxinput.setAttribute("disabled", "disabled");
            const val2 = this.createElement("option");
            val2.value = 2;
            val2.innerText = "2";
            const val3 = this.createElement("option");
            val3.value = 3;
            val3.innerText = "3";
            const val4 = this.createElement("option");
            val4.value = 4;
            val4.innerText = "4";
            maxinput.appendChild(val2);
            maxinput.appendChild(val3);
            maxinput.appendChild(val4);

            const pwhead = this.createElement("strong");
            pwhead.innerText = this.localization("Password (optional)");
            const pwinput = this.createElement("input");
            pwinput.type = "text";
            pwinput.setAttribute("maxlength", 20);

            main.appendChild(rnhead);
            main.appendChild(this.createElement("br"));
            main.appendChild(rninput);

            main.appendChild(maxhead);
            main.appendChild(this.createElement("br"));
            main.appendChild(maxinput);

            main.appendChild(pwhead);
            main.appendChild(this.createElement("br"));
            main.appendChild(pwinput);

            popup.appendChild(main);

            popup.appendChild(this.createElement("br"));
            const submit = this.createElement("button");
            submit.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            submit.style.margin = "0 10px";
            submit.innerText = this.localization("Submit");
            popup.appendChild(submit);
            this.addEventListener(submit, "click", (e) => {
                if (!rninput.value.trim()) return;
                this.netplay.openRoom(rninput.value.trim(), parseInt(maxinput.value), pwinput.value.trim());
                popups[0].remove();
            })
            const close = this.createElement("button");
            close.classList.add("ejs_button_button");
            close.classList.add("ejs_popup_submit");
            close.style.margin = "0 10px";
            close.innerText = this.localization("Close");
            popup.appendChild(close);
            this.addEventListener(close, "click", (e) => {
                popups[0].remove();
            })
        }
        this.netplay.startSocketIO = (callback) => {
            this.netplay.socket = io(this.netplay.url);
            this.netplay.socket.on("connect", () => callback());
            this.netplay.socket.on("users-updated", (users) => {
                this.netplay.reset();
                if (this.debug) console.log(users);
                this.netplay.players = users;
                this.netplay.updatePlayersTable();
                if (this.netplay.owner) this.netplay.sync();
            })
            this.netplay.socket.on("disconnect", () => this.netplay.roomLeft());
            this.netplay.socket.on("data-message", (data) => {
                this.netplay.dataMessage(data);
            })
        }
        this.netplay.openRoom = (roomName, maxPlayers, password) => {
            const sessionid = guidGenerator();
            this.netplay.playerID = guidGenerator();
            this.netplay.players = {};
            this.netplay.extra = {
                domain: window.location.host,
                game_id: this.config.gameId,
                room_name: roomName,
                player_name: this.netplay.name,
                userid: this.netplay.playerID,
                sessionid: sessionid
            }
            this.netplay.players[this.netplay.playerID] = this.netplay.extra;
            this.netplay.users = {};

            this.netplay.startSocketIO((error) => {
                this.netplay.socket.emit("open-room", {
                    extra: this.netplay.extra,
                    maxPlayers: maxPlayers,
                    password: password
                }, (error) => {
                    if (error) {
                        if (this.debug) console.log("error: ", error);
                        return;
                    }
                    this.netplay.roomJoined(true, roomName, password, sessionid);
                })
            });
        }
        this.netplay.leaveRoom = () => {
            if (this.debug) console.log("asd");
            this.netplay.roomLeft();
        }
        this.netplay.joinRoom = (sessionid, roomName) => {
            this.netplay.playerID = guidGenerator();
            this.netplay.players = {};
            this.netplay.extra = {
                domain: window.location.host,
                game_id: this.config.gameId,
                room_name: roomName,
                player_name: this.netplay.name,
                userid: this.netplay.playerID,
                sessionid: sessionid
            }
            this.netplay.players[this.netplay.playerID] = this.netplay.extra;

            this.netplay.startSocketIO((error) => {
                this.netplay.socket.emit("join-room", {
                    extra: this.netplay.extra//,
                    //password: password
                }, (error, users) => {
                    if (error) {
                        if (this.debug) console.log("error: ", error);
                        return;
                    }
                    this.netplay.players = users;
                    //this.netplay.roomJoined(false, roomName, password, sessionid);
                    this.netplay.roomJoined(false, roomName, "", sessionid);
                })
            });
        }
        this.netplay.roomJoined = (isOwner, roomName, password, roomId) => {
            //Will already assume this.netplay.players has been refreshed
            this.isNetplay = true;
            this.netplay.inputs = {};
            this.netplay.owner = isOwner;
            if (this.debug) console.log(this.netplay.extra);
            this.netplay.roomNameElem.innerText = roomName;
            this.netplay.tabs[0].style.display = "none";
            this.netplay.tabs[1].style.display = "";
            if (password) {
                this.netplay.passwordElem.style.display = "";
                this.netplay.passwordElem.innerText = this.localization("Password") + ": " + password
            } else {
                this.netplay.passwordElem.style.display = "none";
            }
            this.netplay.createButton.innerText = this.localization("Leave Room");
            this.netplay.updatePlayersTable();
            if (!this.netplay.owner) {
                this.netplay.oldStyles = [
                    this.elements.bottomBar.cheat[0].style.display,
                    this.elements.bottomBar.playPause[0].style.display,
                    this.elements.bottomBar.playPause[1].style.display,
                    this.elements.bottomBar.restart[0].style.display,
                    this.elements.bottomBar.loadState[0].style.display,
                    this.elements.bottomBar.saveState[0].style.display,
                    this.elements.bottomBar.saveSavFiles[0].style.display,
                    this.elements.bottomBar.loadSavFiles[0].style.display,
                    this.elements.contextMenu.save.style.display,
                    this.elements.contextMenu.load.style.display
                ]
                this.elements.bottomBar.cheat[0].style.display = "none";
                this.elements.bottomBar.playPause[0].style.display = "none";
                this.elements.bottomBar.playPause[1].style.display = "none";
                this.elements.bottomBar.restart[0].style.display = "none";
                this.elements.bottomBar.loadState[0].style.display = "none";
                this.elements.bottomBar.saveState[0].style.display = "none";
                this.elements.bottomBar.saveSavFiles[0].style.display = "none";
                this.elements.bottomBar.loadSavFiles[0].style.display = "none";
                this.elements.contextMenu.save.style.display = "none";
                this.elements.contextMenu.load.style.display = "none";
                this.gameManager.resetCheat();
            } else {
                this.netplay.oldStyles = [
                    this.elements.bottomBar.cheat[0].style.display
                ]
            }
            this.elements.bottomBar.cheat[0].style.display = "none";
        }
        this.netplay.updatePlayersTable = () => {
            const table = this.netplay.playerTable;
            table.innerHTML = "";
            const addToTable = (num, playerName) => {
                const row = this.createElement("tr");
                const addToHeader = (text) => {
                    const item = this.createElement("td");
                    item.innerText = text;
                    row.appendChild(item);
                    return item;
                }
                addToHeader(num).style.width = "80px";
                addToHeader(playerName);
                addToHeader("").style.width = "80px"; //"join" button
                table.appendChild(row);
            }
            let i = 1;
            for (const k in this.netplay.players) {
                addToTable(i, this.netplay.players[k].player_name);
                i++;
            }
        }
        this.netplay.roomLeft = () => {
            this.isNetplay = false;
            this.netplay.tabs[0].style.display = "";
            this.netplay.tabs[1].style.display = "none";
            this.netplay.extra = null;
            this.netplay.playerID = null;
            this.netplay.createButton.innerText = this.localization("Create a Room");
            this.netplay.socket.disconnect();
            this.elements.bottomBar.cheat[0].style.display = this.netplay.oldStyles[0];
            if (!this.netplay.owner) {
                this.elements.bottomBar.playPause[0].style.display = this.netplay.oldStyles[1];
                this.elements.bottomBar.playPause[1].style.display = this.netplay.oldStyles[2];
                this.elements.bottomBar.restart[0].style.display = this.netplay.oldStyles[3];
                this.elements.bottomBar.loadState[0].style.display = this.netplay.oldStyles[4];
                this.elements.bottomBar.saveState[0].style.display = this.netplay.oldStyles[5];
                this.elements.bottomBar.saveSavFiles[0].style.display = this.netplay.oldStyles[6];
                this.elements.bottomBar.loadSavFiles[0].style.display = this.netplay.oldStyles[7];
                this.elements.contextMenu.save.style.display = this.netplay.oldStyles[8];
                this.elements.contextMenu.load.style.display = this.netplay.oldStyles[9];
            }
            this.updateCheatUI();
        }
        this.netplay.setLoading = (loading) => {
            if (this.debug) console.log("loading:", loading);
        }
        let syncing = false;
        this.netplay.sync = async () => {
            if (syncing) return;
            syncing = true;
            if (this.debug) console.log("sync")
            this.netplay.ready = 0;
            const state = this.gameManager.getState();
            this.netplay.sendMessage({
                state: state
            });
            this.netplay.setLoading(true);
            this.pause(true);
            this.netplay.ready++;
            this.netplay.current_frame = 0;
            if (this.netplay.ready === this.netplay.getUserCount()) {
                this.play(true);
            }
            syncing = false;
        }
        this.netplay.getUserIndex = (user) => {
            let i = 0;
            for (const k in this.netplay.players) {
                if (k === user) return i;
                i++;
            }
            return -1;
        }
        this.netplay.getUserCount = () => {
            let i = 0;
            for (const k in this.netplay.players) i++;
            return i;
        }
        let justReset = false;
        this.netplay.dataMessage = (data) => {
            //console.log(data);
            if (data.sync === true && this.netplay.owner) {
                this.netplay.sync();
            }
            if (data.state) {
                this.netplay.wait = true;
                this.netplay.setLoading(true);
                this.pause(true);
                this.gameManager.loadState(new Uint8Array(data.state));
                this.netplay.sendMessage({ ready: true });
            }
            if (data.play && !this.owner) {
                this.play(true);
            }
            if (data.pause && !this.owner) {
                this.pause(true);
            }
            if (data.ready && this.netplay.owner) {
                this.netplay.ready++;
                if (this.netplay.ready === this.netplay.getUserCount()) {
                    this.netplay.sendMessage({ readyready: true });
                    this.netplay.reset();
                    setTimeout(() => this.play(true), 48);
                    this.netplay.setLoading(false);
                }
            }
            if (data.readyready) {
                this.netplay.setLoading(false);
                this.netplay.reset();
                this.play(true);
            }
            if (data.shortPause) console.log(data.shortPause);
            if (data.shortPause && data.shortPause !== this.netplay.playerID) {
                this.pause(true);
                this.netplay.wait = true;
                setTimeout(() => this.play(true), 48);
            }
            if (data["sync-control"]) {
                data["sync-control"].forEach((value) => {
                    let inFrame = parseInt(value.frame);
                    let frame = this.netplay.currentFrame;
                    if (!value.connected_input || value.connected_input[0] < 0) return;
                    //if (value.connected_input[0] === this.netplay.getUserIndex(this.netplay.playerID)) return;
                    console.log(value, inFrame, frame);
                    if (inFrame === frame) {
                        inFrame++;
                        this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                    }
                    this.netplay.inputsData[inFrame] || (this.netplay.inputsData[inFrame] = []);
                    this.netplay.inputsData[frame] || (this.netplay.inputsData[frame] = []);
                    if (this.netplay.owner) {
                        this.netplay.inputsData[frame].push(value);
                        this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                        if (frame - 10 >= inFrame) {
                            this.netplay.wait = true;
                            this.pause(true);
                            setTimeout(() => {
                                this.play(true);
                                this.netplay.wait = false;
                            }, 48)
                        }
                    } else {
                        this.netplay.inputsData[inFrame].push(value);
                        if (this.netplay.inputsData[frame]) {
                            this.play(true);
                        }
                        if (frame + 10 <= inFrame && inFrame > this.netplay.init_frame + 100) {
                            this.netplay.sendMessage({ shortPause: this.netplay.playerID });
                        }
                    }
                });
            }
            if (data.restart) {
                this.gameManager.restart();
                this.netplay.reset();
                this.play(true);
            }
        }
        this.netplay.simulateInput = (player, index, value, resp) => {
            if (!this.isNetplay) return;
            if (player !== 0 && !resp) return;
            player = this.netplay.getUserIndex(this.netplay.playerID);
            let frame = this.netplay.currentFrame;
            if (this.netplay.owner) {
                if (!this.netplay.inputsData[frame]) {
                    this.netplay.inputsData[frame] = [];
                }
                this.netplay.inputsData[frame].push({
                    frame: frame,
                    connected_input: [player, index, value]
                })
                this.gameManager.functions.simulateInput(player, index, value);
            } else {
                this.netplay.sendMessage({
                    "sync-control": [{
                        frame: frame + 10,
                        connected_input: [player, index, value]
                    }]
                })
            }
        }
        this.netplay.sendMessage = (data) => {
            this.netplay.socket.emit("data-message", data);
        }
        this.netplay.reset = () => {
            this.netplay.init_frame = this.netplay.currentFrame;
            this.netplay.inputsData = {};
        }
        //let fps;
        //let lastTime;
        this.netplay.init_frame = 0;
        this.netplay.currentFrame = 0;
        this.netplay.inputsData = {};
        this.Module.postMainLoop = () => {
            //const newTime = window.performance.now();
            //fps = 1000 / (newTime - lastTime);
            //console.log(fps);
            //lastTime = newTime;
            //frame syncing - working
            //control syncing - broken
            this.netplay.currentFrame = parseInt(this.gameManager.getFrameNum()) - this.netplay.init_frame;
            if (!this.isNetplay) return;
            if (this.netplay.owner) {
                let to_send = [];
                let i = this.netplay.currentFrame - 1;
                this.netplay.inputsData[i] ? this.netplay.inputsData[i].forEach((value) => {
                    value.frame += 10;
                    to_send.push(value);
                }) : to_send.push({ frame: i + 10 });
                this.netplay.sendMessage({ "sync-control": to_send });
            } else {
                if (this.netplay.currentFrame <= 0 || this.netplay.inputsData[this.netplay.currentFrame]) {
                    this.netplay.wait = false;
                    this.play();
                    this.netplay.inputsData[this.netplay.currentFrame].forEach((value) => {
                        if (!value.connected_input) return;
                        console.log(value.connected_input);
                        this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                    })
                } else if (!this.netplay.syncing) {
                    console.log("sync");
                    this.pause(true);
                    this.netplay.sendMessage({ sync: true });
                    this.netplay.syncing = true;
                }
            }
            if (this.netplay.currentFrame % 100 === 0) {
                Object.keys(this.netplay.inputsData).forEach(value => {
                    if (value < this.netplay.currentFrame - 50) {
                        this.netplay.inputsData[value] = null;
                        delete this.netplay.inputsData[value];
                    }
                })
            }
        }

        this.netplay.updateList = {
            start: () => {
                this.netplay.updateList.interval = setInterval(this.netplay.updateTableList.bind(this), 1000);
            },
            stop: () => {
                clearInterval(this.netplay.updateList.interval);
            }
        }
    }

    updateCheatUI() {
        if (!this.gameManager) return;
        this.elements.cheatRows.innerHTML = "";

        const addToMenu = (desc, checked, code, is_permanent, i) => {
            const row = this.createElement("div");
            row.classList.add("ejs_cheat_row");
            const input = this.createElement("input");
            input.type = "checkbox";
            input.checked = checked;
            input.value = i;
            input.id = "ejs_cheat_switch_" + i;
            row.appendChild(input);
            const label = this.createElement("label");
            label.for = "ejs_cheat_switch_" + i;
            label.innerText = desc;
            row.appendChild(label);
            label.addEventListener("click", (e) => {
                input.checked = !input.checked;
                this.cheats[i].checked = input.checked;
                this.cheatChanged(input.checked, code, i);
                this.saveSettings();
            })
            if (!is_permanent) {
                const close = this.createElement("a");
                close.classList.add("ejs_cheat_row_button");
                close.innerText = "×";
                row.appendChild(close);
                close.addEventListener("click", (e) => {
                    this.cheatChanged(false, code, i);
                    this.cheats.splice(i, 1);
                    this.updateCheatUI();
                    this.saveSettings();
                })
            }
            this.elements.cheatRows.appendChild(row);
            this.cheatChanged(checked, code, i);
        }
        this.gameManager.resetCheat();
        for (let i = 0; i < this.cheats.length; i++) {
            addToMenu(this.cheats[i].desc, this.cheats[i].checked, this.cheats[i].code, this.cheats[i].is_permanent, i);
        }
    }
    cheatChanged(checked, code, index) {
        if (!this.gameManager) return;
        this.gameManager.setCheat(index, checked, code);
    }

    enableShader(name) {
        if (!this.gameManager) return;
        try {
            this.Module.FS.unlink("/shader/shader.glslp");
        } catch (e) { }

        if (name === "disabled" || !this.config.shaders[name]) {
            this.gameManager.toggleShader(0);
            return;
        }

        const shaderConfig = this.config.shaders[name];

        if (typeof shaderConfig === "string") {
            this.Module.FS.writeFile("/shader/shader.glslp", shaderConfig, {}, "w+");
        } else {
            const shader = shaderConfig.shader;
            this.Module.FS.writeFile("/shader/shader.glslp", shader.type === "base64" ? atob(shader.value) : shader.value, {}, "w+");
            if (shaderConfig.resources && shaderConfig.resources.length) {
                shaderConfig.resources.forEach(resource => {
                    this.Module.FS.writeFile(`/shader/${resource.name}`, resource.type === "base64" ? atob(resource.value) : resource.value, {}, "w+");
                });
            }
        }

        this.gameManager.toggleShader(1);
    }

    screenshot(callback, source, format, upscale) {
        const imageFormat = format || this.getSettingValue("screenshotFormat") || this.capture.photo.format;
        const imageUpscale = upscale || parseInt(this.getSettingValue("screenshotUpscale") || this.capture.photo.upscale);
        const screenshotSource = source || this.getSettingValue("screenshotSource") || this.capture.photo.source;
        const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
        const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
        const gameWidth = this.gameManager.getVideoDimensions("width") || 256;
        const gameHeight = this.gameManager.getVideoDimensions("height") || 224;
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        let width = this.canvas.width;
        let height = this.canvas.height;
        let scaleHeight = imageUpscale;
        let scaleWidth = imageUpscale;
        let scale = 1;

        if (screenshotSource === "retroarch") {
            if (width >= height) {
                width = height * aspectRatio;
            } else if (width < height) {
                height = width / aspectRatio;
            }
            this.gameManager.screenshot().then(screenshot => {
                const blob = new Blob([screenshot], { type: "image/png" });
                if (imageUpscale === 0) {
                    callback(blob, "png");
                } else if (imageUpscale > 1) {
                    scale = imageUpscale;
                    const img = new Image();
                    const screenshotUrl = URL.createObjectURL(blob);
                    img.src = screenshotUrl;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = width * scale;
                        canvas.height = height * scale;
                        const ctx = canvas.getContext("2d", { alpha: false });
                        ctx.imageSmoothingEnabled = false;
                        ctx.scale(scaleWidth, scaleHeight);
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            callback(blob, imageFormat);
                            img.remove();
                            URL.revokeObjectURL(screenshotUrl);
                            canvas.remove();
                        }, "image/" + imageFormat, 1);
                    }
                }
            });
        } else if (screenshotSource === "canvas") {
            if (width >= height && !videoTurned) {
                width = height * aspectRatio;
            } else if (width < height && !videoTurned) {
                height = width / aspectRatio;
            } else if (width >= height && videoTurned) {
                width = height * (1 / aspectRatio);
            } else if (width < height && videoTurned) {
                width = height / (1 / aspectRatio);
            }
            if (imageUpscale === 0) {
                scale = gameHeight / height;
                scaleHeight = scale;
                scaleWidth = scale;
            } else if (imageUpscale > 1) {
                scale = imageUpscale;
            }
            const captureCanvas = document.createElement("canvas");
            captureCanvas.width = width * scale;
            captureCanvas.height = height * scale;
            captureCanvas.style.display = "none";
            const captureCtx = captureCanvas.getContext("2d", { alpha: false });
            captureCtx.imageSmoothingEnabled = false;
            captureCtx.scale(scale, scale);
            const imageAspect = this.canvas.width / this.canvas.height;
            const canvasAspect = width / height;
            let offsetX = 0;
            let offsetY = 0;

            if (imageAspect > canvasAspect) {
                offsetX = (this.canvas.width - width) / -2;
            } else if (imageAspect < canvasAspect) {
                offsetY = (this.canvas.height - height) / -2;
            }
            const drawNextFrame = () => {
                captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
                captureCanvas.toBlob((blob) => {
                    callback(blob, imageFormat);
                    captureCanvas.remove();
                }, "image/" + imageFormat, 1);
            };
            requestAnimationFrame(drawNextFrame);
        }
    }

    async takeScreenshot(source, format, upscale) {
        return new Promise((resolve) => {
            this.screenshot((blob, format) => {
                resolve({ blob, format });
            }, source, format, upscale);
        });
    }

    collectScreenRecordingMediaTracks(canvasEl, fps) {
        let videoTrack = null;
        const videoTracks = canvasEl.captureStream(fps).getVideoTracks();
        if (videoTracks.length !== 0) {
            videoTrack = videoTracks[0];
        } else {
            console.error("Unable to capture video stream");
            return null;
        }

        let audioTrack = null;
        if (this.Module.AL && this.Module.AL.currentCtx && this.Module.AL.currentCtx.audioCtx) {
            const alContext = this.Module.AL.currentCtx;
            const audioContext = alContext.audioCtx;

            const gainNodes = [];
            for (let sourceIdx in alContext.sources) {
                gainNodes.push(alContext.sources[sourceIdx].gain);
            }

            const merger = audioContext.createChannelMerger(gainNodes.length);
            gainNodes.forEach(node => node.connect(merger));

            const destination = audioContext.createMediaStreamDestination();
            merger.connect(destination);

            const audioTracks = destination.stream.getAudioTracks();
            if (audioTracks.length !== 0) {
                audioTrack = audioTracks[0];
            }
        }

        const stream = new MediaStream();
        if (videoTrack && videoTrack.readyState === "live") {
            stream.addTrack(videoTrack);
        }
        if (audioTrack && audioTrack.readyState === "live") {
            stream.addTrack(audioTrack);
        }
        return stream;
    }

    /**
     * Load a new ROM without destroying the emulator instance
     * @param {string} romPath - Path to the ROM file
     */
    async loadROM(romPath) {
        try {
            // Reset game state
            this.reset();

            // Load new ROM
            const gameData = await this.downloadFile(romPath);
            if (gameData === -1) {
                throw new Error("Failed to download ROM file");
            }

            // Update game manager with new ROM
            if (this.gameManager) {
                this.gameManager.loadROM(romPath);
            }

            console.log("ROM loaded successfully:", romPath);
        } catch (error) {
            console.error("Error loading ROM:", error);
            throw error;
        }
    }

    /**
     * Reset the emulator state
     */
    reset() {
        // Reset internal state variables
        this.started = false;
        this.paused = true;

        // Clear any existing game data if needed
        if (this.gameManager) {
            // Perform any necessary cleanup in the game manager
            if (this.gameManager.reset) {
                this.gameManager.reset();
            }
        }

        console.log("Emulator state reset");
    }




    /**
     * Enhanced screen recording method
     */
    screenRecord() {
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

        const captureCanvas = document.createElement("canvas");
        const captureCtx = captureCanvas.getContext("2d", { alpha: false });
        captureCtx.fillStyle = "#000";
        captureCtx.imageSmoothingEnabled = false;
        const updateSize = () => {
            width = this.canvas.width;
            height = this.canvas.height;
            frameAspect = width / height
            if (width >= height && !videoTurned) {
                width = height * aspectRatio;
            } else if (width < height && !videoTurned) {
                height = width / aspectRatio;
            } else if (width >= height && videoTurned) {
                width = height * (1 / aspectRatio);
            } else if (width < height && videoTurned) {
                width = height / (1 / aspectRatio);
            }
            canvasAspect = width / height;
            captureCanvas.width = width * captureUpscale;
            captureCanvas.height = height * captureUpscale;
            captureCtx.scale(captureUpscale, captureUpscale);
            if (frameAspect > canvasAspect) {
                offsetX = (this.canvas.width - width) / -2;
            } else if (frameAspect < canvasAspect) {
                offsetY = (this.canvas.height - height) / -2;
            }
        }
        updateSize();
        this.addEventListener(this.canvas, "resize", () => {
            updateSize();
        });

        let animation = true;

        const drawNextFrame = () => {
            captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
            if (animation) {
                requestAnimationFrame(drawNextFrame);
            }
        };
        requestAnimationFrame(drawNextFrame);

        const chunks = [];
        const tracks = this.collectScreenRecordingMediaTracks(captureCanvas, captureFps);
        const recorder = new MediaRecorder(tracks, {
            videoBitsPerSecond: captureVideoBitrate,
            audioBitsPerSecond: captureAudioBitrate,
            mimeType: "video/" + captureFormat
        });
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

        // Store reference to recorder for cleanup
        this.recorder = recorder;

        return recorder;
    }
}

window.EmulatorJS = EmulatorJS;