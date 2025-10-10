export function saveSettings() {
    if (!window.localStorage || this.config.disableLocalStorage || !this.settingsLoaded) return;
    if (!this.started && !this.failedToStart) return;
    const coreSpecific = {
        controlSettings: this.controls,
        settings: this.settings,
        cheats: this.cheats
    }
    const ejs_settings = {
        volume: this.volume,
        muted: this.muted
    }
    localStorage.setItem("ejs-settings", JSON.stringify(ejs_settings));
    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(coreSpecific));
}
export function getLocalStorageKey() {
    let identifier = (this.config.gameId || 1) + "-" + this.getCore(true);
    if (typeof this.config.gameName === "string") {
        identifier += "-" + this.config.gameName;
    } else if (typeof this.config.gameUrl === "string" && !this.config.gameUrl.toLowerCase().startsWith("blob:")) {
        identifier += "-" + this.config.gameUrl;
    } else if (this.config.gameUrl instanceof File) {
        identifier += "-" + this.config.gameUrl.name;
    } else if (typeof this.config.gameId !== "number") {
        console.warn("gameId (EJS_gameID) is not set. This may result in settings persisting across games.");
    }
    return "ejs-" + identifier + "-settings";
}
export function preGetSetting(setting) {
    if (window.localStorage && !this.config.disableLocalStorage) {
        let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific && coreSpecific.settings) {
                return coreSpecific.settings[setting];
            }
        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
    if (this.config.defaultOptions && this.config.defaultOptions[setting]) {
        return this.config.defaultOptions[setting];
    }
    return null;
}
export function getCoreSettings() {
    if (!window.localStorage || this.config.disableLocalStorage) {
        if (this.config.defaultOptions) {
            let rv = "";
            for (const k in this.config.defaultOptions) {
                let value = isNaN(this.config.defaultOptions[k]) ? `"${this.config.defaultOptions[k]}"` : this.config.defaultOptions[k];
                rv += `${k} = ${value}\n`;
            }
            return rv;
        }
        return "";
    };
    let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
    if (coreSpecific) {
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (!(coreSpecific.settings instanceof Object)) throw new Error("Not a JSON object");
            let rv = "";
            for (const k in coreSpecific.settings) {
                let value = isNaN(coreSpecific.settings[k]) ? `"${coreSpecific.settings[k]}"` : coreSpecific.settings[k];
                rv += `${k} = ${value}\n`;
            }
            for (const k in this.config.defaultOptions) {
                if (rv.includes(k)) continue;
                let value = isNaN(this.config.defaultOptions[k]) ? `"${this.config.defaultOptions[k]}"` : this.config.defaultOptions[k];
                rv += `${k} = ${value}\n`;
            }
            return rv;
        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
    return "";
}
export function loadSettings() {
    if (!window.localStorage || this.config.disableLocalStorage) return;
    this.settingsLoaded = true;
    let ejs_settings = localStorage.getItem("ejs-settings");
    let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
    if (coreSpecific) {
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (!(coreSpecific.controlSettings instanceof Object) || !(coreSpecific.settings instanceof Object) || !Array.isArray(coreSpecific.cheats)) return;
            this.controls = coreSpecific.controlSettings;
            this.checkGamepadInputs();
            for (const k in coreSpecific.settings) {
                this.changeSettingOption(k, coreSpecific.settings[k]);
            }
            for (let i = 0; i < coreSpecific.cheats.length; i++) {
                const cheat = coreSpecific.cheats[i];
                let includes = false;
                for (let j = 0; j < this.cheats.length; j++) {
                    if (this.cheats[j].desc === cheat.desc && this.cheats[j].code === cheat.code) {
                        this.cheats[j].checked = cheat.checked;
                        includes = true;
                        break;
                    }
                }
                if (includes) continue;
                this.cheats.push(cheat);
            }

        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
    if (ejs_settings) {
        try {
            ejs_settings = JSON.parse(ejs_settings);
            if (typeof ejs_settings.volume !== "number" || typeof ejs_settings.muted !== "boolean") return;
            this.volume = ejs_settings.volume;
            this.muted = ejs_settings.muted;
            this.setVolume(this.muted ? 0 : this.volume);
        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
}
export function setupSettingsMenu() {
    this.settingsMenu = this.createElement("div");
    this.settingsMenu.classList.add("ejs_settings_parent");
    const nested = this.createElement("div");
    nested.classList.add("ejs_settings_transition");
    this.settings = {};
    this.allSettings = {};
    const menus = [];
    let parentMenuCt = 0;

    const createSettingParent = (child, title, parentElement) => {
        const rv = this.createElement("div");
        rv.classList.add("ejs_setting_menu");

        if (child) {
            const menuOption = this.createElement("div");
            menuOption.classList.add("ejs_settings_main_bar");
            const span = this.createElement("span");
            span.innerText = title;

            menuOption.appendChild(span);
            parentElement.appendChild(menuOption);

            const menu = this.createElement("div");
            const menuChild = this.createElement("div");
            menus.push(menu);
            parentMenuCt++;
            menu.setAttribute("hidden", "");
            menuChild.classList.add("ejs_parent_option_div");
            const button = this.createElement("button");
            const goToHome = () => {
                const homeSize = this.getElementSize(parentElement);
                nested.style.width = (homeSize.width + 20) + "px";
                nested.style.height = homeSize.height + "px";
                menu.setAttribute("hidden", "");
                parentElement.removeAttribute("hidden");
            }
            this.addEventListener(menuOption, "click", (e) => {
                const targetSize = this.getElementSize(menu);
                nested.style.width = (targetSize.width + 20) + "px";
                nested.style.height = targetSize.height + "px";
                menu.removeAttribute("hidden");
                rv.scrollTo(0, 0);
                parentElement.setAttribute("hidden", "");
            })
            const observer = new MutationObserver((list) => {
                for (const k of list) {
                    for (const removed of k.removedNodes) {
                        if (removed === menu) {
                            menuOption.remove();
                            observer.disconnect();
                            const index = menus.indexOf(menu);
                            if (index !== -1) menus.splice(index, 1);
                            this.settingsMenu.style.display = "";
                            const homeSize = this.getElementSize(parentElement);
                            nested.style.width = (homeSize.width + 20) + "px";
                            nested.style.height = homeSize.height + "px";
                            // This SHOULD always be called before the game started - this SHOULD never be an issue
                            this.settingsMenu.style.display = "none";
                        }
                    }
                }
            });
            this.addEventListener(button, "click", goToHome);

            button.type = "button";
            button.classList.add("ejs_back_button");
            menuChild.appendChild(button);
            const pageTitle = this.createElement("span");
            pageTitle.innerText = title;
            pageTitle.classList.add("ejs_menu_text_a");
            button.appendChild(pageTitle);

            // const optionsMenu = this.createElement("div");
            // optionsMenu.classList.add("ejs_setting_menu");
            // menu.appendChild(optionsMenu);

            menuChild.appendChild(rv);
            menu.appendChild(menuChild);
            nested.appendChild(menu);
            observer.observe(nested, {
                childList: true,
                subtree: true,
            });
        }

        return rv;
    }

    const checkForEmptyMenu = (element) => {
        if (element.firstChild === null) {
            element.parentElement.remove(); // No point in keeping an empty menu
            parentMenuCt--;
        }
    }

    const home = createSettingParent();

    this.handleSettingsResize = () => {
        let needChange = false;
        if (this.settingsMenu.style.display !== "") {
            this.settingsMenu.style.opacity = "0";
            this.settingsMenu.style.display = "";
            needChange = true;
        }
        let height = this.elements.parent.getBoundingClientRect().height;
        let w2 = this.settingParent.parentElement.getBoundingClientRect().width;
        let settingsX = this.settingParent.getBoundingClientRect().x;
        if (w2 > window.innerWidth) settingsX += (w2 - window.innerWidth);
        const onTheRight = settingsX > (w2 - 15) / 2;
        if (height > 375) height = 375;
        home.style["max-height"] = (height - 95) + "px";
        nested.style["max-height"] = (height - 95) + "px";
        for (let i = 0; i < menus.length; i++) {
            menus[i].style["max-height"] = (height - 95) + "px";
        }
        this.settingsMenu.classList.toggle("ejs_settings_center_left", !onTheRight);
        this.settingsMenu.classList.toggle("ejs_settings_center_right", onTheRight);
        if (needChange) {
            this.settingsMenu.style.display = "none";
            this.settingsMenu.style.opacity = "";
        }
    }
    nested.appendChild(home);

    let funcs = [];
    let settings = {};
    this.changeSettingOption = (title, newValue, startup) => {
        this.allSettings[title] = newValue;
        if (startup !== true) {
            this.settings[title] = newValue;
        }
        settings[title] = newValue;
        funcs.forEach(e => e(title));
    }
    let allOpts = {};

    const addToMenu = (title, id, options, defaultOption, parentElement, useParentParent) => {
        if (Array.isArray(this.config.hideSettings) && this.config.hideSettings.includes(id)) {
            return;
        }
        parentElement = parentElement || home;
        const transitionElement = useParentParent ? parentElement.parentElement.parentElement : parentElement;
        const menuOption = this.createElement("div");
        menuOption.classList.add("ejs_settings_main_bar");
        const span = this.createElement("span");
        span.innerText = title;

        const current = this.createElement("div");
        current.innerText = "";
        current.classList.add("ejs_settings_main_bar_selected");
        span.appendChild(current);

        menuOption.appendChild(span);
        parentElement.appendChild(menuOption);

        const menu = this.createElement("div");
        menus.push(menu);
        const menuChild = this.createElement("div");
        menu.setAttribute("hidden", "");
        menuChild.classList.add("ejs_parent_option_div");

        const optionsMenu = this.createElement("div");
        optionsMenu.classList.add("ejs_setting_menu");

        const button = this.createElement("button");
        const goToHome = () => {
            transitionElement.removeAttribute("hidden");
            menu.setAttribute("hidden", "");
            const homeSize = this.getElementSize(transitionElement);
            nested.style.width = (homeSize.width + 20) + "px";
            nested.style.height = homeSize.height + "px";
            transitionElement.removeAttribute("hidden");
        }
        this.addEventListener(menuOption, "click", (e) => {
            const targetSize = this.getElementSize(menu);
            nested.style.width = (targetSize.width + 20) + "px";
            nested.style.height = targetSize.height + "px";
            menu.removeAttribute("hidden");
            optionsMenu.scrollTo(0, 0);
            transitionElement.setAttribute("hidden", "");
            transitionElement.setAttribute("hidden", "");
        })
        this.addEventListener(button, "click", goToHome);

        button.type = "button";
        button.classList.add("ejs_back_button");
        menuChild.appendChild(button);
        const pageTitle = this.createElement("span");
        pageTitle.innerText = title;
        pageTitle.classList.add("ejs_menu_text_a");
        button.appendChild(pageTitle);

        let buttons = [];
        let opts = options;
        if (Array.isArray(options)) {
            opts = {};
            for (let i = 0; i < options.length; i++) {
                opts[options[i]] = options[i];
            }
        }
        allOpts[id] = opts;

        funcs.push((title) => {
            if (id !== title) return;
            for (let j = 0; j < buttons.length; j++) {
                buttons[j].classList.toggle("ejs_option_row_selected", buttons[j].getAttribute("ejs_value") === settings[id]);
            }
            this.menuOptionChanged(id, settings[id]);
            current.innerText = opts[settings[id]];
        });

        for (const opt in opts) {
            const optionButton = this.createElement("button");
            buttons.push(optionButton);
            optionButton.setAttribute("ejs_value", opt);
            optionButton.type = "button";
            optionButton.value = opts[opt];
            optionButton.classList.add("ejs_option_row");
            optionButton.classList.add("ejs_button_style");

            this.addEventListener(optionButton, "click", (e) => {
                this.changeSettingOption(id, opt);
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove("ejs_option_row_selected");
                }
                optionButton.classList.add("ejs_option_row_selected");
                this.menuOptionChanged(id, opt);
                current.innerText = opts[opt];
                goToHome();
            })
            if (defaultOption === opt) {
                optionButton.classList.add("ejs_option_row_selected");
                this.menuOptionChanged(id, opt);
                current.innerText = opts[opt];
            }

            const msg = this.createElement("span");
            msg.innerText = opts[opt];
            optionButton.appendChild(msg);

            optionsMenu.appendChild(optionButton);
        }

        menuChild.appendChild(optionsMenu);

        menu.appendChild(menuChild);
        nested.appendChild(menu);
    }
    const cores = getCores();
    const core = cores[this.getCore(true)];
    if (core && core.length > 1) {
        addToMenu(this.localization("Core" + " (" + this.localization("Requires restart") + ")"), "retroarch_core", core, this.getCore(), home);
    }
    if (typeof window.SharedArrayBuffer === "function" && !this.requiresThreads(this.getCore())) {
        addToMenu(this.localization("Threads"), "ejs_threads", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, this.config.threads ? "enabled" : "disabled", home);
    }

    const graphicsOptions = createSettingParent(true, "Graphics Settings", home);

    if (this.config.shaders) {
        const builtinShaders = {
            "2xScaleHQ.glslp": this.localization("2xScaleHQ"),
            "4xScaleHQ.glslp": this.localization("4xScaleHQ"),
            "crt-aperture.glslp": this.localization("CRT aperture"),
            "crt-beam": this.localization("CRT beam"),
            "crt-caligari": this.localization("CRT caligari"),
            "crt-easymode.glslp": this.localization("CRT easymode"),
            "crt-geom.glslp": this.localization("CRT geom"),
            "crt-lottes": this.localization("CRT lottes"),
            "crt-mattias.glslp": this.localization("CRT mattias"),
            "crt-yeetron": this.localization("CRT yeetron"),
            "crt-zfast": this.localization("CRT zfast"),
            "sabr": this.localization("SABR"),
            "bicubic": this.localization("Bicubic"),
            "mix-frames": this.localization("Mix frames"),
        };
        let shaderMenu = {
            "disabled": this.localization("Disabled"),
        };
        for (const shaderName in this.config.shaders) {
            if (builtinShaders[shaderName]) {
                shaderMenu[shaderName] = builtinShaders[shaderName];
            } else {
                shaderMenu[shaderName] = shaderName;
            }
        }
        addToMenu(this.localization("Shaders"), "shader", shaderMenu, "disabled", graphicsOptions, true);
    }

    if (this.supportsWebgl2 && !this.requiresWebGL2(this.getCore())) {
        addToMenu(this.localization("WebGL2") + " (" + this.localization("Requires restart") + ")", "webgl2Enabled", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, this.webgl2Enabled ? "enabled" : "disabled", graphicsOptions, true);
    }

    addToMenu(this.localization("FPS"), "fps", {
        "show": this.localization("show"),
        "hide": this.localization("hide")
    }, "hide", graphicsOptions, true);

    addToMenu(this.localization("VSync"), "vsync", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, "enabled", graphicsOptions, true);

    addToMenu(this.localization("Video Rotation"), "videoRotation", {
        "0": "0 deg",
        "1": "90 deg",
        "2": "180 deg",
        "3": "270 deg"
    }, this.videoRotation.toString(), graphicsOptions, true);

    const screenCaptureOptions = createSettingParent(true, "Screen Capture", home);

    addToMenu(this.localization("Screenshot Source"), "screenshotSource", {
        "canvas": "canvas",
        "retroarch": "retroarch"
    }, this.capture.photo.source, screenCaptureOptions, true);

    let screenshotFormats = {
        "png": "png",
        "jpeg": "jpeg",
        "webp": "webp"
    }
    if (isSafari) {
        delete screenshotFormats["webp"];
    }
    if (!(this.capture.photo.format in screenshotFormats)) {
        this.capture.photo.format = "png";
    }
    addToMenu(this.localization("Screenshot Format"), "screenshotFormat", screenshotFormats, this.capture.photo.format, screenCaptureOptions, true);

    const screenshotUpscale = this.capture.photo.upscale.toString();
    let screenshotUpscales = {
        "0": "native",
        "1": "1x",
        "2": "2x",
        "3": "3x"
    }
    if (!(screenshotUpscale in screenshotUpscales)) {
        screenshotUpscales[screenshotUpscale] = screenshotUpscale + "x";
    }
    addToMenu(this.localization("Screenshot Upscale"), "screenshotUpscale", screenshotUpscales, screenshotUpscale, screenCaptureOptions, true);

    const screenRecordFPS = this.capture.video.fps.toString();
    let screenRecordFPSs = {
        "30": "30",
        "60": "60"
    }
    if (!(screenRecordFPS in screenRecordFPSs)) {
        screenRecordFPSs[screenRecordFPS] = screenRecordFPS;
    }
    addToMenu(this.localization("Screen Recording FPS"), "screenRecordFPS", screenRecordFPSs, screenRecordFPS, screenCaptureOptions, true);

    let screenRecordFormats = {
        "mp4": "mp4",
        "webm": "webm"
    }
    for (const format in screenRecordFormats) {
        if (!MediaRecorder.isTypeSupported("video/" + format)) {
            delete screenRecordFormats[format];
        }
    }
    if (!(this.capture.video.format in screenRecordFormats)) {
        this.capture.video.format = Object.keys(screenRecordFormats)[0];
    }
    addToMenu(this.localization("Screen Recording Format"), "screenRecordFormat", screenRecordFormats, this.capture.video.format, screenCaptureOptions, true);

    const screenRecordUpscale = this.capture.video.upscale.toString();
    let screenRecordUpscales = {
        "1": "1x",
        "2": "2x",
        "3": "3x",
        "4": "4x"
    }
    if (!(screenRecordUpscale in screenRecordUpscales)) {
        screenRecordUpscales[screenRecordUpscale] = screenRecordUpscale + "x";
    }
    addToMenu(this.localization("Screen Recording Upscale"), "screenRecordUpscale", screenRecordUpscales, screenRecordUpscale, screenCaptureOptions, true);

    const screenRecordVideoBitrate = this.capture.video.videoBitrate.toString();
    let screenRecordVideoBitrates = {
        "1048576": "1 Mbit/sec",
        "2097152": "2 Mbit/sec",
        "2621440": "2.5 Mbit/sec",
        "3145728": "3 Mbit/sec",
        "4194304": "4 Mbit/sec"
    }
    if (!(screenRecordVideoBitrate in screenRecordVideoBitrates)) {
        screenRecordVideoBitrates[screenRecordVideoBitrate] = screenRecordVideoBitrate + " Bits/sec";
    }
    addToMenu(this.localization("Screen Recording Video Bitrate"), "screenRecordVideoBitrate", screenRecordVideoBitrates, screenRecordVideoBitrate, screenCaptureOptions, true);

    const screenRecordAudioBitrate = this.capture.video.audioBitrate.toString();
    let screenRecordAudioBitrates = {
        "65536": "64 Kbit/sec",
        "131072": "128 Kbit/sec",
        "196608": "192 Kbit/sec",
        "262144": "256 Kbit/sec",
        "327680": "320 Kbit/sec"
    }
    if (!(screenRecordAudioBitrate in screenRecordAudioBitrates)) {
        screenRecordAudioBitrates[screenRecordAudioBitrate] = screenRecordAudioBitrate + " Bits/sec";
    }
    addToMenu(this.localization("Screen Recording Audio Bitrate"), "screenRecordAudioBitrate", screenRecordAudioBitrates, screenRecordAudioBitrate, screenCaptureOptions, true);

    checkForEmptyMenu(screenCaptureOptions);

    const speedOptions = createSettingParent(true, "Speed Options", home);

    addToMenu(this.localization("Fast Forward"), "fastForward", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, "disabled", speedOptions, true);

    addToMenu(this.localization("Fast Forward Ratio"), "ff-ratio", [
        "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0", "unlimited"
    ], "3.0", speedOptions, true);

    addToMenu(this.localization("Slow Motion"), "slowMotion", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, "disabled", speedOptions, true);

    addToMenu(this.localization("Slow Motion Ratio"), "sm-ratio", [
        "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"
    ], "3.0", speedOptions, true);

    addToMenu(this.localization("Rewind Enabled" + " (" + this.localization("Requires restart") + ")"), "rewindEnabled", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, "disabled", speedOptions, true);

    if (this.rewindEnabled) {
        addToMenu(this.localization("Rewind Granularity"), "rewind-granularity", [
            "1", "3", "6", "12", "25", "50", "100"
        ], "6", speedOptions, true);
    }

    const inputOptions = createSettingParent(true, "Input Options", home);

    addToMenu(this.localization("Menubar Mouse Trigger"), "menubarBehavior", {
        "downward": this.localization("Downward Movement"),
        "anywhere": this.localization("Movement Anywhere"),
    }, "downward", inputOptions, true);

    addToMenu(this.localization("Direct Keyboard Input"), "keyboardInput", {
        "disabled": this.localization("Disabled"),
        "enabled": this.localization("Enabled"),
    }, ((this.defaultCoreOpts && this.defaultCoreOpts.useKeyboard === true) ? "enabled" : "disabled"), inputOptions, true);

    addToMenu(this.localization("Forward Alt key"), "altKeyboardInput", {
        "disabled": this.localization("Disabled"),
        "enabled": this.localization("Enabled"),
    }, "disabled", inputOptions, true);

    addToMenu(this.localization("Lock Mouse"), "lockMouse", {
        "disabled": this.localization("Disabled"),
        "enabled": this.localization("Enabled"),
    }, (this.enableMouseLock === true ? "enabled" : "disabled"), inputOptions, true);

    checkForEmptyMenu(inputOptions);

    if (this.saveInBrowserSupported()) {
        const saveStateOpts = createSettingParent(true, "Save States", home);
        addToMenu(this.localization("Save State Slot"), "save-state-slot", ["1", "2", "3", "4", "5", "6", "7", "8", "9"], "1", saveStateOpts, true);
        addToMenu(this.localization("Save State Location"), "save-state-location", {
            "download": this.localization("Download"),
            "browser": this.localization("Keep in Browser")
        }, "download", saveStateOpts, true);
        addToMenu(this.localization("System Save interval"), "save-save-interval", {
            "0": "Disabled",
            "30": "30 seconds",
            "60": "1 minute",
            "300": "5 minutes",
            "600": "10 minutes",
            "900": "15 minutes",
            "1800": "30 minutes"
        }, "300", saveStateOpts, true);
        checkForEmptyMenu(saveStateOpts);
    }

    if (this.touch || this.hasTouchScreen) {
        const virtualGamepad = createSettingParent(true, "Virtual Gamepad", home);
        addToMenu(this.localization("Virtual Gamepad"), "virtual-gamepad", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, isMobile ? "enabled" : "disabled", virtualGamepad, true);
        addToMenu(this.localization("Menu Bar Button"), "menu-bar-button", {
            "visible": this.localization("visible"),
            "hidden": this.localization("hidden")
        }, "visible", virtualGamepad, true);
        addToMenu(this.localization("Left Handed Mode"), "virtual-gamepad-left-handed-mode", {
            "enabled": this.localization("Enabled"),
            "disabled": this.localization("Disabled")
        }, "disabled", virtualGamepad, true);
        checkForEmptyMenu(virtualGamepad);
    }

    let coreOpts;
    try {
        coreOpts = this.gameManager.getCoreOptions();
    } catch (e) { }
    if (coreOpts) {
        const coreOptions = createSettingParent(true, "Backend Core Options", home);
        coreOpts.split("\n").forEach((line, index) => {
            let option = line.split("; ");
            let name = option[0];
            let options = option[1].split("|"),
                optionName = name.split("|")[0].replace(/_/g, " ").replace(/.+\-(.+)/, "$1");
            options.slice(1, -1);
            if (options.length === 1) return;
            let availableOptions = {};
            for (let i = 0; i < options.length; i++) {
                availableOptions[options[i]] = this.localization(options[i], this.config.settingsLanguage);
            }
            addToMenu(this.localization(optionName, this.config.settingsLanguage),
                name.split("|")[0], availableOptions,
                (name.split("|").length > 1) ? name.split("|")[1] : options[0].replace("(Default) ", ""),
                coreOptions,
                true);
        })
        checkForEmptyMenu(coreOptions);
    }

    /*
    this.retroarchOpts = [
        {
            title: "Audio Latency", // String
            name: "audio_latency", // String - value to be set in retroarch.cfg
            // options should ALWAYS be strings here...
            options: ["8", "16", "32", "64", "128"], // values
            options: {"8": "eight", "16": "sixteen", "32": "thirty-two", "64": "sixty-four", "128": "one hundred-twenty-eight"}, // This also works
            default: "128", // Default
            isString: false // Surround value with quotes in retroarch.cfg file?
        }
    ];*/

    if (this.retroarchOpts && Array.isArray(this.retroarchOpts)) {
        const retroarchOptsMenu = createSettingParent(true, "RetroArch Options" + " (" + this.localization("Requires restart") + ")", home);
        this.retroarchOpts.forEach(option => {
            addToMenu(this.localization(option.title, this.config.settingsLanguage),
                option.name,
                option.options,
                option.default,
                retroarchOptsMenu,
                true);
        })
        checkForEmptyMenu(retroarchOptsMenu);
    }

    checkForEmptyMenu(graphicsOptions);
    checkForEmptyMenu(speedOptions);

    this.settingsMenu.appendChild(nested);

    this.settingParent.appendChild(this.settingsMenu);
    this.settingParent.style.position = "relative";

    this.settingsMenu.style.display = "";
    const homeSize = this.getElementSize(home);
    nested.style.width = (homeSize.width + 20) + "px";
    nested.style.height = homeSize.height + "px";

    this.settingsMenu.style.display = "none";

    if (this.debug) {
        console.log("Available core options", allOpts);
    }

    if (this.config.defaultOptions) {
        for (const k in this.config.defaultOptions) {
            this.changeSettingOption(k, this.config.defaultOptions[k], true);
        }
    }

    if (parentMenuCt === 0) {
        this.on("start", () => {
            this.elements.bottomBar.settings[0][0].style.display = "none";
        });
    }
}