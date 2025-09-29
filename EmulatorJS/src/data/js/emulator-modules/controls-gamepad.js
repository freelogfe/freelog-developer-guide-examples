/**
 * 模拟器手柄控制模块
 * 包含游戏手柄事件处理
 */

class EmulatorGamepadControls {
    constructor(emulator) {
        this.emulator = emulator;
        this.gamepad = null;
        this.gamepadIndex = -1;
        this.initGamepadControls();
    }

    initGamepadControls() {
        window.addEventListener("gamepadconnected", (e) => {
            this.gamepad = e.gamepad;
            this.gamepadIndex = e.gamepad.index;
            this.emulator.callEvent('gamepadconnected', e);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.gamepad = null;
                this.gamepadIndex = -1;
                this.emulator.callEvent('gamepaddisconnected', e);
            }
        });
    }

    pollGamepad() {
        if (!this.gamepad) return;
        
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return;

        // 手柄按钮状态检查
        gamepad.buttons.forEach((button, index) => {
            if (button.pressed !== this.emulator.controls.gamepadButtons[index]) {
                this.emulator.controls.gamepadButtons[index] = button.pressed;
                this.emulator.callEvent(button.pressed ? 'gamepadbuttondown' : 'gamepadbuttonup', {
                    button: index,
                    value: button.value
                });
            }
        });

        // 手柄摇杆状态检查
        gamepad.axes.forEach((axis, index) => {
            if (Math.abs(axis - this.emulator.controls.gamepadAxes[index]) > 0.1) {
                this.emulator.controls.gamepadAxes[index] = axis;
                this.emulator.callEvent('gamepadaxismove', {
                    axis: index,
                    value: axis
                });
            }
        });
    }
}

export default EmulatorGamepadControls;