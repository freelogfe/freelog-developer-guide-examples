/**
 * Core functionality for EmulatorJS
 */

import { checkForUpdates, downloadFile } from './network.js';
import { checkMobile, hasTouchScreen } from './utils.js';

export function initializeEmulator(EJS) {
    EJS.ejs_version = "4.2.3";
    EJS.extensions = [];
    initControlVars(EJS);
    EJS.debug = (window.EJS_DEBUG_XX === true);
    if (EJS.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) checkForUpdates(EJS);
    EJS.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
    EJS.config.buttonOpts = buildButtonOptions(EJS, EJS.config.buttonOpts);
    EJS.config.settingsLanguage = window.EJS_settingsLanguage || false;
    EJS.currentPopup = null;
    EJS.isFastForward = false;
    EJS.isSlowMotion = false;
    EJS.failedToStart = false;
    EJS.rewindEnabled = preGetSetting(EJS, "rewindEnabled") === "enabled";
    EJS.touch = false;
    EJS.cheats = [];
    EJS.started = false;
    EJS.volume = (typeof EJS.config.volume === "number") ? EJS.config.volume : 0.5;
    if (EJS.config.defaultControllers) EJS.defaultControllers = EJS.config.defaultControllers;
    EJS.muted = false;
    EJS.paused = true;
    EJS.missingLang = [];
    setElements(EJS, EJS.element);
    setColor(EJS, EJS.config.color || "");
    EJS.config.alignStartButton = (typeof EJS.config.alignStartButton === "string") ? EJS.config.alignStartButton : "bottom";
    EJS.config.backgroundColor = (typeof EJS.config.backgroundColor === "string") ? EJS.config.backgroundColor : "rgb(51, 51, 51)";
    
    if (EJS.config.adUrl) {
        EJS.config.adSize = (Array.isArray(EJS.config.adSize)) ? EJS.config.adSize : ["300px", "250px"];
        setupAds(EJS, EJS.config.adUrl, EJS.config.adSize[0], EJS.config.adSize[1]);
    }
    
    EJS.isMobile = checkMobile();
    EJS.hasTouchScreen = hasTouchScreen();
    EJS.canvas = EJS.createElement("canvas");
    EJS.canvas.classList.add("ejs_canvas");
    EJS.videoRotation = ([0, 1, 2, 3].includes(EJS.config.videoRotation)) ? EJS.config.videoRotation : preGetSetting(EJS, "videoRotation") || 0;
    EJS.videoRotationChanged = false;
    EJS.capture = EJS.capture || {};
    EJS.capture.photo = EJS.capture.photo || {};
    EJS.capture.photo.source = ["canvas", "retroarch"].includes(EJS.capture.photo.source) ? EJS.capture.photo.source : "canvas";
    EJS.capture.photo.format = (typeof EJS.capture.photo.format === "string") ? EJS.capture.photo.format : "png";
    EJS.capture.photo.upscale = (typeof EJS.capture.photo.upscale === "number") ? EJS.capture.photo.upscale : 1;
    EJS.capture.video = EJS.capture.video || {};
    EJS.capture.video.format = (typeof EJS.capture.video.format === "string") ? EJS.capture.video.format : "detect";
    EJS.capture.video.upscale = (typeof EJS.capture.video.upscale === "number") ? EJS.capture.video.upscale : 1;
    EJS.capture.video.fps = (typeof EJS.capture.video.fps === "number") ? EJS.capture.video.fps : 30;
    EJS.capture.video.videoBitrate = (typeof EJS.capture.video.videoBitrate === "number") ? EJS.capture.video.videoBitrate : 2.5 * 1024 * 1024;
    EJS.capture.video.audioBitrate = (typeof EJS.capture.video.audioBitrate === "number") ? EJS.capture.video.audioBitrate : 192 * 1024;
    bindListeners(EJS);
    EJS.config.netplayUrl = EJS.config.netplayUrl || "https://netplay.emulatorjs.org";
    EJS.fullscreen = false;
    EJS.enableMouseLock = false;
    EJS.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (EJS.config.forceLegacyCores !== true);
    EJS.webgl2Enabled = getWebgl2Enabled(EJS);
    EJS.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (EJS.config.disableDatabases) {
        EJS.storage = {
            rom: new window.EJS_DUMMYSTORAGE(),
            bios: new window.EJS_DUMMYSTORAGE(),
            core: new window.EJS_DUMMYSTORAGE()
        };
    } else {
        EJS.storage = {
            rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
            bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
            core: new window.EJS_STORAGE("EmulatorJS-core", "core")
        };
    }
    // This is not cache. This is save data
    EJS.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

    EJS.game.classList.add("ejs_game");
    if (typeof EJS.config.backgroundImg === "string") {
        EJS.game.classList.add("ejs_game_background");
        if (EJS.config.backgroundBlur) EJS.game.classList.add("ejs_game_background_blur");
        EJS.game.setAttribute("style", `--ejs-background-image: url("${EJS.config.backgroundImg}"); --ejs-background-color: ${EJS.config.backgroundColor};`);
        EJS.on("start", () => {
            EJS.game.classList.remove("ejs_game_background");
            if (EJS.config.backgroundBlur) EJS.game.classList.remove("ejs_game_background_blur");
        });
    } else {
        EJS.game.setAttribute("style", "--ejs-background-color: " + EJS.config.backgroundColor + ";");
    }

    if (Array.isArray(EJS.config.cheats)) {
        for (let i = 0; i < EJS.config.cheats.length; i++) {
            const cheat = EJS.config.cheats[i];
            if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                EJS.cheats.push({
                    desc: cheat[0],
                    checked: false,
                    code: cheat[1],
                    is_permanent: true
                });
            }
        }
    }

    createStartButton(EJS);
    handleResize(EJS);
}

