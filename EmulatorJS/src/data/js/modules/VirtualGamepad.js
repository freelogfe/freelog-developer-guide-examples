/**
 * EmulatorJS - Virtual Gamepad Module
 * 虚拟手柄
 */

export class VirtualGamepad {
    constructor(emulator) {
        this.emulator = emulator;
        this.container = null;
        this.buttons = {};
        this.sticks = {};
        this.touchState = {};
        this.config = {
            opacity: 0.7,
            scale: 1.0,
            leftHanded: false,
            autoHide: false,
            hideDelay: 3000
        };
        this.isVisible = false;
        this.hideTimer = null;
        this.lastTouchTime = 0;
    }

    init() {
        this.loadConfig();
        this.createVirtualGamepad();
        this.setupEventListeners();
    }

    loadConfig() {
        // Load configuration from emulator settings
        if (this.emulator.config.VirtualGamepadSettings) {
            this.config = { ...this.config, ...this.emulator.config.VirtualGamepadSettings };
        }
        
        // Apply settings from saved preferences
        const savedOpacity = this.emulator.getSettingValue("virtualGamepadOpacity");
        if (savedOpacity !== null) {
            this.config.opacity = parseFloat(savedOpacity);
        }
        
        const savedScale = this.emulator.getSettingValue("virtualGamepadScale");
        if (savedScale !== null) {
            this.config.scale = parseFloat(savedScale);
        }
        
        const savedLeftHanded = this.emulator.getSettingValue("virtualGamepadLeftHanded");
        if (savedLeftHanded !== null) {
            this.config.leftHanded = savedLeftHanded === "true";
        }
    }

    createVirtualGamepad() {
        this.container = this.emulator.createElement("div");
        this.container.id = "ejs_virtual_gamepad";
        this.container.style.position = "absolute";
        this.container.style.bottom = "0";
        this.container.style.left = "0";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = this.config.opacity;
        this.container.style.transform = `scale(${this.config.scale})`;
        this.container.style.transformOrigin = this.config.leftHanded ? "bottom right" : "bottom left";
        this.container.style.zIndex = "10";

        if (this.config.leftHanded) {
            this.container.style.right = "0";
            this.container.style.left = "auto";
        }

        this.emulator.game.appendChild(this.container);
        this.createButtons();
        this.createSticks();
    }

    createButtons() {
        const buttonConfig = [
            { id: "dpad_up", x: 50, y: 70, size: 40, shape: "circle", label: "↑" },
            { id: "dpad_down", x: 50, y: 130, size: 40, shape: "circle", label: "↓" },
            { id: "dpad_left", x: 20, y: 100, size: 40, shape: "circle", label: "←" },
            { id: "dpad_right", x: 80, y: 100, size: 40, shape: "circle", label: "→" },
            { id: "button_a", x: 280, y: 120, size: 50, shape: "circle", label: "A" },
            { id: "button_b", x: 340, y: 90, size: 50, shape: "circle", label: "B" },
            { id: "button_x", x: 220, y: 90, size: 50, shape: "circle", label: "X" },
            { id: "button_y", x: 280, y: 60, size: 50, shape: "circle", label: "Y" },
            { id: "button_l", x: 20, y: 20, size: 35, shape: "rectangle", label: "L" },
            { id: "button_r", x: 80, y: 20, size: 35, shape: "rectangle", label: "R" },
            { id: "button_select", x: 140, y: 20, size: 30, shape: "rectangle", label: "SELECT" },
            { id: "button_start", x: 180, y: 20, size: 30, shape: "rectangle", label: "START" }
        ];

        buttonConfig.forEach(config => {
            const button = this.createButton(config);
            this.buttons[config.id] = button;
            this.container.appendChild(button);
        });
    }

