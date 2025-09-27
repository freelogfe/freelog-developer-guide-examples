// UI functionality for EmulatorJS

export function setColor(emulator, color) {
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
        emulator.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
        return;
    }
    emulator.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}

export function setupAds(emulator, ads, width, height) {
    const div = emulator.createElement("div");
    const time = (typeof emulator.config.adMode === "number" && emulator.config.adMode > -1 && emulator.config.adMode < 3) ? emulator.config.adMode : 2;
    div.classList.add("ejs_ad_iframe");
    const frame = emulator.createElement("iframe");
    frame.src = ads;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "no");
    frame.style.width = width;
    frame.style.height = height;
    const closeParent = emulator.createElement("div");
    closeParent.classList.add("ejs_ad_close");
    const closeButton = emulator.createElement("a");
    closeParent.appendChild(closeButton);
    closeParent.setAttribute("hidden", "");
    div.appendChild(closeParent);
    div.appendChild(frame);
    if (emulator.config.adMode !== 1) {
        emulator.elements.parent.appendChild(div);
    }
    emulator.addEventListener(closeButton, "click", () => {
        div.remove();
    })

    emulator.on("start-clicked", () => {
        if (emulator.config.adMode === 0) div.remove();
        if (emulator.config.adMode === 1) {
            emulator.elements.parent.appendChild(div);
        }
    })

    emulator.on("start", () => {
        closeParent.removeAttribute("hidden");
        const time = (typeof emulator.config.adTimer === "number" && emulator.config.adTimer > 0) ? emulator.config.adTimer : 10000;
        if (emulator.config.adTimer === -1) div.remove();
        if (emulator.config.adTimer === 0) return;
        setTimeout(() => {
            div.remove();
        }, time);
    })
}

export function adBlocked(emulator, url, del) {
    if (del) {
        document.querySelector('div[class="ejs_ad_iframe"]').remove();
    } else {
        try {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } catch (e) {
            console.warn("AdBlocker detected!");
        }
        emulator.config.adUrl = url;
        setupAds(emulator, emulator.config.adUrl, emulator.config.adSize[0], emulator.config.adSize[1]);
    }
}