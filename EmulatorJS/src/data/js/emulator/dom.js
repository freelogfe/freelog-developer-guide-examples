// DOM functionality for EmulatorJS

export function createElement(emulator, type) {
    return document.createElement(type);
}

export function addEventListener(emulator, element, listener, callback) {
    const listeners = listener.split(" ");
    let rv = [];
    for (let i = 0; i < listeners.length; i++) {
        element.addEventListener(listeners[i], callback);
        const data = { cb: callback, elem: element, listener: listeners[i] };
        rv.push(data);
    }
    return rv;
}

export function removeEventListener(emulator, data) {
    for (let i = 0; i < data.length; i++) {
        data[i].elem.removeEventListener(data[i].listener, data[i].cb);
    }
}