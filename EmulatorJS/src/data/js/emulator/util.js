// Utility functions for EmulatorJS

export function versionAsInt(emulator, ver) {
    if (ver.endsWith("-beta")) {
        return 99999999;
    }
    let rv = ver.split(".");
    if (rv[rv.length - 1].length === 1) {
        rv[rv.length - 1] = "0" + rv[rv.length - 1];
    }
    return parseInt(rv.join(""));
}

export function checkForUpdates(emulator) {
    if (emulator.ejs_version.endsWith("-beta")) {
        console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended unless you build and ship your own cores.");
        return;
    }
    fetch("https://cdn.emulatorjs.org/stable/data/version.json").then(response => {
        if (response.ok) {
            response.text().then(body => {
                let version = JSON.parse(body);
                if (versionAsInt(emulator, emulator.ejs_version) < versionAsInt(emulator, version.version)) {
                    console.log(`Using EmulatorJS version ${emulator.ejs_version} but the newest version is ${version.version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                }
            })
        }
    })
}