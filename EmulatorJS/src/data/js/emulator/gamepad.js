/**
 * 虚拟游戏手柄功能模块
 */
class GamepadController {
    constructor(options) {
        // 支持两种初始化方式：直接传入emulator或通过options对象
        this.emulator = options.emulator || options;
        this.gamepads = {};
        this.leftHanded = false;
        this.showMenuButton = true;
        this.nippleInstances = {};
        this.dpads = {};
        this.buttons = {};
        this.joysticks = {};
        this.setup();
    }

    setup() {
        // 初始化虚拟手柄设置
        this.loadSettings();
        console.log('Gamepad controller initialized');
    }

    // 加载游戏手柄设置
    loadSettings() {
        const settings = this.emulator.getSettings('gamepad');
        if (settings) {
            this.leftHanded = settings.leftHanded || false;
            this.showMenuButton = settings.showMenuButton !== false;
        }
    }

    // 保存游戏手柄设置
    saveSettings() {
        this.emulator.saveSettings('gamepad', {
            leftHanded: this.leftHanded,
            showMenuButton: this.showMenuButton
        });
    }

    // 创建虚拟手柄
    createVirtualGamepad(platform) {
        console.log(`Creating virtual gamepad for platform: ${platform}`);
        this.removeVirtualGamepad(); // 先移除已存在的手柄
        
        const container = document.createElement('div');
        container.className = 'ejs_gamepad_container';
        container.id = 'ejs_gamepad_container';
        
        // 根据平台创建不同的手柄布局
        const layout = this.getGamepadLayout(platform);
        
        // 创建方向键区域
        this.createDpad(container, layout.dpad);
        
        // 创建动作按钮区域
        this.createButtons(container, layout.buttons);
        
        // 创建摇杆（如果需要）
        if (layout.joysticks) {
            this.createJoysticks(container, layout.joysticks);
        }
        
        // 创建菜单按钮
        if (this.showMenuButton) {
            this.createMenuButton(container);
        }
        
        // 添加到模拟器元素
        this.emulator.elements.container.appendChild(container);
        
        // 应用左手模式
        if (this.leftHanded) {
            this.toggleLeftHanded(true);
        }
        
        // 监听窗口大小变化
        this.emulator.addEventListener(window, 'resize', () => {
            this.handleResize();
        });
    }

    // 获取指定平台的手柄布局
    getGamepadLayout(platform) {
        const layouts = {
            nes: {
                dpad: {
                    x: 0.05,
                    y: 0.65,
                    size: 0.25
                },
                buttons: [
                    { type: 'button', text: 'A', id: 'ejs_button_a', x: 0.75, y: 0.7, size: 0.15, value: 'a' },
                    { type: 'button', text: 'B', id: 'ejs_button_b', x: 0.6, y: 0.8, size: 0.15, value: 'b' },
                    { type: 'button', text: 'Select', id: 'ejs_button_select', x: 0.35, y: 0.85, size: 0.1, value: 'select' },
                    { type: 'button', text: 'Start', id: 'ejs_button_start', x: 0.48, y: 0.85, size: 0.1, value: 'start' }
                ]
            },
            snes: {
                dpad: {
                    x: 0.05,
                    y: 0.65,
                    size: 0.25
                },
                buttons: [
                    { type: 'button', text: 'A', id: 'ejs_button_a', x: 0.75, y: 0.7, size: 0.12, value: 'a' },
                    { type: 'button', text: 'B', id: 'ejs_button_b', x: 0.62, y: 0.77, size: 0.12, value: 'b' },
                    { type: 'button', text: 'X', id: 'ejs_button_x', x: 0.62, y: 0.63, size: 0.12, value: 'x' },
                    { type: 'button', text: 'Y', id: 'ejs_button_y', x: 0.49, y: 0.7, size: 0.12, value: 'y' },
                    { type: 'button', text: 'L', id: 'ejs_button_l', x: 0.1, y: 0.45, size: 0.2, value: 'l' },
                    { type: 'button', text: 'R', id: 'ejs_button_r', x: 0.7, y: 0.45, size: 0.2, value: 'r' },
                    { type: 'button', text: 'Select', id: 'ejs_button_select', x: 0.35, y: 0.85, size: 0.1, value: 'select' },
                    { type: 'button', text: 'Start', id: 'ejs_button_start', x: 0.48, y: 0.85, size: 0.1, value: 'start' }
                ]
            },
            // 可以根据需要添加更多平台的布局
            default: {
                dpad: {
                    x: 0.05,
                    y: 0.65,
                    size: 0.25
                },
                buttons: [
                    { type: 'button', text: 'A', id: 'ejs_button_a', x: 0.75, y: 0.7, size: 0.15, value: 'a' },
                    { type: 'button', text: 'B', id: 'ejs_button_b', x: 0.6, y: 0.8, size: 0.15, value: 'b' }
                ]
            }
        };
        
        return layouts[platform] || layouts.default;
    }

