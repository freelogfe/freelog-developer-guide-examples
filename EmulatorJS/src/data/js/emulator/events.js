/**
 * Event handling for EmulatorJS
 */

export function setupEventHandlers(EJS) {
    // Event handling functions
    EJS.on = function (event, callback) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) this.functions[event] = [];
        this.functions[event].push(callback);
    };

    EJS.off = function (event, callback) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return;
        if (callback) {
            const index = this.functions[event].indexOf(callback);
            if (index !== -1) {
                this.functions[event].splice(index, 1);
            }
        } else {
            this.functions[event] = [];
        }
    };

    EJS.trigger = function (event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return;
        for (let i = 0; i < this.functions[event].length; i++) {
            this.functions[event][i](data);
        }
    };
    
    EJS.callEvent = function (event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return 0;
        this.functions[event].forEach(e => e(data));
        return this.functions[event].length;
    };
}