    createButton(config) {
        const button = this.emulator.createElement("div");
        button.id = `ejs_${config.id}`;
        button.style.position = "absolute";
        button.style.width = `${config.size}px`;
        button.style.height = `${config.size}px`;
        button.style.left = `${config.x}px`;
        button.style.top = `${config.y}px`;
        button.style.pointerEvents = "auto";
        button.style.touchAction = "none";
        button.style.userSelect = "none";
        button.style.cursor = "pointer";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.fontSize = `${config.size * 0.4}px`;
        button.style.fontWeight = "bold";
        button.style.color = "white";
        button.style.textShadow = "1px 1px 2px rgba(0,0,0,0.8)";
        button.style.border = "2px solid rgba(255,255,255,0.3)";
        button.style.borderRadius = config.shape === "circle" ? "50%" : "8px";
        button.style.backgroundColor = "rgba(0,0,0,0.5)";
        button.style.backdropFilter = "blur(5px)";
        button.style.transition = "all 0.1s ease";

        // Add button label
        if (config.label) {
            button.innerText = config.label;
        }

        // Add touch events
        this.emulator.addEventListener(button, "touchstart", (e) => {
            e.preventDefault();
            this.onButtonPress(config.id, true);
            button.style.backgroundColor = "rgba(255,255,255,0.3)";
            button.style.transform = "scale(0.95)";
        });

        this.emulator.addEventListener(button, "touchend", (e) => {
            e.preventDefault();
            this.onButtonPress(config.id, false);
            button.style.backgroundColor = "rgba(0,0,0,0.5)";
            button.style.transform = "scale(1)";
        });

        this.emulator.addEventListener(button, "touchcancel", (e) => {
            e.preventDefault();
            this.onButtonPress(config.id, false);
            button.style.backgroundColor = "rgba(0,0,0,0.5)";
            button.style.transform = "scale(1)";
        });

        // Add mouse events for desktop testing
        this.emulator.addEventListener(button, "mousedown", (e) => {
            e.preventDefault();
            this.onButtonPress(config.id, true);
            button.style.backgroundColor = "rgba(255,255,255,0.3)";
            button.style.transform = "scale(0.95)";
        });

        this.emulator.addEventListener(button, "mouseup", (e) => {
            e.preventDefault();
            this.onButtonPress(config.id, false);
            button.style.backgroundColor = "rgba(0,0,0,0.5)";
            button.style.transform = "scale(1)";
        });

        return button;
    }

    createSticks() {
        const stickConfig = [
            { id: "left_stick", x: 120, y: 180, size: 80 },
            { id: "right_stick", x: 240, y: 180, size: 80 }
        ];

        stickConfig.forEach(config => {
            const stick = this.createStick(config);
            this.sticks[config.id] = stick;
            this.container.appendChild(stick);
        });
    }

    createStick(config) {
        const stick = this.emulator.createElement("div");
        stick.id = `ejs_${config.id}`;
        stick.style.position = "absolute";
        stick.style.width = `${config.size}px`;
        stick.style.height = `${config.size}px`;
        stick.style.left = `${config.x}px`;
        stick.style.top = `${config.y}px`;
        stick.style.pointerEvents = "auto";
        stick.style.touchAction = "none";
        stick.style.userSelect = "none";
        stick.style.cursor = "pointer";
        stick.style.border = "2px solid rgba(255,255,255,0.3)";
        stick.style.borderRadius = "50%";
        stick.style.backgroundColor = "rgba(0,0,0,0.3)";
        stick.style.backdropFilter = "blur(5px)";

        // Create stick handle
        const handle = this.emulator.createElement("div");
        handle.style.position = "absolute";
        handle.style.width = "40%";
        handle.style.height = "40%";
        handle.style.top = "30%";
        handle.style.left = "30%";
        handle.style.borderRadius = "50%";
        handle.style.backgroundColor = "rgba(255,255,255,0.8)";
        handle.style.transition = "all 0.1s ease";
        stick.appendChild(handle);

        // Store reference to handle
        stick.handle = handle;

        // Add touch events
        let isDragging = false;
        let touchId = null;
        let centerX = config.size / 2;
        let centerY = config.size / 2;

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = true;
            touchId = e.changedTouches[0].identifier;
            
            const rect = stick.getBoundingClientRect();
            const touch = e.changedTouches[0];
            centerX = touch.clientX - rect.left;
            centerY = touch.clientY - rect.top;
            
            handle.style.transform = `translate(${centerX - config.size * 0.3}px, ${centerY - config.size * 0.3}px)`;
            this.onStickMove(config.id, centerX / config.size - 0.5, centerY / config.size - 0.5);
        };

        const drag = (e) => {
            if (!isDragging || touchId === null) return;
            
            const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
            if (!touch) return;
            
            e.preventDefault();
            const rect = stick.getBoundingClientRect();
            centerX = touch.clientX - rect.left;
            centerY = touch.clientY - rect.top;
            
            // Limit stick movement
            const maxDistance = config.size * 0.3;
            const distance = Math.sqrt(Math.pow(centerX - config.size / 2, 2) + Math.pow(centerY - config.size / 2, 2));
            
            if (distance > maxDistance) {
                const angle = Math.atan2(centerY - config.size / 2, centerX - config.size / 2);
                centerX = config.size / 2 + Math.cos(angle) * maxDistance;
                centerY = config.size / 2 + Math.sin(angle) * maxDistance;
            }
            
            handle.style.transform = `translate(${centerX - config.size * 0.3}px, ${centerY - config.size * 0.3}px)`;
            this.onStickMove(config.id, centerX / config.size - 0.5, centerY / config.size - 0.5);
        };

