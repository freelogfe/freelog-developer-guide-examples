/**
 * EmulatorJS Input Manager Module
 * 处理键盘、游戏手柄、触摸等输入事件
 */

export class InputManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.gamepad = null;
        this.gamepadLabels = [];
        this.gamepadSelection = [];
        this.controls = [];
        this.keyMap = {};
        this.controlPopup = null;
        this.controlMenu = null;
    }

    /**
     * 初始化控制器变量
     */
    initControlVars() {
        this.emulator.defaultControllers = {
            0: {
                0: {
                    "value": "x",
                    "value2": "BUTTON_2"
                },
                1: {
                    "value": "s",
                    "value2": "BUTTON_4"
                },
                2: {
                    "value": "v",
                    "value2": "SELECT"
                },
                3: {
                    "value": "enter",
                    "value2": "START"
                },
                4: {
                    "value": "up arrow",
                    "value2": "DPAD_UP"
                },
                5: {
                    "value": "down arrow",
                    "value2": "DPAD_DOWN"
                },
                6: {
                    "value": "left arrow",
                    "value2": "DPAD_LEFT"
                },
                7: {
                    "value": "right arrow",
                    "value2": "DPAD_RIGHT"
                },
                8: {
                    "value": "z",
                    "value2": "BUTTON_1"
                },
                9: {
                    "value": "a",
                    "value2": "BUTTON_3"
                },
                10: {
                    "value": "q",
                    "value2": "LEFT_TOP_SHOULDER"
                },
                11: {
                    "value": "e",
                    "value2": "RIGHT_TOP_SHOULDER"
                },
                12: {
                    "value": "tab",
                    "value2": "LEFT_BOTTOM_SHOULDER"
                },
                13: {
                    "value": "r",
                    "value2": "RIGHT_BOTTOM_SHOULDER"
                },
                14: {
                    "value": "",
                    "value2": "LEFT_STICK",
                },
                15: {
                    "value": "",
                    "value2": "RIGHT_STICK",
                },
                16: {
                    "value": "h",
                    "value2": "LEFT_STICK_X:+1"
                },
                17: {
                    "value": "f",
                    "value2": "LEFT_STICK_X:-1"
                },
                18: {
                    "value": "g",
                    "value2": "LEFT_STICK_Y:+1"
                },
                19: {
                    "value": "t",
                    "value2": "LEFT_STICK_Y:-1"
                },
                20: {
                    "value": "l",
                    "value2": "RIGHT_STICK_X:+1"
                },
                21: {
                    "value": "j",
                    "value2": "RIGHT_STICK_X:-1"
                },
                22: {
                    "value": "k",
                    "value2": "RIGHT_STICK_Y:+1"
                },
                23: {
                    "value": "i",
                    "value2": "RIGHT_STICK_Y:-1"
                },
                24: {
                    "value": "1"
                },
                25: {
                    "value": "2"
                },
                26: {
                    "value": "3"
                },
                27: {},
                28: {},
                29: {},
            },
            1: {},
            2: {},
            3: {}
        }

        this.keyMap = {
            0: "",
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause/break",
            20: "caps lock",
            27: "escape",
            32: "space",
            33: "page up",
            34: "page down",
            35: "end",
            36: "home",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            45: "insert",
            46: "delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            91: "left window key",
            92: "right window key",
            93: "select key",
            96: "numpad 0",
            97: "numpad 1",
            98: "numpad 2",
            99: "numpad 3",
            100: "numpad 4",
            101: "numpad 5",
            102: "numpad 6",
            103: "numpad 7",
            104: "numpad 8",
            105: "numpad 9",
            106: "multiply",
            107: "add",
            109: "subtract",
            110: "decimal point",
            111: "divide",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "num lock",
            145: "scroll lock",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        }
    }

    /**
     * 设置虚拟游戏手柄
     */
    setVirtualGamepad() {
        if (!this.emulator.touch) return;

        this.emulator.virtualGamepad = this.emulator.createElement("div");
        this.emulator.virtualGamepad.classList.add("ejs_virtual_gamepad");

        // 创建游戏手柄布局
        const layout = this.emulator.createElement("div");
        layout.classList.add("ejs_virtual_gamepad_layout");

        // 创建DPAD
        const dpad = this.emulator.createElement("div");
        dpad.classList.add("ejs_virtual_dpad");

        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
            const button = this.emulator.createElement("div");
            button.classList.add(`ejs_virtual_dpad_${dir}`);
            button.setAttribute("data-button", `DPAD_${dir.toUpperCase()}`);
            dpad.appendChild(button);
        });

        // 创建按钮
        const buttons = this.emulator.createElement("div");
        buttons.classList.add("ejs_virtual_buttons");

        const buttonLabels = ['A', 'B', 'X', 'Y'];
        buttonLabels.forEach(label => {
            const button = this.emulator.createElement("div");
            button.classList.add(`ejs_virtual_button_${label.toLowerCase()}`);
            button.setAttribute("data-button", `BUTTON_${label === 'A' ? '1' : label === 'B' ? '2' : label === 'X' ? '3' : '4'}`);
            button.textContent = label;
            buttons.appendChild(button);
        });

        layout.appendChild(dpad);
        layout.appendChild(buttons);
        this.emulator.virtualGamepad.appendChild(layout);

        // 添加事件监听器
        this.emulator.virtualGamepad.addEventListener("touchstart", this.handleVirtualGamepad.bind(this));
        this.emulator.virtualGamepad.addEventListener("touchend", this.handleVirtualGamepad.bind(this));
        this.emulator.virtualGamepad.addEventListener("touchmove", this.handleVirtualGamepad.bind(this));

        this.emulator.elements.parent.appendChild(this.emulator.virtualGamepad);
    }

    /**
     * 处理虚拟游戏手柄事件
     */
    handleVirtualGamepad(e) {
        e.preventDefault();

        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (!element) continue;

            const buttonType = element.getAttribute("data-button");
            if (!buttonType) continue;

            const eventType = e.type === "touchstart" ? "buttondown" : "buttonup";

            // 模拟游戏手柄事件
            this.gamepadEvent({
                type: eventType,
                label: buttonType,
                gamepadIndex: 0
            });
        }
    }

    /**
     * 绑定事件监听器
     */
    bindListeners() {
        this.emulator.addEventListener(this.emulator.elements.parent, "keydown keyup", this.keyChange.bind(this));
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (document.activeElement !== this.emulator.elements.parent && this.emulator.config.noAutoFocus !== true) this.emulator.elements.parent.focus();
        })

        // 初始化游戏手柄
        this.gamepad = new GamepadHandler();
        this.gamepad.on("connected", (e) => {
            if (!this.gamepadLabels) return;
            for (let i = 0; i < this.gamepadSelection.length; i++) {
                if (this.gamepadSelection[i] === "") {
                    this.gamepadSelection[i] = this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index;
                    break;
                }
            }
            this.updateGamepadLabels();
        })

        this.gamepad.on("disconnected", (e) => {
            const gamepadIndex = this.gamepad.gamepads.indexOf(this.gamepad.gamepads.find(f => f.index == e.gamepadIndex));
            const gamepadSelection = this.gamepad.gamepads[gamepadIndex].id + "_" + this.gamepad.gamepads[gamepadIndex].index;
            for (let i = 0; i < this.gamepadSelection.length; i++) {
                if (this.gamepadSelection[i] === gamepadSelection) {
                    this.gamepadSelection[i] = "";
                }
            }
            setTimeout(this.updateGamepadLabels.bind(this), 10);
        })

        this.gamepad.on("axischanged", this.gamepadEvent.bind(this));
        this.gamepad.on("buttondown", this.gamepadEvent.bind(this));
        this.gamepad.on("buttonup", this.gamepadEvent.bind(this));
    }

    /**
     * 更新游戏手柄标签
     */
    updateGamepadLabels() {
        for (let i = 0; i < this.gamepadLabels.length; i++) {
            this.gamepadLabels[i].innerHTML = ""
            const def = this.emulator.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.gamepadLabels[i].appendChild(def);
            for (let j = 0; j < this.gamepad.gamepads.length; j++) {
                const opt = this.emulator.createElement("option");
                opt.setAttribute("value", this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index);
                opt.innerText = this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index;
                this.gamepadLabels[i].appendChild(opt);
            }
            this.gamepadLabels[i].value = this.gamepadSelection[i] || "notconnected";
        }
    }

    /**
     * 检查游戏手柄输入
     */
    checkGamepadInputs() {
        if (!this.emulator.started) return;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 30; j++) {
                if (!this.emulator.controls[i][j]) continue;

                if (this.emulator.controls[i][j].value2 !== undefined) {
                    const controlValue = this.emulator.controls[i][j].value2;

                    if (typeof controlValue === "string") {
                        if (controlValue.includes(":")) {
                            const parts = controlValue.split(":");
                            const axis = parts[0];
                            const direction = parts[1];

                            const gamepad = this.gamepad.gamepads.find(g => g.id + "_" + g.index === this.gamepadSelection[i]);
                            if (gamepad) {
                                const axisValue = gamepad.axes[parseInt(axis.split("_")[1])];

                                if ((direction === "+1" && axisValue > 0.5) ||
                                    (direction === "-1" && axisValue < -0.5)) {
                                    this.emulator.gameManager.simulateInput(i, j, direction === "+1" ? 0x7fff : -0x7fff);
                                } else if (Math.abs(axisValue) < 0.5) {
                                    this.emulator.gameManager.simulateInput(i, j, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取控制方案
     */
    getControlScheme() {
        return this.emulator.getCore(true);
    }

    /**
     * 键盘事件处理
     */
    keyChange(e) {
        if (e.repeat) return;
        if (!this.emulator.started) return;
        if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            const num = this.controlPopup.getAttribute("button-num");
            const player = this.controlPopup.getAttribute("player-num");
            if (!this.emulator.controls[player][num]) {
                this.emulator.controls[player][num] = {};
            }
            this.emulator.controls[player][num].value = e.keyCode;
            this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.checkGamepadInputs();
            this.emulator.saveSettings();
            return;
        }
        if (this.emulator.settingsMenu.style.display !== "none" || this.emulator.isPopupOpen() || this.emulator.getSettingValue("keyboardInput") === "enabled") return;
        e.preventDefault();
        const special = [16, 17, 18, 19, 20, 21, 22, 23];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 30; j++) {
                if (this.emulator.controls[i][j] && this.emulator.controls[i][j].value === e.keyCode) {
                    // NES特殊处理：将X键映射到A键，Y键映射到B键
                    let mappedButton = j;
                    if ("nes" === this.getControlScheme()) {
                        if (j === 9) { // X键映射到A键(8)
                            mappedButton = 8;
                        } else if (j === 1) { // Y键映射到B键(0)
                            mappedButton = 0;
                        }
                    }
                    this.emulator.gameManager.simulateInput(i, mappedButton, (e.type === "keyup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
                }
            }
        }
    }

    /**
     * 游戏手柄事件处理
     */
    gamepadEvent(e) {
        if (!this.emulator.started) return;
        const gamepadIndex = this.gamepadSelection.indexOf(this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index);
        if (gamepadIndex < 0) {
            return; // Gamepad not set anywhere
        }
        const value = function (value) {
            if (value > 0.5 || value < -0.5) {
                return (value > 0) ? 1 : -1;
            } else {
                return 0;
            }
        }(e.value || 0);
        if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            if ("buttonup" === e.type || (e.type === "axischanged" && value === 0)) return;
            const num = this.controlPopup.getAttribute("button-num");
            const player = parseInt(this.controlPopup.getAttribute("player-num"));
            if (gamepadIndex !== player) return;
            if (!this.emulator.controls[player][num]) {
                this.emulator.controls[player][num] = {};
            }
            this.emulator.controls[player][num].value2 = e.label;
            this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.checkGamepadInputs();
            this.emulator.saveSettings();
            return;
        }
        if (this.emulator.settingsMenu.style.display !== "none" || this.emulator.isPopupOpen()) return;
        const special = [16, 17, 18, 19, 20, 21, 22, 23];

        // NES特殊处理：将X键映射到A键，Y键映射到B键
        if ("nes" === this.getControlScheme()) {
            for (let i = 0; i < 4; i++) {
                if (gamepadIndex !== i) continue;
                for (let j = 0; j < 30; j++) {
                    if (!this.emulator.controls[i][j] || this.emulator.controls[i][j].value2 === undefined) {
                        continue;
                    }
                    const controlValue = this.emulator.controls[i][j].value2;

                    // 检查是否是X键(9)或Y键(1)
                    let mappedButton = j;
                    if (j === 9) { // X键映射到A键(8)
                        mappedButton = 8;
                    } else if (j === 1) { // Y键映射到B键(0)
                        mappedButton = 0;
                    }

                    if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                        // 处理NES的连发功能
                        if (j === 9 || j === 1) {
                            if (e.type === "buttondown") {
                                // 触发一次按键按下
                                this.emulator.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));

                                // 清除可能存在的旧定时器
                                if (this.emulator.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.emulator.controls[i][j].nesRapidFireInterval);
                                }

                                // 设置连发定时器
                                this.emulator.controls[i][j].nesRapidFireInterval = setInterval(() => {
                                    this.emulator.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));
                                    // 短暂延迟后释放按键，模拟点击效果
                                    setTimeout(() => {
                                        this.emulator.gameManager.simulateInput(i, mappedButton, 0);
                                    }, 30);
                                }, 100);
                            } else if (e.type === "buttonup") {
                                // 清除连发定时器
                                if (this.emulator.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.emulator.controls[i][j].nesRapidFireInterval);
                                    this.emulator.controls[i][j].nesRapidFireInterval = null;
                                }
                                // 触发按键释放
                                this.emulator.gameManager.simulateInput(i, mappedButton, 0);
                            }
                        } else {
                            // 非X/Y键的正常处理
                            this.emulator.gameManager.simulateInput(i, mappedButton, (e.type === "buttonup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
                        }
                    }
                }
            }
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (gamepadIndex !== i) continue;
            for (let j = 0; j < 30; j++) {
                if (!this.emulator.controls[i][j] || this.emulator.controls[i][j].value2 === undefined) {
                    continue;
                }
                const controlValue = this.emulator.controls[i][j].value2;

                if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                    this.emulator.gameManager.simulateInput(i, j, (e.type === "buttonup" ? 0 : (special.includes(j) ? 0x7fff : 1)));
                } else if (e.type === "axischanged") {
                    if (typeof controlValue === "string" && controlValue.split(":")[0] === e.axis) {
                        if (special.includes(j)) {
                            if (j === 16 || j === 17) {
                                if (e.value > 0) {
                                    this.emulator.gameManager.simulateInput(i, 16, 0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 17, 0);
                                } else {
                                    this.emulator.gameManager.simulateInput(i, 17, -0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 16, 0);
                                }
                            } else if (j === 18 || j === 19) {
                                if (e.value > 0) {
                                    this.emulator.gameManager.simulateInput(i, 18, 0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 19, 0);
                                } else {
                                    this.emulator.gameManager.simulateInput(i, 19, -0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 18, 0);
                                }
                            } else if (j === 20 || j === 21) {
                                if (e.value > 0) {
                                    this.emulator.gameManager.simulateInput(i, 20, 0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 21, 0);
                                } else {
                                    this.emulator.gameManager.simulateInput(i, 21, -0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 20, 0);
                                }
                            } else if (j === 22 || j === 23) {
                                if (e.value > 0) {
                                    this.emulator.gameManager.simulateInput(i, 22, 0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 23, 0);
                                } else {
                                    this.emulator.gameManager.simulateInput(i, 23, -0x7fff * e.value);
                                    this.emulator.gameManager.simulateInput(i, 22, 0);
                                }
                            }
                        } else {
                            this.emulator.gameManager.simulateInput(i, j, e.value * 0x7fff);
                        }
                    }
                }
            }
        }
    }
}
