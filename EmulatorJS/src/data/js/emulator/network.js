/**
 * Network functionality for EmulatorJS
 */

import { toData } from './utils.js';

/**
 * Set up network functionality
 */
export function setupNetwork(EJS) {
    EJS.netplay = {
        url: EJS.config.netplayUrl || "https://netplay.emulatorjs.org",
        current_frame: 0,
        players: {},
        inputsData: {}
    };
    
    console.log("Network functionality set up");
}

/**
 * Start netplay session
 */
export function startNetplay(EJS) {
    if (!EJS.config.netplayUrl || typeof EJS.config.gameId !== "number") {
        console.warn("Netplay not properly configured");
        return;
    }
    
    EJS.isNetplay = true;
    console.log("Netplay started");
}

/**
 * Leave current netplay session
 */
export function leaveNetplay(EJS) {
    EJS.isNetplay = false;
    if (EJS.netplay.socket) {
        EJS.netplay.socket.disconnect();
    }
    console.log("Netplay session ended");
}

/**
 * Generate a unique ID for netplay sessions
 */
function guidGenerator() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * Join an existing netplay room
 */
export function joinNetplayRoom(EJS, sessionid, roomName) {
    EJS.netplay.playerID = guidGenerator();
    EJS.netplay.players = {};
    EJS.netplay.extra = {
        domain: window.location.host,
        game_id: EJS.config.gameId,
        room_name: roomName,
        player_name: EJS.netplay.name,
        userid: EJS.netplay.playerID,
        sessionid: sessionid
    };
    EJS.netplay.players[EJS.netplay.playerID] = EJS.netplay.extra;
    
    console.log(`Joining netplay room: ${roomName}`);
}

/**
 * Create a new netplay room
 */
export function createNetplayRoom(EJS, roomName, maxPlayers, password) {
    const sessionid = guidGenerator();
    EJS.netplay.playerID = guidGenerator();
    EJS.netplay.players = {};
    EJS.netplay.extra = {
        domain: window.location.host,
        game_id: EJS.config.gameId,
        room_name: roomName,
        player_name: EJS.netplay.name,
        userid: EJS.netplay.playerID,
        sessionid: sessionid
    };
    EJS.netplay.players[EJS.netplay.playerID] = EJS.netplay.extra;
    EJS.netplay.users = {};
    
    console.log(`Creating netplay room: ${roomName}`);
}

/**
 * Download a file with progress tracking
 */
export function downloadFile(EJS, path, progressCB, notWithPath, opts = {}) {
    return new Promise(async cb => {
        const data = toData(EJS, path); //check other data types
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
        const basePath = notWithPath ? "" : EJS.config.dataPath;
        path = basePath + path;
        if (!notWithPath && EJS.config.filePaths && typeof EJS.config.filePaths[path.split("/").pop()] === "string") {
            path = EJS.config.filePaths[path.split("/").pop()];
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
 * Check for EmulatorJS updates
 */
export function checkForUpdates(EJS) {
    if (EJS.ejs_version.endsWith("-beta")) {
        console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended.");
        return;
    }
    
    fetch("https://cdn.emulatorjs.org/stable/data/version.json")
        .then(response => {
            if (response.ok) {
                response.text().then(body => {
                    let version = JSON.parse(body);
                    if (versionAsInt(EJS.ejs_version) < versionAsInt(version.version)) {
                        console.log(`Using EmulatorJS version ${EJS.ejs_version} but the newest version is ${version.version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                    }
                });
            }
        });
}

/**
 * Convert version string to integer for comparison
 */
function versionAsInt(ver) {
    if (ver.endsWith("-beta")) {
        return 99999999;
    }
    let rv = ver.split(".");
    if (rv[rv.length - 1].length === 1) {
        rv[rv.length - 1] = "0" + rv[rv.length - 1];
    }
    return parseInt(rv.join(""));
}