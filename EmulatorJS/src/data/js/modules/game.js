// Game management functions
export class GameManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    startGame() {
        try {
            const args = [];
            if (this.emulator.debug) args.push("-v");
            args.push("/" + this.emulator.fileName);
            if (this.emulator.debug) console.log(args);
            this.emulator.Module.callMain(args);
            if (typeof this.emulator.config.softLoad === "number" && this.emulator.config.softLoad > 0) {
                this.emulator.resetTimeout = setTimeout(() => {
                    this.emulator.gameManager.restart();
                }, this.emulator.config.softLoad * 1000);
            }
            this.emulator.Module.resumeMainLoop();
            this.emulator.checkSupportedOpts();
            this.emulator.setupDisksMenu();
            // hide the disks menu if the disk count is not greater than 1
            if (!(this.emulator.gameManager.getDiskCount() > 1)) {
                this.emulator.diskParent.style.display = "none";
            }
            this.emulator.setupSettingsMenu();
            this.emulator.loadSettings();
            this.emulator.updateCheatUI();
            this.emulator.updateGamepadLabels();
            if (!this.emulator.muted) this.emulator.setVolume(this.emulator.volume);
            if (this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
            this.emulator.textElem.remove();
            this.emulator.textElem = null;
            this.emulator.game.classList.remove("ejs_game");
            this.emulator.game.classList.add("ejs_canvas_parent");
            this.emulator.game.appendChild(this.emulator.canvas);
            this.emulator.handleResize();
            this.emulator.started = true;
            this.emulator.paused = false;
            if (this.emulator.touch) {
                this.emulator.virtualGamepad.style.display = "";
            }
            this.emulator.handleResize();
            if (this.emulator.config.fullscreenOnLoad) {
                try {
                    this.emulator.toggleFullscreen(true);
                } catch (e) {
                    if (this.emulator.debug) console.warn("Could not fullscreen on load");
                }
            }
            this.emulator.menu.open();
            if (this.emulator.isSafari && this.emulator.isMobile) {
                //Safari is --- funny
                this.emulator.checkStarted();
            }
        } catch (e) {
            console.warn("Failed to start game", e);
            this.emulator.startGameError(this.emulator.localization("Failed to start game"));
            this.emulator.callEvent("exit");
            return;
        }
        this.emulator.callEvent("start");
    }

    checkStarted() {
        (async () => {
            let sleep = (ms) => new Promise(r => setTimeout(r, ms));
            let state = "suspended";
            let popup;
            while (state === "suspended") {
                if (!this.emulator.Module.AL) return;
                this.emulator.Module.AL.currentCtx.sources.forEach(ctx => {
                    state = ctx.gain.context.state;
                });
                if (state !== "suspended") break;
                if (!popup) {
                    popup = this.emulator.createPopup("", {});
                    const button = this.emulator.createElement("button");
                    button.innerText = this.emulator.localization("Click to resume Emulator");
                    button.classList.add("ejs_menu_button");
                    button.style.width = "25%";
                    button.style.height = "25%";
                    popup.appendChild(button);
                    popup.style["text-align"] = "center";
                    popup.style["font-size"] = "28px";
                }
                await sleep(10);
            }
            if (popup) this.emulator.closePopup();
        })();
    }

    initModule(wasmData, threadData) {
        if (typeof window.EJS_Runtime !== "function") {
            console.warn("EJS_Runtime is not defined!");
            this.emulator.startGameError(this.emulator.localization("Failed to start game"));
            throw new Error("EJS_Runtime is not defined!");
        }
        window.EJS_Runtime({
            noInitialRun: true,
            onRuntimeInitialized: null,
            arguments: [],
            preRun: [],
            postRun: [],
            canvas: this.emulator.canvas,
            callbacks: {},
            parent: this.emulator.elements.parent,
            print: (msg) => {
                if (this.emulator.debug) {
                    console.log(msg);
                }
            },
            printErr: (msg) => {
                if (this.emulator.debug) {
                    console.log(msg);
                }
            },
            totalDependencies: 0,
            locateFile: function (fileName) {
                if (this.emulator.debug) console.log(fileName);
                if (fileName.endsWith(".wasm")) {
                    return URL.createObjectURL(new Blob([wasmData], { type: "application/wasm" }));
                } else if (fileName.endsWith(".worker.js")) {
                    return URL.createObjectURL(new Blob([threadData], { type: "application/javascript" }));
                }
            },
            getSavExt: () => {
                if (this.emulator.saveFileExt) {
                    return "." + this.emulator.saveFileExt;
                }
                return ".srm";
            }
        }).then(module => {
            this.emulator.Module = module;
            this.emulator.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.emulator.startGameError(this.emulator.localization("Failed to start game"));
        });
    }

