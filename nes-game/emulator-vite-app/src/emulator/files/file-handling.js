/**
 * File Handling Module
 * Handles file downloads, data conversion, and compression/decompression
 */
export default class FileHandling {
    constructor(emulator) {
        this.emulator = emulator;
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
                });
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
                if (opts.method === "HEAD") {
                    cb({ headers: {} });
                } else {
                    let res = await fetch(path)
                    if ((opts.type && opts.type.toLowerCase() === "arraybuffer") || !opts.type) {
                        res = await res.arrayBuffer();
                    } else if (opts.type && opts.type.toLowerCase() === "text") {
                        res = await res.text();
                        try { res = JSON.parse(res) } catch (e) { }
                    }
                    if (path.startsWith("blob:")) URL.revokeObjectURL(path);
                    cb({ data: res, headers: {} });
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
                    if (xhr.responseType === "arraybuffer") {
                        data = xhr.response;
                    } else if (xhr.responseType === "text" || !xhr.responseType) {
                        data = xhr.responseText;
                        try { data = JSON.parse(data) } catch (e) { }
                    }
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
        });
    }

    checkCompression(data, msg, fileCbFunc) {
        if (!this.emulator.compression) {
            this.emulator.compression = new window.EJS_COMPRESSION(this.emulator);
        }
        if (msg) {
            this.emulator.textElem.innerText = msg;
        }
        return new Promise(async (resolve) => {
            if (fileCbFunc) {
                resolve(this.emulator.compression.decompress(data, fileCbFunc));
            } else {
                resolve(this.emulator.compression.decompress(data));
            }
        });
    }

    localization(text, log) {
        if (typeof text === "undefined" || text.length === 0) return;
        text = text.toString();
        if (text.includes("EmulatorJS v")) return text;
        if (this.emulator.config.langJson) {
            if (typeof log === "undefined") log = true;
            if (typeof this.emulator.config.langJson[text] === "string") {
                if (log && !this.emulator.missingLang.includes(text)) {
                    this.emulator.missingLang.push(text);
                    console.log("Translation key found:", text, "->", this.emulator.config.langJson[text]);
                }
                return this.emulator.config.langJson[text];
            } else {
                if (log && !this.emulator.missingLang.includes(text)) {
                    this.emulator.missingLang.push(text);
                    console.warn("Missing translation key:", text);
                }
            }
        }
        return text;
    }

    getBaseFileName(force) {
        const fileName = this.emulator.config.gameUrl || "game";
        if (fileName instanceof File) {
            return fileName.name;
        } else if (typeof fileName === "string") {
            if (force) {
                return fileName.split("/").pop().split("#")[0].split("?")[0];
            }
            return fileName;
        } else if (this.toData(fileName, true)) {
            return "game";
        }
        return fileName;
    }

    saveInBrowserSupported() {
        try {
            window.localStorage.setItem("test", "test");
            window.localStorage.removeItem("test");
            return true;
        } catch (e) {
            return false;
        }
    }
}
