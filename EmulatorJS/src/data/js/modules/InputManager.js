/**
 * EmulatorJS - Input Manager Module
 * 输入管理
 */

export class InputManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.keyboard = {
            state: {},
            listeners: {}
        };
        this.gamepad = {
            state: {},
            listeners: {},
            connected: []
        };
        this.mouse = {
            state: {},
            listeners: {},
            locked: false
        };
        this.touch = {
            state: {},
            listeners: {}
        };
        this.inputMap = {};
        this.activeDevices = new Set();
    }

    init() {
        this.setupKeyboardEvents();
        this.setupGamepadEvents();
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.loadInputMappings();
    }

    setupKeyboardEvents() {
        this.addEventListener(document, "keydown", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            const key = this.emulator.keyMap[e.keyCode];
            if (key && !this.keyboard.state[key]) {
                this.keyboard.state[key] = true;
                this.onKeyDown(key, e);
                this.emulator.callEvent("keydown", { key, event: e });
            }
        });

        this.addEventListener(document, "keyup", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            const key = this.emulator.keyMap[e.keyCode];
            if (key && this.keyboard.state[key]) {
                this.keyboard.state[key] = false;
                this.onKeyUp(key, e);
                this.emulator.callEvent("keyup", { key, event: e });
            }
        });
    }

    setupGamepadEvents() {
        const handleGamepadConnected = (e) => {
            console.log("Gamepad connected:", e.gamepad.id);
            this.gamepad.connected.push(e.gamepad);
            this.activeDevices.add("gamepad");
            this.emulator.callEvent("gamepadConnected", { gamepad: e.gamepad });
        };

        const handleGamepadDisconnected = (e) => {
            console.log("Gamepad disconnected:", e.gamepad.id);
            const index = this.gamepad.connected.findIndex(g => g.id === e.gamepad.id);
            if (index !== -1) {
                this.gamepad.connected.splice(index, 1);
            }
            if (this.gamepad.connected.length === 0) {
                this.activeDevices.delete("gamepad");
            }
            this.emulator.callEvent("gamepadDisconnected", { gamepad: e.gamepad });
        };

        this.addEventListener(window, "gamepadconnected", handleGamepadConnected);
        this.addEventListener(window, "gamepaddisconnected", handleGamepadDisconnected);

        // Start polling gamepads
        this.startGamepadPolling();
    }

    startGamepadPolling() {
        const pollGamepads = () => {
            const gamepads = navigator.getGamepads();
            
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad && gamepad.connected) {
                    this.processGamepad(gamepad);
                }
            }
            
            requestAnimationFrame(pollGamepads);
        };
        
        requestAnimationFrame(pollGamepads);
    }

    processGamepad(gamepad) {
        // Process button states
        for (let i = 0; i < gamepad.buttons.length; i++) {
            const button = gamepad.buttons[i];
            const buttonName = this.getGamepadButtonName(i);
            
            if (buttonName) {
                const wasPressed = this.gamepad.state[buttonName];
                const isPressed = button.pressed;
                
                if (isPressed && !wasPressed) {
                    this.gamepad.state[buttonName] = true;
                    this.onGamepadButtonDown(buttonName, gamepad);
                    this.emulator.callEvent("gamepadButtonDown", { button: buttonName, gamepad });
                } else if (!isPressed && wasPressed) {
                    this.gamepad.state[buttonName] = false;
                    this.onGamepadButtonUp(buttonName, gamepad);
                    this.emulator.callEvent("gamepadButtonUp", { button: buttonName, gamepad });
                }
            }
        }

        // Process analog sticks
        const axes = gamepad.axes;
        
        // Left stick
        if (axes.length >= 2) {
            const leftX = this.normalizeAxis(axes[0]);
            const leftY = this.normalizeAxis(axes[1]);
            
            this.onGamepadAxisMove("left", leftX, leftY, gamepad);
            this.emulator.callEvent("gamepadAxisMove", { stick: "left", x: leftX, y: leftY, gamepad });
        }

        // Right stick
        if (axes.length >= 4) {
            const rightX = this.normalizeAxis(axes[2]);
            const rightY = this.normalizeAxis(axes[3]);
            
            this.onGamepadAxisMove("right", rightX, rightY, gamepad);
            this.emulator.callEvent("gamepadAxisMove", { stick: "right", x: rightX, y: rightY, gamepad });
        }

        // Triggers
        if (axes.length >= 6) {
            const leftTrigger = this.normalizeAxis(axes[4]);
            const rightTrigger = this.normalizeAxis(axes[5]);
            
            this.onGamepadTriggerMove("left", leftTrigger, gamepad);
            this.onGamepadTriggerMove("right", rightTrigger, gamepad);
            this.emulator.callEvent("gamepadTriggerMove", { trigger: "left", value: leftTrigger, gamepad });
            this.emulator.callEvent("gamepadTriggerMove", { trigger: "right", value: rightTrigger, gamepad });
        }
    }

    normalizeAxis(value) {
        // Normalize axis value to -1 to 1 range
        const deadzone = 0.1;
        if (Math.abs(value) < deadzone) {
            return 0;
        }
        return value;
    }

    getGamepadButtonName(index) {
        const buttonMap = {
            0: "BUTTON_1",
            1: "BUTTON_2",
            2: "BUTTON_3",
            3: "BUTTON_4",
            4: "BUTTON_5",
            5: "BUTTON_6",
            6: "BUTTON_7",
            7: "BUTTON_8",
            8: "BUTTON_9",
            9: "BUTTON_10",
            10: "BUTTON_11",
            11: "BUTTON_12",
            12: "BUTTON_13",
            13: "BUTTON_14",
            14: "BUTTON_15",
            15: "BUTTON_16",
            16: "BUTTON_17"
        };
        return buttonMap[index] || null;
    }

    setupMouseEvents() {
        this.addEventListener(this.emulator.canvas, "mousedown", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            if (this.mouse.locked) {
                this.onMouseMove(e.movementX, e.movementY);
            } else {
                const rect = this.emulator.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.onMouseDown(x, y, e.button);
                this.emulator.callEvent("mousedown", { x, y, button: e.button });
            }
        });

        this.addEventListener(this.emulator.canvas, "mouseup", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            if (!this.mouse.locked) {
                const rect = this.emulator.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.onMouseUp(x, y, e.button);
                this.emulator.callEvent("mouseup", { x, y, button: e.button });
            }
        });

        this.addEventListener(this.emulator.canvas, "mousemove", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            if (this.mouse.locked) {
                this.onMouseMove(e.movementX, e.movementY);
            } else {
                const rect = this.emulator.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.onMouseMove(x, y);
                this.emulator.callEvent("mousemove", { x, y });
            }
        });

        this.addEventListener(this.emulator.canvas, "wheel", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            this.onMouseWheel(delta);
            this.emulator.callEvent("mousewheel", { delta });
        });

        // Handle pointer lock
        this.addEventListener(this.emulator.canvas, "click", () => {
            if (this.emulator.config.lockMouse && !this.mouse.locked) {
                this.requestPointerLock();
            }
        });

        this.addEventListener(document, "pointerlockchange", () => {
            this.mouse.locked = document.pointerLockElement === this.emulator.canvas;
            this.emulator.callEvent("pointerLockChange", { locked: this.mouse.locked });
        });
    }

    setupTouchEvents() {
        this.addEventListener(this.emulator.canvas, "touchstart", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            e.preventDefault();
            const rect = this.emulator.canvas.getBoundingClientRect();
            
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.touch.state[touch.identifier] = { x, y, active: true };
                this.onTouchStart(touch.identifier, x, y);
                this.emulator.callEvent("touchstart", { id: touch.identifier, x, y });
            }
        });

        this.addEventListener(this.emulator.canvas, "touchmove", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            e.preventDefault();
            const rect = this.emulator.canvas.getBoundingClientRect();
            
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.touch.state[touch.identifier] = { x, y, active: true };
                this.onTouchMove(touch.identifier, x, y);
                this.emulator.callEvent("touchmove", { id: touch.identifier, x, y });
            }
        });

        this.addEventListener(this.emulator.canvas, "touchend", (e) => {
            if (this.emulator.isPopupOpen()) return;
            
            e.preventDefault();
            
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                this.touch.state[touch.identifier] = { active: false };
                this.onTouchEnd(touch.identifier);
                this.emulator.callEvent("touchend", { id: touch.identifier });
            }
        });
    }

    requestPointerLock() {
        this.emulator.canvas.requestPointerLock().catch(err => {
            console.warn("Failed to request pointer lock:", err);
        });
    }

    exitPointerLock() {
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }

    loadInputMappings() {
        // Load input mappings from configuration
        if (this.emulator.config.inputMap) {
            this.inputMap = { ...this.inputMap, ...this.emulator.config.inputMap };
        }
    }

    setInputMapping(device, mapping) {
        this.inputMap[device] = mapping;
    }

    getInputMapping(device) {
        return this.inputMap[device] || {};
    }

    // Event handlers (to be overridden by emulator)
    onKeyDown(key, event) {}
    onKeyUp(key, event) {}
    onGamepadButtonDown(button, gamepad) {}
    onGamepadButtonUp(button, gamepad) {}
    onGamepadAxisMove(stick, x, y, gamepad) {}
    onGamepadTriggerMove(trigger, value, gamepad) {}
    onMouseDown(x, y, button) {}
    onMouseUp(x, y, button) {}
    onMouseMove(x, y) {}
    onMouseWheel(delta) {}
    onTouchStart(id, x, y) {}
    onTouchMove(id, x, y) {}
    onTouchEnd(id) {}

    // Utility methods
    isKeyPressed(key) {
        return !!this.keyboard.state[key];
    }

    isGamepadButtonPressed(button) {
        return !!this.gamepad.state[button];
    }

    isMouseButtonDown(button) {
        return !!this.mouse.state[`button_${button}`];
    }

    isTouchActive(id) {
        return !!this.touch.state[id]?.active;
    }

    getActiveDevices() {
        return Array.from(this.activeDevices);
    }

    hasActiveDevice(device) {
        return this.activeDevices.has(device);
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

    cleanup() {
        // Clean up event listeners and state
        this.keyboard.state = {};
        this.gamepad.state = {};
        this.mouse.state = {};
        this.touch.state = {};
        this.activeDevices.clear();
        
        if (this.mouse.locked) {
            this.exitPointerLock();
        }
    }
}
