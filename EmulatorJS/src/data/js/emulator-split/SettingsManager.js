
/**
 * 设置管理模块
 * 负责管理模拟器的设置选项和配置
 */
export class SettingsManager {
    constructor(emulator) {
        this.emulator = emulator;
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
            this.emulator.elements.parent.appendChild(div);
        }
        this.emulator.addEventListener(closeButton, "click", () => {
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

    checkCompression(data, msg, fileCbFunc) {
        if (!this.emulator.compression) {
            this.emulator.compression = new window.EJS_COMPRESSION(this.emulator);
        }
        if (msg) {
            this.emulator.textElem.innerText = msg;
        }
        return this.emulator.compression.decompress(data, (m, appendMsg) => {
            this.emulator.textElem.innerText = appendMsg ? (msg + m) : m;
        }, fileCbFunc);
    }

    startGameError(message) {
        console.log(message);
        this.emulator.textElem.innerText = message;
        this.emulator.textElem.classList.add("ejs_error_text");

        this.emulator.setupSettingsMenu();
        this.emulator.loadSettings();

        this.emulator.uiManager.failedToStart();
        this.emulator.handleResize();
        this.emulator.failedToStart = true;
    }

    getControlScheme() {
        return this.emulator.config.controlScheme || "gamepad";
    }
}
