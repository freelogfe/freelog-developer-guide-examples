export function closePopup() {
    if (this.currentPopup !== null) {
        try {
            this.currentPopup.remove();
        } catch (e) { }
        this.currentPopup = null;
    }
}
//creates a full box popup.
export function createPopup(popupTitle, buttons, hidden) {
    if (!hidden) this.closePopup();
    const popup = this.createElement("div");
    popup.classList.add("ejs_popup_container");
    this.elements.parent.appendChild(popup);
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
        this.currentPopup = popup;
    } else {
        popup.style.display = "none";
    }

    return main;
}
