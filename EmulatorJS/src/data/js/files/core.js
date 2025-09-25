/**
 * EmulatorJS Core Module
 * 核心功能模块 - 处理核心检测、版本管理、工具函数等
 */

export class EmulatorCore {
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
     * 检查核心是否需要线程
     */
    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }

    /**
     * 检查核心是否需要WebGL2
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
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
        }
        const gen = this.config.system;
        if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
            return this.preGetSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return null;
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
        const listeners = this.eventListeners || (this.eventListeners = []);
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i].element === element && listeners[i].listener === listener) {
                return;
            }
        }
        element.addEventListener(listener, callback);
        listeners.push({ element, listener, callback });
    }

    /**
     * 移除事件监听器
     */
    removeEventListener(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].element.removeEventListener(data[i].listener, data[i].callback);
        }
    }

    /**
     * 设置颜色
     */
    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            if (color.startsWith("#")) {
                return color;
            }
            if (color.startsWith("rgb")) {
                return color;
            }
            if (color.startsWith("hsl")) {
                return color;
            }
            if (color.startsWith("var(")) {
                return color;
            }
            return "#" + color;
        };
        if (color) {
            this.game.style.setProperty("--ejs-primary-color", getColor(color));
        }
    }

    /**
     * 获取元素尺寸
     */
    getElementSize(element) {
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * 获取本地存储键名
     */
    getLocalStorageKey() {
        const gameName = this.config.gameName || "game";
        const core = this.getCore();
        return `EJS_${gameName}_${core}`;
    }

    /**
     * 预获取设置
     */
    preGetSetting(setting) {
        const key = this.getLocalStorageKey();
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const data = JSON.parse(stored);
                return data[setting] || this.config.defaultOptions?.[setting];
            }
        } catch (e) {
            // Ignore localStorage errors
        }
        return this.config.defaultOptions?.[setting];
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
        const key = this.getLocalStorageKey();
        const settings = {
            retroarch_core: this.getCore(),
            volume: this.volume,
            muted: this.muted,
            rewindEnabled: this.rewindEnabled ? "enabled" : "disabled"
        };
        try {
            localStorage.setItem(key, JSON.stringify(settings));
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    /**
     * 获取核心设置
     */
    getCoreSettings() {
        const settings = {};
        const core = this.getCore();
        if (core) {
            settings.retroarch_core = core;
        }
        return JSON.stringify(settings);
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

    /**
     * 版本转换为整数
     */
    versionAsInt(ver) {
        const rv = ver.split(".").map(v => v.padStart(2, "0"));
        return parseInt(rv.join(""));
    }

    /**
     * 检查更新
     */
    checkForUpdates() {
        // 检查更新逻辑
        fetch("https://api.github.com/repos/EmulatorJS/EmulatorJS/releases/latest")
            .then(response => response.json())
            .then(data => {
                const latestVersion = data.tag_name.replace("v", "");
                const currentVersion = this.ejs_version;
                if (this.versionAsInt(latestVersion) > this.versionAsInt(currentVersion)) {
                    console.log(`New version available: ${latestVersion}`);
                }
            })
            .catch(error => {
                console.log("Could not check for updates:", error);
            });
    }

    /**
     * 默认按钮选项
     */
    get defaultButtonOptions() {
        return {
            play: {
                visible: true,
                displayName: "Play",
                icon: "▶",
                callback: () => this.togglePause()
            },
            pause: {
                visible: true,
                displayName: "Pause",
                icon: "⏸",
                callback: () => this.togglePause()
            },
            playPause: {
                visible: true,
                displayName: "Play/Pause",
                icon: "⏯",
                callback: () => this.togglePause()
            },
            restart: {
                visible: true,
                displayName: "Restart",
                icon: "🔄",
                callback: () => this.restart()
            },
            mute: {
                visible: true,
                displayName: "Mute",
                icon: "🔇",
                callback: () => this.toggleMute()
            },
            unmute: {
                visible: false,
                displayName: "Unmute",
                icon: "🔊",
                callback: () => this.toggleMute()
            },
            fullscreen: {
                visible: true,
                displayName: "Fullscreen",
                icon: "⛶",
                callback: () => this.toggleFullscreen()
            },
            enterFullscreen: {
                visible: true,
                displayName: "Enter Fullscreen",
                icon: "⛶",
                callback: () => this.toggleFullscreen(true)
            },
            exitFullscreen: {
                visible: false,
                displayName: "Exit Fullscreen",
                icon: "⛶",
                callback: () => this.toggleFullscreen(false)
            },
            screenshot: {
                visible: true,
                displayName: "Screenshot",
                icon: "📷",
                callback: () => this.screenshot()
            },
            saveState: {
                visible: true,
                displayName: "Save State",
                icon: "💾",
                callback: () => this.quickSave()
            },
            loadState: {
                visible: true,
                displayName: "Load State",
                icon: "📁",
                callback: () => this.quickLoad()
            },
            settings: {
                visible: true,
                displayName: "Settings",
                icon: "⚙️",
                callback: () => this.showSettings()
            },
            contextMenu: {
                visible: true,
                displayName: "Context Menu",
                icon: "⋯",
                callback: () => this.showContextMenu()
            }
        };
    }

    /**
     * 默认按钮别名
     */
    get defaultButtonAliases() {
        return {
            "playPause": "playPause",
            "mute": "mute",
            "fullscreen": "fullscreen"
        };
    }
}
