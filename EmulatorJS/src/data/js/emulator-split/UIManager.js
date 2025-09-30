/**
 * 用户界面管理模块
 * 负责管理模拟器的各种UI元素和交互
 */
class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.createBottomMenuBar();
        // 这些函数现在在 MenuManager 和 VirtualGamepad 中实现
        // 不再需要在 UIManager 中直接调用
    }

    createBottomMenuBar() {
        let ignoreEvents = false;
        const show = () => {
            if (ignoreEvents) return;
            if (this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                this.emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
                if (this.emulator.isMobile) {
                    this.emulator.menu.close();
                }
            }
        }
        const hide = () => {
            if (ignoreEvents) return;
            if (!this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                this.emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
            }
        }
        const clickListener = (e) => {
            if (ignoreEvents) return;
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.isPopupOpen()) return;
            hide();
        }
        const mouseListener = (e) => {
            if (ignoreEvents) return;
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.isPopupOpen()) return;

            const rect = this.emulator.elements.parent.getBoundingClientRect();
            const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
            if (angle < 0) angle += 360;
            if (angle < 85 || angle > 95) return;
            show();
        }
        if (this.emulator.menu.mousemoveListener) this.emulator.removeEventListener(this.emulator.menu.mousemoveListener);

        if ((this.emulator.preGetSetting("menubarBehavior") || "downward") === "downward") {
            this.emulator.menu.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", mouseListener);
        } else {
            this.emulator.menu.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", clickListener);
        }

        this.emulator.addEventListener(this.emulator.elements.parent, "click", clickListener);
        this.createBottomMenuBarListeners();

        this.emulator.elements.parent.appendChild(this.emulator.elements.menu);

        let tmout;
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden") || this.emulator.isPopupOpen()) return;
            const width = this.emulator.elements.parent.getBoundingClientRect().width;
            if (width > 575) return;
            clearTimeout(tmout);
            tmout = setTimeout(() => {
                ignoreEvents = false;
            }, 2000)
            ignoreEvents = true;
            this.emulator.menu.close();
        })

        let paddingSet = false;
        //Now add buttons
        const addButton = (buttonConfig, callback, element, both) => {
            const button = this.emulator.createElement("button");
            button.type = "button";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("role", "presentation");
            svg.setAttribute("focusable", "false");
            svg.innerHTML = buttonConfig.icon;
            const text = this.emulator.createElement("span");
            text.innerText = this.emulator.localization(buttonConfig.displayName);
            if (paddingSet) text.classList.add("ejs_menu_text_right");
            text.classList.add("ejs_menu_text");

            button.classList.add("ejs_menu_button");
            button.appendChild(svg);
            button.appendChild(text);
            if (element) {
                element.appendChild(button);
            } else {
                this.emulator.elements.menu.appendChild(button);
            }
            if (callback instanceof Function) {
                this.emulator.addEventListener(button, "click", callback);
            }

            if (buttonConfig.callback instanceof Function) {
                this.emulator.addEventListener(button, "click", buttonConfig.callback);
            }
            return both ? [button, svg, text] : button;
        }

        const restartButton = addButton(this.emulator.config.buttonOpts.restart, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.gameManager.restart();
                this.emulator.netplay.reset();
                this.emulator.netplay.sendMessage({ restart: true });
                this.emulator.play();
            } else if (!this.emulator.isNetplay) {
                this.emulator.gameManager.restart();
            }
        });
        const pauseButton = addButton(this.emulator.config.buttonOpts.pause, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.pause();
                this.emulator.gameManager.saveSaveFiles();
                this.emulator.netplay.sendMessage({ pause: true });
            } else if (!this.emulator.isNetplay) {
                this.emulator.pause();
            }
        });
        const playButton = addButton(this.emulator.config.buttonOpts.play, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.play();
                this.emulator.netplay.sendMessage({ play: true });
            } else if (!this.emulator.isNetplay) {
                this.emulator.play();
            }
        });
        playButton.style.display = "none";
        this.emulator.togglePlaying = (dontUpdate) => {
            this.emulator.paused = !this.emulator.paused;
            if (!dontUpdate) {
                if (this.emulator.paused) {
                    pauseButton.style.display = "none";
                    playButton.style.display = "";
                } else {
                    pauseButton.style.display = "";
                    playButton.style.display = "none";
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
        this.emulator.play = (dontUpdate) => {
            if (this.emulator.paused) this.emulator.togglePlaying(dontUpdate);
        }
        this.emulator.pause = (dontUpdate) => {
            if (!this.emulator.paused) this.emulator.togglePlaying(dontUpdate);
        }

        let stateUrl;
        const saveState = addButton(this.emulator.config.buttonOpts.saveState, async () => {
            let state;
            try {
                state = this.emulator.gameManager.getState();
            } catch (e) {
                this.emulator.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
                return;
            }
            const { screenshot, format } = await this.emulator.takeScreenshot(this.emulator.capture.photo.source, this.emulator.capture.photo.format, this.emulator.capture.photo.upscale);
            const called = this.emulator.callEvent("saveState", {
                screenshot: screenshot,
                format: format,
                state: state
            });
            if (called > 0) return;
            if (stateUrl) URL.revokeObjectURL(stateUrl);
            if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
                this.emulator.storage.states.put(this.emulator.getBaseFileName() + ".state", state);
                this.emulator.displayMessage(this.emulator.localization("SAVE SAVED TO BROWSER"));
            } else {
                const blob = new Blob([state]);
                stateUrl = URL.createObjectURL(blob);
                const a = this.emulator.createElement("a");
                a.href = stateUrl;
                a.download = this.emulator.getBaseFileName() + ".state";
                a.click();
            }
        });
        const loadState = addButton(this.emulator.config.buttonOpts.loadState, async () => {
            const called = this.emulator.callEvent("loadState");
            if (called > 0) return;
            if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
                this.emulator.storage.states.get(this.emulator.getBaseFileName() + ".state").then(e => {
                    this.emulator.gameManager.loadState(e);
                    this.emulator.displayMessage(this.emulator.localization("SAVE LOADED FROM BROWSER"));
                })
            } else {
                const file = await this.emulator.selectFile();
                const state = new Uint8Array(await file.arrayBuffer());
                this.emulator.gameManager.loadState(state);
            }
        });
        const controlMenu = addButton(this.emulator.config.buttonOpts.gamepad, () => {
            this.emulator.controlMenu.style.display = "";
        });
        const cheatMenu = addButton(this.emulator.config.buttonOpts.cheat, () => {
            this.emulator.cheatMenu.style.display = "";
        });

        const cache = addButton(this.emulator.config.buttonOpts.cacheManager, () => {
            this.emulator.openCacheMenu();
        });

        if (this.emulator.config.disableDatabases) cache.style.display = "none";

        let savUrl;

        const saveSavFiles = addButton(this.emulator.config.buttonOpts.saveSavFiles, async () => {
            const file = await this.emulator.gameManager.getSaveFile();
            const { screenshot, format } = await this.emulator.takeScreenshot(this.emulator.capture.photo.source, this.emulator.capture.photo.format, this.emulator.capture.photo.upscale);
            const called = this.emulator.callEvent("saveSave", {
                screenshot: screenshot,
                format: format,
                save: file
            });
            if (called > 0) return;
            const blob = new Blob([file]);
            savUrl = URL.createObjectURL(blob);
            const a = this.emulator.createElement("a");
            a.href = savUrl;
            a.download = this.emulator.gameManager.getSaveFilePath().split("/").pop();
            a.click();
        });
        const loadSavFiles = addButton(this.emulator.config.buttonOpts.loadSavFiles, async () => {
            const called = this.emulator.callEvent("loadSave");
            if (called > 0) return;
            const file = await this.emulator.selectFile();
            const sav = new Uint8Array(await file.arrayBuffer());
            const path = this.emulator.gameManager.getSaveFilePath();
            const paths = path.split("/");
            let cp = "";
            for (let i = 0; i < paths.length - 1; i++) {
                if (paths[i] === "") continue;
                cp += "/" + paths[i];
                if (!this.emulator.gameManager.FS.analyzePath(cp).exists) this.emulator.gameManager.FS.mkdir(cp);
            }
            if (this.emulator.gameManager.FS.analyzePath(path).exists) this.emulator.gameManager.FS.unlink(path);
            this.emulator.gameManager.FS.writeFile(path, sav);
            this.emulator.gameManager.loadSaveFiles();
        });
        const netplay = addButton(this.emulator.config.buttonOpts.netplay, async () => {
            this.emulator.openNetplayMenu();
        });

        // add custom buttons
        // get all elements from this.emulator.config.buttonOpts with custom: true
        if (this.emulator.config.buttonOpts) {
            for (const [key, value] of Object.entries(this.emulator.config.buttonOpts)) {
                if (value.custom === true) {
                    const customBtn = addButton(value);
                }
            }
        }

        const spacer = this.emulator.createElement("span");
        spacer.classList.add("ejs_menu_bar_spacer");
        this.emulator.elements.menu.appendChild(spacer);
        paddingSet = true;

        const volumeSettings = this.emulator.createElement("div");
        volumeSettings.classList.add("ejs_volume_parent");
        const muteButton = addButton(this.emulator.config.buttonOpts.mute, () => {
            muteButton.style.display = "none";
            unmuteButton.style.display = "";
            this.emulator.muted = true;
            this.emulator.setVolume(0);
        }, volumeSettings);
        const unmuteButton = addButton(this.emulator.config.buttonOpts.unmute, () => {
            if (this.emulator.volume === 0) this.emulator.volume = 0.5;
            muteButton.style.display = "";
            unmuteButton.style.display = "none";
            this.emulator.muted = false;
            this.emulator.setVolume(this.emulator.volume);
        }, volumeSettings);
        unmuteButton.style.display = "none";

        const volumeSlider = this.emulator.createElement("input");
        volumeSlider.setAttribute("data-range", "volume");
        volumeSlider.setAttribute("type", "range");
        volumeSlider.setAttribute("min", 0);
        volumeSlider.setAttribute("max", 1);
        volumeSlider.setAttribute("step", 0.01);
        volumeSlider.setAttribute("autocomplete", "off");
        volumeSlider.setAttribute("role", "slider");
        volumeSlider.setAttribute("aria-label", "Volume");
        volumeSlider.setAttribute("aria-valuemin", 0);
        volumeSlider.setAttribute("aria-valuemax", 100);

        this.emulator.setVolume = (volume) => {
            this.emulator.saveSettings();
            this.emulator.muted = (volume === 0);
            volumeSlider.value = volume;
            volumeSlider.setAttribute("aria-valuenow", volume * 100);
            volumeSlider.setAttribute("aria-valuetext", (volume * 100).toFixed(1) + "%");
            volumeSlider.setAttribute("style", "--value: " + volume * 100 + "%;margin-left: 5px;position: relative;z-index: 2;");
            if (this.emulator.Module.AL && this.emulator.Module.AL.currentCtx && this.emulator.Module.AL.currentCtx.sources) {
                this.emulator.Module.AL.currentCtx.sources.forEach(e => {
                    e.gain.gain.value = volume;
                })
            }
            if (!this.emulator.config.buttonOpts || this.emulator.config.buttonOpts.mute !== false) {
                unmuteButton.style.display = (volume === 0) ? "" : "none";
                muteButton.style.display = (volume === 0) ? "none" : "";
            }
        }

        this.emulator.addEventListener(volumeSlider, "change mousemove touchmove mousedown touchstart mouseup", (e) => {
            setTimeout(() => {
                const newVal = parseFloat(volumeSlider.value);
                if (newVal === 0 && this.emulator.muted) return;
                this.emulator.volume = newVal;
                this.emulator.setVolume(this.emulator.volume);
            }, 5);
        })

        if (!this.emulator.config.buttonOpts || this.emulator.config.buttonOpts.volume !== false) {
            volumeSettings.appendChild(volumeSlider);
        }

        this.emulator.elements.menu.appendChild(volumeSettings);

        const contextMenuButton = addButton(this.emulator.config.buttonOpts.contextMenu, () => {
            if (this.emulator.elements.contextmenu.style.display === "none") {
                this.emulator.elements.contextmenu.style.display = "block";
                this.emulator.elements.contextmenu.style.left = (getComputedStyle(this.emulator.elements.parent).width.split("px")[0] / 2 - getComputedStyle(this.emulator.elements.contextmenu).width.split("px")[0] / 2) + "px";
                this.emulator.elements.contextmenu.style.top = (getComputedStyle(this.emulator.elements.parent).height.split("px")[0] / 2 - getComputedStyle(this.emulator.elements.contextmenu).height.split("px")[0] / 2) + "px";
                setTimeout(this.emulator.menu.close.bind(this), 20);
            } else {
                this.emulator.elements.contextmenu.style.display = "none";
            }
        });

        this.emulator.diskParent = this.emulator.createElement("div");
        this.emulator.diskParent.id = "ejs_disksMenu";
        this.emulator.disksMenuOpen = false;
        const diskButton = addButton(this.emulator.config.buttonOpts.diskButton, () => {
            this.emulator.disksMenuOpen = !this.emulator.disksMenuOpen;
            diskButton[1].classList.toggle("ejs_svg_rotate", this.emulator.disksMenuOpen);
            this.emulator.disksMenu.style.display = this.emulator.disksMenuOpen ? "" : "none";
            diskButton[2].classList.toggle("ejs_disks_text", this.emulator.disksMenuOpen);
        }, this.emulator.diskParent, true);
        this.emulator.elements.menu.appendChild(this.emulator.diskParent);
        this.emulator.closeDisksMenu = () => {
            if (!this.emulator.disksMenu) return;
            this.emulator.disksMenuOpen = false;
            diskButton[1].classList.toggle("ejs_svg_rotate", this.emulator.disksMenuOpen);
            diskButton[2].classList.toggle("ejs_disks_text", this.emulator.disksMenuOpen);
            this.emulator.disksMenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.disksMenu, e.target)) return;
            if (e.pointerType === "touch") return;
            if (e.target === diskButton[0] || e.target === diskButton[2]) return;
            this.emulator.closeDisksMenu();
        })

        this.emulator.settingParent = this.emulator.createElement("div");
        this.emulator.settingsMenuOpen = false;
        const settingButton = addButton(this.emulator.config.buttonOpts.settings, () => {
            this.emulator.settingsMenuOpen = !this.emulator.settingsMenuOpen;
            settingButton[1].classList.toggle("ejs_svg_rotate", this.emulator.settingsMenuOpen);
            this.emulator.settingsMenu.style.display = this.emulator.settingsMenuOpen ? "" : "none";
            settingButton[2].classList.toggle("ejs_settings_text", this.emulator.settingsMenuOpen);
        }, this.emulator.settingParent, true);
        this.emulator.elements.menu.appendChild(this.emulator.settingParent);
        this.emulator.closeSettingsMenu = () => {
            if (!this.emulator.settingsMenu) return;
            this.emulator.settingsMenuOpen = false;
            settingButton[1].classList.toggle("ejs_svg_rotate", this.emulator.settingsMenuOpen);
            settingButton[2].classList.toggle("ejs_settings_text", this.emulator.settingsMenuOpen);
            this.emulator.settingsMenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.settingsMenu, e.target)) return;
            if (e.pointerType === "touch") return;
            if (e.target === settingButton[0] || e.target === settingButton[2]) return;
            this.emulator.closeSettingsMenu();
        })

        this.emulator.addEventListener(this.emulator.canvas, "click", (e) => {
            if (e.pointerType === "touch") return;
            if (this.emulator.enableMouseLock && !this.emulator.paused) {
                if (this.emulator.canvas.requestPointerLock) {
                    this.emulator.canvas.requestPointerLock();
                } else if (this.emulator.canvas.mozRequestPointerLock) {
                    this.emulator.canvas.mozRequestPointerLock();
                }
                this.emulator.menu.close();
            }
        })

        const enter = addButton(this.emulator.config.buttonOpts.enterFullscreen, () => {
            this.emulator.toggleFullscreen(true);
        });
        const exit = addButton(this.emulator.config.buttonOpts.exitFullscreen, () => {
            this.emulator.toggleFullscreen(false);
        });
        exit.style.display = "none";

        this.emulator.toggleFullscreen = (fullscreen) => {
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
                exit.style.display = "";
                enter.style.display = "none";
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
                exit.style.display = "none";
                enter.style.display = "";
                if (this.emulator.isMobile) {
                    try {
                        screen.orientation.unlock();
                    } catch (e) { }
                }
            }
        }

        let exitMenuIsOpen = false;
        const exitEmulation = addButton(this.emulator.config.buttonOpts.exitEmulation, async () => {
            if (exitMenuIsOpen) return;
            exitMenuIsOpen = true;
            const popups = this.emulator.createSubPopup();
            this.emulator.game.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent");
            popups[1].style.width = "100%";
            const popup = popups[1];
            const header = this.emulator.createElement("div");
            header.classList.add("ejs_cheat_header");
            const title = this.emulator.createElement("h2");
            title.innerText = this.emulator.localization("Are you sure you want to exit?");
            title.classList.add("ejs_cheat_heading");
            const close = this.emulator.createElement("button");
            close.classList.add("ejs_cheat_close");
            header.appendChild(title);
            header.appendChild(close);
            popup.appendChild(header);
            this.emulator.addEventListener(close, "click", (e) => {
                exitMenuIsOpen = false
                popups[0].remove();
            })
            popup.appendChild(this.emulator.createElement("br"));

            const footer = this.emulator.createElement("footer");
            const submit = this.emulator.createElement("button");
            const closeButton = this.emulator.createElement("button");
            submit.innerText = this.emulator.localization("Exit");
            closeButton.innerText = this.emulator.localization("Cancel");
            submit.classList.add("ejs_button_button");
            closeButton.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            closeButton.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            footer.appendChild(submit);
            const span = this.emulator.createElement("span");
            span.innerText = " ";
            footer.appendChild(span);
            footer.appendChild(closeButton);
            popup.appendChild(footer);

            this.emulator.addEventListener(closeButton, "click", (e) => {
                popups[0].remove();
                exitMenuIsOpen = false
            })

            this.emulator.addEventListener(submit, "click", (e) => {
                popups[0].remove();
                const body = this.emulator.createPopup("EmulatorJS has exited", {});
                this.emulator.callEvent("exit");
            })
            setTimeout(this.emulator.menu.close.bind(this), 20);
        });

        this.emulator.addEventListener(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", (e) => {
            if (e.target !== this.emulator.elements.parent) return;
            if (document.fullscreenElement === null) {
                exit.style.display = "none";
                enter.style.display = "";
            } else {
                //not sure if this is possible, lets put it here anyways
                exit.style.display = "";
                enter.style.display = "none";
            }
        })

        const hasFullscreen = !!(this.emulator.elements.parent.requestFullscreen || this.emulator.elements.parent.mozRequestFullScreen || this.emulator.elements.parent.webkitRequestFullscreen || this.emulator.elements.parent.msRequestFullscreen);

        if (!hasFullscreen) {
            exit.style.display = "none";
            enter.style.display = "none";
        }

        this.emulator.elements.bottomBar = {
            playPause: [pauseButton, playButton],
            restart: [restartButton],
            settings: [settingButton],
            contextMenu: [contextMenuButton],
            fullscreen: [enter, exit],
            saveState: [saveState],
            loadState: [loadState],
            gamepad: [controlMenu],
            cheat: [cheatMenu],
            cacheManager: [cache],
            saveSavFiles: [saveSavFiles],
            loadSavFiles: [loadSavFiles],
            netplay: [netplay],
            exit: [exitEmulation]
        }

        if (this.emulator.config.buttonOpts) {
            if (this.emulator.debug) console.log(this.emulator.config.buttonOpts);
            if (this.emulator.config.buttonOpts.playPause.visible === false) {
                pauseButton.style.display = "none";
                playButton.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.contextMenuButton === false && this.emulator.config.buttonOpts.rightClick !== false && this.emulator.isMobile === false) contextMenuButton.style.display = "none"
            if (this.emulator.config.buttonOpts.restart.visible === false) restartButton.style.display = "none"
            if (this.emulator.config.buttonOpts.settings.visible === false) settingButton[0].style.display = "none"
            if (this.emulator.config.buttonOpts.fullscreen.visible === false) {
                enter.style.display = "none";
                exit.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.mute.visible === false) {
                muteButton.style.display = "none";
                unmuteButton.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.saveState.visible === false) saveState.style.display = "none";
            if (this.emulator.config.buttonOpts.loadState.visible === false) loadState.style.display = "none";
            if (this.emulator.config.buttonOpts.saveSavFiles.visible === false) saveSavFiles.style.display = "none";
            if (this.emulator.config.buttonOpts.loadSavFiles.visible === false) loadSavFiles.style.display = "none";
            if (this.emulator.config.buttonOpts.gamepad.visible === false) controlMenu.style.display = "none";
            if (this.emulator.config.buttonOpts.cheat.visible === false) cheatMenu.style.display = "none";
            if (this.emulator.config.buttonOpts.cacheManager.visible === false) cache.style.display = "none";
            if (this.emulator.config.buttonOpts.netplay.visible === false) netplay.style.display = "none";
            if (this.emulator.config.buttonOpts.diskButton.visible === false) diskButton[0].style.display = "none";
            if (this.emulator.config.buttonOpts.volumeSlider.visible === false) volumeSlider.style.display = "none";
            if (this.emulator.config.buttonOpts.exitEmulation.visible === false) exitEmulation.style.display = "none";
        }

        this.emulator.menu.failedToStart = () => {
            if (!this.emulator.config.buttonOpts) this.emulator.config.buttonOpts = {};
            this.emulator.config.buttonOpts.mute = false;

            settingButton[0].style.display = "";

            // Hide all except settings button.
            pauseButton.style.display = "none";
            playButton.style.display = "none";
            contextMenuButton.style.display = "none";
            restartButton.style.display = "none";
            enter.style.display = "none";
            exit.style.display = "none";
            muteButton.style.display = "none";
            unmuteButton.style.display = "none";
            saveState.style.display = "none";
            loadState.style.display = "none";
            saveSavFiles.style.display = "none";
            loadSavFiles.style.display = "none";
            controlMenu.style.display = "none";
            cheatMenu.style.display = "none";
            cache.style.display = "none";
            netplay.style.display = "none";
            diskButton[0].style.display = "none";
            volumeSlider.style.display = "none";
            exitEmulation.style.display = "none";

            this.emulator.elements.menu.style.opacity = "";
            this.emulator.elements.menu.style.background = "transparent";
            this.emulator.virtualGamepad.style.display = "none";
            settingButton[0].classList.add("shadow");
            this.emulator.menu.open(true);
        }
    }

    createBottomMenuBarListeners() {
        // Implementation for bottom menu bar listeners
    }


}
