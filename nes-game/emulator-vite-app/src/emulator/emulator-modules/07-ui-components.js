/**
 * UI Components Module
 * Manages the creation and behavior of UI elements
 */
export default class UIComponents {
    constructor(emulator) {
        this.emulator = emulator;
    }

    createPopup(popupTitle, buttons, hidden) {
        if (!hidden) this.emulator.closePopup();
        const popup = this.emulator.createElement("div");
        popup.classList.add("ejs_popup_container");
        this.emulator.elements.parent.appendChild(popup);
        const title = this.emulator.createElement("h4");
        title.innerText = this.emulator.localization(popupTitle);
        popup.appendChild(title);
        const main = this.emulator.createElement("div");
        popup.appendChild(main);
        if (buttons) {
            const padding = this.emulator.createElement("div");
            padding.classList.add("ejs_popup_padding");
            popup.appendChild(padding);
            const buttonParent = this.emulator.createElement("div");
            buttonParent.classList.add("ejs_popup_buttons");
            for (const k in buttons) {
                const button = this.emulator.createElement("a");
                button.innerText = this.emulator.localization(k);
                button.classList.add("ejs_popup_button");
                button.addEventListener("click", buttons[k]);
                buttonParent.appendChild(button);
            }
            popup.appendChild(buttonParent);
        }
        if (!hidden) popup.style.display = "none";
        this.emulator.currentPopup = popup;
        return main;
    }

    createLink(elem, link, text, useP) {
        const elm = this.emulator.createElement("a");
        elm.href = link;
        elm.target = "_blank";
        elm.innerText = this.emulator.localization(text);
        if (useP) {
            const p = this.emulator.createElement("p");
            p.appendChild(elm);
            elem.appendChild(p);
        } else {
            elem.appendChild(elm);
        }
        return elm;
    }

