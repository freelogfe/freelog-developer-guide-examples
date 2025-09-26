// EmulatorJS Main Entry Point
// Import modules
import { setupCoreFunctions } from './core.js';
import { setupEventHandlerFunctions } from './eventHandler.js';
import { setupUIFunctions } from './ui.js';
import { setupSettingsFunctions } from './settings.js';
import { setupSystemFunctions } from './system.js';
import { setupUtilsFunctions } from './utils.js';
import { setupNetworkFunctions } from './network.js';
import { setupFileDownloaderFunctions } from './fileDownloader.js';

function EmulatorJS(element, config) {
    // Initialize properties
    this.ejs_version = "4.2.3";
    this.extensions = [];
    this.initControlVars();
    this.debug = (window.EJS_DEBUG_XX === true);
    if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();
    this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
    this.config = config;
    this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);
    this.config.settingsLanguage = window.EJS_settingsLanguage || false;
    this.currentPopup = null;
    this.isFastForward = false;
    this.isSlowMotion = false;
    this.failedToStart = false;
    this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
    this.touch = false;
    this.cheats = [];
    this.started = false;
    this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
    if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
    this.muted = false;
    this.paused = true;
    this.missingLang = [];
    this.setElements(element);
    this.setColor(this.config.color || "");
    this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
    this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";
    if (this.config.adUrl) {
        this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
        this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
    }
    
    // Mobile and touch detection
    this.isMobile = (function () {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    })();
    
    this.hasTouchScreen = (function () {
        if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
            if (navigator.maxTouchPoints > 0) {
                return true;
            }
        } else {
            if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                return true;
            } else if (window.TouchEvent || ("ontouchstart" in window)) {
                return true;
            }
        }
        return false;
    })();
    
    // Canvas and video setup
    this.canvas = this.createElement("canvas");
    this.canvas.classList.add("ejs_canvas");
    this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
    this.videoRotationChanged = false;
    
    // Capture settings
    this.capture = this.capture || {};
    this.capture.photo = this.capture.photo || {};
    this.capture.photo.source = ["canvas", "retroarch"].includes(this.capture.photo.source) ? this.capture.photo.source : "canvas";
    this.capture.photo.format = (typeof this.capture.photo.format === "string") ? this.capture.photo.format : "png";
    this.capture.photo.upscale = (typeof this.capture.photo.upscale === "number") ? this.capture.photo.upscale : 1;
    this.capture.video = this.capture.video || {};
    this.capture.video.format = (typeof this.capture.video.format === "string") ? this.capture.video.format : "detect";
    this.capture.video.upscale = (typeof this.capture.video.upscale === "number") ? this.capture.video.upscale : 1;
    this.capture.video.fps = (typeof this.capture.video.fps === "number") ? this.capture.video.fps : 30;
    this.capture.video.videoBitrate = (typeof this.capture.video.videoBitrate === "number") ? this.capture.video.videoBitrate : 2.5 * 1024 * 1024;
    this.capture.video.audioBitrate = (typeof this.capture.video.audioBitrate === "number") ? this.capture.video.audioBitrate : 192 * 1024;
    
    // Bind event listeners
    this.bindListeners();
    
    // Netplay and fullscreen settings
    this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
    this.fullscreen = false;
    this.enableMouseLock = false;
    
    // WebGL2 support
    this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
    this.webgl2Enabled = (() => {
        let setting = this.preGetSetting("webgl2Enabled");
        if (setting === "disabled" || !this.supportsWebgl2) {
            return false;
        } else if (setting === "enabled") {
            return true;
        }
        return null;
    })();
    
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Storage setup
    if (this.config.disableDatabases) {
        this.storage = {
            rom: new window.EJS_DUMMYSTORAGE(),
            bios: new window.EJS_DUMMYSTORAGE(),
            core: new window.EJS_DUMMYSTORAGE()
        }
    } else {
        this.storage = {
            rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
            bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
            core: new window.EJS_STORAGE("EmulatorJS-core", "core")
        }
    }
    // This is not cache. This is save data
    this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

    // Game container setup
    this.game.classList.add("ejs_game");
    if (typeof this.config.backgroundImg === "string") {
        this.game.classList.add("ejs_game_background");
        if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
        this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
        this.on("start", () => {
            this.game.classList.remove("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
        })
    } else {
        this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
    }

    // Cheats setup
    if (Array.isArray(this.config.cheats)) {
        for (let i = 0; i < this.config.cheats.length; i++) {
            const cheat = this.config.cheats[i];
            if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                this.cheats.push({
                    desc: cheat[0],
                    checked: false,
                    code: cheat[1],
                    is_permanent: true
                })
            }
        }
    }

    // Create start button and handle resize
    this.createStartButton();
    this.handleResize();
}

