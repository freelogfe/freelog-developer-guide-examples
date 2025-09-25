/**
 * EmulatorJS Core Module
 * 包含基础工具函数、核心检测和管理功能
 */

export class EmulatorCore {
    constructor() {
        this.ejs_version = "4.2.3";
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);

        // 默认按钮别名
        this.defaultButtonAliases = {
            "rightclick": "contextMenu"
        };
    }

    /**
     * 获取支持的核心列表
     */
    getCores() {
        let rv = {
            "atari5200": ["a5200"],
            "vb": ["beetle_vb"],
            "nds": ["melonds", "desmume", "desmume2015"],
            "arcade": ["fbneo", "fbalpha2012_cps1", "fbalpha2012_cps2"],
            "nes": ["fceumm", "nestopia"],
            "gb": ["gambatte"],
            "coleco": ["gearcoleco"],
            "segaMS": ["smsplus", "genesis_plus_gx", "picodrive"],
            "segaMD": ["genesis_plus_gx", "picodrive"],
            "segaGG": ["genesis_plus_gx"],
            "segaCD": ["genesis_plus_gx", "picodrive"],
            "sega32x": ["picodrive"],
            "sega": ["genesis_plus_gx", "picodrive"],
            "lynx": ["handy"],
            "mame": ["mame2003_plus", "mame2003"],
            "ngp": ["mednafen_ngp"],
            "pce": ["mednafen_pce"],
            "pcfx": ["mednafen_pcfx"],
            "psx": ["pcsx_rearmed", "mednafen_psx_hw"],
            "ws": ["mednafen_wswan"],
            "gba": ["mgba"],
            "n64": ["mupen64plus_next", "parallel_n64"],
            "3do": ["opera"],
            "psp": ["ppsspp"],
            "atari7800": ["prosystem"],
            "snes": ["snes9x"],
            "atari2600": ["stella2014"],
            "jaguar": ["virtualjaguar"],
            "segaSaturn": ["yabause"],
            "amiga": ["puae"],
            "c64": ["vice_x64sc"],
            "c128": ["vice_x128"],
            "pet": ["vice_xpet"],
            "plus4": ["vice_xplus4"],
            "vic20": ["vice_xvic"],
            "dos": ["dosbox_pure"]
        };
        if (this.isSafari && this.isMobile) {
            rv.n64 = rv.n64.reverse();
        }
        return rv;
    }

    /**
     * 检查核心是否需要线程支持
     */
    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }

    /**
     * 检查核心是否需要WebGL2支持
     */
    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }

    /**
     * 获取核心名称
     */
    getCore(generic) {
        const cores = this.getCores();
        const core = this.config.system;
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
            return core;
        }
        const gen = this.getCore(true);
        if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
            return this.preGetSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return core;
    }

    /**
     * 创建DOM元素
     */
    createElement(type) {
        return document.createElement(type);
    }

    /**
     * 添加事件监听器
     */
    addEventListener(element, listener, callback) {
        const listeners = listener.split(" ");
        let rv = [];
        for (let i = 0; i < listeners.length; i++) {
            element.addEventListener(listeners[i], callback);
            const data = { cb: callback, elem: element, listener: listeners[i] };
            rv.push(data);
        }
        return rv;
    }

    /**
     * 移除事件监听器
     */
    removeEventListener(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].elem.removeEventListener(data[i].listener, data[i].cb);
        }
    }

    /**
     * 将数据转换为Uint8Array
     */
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
        })
    }

    /**
     * 检查更新
     */
    checkForUpdates() {
        if (this.ejs_version.endsWith("-beta")) {
            console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended unless you build and ship your own cores.");
            return;
        }
        fetch("https://cdn.emulatorjs.org/stable/data/version.json").then(response => {
            if (response.ok) {
                response.text().then(body => {
                    let version = JSON.parse(body);
                    if (this.versionAsInt(this.ejs_version) < this.versionAsInt(version.version)) {
                        console.log(`Using EmulatorJS version ${this.ejs_version} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                    }
                })
            }
        })
    }

    /**
     * 版本号转换为整数
     */
    versionAsInt(ver) {
        if (ver.endsWith("-beta")) {
            return 99999999;
        }
        let rv = ver.split(".");
        if (rv[rv.length - 1].length === 1) {
            rv[rv.length - 1] = "0" + rv[rv.length - 1];
        }
        return parseInt(rv.join(""));
    }

    /**
     * 设置颜色
     */
    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
                if (color.length === 4) {
                    let rv = "#";
                    for (let i = 1; i < 4; i++) {
                        rv += color.charAt(i) + color.charAt(i);
                    }
                    return rv;
                }
                return color;
            }
            let rv = [];
            for (let i = 1; i < 7; i += 2) {
                rv.push(parseInt(color.substr(i, 2), 16));
            }
            return rv;
        }
        if (!color || getColor(color) === null) {
            this.color = "rgb(51, 51, 51)";
            return;
        }
        if (Array.isArray(getColor(color))) {
            this.color = "rgb(" + getColor(color).join(", ") + ")";
        } else {
            this.color = getColor(color);
        }
    }

    /**
     * 获取元素尺寸
     */
    getElementSize(element) {
        let elem = element.cloneNode(true);
        elem.style.position = "absolute";
        elem.style.opacity = 0;
        elem.removeAttribute("hidden");
        element.parentNode.appendChild(elem);
        const res = elem.getBoundingClientRect();
        elem.remove();
        return {
            "width": res.width,
            "height": res.height
        };
    }

    /**
     * 获取本地存储键
     */
    getLocalStorageKey() {
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

    /**
     * 预获取设置
     */
    preGetSetting(setting) {
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

    /**
     * 获取设置值
     */
    getSettingValue(key) {
        return this.preGetSetting(key);
    }

    /**
     * 保存设置
     */
    saveSettings() {
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

    /**
     * 获取核心设置
     */
    getCoreSettings() {
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
                return rv;
            } catch (e) {
                console.warn("Could not load core settings", e);
            }
        }
        if (this.config.defaultOptions) {
            let rv = "";
            for (const k in this.config.defaultOptions) {
                let value = isNaN(this.config.defaultOptions[k]) ? `"${this.config.defaultOptions[k]}"` : this.config.defaultOptions[k];
                rv += `${k} = ${value}\n`;
            }
            return rv;
        }
        return "";
    }

    /**
     * 构建按钮选项
     */
    buildButtonOptions(buttonUserOpts) {
        let mergedButtonOptions = this.defaultButtonOptions;

        // merge buttonUserOpts with mergedButtonOptions
        if (buttonUserOpts) {
            for (const key in buttonUserOpts) {
                let searchKey = key;
                // If the key is an alias, find the actual key in the default buttons
                if (this.defaultButtonAliases[key]) {
                    // Use the alias to find the actual key
                    // and update the searchKey to the actual key
                    searchKey = this.defaultButtonAliases[key];
                }

                // prevent the contextMenu button from being overridden
                if (searchKey === "contextMenu")
                    continue;

                // Check if the button exists in the default buttons, and update its properties
                if (!mergedButtonOptions[searchKey]) {
                    console.warn(`Button "${searchKey}" is not a valid button.`);
                    continue;
                }

                // if the value is a boolean, set the visible property to the value
                if (typeof buttonUserOpts[searchKey] === "boolean") {
                    mergedButtonOptions[searchKey].visible = buttonUserOpts[searchKey];
                } else if (typeof buttonUserOpts[searchKey] === "object") {
                    // If the value is an object, merge it with the default button properties

                    if (this.defaultButtonOptions[searchKey]) {
                        // copy properties from the button definition if they aren't null
                        for (const prop in buttonUserOpts[searchKey]) {
                            if (buttonUserOpts[searchKey][prop] !== null) {
                                mergedButtonOptions[searchKey][prop] = buttonUserOpts[searchKey][prop];
                            }
                        }
                    } else {
                        // button was not in the default buttons list and is therefore a custom button
                        // verify that the value has a displayName, icon, and callback property
                        if (buttonUserOpts[searchKey].displayName && buttonUserOpts[searchKey].icon && buttonUserOpts[searchKey].callback) {
                            mergedButtonOptions[searchKey] = {
                                visible: true,
                                displayName: buttonUserOpts[searchKey].displayName,
                                icon: buttonUserOpts[searchKey].icon,
                                callback: buttonUserOpts[searchKey].callback,
                                custom: true
                            };
                        } else {
                            console.warn(`Custom button "${searchKey}" is missing required properties`);
                        }
                    }
                }

                // behaviour exceptions
                switch (searchKey) {
                    case "playPause":
                        mergedButtonOptions.play.visible = mergedButtonOptions.playPause.visible;
                        mergedButtonOptions.pause.visible = mergedButtonOptions.playPause.visible;
                        break;

                    case "mute":
                        mergedButtonOptions.unmute.visible = mergedButtonOptions.mute.visible;
                        break;

                    case "fullscreen":
                        mergedButtonOptions.enterFullscreen.visible = mergedButtonOptions.fullscreen.visible;
                        mergedButtonOptions.exitFullscreen.visible = mergedButtonOptions.fullscreen.visible;
                        break;
                }
            }
        }

        return mergedButtonOptions;
    }
}