function initControlVars(EJS) {
    // Initialize control variables
}

function buildButtonOptions(EJS, buttonOpts) {
    // Build button options
    return buttonOpts || {};
}

export function preGetSetting(EJS, setting) {
    // Get setting implementation
    return null;
}

function setElements(EJS, element) {
    const game = EJS.createElement("div");
    const elem = document.querySelector(element);
    elem.innerHTML = "";
    elem.appendChild(game);
    EJS.game = game;

    EJS.elements = {
        main: EJS.game,
        parent: elem
    };
    EJS.elements.parent.classList.add("ejs_parent");
    EJS.elements.parent.setAttribute("tabindex", -1);
}

function setColor(EJS, color) {
    if (typeof color !== "string") color = "";
    let getColor = function (color) {
        color = color.toLowerCase();
        if (color && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
            if (color.length === 4) {
                let rv = "#";
                for (let i = 1; i < 4; i++) {
                    rv += color.slice(i, i + 1) + color.slice(i, i + 1);
                }
                color = rv;
            }
            let rv = [];
            for (let i = 1; i < 7; i += 2) {
                rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
            }
            return rv.join(", ");
        }
        return null;
    };
    if (!color || getColor(color) === null) {
        EJS.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
        return;
    }
    EJS.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}

function setupAds(EJS, ads, width, height) {
    const div = EJS.createElement("div");
    div.classList.add("ejs_ad_iframe");
    const frame = EJS.createElement("iframe");
    frame.src = ads;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "no");
    frame.style.width = width;
    frame.style.height = height;
    const closeParent = EJS.createElement("div");
    closeParent.classList.add("ejs_ad_close");
    const closeButton = EJS.createElement("a");
    closeParent.appendChild(closeButton);
    closeParent.setAttribute("hidden", "");
    div.appendChild(closeParent);
    div.appendChild(frame);
    if (EJS.config.adMode !== 1) {
        EJS.elements.parent.appendChild(div);
    }
    EJS.addEventListener(closeButton, "click", () => {
        div.remove();
    })

    EJS.on("start-clicked", () => {
        if (EJS.config.adMode === 0) div.remove();
        if (EJS.config.adMode === 1) {
            EJS.elements.parent.appendChild(div);
        }
    })

    EJS.on("start", () => {
        closeParent.removeAttribute("hidden");
        const time = (typeof EJS.config.adTimer === "number" && EJS.config.adTimer > 0) ? EJS.config.adTimer : 10000;
        if (EJS.config.adTimer === -1) div.remove();
        if (EJS.config.adTimer === 0) return;
        setTimeout(() => {
            div.remove();
        }, time);
    })
}

export function bindListeners(EJS) {
    // Create context menu and other UI elements
    // This would contain the actual implementation from the original class
    window.addEventListener("resize", () => handleResize(EJS));
}

export function handleResize(EJS) {
    if (!EJS.game.parentElement) {
        return false;
    }
    
    const positionInfo = EJS.elements.parent.getBoundingClientRect();
    EJS.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
    EJS.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);
}

function getWebgl2Enabled(EJS) {
    let setting = preGetSetting(EJS, "webgl2Enabled");
    if (setting === "disabled" || !EJS.supportsWebgl2) {
        return false;
    } else if (setting === "enabled") {
        return true;
    }
    return null;
}

function createStartButton(EJS) {
    const button = EJS.createElement("div");
    button.classList.add("ejs_start_button");
    let border = 0;
    if (typeof EJS.config.backgroundImg === "string") {
        button.classList.add("ejs_start_button_border");
        border = 1;
    }
    button.innerText = (typeof EJS.config.startBtnName === "string") ? EJS.config.startBtnName : "Start Game"; // localization would go here
    if (EJS.config.alignStartButton == "top") {
        button.style.bottom = "calc(100% - 20px)";
    } else if (EJS.config.alignStartButton == "center") {
        button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
    }
    EJS.elements.parent.appendChild(button);
    
    // Add event listeners
    button.addEventListener("touchstart", () => {
        EJS.touch = true;
    });
    
    button.addEventListener("click", (e) => {
        startButtonClicked(EJS, e, button);
    });
    
    if (EJS.config.startOnLoad === true) {
        startButtonClicked(EJS, null, button);
    }
    
    setTimeout(() => {
        if (EJS.functions && EJS.functions.ready) {
            EJS.functions.ready.forEach(fn => fn());
        }
    }, 20);
}

function startButtonClicked(EJS, e, button) {
    if (EJS.functions && EJS.functions["start-clicked"]) {
        EJS.functions["start-clicked"].forEach(fn => fn());
    }
    
    if (e && e.pointerType === "touch") {
        EJS.touch = true;
    }
    
    if (e && e.preventDefault) {
        e.preventDefault();
        button.remove();
    } else if (button) {
        button.remove();
    }
    
    createText(EJS);
    // downloadGameCore(EJS); // This would be implemented in a separate module
}

function createText(EJS) {
    EJS.textElem = EJS.createElement("div");
    EJS.textElem.classList.add("ejs_loading_text");
    if (typeof EJS.config.backgroundImg === "string") EJS.textElem.classList.add("ejs_loading_text_glow");
    EJS.textElem.innerText = "Loading..."; // localization would go here
    EJS.elements.parent.appendChild(EJS.textElem);
}