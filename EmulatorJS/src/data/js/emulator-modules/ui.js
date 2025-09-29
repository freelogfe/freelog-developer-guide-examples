/**
 * 模拟器UI模块
 * 包含所有用户界面相关代码
 */

class EmulatorUI {
    constructor(emulator) {
        this.emulator = emulator;
        this.elements = {};
        this.currentPopup = null;
        this.menu = null;
        this.msgElem = null;
        this.msgTimeout = null;
        this.textElem = null;
        this.initUI();
    }

    initUI() {
        this.setElements();
        this.setColor(this.emulator.config.color || "");
        this.emulator.config.alignStartButton = (typeof this.emulator.config.alignStartButton === "string") ? this.emulator.config.alignStartButton : "bottom";
        this.emulator.config.backgroundColor = (typeof this.emulator.config.backgroundColor === "string") ? this.emulator.config.backgroundColor : "rgb(51, 51, 51)";
        
        if (this.emulator.config.adUrl) {
            this.emulator.config.adSize = (Array.isArray(this.emulator.config.adSize)) ? this.emulator.config.adSize : ["300px", "250px"];
            this.setupAds(this.emulator.config.adUrl, this.emulator.config.adSize[0], this.emulator.config.adSize[1]);
        }

        this.emulator.game.classList.add("ejs_game");
        if (typeof this.emulator.config.backgroundImg === "string") {
            this.emulator.game.classList.add("ejs_game_background");
            if (this.emulator.config.backgroundBlur) this.emulator.game.classList.add("ejs_game_background_blur");
            this.emulator.game.setAttribute("style", `--ejs-background-image: url("${this.emulator.config.backgroundImg}"); --ejs-background-color: ${this.emulator.config.backgroundColor};`);
            this.emulator.on("start", () => {
                this.emulator.game.classList.remove("ejs_game_background");
                if (this.emulator.config.backgroundBlur) this.emulator.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.emulator.game.setAttribute("style", "--ejs-background-color: " + this.emulator.config.backgroundColor + ";");
        }

        if (Array.isArray(this.emulator.config.cheats)) {
            for (let i = 0; i < this.emulator.config.cheats.length; i++) {
                const cheat = this.emulator.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.emulator.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }

        this.createStartButton();
        this.emulator.handleResize();
    }

    setElements() {
        const game = this.emulator.createElement("div");
        const elem = document.querySelector(this.emulator.config.element);
        elem.innerHTML = "";
        elem.appendChild(game);
        this.emulator.game = game;

        this.elements = {
            main: this.emulator.game,
            parent: elem
        }
        this.elements.parent.classList.add("ejs_parent");
        this.elements.parent.setAttribute("tabindex", -1);
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
            this.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
            return;
        }
        this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
    }

    setupAds(ads, width, height) {
        const div = this.emulator.createElement("div");
        const time = (typeof this.emulator.config.adMode === "number" && this.emulator.config.adMode > -1 && this.emulator.config.adMode < 3) ? this.emulator.config.adMode : 2;
        div.classList.add("ejs_ad_iframe");
        const frame = this.emulator.createElement("iframe");
        frame.src = ads;
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("frameborder", "no");
        frame.style.width = width;
        frame.style.height = height;
        const closeParent = this.emulator.createElement("div");
        closeParent.classList.add("ejs_ad_close");
        const closeButton = this.emulator.createElement("a");
        closeParent.appendChild(closeButton);
        closeParent.setAttribute("hidden", "");
        div.appendChild(closeParent);
        div.appendChild(frame);
        if (this.emulator.config.adMode !== 1) {
            this.elements.parent.appendChild(div);
        }
        this.emulator.addEventListener(closeButton, "click", () => {
            div.remove();
        })

        this.emulator.on("start-clicked", () => {
            if (this.emulator.config.adMode === 0) div.remove();
            if (this.emulator.config.adMode === 1) {
                this.elements.parent.appendChild(div);
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

    createStartButton() {
        const button = this.emulator.createElement("div");
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
        this.elements.parent.appendChild(button);
        this.emulator.addEventListener(button, "touchstart", () => {
            this.emulator.touch = true;
        })
        this.emulator.addEventListener(button, "click", this.startButtonClicked.bind(this));
        if (this.emulator.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.emulator.callEvent("ready");
        }, 20);
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
        this.createText();
        this.emulator.downloadGameCore();
    }

    createText() {
        this.textElem = this.emulator.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.emulator.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.emulator.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
    }

    displayMessage(message, time) {
        if (!this.msgElem) {
            this.msgElem = this.emulator.createElement("div");
            this.msgElem.classList.add("ejs_message");
            this.elements.parent.appendChild(this.msgElem);
        }
        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(() => {
            this.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.msgElem.innerText = message;
    }

    // 其他UI方法...
}

export default EmulatorUI;