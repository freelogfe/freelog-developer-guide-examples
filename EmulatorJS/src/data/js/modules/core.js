// Core management functions
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
        if (cores[gen] && cores[gen].includes(this.emulator.preGetSetting("retroarch_core"))) {
            return this.emulator.preGetSetting("retroarch_core");
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
