/**
 * 模拟器控制模块
 * 包含所有输入控制相关代码
 */

class EmulatorControls {
    constructor(emulator) {
        this.emulator = emulator;
        this.keyMap = {};
        this.gamepadMap = {};
        this.gamepadIndex = null;
        this.gamepadPoll = null;
        this.initControls();
    }

    initControls() {
        this.setupKeyMap();
        this.setupGamepad();
        this.bindEvents();
    }

    setupKeyMap() {
        this.keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'KeyZ': 'a',
            'KeyX': 'b',
            'Enter': 'start',
            'Space': 'select'
        };
    }

    setupGamepad() {
        window.addEventListener("gamepadconnected", (e) => {
            this.gamepadIndex = e.gamepad.index;
            console.log("Gamepad connected:", e.gamepad.id);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            if (this.gamepadIndex === e.gamepad.index) {
                this.gamepadIndex = null;
                console.log("Gamepad disconnected:", e.gamepad.id);
            }
        });
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        this.gamepadPoll = setInterval(() => {
            if (this.gamepadIndex !== null) {
                this.pollGamepad();
            }
        }, 16);
    }

    handleKeyDown(e) {
        const action = this.keyMap[e.code];
        if (action) {
            e.preventDefault();
            this.emulator.callEvent('input', { type: 'keyboard', action, state: 'down' });
        }
    }

    handleKeyUp(e) {
        const action = this.keyMap[e.code];
        if (action) {
            e.preventDefault();
            this.emulator.callEvent('input', { type: 'keyboard', action, state: 'up' });
        }
    }

    pollGamepad() {
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return;

        gamepad.buttons.forEach((button, index) => {
            if (button.pressed) {
                const action = this.gamepadMap[index] || `button_${index}`;
                this.emulator.callEvent('input', { type: 'gamepad', action, state: 'down' });
            }
        });

        if (Math.abs(gamepad.axes[0]) > 0.5 || Math.abs(gamepad.axes[1]) > 0.5) {
            this.emulator.callEvent('input', {
                type: 'gamepad',
                action: 'axis',
                x: gamepad.axes[0],
                y: gamepad.axes[1]
            });
        }
    }

    unbind() {
        clearInterval(this.gamepadPoll);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    bindListeners() {
        this.emulator.addEventListener(this.emulator.elements.parent, "click", () => {
            if (this.emulator.fullscreen && this.emulator.enableMouseLock) {
                this.emulator.elements.parent.requestPointerLock = this.emulator.elements.parent.requestPointerLock || this.emulator.elements.parent.mozRequestPointerLock || this.emulator.elements.parent.webkitRequestPointerLock;
                this.emulator.elements.parent.requestPointerLock();
            }
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "fullscreenchange", () => {
            this.emulator.fullscreen = (document.fullscreenElement === this.emulator.elements.parent);
            if (!this.emulator.fullscreen) {
                document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
                document.exitPointerLock();
            }
        });

        this.emulator.addEventListener(document, "pointerlockchange", () => {
            this.emulator.enableMouseLock = (document.pointerLockElement === this.emulator.elements.parent);
        });

        this.emulator.addEventListener(document, "mozpointerlockchange", () => {
            this.emulator.enableMouseLock = (document.mozPointerLockElement === this.emulator.elements.parent);
        });

        this.emulator.addEventListener(document, "webkitpointerlockchange", () => {
            this.emulator.enableMouseLock = (document.webkitPointerLockElement === this.emulator.elements.parent);
        });

        this.emulator.addEventListener(window, "resize", () => {
            this.emulator.handleResize();
        });

        this.emulator.addEventListener(window, "orientationchange", () => {
            this.emulator.handleResize();
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "contextmenu", (e) => {
            if (this.emulator.started && this.emulator.config.disableContextMenu) {
                e.preventDefault();
            }
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "touchstart", () => {
            this.emulator.touch = true;
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown", () => {
            this.emulator.touch = false;
        });

        this.emulator.addEventListener(this.emulator.elements.parent, "keydown", (e) => {
            if (e.key === "Escape" && this.emulator.fullscreen) {
                document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
                document.exitFullscreen();
            }
        });

        // 其他事件监听...
    }

    // 其他控制方法...
}

export default EmulatorControls;