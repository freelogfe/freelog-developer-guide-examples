// Input management functions
export class InputManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

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
        this.emulator.keyMap = {
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
            186: "semi-colon",
            187: "equal sign",
            188: "comma",
            189: "dash",
            190: "period",
            191: "forward slash",
            192: "grave accent",
            219: "open bracket",
            220: "back slash",
            221: "close braket",
            222: "single quote"
        }
    }

    setupKeys() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 30; j++) {
                if (this.emulator.controls[i][j]) {
                    this.emulator.controls[i][j].value = parseInt(this.keyLookup(this.emulator.controls[i][j].value));
                    if (this.emulator.controls[i][j].value === -1 && this.emulator.debug) {
                        delete this.emulator.controls[i][j].value;
                        console.warn("Invalid key for control " + j + " player " + i);
                    }
                }
            }
        }
    }

    keyLookup(controllerkey) {
        if (controllerkey === undefined) return 0;
        if (typeof controllerkey === "number") return controllerkey;
        controllerkey = controllerkey.toString().toLowerCase()
        const values = Object.values(this.emulator.keyMap);
        if (values.includes(controllerkey)) {
            const index = values.indexOf(controllerkey);
            return Object.keys(this.emulator.keyMap)[index];
        }
        return -1;
    }

    keyChange(e) {
        if (e.repeat) return;
        if (!this.emulator.started) return;
        if (this.emulator.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            const num = this.emulator.controlPopup.getAttribute("button-num");
            const player = this.emulator.controlPopup.getAttribute("player-num");
            if (!this.emulator.controls[player][num]) {
                this.emulator.controls[player][num] = {};
            }
            this.emulator.controls[player][num].value = e.keyCode;
            this.emulator.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.emulator.checkGamepadInputs();
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
                    if ("nes" === this.emulator.getControlScheme()) {
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

    gamepadEvent(e) {
        if (!this.emulator.started) return;
        const gamepadIndex = this.emulator.gamepadSelection.indexOf(this.emulator.gamepad.gamepads[e.gamepadIndex].id + "_" + this.emulator.gamepad.gamepads[e.gamepadIndex].index);
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
        if (this.emulator.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            if ("buttonup" === e.type || (e.type === "axischanged" && value === 0)) return;
            const num = this.emulator.controlPopup.getAttribute("button-num");
            const player = parseInt(this.emulator.controlPopup.getAttribute("player-num"));
            if (gamepadIndex !== player) return;
            if (!this.emulator.controls[player][num]) {
                this.emulator.controls[player][num] = {};
            }
            this.emulator.controls[player][num].value2 = e.label;
            this.emulator.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.emulator.checkGamepadInputs();
            this.emulator.saveSettings();
            return;
        }
        if (this.emulator.settingsMenu.style.display !== "none" || this.emulator.isPopupOpen()) return;
        const special = [16, 17, 18, 19, 20, 21, 22, 23];

        // NES特殊处理：将X键映射到A键，Y键映射到B键
        if ("nes" === this.emulator.getControlScheme()) {
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
                        } else if (value === 0 || controlValue === e.label || controlValue === `${e.axis}:${value}`) {
                            this.emulator.gameManager.simulateInput(i, j, ((value === 0) ? 0 : 1));
                        }
                    }
                }
            }
        }
    }

    getControlScheme() {
        if (this.emulator.config.controlScheme && typeof this.emulator.config.controlScheme === "string") {
            return this.emulator.config.controlScheme;
        } else {
            return this.emulator.getCore(true);
        }
    }
}
