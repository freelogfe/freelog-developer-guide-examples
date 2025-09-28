/**
 * Event System Module
 * Provides a custom event system for the emulator
 */
export default class EventSystem {
    constructor(emulator) {
        this.emulator = emulator;
        this.functions = {};
    }

    on(event, func) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) this.functions[event] = [];
        this.functions[event].push(func);
    }

    callEvent(event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return 0;
        this.functions[event].forEach(e => e(data));
        return this.functions[event].length;
    }

    off(event, func) {
        if (!this.functions || !Array.isArray(this.functions[event])) return;
        if (func) {
            const index = this.functions[event].indexOf(func);
            if (index > -1) {
                this.functions[event].splice(index, 1);
            }
        } else {
            this.functions[event] = [];
        }
    }

    removeAllListeners(event) {
        if (event) {
            if (this.functions[event]) {
                this.functions[event] = [];
            }
        } else {
            this.functions = {};
        }
    }

    listenerCount(event) {
        if (!this.functions || !Array.isArray(this.functions[event])) return 0;
        return this.functions[event].length;
    }

    eventNames() {
        if (!this.functions) return [];
        return Object.keys(this.functions);
    }

    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }

    waitFor(event) {
        return new Promise((resolve) => {
            const func = (data) => {
                this.off(event, func);
                resolve(data);
            };
            this.on(event, func);
        });
    }

    once(event, func) {
        const onceFunc = (data) => {
            this.off(event, onceFunc);
            func(data);
        };
        this.on(event, onceFunc);
    }

    onMultiple(events, func) {
        events.forEach(event => this.on(event, func));
    }

    offMultiple(events, func) {
        events.forEach(event => this.off(event, func));
    }

    clear() {
        this.functions = {};
    }

    getDebugInfo() {
        return {
            eventCount: this.eventNames().length,
            events: this.eventNames().map(event => ({
                event,
                listenerCount: this.listenerCount(event)
            }))
        };
    }
}
