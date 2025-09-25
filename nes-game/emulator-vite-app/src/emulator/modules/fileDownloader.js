// 文件下载模块

import { toData } from './utils.js';

/**
 * 下载文件
 * @param {string} path - 文件路径
 * @param {Function|null} progressCB - 进度回调函数
 * @param {boolean} notWithPath - 是否不包含路径前缀
 * @param {Object} opts - 选项对象
 * @param {Object} config - 配置对象
 * @returns {Promise<Object|number>} - 下载结果或错误代码
 */
export function downloadFile(path, progressCB, notWithPath, opts, config) {
    return new Promise(async cb => {
        const data = toData(path); //check other data types
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
        const basePath = notWithPath ? "" : config.dataPath;
        path = basePath + path;
        if (!notWithPath && config.filePaths && typeof config.filePaths[path.split("/").pop()] === "string") {
            path = config.filePaths[path.split("/").pop()];
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
 * @param {Object} config - 配置对象
 * @param {Object} textElem - 文本元素
 * @param {Object} storage - 存储对象
 * @param {Function} localization - 本地化函数
 * @param {Function} getCore - 获取核心函数
 * @param {Function} requiresThreads - 检查是否需要线程函数
 * @param {Function} requiresWebGL2 - 检查是否需要WebGL2函数
 * @param {Function} checkCompression - 检查压缩函数
 * @param {Function} startGameError - 游戏启动错误函数
 * @param {Function} checkCoreCompatibility - 检查核心兼容性函数
 * @param {Function} initGameCore - 初始化游戏核心函数
 * @param {boolean} supportsWebgl2 - 是否支持WebGL2
 * @param {boolean|null} webgl2Enabled - WebGL2是否启用
 * @param {string} ejs_version - EmulatorJS版本
 * @param {boolean} debug - 是否调试模式
 * @returns {Promise<void>} - Promise对象
 */
export async function downloadGameCore(
    config, 
    textElem, 
    storage, 
    localization, 
    getCore, 
    requiresThreads, 
    requiresWebGL2, 
    checkCompression, 
    startGameError, 
    checkCoreCompatibility, 
    initGameCore, 
    supportsWebgl2, 
    webgl2Enabled, 
    ejs_version,
    debug
) {
    textElem.innerText = localization("Download Game Core");
    if (!config.threads && requiresThreads(getCore(config))) {
        startGameError(localization("Error for site owner") + "\n" + localization("Check console"));
        console.warn("This core requires threads, but EJS_threads is not set!");
        return;
    }
    if (!supportsWebgl2 && requiresWebGL2(getCore(config))) {
        startGameError(localization("Outdated graphics driver"));
        return;
    }
    if (config.threads && typeof window.SharedArrayBuffer !== "function") {
        startGameError(localization("Error for site owner") + "\n" + localization("Check console"));
        console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
        return;
    }

    const gotCore = (data, extensions, coreName, repository, defaultCoreOpts, enableMouseLock, retroarchOpts, saveFileExt, elements) => {
        defaultCoreOpts = {};
        checkCompression(new Uint8Array(data), localization("Decompress Game Core")).then((data) => {
            let js, thread, wasm;
            for (let k in data) {
                if (k.endsWith(".wasm")) {
                    wasm = data[k];
                } else if (k.endsWith(".worker.js")) {
                    thread = data[k];
                } else if (k.endsWith(".js")) {
                    js = data[k];
                } else if (k === "build.json") {
                    checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                } else if (k === "core.json") {
                    let core = JSON.parse(new TextDecoder().decode(data[k]));
                    extensions = core.extensions;
                    coreName = core.name;
                    repository = core.repo;
                    defaultCoreOpts = core.options;
                    enableMouseLock = core.options.supportsMouse;
                    retroarchOpts = core.retroarchOpts;
                    saveFileExt = core.save;
                } else if (k === "license.txt") {
                    const license = new TextDecoder().decode(data[k]);
                }
            }

            if (saveFileExt === false && elements && elements.bottomBar) {
                elements.bottomBar.saveSavFiles[0].style.display = "none";
                elements.bottomBar.loadSavFiles[0].style.display = "none";
            }
            initGameCore(js, wasm, thread);
        });
    }

    const report = "cores/reports/" + getCore(config) + ".json";
    const rep = await downloadFile(report, null, false, { responseType: "text", method: "GET" }, config);
    
    let reportData = {};
    if (rep === -1 || typeof rep === "string" || typeof rep.data === "string") {
        reportData = {};
    } else {
        reportData = rep.data;
    }
    
    if (!reportData.buildStart) {
        console.warn("Could not fetch core report JSON! Core caching will be disabled!");
        reportData.buildStart = Math.random() * 100;
    }
    
    if (webgl2Enabled === null) {
        webgl2Enabled = reportData.options ? reportData.options.defaultWebGL2 : false;
    }
    
    if (requiresWebGL2(getCore(config))) {
        webgl2Enabled = true;
    }
    
    let threads = false;
    if (typeof window.SharedArrayBuffer === "function") {
        const opt = config.preGetSetting ? config.preGetSetting("ejs_threads") : null;
        if (opt) {
            threads = (opt === "enabled");
        } else {
            threads = config.threads;
        }
    }

    let legacy = (supportsWebgl2 && webgl2Enabled ? "" : "-legacy");
    let filename = getCore(config) + (threads ? "-thread" : "") + legacy + "-wasm.data";
    
    if (!debug) {
        const result = await storage.core.get(filename);
        if (result && result.version === reportData.buildStart) {
            gotCore(result.data);
            return;
        }
    }
    
    const corePath = "cores/" + filename;
    
    console.log("File not found, attemping to fetch from emulatorjs cdn.");
    console.error("**THIS METHOD IS A FAILSAFE, AND NOT OFFICIALLY SUPPORTED. USE AT YOUR OWN RISK**");
    
    let version = ejs_version.endsWith("-beta") ? "nightly" : ejs_version;
    
    const res = await downloadFile(
        `https://cdn.emulatorjs.org/${version}/data/${corePath}`, 
        (progress) => {
            textElem.innerText = localization("Download Game Core") + progress;
        }, 
        true, 
        { responseType: "arraybuffer", method: "GET" },
        config
    );
    
    if (res === -1) {
        if (!supportsWebgl2) {
            startGameError(localization("Outdated graphics driver"));
        } else {
            startGameError(localization("Error downloading core") + " (" + filename + ")");
        }
        return;
    }
    
    console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
    
    gotCore(res.data);
    
    storage.core.put(filename, {
        version: reportData.buildStart,
        data: res.data
    });
}

/**
 * 下载游戏文件
 * @param {string|Object} assetUrl - 资源URL
 * @param {string} type - 文件类型
 * @param {string} progressMessage - 进度消息
 * @param {string} decompressProgressMessage - 解压进度消息
 * @param {Object} config - 配置对象
 * @param {Object} textElem - 文本元素
 * @param {Object} storage - 存储对象
 * @param {Object} gameManager - 游戏管理器
 * @param {Function} checkCompression - 检查压缩函数
 * @param {Function} startGameError - 游戏启动错误函数
 * @param {boolean} debug - 是否调试模式
 * @returns {Promise<string>} - 资源URL
 */
export async function downloadGameFile(
    assetUrl, 
    type, 
    progressMessage, 
    decompressProgressMessage, 
    config, 
    textElem, 
    storage, 
    gameManager, 
    checkCompression, 
    startGameError, 
    debug
) {
    if ((typeof assetUrl !== "string" || !assetUrl.trim()) && !toData(assetUrl, true)) {
        return assetUrl;
    }
    
    const gotData = async (input, fileName) => {
        if (config.dontExtractBIOS === true) {
            gameManager.FS.writeFile(assetUrl, new Uint8Array(input));
            return assetUrl;
        }
        const data = await checkCompression(new Uint8Array(input), decompressProgressMessage);
        for (const k in data) {
            const coreFilename = "/" + fileName;
            const coreFilePath = coreFilename.substring(0, coreFilename.length - coreFilename.split("/").pop().length);
            if (k === "!!notCompressedData") {
                gameManager.FS.writeFile(coreFilePath + assetUrl.split("/").pop().split("#")[0].split("?")[0], data[k]);
                break;
            }
            if (k.endsWith("/")) continue;
            gameManager.FS.writeFile(coreFilePath + k.split("/").pop(), data[k]);
        }
    }

    textElem.innerText = progressMessage;
    let fileName = config.fileName || "game";
    
    if (!debug) {
        const res = await downloadFile(assetUrl, null, true, { method: "HEAD" }, config);
        const result = await storage.rom.get(assetUrl.split("/").pop());
        if (result && result["content-length"] === res.headers["content-length"] && result.type === type) {
            await gotData(result.data, fileName);
            return assetUrl;
        }
    }
    
    const res = await downloadFile(
        assetUrl, 
        (progress) => {
            textElem.innerText = progressMessage + progress;
        }, 
        true, 
        { responseType: "arraybuffer", method: "GET" },
        config
    );
    
    if (res === -1) {
        startGameError(localization("Network Error"));
        return assetUrl;
    }
    
    if (assetUrl instanceof File) {
        assetUrl = assetUrl.name;
    } else if (toData(assetUrl, true)) {
        assetUrl = "game";
    }
    
    await gotData(res.data, fileName);
    
    const limit = (typeof config.cacheLimit === "number") ? config.cacheLimit : 1073741824;
    if (parseFloat(res.headers["content-length"]) < limit && saveInBrowserSupported(config) && assetUrl !== "game") {
        storage.rom.put(assetUrl.split("/").pop(), {
            "content-length": res.headers["content-length"],
            data: res.data,
            type: type
        })
    }
    
    return assetUrl;
}

/**
 * 下载游戏补丁
 * @param {Object} config - 配置对象
 * @param {Function} downloadGameFile - 下载游戏文件函数
 * @param {Function} localization - 本地化函数
 * @returns {Promise<void>}
 */
export async function downloadGamePatch(config, downloadGameFile, localization) {
    config.gamePatchUrl = await downloadGameFile(
        config.gamePatchUrl, 
        "patch", 
        localization("Download Game Patch"), 
        localization("Decompress Game Patch")
    );
}

/**
 * 下载游戏父文件
 * @param {Object} config - 配置对象
 * @param {Function} downloadGameFile - 下载游戏文件函数
 * @param {Function} localization - 本地化函数
 * @returns {Promise<void>}
 */
export async function downloadGameParent(config, downloadGameFile, localization) {
    config.gameParentUrl = await downloadGameFile(
        config.gameParentUrl, 
        "parent", 
        localization("Download Game Parent"), 
        localization("Decompress Game Parent")
    );
}

/**
 * 下载游戏状态文件
 * @param {Object} config - 配置对象
 * @param {Object} textElem - 文本元素
 * @param {Function} downloadFile - 下载文件函数
 * @param {Function} localization - 本地化函数
 * @param {Function} startGameError - 游戏启动错误函数
 * @returns {Promise<void>}
 */
export async function downloadStartState(config, textElem, downloadFile, localization, startGameError) {
    return new Promise((resolve, reject) => {
        if (typeof config.loadState !== "string" && !toData(config.loadState, true)) {
            resolve();
            return;
        }
        textElem.innerText = localization("Download Game State");

        downloadFile(config.loadState, (progress) => {
            textElem.innerText = localization("Download Game State") + progress;
        }, true, { responseType: "arraybuffer", method: "GET" }, config).then((res) => {
            if (res === -1) {
                startGameError(localization("Error downloading game state"));
                return;
            }
            config.onStartCallback = () => {
                setTimeout(() => {
                    if (config.gameManager) {
                        config.gameManager.loadState(new Uint8Array(res.data));
                    }
                }, 10);
            };
            resolve();
        });
    });
}