/**
 * EmulatorJS Input Manager Module
 * 输入管理模块 - 处理键盘、手柄、虚拟控制器等输入功能
 */

export class InputManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    /**
     * 初始化控制器变量
     */
    initControlVars() {
        this.emulator.controllers = {};
        this.emulator.keyMap = {};
        this.emulator.gamepadMap = {};
        this.emulator.virtualGamepad = null;
        this.emulator.gamepadConnected = false;
        this.emulator.gamepadIndex = -1;
        
        // 默认控制器映射
        this.emulator.defaultControllers = {
            "nes": {
                "A": "KeyZ",
                "B": "KeyX",
                "Select": "KeyS",
                "Start": "KeyA",
                "Up": "ArrowUp",
                "Down": "ArrowDown",
                "Left": "ArrowLeft",
                "Right": "ArrowRight"
            },
            "snes": {
                "A": "KeyZ",
                "B": "KeyX",
                "X": "KeyA",
                "Y": "KeyS",
                "L": "KeyQ",
                "R": "KeyW",
                "Select": "KeyS",
                "Start": "KeyA",
                "Up": "ArrowUp",
                "Down": "ArrowDown",
                "Left": "ArrowLeft",
                "Right": "ArrowRight"
            },
            "gba": {
                "A": "KeyZ",
                "B": "KeyX",
                "L": "KeyQ",
                "R": "KeyW",
                "Select": "KeyS",
                "Start": "KeyA",
                "Up": "ArrowUp",
                "Down": "ArrowDown",
                "Left": "ArrowLeft",
                "Right": "ArrowRight"
            }
        };

        // 默认手柄映射
        this.emulator.defaultGamepadMap = {
            "A": 0,
            "B": 1,
            "X": 2,
            "Y": 3,
            "L": 4,
            "R": 5,
            "Select": 8,
            "Start": 9,
            "Up": 12,
            "Down": 13,
            "Left": 14,
            "Right": 15
        };
    }

    /**
     * 键盘事件处理
     */
    keyChange(e) {
        if (this.emulator.paused || !this.emulator.started) return;
        
        const key = e.code;
        const pressed = e.type === "keydown";
        
        // 处理特殊键
        if (key === "F11") {
            e.preventDefault();
            this.emulator.toggleFullscreen();
            return;
        }
        
        if (key === "Escape") {
            e.preventDefault();
            this.emulator.togglePause();
            return;
        }
        
        // 处理游戏按键
        for (const button in this.emulator.keyMap) {
            if (this.emulator.keyMap[button] === key) {
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), pressed ? 1 : 0);
            }
        }
    }

    /**
     * 手柄事件处理
     */
    gamepadEvent(e) {
        if (this.emulator.paused || !this.emulator.started) return;
        
        const gamepad = navigator.getGamepads()[e.gamepad.index];
        if (!gamepad) return;
        
        this.emulator.gamepadConnected = true;
        this.emulator.gamepadIndex = e.gamepad.index;
        
        // 处理手柄按键
        for (const button in this.emulator.gamepadMap) {
            const buttonIndex = this.emulator.gamepadMap[button];
            if (gamepad.buttons[buttonIndex]) {
                const pressed = gamepad.buttons[buttonIndex].pressed;
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), pressed ? 1 : 0);
            }
        }
        
        // 处理方向键
        if (gamepad.axes[0] < -0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 1);
        } else if (gamepad.axes[0] > 0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 1);
        } else {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 0);
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 0);
        }
        
        if (gamepad.axes[1] < -0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 1);
        } else if (gamepad.axes[1] > 0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 1);
        } else {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 0);
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 0);
        }
    }

    /**
     * 检查手柄输入
     */
    checkGamepadInputs() {
        if (!this.emulator.gamepadConnected) return;
        
        const gamepad = navigator.getGamepads()[this.emulator.gamepadIndex];
        if (!gamepad) {
            this.emulator.gamepadConnected = false;
            this.emulator.gamepadIndex = -1;
            return;
        }
        
        // 处理手柄按键
        for (const button in this.emulator.gamepadMap) {
            const buttonIndex = this.emulator.gamepadMap[button];
            if (gamepad.buttons[buttonIndex]) {
                const pressed = gamepad.buttons[buttonIndex].pressed;
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), pressed ? 1 : 0);
            }
        }
        
        // 处理方向键
        if (gamepad.axes[0] < -0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 1);
        } else if (gamepad.axes[0] > 0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 1);
        } else {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 0);
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 0);
        }
        
        if (gamepad.axes[1] < -0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 1);
        } else if (gamepad.axes[1] > 0.5) {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 1);
        } else {
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 0);
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 0);
        }
    }

    /**
     * 设置虚拟手柄
     */
    setVirtualGamepad() {
        if (!this.emulator.config.VirtualGamepadSettings) return;
        
        this.emulator.virtualGamepad = this.emulator.createElement("div");
        this.emulator.virtualGamepad.classList.add("ejs_virtual_gamepad");
        this.emulator.elements.parent.appendChild(this.emulator.virtualGamepad);
        
        // 创建虚拟手柄按钮
        const buttons = ["A", "B", "X", "Y", "L", "R", "Select", "Start", "Up", "Down", "Left", "Right"];
        buttons.forEach(button => {
            const btn = this.emulator.createElement("button");
            btn.classList.add("ejs_virtual_button");
            btn.classList.add(`ejs_virtual_button_${button.toLowerCase()}`);
            btn.innerText = button;
            btn.onmousedown = () => {
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), 1);
            };
            btn.onmouseup = () => {
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), 0);
            };
            btn.ontouchstart = (e) => {
                e.preventDefault();
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), 1);
            };
            btn.ontouchend = (e) => {
                e.preventDefault();
                this.emulator.gameManager.simulateInput(0, this.getButtonCode(button), 0);
            };
            this.emulator.virtualGamepad.appendChild(btn);
        });
    }

    /**
     * 更新手柄标签
     */
    updateGamepadLabels() {
        if (!this.emulator.virtualGamepad) return;
        
        const buttons = this.emulator.virtualGamepad.querySelectorAll(".ejs_virtual_button");
        buttons.forEach(button => {
            const buttonName = button.classList[1].replace("ejs_virtual_button_", "").toUpperCase();
            button.innerText = this.emulator.localization(buttonName);
        });
    }

    /**
     * 获取按钮代码
     */
    getButtonCode(button) {
        const buttonCodes = {
            "A": 0,
            "B": 1,
            "X": 2,
            "Y": 3,
            "L": 4,
            "R": 5,
            "Select": 6,
            "Start": 7,
            "Up": 8,
            "Down": 9,
            "Left": 10,
            "Right": 11
        };
        return buttonCodes[button] || 0;
    }

    /**
     * 设置键盘映射
     */
    setKeyMap() {
        const core = this.emulator.getCore(true);
        const controllerMap = this.emulator.defaultControllers[core] || this.emulator.defaultControllers["nes"];
        
        this.emulator.keyMap = {};
        for (const button in controllerMap) {
            this.emulator.keyMap[button] = controllerMap[button];
        }
    }

    /**
     * 设置手柄映射
     */
    setGamepadMap() {
        this.emulator.gamepadMap = { ...this.emulator.defaultGamepadMap };
    }

    /**
     * 添加事件监听器
     */
    addEventListeners() {
        // 键盘事件
        this.emulator.addEventListener(document, "keydown", (e) => this.keyChange(e));
        this.emulator.addEventListener(document, "keyup", (e) => this.keyChange(e));
        
        // 手柄事件
        this.emulator.addEventListener(window, "gamepadconnected", (e) => this.gamepadEvent(e));
        this.emulator.addEventListener(window, "gamepaddisconnected", (e) => this.gamepadEvent(e));
        
        // 触摸事件
        if (this.emulator.hasTouchScreen) {
            this.emulator.addEventListener(this.emulator.game, "touchstart", (e) => e.preventDefault());
            this.emulator.addEventListener(this.emulator.game, "touchend", (e) => e.preventDefault());
        }
    }

    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        if (this.emulator.eventListeners) {
            this.emulator.removeEventListener(this.emulator.eventListeners);
            this.emulator.eventListeners = [];
        }
    }

    /**
     * 处理触摸输入
     */
    handleTouchInput(e) {
        if (this.emulator.paused || !this.emulator.started) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.emulator.game.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // 处理触摸区域
        const width = rect.width;
        const height = rect.height;
        
        if (x < width / 2 && y < height / 2) {
            // 左上角 - 左
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 1);
        } else if (x > width / 2 && y < height / 2) {
            // 右上角 - 右
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 1);
        } else if (x < width / 2 && y > height / 2) {
            // 左下角 - 下
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 1);
        } else if (x > width / 2 && y > height / 2) {
            // 右下角 - 上
            this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 1);
        }
    }

    /**
     * 处理触摸结束
     */
    handleTouchEnd(e) {
        if (this.emulator.paused || !this.emulator.started) return;
        
        e.preventDefault();
        // 释放所有方向键
        this.emulator.gameManager.simulateInput(0, this.getButtonCode("Left"), 0);
        this.emulator.gameManager.simulateInput(0, this.getButtonCode("Right"), 0);
        this.emulator.gameManager.simulateInput(0, this.getButtonCode("Up"), 0);
        this.emulator.gameManager.simulateInput(0, this.getButtonCode("Down"), 0);
    }

    /**
     * 初始化输入系统
     */
    initInputSystem() {
        this.setKeyMap();
        this.setGamepadMap();
        this.addEventListeners();
        
        if (this.emulator.hasTouchScreen) {
            this.setVirtualGamepad();
        }
        
        // 开始游戏手柄检测循环
        this.startGamepadLoop();
    }

    /**
     * 开始手柄检测循环
     */
    startGamepadLoop() {
        const gamepadLoop = () => {
            this.checkGamepadInputs();
            if (this.emulator.started) {
                requestAnimationFrame(gamepadLoop);
            }
        };
        gamepadLoop();
    }

    /**
     * 停止输入系统
     */
    stopInputSystem() {
        this.removeEventListeners();
        if (this.emulator.virtualGamepad) {
            this.emulator.virtualGamepad.remove();
            this.emulator.virtualGamepad = null;
        }
    }
}