    getBaseFileName(force) {
        //Only once game and core is loaded
        if (!this.emulator.started && !force) return null;
        if (force && this.emulator.config.gameUrl !== "game" && !this.emulator.config.gameUrl.startsWith("blob:")) {
            return this.emulator.config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
        }
        if (typeof this.emulator.config.gameName === "string") {
            const invalidCharacters = /[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/ig;
            const name = this.emulator.config.gameName.replace(invalidCharacters, "").trim();
            if (name) return name;
        }
        if (!this.emulator.fileName) return "game";
        let parts = this.emulator.fileName.split(".");
        parts.splice(parts.length - 1, 1);
        return parts.join(".");
    }

    saveInBrowserSupported() {
        return !!window.indexedDB && (typeof this.emulator.config.gameName === "string" || !this.emulator.config.gameUrl.startsWith("blob:"));
    }

    togglePlaying(dontUpdate) {
        this.emulator.paused = !this.emulator.paused;
        if (!dontUpdate) {
            if (this.emulator.paused) {
                this.emulator.elements.bottomBar.playPause[0].style.display = "none";
                this.emulator.elements.bottomBar.playPause[1].style.display = "";
            } else {
                this.emulator.elements.bottomBar.playPause[0].style.display = "";
                this.emulator.elements.bottomBar.playPause[1].style.display = "none";
            }
        }
        this.emulator.gameManager.toggleMainLoop(this.emulator.paused ? 0 : 1);

        //I now realize its not easy to pause it while the cursor is locked, just in case I guess
        if (this.emulator.enableMouseLock) {
            if (this.emulator.canvas.exitPointerLock) {
                this.emulator.canvas.exitPointerLock();
            } else if (this.emulator.canvas.mozExitPointerLock) {
                this.emulator.canvas.mozExitPointerLock();
            }
        }
    }

    play(dontUpdate) {
        if (this.emulator.paused) this.togglePlaying(dontUpdate);
    }

    pause(dontUpdate) {
        if (!this.emulator.paused) this.togglePlaying(dontUpdate);
    }

    startButtonClicked(e) {
        this.emulator.callEvent("start-clicked");
        if (e.pointerType === "touch") {
            this.emulator.touch = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
            e.target.remove();
        } else {
            e.remove();
        }
        this.emulator.createText();
        this.emulator.downloader.downloadGameCore();
    }

    startGameError(message) {
        console.log(message);
        this.emulator.textElem.innerText = message;
        this.emulator.textElem.classList.add("ejs_error_text");

        this.emulator.setupSettingsMenu();
        this.emulator.loadSettings();

        this.emulator.menu.failedToStart();
        this.emulator.handleResize();
        this.emulator.failedToStart = true;
    }

    toggleFullscreen(fullscreen) {
        if (fullscreen) {
            if (this.emulator.elements.parent.requestFullscreen) {
                this.emulator.elements.parent.requestFullscreen();
            } else if (this.emulator.elements.parent.mozRequestFullScreen) {
                this.emulator.elements.parent.mozRequestFullScreen();
            } else if (this.emulator.elements.parent.webkitRequestFullscreen) {
                this.emulator.elements.parent.webkitRequestFullscreen();
            } else if (this.emulator.elements.parent.msRequestFullscreen) {
                this.emulator.elements.parent.msRequestFullscreen();
            }
            this.emulator.elements.bottomBar.fullscreen[1].style.display = "";
            this.emulator.elements.bottomBar.fullscreen[0].style.display = "none";
            if (this.emulator.isMobile) {
                try {
                    screen.orientation.lock(this.emulator.getCore(true) === "nds" ? "portrait" : "landscape").catch(e => { });
                } catch (e) { }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.emulator.elements.bottomBar.fullscreen[0].style.display = "";
            this.emulator.elements.bottomBar.fullscreen[1].style.display = "none";
            if (this.emulator.isMobile) {
                try {
                    screen.orientation.unlock();
                } catch (e) { }
            }
        }
    }

    bindListeners() {
        this.emulator.createContextMenu();
        this.emulator.createBottomMenuBar();
        this.emulator.createControlSettingMenu();
        this.emulator.createCheatsMenu()
        this.emulator.createNetplayMenu();
        this.emulator.setVirtualGamepad();
        this.emulator.addEventListener(this.emulator.elements.parent, "keydown keyup", this.emulator.inputManager.keyChange.bind(this.emulator));
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (document.activeElement !== this.emulator.elements.parent && this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
        })
        this.emulator.addEventListener(window, "resize", this.emulator.uiManager.handleResize.bind(this.emulator));
        //this.emulator.addEventListener(window, "blur", e => console.log(e), true); //TODO - add "click to make keyboard keys work" message?

        let counter = 0;
        this.emulator.elements.statePopupPanel = this.emulator.createPopup("", {}, true);
        this.emulator.elements.statePopupPanel.innerText = this.emulator.localization("Drop save state here to load");
        this.emulator.elements.statePopupPanel.style["text-align"] = "center";
        this.emulator.elements.statePopupPanel.style["font-size"] = "28px";

        //to fix a funny apple bug
        this.emulator.addEventListener(window, "webkitfullscreenchange mozfullscreenchange fullscreenchange", () => {
            setTimeout(() => {
                this.emulator.handleResize.bind(this.emulator);
                if (this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
            }, 0);
        });
        this.emulator.addEventListener(this.emulator.elements.parent, "dragenter", (e) => {
            e.preventDefault();
            if (!this.emulator.started) return;
            counter++;
            this.emulator.elements.statePopupPanel.parentElement.style.display = "block";
        });
        this.emulator.addEventListener(this.emulator.elements.parent, "dragover", (e) => {
            e.preventDefault();
        });
        this.emulator.addEventListener(this.emulator.elements.parent, "dragleave", (e) => {
            e.preventDefault();
            if (!this.emulator.started) return;
            counter--;
            if (counter === 0) {
                this.emulator.elements.statePopupPanel.parentElement.style.display = "none";
            }
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "dragend", (e) => {
            e.preventDefault();
            if (!this.emulator.started) return;
            counter = 0;
            this.emulator.elements.statePopupPanel.parentElement.style.display = "none";
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "drop", (e) => {
            e.preventDefault();
            if (!this.emulator.started) return;
            this.emulator.elements.statePopupPanel.parentElement.style.display = "none";
            counter = 0;
            const items = e.dataTransfer.items;
            let file;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind !== "file") continue;
                file = items[i];
                break;
            }
            if (!file) return;
            const fileHandle = file.getAsFile();
            fileHandle.arrayBuffer().then(data => {
                this.emulator.gameManager.loadState(new Uint8Array(data));
            })
        });

        this.emulator.gamepad = new GamepadHandler(); //https://github.com/ethanaobrien/Gamepad
        this.emulator.gamepad.on("connected", (e) => {
            if (!this.emulator.gamepadLabels) return;
            for (let i = 0; i < this.emulator.gamepadSelection.length; i++) {
                if (this.emulator.gamepadSelection[i] === "") {
                    this.emulator.gamepadSelection[i] = this.emulator.gamepad.gamepads[e.gamepadIndex].id + "_" + this.emulator.gamepad.gamepads[e.gamepadIndex].index;
                    break;
                }
            }
            this.emulator.updateGamepadLabels();
        })
        this.emulator.gamepad.on("disconnected", (e) => {
            const gamepadIndex = this.emulator.gamepad.gamepads.indexOf(this.emulator.gamepad.gamepads.find(f => f.index == e.gamepadIndex));
            const gamepadSelection = this.emulator.gamepad.gamepads[gamepadIndex].id + "_" + this.emulator.gamepad.gamepads[gamepadIndex].index;
            for (let i = 0; i < this.emulator.gamepadSelection.length; i++) {
                if (this.emulator.gamepadSelection[i] === gamepadSelection) {
                    this.emulator.gamepadSelection[i] = "";
                }
            }
            setTimeout(this.emulator.updateGamepadLabels.bind(this.emulator), 10);
        })
        this.emulator.gamepad.on("axischanged", this.emulator.inputManager.gamepadEvent.bind(this.emulator));
        this.emulator.gamepad.on("buttondown", this.emulator.inputManager.gamepadEvent.bind(this.emulator));
        this.emulator.gamepad.on("buttonup", this.emulator.inputManager.gamepadEvent.bind(this.emulator));
    }

    checkSupportedOpts() {
        if (!this.emulator.gameManager.supportsStates()) {
            this.emulator.elements.bottomBar.saveState[0].style.display = "none";
            this.emulator.elements.bottomBar.loadState[0].style.display = "none";
            this.emulator.elements.bottomBar.netplay[0].style.display = "none";
            this.emulator.elements.contextMenu.save.style.display = "none";
            this.emulator.elements.contextMenu.load.style.display = "none";
        }
        if (typeof this.emulator.config.gameId !== "number" || !this.emulator.config.netplayUrl || this.emulator.netplayEnabled === false) {
            this.emulator.elements.bottomBar.netplay[0].style.display = "none";
        }
    }

    updateGamepadLabels() {
        for (let i = 0; i < this.emulator.gamepadLabels.length; i++) {
            this.emulator.gamepadLabels[i].innerHTML = ""
            const def = this.emulator.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.emulator.gamepadLabels[i].appendChild(def);
            for (let j = 0; j < this.emulator.gamepad.gamepads.length; j++) {
                const opt = this.emulator.createElement("option");
                opt.setAttribute("value", this.emulator.gamepad.gamepads[j].id + "_" + this.emulator.gamepad.gamepads[j].index);
                opt.innerText = this.emulator.gamepad.gamepads[j].id + "_" + this.emulator.gamepad.gamepads[j].index;
                this.emulator.gamepadLabels[i].appendChild(opt);
            }
            this.emulator.gamepadLabels[i].value = this.emulator.gamepadSelection[i] || "notconnected";
        }
    }
}
