/**
 * System-related functionality for EmulatorJS
 */

export function getCores(EJS) {
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

export function requiresThreads(core) {
    const requiresThreads = ["ppsspp", "dosbox_pure"];
    return requiresThreads.includes(core);
}

export function requiresWebGL2(core) {
    const requiresWebGL2 = ["ppsspp"];
    return requiresWebGL2.includes(core);
}

export function getCore(EJS, generic) {
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
    if (cores[gen] && cores[gen].includes(EJS.preGetSetting("retroarch_core"))) {
        return EJS.preGetSetting("retroarch_core");
    }
    if (cores[core]) {
        return cores[core][0];
    }
    return core;
}