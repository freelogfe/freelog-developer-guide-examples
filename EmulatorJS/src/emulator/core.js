/**
 * Core emulator initialization functions
 */

export function initializeEmulator(emulator) {
    // Set up core emulator properties
    emulator.version = "4.2.3";
    emulator.debug = (window.EJS_DEBUG_XX === true);
    emulator.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
    
    // Initialize elements
    setupElements(emulator);
    
    // Set up event listeners
    bindListeners(emulator);
    
    // Check for updates if not in debug mode
    if (emulator.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) {
        checkForUpdates(emulator);
    }
    
    // Create storage objects
    setupStorage(emulator);
    
    console.log("Emulator core initialized");
}

function setupElements(emulator) {
    const game = document.createElement("div");
    const elem = emulator.element;
    elem.innerHTML = "";
    elem.appendChild(game);
    emulator.game = game;

    emulator.elements = {
        main: emulator.game,
        parent: elem
    };
    emulator.elements.parent.classList.add("ejs_parent");
    emulator.elements.parent.setAttribute("tabindex", -1);
}

function bindListeners(emulator) {
    // Add resize listener
    window.addEventListener("resize", () => handleResize(emulator));
    
    // Add other core event listeners here
    console.log("Core event listeners bound");
}

function handleResize(emulator) {
    if (!emulator.game.parentElement) {
        return false;
    }
    
    const positionInfo = emulator.elements.parent.getBoundingClientRect();
    emulator.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
    emulator.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);
}

function checkForUpdates(emulator) {
    if (emulator.version.endsWith("-beta")) {
        console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended.");
        return;
    }
    
    fetch("https://cdn.emulatorjs.org/stable/data/version.json")
        .then(response => {
            if (response.ok) {
                response.text().then(body => {
                    let version = JSON.parse(body);
                    if (versionAsInt(emulator.version) < versionAsInt(version.version)) {
                        console.log(`Using EmulatorJS version ${emulator.version} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                    }
                });
            }
        });
}

function versionAsInt(ver) {
    if (ver.endsWith("-beta")) {
        return 99999999;
    }
    let rv = ver.split(".");
    if (rv[rv.length - 1].length === 1) {
        rv[rv.length - 1] = "0" + rv[rv.length - 1];
    }
    return parseInt(rv.join(""));
}

function setupStorage(emulator) {
    if (emulator.config.disableDatabases) {
        emulator.storage = {
            rom: new window.EJS_DUMMYSTORAGE(),
            bios: new window.EJS_DUMMYSTORAGE(),
            core: new window.EJS_DUMMYSTORAGE()
        };
    } else {
        emulator.storage = {
            rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
            bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
            core: new window.EJS_STORAGE("EmulatorJS-core", "core")
        };
    }
    // This is not cache. This is save data
    emulator.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");
}