// Attach all methods to the EmulatorJS function

// Core utility methods
EmulatorJS.prototype.getCores = function() {
    return {
        "3do": {threads: false, webGL2: false, name: "Panasonic 3DO"},
        "atari800": {threads: false, webGL2: false, name: "Atari 800"},
        "atarilynx": {threads: false, webGL2: false, name: "Atari Lynx"},
        "auto": {threads: false, webGL2: false, name: "Auto"},
        "c64": {threads: false, webGL2: false, name: "Commodore 64"},
        "crocods": {threads: false, webGL2: false, name: "ColecoVision"},
        "desmume": {threads: true, webGL2: true, name: "Nintendo DS"},
        "dosbox": {threads: true, webGL2: false, name: "DOS"},
        "fceumm": {threads: false, webGL2: false, name: "Nintendo Entertainment System"},
        "freechaf": {threads: false, webGL2: false, name: "Channel F"},
        "gameandwatch": {threads: false, webGL2: false, name: "Game & Watch"},
        "gb": {threads: false, webGL2: false, name: "Game Boy"},
        "gba": {threads: false, webGL2: false, name: "Game Boy Advance"},
        "gbc": {threads: false, webGL2: false, name: "Game Boy Color"},
        "gw": {threads: false, webGL2: false, name: "Game & Watch"},
        "handy": {threads: false, webGL2: false, name: "Atari Lynx"},
        "mame": {threads: true, webGL2: true, name: "Arcade"},
        "mgba": {threads: false, webGL2: false, name: "Game Boy Advance"},
        "msx": {threads: false, webGL2: false, name: "MSX"},
        "neogeo": {threads: false, webGL2: false, name: "Neo Geo"},
        "nes": {threads: false, webGL2: false, name: "Nintendo Entertainment System"},
        "ngp": {threads: false, webGL2: false, name: "Neo Geo Pocket"},
        "ngpc": {threads: false, webGL2: false, name: "Neo Geo Pocket Color"},
        "n64": {threads: true, webGL2: true, name: "Nintendo 64"},
        "odyssey2": {threads: false, webGL2: false, name: "Odyssey 2"},
        "pce": {threads: false, webGL2: false, name: "TurboGrafx-16"},
        "pcecd": {threads: false, webGL2: false, name: "TurboGrafx-CD"},
        "pcfx": {threads: false, webGL2: false, name: "PC-FX"},
        "pico": {threads: false, webGL2: false, name: "Sega Pico"},
        "pokemini": {threads: false, webGL2: false, name: "Pokémon Mini"},
        "psx": {threads: true, webGL2: true, name: "PlayStation"},
        "psp": {threads: true, webGL2: true, name: "PlayStation Portable"},
        "saturn": {threads: true, webGL2: true, name: "Sega Saturn"},
        "scummvm": {threads: false, webGL2: false, name: "ScummVM"},
        "sms": {threads: false, webGL2: false, name: "Sega Master System"},
        "snes": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes2005": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes2010": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes9x": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes9x2002": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes9x2005": {threads: false, webGL2: false, name: "Super Nintendo"},
        "snes9x2010": {threads: false, webGL2: false, name: "Super Nintendo"},
        "stella": {threads: false, webGL2: false, name: "Atari 2600"},
        "sufami": {threads: false, webGL2: false, name: "Sufami Turbo"},
        "tic80": {threads: false, webGL2: false, name: "TIC-80"},
        "tg16": {threads: false, webGL2: false, name: "TurboGrafx-16"},
        "tgcd": {threads: false, webGL2: false, name: "TurboGrafx-CD"},
        "virtualboy": {threads: false, webGL2: false, name: "Virtual Boy"},
        "wonderswan": {threads: false, webGL2: false, name: "WonderSwan"},
        "wonderswancolor": {threads: false, webGL2: false, name: "WonderSwan Color"},
        "x68k": {threads: true, webGL2: true, name: "Sharp X68000"},
        "zxspectrum": {threads: false, webGL2: false, name: "ZX Spectrum"}
    };
};

// Get setting value before settings system is initialized
EmulatorJS.prototype.preGetSetting = function(key) {
    try {
        // First try to get from localStorage
        const settingsKey = `ejs_settings_${key}`;
        const savedValue = localStorage.getItem(settingsKey);
        if (savedValue !== null) {
            return savedValue;
        }
        
        // If not in localStorage, try to get from config
        if (this.config && this.config[key] !== undefined) {
            return this.config[key];
        }
        
        // Return null if no setting found
        return null;
    } catch (e) {
        console.warn(`Failed to get setting ${key}:`, e);
        return null;
    }
};

