/**
 * 游戏管理模块
 * 负责游戏的启动、运行和状态管理
 */
export class GameManager {
    constructor(emulator) {
        this.emulator = emulator;
    }



    initModule(wasmData, threadData) {
        if (typeof window.EJS_Runtime !== "function") {
            console.warn("EJS_Runtime is not defined!");
            this.emulator.startGameError(this.emulator.localization("Error loading EmulatorJS runtime"));
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
            this.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.emulator.startGameError(this.emulator.localization("Failed to start game"));
        });
    }

    startGame() {
        try {
            const args = [];
            if (this.emulator.debug) args.push("-v");
            args.push("/" + this.emulator.fileName);
            if (this.emulator.debug) console.log(args);
            this.emulator.Module.callMain(args);
            if (typeof this.emulator.config.softLoad === "number" && this.emulator.config.softLoad > 0) {
                this.resetTimeout = setTimeout(() => {
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
            this.emulator.uiManager.open();
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

    bindListeners() {
        this.emulator.createContextMenu();
        this.emulator.createBottomMenuBar();
        this.emulator.uiManager.createControlSettingMenu();
        this.emulator.uiManager.createCheatsMenu();
        this.emulator.uiManager.createNetplayMenu();
        this.emulator.virtualGamepad.setVirtualGamepad();
        this.emulator.addEventListener(this.emulator.elements.parent, "keydown keyup", this.emulator.keyChange.bind(this.emulator));
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (document.activeElement !== this.emulator.elements.parent && this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
        })
        this.emulator.addEventListener(window, "resize", this.emulator.handleResize.bind(this.emulator));
        //this.emulator.addEventListener(window, "blur", e => console.log(e), true); //TODO - add "click to make keyboard keys work" message?

        let counter = 0;
        this.emulator.elements.statePopupPanel = this.emulator.createPopup("", {}, true);
        this.emulator.elements.statePopupPanel.innerText = this.emulator.localization("Drop save state here to load");
        this.emulator.elements.statePopupPanel.style["text-align"] = "center";
        this.emulator.elements.statePopupPanel.style["font-size"] = "28px";

        //to fix a funny apple bug
        this.emulator.addEventListener(window, "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", () => {
            setTimeout(() => {
                this.emulator.handleResize.bind(this.emulator);
                if (this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
            }, 0);
        });
        this.emulator.addEventListener(window, "beforeunload", (e) => {
            if (!this.emulator.started) return;
            this.emulator.callEvent("exit");
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
    }

    supportsStates() {
        return true; // 默认支持状态保存
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
}
