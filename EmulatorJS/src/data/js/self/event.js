import { keyChange } from "./controller";
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
export function bindListeners(emulator) {
    addEventListener(emulator.elements.parent, "keydown keyup", keyChange.bind(emulator));
    addEventListener(emulator.elements.parent, "mousedown touchstart", (e) => {
        if (document.activeElement !== emulator.elements.parent && emulator.config.noAutoFocus !== true) emulator.elements.parent.focus();
    })
    addEventListener(window, "resize", emulator.handleResize.bind(emulator));
    //addEventListener(window, "blur", e => console.log(e), true); //TODO - add "click to make keyboard keys work" message?

    let counter = 0;
    emulator.elements.statePopupPanel = emulator.createPopup("", {}, true);
    emulator.elements.statePopupPanel.innerText = emulator.localization("Drop save state here to load");
    emulator.elements.statePopupPanel.style["text-align"] = "center";
    emulator.elements.statePopupPanel.style["font-size"] = "28px";

    //to fix a funny apple bug
    addEventListener(window, "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", () => {
        setTimeout(() => {
            emulator.handleResize.bind(emulator);
            if (emulator.config.noAutoFocus !== true) emulator.elements.parent.focus();
        }, 0);
    });
    addEventListener(window, "beforeunload", (e) => {
        if (!emulator.started) return;
        emulator.callEvent("exit");
    });
    addEventListener(emulator.elements.parent, "dragenter", (e) => {
        e.preventDefault();
        if (!emulator.started) return;
        counter++;
        emulator.elements.statePopupPanel.parentElement.style.display = "block";
    });
    addEventListener(emulator.elements.parent, "dragover", (e) => {
        e.preventDefault();
    });
    addEventListener(emulator.elements.parent, "dragleave", (e) => {
        e.preventDefault();
        if (!emulator.started) return;
        counter--;
        if (counter === 0) {
            emulator.elements.statePopupPanel.parentElement.style.display = "none";
        }
    });
    addEventListener(emulator.elements.parent, "dragend", (e) => {
        e.preventDefault();
        if (!emulator.started) return;
        counter = 0;
        emulator.elements.statePopupPanel.parentElement.style.display = "none";
    });

    addEventListener(emulator.elements.parent, "drop", (e) => {
        e.preventDefault();
        if (!emulator.started) return;
        emulator.elements.statePopupPanel.parentElement.style.display = "none";
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
            emulator.gameManager.loadState(new Uint8Array(data));
        })
    });

    emulator.gamepad = new GamepadHandler(); //https://github.com/ethanaobrien/Gamepad
    emulator.gamepad.on("connected", (e) => {
        if (!emulator.gamepadLabels) return;
        for (let i = 0; i < emulator.gamepadSelection.length; i++) {
            if (emulator.gamepadSelection[i] === "") {
                emulator.gamepadSelection[i] = emulator.gamepad.gamepads[e.gamepadIndex].id + "_" + emulator.gamepad.gamepads[e.gamepadIndex].index;
                break;
            }
        }
        emulator.updateGamepadLabels();
    })
    emulator.gamepad.on("disconnected", (e) => {
        const gamepadIndex = emulator.gamepad.gamepads.indexOf(emulator.gamepad.gamepads.find(f => f.index == e.gamepadIndex));
        const gamepadSelection = emulator.gamepad.gamepads[gamepadIndex].id + "_" + emulator.gamepad.gamepads[gamepadIndex].index;
        for (let i = 0; i < emulator.gamepadSelection.length; i++) {
            if (emulator.gamepadSelection[i] === gamepadSelection) {
                emulator.gamepadSelection[i] = "";
            }
        }
        setTimeout(emulator.updateGamepadLabels.bind(emulator), 10);
    })
    emulator.gamepad.on("axischanged", emulator.gamepadEvent.bind(emulator));
    emulator.gamepad.on("buttondown", emulator.gamepadEvent.bind(emulator));
    emulator.gamepad.on("buttonup", emulator.gamepadEvent.bind(emulator));
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