    createBottomMenuBar() {
        this.emulator.elements.menu = this.emulator.createElement("div");

        //prevent weird glitch on some devices
        this.emulator.elements.menu.style.opacity = 0;
        this.emulator.on("start", (e) => {
            this.emulator.elements.menu.style.opacity = "";
        });

        this.emulator.elements.parent.appendChild(this.emulator.elements.menu);

        let tmout;
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (tmout) clearTimeout(tmout);
            this.emulator.elements.menu.style.display = "";
            tmout = setTimeout(() => {
                if (this.emulator.elements.menu && !this.emulator.isPopupOpen() && this.emulator.started) {
                    this.emulator.elements.menu.style.display = "none";
                }
            }, 3000);
        });

        this.emulator.addEventListener(this.emulator.elements.menu, "mouseenter", () => {
            if (tmout) clearTimeout(tmout);
        });

        this.emulator.addEventListener(this.emulator.elements.menu, "mouseleave", () => {
            if (tmout) clearTimeout(tmout);
            tmout = setTimeout(() => {
                if (this.emulator.elements.menu && !this.emulator.isPopupOpen() && this.emulator.started) {
                    this.emulator.elements.menu.style.display = "none";
                }
            }, 3000);
        });
    }

    createBottomMenuBarButtons() {
        // This method would contain the logic for creating menu buttons
        // Implementation would depend on specific button configurations
    }

    createBottomMenuBarListeners() {
        const clickListener = (e) => {
            if (e.pointerType === "touch") return;
            if (!this.emulator.started || this.emulator.ignoreEvents || document.pointerLockElement === this.emulator.canvas) return;
            if (this.emulator.isPopupOpen()) return;
            this.showMenu();
        };

        const mouseListener = (e) => {
            if (!this.emulator.started) return;
            if (document.pointerLockElement === this.emulator.canvas) return;
            if (this.emulator.isPopupOpen()) return;
            if (e.target === this.emulator.elements.menu || this.emulator.isChild(this.emulator.elements.menu, e.target)) return;
            if (this.emulator.touch && e.pointerType === "touch") return;
            this.emulator.elements.menu.style.display = "none";
        };

        this.emulator.addEventListener(this.emulator.elements.parent, "click", clickListener);
        this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", mouseListener);
    }

    createContextMenu() {
        this.emulator.elements.contextmenu = this.emulator.createElement("div");
        this.emulator.elements.contextmenu.classList.add("ejs_context_menu");
        this.emulator.addEventListener(this.emulator.game, "contextmenu", (e) => {
            e.preventDefault();
            if ((this.emulator.config.buttonOpts && this.emulator.config.buttonOpts.rightClick === false) || !this.emulator.started) return;
            this.showContextMenu(e);
        });
        this.emulator.elements.parent.appendChild(this.emulator.elements.contextmenu);
    }

    buildButtonOptions(buttonUserOpts) {
        let mergedButtonOptions = this.emulator.defaultButtonOptions || {};

        // merge buttonUserOpts with mergedButtonOptions
        if (buttonUserOpts) {
            for (const key in buttonUserOpts) {
                if (buttonUserOpts[key] !== undefined) {
                    if (typeof buttonUserOpts[key] === "object" && !Array.isArray(buttonUserOpts[key]) && buttonUserOpts[key] !== null) {
                        if (!mergedButtonOptions[key]) mergedButtonOptions[key] = {};
                        Object.assign(mergedButtonOptions[key], buttonUserOpts[key]);
                    } else {
                        mergedButtonOptions[key] = buttonUserOpts[key];
                    }
                }
            }
        }

        return mergedButtonOptions;
    }

    showMenu() {
        if (!this.emulator.started) return;
        this.emulator.elements.menu.style.display = "";
    }

    showContextMenu(e) {
        const hideMenu = () => {
            this.emulator.elements.contextmenu.style.display = "none";
        };

        const parent = this.emulator.createElement("ul");
        parent.classList.add("ejs_context_menu_parent");

        // Add context menu items based on configuration
        if (this.emulator.config.buttonOpts.screenshot !== false) {
            const screenshotLi = this.emulator.createElement("li");
            const screenshotA = this.emulator.createElement("a");
            screenshotA.innerText = this.emulator.localization("Screenshot");
            screenshotLi.appendChild(screenshotA);
            parent.appendChild(screenshotLi);
            this.emulator.addEventListener(screenshotLi, "click", (e) => {
                this.emulator.takeScreenshot();
                hideMenu();
            });
        }

        if (this.emulator.config.buttonOpts.saveState !== false) {
            const qSaveLi = this.emulator.createElement("li");
            const qSaveA = this.emulator.createElement("a");
            qSaveA.innerText = this.emulator.localization("Quick Save");
            qSaveLi.appendChild(qSaveA);
            parent.appendChild(qSaveLi);
            this.emulator.addEventListener(qSaveLi, "click", (e) => {
                this.emulator.quickSave();
                hideMenu();
            });
        }

        if (this.emulator.config.buttonOpts.loadState !== false) {
            const qLoadLi = this.emulator.createElement("li");
            const qLoadA = this.emulator.createElement("a");
            qLoadA.innerText = this.emulator.localization("Quick Load");
            qLoadLi.appendChild(qLoadA);
            parent.appendChild(qLoadLi);
            this.emulator.addEventListener(qLoadLi, "click", (e) => {
                this.emulator.quickLoad();
                hideMenu();
            });
        }

        this.emulator.elements.contextmenu.innerHTML = "";
        this.emulator.elements.contextmenu.appendChild(parent);
        this.emulator.elements.contextmenu.style.display = "block";
        this.emulator.elements.contextmenu.style.left = e.clientX + "px";
        this.emulator.elements.contextmenu.style.top = e.clientY + "px";

        const hideOnClick = (e) => {
            if (!this.emulator.isChild(this.emulator.elements.contextmenu, e.target)) {
                hideMenu();
                document.removeEventListener("click", hideOnClick);
            }
        };
        setTimeout(() => document.addEventListener("click", hideOnClick), 10);
    }
}
