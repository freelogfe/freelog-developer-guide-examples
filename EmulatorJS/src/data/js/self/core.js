import { isSafari, isMobile } from "./utils.js";
export function getCore(generic) {
    const cores = getCores();
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
export function getCores() {
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
    if (isSafari && isMobile) {
        rv.n64 = rv.n64.reverse();
    }
    return rv;
}
export function downloadGameCore() {
    console.log("=== downloadGameCore started ===");
    console.log("Current config:", this.config);
    console.log("Current core:", this.getCore());
    console.log("Current textElem:", !!this.textElem);
    
    return new Promise((resolve, reject) => {
        console.log("downloadGameCore Promise created");
        
        if (this.textElem) {
            this.textElem.innerText = this.localization("Download Game Core");
            console.log("Text element updated to:", this.textElem.innerText);
        }
        
        if (!this.config.threads && this.requiresThreads(this.getCore())) {
            const error = this.localization("Error for site owner") + "\n" + this.localization("Check console");
            console.error("Thread requirement check failed");
            this.startGameError(error);
            console.warn("This core requires threads, but EJS_threads is not set!");
            reject(new Error(error));
            return;
        }
        if (!this.supportsWebgl2 && this.requiresWebGL2(this.getCore())) {
            const error = this.localization("Outdated graphics driver");
            console.error("WebGL2 requirement check failed");
            this.startGameError(error);
            reject(new Error(error));
            return;
        }
        if (this.config.threads && typeof window.SharedArrayBuffer !== "function") {
            const error = this.localization("Error for site owner") + "\n" + this.localization("Check console");
            console.error("SharedArrayBuffer check failed");
            this.startGameError(error);
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            reject(new Error(error));
            return;
        }
        
        console.log("All requirement checks passed");
        const gotCore = (data) => {
            console.log("=== gotCore called ===");
            console.log("Core data received, size:", data ? data.length : 0);
            console.log("Starting compression check...");
            
            this.defaultCoreOpts = {};
            this.checkCompression(new Uint8Array(data), this.localization("Decompress Game Core")).then((data) => {
                console.log("=== Core decompression completed ===");
                console.log("Decompressed data keys:", Object.keys(data));
                
                let js, thread, wasm;
                for (let k in data) {
                    console.log("Processing file:", k);
                    if (k.endsWith(".wasm")) {
                        wasm = data[k];
                        console.log("✓ WASM file found");
                    } else if (k.endsWith(".worker.js")) {
                        thread = data[k];
                        console.log("✓ Worker file found");
                    } else if (k.endsWith(".js")) {
                        js = data[k];
                        console.log("✓ JS file found");
                    } else if (k === "build.json") {
                        console.log("✓ Build.json file found");
                        this.checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                    } else if (k === "core.json") {
                        console.log("✓ Core.json file found");
                        let core = JSON.parse(new TextDecoder().decode(data[k]));
                        this.extensions = core.extensions;
                        this.coreName = core.name;
                        this.repository = core.repo;
                        this.defaultCoreOpts = core.options;
                        this.enableMouseLock = core.options.supportsMouse;
                        this.retroarchOpts = core.retroarchOpts;
                        this.saveFileExt = core.save;
                        console.log("Core config loaded:", {
                            name: this.coreName,
                            extensions: this.extensions,
                            saveFileExt: this.saveFileExt
                        });
                    } else if (k === "license.txt") {
                        console.log("✓ License.txt file found");
                        this.license = new TextDecoder().decode(data[k]);
                    }
                }

                console.log("JS file exists:", !!js);
                console.log("WASM file exists:", !!wasm);
                console.log("Worker file exists:", !!thread);

                if (this.saveFileExt === false) {
                    this.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
                
                console.log("Calling initGameCore...");
                this.initGameCore(js, wasm, thread);
                console.log("✓ initGameCore called successfully");
                resolve();
            }).catch(error => {
                console.error("✗ Core decompression failed:", error);
                this.startGameError(this.localization("Error decompressing core"));
                reject(error);
            });
        }
        console.log("=== Starting core download process ===");
        let version = this.ejs_version.endsWith("-beta") ? "nightly" : this.ejs_version;
        console.log("EJS version:", version);
        const report = "cores/reports/" + this.getCore() + ".json";
        console.log("Core report URL:", report);
        
        this.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${report}`, null, true, { responseType: "text", method: "GET" }).then(async rep => {
            console.log("=== Core report downloaded ===");
            console.log("Report response:", rep);
            
            if (rep === -1 || typeof rep === "string" || typeof rep.data === "string") {
                rep = {};
                console.log("Report is empty or invalid, using empty object");
            } else {
                rep = rep.data;
                console.log("Report data extracted successfully");
            }
            
            if (!rep.buildStart) {
                console.warn("Could not fetch core report JSON! Core caching will be disabled!");
                rep.buildStart = Math.random() * 100;
            }
            if (this.webgl2Enabled === null) {
                this.webgl2Enabled = rep.options ? rep.options.defaultWebGL2 : false;
            }
            if (this.requiresWebGL2(this.getCore())) {
                this.webgl2Enabled = true;
            }
            let threads = false;
            if (typeof window.SharedArrayBuffer === "function") {
                const opt = this.preGetSetting("ejs_threads");
                if (opt) {
                    threads = (opt === "enabled");
                } else {
                    threads = this.config.threads;
                }
            }
            console.log("WebGL2 enabled:", this.webgl2Enabled);
            console.log("Threads enabled:", threads);

            let legacy = (this.supportsWebgl2 && this.webgl2Enabled ? "" : "-legacy");
            let filename = this.getCore() + (threads ? "-thread" : "") + legacy + "-wasm.data";
            console.log("Core filename:", filename);
            
            if (!this.debug) {
                console.log("Checking local storage for cached core...");
                try {
                    const result = await this.storage.core.get(filename);
                    if (result && result.version === rep.buildStart) {
                        console.log("✓ Found cached core, using local version");
                        gotCore(result.data);
                        return;
                    }
                } catch (e) {
                    console.warn("Error accessing core storage:", e);
                }
            }
            
            const corePath = "cores/" + filename;
            const fullUrl = `https://cdn.emulatorjs.org/${version}/data/${corePath}`;
            console.log("Downloading core from:", fullUrl);
            
            let res = await this.downloadFile(fullUrl, (progress) => {
                if (this.textElem) {
                    this.textElem.innerText = this.localization("Download Game Core") + progress;
                }
            }, true, { responseType: "arraybuffer", method: "GET" });
            
            console.log("Core download response:", res);
            if (res === -1) {
                const error = this.localization("Error downloading core") + " (" + filename + ")";
                console.error("✗ Core download failed:", error);
                if (!this.supportsWebgl2) {
                    this.startGameError(this.localization("Outdated graphics driver"));
                } else {
                    this.startGameError(error);
                }
                reject(new Error(error));
                return;
            }
            console.log("✓ Core downloaded successfully, size:", res.data ? res.data.length : 0);
            console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
            
            console.log("Calling gotCore with downloaded data...");
            gotCore(res.data);
            
            try {
                this.storage.core.put(filename, {
                    version: rep.buildStart,
                    data: res.data
                });
                console.log("✓ Core cached successfully");
            } catch (e) {
                console.warn("Error caching core:", e);
            }
            resolve();
        }).catch(error => {
            console.error("✗ Core report download failed:", error);
            this.startGameError(this.localization("Error downloading core report"));
            reject(error);
        });
    });
}
export function initGameCore(js, wasm, thread) {
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

    let script = this.createElement("script");
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

        this.initModule(wasm, thread);
    });
    document.body.appendChild(script);
}