        const endDrag = (e) => {
            if (!isDragging || touchId === null) return;
            
            const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
            if (!touch) return;
            
            e.preventDefault();
            isDragging = false;
            touchId = null;
            
            // Return to center
            handle.style.transform = "translate(0, 0)";
            this.onStickMove(config.id, 0, 0);
        };

        this.emulator.addEventListener(stick, "touchstart", startDrag);
        this.emulator.addEventListener(stick, "touchmove", drag);
        this.emulator.addEventListener(stick, "touchend", endDrag);
        this.emulator.addEventListener(stick, "touchcancel", endDrag);

        // Add mouse events for desktop testing
        let mouseIsDragging = false;

        this.emulator.addEventListener(stick, "mousedown", (e) => {
            e.preventDefault();
            mouseIsDragging = true;
            
            const rect = stick.getBoundingClientRect();
            centerX = e.clientX - rect.left;
            centerY = e.clientY - rect.top;
            
            handle.style.transform = `translate(${centerX - config.size * 0.3}px, ${centerY - config.size * 0.3}px)`;
            this.onStickMove(config.id, centerX / config.size - 0.5, centerY / config.size - 0.5);
        });

        this.emulator.addEventListener(document, "mousemove", (e) => {
            if (!mouseIsDragging) return;
            
            const rect = stick.getBoundingClientRect();
            centerX = e.clientX - rect.left;
            centerY = e.clientY - rect.top;
            
            // Limit stick movement
            const maxDistance = config.size * 0.3;
            const distance = Math.sqrt(Math.pow(centerX - config.size / 2, 2) + Math.pow(centerY - config.size / 2, 2));
            
            if (distance > maxDistance) {
                const angle = Math.atan2(centerY - config.size / 2, centerX - config.size / 2);
                centerX = config.size / 2 + Math.cos(angle) * maxDistance;
                centerY = config.size / 2 + Math.sin(angle) * maxDistance;
            }
            
            handle.style.transform = `translate(${centerX - config.size * 0.3}px, ${centerY - config.size * 0.3}px)`;
            this.onStickMove(config.id, centerX / config.size - 0.5, centerY / config.size - 0.5);
        });

        this.emulator.addEventListener(document, "mouseup", () => {
            if (!mouseIsDragging) return;
            
            mouseIsDragging = false;
            
            // Return to center
            handle.style.transform = "translate(0, 0)";
            this.onStickMove(config.id, 0, 0);
        });

