/**
 * 文件管理模块
 * 负责游戏文件的下载、处理和管理
 */
class FileManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

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

    downloadStartState() {
        return new Promise((resolve, reject) => {
            if (typeof this.emulator.config.loadState !== "string" && !this.emulator.toData(this.emulator.config.loadState, true)) {
                resolve();
                return;
            }
            this.emulator.textElem.innerText = this.emulator.localization("Download Game State");

            this.downloadFile(this.emulator.config.loadState, (progress) => {
                this.emulator.textElem.innerText = this.emulator.localization("Download Game State") + progress;
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

    downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage) {
        return new Promise(async (resolve, reject) => {
            if ((typeof assetUrl !== "string" || !assetUrl.trim()) && !this.emulator.toData(assetUrl, true)) {
                return resolve(assetUrl);
            }
            const gotData = async (input) => {
                if (this.emulator.config.dontExtractBIOS === true) {
                    this.emulator.gameManager.FS.writeFile(assetUrl, new Uint8Array(input));
                    return resolve(assetUrl);
                }
                const data = await this.emulator.checkCompression(new Uint8Array(input), decompressProgressMessage);
                for (const k in data) {
                    const coreFilename = "/" + this.emulator.fileName;
                    const coreFilePath = coreFilename.substring(0, coreFilename.length - coreFilename.split("/").pop().length);
                    if (k === "!!notCompressedData") {
                        this.emulator.gameManager.FS.writeFile(coreFilePath + assetUrl.split("/").pop().split("#")[0].split("?")[0], data[k]);
                        break;
                    }
                    if (k.endsWith("/")) continue;
                    this.emulator.gameManager.FS.writeFile(coreFilePath + k.split("/").pop(), data[k]);
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
            if (parseFloat(res.headers["content-length"]) < limit && this.emulator.saveInBrowserSupported() && assetUrl !== "game") {
                this.emulator.storage.rom.put(assetUrl.split("/").pop(), {
                    "content-length": res.headers["content-length"],
                    data: res.data,
                    type: type
                })
            }
        });
    }

    downloadGamePatch() {
        return new Promise(async (resolve) => {
            this.emulator.config.gamePatchUrl = await this.downloadGameFile(this.emulator.config.gamePatchUrl, "patch", this.emulator.localization("Download Game Patch"), this.emulator.localization("Decompress Game Patch"));
            resolve();
        });
    }

    downloadGameParent() {
        return new Promise(async (resolve) => {
            this.emulator.config.gameParentUrl = await this.downloadGameFile(this.emulator.config.gameParentUrl, "parent", this.emulator.localization("Download Game Parent"), this.emulator.localization("Decompress Game Parent"));
            resolve();
        });
    }

    downloadBios() {
        return new Promise(async (resolve) => {
            this.emulator.config.biosUrl = await this.downloadGameFile(this.emulator.config.biosUrl, "bios", this.emulator.localization("Download Game BIOS"), this.emulator.localization("Decompress Game BIOS"));
            resolve();
        });
    }

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
                    this.emulator.fileName = this.emulator.getBaseFileName(true);
                    this.emulator.gameManager.FS.writeFile(this.emulator.fileName, new Uint8Array(data));
                    resolve();
                    return;
                }

                const altName = this.emulator.getBaseFileName(true);

                let disableCue = false;
                if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x64sc", "vice_x128", "vice_xvic", "vice_xplus4", "vice_xpet", "puae"].includes(this.emulator.getCore()) && this.emulator.config.disableCue === undefined) {
                    disableCue = true;
                } else {
                    disableCue = this.emulator.config.disableCue;
                }

                let fileNames = [];
                this.emulator.checkCompression(new Uint8Array(data), this.emulator.localization("Decompress Game Data"), (fileName, fileData) => {
                    if (fileName.includes("/")) {
                        const paths = fileName.split("/");
                        let cp = "";
                        for (let i = 0; i < paths.length - 1; i++) {
                            if (paths[i] === "") continue;
                            cp += `/${paths[i]}`;
                            if (!this.emulator.gameManager.FS.analyzePath(cp).exists) {
                                this.emulator.gameManager.FS.mkdir(cp);
                            }
                        }
                    }
                    if (fileName.endsWith("/")) {
                        this.emulator.gameManager.FS.mkdir(fileName);
                        return;
                    }
                    if (fileName === "!!notCompressedData") {
                        this.emulator.gameManager.FS.writeFile(altName, fileData);
                        fileNames.push(altName);
                    } else {
                        this.emulator.gameManager.FS.writeFile(`/${fileName}`, fileData);
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
                            if (this.emulator.getCore(true) === "psx") {
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
                        this.emulator.fileName = supportedFile;
                    } else {
                        this.emulator.fileName = fileNames[0];
                    }
                    if (isoFile !== null && (supportsExt("iso") || supportsExt("cso") || supportsExt("chd") || supportsExt("elf"))) {
                        this.emulator.fileName = isoFile;
                    } else if (supportsExt("cue") || supportsExt("ccd") || supportsExt("toc") || supportsExt("m3u")) {
                        if (cueFile !== null) {
                            this.emulator.fileName = cueFile;
                        } else if (!disableCue) {
                            this.emulator.fileName = this.emulator.gameManager.createCueFile(fileNames);
                        }
                    }
                    resolve();
                });
            }
            const downloadFile = async () => {
                const res = await this.downloadFile(this.emulator.config.gameUrl, (progress) => {
                    this.emulator.textElem.innerText = this.emulator.localization("Download Game Data") + progress;
                }, true, { responseType: "arraybuffer", method: "GET" });
                if (res === -1) {
                    this.emulator.startGameError(this.emulator.localization("Network Error"));
                    return;
                }
                if (this.emulator.config.gameUrl instanceof File) {
                    this.emulator.config.gameUrl = this.emulator.config.gameUrl.name;
                } else if (this.emulator.toData(this.emulator.config.gameUrl, true)) {
                    this.emulator.config.gameUrl = "game";
                }
                gotGameData(res.data);
                const limit = (typeof this.emulator.config.cacheLimit === "number") ? this.emulator.config.cacheLimit : 1073741824;
                if (parseFloat(res.headers["content-length"]) < limit && this.emulator.saveInBrowserSupported() && this.emulator.config.gameUrl !== "game") {
                    this.emulator.storage.rom.put(this.emulator.config.gameUrl.split("/").pop(), {
                        "content-length": res.headers["content-length"],
                        data: res.data
                    })
                }
            }

            if (!this.emulator.debug) {
                this.downloadFile(this.emulator.config.gameUrl, null, true, { method: "HEAD" }).then(async (res) => {
                    const name = (typeof this.emulator.config.gameUrl === "string") ? this.emulator.config.gameUrl.split("/").pop() : "game";
                    const result = await this.emulator.storage.rom.get(name);
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
            this.emulator.gameManager = new window.EJS_GameManager(this.emulator.Module, this.emulator);
            await this.emulator.gameManager.loadExternalFiles();
            await this.emulator.gameManager.mountFileSystems();
            this.emulator.callEvent("saveDatabaseLoaded", this.emulator.gameManager.FS);
            if (this.emulator.getCore() === "ppsspp") {
                await this.emulator.gameManager.loadPpssppAssets();
            }
            await this.downloadRom();
            await this.downloadBios();
            await this.downloadStartState();
            await this.downloadGameParent();
            await this.downloadGamePatch();
            this.emulator.startGame();
        })();
    }
}
