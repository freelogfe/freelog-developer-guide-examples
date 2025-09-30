/**
 * Core System Module
 * Handles system compatibility, browser detection, and core support checks
 */
export default class CoreSystem {
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

    checkForUpdates() {
        if (this.emulator.ejs_version.endsWith("-beta")) {
            console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended unless you build and ship your own cores.");
            return;
        }
        fetch("https://cdn.emulatorjs.org/stable/data/version.json").then(response => {
            if (response.ok) {
                response.text().then(body => {
                    let version = JSON.parse(body);
                    if (this.emulator.versionAsInt(this.emulator.ejs_version) < this.emulator.versionAsInt(version.version)) {
                        console.log(`Using EmulatorJS version ${this.emulator.ejs_version} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                    }
                })
            }
        })
    }

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

    checkCoreCompatibility(version) {
        if (this.emulator.versionAsInt(version.minimumEJSVersion) > this.emulator.versionAsInt(this.emulator.ejs_version)) {
            this.emulator.startGameError(this.emulator.localization("Outdated EmulatorJS version"));
            throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
        }
    }
}
