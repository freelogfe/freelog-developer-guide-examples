/**
 * Ads Monetization Module
 * Manages advertisement display and timing
 */
export default class AdsMonetization {
    constructor(emulator) {
        this.emulator = emulator;
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

    checkAdBlock() {
        // Implementation for checking if ads are blocked
        return false;
    }

    enableAdBlockDetection() {
        // Implementation for enabling ad block detection
    }

    initializeFromConfig() {
        if (this.emulator.config.adUrl) {
            this.emulator.config.adSize = (Array.isArray(this.emulator.config.adSize)) ? this.emulator.config.adSize : ["300px", "250px"];
            this.setupAds(this.emulator.config.adUrl, this.emulator.config.adSize[0], this.emulator.config.adSize[1]);
        }
    }
}
