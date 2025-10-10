export const downloadStartState = () => {
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
export const downloadGameFile = (assetUrl, type, progressMessage, decompressProgressMessage) => {
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
export const downloadGamePatch = () => {
    return new Promise(async (resolve) => {
        this.config.gamePatchUrl = await this.downloadGameFile(this.config.gamePatchUrl, "patch", this.localization("Download Game Patch"), this.localization("Decompress Game Patch"));
        resolve();
    });
}
export const downloadGameParent = () => {
    return new Promise(async (resolve) => {
        this.config.gameParentUrl = await this.downloadGameFile(this.config.gameParentUrl, "parent", this.localization("Download Game Parent"), this.localization("Decompress Game Parent"));
        resolve();
    });
}
export const downloadBios = () => {
    return new Promise(async (resolve) => {
        this.config.biosUrl = await this.downloadGameFile(this.config.biosUrl, "bios", this.localization("Download Game BIOS"), this.localization("Decompress Game BIOS"));
        resolve();
    });
}
export const downloadRom = () => {
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
export const downloadFiles = () => {
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