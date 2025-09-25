/**
 * Settings functionality for EmulatorJS
 */

export function setupSettings(EJS) {
    // Initialize settings objects
    EJS.settings = {};
    EJS.allSettings = {};
    
    console.log("Settings management initialized");
}

export function loadSettings(EJS) {
    if (!window.localStorage || EJS.config.disableLocalStorage) return;
    
    try {
        let ejs_settings = localStorage.getItem("ejs-settings");
        let coreSpecific = localStorage.getItem(getLocalStorageKey(EJS));
        
        if (coreSpecific) {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific.controlSettings instanceof Object && 
                coreSpecific.settings instanceof Object && 
                Array.isArray(coreSpecific.cheats)) {
                
                EJS.controls = coreSpecific.controlSettings;
                // Would need to call checkGamepadInputs() here
                
                for (const k in coreSpecific.settings) {
                    changeSettingOption(EJS, k, coreSpecific.settings[k]);
                }
                
                // Handle cheats
                if (!EJS.cheats) EJS.cheats = [];
                for (let i = 0; i < coreSpecific.cheats.length; i++) {
                    const cheat = coreSpecific.cheats[i];
                    let includes = false;
                    for (let j = 0; j < EJS.cheats.length; j++) {
                        if (EJS.cheats[j].desc === cheat.desc && EJS.cheats[j].code === cheat.code) {
                            EJS.cheats[j].checked = cheat.checked;
                            includes = true;
                            break;
                        }
                    }
                    if (includes) continue;
                    EJS.cheats.push(cheat);
                }
            }
        }
        
        if (ejs_settings) {
            ejs_settings = JSON.parse(ejs_settings);
            if (typeof ejs_settings.volume === "number" && typeof ejs_settings.muted === "boolean") {
                EJS.state = EJS.state || {};
                EJS.state.volume = ejs_settings.volume;
                EJS.state.muted = ejs_settings.muted;
                // Would need to call setVolume() here
            }
        }
    } catch (e) {
        console.warn("Could not load previous settings", e);
    }
}

export function saveSettings(EJS) {
    if (!window.localStorage || EJS.config.disableLocalStorage || !EJS.settingsLoaded) return;
    if (!EJS.state.started && !EJS.failedToStart) return;
    
    const coreSpecific = {
        controlSettings: EJS.controls,
        settings: EJS.settings,
        cheats: EJS.cheats
    };
    
    const ejs_settings = {
        volume: EJS.state.volume,
        muted: EJS.state.muted
    };
    
    localStorage.setItem("ejs-settings", JSON.stringify(ejs_settings));
    localStorage.setItem(getLocalStorageKey(EJS), JSON.stringify(coreSpecific));
}

function getLocalStorageKey(EJS) {
    let identifier = (EJS.config.gameId || 1) + "-" + getCore(EJS, true);
    if (typeof EJS.config.gameName === "string") {
        identifier += "-" + EJS.config.gameName;
    } else if (typeof EJS.config.gameUrl === "string" && !EJS.config.gameUrl.toLowerCase().startsWith("blob:")) {
        identifier += "-" + EJS.config.gameUrl;
    } else if (EJS.config.gameUrl instanceof File) {
        identifier += "-" + EJS.config.gameUrl.name;
    } else if (typeof EJS.config.gameId !== "number") {
        console.warn("gameId (EJS_gameID) is not set. This may result in settings persisting across games.");
    }
    return "ejs-" + identifier + "-settings";
}

function changeSettingOption(EJS, title, newValue, startup) {
    EJS.allSettings[title] = newValue;
    if (startup !== true) {
        EJS.settings[title] = newValue;
    }
    // Would call functions to update the setting
}

function getCore(EJS, generic) {
    const cores = getCores(EJS);
    const core = EJS.config.system;
    if (generic) {
        for (const k in cores) {
            if (cores[k].includes(core)) {
                return k;
            }
        }
        return core;
    }
    const gen = getCore(EJS, true);
    if (cores[gen] && cores[gen].includes(preGetSetting(EJS, "retroarch_core"))) {
        return preGetSetting(EJS, "retroarch_core");
    }
    if (cores[core]) {
        return cores[core][0];
    }
    return core;
}

function getCores(EJS) {
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
    
    if (EJS.isSafari && EJS.isMobile) {
        rv.n64 = rv.n64.reverse();
    }
    return rv;
}

function preGetSetting(EJS, setting) {
    if (window.localStorage && !EJS.config.disableLocalStorage) {
        let coreSpecific = localStorage.getItem(getLocalStorageKey(EJS));
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific && coreSpecific.settings) {
                return coreSpecific.settings[setting];
            }
        } catch (e) {
            console.warn("Could not load previous settings", e);
        }
    }
    if (EJS.config.defaultOptions && EJS.config.defaultOptions[setting]) {
        return EJS.config.defaultOptions[setting];
    }
    return null;
}