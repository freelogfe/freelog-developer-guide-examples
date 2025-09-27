// File management functionality for EmulatorJS

function downloadFile(emulator, path, progressCB, notWithPath, opts) {
    return new Promise(async cb => {
        const data = toData(emulator, path); //check other data types
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
        const basePath = notWithPath ? "" : emulator.config.dataPath;
        path = basePath + path;
        if (!notWithPath && emulator.config.filePaths && typeof emulator.config.filePaths[path.split("/").pop()] === "string") {
            path = emulator.config.filePaths[path.split("/").pop()];
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

function toData(emulator, data, rv) {
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

module.exports = {
    downloadFile,
    toData
};