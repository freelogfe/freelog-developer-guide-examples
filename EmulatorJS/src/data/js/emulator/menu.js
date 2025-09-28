/**
 * 模拟器菜单管理模块
 */
class MenuManager {
    constructor(options) {
        // 支持两种初始化方式：直接传入emulator或通过options对象
        this.emulator = options.emulator || options;
        this.menuVisible = false;
        this.currentMenu = null;
        this.menuStack = [];
        this.menuItems = {};
        this.setup();
    }

    setup() {
        // 初始化菜单系统
        console.log('Menu manager initialized');
        this.createMenuContainer();
        this.bindMenuEvents();
    }

    // 创建菜单容器
    createMenuContainer() {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'ejs_menu_container';
        menuContainer.id = 'ejs_menu_container';
        menuContainer.style.display = 'none';
        
        // 菜单头部
        const menuHeader = document.createElement('div');
        menuHeader.className = 'ejs_menu_header';
        menuHeader.innerHTML = `<h2>${this.emulator.getLocalizedText('menu_title') || '菜单'}</h2>`;
        
        // 菜单内容区域
        const menuContent = document.createElement('div');
        menuContent.className = 'ejs_menu_content';
        menuContent.id = 'ejs_menu_content';
        
        // 菜单底部
        const menuFooter = document.createElement('div');
        menuFooter.className = 'ejs_menu_footer';
        
        // 返回按钮
        const backButton = document.createElement('button');
        backButton.className = 'ejs_menu_button ejs_menu_back';
        backButton.textContent = this.emulator.getLocalizedText('back') || '返回';
        backButton.addEventListener('click', () => this.navigateBack());
        menuFooter.appendChild(backButton);
        
        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'ejs_menu_button ejs_menu_close';
        closeButton.textContent = this.emulator.getLocalizedText('close') || '关闭';
        closeButton.addEventListener('click', () => this.hideMenu());
        menuFooter.appendChild(closeButton);
        
        // 组装菜单
        menuContainer.appendChild(menuHeader);
        menuContainer.appendChild(menuContent);
        menuContainer.appendChild(menuFooter);
        
        // 添加到模拟器元素
        this.emulator.elements.container.appendChild(menuContainer);
        
        this.menuContainer = menuContainer;
        this.menuContent = menuContent;
    }

    // 绑定菜单事件
    bindMenuEvents() {
        // 监听窗口大小变化
        this.emulator.addEventListener(window, 'resize', () => this.handleResize());
        
        // 监听键盘事件
        this.emulator.addEventListener(document, 'keydown', (e) => {
            if (this.menuVisible && e.key === 'Escape') {
                e.preventDefault();
                this.hideMenu();
            }
        });
    }

    // 显示菜单
    showMenu() {
        if (!this.menuVisible) {
            this.menuVisible = true;
            this.menuContainer.style.display = 'block';
            
            // 如果没有当前菜单，则显示主菜单
            if (!this.currentMenu) {
                this.showMainMenu();
            } else {
                this.renderCurrentMenu();
            }
            
            this.handleResize();
        }
    }

    // 隐藏菜单
    hideMenu() {
        if (this.menuVisible) {
            this.menuVisible = false;
            this.menuContainer.style.display = 'none';
            
            // 清空菜单栈，但保留主菜单引用
            this.menuStack = [];
            this.currentMenu = null;
        }
    }

