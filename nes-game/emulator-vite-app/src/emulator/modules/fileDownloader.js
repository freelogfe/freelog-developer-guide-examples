// 文件下载模块 - 包含文件下载相关功能

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function downloadFiles() {
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

export function downloadRom() {
    return new Promise(async (resolve) => {
        this.config.gameUrl = await this.downloadGameFile(this.config.gameUrl, "rom", this.localization("Download Game Data"), this.localization("Decompress Game Data"));
        resolve();
    });
}

export function downloadBios() {
    return new Promise(async (resolve) => {
        this.config.biosUrl = await this.downloadGameFile(this.config.biosUrl, "bios", this.localization("Download Game BIOS"), this.localization("Decompress Game BIOS"));
        resolve();
    });
}

export function downloadStartState() {
    return new Promise(async (resolve) => {
        if (!this.config.startStateUrl) return resolve();
        const state = await this.downloadFile(this.config.startStateUrl, null, true, { responseType: "arraybuffer", method: "GET" });
        if (state === -1) {
            this.startGameError(this.localization("Error downloading game state"));
            return resolve();
        }
        const path = "/states/start.state";
        const paths = path.split("/");
        let cp = "";
        for (let i = 0; i < paths.length - 1; i++) {
            if (paths[i] === "") continue;
            cp += "/" + paths[i];
            if (!this.gameManager.FS.analyzePath(cp).exists) this.gameManager.FS.mkdir(cp);
        }
        if (this.gameManager.FS.analyzePath(path).exists) this.gameManager.FS.unlink(path);
        this.gameManager.FS.writeFile(path, new Uint8Array(state.data));
        resolve();
    });
}

export function downloadGameFile(assetUrl, type, progressMessage, decompressMessage) {
    return new Promise(async (resolve) => {
        if (!assetUrl) return resolve(assetUrl);
        const gotData = async (data) => {
            data = await this.checkCompression(new Uint8Array(data), this.localization(decompressMessage));
            const coreFilePath = "/data/";
            for (const k in data) {
                if (k === "!!notCompressedData") {
                    this.gameManager.FS.writeFile(coreFilePath + this.getBaseFileName(true) + "." + type, data[k]);
                    this.fileName = this.getBaseFileName(true) + "." + type;
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

export function downloadGamePatch() {
    return new Promise(async (resolve) => {
        this.config.gamePatchUrl = await this.downloadGameFile(this.config.gamePatchUrl, "patch", this.localization("Download Game Patch"), this.localization("Decompress Game Patch"));
        resolve();
    });
}

export function downloadGameParent() {
    return new Promise(async (resolve) => {
        this.config.gameParentUrl = await this.downloadGameFile(this.config.gameParentUrl, "parent", this.localization("Download Game Parent"), this.localization("Decompress Game Parent"));
        resolve();
    });
}