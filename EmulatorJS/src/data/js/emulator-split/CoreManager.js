/**
 * 核心管理模块
 * 负责游戏核心的加载、初始化和管理
 */
export class CoreManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

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
        if (this.emulator.isSafari && this.emulator.isMobile) {
            rv.n64 = rv.n64.reverse();
        }
        return rv;
    }

    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }

    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }

    getCore(generic) {
        const cores = this.getCores();
        const core = this.emulator.config.system;
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
            return core;
        }
        const gen = this.getCore(true);
        if (cores[gen] && cores[gen].includes(this.emulator.preGetSafeSetting("retroarch_core"))) {
            return this.emulator.preGetSafeSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return core;
    }

    checkCoreCompatibility(version) {
        if (this.emulator.versionAsInt(version.minimumEJSVersion) > this.emulator.versionAsInt(this.emulator.ejs_version)) {
            this.emulator.startGameError(this.emulator.localization("Outdated EmulatorJS version"));
            throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
        }
    }

    downloadGameCore() {
        this.emulator.textElem.innerText = this.emulator.localization("Download Game Core");
        if (!this.emulator.config.threads && this.requiresThreads(this.getCore())) {
            this.emulator.startGameError(this.emulator.localization("Error for site owner") + "\n" + this.emulator.localization("Check console"));
            console.warn("This core requires threads, but EJS_threads is not set!");
            return;
        }
        if (!this.emulator.supportsWebgl2 && this.requiresWebGL2(this.getCore())) {
            this.emulator.startGameError(this.emulator.localization("Outdated graphics driver"));
            return;
        }
        if (this.emulator.config.threads && typeof window.SharedArrayBuffer !== "function") {
            this.emulator.startGameError(this.emulator.localization("Error for site owner") + "\n" + this.emulator.localization("Check console"));
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            return;
        }
        const gotCore = (data) => {
            this.emulator.defaultCoreOpts = {};
            this.emulator.checkCompression(new Uint8Array(data), this.emulator.localization("Decompress Game Core")).then((data) => {
                let js, thread, wasm;
                for (let k in data) {
                    if (k.endsWith(".wasm")) {
                        wasm = data[k];
                    } else if (k.endsWith(".worker.js")) {
                        thread = data[k];
                    } else if (k.endsWith(".js")) {
                        js = data[k];
                    } else if (k === "build.json") {
                        this.checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                    } else if (k === "core.json") {
                        let core = JSON.parse(new TextDecoder().decode(data[k]));
                        this.emulator.extensions = core.extensions;
                        this.emulator.coreName = core.name;
                        this.emulator.repository = core.repo;
                        this.emulator.defaultCoreOpts = core.options;
                        this.emulator.enableMouseLock = core.options.supportsMouse;
                        this.emulator.retroarchOpts = core.retroarchOpts;
                        this.emulator.saveFileExt = core.save;
                    } else if (k === "license.txt") {
                        this.emulator.license = new TextDecoder().decode(data[k]);
                    }
                }

                if (this.emulator.saveFileExt === false) {
                    this.emulator.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.emulator.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
                this.initGameCore(js, wasm, thread);
            });
        }
        const report = "cores/reports/" + this.getCore() + ".json";
        this.emulator.downloadFile(report, null, false, { responseType: "text", method: "GET" }).then(async rep => {
            if (rep === -1 || typeof rep === "string" || typeof rep.data === "string") {
                rep = {};
            } else {
                rep = rep.data;
            }
            if (!rep.buildStart) {
                console.warn("Could not fetch core report JSON! Core caching will be disabled!");
                rep.buildStart = Math.random() * 100;
            }
            if (this.emulator.webgl2Enabled === null) {
                this.emulator.webgl2Enabled = rep.options ? rep.options.defaultWebGL2 : false;
            }
            if (this.requiresWebGL2(this.getCore())) {
                this.emulator.webgl2Enabled = true;
            }
            let threads = false;
            if (typeof window.SharedArrayBuffer === "function") {
                const opt = this.emulator.preGetSafeSetting("ejs_threads");
                if (opt) {
                    threads = (opt === "enabled");
                } else {
                    threads = this.emulator.config.threads;
                }
            }

            let legacy = (this.emulator.supportsWebgl2 && this.emulator.webgl2Enabled ? "" : "-legacy");
            let filename = this.getCore() + (threads ? "-thread" : "") + legacy + "-wasm.data";
            if (!this.emulator.debug) {
                const result = await this.emulator.storage.core.get(filename);
                if (result && result.version === rep.buildStart) {
                    gotCore(result.data);
                    return;
                }
            }
            const corePath = "cores/" + filename;
            // let res = await this.emulator.downloadFile(corePath, (progress) => {
            // this.emulator.textElem.innerText = this.emulator.localization("Download Game Core") + progress;
            // }, false, { responseType: "arraybuffer", method: "GET" });
            // if (res === -1) {
            console.log("File not found, attemping to fetch from emulatorjs cdn.");
            console.error("**THIS METHOD IS A FAILSAFE, AND NOT OFFICIALLY SUPPORTED. USE AT YOUR OWN RISK**");
            let version = this.emulator.ejs_version.endsWith("-beta") ? "nightly" : this.emulator.ejs_version;
            let res = await this.emulator.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${corePath}`, (progress) => {
                this.emulator.textElem.innerText = this.emulator.localization("Download Game Core") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                if (!this.emulator.supportsWebgl2) {
                    this.emulator.startGameError(this.emulator.localization("Outdated graphics driver"));
                } else {
                    this.emulator.startGameError(this.emulator.localization("Error downloading core") + " (" + filename + ")");
                }
                return;
            }
            console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
            // }
            gotCore(res.data);
            this.emulator.storage.core.put(filename, {
                version: rep.buildStart,
                data: res.data
            });
        });
    }

    initGameCore(js, wasm, thread) {
        // 替换 var EJS_Runtime 为 window.EJS_Runtime 以确保在微前端环境中能正确挂载
        let modifiedJs = js;
        if (js instanceof Uint8Array) {
            // 将 Uint8Array 转换为字符串
            const jsString = new TextDecoder().decode(js);
            // 替换 var EJS_Runtime 为 window.EJS_Runtime (考虑可能有多个空格)
            const modifiedJsString = jsString.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
            // 将修改后的字符串转换回 Uint8Array
            modifiedJs = new TextEncoder().encode(modifiedJsString);
        } else if (typeof js === 'string') {
            // 如果是字符串，则直接替换
            modifiedJs = js.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
        }

        let script = this.emulator.createElement("script");
        script.src = URL.createObjectURL(new Blob([modifiedJs], { type: "application/javascript" }));
        script.id = "game-core-script"
        script.addEventListener("load", () => {
            // 在微前端环境下尝试从不同位置获取 EJS_Runtime
            if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_WINDOW__) {
                // 尝试从微前端的 window 代理对象获取
                window.EJS_Runtime = window.__MICRO_APP_WINDOW__.EJS_Runtime;
            }

            // 如果还是获取不到，尝试从 proxyWindow 获取
            if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_PROXY_WINDOW__) {
                const proxyWindow = window.__MICRO_APP_PROXY_WINDOW__;
                if (proxyWindow.__MICRO_APP_WINDOW__ && proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime) {
                    window.EJS_Runtime = proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime;
                }
            }

            this.emulator.initModule(wasm, thread);
        });
        document.body.appendChild(script);
    }
}
