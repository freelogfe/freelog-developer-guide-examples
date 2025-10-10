export function setupAds(ads, width, height) {
    const div = this.createElement("div");
    const time = (typeof this.config.adMode === "number" && this.config.adMode > -1 && this.config.adMode < 3) ? this.config.adMode : 2;
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
    if (this.config.adMode !== 1) {
        this.elements.parent.appendChild(div);
    }
    this.addEventListener(closeButton, "click", () => {
        div.remove();
    })

    this.on("start-clicked", () => {
        if (this.config.adMode === 0) div.remove();
        if (this.config.adMode === 1) {
            this.elements.parent.appendChild(div);
        }
    })

    this.on("start", () => {
        closeParent.removeAttribute("hidden");
        const time = (typeof this.config.adTimer === "number" && this.config.adTimer > 0) ? this.config.adTimer : 10000;
        if (this.config.adTimer === -1) div.remove();
        if (this.config.adTimer === 0) return;
        setTimeout(() => {
            div.remove();
        }, time);
    })

}
export function adBlocked(url, del) {
    if (del) {
        document.querySelector('div[class="ejs_ad_iframe"]').remove();
    } else {
        try {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } catch (e) { }
        this.config.adUrl = url;
        this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
    }
}
