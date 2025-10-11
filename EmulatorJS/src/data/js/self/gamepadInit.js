export function gamepadInit() {
    // 确保手柄选择数组已初始化
    if (!this.gamepadSelection) {
        this.gamepadSelection = [];
    }
    if (!this.controls) {
        this.controls = [];
    }
    if (!this.gamepadLabels) {
        this.gamepadLabels = [];
    }

    this.gamepad = new GamepadHandler(); //https://github.com/ethanaobrien/Gamepad
    this.gamepad.on("connected", (e) => {
        if (!this.gamepadLabels) return;
        
        // 确保手柄对象存在
        if (!this.gamepad.gamepads || !this.gamepad.gamepads[e.gamepadIndex]) {
            console.warn('Gamepad not properly initialized');
            return;
        }
        
        for (let i = 0; i < this.gamepadSelection.length; i++) {
            if (this.gamepadSelection[i] === "") {
                this.gamepadSelection[i] = this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index;
                break;
            }
        }
        this.updateGamepadLabels();
    })
    this.gamepad.on("disconnected", (e) => {
        // 确保手柄对象存在
        if (!this.gamepad.gamepads) {
            console.warn('Gamepad not properly initialized');
            return;
        }
        
        const gamepad = this.gamepad.gamepads.find(f => f && f.index === e.gamepadIndex);
        if (!gamepad) return;
        
        const gamepadIndex = this.gamepad.gamepads.indexOf(gamepad);
        if (gamepadIndex >= 0) {
            const gamepadSelection = gamepad.id + "_" + gamepad.index;
            for (let i = 0; i < this.gamepadSelection.length; i++) {
                if (this.gamepadSelection[i] === gamepadSelection) {
                    this.gamepadSelection[i] = "";
                }
            }
        }
        setTimeout(this.updateGamepadLabels.bind(this), 10);
    })
    this.gamepad.on("axischanged", this.gamepadEvent.bind(this));
    this.gamepad.on("buttondown", this.gamepadEvent.bind(this));
    this.gamepad.on("buttonup", this.gamepadEvent.bind(this));
}