        return stick;
    }

    setupEventListeners() {
        // Handle touch events to show/hide virtual gamepad
        this.emulator.addEventListener(document, "touchstart", () => {
            this.lastTouchTime = Date.now();
            if (this.emulator.hasTouchScreen && !this.isVisible) {
                this.show();
            }
            this.resetHideTimer();
        });

        // Handle visibility change
        this.emulator.addEventListener(document, "visibilitychange", () => {
            if (document.hidden) {
                this.hide();
            }
        });

        // Handle window resize
        this.emulator.addEventListener(window, "resize", () => {
            this.updateLayout();
        });
    }

    onButtonPress(buttonId, isPressed) {
        this.emulator.callEvent("virtualGamepadButton", { button: buttonId, pressed: isPressed });
        
        // Map virtual gamepad buttons to emulator inputs
        const buttonMap = {
            "dpad_up": "UP",
            "dpad_down": "DOWN",
            "dpad_left": "LEFT",
            "dpad_right": "RIGHT",
            "button_a": "BUTTON_1",
            "button_b": "BUTTON_2",
            "button_x": "BUTTON_3",
            "button_y": "BUTTON_4",
            "button_l": "LEFT_TOP_SHOULDER",
            "button_r": "RIGHT_TOP_SHOULDER",
            "button_select": "SELECT",
            "button_start": "START"
        };

        const inputKey = buttonMap[buttonId];
        if (inputKey) {
            if (isPressed) {
                this.emulator.inputManager.keyboard.state[inputKey] = true;
                this.emulator.inputManager.onKeyDown(inputKey, { virtualGamepad: true });
            } else {
                this.emulator.inputManager.keyboard.state[inputKey] = false;
                this.emulator.inputManager.onKeyUp(inputKey, { virtualGamepad: true });
            }
        }
    }

    onStickMove(stickId, x, y) {
        this.emulator.callEvent("virtualGamepadStick", { stick: stickId, x, y });
        
        // Map virtual gamepad sticks to emulator inputs
        const stickMap = {
            "left_stick": { x: "LEFT_STICK_X", y: "LEFT_STICK_Y" },
            "right_stick": { x: "RIGHT_STICK_X", y: "RIGHT_STICK_Y" }
        };

        const axes = stickMap[stickId];
        if (axes) {
            // Handle X axis
            if (x > 0.2) {
                this.emulator.inputManager.keyboard.state[axes.x + ":+1"] = true;
                this.emulator.inputManager.keyboard.state[axes.x + ":-1"] = false;
                this.emulator.inputManager.onKeyDown(axes.x + ":+1", { virtualGamepad: true, value: x });
            } else if (x < -0.2) {
                this.emulator.inputManager.keyboard.state[axes.x + ":-1"] = true;
                this.emulator.inputManager.keyboard.state[axes.x + ":+1"] = false;
                this.emulator.inputManager.onKeyDown(axes.x + ":-1", { virtualGamepad: true, value: x });
            } else {
                this.emulator.inputManager.keyboard.state[axes.x + ":+1"] = false;
                this.emulator.inputManager.keyboard.state[axes.x + ":-1"] = false;
                this.emulator.inputManager.onKeyUp(axes.x + ":+1", { virtualGamepad: true });
                this.emulator.inputManager.onKeyUp(axes.x + ":-1", { virtualGamepad: true });
            }
            
            // Handle Y axis
            if (y > 0.2) {
                this.emulator.inputManager.keyboard.state[axes.y + ":+1"] = true;
                this.emulator.inputManager.keyboard.state[axes.y + ":-1"] = false;
                this.emulator.inputManager.onKeyDown(axes.y + ":+1", { virtualGamepad: true, value: y });
            } else if (y < -0.2) {
                this.emulator.inputManager.keyboard.state[axes.y + ":-1"] = true;
                this.emulator.inputManager.keyboard.state[axes.y + ":+1"] = false;
                this.emulator.inputManager.onKeyDown(axes.y + ":-1", { virtualGamepad: true, value: y });
            } else {
                this.emulator.inputManager.keyboard.state[axes.y + ":+1"] = false;
                this.emulator.inputManager.keyboard.state[axes.y + ":-1"] = false;
                this.emulator.inputManager.onKeyUp(axes.y + ":+1", { virtualGamepad: true });
                this.emulator.inputManager.onKeyUp(axes.y + ":-1", { virtualGamepad: true });
            }
        }
    }

    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.container.style.display = "block";
            this.emulator.callEvent("virtualGamepadShown");
        }
    }

    hide() {
        if (this.isVisible) {
            this.isVisible = false;
            this.container.style.display = "none";
            this.emulator.callEvent("virtualGamepadHidden");
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    resetHideTimer() {
        if (this.config.autoHide) {
            if (this.hideTimer) {
                clearTimeout(this.hideTimer);
            }
            this.hideTimer = setTimeout(() => {
                this.hide();
            }, this.config.hideDelay);
        }
    }

    updateLayout() {
        // Update layout based on screen size and orientation
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape) {
            // Landscape layout
            this.container.style.transform = `scale(${this.config.scale})`;
        } else {
            // Portrait layout
            this.container.style.transform = `scale(${this.config.scale * 0.8})`;
        }
    }

    setOpacity(opacity) {
        this.config.opacity = Math.max(0, Math.min(1, opacity));
        this.container.style.opacity = this.config.opacity;
    }

    setScale(scale) {
        this.config.scale = Math.max(0.5, Math.min(2, scale));
        this.updateLayout();
    }

    setLeftHanded(leftHanded) {
        this.config.leftHanded = leftHanded;
        if (leftHanded) {
            this.container.style.right = "0";
            this.container.style.left = "auto";
            this.container.style.transformOrigin = "bottom right";
        } else {
            this.container.style.right = "auto";
            this.container.style.left = "0";
            this.container.style.transformOrigin = "bottom left";
        }
        this.updateLayout();
    }

    setAutoHide(autoHide) {
        this.config.autoHide = autoHide;
        if (!autoHide && this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }

    setHideDelay(delay) {
        this.config.hideDelay = Math.max(1000, delay);
    }

    isVisible() {
        return this.isVisible;
    }

    cleanup() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.buttons = {};
        this.sticks = {};
        this.touchState = {};
    }
}
