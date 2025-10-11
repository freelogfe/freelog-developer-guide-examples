export function on(event, func) {
    if (!this.functions) this.functions = {};
    if (!Array.isArray(this.functions[event])) this.functions[event] = [];
    this.functions[event].push(func);
}
export function callEvent(event, data) {
    if (!this.functions) this.functions = {};
    if (!Array.isArray(this.functions[event])) return 0;
    this.functions[event].forEach(e => e(data));
    return this.functions[event].length;
}
export function bindListeners() {
    this.addEventListener(this.elements.parent, "keydown keyup", this.keyChange.bind(this));
    this.addEventListener(this.elements.parent, "mousedown touchstart", (e) => {
        if (document.activeElement !== this.elements.parent && this.config.noAutoFocus !== true) this.elements.parent.focus();
    })
    this.addEventListener(window, "resize", this.handleResize.bind(this));
    //this.addEventListener(window, "blur", e => console.log(e), true); //TODO - add "click to make keyboard keys work" message?

    let counter = 0;
    this.elements.statePopupPanel = this.createPopup("", {}, true);
    this.elements.statePopupPanel.innerText = this.localization("Drop save state here to load");
    this.elements.statePopupPanel.style["text-align"] = "center";
    this.elements.statePopupPanel.style["font-size"] = "28px";

    //to fix a funny apple bug
    this.addEventListener(window, "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", () => {
        setTimeout(() => {
            this.handleResize.bind(this);
            if (this.config.noAutoFocus !== true) this.elements.parent.focus();
        }, 0);
    });
    this.addEventListener(window, "beforeunload", (e) => {
        if (!this.started) return;
        this.callEvent("exit");
    });
    this.addEventListener(this.elements.parent, "dragenter", (e) => {
        e.preventDefault();
        if (!this.started) return;
        counter++;
        this.elements.statePopupPanel.parentElement.style.display = "block";
    });
    this.addEventListener(this.elements.parent, "dragover", (e) => {
        e.preventDefault();
    });
    this.addEventListener(this.elements.parent, "dragleave", (e) => {
        e.preventDefault();
        if (!this.started) return;
        counter--;
        if (counter === 0) {
            this.elements.statePopupPanel.parentElement.style.display = "none";
        }
    });
    this.addEventListener(this.elements.parent, "dragend", (e) => {
        e.preventDefault();
        if (!this.started) return;
        counter = 0;
        this.elements.statePopupPanel.parentElement.style.display = "none";
    });

    this.addEventListener(this.elements.parent, "drop", (e) => {
        e.preventDefault();
        if (!this.started) return;
        this.elements.statePopupPanel.parentElement.style.display = "none";
        counter = 0;
        const items = e.dataTransfer.items;
        let file;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind !== "file") continue;
            file = items[i];
            break;
        }
        if (!file) return;
        const fileHandle = file.getAsFile();
        fileHandle.arrayBuffer().then(data => {
            this.gameManager.loadState(new Uint8Array(data));
        })
    });

    
}
export function addEventListener(element, listener, callback) {
    const listeners = listener.split(" ");
    let rv = [];
    for (let i = 0; i < listeners.length; i++) {
        element.addEventListener(listeners[i], callback);
        const data = { cb: callback, elem: element, listener: listeners[i] };
        rv.push(data);
    }
    return rv;
}
export function removeEventListener(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].elem.removeEventListener(data[i].listener, data[i].cb);
    }
}
