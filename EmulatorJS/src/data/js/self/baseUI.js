
 // End start button
export function createText() {
    this.textElem = this.createElement("div");
    this.textElem.classList.add("ejs_loading_text");
    if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
    this.textElem.innerText = this.localization("Loading...");
    this.elements.parent.appendChild(this.textElem);
}
export function setElements(element) {
    const game = this.createElement("div");
    const elem = document.querySelector(element);
    elem.innerHTML = "";
    elem.appendChild(game);
    this.game = game;

    this.elements = {
        main: this.game,
        parent: elem
    }
    this.elements.parent.classList.add("ejs_parent");
    this.elements.parent.setAttribute("tabindex", -1);
}
export function setColor(color) {
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
