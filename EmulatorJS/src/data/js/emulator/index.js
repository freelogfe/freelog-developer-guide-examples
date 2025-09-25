import { initializeEmulator, bindListeners, handleResize, preGetSetting } from './core.js';
import { setupEventHandlers } from './events.js';
import { getCores, requiresThreads, requiresWebGL2, getCore } from './system.js';
import { downloadFile } from './network.js';

/**
 * EmulatorJS - Functional approach
 * This is a refactored version of the original EmulatorJS class
 */
export class EmulatorJS {
    constructor(element, config) {
        // Properties that need to be on the instance
        this.element = element;
        this.config = config || {};
        this.functions = {
            refresh: [],
            ready: [],
            "start-clicked": [],
            start: [],
            loadState: [],
            saveState: [],
            loadSave: [],
            saveSave: [],
            gamepadConnected: [],
            gamepadDisconnected: [],
            quit: []
        };
        this.version = "4.2.3";
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.isMobile = false; // Will be set in initializeEmulator
        this.hasTouchScreen = false; // Will be set in initializeEmulator

        // Initialize the emulator
        initializeEmulator(this);
        setupEventHandlers(this);
    }
    
    // Methods that were in the original class
    getCores() {
        return getCores(this);
    }
    
    requiresThreads(core) {
        return requiresThreads(core);
    }
    
    requiresWebGL2(core) {
        return requiresWebGL2(core);
    }
    
    getCore(generic) {
        return getCore(this, generic);
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
    
    downloadFile(path, progressCB, notWithPath, opts) {
        return downloadFile(this, path, progressCB, notWithPath, opts);
    }
    
    preGetSetting(setting) {
        return preGetSetting(this, setting);
    }
    
    bindListeners() {
        bindListeners(this);
    }
    
    handleResize() {
        handleResize(this);
    }
}

// Make it available globally like the original
window.EmulatorJS = EmulatorJS;