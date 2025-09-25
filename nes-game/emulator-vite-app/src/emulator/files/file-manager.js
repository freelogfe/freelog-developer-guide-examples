/**
 * EmulatorJS File Manager Module
 * 处理文件下载、解压、缓存和管理功能
 */

export class FileManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    /**
     * 下载文件
     */
    downloadFile(path, progressCB, notWithPath, opts) {
        return new Promise(async cb => {
            const data = this.emulator.toData(path); //check other data types
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
            const basePath = notWithPath ? "" : this.emulator.config.dataPath;
            path = basePath + path;
            if (!notWithPath && this.emulator.config.filePaths && typeof this.emulator.config.filePaths[path.split("/").pop()] === "string") {
                path = this.emulator.config.filePaths[path.split("/").pop()];
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
     * 检查并解压压缩文件
     */
    checkCompression(data, msg, fileCbFunc) {
        if (!this.emulator.compression) {
            this.emulator.compression = new window.EJS_COMPRESSION(this.emulator);
        }
        if (msg) {
            if (this.emulator.textElem) {
                this.emulator.textElem.innerText = msg;
            }
        }
        return this.emulator.compression.decompress(data, (m, appendMsg) => {
            if (this.emulator.textElem) {
                this.emulator.textElem.innerText = appendMsg ? (msg + m) : m;
            }
        }, fileCbFunc);
    }

    /**
     * 下载游戏核心
     */
    async downloadGameCore() {
        if (this.emulator.textElem) {
            this.emulator.textElem.innerText = this.emulator.localization("Download Game Core");
        }
        if (!this.emulator.config.threads && this.emulator.requiresThreads(this.emulator.getCore())) {
            this.emulator.startGameError(this.emulator.localization("Error for site owner") + "\n" + this.emulator.localization("Check console"));
            console.warn("This core requires threads, but EJS_threads is not set!");
            return;
        }
        if (!this.emulator.supportsWebgl2 && this.emulator.requiresWebGL2(this.emulator.getCore())) {
            this.emulator.startGameError(this.emulator.localization("Outdated graphics driver"));
            return;
        }
        if (this.emulator.config.threads && typeof window.SharedArrayBuffer !== "function") {
            this.emulator.startGameError(this.emulator.localization("Error for site owner") + "\n" + this.emulator.localization("Check console"));
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            return;
        }

        const gotCore = (data) => {
            this.emulator.defaultCoreOpts = {};
            this.checkCompression(new Uint8Array(data), this.emulator.localization("Decompress Game Core")).then((data) => {
                let js, thread, wasm;
                for (let k in data) {
                    if (k.endsWith(".wasm")) {
                        wasm = data[k];
                    } else if (k.endsWith(".worker.js")) {
                        thread = data[k];
                    } else if (k.endsWith(".js")) {
                        js = data[k];
                    } else if (k === "build.json") {
                        this.emulator.checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                    } else if (k === "core.json") {
                        let core = JSON.parse(new TextDecoder().decode(data[k]));
                        this.emulator.extensions = core.extensions;
                        this.emulator.coreName = core.name;
                        this.emulator.repository = core.repo;
                        this.emulator.defaultCoreOpts = core.options;
                        this.emulator.enableMouseLock = core.options.supportsMouse;
                        this.emulator.retroarchOpts = core.retroarchOpts;
                        this.emulator.saveFileExt = core.save;
                    } else if (k === "license.txt") {
                        this.emulator.license = new TextDecoder().decode(data[k]);
                    }
                }

                if (this.emulator.saveFileExt === false) {
                    this.emulator.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.emulator.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
                this.emulator.initGameCore(js, wasm, thread);
            });
        }

        const report = "cores/reports/" + this.emulator.getCore() + ".json";
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
            if (this.emulator.webgl2Enabled === null) {
                this.emulator.webgl2Enabled = rep.options ? rep.options.defaultWebGL2 : false;
            }
            if (this.emulator.requiresWebGL2(this.emulator.getCore())) {
                this.emulator.webgl2Enabled = true;
            }
            let threads = false;
            if (typeof window.SharedArrayBuffer === "function") {
                const opt = this.emulator.preGetSetting("ejs_threads");
                if (opt) {
                    threads = (opt === "enabled");
                } else {
                    threads = this.emulator.config.threads;
                }
            }

            let legacy = (this.emulator.supportsWebgl2 && this.emulator.webgl2Enabled ? "" : "-legacy");
            let filename = this.emulator.getCore() + (threads ? "-thread" : "") + legacy + "-wasm.data";
            if (!this.emulator.debug) {
                const result = await this.emulator.storage.core.get(filename);
                if (result && result.version === rep.buildStart) {
                    gotCore(result.data);
                    return;
                }
            }
            const corePath = "cores/" + filename;
            let version = this.emulator.ejs_version.endsWith("-beta") ? "nightly" : this.emulator.ejs_version;
            let res = await this.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${corePath}`, (progress) => {
                if (this.emulator.textElem) {
                    this.emulator.textElem.innerText = this.emulator.localization("Download Game Core") + progress;
                }
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                if (!this.emulator.supportsWebgl2) {
                    this.emulator.startGameError(this.emulator.localization("Outdated graphics driver"));
                } else {
                    this.emulator.startGameError(this.emulator.localization("Error downloading core") + " (" + filename + ")");
                }
                return;
            }
            console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
            gotCore(res.data);
            this.emulator.storage.core.put(filename, {
                version: rep.buildStart,
                data: res.data
            });
        });
    }

    /**
     * 获取基础文件名
     */
    getBaseFileName(force) {
        //Only once game and core is loaded
        if (!this.emulator.started && !force) return null;
        if (force && this.emulator.config.gameUrl !== "game" && !this.emulator.config.gameUrl.startsWith("blob:")) {
            return this.emulator.config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
        }
        if (typeof this.emulator.config.gameName === "string") {
            const invalidCharacters = /[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/ig;
            const name = this.emulator.config.gameName.replace(invalidCharacters, "").trim();
            if (name) return name;
        }
        if (!this.emulator.fileName) return "game";
        let parts = this.emulator.fileName.split(".");
        parts.splice(parts.length - 1, 1);
        return parts.join(".");
    }

    /**
     * 检查浏览器是否支持本地保存
     */
    saveInBrowserSupported() {
        return !!window.indexedDB && (typeof this.emulator.config.gameName === "string" || !this.emulator.config.gameUrl.startsWith("blob:"));
    }

    /**
     * 下载游戏状态
     */
    downloadStartState() {
        return new Promise((resolve, reject) => {
            if (typeof this.emulator.config.loadState !== "string" && !this.emulator.toData(this.emulator.config.loadState, true)) {
                resolve();
                return;
            }
            if (this.emulator.textElem) {
                this.emulator.textElem.innerText = this.emulator.localization("Download Game State");
            }

            this.downloadFile(this.emulator.config.loadState, (progress) => {
                if (this.emulator.textElem) {
                    this.emulator.textElem.innerText = this.emulator.localization("Download Game State") + progress;
                }
            }, true, { responseType: "arraybuffer", method: "GET" }).then((res) => {
                if (res === -1) {
                    this.emulator.startGameError(this.emulator.localization("Error downloading game state"));
                    return;
                }
                this.emulator.on("start", () => {
                    setTimeout(() => {
                        this.emulator.gameManager.loadState(new Uint8Array(res.data));
                    }, 10);
                })
                resolve();
            });
        })
    }

    /**
     * 下载游戏文件
     */
    downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage) {
        return new Promise(async (resolve, reject) => {
            if ((typeof assetUrl !== "string" || !assetUrl.trim()) && !this.emulator.toData(assetUrl, true)) {
                return resolve(assetUrl);
            }
            const gotData = async (input) => {
                if (this.emulator.config.dontExtractBIOS === true) {
                    this.emulator.gameManager.gameManager.FS.writeFile(assetUrl, new Uint8Array(input));
                    return resolve(assetUrl);
                }
                const data = await this.checkCompression(new Uint8Array(input), decompressProgressMessage);
                for (const k in data) {
                    const coreFilename = "/" + this.emulator.fileName;
                    const coreFilePath = coreFilename.substring(0, coreFilename.length - coreFilename.split("/").pop().length);
                    if (k === "!!notCompressedData") {
                        this.emulator.gameManager.gameManager.FS.writeFile(coreFilePath + assetUrl.split("/").pop().split("#")[0].split("?")[0], data[k]);
                        break;
                    }
                    if (k.endsWith("/")) continue;
                    this.emulator.gameManager.gameManager.FS.writeFile(coreFilePath + k.split("/").pop(), data[k]);
                }
            }

            this.emulator.textElem.innerText = progressMessage;
            if (!this.emulator.debug) {
                const res = await this.downloadFile(assetUrl, null, true, { method: "HEAD" });
                const result = await this.emulator.storage.rom.get(assetUrl.split("/").pop());
                if (result && result["content-length"] === res.headers["content-length"] && result.type === type) {
                    await gotData(result.data);
                    return resolve(assetUrl);
                }
            }
            const res = await this.downloadFile(assetUrl, (progress) => {
                this.emulator.textElem.innerText = progressMessage + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.emulator.startGameError(this.emulator.localization("Network Error"));
                resolve(assetUrl);
                return;
            }
            if (assetUrl instanceof File) {
                assetUrl = assetUrl.name;
            } else if (this.emulator.toData(assetUrl, true)) {
                assetUrl = "game";
            }
            await gotData(res.data);
            resolve(assetUrl);
            const limit = (typeof this.emulator.config.cacheLimit === "number") ? this.emulator.config.cacheLimit : 1073741824;
            if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported() && assetUrl !== "game") {
                this.emulator.storage.rom.put(assetUrl.split("/").pop(), {
                    "content-length": res.headers["content-length"],
                    data: res.data,
                    type: type
                })
            }
        });
    }

    /**
     * 下载游戏补丁
     */
    downloadGamePatch() {
        return new Promise(async (resolve) => {
            this.emulator.config.gamePatchUrl = await this.downloadGameFile(this.emulator.config.gamePatchUrl, "patch", this.emulator.localization("Download Game Patch"), this.emulator.localization("Decompress Game Patch"));
            resolve();
        });
    }

    /**
     * 下载游戏父文件
     */
    downloadGameParent() {
        return new Promise(async (resolve) => {
            this.emulator.config.gameParentUrl = await this.downloadGameFile(this.emulator.config.gameParentUrl, "parent", this.emulator.localization("Download Game Parent"), this.emulator.localization("Decompress Game Parent"));
            resolve();
        });
    }

    /**
     * 下载BIOS
     */
    downloadBios() {
        return new Promise(async (resolve) => {
            this.emulator.config.biosUrl = await this.downloadGameFile(this.emulator.config.biosUrl, "bios", this.emulator.localization("Download Game BIOS"), this.emulator.localization("Decompress Game BIOS"));
            resolve();
        });
    }

    /**
     * 下载游戏ROM
     */
    downloadRom() {
        const supportsExt = (ext) => {
            const core = this.emulator.getCore();
            if (!this.emulator.extensions) return false;
            return this.emulator.extensions.includes(ext);
        };

        return new Promise(resolve => {
            this.emulator.textElem.innerText = this.emulator.localization("Download Game Data");

            const gotGameData = (data) => {
                if (["arcade", "mame"].includes(this.emulator.getCore(true))) {
                    this.emulator.fileName = this.getBaseFileName(true);
                    this.emulator.gameManager.gameManager.FS.writeFile(this.emulator.fileName, new Uint8Array(data));
                    resolve();
                    return;
                }

                const altName = this.getBaseFileName(true);

                let disableCue = false;
                if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x64sc", "vice_x128", "vice_xvic", "vice_xplus4", "vice_xpet", "puae"].includes(this.emulator.getCore()) && this.emulator.config.disableCue === undefined) {
                    disableCue = true;
                } else {
                    disableCue = this.emulator.config.disableCue;
                }

                let fileNames = [];
                this.checkCompression(new Uint8Array(data), this.emulator.localization("Decompress Game Data"), (fileName, fileData) => {
                    if (fileName.includes("/")) {
                        const paths = fileName.split("/");
                        let cp = "";
                        for (let i = 0; i < paths.length - 1; i++) {
                            if (paths[i] === "") continue;
                            cp += `/${paths[i]}`;
                            if (!this.emulator.gameManager.gameManager.FS.analyzePath(cp).exists) {
                                this.emulator.gameManager.gameManager.FS.mkdir(cp);
                            }
                        }
                    }

                    let finalName = "/" + fileName;
                    if (fileName.endsWith(".m3u")) {
                        finalName = "/" + altName + ".m3u";
                    } else if (fileName.endsWith(".cue")) {
                        if (disableCue) {
                            return;
                        }
                        finalName = "/" + altName + ".cue";
                    }

                    this.emulator.gameManager.gameManager.FS.writeFile(finalName, fileData);
                    fileNames.push(finalName);
                }).then(() => {
                    if (fileNames.length === 1) {
                        this.emulator.fileName = fileNames[0];
                    } else if (fileNames.length > 1) {
                        this.emulator.fileName = "/" + altName + ".m3u";
                        let m3uContent = "";
                        fileNames.forEach(name => {
                            m3uContent += name.replace("/", "") + "\n";
                        });
                        this.emulator.gameManager.gameManager.FS.writeFile(this.emulator.fileName, new TextEncoder().encode(m3uContent));
                    }
                    resolve();
                });
            }

            if (this.emulator.toData(this.emulator.config.gameUrl, true)) {
                this.emulator.toData(this.emulator.config.gameUrl).then(data => {
                    gotGameData(data);
                });
            } else {
                this.downloadFile(this.emulator.config.gameUrl, (progress) => {
                    this.emulator.textElem.innerText = this.emulator.localization("Download Game Data") + progress;
                }, true, { responseType: "arraybuffer", method: "GET" }).then(res => {
                    if (res === -1) {
                        this.emulator.startGameError(this.emulator.localization("Network Error"));
                        resolve();
                        return;
                    }
                    gotGameData(res.data);
                });
            }
        });
    }
}
