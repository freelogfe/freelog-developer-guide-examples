// UI management functions
export class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
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

    setElements(element) {
        const game = this.createElement("div");
        const elem = document.querySelector(element);
        elem.innerHTML = "";
        elem.appendChild(game);
        this.emulator.game = game;

        this.emulator.elements = {
            main: this.emulator.game,
            parent: elem
        }
        this.emulator.elements.parent.classList.add("ejs_parent");
        this.emulator.elements.parent.setAttribute("tabindex", -1);
    }

    createStartButton() {
        const button = this.createElement("div");
        button.classList.add("ejs_start_button");
        let border = 0;
        if (typeof this.emulator.config.backgroundImg === "string") {
            button.classList.add("ejs_start_button_border");
            border = 1;
        }
        button.innerText = (typeof this.emulator.config.startBtnName === "string") ? this.emulator.config.startBtnName : this.emulator.localization("Start Game");
        if (this.emulator.config.alignStartButton == "top") {
            button.style.bottom = "calc(100% - 20px)";
        } else if (this.emulator.config.alignStartButton == "center") {
            button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
        }
        this.emulator.elements.parent.appendChild(button);
        this.addEventListener(button, "touchstart", () => {
            this.emulator.touch = true;
        })
        this.addEventListener(button, "click", this.emulator.startButtonClicked.bind(this.emulator));
        if (this.emulator.config.startOnLoad === true) {
            this.emulator.startButtonClicked(button);
        }
        setTimeout(() => {
            this.emulator.callEvent("ready");
        }, 20);
    }

    createText() {
        this.emulator.textElem = this.createElement("div");
        this.emulator.textElem.classList.add("ejs_loading_text");
        if (typeof this.emulator.config.backgroundImg === "string") this.emulator.textElem.classList.add("ejs_loading_text_glow");
        this.emulator.textElem.innerText = this.emulator.localization("Loading...");
        this.emulator.elements.parent.appendChild(this.emulator.textElem);
    }

    localization(text, log) {
        if (typeof text === "undefined" || text.length === 0) return;
        text = text.toString();
        if (text.includes("EmulatorJS v")) return text;
        if (this.emulator.config.langJson) {
            if (typeof log === "undefined") log = true;
            if (!this.emulator.config.langJson[text] && log) {
                if (!this.emulator.missingLang.includes(text)) this.emulator.missingLang.push(text);
                console.log(`Translation not found for '${text}'. Language set to '${this.emulator.config.language}'`);
            }
            return this.emulator.config.langJson[text] || text;
        }
        return text;
    }

    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            color = color.toLowerCase();
            if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
                if (color.length === 4) {
                    let rv = "#";
                    for (let i = 1; i < 4; i++) {
                        rv += color.slice(i, i + 1) + color.slice(i, i + 1);
                    }
                    color = rv;
                }
                let rv = [];
                for (let i = 1; i < 7; i += 2) {
                    rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
                }
                return rv.join(", ");
            }
            return null;
        }
        if (!color || getColor(color) === null) {
            this.emulator.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
            return;
        }
        this.emulator.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
    }

    setupAds(ads, width, height) {
        const div = this.createElement("div");
        const time = (typeof this.emulator.config.adMode === "number" && this.emulator.config.adMode > -1 && this.emulator.config.adMode < 3) ? this.emulator.config.adMode : 2;
        div.classList.add("ejs_ad_iframe");
        const frame = this.createElement("iframe");
        frame.src = ads;
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("frameborder", "no");
        frame.style.width = width;
        frame.style.height = height;
        const closeParent = this.createElement("div");
        closeParent.classList.add("ejs_ad_close");
        const closeButton = this.createElement("a");
        closeParent.appendChild(closeButton);
        closeParent.setAttribute("hidden", "");
        div.appendChild(closeParent);
        div.appendChild(frame);
        if (this.emulator.config.adMode !== 1) {
            this.emulator.elements.parent.appendChild(div);
        }
        this.addEventListener(closeButton, "click", () => {
            div.remove();
        })

        this.emulator.on("start-clicked", () => {
            if (this.emulator.config.adMode === 0) div.remove();
            if (this.emulator.config.adMode === 1) {
                this.emulator.elements.parent.appendChild(div);
            }
        })

        this.emulator.on("start", () => {
            closeParent.removeAttribute("hidden");
            const time = (typeof this.emulator.config.adTimer === "number" && this.emulator.config.adTimer > 0) ? this.emulator.config.adTimer : 10000;
            if (this.emulator.config.adTimer === -1) div.remove();
            if (this.emulator.config.adTimer === 0) return;
            setTimeout(() => {
                div.remove();
            }, time);
        })

    }

    adBlocked(url, del) {
        if (del) {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } else {
            try {
                document.querySelector('div[class="ejs_ad_iframe"]').remove();
            } catch (e) { }
            this.emulator.config.adUrl = url;
            this.setupAds(this.emulator.config.adUrl, this.emulator.config.adSize[0], this.emulator.config.adSize[1]);
        }
    }

    displayMessage(message, time) {
        if (!this.emulator.msgElem) {
            this.emulator.msgElem = this.createElement("div");
            this.emulator.msgElem.classList.add("ejs_message");
            this.emulator.elements.parent.appendChild(this.emulator.msgElem);
        }
        clearTimeout(this.emulator.msgTimeout);
        this.emulator.msgTimeout = setTimeout(() => {
            this.emulator.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.emulator.msgElem.innerText = message;
    }

    closePopup() {
        if (this.emulator.currentPopup !== null) {
            try {
                this.emulator.currentPopup.remove();
            } catch (e) { }
            this.emulator.currentPopup = null;
        }
    }

    //creates a full box popup.
    createPopup(popupTitle, buttons, hidden) {
        if (!hidden) this.closePopup();
        const popup = this.createElement("div");
        popup.classList.add("ejs_popup_container");
        this.emulator.elements.parent.appendChild(popup);
        const title = this.createElement("h4");
        title.innerText = this.localization(popupTitle);
        const main = this.createElement("div");
        main.classList.add("ejs_popup_body");

        popup.appendChild(title);
        popup.appendChild(main);

        const padding = this.createElement("div");
        padding.style["padding-top"] = "10px";
        popup.appendChild(padding);

        for (let k in buttons) {
            const button = this.createElement("a");
            if (buttons[k] instanceof Function) {
                button.addEventListener("click", (e) => {
                    buttons[k]();
                    e.preventDefault();
                });
            }
            button.classList.add("ejs_button");
            button.innerText = this.localization(k);
            popup.appendChild(button);
        }
        if (!hidden) {
            this.emulator.currentPopup = popup;
        } else {
            popup.style.display = "none";
        }

        return main;
    }

    createSubPopup(hidden) {
        const popup = this.createElement("div");
        popup.classList.add("ejs_popup_container");
        popup.classList.add("ejs_popup_container_box");
        const popupMsg = this.createElement("div");
        popupMsg.innerText = "";
        if (hidden) popup.setAttribute("hidden", "");
        popup.appendChild(popupMsg);
        return [popup, popupMsg];
    }

    selectFile() {
        return new Promise((resolve, reject) => {
            const file = this.createElement("input");
            file.type = "file";
            this.addEventListener(file, "change", (e) => {
                resolve(e.target.files[0]);
            })
            file.click();
        })
    }

    isPopupOpen() {
        return this.emulator.cheatMenu.style.display !== "none" || this.emulator.netplayMenu.style.display !== "none" || this.emulator.controlMenu.style.display !== "none" || this.emulator.currentPopup !== null;
    }

    isChild(first, second) {
        if (!first || !second) return false;
        const adown = first.nodeType === 9 ? first.documentElement : first;

        if (first === second) return true;

        if (adown.contains) {
            return adown.contains(second);
        }

        return first.compareDocumentPosition && first.compareDocumentPosition(second) & 16;
    }

    handleResize() {
        if (!this.emulator.game.parentElement) {
            return false;
        }
        if (this.emulator.virtualGamepad) {
            if (this.emulator.virtualGamepad.style.display === "none") {
                this.emulator.virtualGamepad.style.opacity = 0;
                this.emulator.virtualGamepad.style.display = "";
                setTimeout(() => {
                    this.emulator.virtualGamepad.style.display = "none";
                    this.emulator.virtualGamepad.style.opacity = "";
                }, 250)
            }
        }
        const positionInfo = this.emulator.elements.parent.getBoundingClientRect();
        this.emulator.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
        //This wouldnt work using :not()... strange.
        this.emulator.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);

        if (!this.emulator.handleSettingsResize) return;
        this.emulator.handleSettingsResize();
    }

    getElementSize(element) {
        let elem = element.cloneNode(true);
        elem.style.position = "absolute";
        elem.style.opacity = 0;
        elem.removeAttribute("hidden");
        element.parentNode.appendChild(elem);
        const res = elem.getBoundingClientRect();
        elem.remove();
        return {
            "width": res.width,
            "height": res.height
        };
    }

    createLink(elem, link, text, useP) {
        const elm = this.createElement("a");
        elm.href = link;
        elm.target = "_blank";
        elm.innerText = this.localization(text);
        if (useP) {
            const p = this.createElement("p");
            p.appendChild(elm);
            elem.appendChild(p);
        } else {
            elem.appendChild(elm);
        }
    }
}
