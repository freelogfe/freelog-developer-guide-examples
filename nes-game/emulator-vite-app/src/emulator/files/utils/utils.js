/**
 * Utils Module
 * 
 * 这个模块包含各种通用工具函数。
 */

// 从现有模块复制工具函数代码
// 这里是占位符，实际实现应该从原始utils.js复制

export function requiresThreads(core) {
    const requiresThreads = ["ppsspp", "dosbox_pure"];
    return requiresThreads.includes(core);
}

export function requiresWebGL2(core) {
    const requiresWebGL2 = ["ppsspp"];
    return requiresWebGL2.includes(core);
}

export function versionAsInt(ver) {
    if (ver.endsWith("-beta")) {
        return 99999999;
    }
    let rv = ver.split(".");
    if (rv[rv.length - 1].length === 1) {
        rv[rv.length - 1] = "0" + rv[rv.length - 1];
    }
    return parseInt(rv.join(""));
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

export function createElement(type) {
    return document.createElement(type);
}

export function addEventListener(element, listener, callback) {
    const listeners = listener.split(" ");
    let rv = [];
    for (let i = 0; i < listeners.length; i++) {
        element.addEventListener(listeners[i], callback);
        const data = { cb: callback, elem: element, listener: listeners[i] };
        rv.push(data);
    }
    return rv;
}

export function removeEventListener(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].elem.removeEventListener(data[i].listener, data[i].cb);
    }
}