EmulatorJS.prototype.requiresThreads = function(core) {
    const cores = this.getCores();
    if (!cores[core]) return false;
    return cores[core].threads;
};

EmulatorJS.prototype.requiresWebGL2 = function(core) {
    const cores = this.getCores();
    if (!cores[core]) return false;
    return cores[core].webGL2;
};

EmulatorJS.prototype.getCore = function(ignoreAuto) {
    if (!this.config.core) return "auto";
    if (this.config.core.toLowerCase() === "auto" && !ignoreAuto) {
        const extension = this.getExtension();
        const map = {
            "sfc": "snes",
            "smc": "snes",
            "fig": "snes",
            "swc": "snes",
            "gd3": "snes",
            "gd7": "snes",
            "dx2": "snes",
            "bsx": "snes",
            "st": "snes",
            "rom": "snes",
            "gba": "gba",
            "gb": "gb",
            "gbc": "gbc",
            "nes": "nes",
            "fds": "nes",
            "unf": "nes",
            "gen": "genesis",
            "md": "genesis",
            "bin": "genesis",
            "cue": "genesis",
            "iso": "psx",
            "pbp": "psp",
            "z64": "n64",
            "v64": "n64",
            "n64": "n64",
            "nds": "desmume",
            "chd": "mame",
            "zip": "mame",
            "7z": "mame",
            "cso": "psp",
            "elf": "psx",
            "ccd": "psx",
            "m3u": "psx",
            "toc": "psx"
        };
        return map[extension] || "snes";
    }
    return this.config.core.toLowerCase();
};

EmulatorJS.prototype.createElement = function(element) {
    return document.createElement(element);
};

EmulatorJS.prototype.addEventListener = function(element, event, func) {
    element.addEventListener(event, func);
};

EmulatorJS.prototype.downloadFile = function(url, progress, allowExternal, options) {
    return new Promise((resolve) => {
        options = options || {};
        options.responseType = options.responseType || "text";
        options.method = options.method || "GET";
        
        const request = new XMLHttpRequest();
        request.open(options.method, url, true);
        
        if (options.headers) {
            for (let key in options.headers) {
                request.setRequestHeader(key, options.headers[key]);
            }
        }
        
        if (options.responseType) {
            request.responseType = options.responseType;
        }
        
        if (progress) {
            request.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    progress(" (" + Math.round((e.loaded / e.total) * 100) + "%)");
                }
            });
        }
        
        request.addEventListener('load', () => {
            if (request.status === 200) {
                if (options.method === "HEAD") {
                    resolve({ headers: request.getAllResponseHeaders().split('\r\n').reduce((result, line) => {
                        const parts = line.split(': ');
                        if (parts.length === 2) {
                            result[parts[0].toLowerCase()] = parts[1];
                        }
                        return result;
                    }, {}) });
                } else {
                    resolve({ data: request.response });
                }
            } else {
                resolve(-1);
            }
        });
        
        request.addEventListener('error', () => {
            resolve(-1);
        });
        
        request.send();
    });
};

EmulatorJS.prototype.toData = function(str, check) {
    if (typeof str !== 'string') return false;
    if (check && !str.includes("data:")) return false;
    try {
        return str.startsWith("data:");
    } catch (e) {
        return false;
    }
};

EmulatorJS.prototype.checkForUpdates = function() {
    this.downloadFile("https://api.emulatorjs.org/update", null, true).then((result) => {
        if (result === -1) return;
        try {
            const data = JSON.parse(result.data);
            if (this.versionAsInt(data.version) > this.versionAsInt(this.ejs_version)) {
                console.log(`EmulatorJS update available! You are on ${this.ejs_version}, latest is ${data.version}`);
            }
        } catch (e) {
            console.warn("Failed to parse update data");
        }
    });
};

EmulatorJS.prototype.versionAsInt = function(version) {
    const parts = version.split(".");
    let num = 0;
    num += parseInt(parts[0], 10) * 10000;
    if (parts.length > 1) num += parseInt(parts[1], 10) * 100;
    if (parts.length > 2) num += parseInt(parts[2], 10);
    return num;
};

// Also attach to window for global access
window.EmulatorJS = EmulatorJS;

// Set up all functions on EmulatorJS prototype
setupCoreFunctions();
setupEventHandlerFunctions();
setupUIFunctions();
setupSettingsFunctions();
setupSystemFunctions();
setupUtilsFunctions();
setupNetworkFunctions();
setupFileDownloaderFunctions();

// Export the EmulatorJS function
export default EmulatorJS;

// Add create static method for creating instances
EmulatorJS.create = function(config) {
    const element = document.querySelector(config.element) || config.element;
    return new EmulatorJS(element, config);
};