    // 创建方向键区域
    createDpad(container, dpadConfig) {
        const dpad = document.createElement('div');
        dpad.className = 'ejs_dpad';
        dpad.id = 'ejs_dpad';
        
        // 设置样式
        dpad.style.position = 'absolute';
        dpad.style.width = `${dpadConfig.size * 100}%`;
        dpad.style.height = `${dpadConfig.size * 100}%`;
        dpad.style.left = `${dpadConfig.x * 100}%`;
        dpad.style.top = `${dpadConfig.y * 100}%`;
        dpad.style.touchAction = 'none';
        
        // 添加方向按钮
        const directions = ['up', 'right', 'down', 'left'];
        directions.forEach(dir => {
            const button = document.createElement('div');
            button.className = `ejs_dpad_${dir}`;
            button.id = `ejs_dpad_${dir}`;
            button.dataset.direction = dir;
            dpad.appendChild(button);
        });
        
        container.appendChild(dpad);
        this.dpads.main = dpad;
        
        // 添加触摸事件
        this.bindDpadEvents(dpad);
    }

    // 创建动作按钮
    createButtons(container, buttonsConfig) {
        buttonsConfig.forEach(button => {
            const btn = document.createElement('div');
            btn.className = 'ejs_button';
            btn.id = button.id;
            btn.textContent = button.text;
            btn.dataset.value = button.value;
            
            // 设置样式
            btn.style.position = 'absolute';
            btn.style.width = `${button.size * 100}%`;
            btn.style.height = `${button.size * 100}%`;
            btn.style.left = `${button.x * 100}%`;
            btn.style.top = `${button.y * 100}%`;
            btn.style.touchAction = 'none';
            
            container.appendChild(btn);
            this.buttons[button.id] = btn;
            
            // 添加触摸事件
            this.bindButtonEvents(btn, button.value);
        });
    }

    // 创建摇杆
    createJoysticks(container, joysticksConfig) {
        joysticksConfig.forEach(joystick => {
            const joyContainer = document.createElement('div');
            joyContainer.className = 'ejs_joystick_container';
            joyContainer.id = joystick.id;
            
            // 设置样式
            joyContainer.style.position = 'absolute';
            joyContainer.style.width = `${joystick.size * 100}%`;
            joyContainer.style.height = `${joystick.size * 100}%`;
            joyContainer.style.left = `${joystick.x * 100}%`;
            joyContainer.style.top = `${joystick.y * 100}%`;
            
            container.appendChild(joyContainer);
            
            // 使用nipplejs创建摇杆
            if (window.nipplejs) {
                const nipple = window.nipplejs.create({
                    zone: joyContainer,
                    mode: 'dynamic',
                    position: { left: '50%', top: '50%' },
                    color: 'rgba(255, 255, 255, 0.5)'
                });
                
                this.nippleInstances[joystick.id] = nipple;
                this.bindJoystickEvents(nipple, joystick);
            }
        });
    }

    // 创建菜单按钮
    createMenuButton(container) {
        const menuBtn = document.createElement('div');
        menuBtn.className = 'ejs_menu_button';
        menuBtn.id = 'ejs_menu_button';
        menuBtn.textContent = '≡';
        
        // 设置样式
        menuBtn.style.position = 'absolute';
        menuBtn.style.width = '10%';
        menuBtn.style.height = '10%';
        menuBtn.style.right = '5%';
        menuBtn.style.top = '5%';
        menuBtn.style.touchAction = 'none';
        
        container.appendChild(menuBtn);
        this.buttons.menu = menuBtn;
        
        // 添加点击事件
        menuBtn.addEventListener('click', () => {
            this.emulator.toggleMenu();
        });
    }

