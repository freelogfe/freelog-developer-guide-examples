/**
 * 控制管理模块
 * 负责处理游戏控制、键盘和手柄输入
 */
class ControlManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.initControlVars();
        this.bindKeyboardListeners();
    }

    initControlVars() {
        this.controls = JSON.parse(JSON.stringify(this.emulator.defaultControllers));
        this.gamepadLabels = [];
        this.gamepadSelection = [];
        this.keys = {};
        this.keyChange = (e) => {
            const key = e.key;
            const value = (e.type === "keydown") ? 1 : 0;
            if (this.keys[key] !== value) {
                this.keys[key] = value;
                for (let i = 0; i < 4; i++) {
                    if (!this.controls[i].keyboard) continue;
                    for (let j in this.controls[i].keyboard.keyMap) {
                        if (this.controls[i].keyboard.keyMap[j] === key) {
                            this.emulator.gameManager.Module._EJS_SetControllerButtonValue(i, j, value);
                            break;
                        }
                    }
                }
            }
        };
    }

    bindKeyboardListeners() {
        // 键盘事件监听
        this.emulator.addEventListener(this.emulator.elements.parent, "keydown keyup", this.keyChange);

        // 防止默认按键行为
        const preventDefault = (e) => {
            if (e.ctrlKey || e.metaKey) return;
            for (let i = 0; i < 4; i++) {
                if (!this.controls[i].keyboard) continue;
                for (let j in this.controls[i].keyboard.keyMap) {
                    if (this.controls[i].keyboard.keyMap[j] === e.key) {
                        e.preventDefault();
                        return;
                    }
                }
            }
        };

        this.emulator.addEventListener(window, "keydown", preventDefault);
        this.emulator.addEventListener(window, "keyup", preventDefault);
    }

    gamepadEvent(e) {
        const gamepadIndex = e.gamepad.index;
        const controllerIndex = this.gamepadSelection.indexOf(this.emulator.gamepad.gamepads[gamepadIndex].id + "_" + gamepadIndex);
        if (controllerIndex === -1) return;

        const controller = controllerIndex;
        const value = (e.type === "buttondown") ? 1 : 0;
        const button = e.button;

        for (let i in this.controls[controller].gamepad.buttonMap) {
            if (this.controls[controller].gamepad.buttonMap[i] === button) {
                this.emulator.gameManager.Module._EJS_SetControllerButtonValue(controller, i, value);
                break;
            }
        }
    }

    setupKeys() {
        // 设置键盘控制
        for (let i = 0; i < 4; i++) {
            if (!this.controls[i]) continue;
            const body = this.emulator.controlMenu.querySelector(`.ejs_control_body[data-controller="${i}"]`);
            if (!body) continue;

            // 设置键盘按键
            const keyboardDiv = body.querySelector(".ejs_keyboard_controls");
            if (keyboardDiv) {
                keyboardDiv.innerHTML = "";
                for (let j in this.controls[i].keyboard.keyMap) {
                    const div = this.emulator.createElement("div");
                    div.classList.add("ejs_control_button");
                    div.innerHTML = `<div>${this.emulator.localization(j)}</div>`;
                    const key = this.emulator.createElement("div");
                    key.classList.add("ejs_control_key");
                    key.innerHTML = this.controls[i].keyboard.keyMap[j];
                    div.appendChild(key);
                    keyboardDiv.appendChild(div);
                }
            }

            // 设置游戏手柄按键
            const gamepadDiv = body.querySelector(".ejs_gamepad_controls");
            if (gamepadDiv) {
                gamepadDiv.innerHTML = "";
                for (let j in this.controls[i].gamepad.buttonMap) {
                    const div = this.emulator.createElement("div");
                    div.classList.add("ejs_control_button");
                    div.innerHTML = `<div>${this.emulator.localization(j)}</div>`;
                    const key = this.emulator.createElement("div");
                    key.classList.add("ejs_control_key");
                    key.innerHTML = this.controls[i].gamepad.buttonMap[j];
                    div.appendChild(key);
                    gamepadDiv.appendChild(div);
                }
            }
        }
    }

    updateGamepadLabels() {
        for (let i = 0; i < this.gamepadLabels.length; i++) {
            this.gamepadLabels[i].innerHTML = "";
            const def = this.emulator.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.gamepadLabels[i].appendChild(def);

            for (let j = 0; j < this.emulator.gamepad.gamepads.length; j++) {
                const opt = this.emulator.createElement("option");
                opt.setAttribute("value", this.emulator.gamepad.gamepads[j].id + "_" + this.emulator.gamepad.gamepads[j].index);
                opt.innerText = this.emulator.gamepad.gamepads[j].id + "_" + this.emulator.gamepad.gamepads[j].index;
                this.gamepadLabels[i].appendChild(opt);
            }

            this.gamepadLabels[i].value = this.gamepadSelection[i] || "notconnected";
        }
    }
}
