// 核心系统模块 - 包含核心系统初始化相关功能

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function initGameCore(js, wasm, thread) {
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
        // 如果是字符串，直接替换
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

export function initModule(wasmData, threadData) {
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

export function downloadGameCore() {
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
    const report = "cores/reports/" + this.getCore() + ".json";
    this.downloadFile(report, null, false, { responseType: "text", method: "GET" }).then(async rep => {
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
        console.log("File not found, attemping to fetch from emulatorjs cdn.");
        console.error("**THIS METHOD IS A FAILSAFE, AND NOT OFFICIALLY SUPPORTED. USE AT YOUR OWN RISK**");
        const res = await this.downloadFile("https://cdn.emulatorjs.org/latest/" + corePath, (progress) => {
            this.textElem.innerText = this.localization("Download Game Core") + progress;
        }, false, { responseType: "arraybuffer", method: "GET" });
        if (res === -1) {
            this.startGameError(this.localization("Network Error"));
            return;
        }
        gotCore(res.data);
        const limit = (typeof this.config.cacheLimit === "number") ? this.config.cacheLimit : 1073741824;
        if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported()) {
            this.storage.core.put(filename, {
                "content-length": res.headers["content-length"],
                data: res.data,
                version: rep.buildStart
            })
        }
    }).catch(e => {
        console.warn(e);
        this.startGameError(this.localization("Network Error"));
    })
}

export function checkCoreCompatibility(version) {
    if (this.versionAsInt(version.minimumEJSVersion) > this.versionAsInt(this.ejs_version)) {
        this.startGameError(this.localization("Outdated EmulatorJS version"));
        throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
    }
}

export function startGameError(message) {
    console.log(message);
    this.textElem.innerText = message;
    this.textElem.classList.add("ejs_error_text");

    this.setupSettingsMenu();
    this.loadSettings();

    this.menu.failedToStart();
    this.handleResize();
    this.failedToStart = true;
}

export function getBaseFileName(force) {
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

export function saveInBrowserSupported() {
    return !!window.indexedDB && (typeof this.config.gameName === "string" || !this.config.gameUrl.startsWith("blob:"));
}

export function displayMessage(message, time) {
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

export function versionAsInt(version) {
    // 将版本号转换为整数进行比较
    const parts = version.split('.');
    let result = 0;
    for (let i = 0; i < parts.length; i++) {
        result = result * 1000 + parseInt(parts[i]);
    }
    return result;
}

export function toData(data, rv) {
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

export function checkCompression(data, msg, fileCbFunc) {
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