    // 绑定方向键事件
    bindDpadEvents(dpad) {
        let touches = {};
        let directions = {};
        
        const handleTouchStart = (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (target && target.classList.contains('ejs_dpad') || 
                target && target.parentElement && target.parentElement.classList.contains('ejs_dpad')) {
                touches[touch.identifier] = touch;
                this.updateDpadDirections();
            }
        };
        
        const handleTouchMove = (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touches[touch.identifier]) {
                    touches[touch.identifier] = touch;
                }
            }
            this.updateDpadDirections();
        };
        
        const handleTouchEnd = (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                delete touches[touch.identifier];
            }
            this.updateDpadDirections();
        };
        
        dpad.addEventListener('touchstart', handleTouchStart);
        dpad.addEventListener('touchmove', handleTouchMove);
        dpad.addEventListener('touchend', handleTouchEnd);
        dpad.addEventListener('touchcancel', handleTouchEnd);
        
        this.dpadTouchHandlers = { start: handleTouchStart, move: handleTouchMove, end: handleTouchEnd };
    }

    // 更新方向键方向
    updateDpadDirections() {
        // 实现方向计算逻辑
        // 这里简化实现，实际逻辑应根据触摸位置计算方向
    }

    // 绑定按钮事件
    bindButtonEvents(button, value) {
        const handleButtonDown = () => {
            button.classList.add('ejs_button_pressed');
            this.emulator.simulateInput(value, true);
        };
        
        const handleButtonUp = () => {
            button.classList.remove('ejs_button_pressed');
            this.emulator.simulateInput(value, false);
        };
        
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleButtonDown();
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleButtonUp();
        });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            handleButtonUp();
        });
        
        // 添加鼠标支持
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleButtonDown();
        });
        
        document.addEventListener('mouseup', (e) => {
            handleButtonUp();
        });
    }

    // 绑定摇杆事件
    bindJoystickEvents(nipple, joystick) {
        nipple.on('move', (evt, data) => {
            const angle = data.angle.degree;
            const distance = data.distance;
            
            // 计算X和Y轴的输入值（-1到1）
            const x = Math.cos(angle * Math.PI / 180) * (distance / 50);
            const y = Math.sin(angle * Math.PI / 180) * (distance / 50);
            
            // 发送摇杆输入到模拟器
            this.emulator.simulateJoystickInput(joystick.id, x, y);
        });
        
        nipple.on('end', () => {
            // 摇杆回到中心位置
            this.emulator.simulateJoystickInput(joystick.id, 0, 0);
        });
    }

    // 切换左手模式
    toggleLeftHanded(enable) {
        if (typeof enable === 'undefined') {
            this.leftHanded = !this.leftHanded;
        } else {
            this.leftHanded = enable;
        }
        
        const container = document.getElementById('ejs_gamepad_container');
        if (container) {
            container.classList.toggle('ejs_left_handed', this.leftHanded);
        }
        
        this.saveSettings();
    }

    // 处理窗口大小变化
    handleResize() {
        const container = document.getElementById('ejs_gamepad_container');
        if (container) {
            const isSmallScreen = this.emulator.elements.parent.classList.contains('ejs_small_screen');
            container.classList.toggle('ejs_small_screen', isSmallScreen);
        }
    }

    // 移除虚拟手柄
    removeVirtualGamepad() {
        const container = document.getElementById('ejs_gamepad_container');
        if (container) {
            container.remove();
        }
        
        // 清理nipple.js实例
        for (const id in this.nippleInstances) {
            if (this.nippleInstances[id]) {
                this.nippleInstances[id].destroy();
            }
        }
        
        this.nippleInstances = {};
        this.dpads = {};
        this.buttons = {};
        this.joysticks = {};
    }

    // 显示或隐藏虚拟手柄
    toggleVisibility(show) {
        const container = document.getElementById('ejs_gamepad_container');
        if (container) {
            container.style.display = show ? 'block' : 'none';
        }
    }
}

// 导出模块
export default GamepadController;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.GamepadController = GamepadController;
}