    // 切换菜单显示状态
    toggleMenu() {
        if (this.menuVisible) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    // 显示主菜单
    showMainMenu() {
        const mainMenu = {
            id: 'main',
            title: this.emulator.getLocalizedText('main_menu') || '主菜单',
            items: [
                {
                    id: 'load_game',
                    text: this.emulator.getLocalizedText('load_game') || '加载游戏',
                    action: () => this.showLoadGameMenu()
                },
                {
                    id: 'save_state',
                    text: this.emulator.getLocalizedText('save_state') || '保存状态',
                    action: () => this.emulator.saveState()
                },
                {
                    id: 'load_state',
                    text: this.emulator.getLocalizedText('load_state') || '加载状态',
                    action: () => this.emulator.loadState()
                },
                {
                    id: 'settings',
                    text: this.emulator.getLocalizedText('settings') || '设置',
                    action: () => this.showSettingsMenu()
                },
                {
                    id: 'cheats',
                    text: this.emulator.getLocalizedText('cheats') || '作弊码',
                    action: () => this.showCheatsMenu()
                },
                {
                    id: 'netplay',
                    text: this.emulator.getLocalizedText('netplay') || '网络对战',
                    action: () => this.showNetplayMenu()
                },
                {
                    id: 'screenshot',
                    text: this.emulator.getLocalizedText('screenshot') || '截图',
                    action: () => this.emulator.takeScreenshot()
                },
                {
                    id: 'record',
                    text: this.emulator.getLocalizedText('record') || '录屏',
                    action: () => this.toggleRecording()
                },
                {
                    id: 'reset',
                    text: this.emulator.getLocalizedText('reset') || '重置',
                    action: () => this.emulator.reset()
                },
                {
                    id: 'fullscreen',
                    text: this.emulator.getLocalizedText('fullscreen') || '全屏',
                    action: () => this.toggleFullscreen()
                }
            ]
        };
        
        this.setCurrentMenu(mainMenu);
    }

    // 显示设置菜单
    showSettingsMenu() {
        const settingsMenu = {
            id: 'settings',
            title: this.emulator.getLocalizedText('settings') || '设置',
            items: [
                {
                    id: 'graphics',
                    text: this.emulator.getLocalizedText('graphics') || '图形设置',
                    action: () => this.showGraphicsMenu()
                },
                {
                    id: 'audio',
                    text: this.emulator.getLocalizedText('audio') || '音频设置',
                    action: () => this.showAudioMenu()
                },
                {
                    id: 'input',
                    text: this.emulator.getLocalizedText('input') || '输入设置',
                    action: () => this.showInputMenu()
                },
                {
                    id: 'gamepad',
                    text: this.emulator.getLocalizedText('virtual_gamepad') || '虚拟手柄',
                    action: () => this.showGamepadMenu()
                },
                {
                    id: 'speed',
                    text: this.emulator.getLocalizedText('speed_options') || '速度选项',
                    action: () => this.showSpeedMenu()
                },
                {
                    id: 'cores',
                    text: this.emulator.getLocalizedText('cores') || '核心设置',
                    action: () => this.showCoresMenu()
                }
            ]
        };
        
        this.pushMenu(settingsMenu);
    }

    // 显示图形设置菜单
    showGraphicsMenu() {
        const graphicsMenu = {
            id: 'graphics',
            title: this.emulator.getLocalizedText('graphics') || '图形设置',
            items: [
                {
                    id: 'shader',
                    text: this.emulator.getLocalizedText('shader') || '着色器',
                    type: 'select',
                    options: this.getShaderOptions(),
                    value: this.emulator.settings.shader,
                    action: (value) => {
                        this.emulator.settings.shader = value;
                        this.emulator.saveSettings();
                        if (value) {
                            this.emulator.enableShader(value);
                        }
                    }
                },
                {
                    id: 'aspect_ratio',
                    text: this.emulator.getLocalizedText('aspect_ratio') || '宽高比',
                    type: 'toggle',
                    value: this.emulator.settings.aspectRatio !== 0,
                    action: (value) => {
                        this.emulator.settings.aspectRatio = value ? 1 : 0;
                        this.emulator.saveSettings();
                        this.emulator.handleResize();
                    }
                },
                {
                    id: 'rotation',
                    text: this.emulator.getLocalizedText('rotation') || '旋转',
                    type: 'select',
                    options: [
                        { label: '0°', value: 0 },
                        { label: '90°', value: 90 },
                        { label: '180°', value: 180 },
                        { label: '270°', value: 270 }
                    ],
                    value: this.emulator.settings.rotation,
                    action: (value) => {
                        this.emulator.settings.rotation = value;
                        this.emulator.saveSettings();
                        this.emulator.handleResize();
                    }
                }
            ]
        };
        
        this.pushMenu(graphicsMenu);
    }

    // 显示音频设置菜单
    showAudioMenu() {
        const audioMenu = {
            id: 'audio',
            title: this.emulator.getLocalizedText('audio') || '音频设置',
            items: [
                // 可以添加音量控制、静音等选项
            ]
        };
        
        this.pushMenu(audioMenu);
    }

    // 显示输入设置菜单
    showInputMenu() {
        const inputMenu = {
            id: 'input',
            title: this.emulator.getLocalizedText('input') || '输入设置',
            items: [
                {
                    id: 'direct_keyboard',
                    text: this.emulator.getLocalizedText('direct_keyboard_input') || '直接键盘输入',
                    type: 'toggle',
                    value: this.emulator.settings.directKeyboardInput,
                    action: (value) => {
                        this.emulator.settings.directKeyboardInput = value;
                        this.emulator.saveSettings();
                    }
                },
                {
                    id: 'alt_key_forward',
                    text: this.emulator.getLocalizedText('alt_key_forward') || 'Alt键转发',
                    type: 'toggle',
                    value: this.emulator.settings.altKeyForward,
                    action: (value) => {
                        this.emulator.settings.altKeyForward = value;
                        this.emulator.saveSettings();
                    }
                }
            ]
        };
        
        this.pushMenu(inputMenu);
    }

    // 显示虚拟手柄设置菜单
    showGamepadMenu() {
        const gamepadMenu = {
            id: 'gamepad',
            title: this.emulator.getLocalizedText('virtual_gamepad') || '虚拟手柄',
            items: [
                {
                    id: 'enable_gamepad',
                    text: this.emulator.getLocalizedText('enable_virtual_gamepad') || '启用虚拟手柄',
                    type: 'toggle',
                    value: this.emulator.settings.gamepad,
                    action: (value) => {
                        this.emulator.settings.gamepad = value;
                        this.emulator.saveSettings();
                        if (value) {
                            this.emulator.gamepadController.createVirtualGamepad(this.emulator.platform);
                        } else {
                            this.emulator.gamepadController.removeVirtualGamepad();
                        }
                    }
                },
                {
                    id: 'left_handed',
                    text: this.emulator.getLocalizedText('left_handed') || '左手模式',
                    type: 'toggle',
                    value: this.emulator.settings.gamepadLeftHanded,
                    action: (value) => {
                        this.emulator.settings.gamepadLeftHanded = value;
                        this.emulator.saveSettings();
                        this.emulator.gamepadController.toggleLeftHanded(value);
                    }
                }
            ]
        };
        
        this.pushMenu(gamepadMenu);
    }

    // 显示速度选项菜单
    showSpeedMenu() {
        const speedMenu = {
            id: 'speed',
            title: this.emulator.getLocalizedText('speed_options') || '速度选项',
            items: [
                {
                    id: 'fast_forward',
                    text: this.emulator.getLocalizedText('fast_forward') || '快进',
                    type: 'toggle',
                    value: this.emulator.settings.fastForward,
                    action: (value) => {
                        this.emulator.settings.fastForward = value;
                        this.emulator.saveSettings();
                        // 实现快进逻辑
                    }
                },
                {
                    id: 'slow_motion',
                    text: this.emulator.getLocalizedText('slow_motion') || '慢动作',
                    type: 'toggle',
                    value: this.emulator.settings.slowMotion,
                    action: (value) => {
                        this.emulator.settings.slowMotion = value;
                        this.emulator.saveSettings();
                        // 实现慢动作逻辑
                    }
                }
            ]
        };
        
        this.pushMenu(speedMenu);
    }

    // 显示核心设置菜单
    showCoresMenu() {
        const coresMenu = {
            id: 'cores',
            title: this.emulator.getLocalizedText('cores') || '核心设置',
            items: [
                // 可以添加核心选择、线程设置等选项
            ]
        };
        
        this.pushMenu(coresMenu);
    }

    // 显示加载游戏菜单
    showLoadGameMenu() {
        const loadGameMenu = {
            id: 'load_game',
            title: this.emulator.getLocalizedText('load_game') || '加载游戏',
            items: [
                // 可以添加游戏列表、上传游戏等选项
            ]
        };
        
        this.pushMenu(loadGameMenu);
    }

    // 显示作弊码菜单
    showCheatsMenu() {
        const cheatsMenu = {
            id: 'cheats',
            title: this.emulator.getLocalizedText('cheats') || '作弊码',
            items: [
                // 可以添加作弊码列表、添加作弊码等选项
            ]
        };
        
        this.pushMenu(cheatsMenu);
    }

    // 显示网络对战菜单
    showNetplayMenu() {
        const netplayMenu = {
            id: 'netplay',
            title: this.emulator.getLocalizedText('netplay') || '网络对战',
            items: [
                // 可以添加房间列表、创建房间、加入房间等选项
            ]
        };
        
        this.pushMenu(netplayMenu);
    }

    // 设置当前菜单
    setCurrentMenu(menu) {
        this.currentMenu = menu;
        this.menuStack = [];
        this.renderCurrentMenu();
    }

    // 推入新菜单到栈中
    pushMenu(menu) {
        if (this.currentMenu) {
            this.menuStack.push(this.currentMenu);
        }
        this.currentMenu = menu;
        this.renderCurrentMenu();
    }

    // 返回上一级菜单
    navigateBack() {
        if (this.menuStack.length > 0) {
            this.currentMenu = this.menuStack.pop();
            this.renderCurrentMenu();
        } else {
            // 如果已经是主菜单，则关闭菜单
            this.hideMenu();
        }
    }

    // 渲染当前菜单
    renderCurrentMenu() {
        if (!this.currentMenu) return;
        
        // 清空菜单内容
        this.menuContent.innerHTML = '';
        
        // 更新菜单标题
        const menuTitle = this.menuContainer.querySelector('.ejs_menu_header h2');
        if (menuTitle) {
            menuTitle.textContent = this.currentMenu.title;
        }
        
        // 创建菜单项
        if (this.currentMenu.items && this.currentMenu.items.length > 0) {
            this.currentMenu.items.forEach(item => {
                const menuItem = this.createMenuItem(item);
                this.menuContent.appendChild(menuItem);
            });
        }
    }

    // 创建菜单项
    createMenuItem(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'ejs_menu_item';
        
        if (item.type === 'toggle') {
            // 创建开关类型的菜单项
            menuItem.innerHTML = `
                <label class="ejs_menu_label">${item.text}</label>
                <label class="ejs_menu_toggle">
                    <input type="checkbox" ${item.value ? 'checked' : ''} data-id="${item.id}">
                    <span class="ejs_menu_toggle_slider"></span>
                </label>
            `;
            
            const checkbox = menuItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                if (item.action) {
                    item.action(e.target.checked);
                }
            });
        } else if (item.type === 'select') {
            // 创建选择类型的菜单项
            let optionsHtml = '';
            item.options.forEach(option => {
                const selected = option.value === item.value ? 'selected' : '';
                optionsHtml += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
            
            menuItem.innerHTML = `
                <label class="ejs_menu_label">${item.text}</label>
                <select class="ejs_menu_select" data-id="${item.id}">
                    ${optionsHtml}
                </select>
            `;
            
            const select = menuItem.querySelector('select');
            select.addEventListener('change', (e) => {
                if (item.action) {
                    item.action(e.target.value);
                }
            });
        } else {
            // 创建普通按钮类型的菜单项
            menuItem.innerHTML = `<span class="ejs_menu_label">${item.text}</span>`;
            menuItem.addEventListener('click', () => {
                if (item.action) {
                    item.action();
                }
            });
        }
        
        return menuItem;
    }

    // 获取着色器选项
    getShaderOptions() {
        // 这里应该从shaders.js中获取可用的着色器列表
        return [
            { label: '无', value: '' },
            { label: 'CRT', value: 'crt' },
            { label: 'Scanlines', value: 'scanlines' },
            { label: 'Curvature', value: 'curvature' }
        ];
    }

    // 切换录屏状态
    toggleRecording() {
        if (this.emulator.recorder) {
            this.emulator.recorder.stop();
            this.emulator.recorder = null;
        } else {
            this.emulator.recorder = this.emulator.screenRecord();
        }
    }

    // 切换全屏状态
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.emulator.elements.parent.requestFullscreen) {
                this.emulator.elements.parent.requestFullscreen();
            } else if (this.emulator.elements.parent.webkitRequestFullscreen) {
                this.emulator.elements.parent.webkitRequestFullscreen();
            } else if (this.emulator.elements.parent.msRequestFullscreen) {
                this.emulator.elements.parent.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // 处理窗口大小变化
    handleResize() {
        if (!this.menuVisible) return;
        
        // 调整菜单大小以适应屏幕
        const positionInfo = this.emulator.elements.parent.getBoundingClientRect();
        this.menuContainer.classList.toggle('ejs_small_screen', positionInfo.width <= 575);
        this.menuContainer.classList.toggle('ejs_big_screen', positionInfo.width > 575);
    }

    // 添加菜单项到指定菜单
    addToMenu(menuId, item) {
        // 查找指定的菜单
        let targetMenu = null;
        
        if (this.currentMenu && this.currentMenu.id === menuId) {
            targetMenu = this.currentMenu;
        } else {
            for (const menu of this.menuStack) {
                if (menu.id === menuId) {
                    targetMenu = menu;
                    break;
                }
            }
        }
        
        // 添加菜单项
        if (targetMenu && targetMenu.items) {
            targetMenu.items.push(item);
            
            // 如果是当前菜单，则重新渲染
            if (targetMenu === this.currentMenu) {
                this.renderCurrentMenu();
            }
        }
    }

    // 更新菜单项
    updateMenuItem(menuId, itemId, updates) {
        // 查找指定的菜单和菜单项
        let targetMenuItem = null;
        let targetMenu = null;
        
        // 检查当前菜单
        if (this.currentMenu && this.currentMenu.id === menuId) {
            targetMenu = this.currentMenu;
            targetMenuItem = targetMenu.items.find(item => item.id === itemId);
        }
        
        // 如果当前菜单中没有找到，检查菜单栈
        if (!targetMenuItem) {
            for (const menu of this.menuStack) {
                if (menu.id === menuId) {
                    targetMenu = menu;
                    targetMenuItem = targetMenu.items.find(item => item.id === itemId);
                    break;
                }
            }
        }
        
        // 更新菜单项
        if (targetMenuItem) {
            Object.assign(targetMenuItem, updates);
            
            // 如果是当前菜单，则重新渲染
            if (targetMenu === this.currentMenu) {
                this.renderCurrentMenu();
            }
        }
    }
}

// 导出模块
export default MenuManager;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.MenuManager = MenuManager;
}