

export class CoreManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    getCores() {
        return {
            "3do": {threads: false, webGL2: false, name: "Panasonic 3DO"},
            "atari800": {threads: false, webGL2: false, name: "Atari 800"},
            "atarilynx": {threads: false, webGL2: false, name: "Atari Lynx"},
            "auto": {threads: false, webGL2: false, name: "Auto"},
            "c64": {threads: false, webGL2: false, name: "Commodore 64"},
            "crocods": {threads: false, webGL2: false, name: "ColecoVision"},
            "desmume": {threads: true, webGL2: true, name: "Nintendo DS"},
            "dosbox": {threads: true, webGL2: false, name: "DOS"},
            "fceumm": {threads: false, webGL2: false, name: "Nintendo Entertainment System"},
            "freechaf": {threads: false, webGL2: false, name: "Channel F"},
            "gameandwatch": {threads: false, webGL2: false, name: "Game & Watch"},
            "gb": {threads: false, webGL2: false, name: "Game Boy"},
            "gba": {threads: false, webGL2: false, name: "Game Boy Advance"},
            "gbc": {threads: false, webGL2: false, name: "Game Boy Color"},
            "gw": {threads: false, webGL2: false, name: "Game & Watch"},
            "handy": {threads: false, webGL2: false, name: "Atari Lynx"},
            "mame": {threads: true, webGL2: true, name: "Arcade"},
            "mgba": {threads: false, webGL2: false, name: "Game Boy Advance"},
            "msx": {threads: false, webGL2: false, name: "MSX"},
            "neogeo": {threads: false, webGL2: false, name: "Neo Geo"},
            "nes": {threads: false, webGL2: false, name: "Nintendo Entertainment System"},
            "ngp": {threads: false, webGL2: false, name: "Neo Geo Pocket"},
            "ngpc": {threads: false, webGL2: false, name: "Neo Geo Pocket Color"},
            "n64": {threads: true, webGL2: true, name: "Nintendo 64"},
            "odyssey2": {threads: false, webGL2: false, name: "Odyssey 2"},
            "pce": {threads: false, webGL2: false, name: "TurboGrafx-16"},
            "pcecd": {threads: false, webGL2: false, name: "TurboGrafx-CD"},
            "pcfx": {threads: false, webGL2: false, name: "PC-FX"},
            "pico": {threads: false, webGL2: false, name: "Sega Pico"},
            "pokemini": {threads: false, webGL2: false, name: "Pokémon Mini"},
            "psx": {threads: true, webGL2: true, name: "PlayStation"},
            "psp": {threads: true, webGL2: true, name: "PlayStation Portable"},
            "saturn": {threads: true, webGL2: true, name: "Sega Saturn"},
            "scummvm": {threads: false, webGL2: false, name: "ScummVM"},
            "sms": {threads: false, webGL2: false, name: "Sega Master System"},
            "snes": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes2005": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes2010": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes9x": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes9x2002": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes9x2005": {threads: false, webGL2: false, name: "Super Nintendo"},
            "snes9x2010": {threads: false, webGL2: false, name: "Super Nintendo"},
            "stella": {threads: false, webGL2: false, name: "Atari 2600"},
            "sufami": {threads: false, webGL2: false, name: "Sufami Turbo"},
            "tic80": {threads: false, webGL2: false, name: "TIC-80"},
            "tg16": {threads: false, webGL2: false, name: "TurboGrafx-16"},
            "tgcd": {threads: false, webGL2: false, name: "TurboGrafx-CD"},
            "virtualboy": {threads: false, webGL2: false, name: "Virtual Boy"},
            "wonderswan": {threads: false, webGL2: false, name: "WonderSwan"},
            "wonderswancolor": {threads: false, webGL2: false, name: "WonderSwan Color"},
            "x68k": {threads: true, webGL2: true, name: "Sharp X68000"},
            "zxspectrum": {threads: false, webGL2: false, name: "ZX Spectrum"}
        };
    }

    requiresThreads(core) {
        const cores = this.getCores();
        if (!cores[core]) return false;
        return cores[core].threads;
    }

    requiresWebGL2(core) {
        const cores = this.getCores();
        if (!cores[core]) return false;
        return cores[core].webGL2;
    }

    getCore(ignoreAuto) {
        if (!this.emulator.config.core) return "auto";
        if (this.emulator.config.core.toLowerCase() === "auto" && !ignoreAuto) {
            const extension = this.emulator.getExtension();
            const map = {
                "sfc": "snes",
                "smc": "snes",
                "fig": "snes",
                "swc": "snes",
                "gd3": "snes",
                "gd7": "snes",
                "dx2": "snes",
                "bsx": "snes",
                "st": "snes",
                "rom": "snes",
                "gba": "gba",
                "gb": "gb",
                "gbc": "gbc",
                "nes": "nes",
                "fds": "nes",
                "unf": "nes",
                "gen": "genesis",
                "md": "genesis",
                "bin": "genesis",
                "cue": "genesis",
                "iso": "psx",
                "pbp": "psp",
                "z64": "n64",
                "v64": "n64",
                "n64": "n64",
                "nds": "desmume",
                "chd": "mame",
                "zip": "mame",
                "7z": "mame",
                "cso": "psp",
                "elf": "psx",
                "ccd": "psx",
                "m3u": "psx",
                "toc": "psx"
            };
            return map[extension] || "snes";
        }
        return this.emulator.config.core.toLowerCase();
    }
}
