/**
 * EmulatorJS - UI Manager Module
 * 用户界面管理
 */

export class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.localization = {};
        this.missingLang = [];
    }

    init() {
        this.localization = this.getLocalization(this.emulator.config.settingsLanguage);
        this.missingLang = [];
        this.createStartScreen();
        this.setupEventListeners();
    }

    getLocalization(lang) {
        if (typeof lang !== "string") lang = "en";
        const rv = {
            "en": {
                "Loading": "Loading",
                "Load State": "Load State",
                "Save State": "Save State",
                "Clear": "Clear",
                "Close": "Close",
                "Reset Game": "Reset Game",
                "Pause": "Pause",
                "Play": "Play",
                "Restart": "Restart",
                "Mute": "Mute",
                "Unmute": "Unmute",
                "Settings": "Settings",
                "Enter Fullscreen": "Enter Fullscreen",
                "Exit Fullscreen": "Exit Fullscreen",
                "Control Settings": "Control Settings",
                "Cheats": "Cheats",
                "Cache Manager": "Cache Manager",
                "Export Save File": "Export Save File",
                "Import Save File": "Import Save File",
                "Netplay": "Netplay",
                "Disks": "Disks",
                "Context Menu": "Context Menu",
                "Exit Emulation": "Exit Emulation",
                "Quick Save": "Quick Save",
                "Quick Load": "Quick Load",
                "Fast Forward": "Fast Forward",
                "Slow Motion": "Slow Motion",
                "Rewind": "Rewind",
                "Screenshot": "Screenshot",
                "Screen Record": "Screen Record",
                "Menu Bar Button": "Menu Bar Button",
                "Virtual Gamepad": "Virtual Gamepad",
                "Left Handed Mode": "Left Handed Mode",
                "Menu Bar Mouse Trigger": "Menu Bar Mouse Trigger",
                "Direct Keyboard Input": "Direct Keyboard Input",
                "Forward Alt key": "Forward Alt key",
                "Lock Mouse": "Lock Mouse",
                "Player": "Player",
                "Connected Gamepad": "Connected Gamepad",
                "Keyboard": "Keyboard",
                "Gamepad": "Gamepad",
                "Save State Location": "Save State Location",
                "Save State Slot": "Save State Slot",
                "System Save interval": "System Save interval",
                "Shaders": "Shaders",
                "Disabled": "Disabled",
                "Enabled": "Enabled",
                "Download Game Data": "Download Game Data",
                "Download Game BIOS": "Download Game BIOS",
                "Download Game Patch": "Download Game Patch",
                "Download Game Parent": "Download Game Parent",
                "Download Start State": "Download Start State",
                "Decompress Game Data": "Decompress Game Data",
                "Decompress Game BIOS": "Decompress Game BIOS",
                "Decompress Game Patch": "Decompress Game Patch",
                "Decompress Game Parent": "Decompress Game Parent",
                "Decompress Start State": "Decompress Start State",
                "Network Error": "Network Error",
                "Load Game": "Load Game",
                "Ready": "Ready",
                "Start Game": "Start Game",
                "Game Loaded": "Game Loaded",
                "Waiting": "Waiting",
                "Error": "Error",
                "OK": "OK",
                "Cancel": "Cancel",
                "Yes": "Yes",
                "No": "No",
                "Default": "Default",
                "Custom": "Custom",
                "Auto": "Auto",
                "On": "On",
                "Off": "Off",
                "Low": "Low",
                "Medium": "Medium",
                "High": "High",
                "Very Low": "Very Low",
                "Very High": "Very High",
                "None": "None",
                "All": "All"
            }
        }
        return rv[lang] || rv["en"];
    }

    createStartScreen() {
        const startScreen = this.createElement("div");
        startScreen.id = "ejs_start_screen";
        startScreen.classList.add("ejs_start_screen");
        startScreen.style.padding = "20px";
        startScreen.style.textAlign = "center";
        startScreen.style.color = "white";
        startScreen.style.fontSize = "18px";
        startScreen.style.fontFamily = "Arial, sans-serif";
        startScreen.style.display = "flex";
        startScreen.style.flexDirection = "column";
        startScreen.style.justifyContent = "center";
        startScreen.style.alignItems = "center";

        // Logo
        const logo = this.createElement("img");
        logo.src = this.emulator.config.dataPath + "docs/Logo-light.png";
        logo.style.width = "100px";
        logo.style.height = "100px";
        logo.style.filter = "drop-shadow(0 0 10px white)";
        logo.style.marginBottom = "20px";
        startScreen.appendChild(logo);

        // Message
        const message = this.createElement("p");
        message.innerText = "Click to start";
        startScreen.appendChild(message);

        // Start button
        const startButton = this.createElement("button");
        startButton.classList.add("ejs_start_button");
        startButton.innerText = this.localization("Start Game");
        startButton.style.padding = "10px 20px";
        startButton.style.fontSize = "16px";
        startButton.style.fontFamily = "Arial, sans-serif";
        startButton.style.backgroundColor = "rgba(var(--ejs-primary-color),1)";
        startButton.style.color = "white";
        startButton.style.border = "none";
        startButton.borderRadius = "4px";
        startButton.cursor = "pointer";
        this.addEventListener(startButton, "click", () => {
            this.emulator.startButtonClicked();
        });
        startScreen.appendChild(startButton);

        this.emulator.game.appendChild(startScreen);
    }

    setupEventListeners() {
        // Handle window resize
        this.addEventListener(window, "resize", () => {
            this.emulator.handleResize();
        });

        // Handle visibility change
        this.addEventListener(document, "visibilitychange", () => {
            if (document.hidden) {
                this.emulator.pause(true);
            } else {
                this.emulator.play();
            }
        });

        // Handle page unload
        this.addEventListener(window, "beforeunload", () => {
            this.emulator.saveSettings();
        });
    }

    startGameError(message) {
        this.emulator.textElem.innerText = this.localization("Error");
        const error = this.createElement("div");
        error.style.color = "red";
        error.innerText = message;
        this.emulator.game.appendChild(error);
    }

    showLoadingMessage(message) {
        if (this.emulator.textElem) {
            this.emulator.textElem.innerText = message;
        }
    }

    hideLoadingMessage() {
        if (this.emulator.textElem) {
            this.emulator.textElem.innerText = "";
        }
    }

    createPopup(title, buttons, isSubPopup = false) {
        const popupContainer = this.createElement("div");
        const popup = this.createElement("div");
        popup.setAttribute("role", "dialog");
        popup.setAttribute("aria-modal", "true");
        popup.classList.add("ejs_popup_container");
        popup.classList.add("ejs_popup_container_box");
        
        const popupHeader = this.createElement("div");
        popupHeader.classList.add("ejs_popup_header");
        const popupTitle = this.createElement("h2");
        popupTitle.innerText = title;
        popupHeader.appendChild(popupTitle);
        popup.appendChild(popupHeader);
        popup.appendChild(this.createElement("br"));

        const footer = this.createElement("footer");
        for (const title in buttons) {
            const button = this.createElement("button");
            button.classList.add("ejs_button_button");
            button.classList.add("ejs_popup_submit");
            button.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            button.innerText = title;
            this.addEventListener(button, "click", () => {
                buttons[title]();
            })
            footer.appendChild(button);
            const span = this.createElement("span");
            span.innerText = " ";
            footer.appendChild(span);
        }
        popup.appendChild(footer);

        popupContainer.appendChild(popup);
        return [popupContainer, popup];
    }

    createSubPopup() {
        const popup = this.createPopup("", {
            "OK": () => {
                this.emulator.closePopup();
            }
        }, true);
        this.emulator.game.insertBefore(popup[0], this.emulator.bottomBar.playPause[0]);
        this.emulator.game.appendChild(popup[1]);
        return popup[1];
    }

    closePopup() {
        const popup = this.emulator.currentPopup;
        if (popup) {
            popup[0].remove();
            popup[1].remove();
            this.emulator.currentPopup = null;
        }
    }

    showPopup(title, buttons) {
        return new Promise((resolve) => {
            const popup = this.createPopup(title, {
                "OK": () => {
                    this.emulator.closePopup();
                    resolve();
                }
            }, true);
            this.emulator.game.appendChild(popup[0]);
            this.emulator.game.appendChild(popup[1]);
            this.emulator.currentPopup = popup[1];
        });
    }

    createElement(type) {
        return document.createElement(type);
    }

    addEventListener(element, listener, callback) {
        const listeners = listener.split(" ");
        let rv = [];
        for (let i = 0; i < listeners.length; i++) {
            element.addEventListener(listeners[i], callback);
            const data = { cb: callback, elem: element, listener: listeners[i] };
            rv.push(data);
        }
        return rv;
    }

    removeEventListener(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].elem.removeEventListener(data[i].listener, data[i].cb);
        }
    }
}
