export function closePopup() {
    if (this.currentPopup !== null) {
        try {
            this.currentPopup.remove();
        } catch (e) { }
        this.currentPopup = null;
    }
}
export function displayMessage(message, time) {
    if (!this.msgElem) {
        this.msgElem = this.createElement("div");
        this.msgElem.classList.add("ejs_message");
        this.elements.parent.appendChild(this.msgElem);
    }
    clearTimeout(this.msgTimeout);
    this.msgTimeout = setTimeout(() => {
        this.msgElem.innerText = "";
    }, (typeof time === "number" && time > 0) ? time : 3000)
    this.msgElem.innerText = message;
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

export function isPopupOpen() {
    return this.cheatMenu.style.display !== "none" || this.netplayMenu.style.display !== "none" || this.controlMenu.style.display !== "none" || this.currentPopup !== null;
}