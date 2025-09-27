export class Utils {
    constructor(emulator) {
        this.emulator = emulator;
    }

    createElement(element) {
        return document.createElement(element);
    }

    addEventListener(element, event, func) {
        element.addEventListener(event, func);
    }

    versionAsInt(version) {
        const parts = version.split(".");
        let num = 0;
        num += parseInt(parts[0], 10) * 10000;
        if (parts.length > 1) num += parseInt(parts[1], 10) * 100;
        if (parts.length > 2) num += parseInt(parts[2], 10);
        return num;
    }

    checkForUpdates() {
        this.downloadFile("https://api.emulatorjs.org/update", null, true).then((result) => {
            if (result === -1) return;
            try {
                const data = JSON.parse(result.data);
                if (this.versionAsInt(data.version) > this.versionAsInt(this.emulator.ejs_version)) {
                    console.log(`EmulatorJS update available! You are on ${this.emulator.ejs_version}, latest is ${data.version}`);
                }
            } catch (e) {
                console.warn("Failed to parse update data");
            }
        });
    }

    // This method is actually in fileDownloader but needed here for checkForUpdates
    downloadFile(path, progressCB, notWithPath) {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            request.open("GET", path, true);
            request.responseType = "text";
            
            request.onload = () => {
                if (request.status === 200) {
                    resolve({ data: request.response });
                } else {
                    resolve(-1);
                }
            };
            
            request.onerror = () => {
                resolve(-1);
            };
            
            request.send();
        });
    }

    toData(str, check) {
        if (typeof str !== 'string') return false;
        if (check && !str.includes("data:")) return false;
        try {
            return str.startsWith("data:");
        } catch (e) {
            return false;
        }
    }
}