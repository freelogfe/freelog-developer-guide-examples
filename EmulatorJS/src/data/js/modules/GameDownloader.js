/**
 * EmulatorJS - Game Downloader Module
 * 游戏下载相关功能
 */

export class GameDownloader {
    constructor(emulator) {
        this.emulator = emulator;
    }

    async checkCompression(compressed, decompressProgressMessage) {
        if (compressed.length < 4) return { "!!notCompressedData": compressed };
        const first4 = compressed[0] + "" + compressed[1] + "" + compressed[2] + "" + compressed[3] + "";
        compressed = compressed.subarray(4);
        const data = await this.decompressData(compressed, decompressProgressMessage);
        return { [`!!compressedData_${first4}`]: data };
    }

    decompressData(data, decompressProgressMessage, fileName) {
        return new Promise((resolve, reject) => {
            const ext = fileName ? fileName.split(".").pop() : "";
            if (this.emulator.extensions.includes(ext) || (ext === "zip" && this.emulator.getCore(true) === "mame")) {
                const reader = new window.zip.BlobReader(data, { "type": "arraybuffer" });
                reader.initData(data);
                reader.readUint8Array((zip) => {
                    resolve(zip);
                })
                return;
            }
            if (ext === "zip") {
                const reader = new window.zip.BlobReader(data, { "type": "arraybuffer" });
                reader.initData(data);
                reader.readBlob((blob) => {
                    blob.arrayBuffer().then(data => resolve(data));
                })
                return;
            }
            // This will decompress 7z files
            this.emulator.Module["load_7z"].init((module) => {
                const files = module["7z.extract"](data);
                if (Object.keys(files).length === 1) {
                    const file = files[Object.keys(files)[0]];
                    resolve(file);
                } else {
                    resolve(files);
                }
            });
        });
    }

