/**
 * DOM Utilities Module
 * Handles DOM element creation and event listener management
 */
export default class DOMUtilities {
    constructor(emulator) {
        this.emulator = emulator;
    }

    createElement(type) {
        return document.createElement(type);
    }

    addEventListener(element, listener, callback) {
        const listeners = listener.split(" ");
        let rv = [];
        for (let i = 0; i < listeners.length; i++) {
            element.addEventListener(listeners[i], callback);
            const data = { cb: callback, elem: element, listener: listeners[i] };
            rv.push(data);
        }
        return rv;
    }

    removeEventListener(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].elem.removeEventListener(data[i].listener, data[i].cb);
        }
    }
}
