/**
 * 文件下载模块
 * 负责处理所有网络请求和文件下载
 */
import utils from './utils.js';

/**
 * 下载文件
 * @param {string} path - 文件路径
 * @param {function} progressCB - 进度回调函数
 * @param {boolean} notWithPath - 是否不使用基础路径
 * @param {object} opts - 选项
 * @returns {Promise} 下载结果
 */
export function downloadFile(path, progressCB, notWithPath, opts) {
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
        // 安全获取dataPath，确保不会导致URL构建错误
        const basePath = notWithPath ? "" : (this.config && typeof this.config.dataPath === 'string' ? this.config.dataPath : "");
        path = basePath + path;
        if (!notWithPath && this.config && this.config.filePaths && typeof this.config.filePaths[path.split("/").pop()] === "string") {
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

/**
 * 下载游戏核心
 */
export async function downloadGameCore() {
    this.textElem.innerText = this.localization("Download Game Core");
    
    // 安全获取核心名称
    const coreName = utils.getCore.call(this) || 'fceumm';
    
    if (!this.config.threads && utils.requiresThreads.call(this, coreName)) {
        this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
        console.warn("This core requires threads, but EJS_threads is not set!");
        return;
    }
    if (!this.supportsWebgl2 && utils.requiresWebGL2.call(this, coreName)) {
        this.startGameError(this.localization("Outdated graphics driver"));
        return;
    }
    if (this.config.threads && typeof window.SharedArrayBuffer !== "function") {
        this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
        console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
        return;
    }
    
    try {
        await this._downloadGameCoreInternal();
    } catch (error) {
        console.error("Error downloading game core:", error);
        this.startGameError(this.localization("Error downloading core"));
    }
}

/**
 * 内部核心下载实现
 * @private
 */
export async function _downloadGameCoreInternal() {
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
                if (this.elements && this.elements.bottomBar && this.elements.bottomBar.saveSavFiles) {
                    this.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
            }
            this.initGameCore(js, wasm, thread);
        });
    };
    
    // 安全获取核心名称
    const coreName = utils.getCore.call(this) || 'fceumm'; // 使用默认核心作为后备
    
    // 构建正确的报告URL
    const report = `cores/reports/${coreName}.json`;
    
    try {
        const rep = await downloadFile.call(this, report, null, false, { responseType: "text", method: "GET" });
        
        const reportData = rep === -1 || typeof rep === "string" || typeof rep.data === "string" ? {} : rep.data;
        
        if (!reportData.buildStart) {
            console.warn("Could not fetch core report JSON! Core caching will be disabled!");
            reportData.buildStart = Math.random() * 100;
        }
        
        if (this.webgl2Enabled === null) {
            this.webgl2Enabled = reportData.options ? reportData.options.defaultWebGL2 : false;
        }
        
        if (utils.requiresWebGL2.call(this, coreName)) {
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

        let legacy = (this.supportsWebgl2 && this.webgl2Enabled !== false) ? "" : "-legacy";
        let filename = `${coreName}${threads ? "-thread" : ""}${legacy}-wasm.data`;
        
        if (!this.debug) {
            try {
                const result = await this.storage.core.get(filename);
                if (result && result.version === reportData.buildStart) {
                    gotCore(result.data);
                    return;
                }
            } catch (error) {
                console.warn('Failed to get core from storage, proceeding with download:', error);
            }
        }
        
        const corePath = `cores/${filename}`;
        // 尝试从本地下载核心文件
        let res = await downloadFile.call(this, corePath, (progress) => {
            this.textElem.innerText = this.localization("Download Game Core") + progress;
        }, false, { responseType: "arraybuffer", method: "GET" });
    
    // 本地下载失败时尝试从CDN下载
    if (res === -1) {
        console.log("File not found locally, attemping to fetch from emulatorjs cdn.");
        console.error("**THIS METHOD IS A FAILSAFE, AND NOT OFFICIALLY SUPPORTED. USE AT YOUR OWN RISK**");
        // 安全获取ejs_version，确保不会导致endsWith调用错误
        const ejsVersion = typeof this.ejs_version === 'string' ? this.ejs_version : "4.2.8"; // 使用默认版本号作为后备
        let version = ejsVersion.endsWith("-beta") ? "nightly" : ejsVersion;
        res = await downloadFile.call(this, `https://cdn.emulatorjs.org/${version}/data/${corePath}`, (progress) => {
            this.textElem.innerText = this.localization("Download Game Core") + progress;
        }, true, { responseType: "arraybuffer", method: "GET" });
        
        if (res === -1) {
            // 提供更具体的错误信息，而不是简单地抛出"Outdated graphics driver"
            const errorMessage = this.supportsWebgl2 ? 
                `Error downloading core: ${filename}. Please ensure the core files are properly installed.` : 
                `This emulator requires WebGL 2 support. Your browser or graphics driver may be outdated.`;
            throw new Error(errorMessage);
        }
        
        console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
    }
    
    gotCore(res.data);
    
    // 缓存核心文件
    this.storage.core.put(filename, {
        version: reportData.buildStart,
        data: res.data
    });
    } catch (error) {
        console.error("Error in file download process:", error);
        throw error; // 重新抛出错误，让调用者处理
    }
}

/**
 * 初始化游戏核心
 * @param {Uint8Array|string} js - JavaScript代码
 * @param {Uint8Array} wasm - WebAssembly二进制数据
 * @param {Uint8Array} thread - Worker线程代码
 */
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
        // 如果是字符串，则直接替换
        modifiedJs = js.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
    }

    let script = utils.createElement.call(this, "script");
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

/**
 * 检查压缩文件
 * @param {Uint8Array} data - 数据
 * @param {string} msg - 消息
 * @param {function} fileCbFunc - 文件回调函数
 * @returns {Promise} 解压后的文件数据
 */
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

// 导出所有文件下载相关函数
export default {
    downloadFile,
    downloadGameCore,
    _downloadGameCoreInternal,
    initGameCore,
    checkCompression
};