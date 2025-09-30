/**
 * 游戏手柄管理模块
 * 负责处理游戏手柄的连接、输入和配置
 */
class GamepadManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.gamepad = new GamepadHandler(); //https://github.com/ethanaobrien/Gamepad
        this.gamepadLabels = [];
        this.gamepadSelection = [];
        this.setupGamepadListeners();
    }

    setupGamepadListeners() {
        this.gamepad.on("connected", (e) => {
            if (!this.emulator.gamepadLabels) return;
            for (let i = 0; i < this.emulator.gamepadSelection.length; i++) {
                if (this.emulator.gamepadSelection[i] === "") {
                    this.emulator.gamepadSelection[i] = this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index;
                    break;
                }
            }
            this.emulator.updateGamepadLabels();
        })
        this.gamepad.on("disconnected", (e) => {
            const gamepadIndex = this.gamepad.gamepads.indexOf(this.gamepad.gamepads.find(f => f.index == e.gamepadIndex));
            const gamepadSelection = this.gamepad.gamepads[gamepadIndex].id + "_" + this.gamepad.gamepads[gamepadIndex].index;
            for (let i = 0; i < this.emulator.gamepadSelection.length; i++) {
                if (this.emulator.gamepadSelection[i] === gamepadSelection) {
                    this.emulator.gamepadSelection[i] = "";
                }
            }
            setTimeout(this.emulator.updateGamepadLabels.bind(this.emulator), 10);
        })
        this.gamepad.on("axischanged", this.emulator.gamepadEvent.bind(this.emulator));
        this.gamepad.on("buttondown", this.emulator.gamepadEvent.bind(this.emulator));
        this.gamepad.on("buttonup", this.emulator.gamepadEvent.bind(this.emulator));
    }

    updateGamepadLabels() {
        for (let i = 0; i < this.emulator.gamepadLabels.length; i++) {
            this.emulator.gamepadLabels[i].innerHTML = ""
            const def = this.emulator.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.emulator.gamepadLabels[i].appendChild(def);
            for (let j = 0; j < this.gamepad.gamepads.length; j++) {
                const opt = this.emulator.createElement("option");
                opt.setAttribute("value", this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index);
                opt.innerText = this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index;
                this.emulator.gamepadLabels[i].appendChild(opt);
            }
            this.emulator.gamepadLabels[i].value = this.emulator.gamepadSelection[i] || "notconnected";
        }
    }
}
