/**
 * Settings management functions
 */

export function manageSettings(emulator) {
    // Initialize settings objects
    emulator.settings = {};
    emulator.allSettings = {};
    
    console.log("Settings management initialized");
}

export function loadSettings(emulator) {
    if (!window.localStorage || emulator.config.disableLocalStorage) return;
    
    try {
        let ejs_settings = localStorage.getItem("ejs-settings");
        let coreSpecific = localStorage.getItem(emulator.getLocalStorageKey());
        
        if (coreSpecific) {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific.controlSettings instanceof Object && 
                coreSpecific.settings instanceof Object && 
                Array.isArray(coreSpecific.cheats)) {
                
                emulator.controls = coreSpecific.controlSettings;
                // Would need to call checkGamepadInputs() here
                
                for (const k in coreSpecific.settings) {
                    changeSettingOption(emulator, k, coreSpecific.settings[k]);
                }
                
                // Handle cheats
                if (!emulator.cheats) emulator.cheats = [];
                for (let i = 0; i < coreSpecific.cheats.length; i++) {
                    const cheat = coreSpecific.cheats[i];
                    let includes = false;
                    for (let j = 0; j < emulator.cheats.length; j++) {
                        if (emulator.cheats[j].desc === cheat.desc && emulator.cheats[j].code === cheat.code) {
                            emulator.cheats[j].checked = cheat.checked;
                            includes = true;
                            break;
                        }
                    }
                    if (includes) continue;
                    emulator.cheats.push(cheat);
                }
            }
        }
        
        if (ejs_settings) {
            ejs_settings = JSON.parse(ejs_settings);
            if (typeof ejs_settings.volume === "number" && typeof ejs_settings.muted === "boolean") {
                emulator.state.volume = ejs_settings.volume;
                emulator.state.muted = ejs_settings.muted;
                // Would need to call setVolume() here
            }
        }
    } catch (e) {
        console.warn("Could not load previous settings", e);
    }
}

export function saveSettings(emulator) {
    if (!window.localStorage || emulator.config.disableLocalStorage || !emulator.settingsLoaded) return;
    if (!emulator.state.started && !emulator.failedToStart) return;
    
    const coreSpecific = {
        controlSettings: emulator.controls,
        settings: emulator.settings,
        cheats: emulator.cheats
    };
    
    const ejs_settings = {
        volume: emulator.state.volume,
        muted: emulator.state.muted
    };
    
    localStorage.setItem("ejs-settings", JSON.stringify(ejs_settings));
    localStorage.setItem(getLocalStorageKey(emulator), JSON.stringify(coreSpecific));
}

export function getLocalStorageKey(emulator) {
    let identifier = (emulator.config.gameId || 1) + "-" + getCore(emulator, true);
    if (typeof emulator.config.gameName === "string") {
        identifier += "-" + emulator.config.gameName;
    } else if (typeof emulator.config.gameUrl === "string" && !emulator.config.gameUrl.toLowerCase().startsWith("blob:")) {
        identifier += "-" + emulator.config.gameUrl;
    } else if (emulator.config.gameUrl instanceof File) {
        identifier += "-" + emulator.config.gameUrl.name;
    } else if (typeof emulator.config.gameId !== "number") {
        console.warn("gameId (EJS_gameID) is not set. This may result in settings persisting across games.");
    }
    return "ejs-" + identifier + "-settings";
}

export function changeSettingOption(emulator, title, newValue, startup) {
    emulator.allSettings[title] = newValue;
    if (startup !== true) {
        emulator.settings[title] = newValue;
    }
    // Would call functions to update the setting
}

function getCore(emulator, generic) {
    const cores = getCores(emulator);
    const core = emulator.config.system;
    if (generic) {
        for (const k in cores) {
            if (cores[k].includes(core)) {
                return k;
            }
        }
        return core;
    }
    const gen = getCore(emulator, true);
    if (cores[gen] && cores[gen].includes(preGetSetting(emulator, "retroarch_core"))) {
        return preGetSetting(emulator, "retroarch_core");
    }
    if (cores[core]) {
        return cores[core][0];
    }
    return core;
}

function getCores(emulator) {
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
    
    if (emulator.isSafari && emulator.isMobile) {
        rv.n64 = rv.n64.reverse();
    }
    return rv;
}

function preGetSetting(emulator, setting) {
    if (window.localStorage && !emulator.config.disableLocalStorage) {
        let coreSpecific = localStorage.getItem(getLocalStorageKey(emulator));
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific && coreSpecific.settings) {
                return coreSpecific.settings[setting];
            }
        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
    if (emulator.config.defaultOptions && emulator.config.defaultOptions[setting]) {
        return emulator.config.defaultOptions[setting];
    }
    return null;
}