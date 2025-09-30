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
        let mergedButtonOptions = this.emulator.defaultButtonOptions;

        // merge buttonUserOpts with mergedButtonOptions
        if (buttonUserOpts) {
            for (const key in buttonUserOpts) {
                let searchKey = key;
                // If the key is an alias, find the actual key in the default buttons
                if (this.emulator.defaultButtonAliases[key]) {
                    // Use the alias to find the actual key
                    // and update the searchKey to the actual key
                    searchKey = this.emulator.defaultButtonAliases[key];
                }

                // prevent the contextMenu button from being overridden
                if (searchKey === "contextMenu")
                    continue;

                // Check if the button exists in the default buttons, and update its properties
                if (!mergedButtonOptions[searchKey]) {
                    console.warn(`Button "${searchKey}" is not a valid button.`);
                    continue;
                }

                // if the value is a boolean, set the visible property to the value
                if (typeof buttonUserOpts[searchKey] === "boolean") {
                    mergedButtonOptions[searchKey].visible = buttonUserOpts[searchKey];
                } else if (typeof buttonUserOpts[searchKey] === "object") {
                    // If the value is an object, merge it with the default button properties

                    if (this.emulator.defaultButtonOptions[searchKey]) {
                        // copy properties from the button definition if they aren't null
                        for (const prop in buttonUserOpts[searchKey]) {
                            if (buttonUserOpts[searchKey][prop] !== null) {
                                mergedButtonOptions[searchKey][prop] = buttonUserOpts[searchKey][prop];
                            }
                        }
                    } else {
                        // button was not in the default buttons list and is therefore a custom button
                        // verify that the value has a displayName, icon, and callback property
                        if (buttonUserOpts[searchKey].displayName && buttonUserOpts[searchKey].icon && buttonUserOpts[searchKey].callback) {
                            mergedButtonOptions[searchKey] = {
                                visible: true,
                                displayName: buttonUserOpts[searchKey].displayName,
                                icon: buttonUserOpts[searchKey].icon,
                                callback: buttonUserOpts[searchKey].callback,
                                custom: true
                            };
                        } else {
                            console.warn(`Custom button "${searchKey}" is missing required properties`);
                        }
                    }
                } else {
                    // if the value is a string, set the icon property to the value
                    if (typeof buttonUserOpts[searchKey] === "string") {
                        mergedButtonOptions[searchKey].icon = buttonUserOpts[searchKey];
                    } else {
                        // if the value is a function, set the callback property to the value
                        if (typeof buttonUserOpts[searchKey] === "function") {
                            mergedButtonOptions[searchKey].callback = buttonUserOpts[searchKey];
                        }
                    }
                }
            }
        }

        return mergedButtonOptions;
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
    }
}
