/**
 * 模拟器控制基础模块
 * 包含键盘和基本触摸事件处理
 */

class EmulatorControlsBase {
    constructor(emulator) {
        this.emulator = emulator;
        this.keys = {};
        this.buttons = {};
        this.touch = false;
        this.initBaseControls();
    }

    initBaseControls() {
        // 键盘事件监听
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // 基本触摸事件
        this.emulator.game.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.emulator.game.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.emulator.game.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    handleKeyDown(e) {
        this.keys[e.keyCode] = true;
        this.emulator.callEvent('keydown', e);
    }

    handleKeyUp(e) {
        this.keys[e.keyCode] = false;
        this.emulator.callEvent('keyup', e);
    }

    handleTouchStart(e) {
        this.touch = true;
        const touch = e.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        this.emulator.callEvent('touchstart', e);
    }

    handleTouchEnd(e) {
        this.touch = false;
        this.emulator.callEvent('touchend', e);
    }

    handleTouchMove(e) {
        if (this.touch) {
            const touch = e.touches[0];
            this.touchX = touch.clientX;
            this.touchY = touch.clientY;
            this.emulator.callEvent('touchmove', e);
        }
    }

    // 其他基础控制方法...
}

export default EmulatorControlsBase;