    async downloadFile(url, progressCallback = null, useCache = true, options = {}) {
        return new Promise((resolve, reject) => {
            if (url instanceof File) {
                progressCallback && progressCallback("100%");
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve({ "content-length": url.size, "data": new Uint8Array(event.target.result) });
                };
                reader.readAsArrayBuffer(url);
                return;
            } else if (url instanceof Blob) {
                progressCallback && progressCallback("100%");
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve({ "content-length": url.size, "data": new Uint8Array(event.target.result) });
                };
                reader.readAsArrayBuffer(url);
                return;
            } else if (url instanceof ArrayBuffer) {
                progressCallback && progressCallback("100%");
                resolve({ "content-length": url.byteLength, "data": new Uint8Array(url) });
                return;
            } else if (url instanceof Uint8Array) {
                progressCallback && progressCallback("100%");
                resolve({ "content-length": url.byteLength, "data": url });
                return;
            }
            let req = new XMLHttpRequest();
            progressCallback && req.addEventListener("progress", (e) => {
                if (req.status >= 200) {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100) + "%";
                        progressCallback(percent);
                    }
                }
            });
            req.addEventListener("timeout", () => {
                reject(-1);
            }, false)
            req.addEventListener("error", () => {
                reject(-1);
            }, false)
            req.addEventListener("load", (e) => {
                const rv = {
                    "content-length": req.getResponseHeader("content-length") || req.getResponseHeader("Content-Length"),
                    "data": req.response
                }
                if (req.status === 200) {
                    resolve(rv);
                } else {
                    reject(-1);
                }
            }, false)
            req.open(options.method || "GET", url, true);
            if (this.emulator.isSafari) {
                // Safari doesn't support CORS for some resources, so we need to disable cors for now. In Safari, this works fine.
                // Safari also doesn't support CORS for local files, so we need to disable cors for local files.
                if (url.startsWith("blob:") || url.startsWith("http://localhost") || url.startsWith("https://localhost") || url.startsWith("http://127.0.0.1") || url.startsWith("https://127.0.0.1")) {
                    req.setResponseHeader("Range", "bytes=0-");
                }
            }
            req.responseType = options.responseType || "arraybuffer";
            req.timeout = 10000;
            req.send();
        });
    }

    async downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage) {
        return new Promise(async (resolve) => {
            const res = await this.downloadFile(assetUrl, null, true, { method: "HEAD" });
            const result = await this.emulator.storage.rom.get(assetUrl.split("/").pop());
            if (result && result["content-length"] === res.headers["content-length"] && result.type === type) {
                await this.gotGameData(result.data);
                return resolve(assetUrl);
            }
            const resData = await this.downloadFile(assetUrl, (progress) => {
                this.emulator.textElem.innerText = progressMessage + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (resData === -1) {
                this.emulator.startGameError(this.emulator.localization("Network Error"));
                resolve(assetUrl);
                return;
            }
            if (assetUrl instanceof File) {
                assetUrl = assetUrl.name;
            } else if (this.emulator.toData(assetUrl, true)) {
                assetUrl = "game";
            }
            await this.gotGameData(resData.data);
            resolve(assetUrl);
            const limit = (typeof this.emulator.config.cacheLimit === "number") ? this.emulator.config.cacheLimit : 1073741824;
            if (parseFloat(resData.headers["content-length"]) < limit && this.emulator.saveInBrowserSupported() && assetUrl !== "game") {
                this.emulator.storage.rom.put(assetUrl.split("/").pop(), {
                    "content-length": resData.headers["content-length"],
                    data: resData.data,
                    type: type
                })
            }
        });
    }

    gotGameData(data) {
        if (["arcade", "mame"].includes(this.emulator.getCore(true))) {
            this.emulator.fileName = this.emulator.getBaseFileName(true);
            this.emulator.gameManager.FS.writeFile(this.emulator.fileName, new Uint8Array(data));
            return Promise.resolve();
        }

        const altName = this.emulator.getBaseFileName(true);

        let disableCue = false;
        if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x128", "vice_xpet", "vice_xplus4", "vice_xvic", "puae"].includes(this.emulator.getCore()) && this.emulator.config.disableCue === undefined) {
            disableCue = true;
        } else if (this.emulator.config.disableCue !== undefined) {
            disableCue = this.emulator.config.disableCue;
        }

        let fileNames = [];
        return new Promise((resolve, reject) => {
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
                    if (supportedFile === null && this.emulator.extensions.includes(ext)) {
                        supportedFile = fileName;
                    }
                    if (isoFile === null && ["iso", "cso", "chd", "elf"].includes(ext)) {
                        isoFile = fileName;
                    }
                    if (cueFile !== null) {
                        return;
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
                if (isoFile !== null && (this.emulator.supportsExt("iso") || this.emulator.supportsExt("cso") || this.emulator.supportsExt("chd") || this.emulator.supportsExt("elf"))) {
                    this.emulator.fileName = isoFile;
                } else if (this.emulator.supportsExt("cue") || this.emulator.supportsExt("ccd") || this.emulator.supportsExt("toc") || this.emulator.supportsExt("m3u")) {
                    if (cueFile !== null) {
                        this.emulator.fileName = cueFile;
                    } else if (!disableCue) {
                        this.emulator.fileName = this.emulator.gameManager.createCueFile(fileNames);
                    }
                }
                resolve();
            }).catch(() => resolve());
        });
    }

    async downloadGamePatch() {
        return new Promise(async (resolve) => {
            this.emulator.config.gamePatchUrl = await this.downloadGameFile(this.emulator.config.gamePatchUrl, "patch", this.emulator.localization("Download Game Patch"), this.emulator.localization("Decompress Game Patch"));
            resolve();
        });
    }

    async downloadGameParent() {
        return new Promise(async (resolve) => {
            this.emulator.config.gameParentUrl = await this.downloadGameFile(this.emulator.config.gameParentUrl, "parent", this.emulator.localization("Download Game Parent"), this.emulator.localization("Decompress Game Parent"));
            resolve();
        });
    }

    async downloadBios() {
        return new Promise(async (resolve) => {
            this.emulator.config.biosUrl = await this.downloadGameFile(this.emulator.config.biosUrl, "bios", this.emulator.localization("Download Game BIOS"), this.emulator.localization("Decompress Game BIOS"));
            resolve();
        });
    }

    async downloadRom() {
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
                if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x128", "vice_xpet", "vice_xplus4", "vice_xvic", "puae"].includes(this.emulator.getCore()) && this.emulator.config.disableCue === undefined) {
                    disableCue = true;
                } else if (this.emulator.config.disableCue !== undefined) {
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
                        if (supportedFile === null && this.emulator.extensions.includes(ext)) {
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
                    if (isoFile !== null && (this.emulator.supportsExt("iso") || this.emulator.supportsExt("cso") || this.emulator.supportsExt("chd") || this.emulator.supportsExt("elf"))) {
                        this.emulator.fileName = isoFile;
                    } else if (this.emulator.supportsExt("cue") || this.emulator.supportsExt("ccd") || this.emulator.supportsExt("toc") || this.emulator.supportsExt("m3u")) {
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

    async downloadStartState() {
        return new Promise((resolve, reject) => {
            this.emulator.downloadFile(this.emulator.config.loadState, (progress) => {
                this.emulator.textElem.innerText = this.emulator.localization("Download Start State") + progress;
            }, true, { responseType: "arraybuffer" }).then(res => {
                const data = new Uint8Array(res.data);
                this.emulator.gameManager.loadState(data).then(resolve).catch(() => reject(-1));
            }).catch(() => reject(-1));
        })
    }

    toData(data, isBase64) {
        if (data instanceof File) return data;
        if (data instanceof Blob) return "blob:";
        if (typeof data === 'string') {
            if (data.startsWith("blob:")) return data;
            if (isBase64) return atob(data);
        }
        return null;
    }

    saveInBrowserSupported() {
        return !!window.indexedDB && !!window.IDBRequest &&
            ("webkitTemporaryStorage" in navigator && navigator.webkitTemporaryStorage.queryUsageAndQuota != null) &&
            (window.indexedDB.open != null ||
                (window.openDatabase && window.openDatabase != null));
    }
}
