
 // End start button
 export const createText = (emulator) => {
    emulator.textElem = emulator.createElement("div");
    emulator.textElem.classList.add("ejs_loading_text");
    if (typeof emulator.config.backgroundImg === "string") emulator.textElem.classList.add("ejs_loading_text_glow");
    emulator.textElem.innerText = emulator.localization("Loading...");
    emulator.elements.parent.appendChild(emulator.textElem);
}
export const setElements = (element, emulator) => {
    const game = emulator.createElement("div");
    const elem = document.querySelector(element);
    elem.innerHTML = "";
    elem.appendChild(game);
    emulator.game = game;

    emulator.elements = {
        main: emulator.game,
        parent: elem
    }
    emulator.elements.parent.classList.add("ejs_parent");
    emulator.elements.parent.setAttribute("tabindex", -1);
}
export const setColor = (color, emulator) => {
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