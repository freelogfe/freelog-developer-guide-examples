/**
 * EmulatorJS UI Manager Module
 * UI管理模块 - 处理界面创建、消息显示、本地化等功能
 */

export class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    /**
     * 设置元素
     */
    setElements(element) {
        this.emulator.elements = {};
        this.emulator.elements.parent = element;
        this.emulator.elements.game = this.emulator.createElement("div");
        this.emulator.elements.game.classList.add("ejs_game");
        this.emulator.elements.parent.appendChild(this.emulator.elements.game);
        this.emulator.game = this.emulator.elements.game;
    }

    /**
     * 创建开始按钮
     */
    createStartButton() {
        this.emulator.startButton = this.emulator.createElement("button");
        this.emulator.startButton.classList.add("ejs_start_button");
        this.emulator.startButton.innerText = this.emulator.config.startBtnName || this.emulator.localization("Start Game");
        this.emulator.startButton.onclick = (e) => this.startButtonClicked(e);
        this.emulator.elements.parent.appendChild(this.emulator.startButton);
    }

    /**
     * 开始按钮点击事件
     */
    startButtonClicked(e) {
        e.preventDefault();
        this.emulator.startButton.remove();
        this.emulator.startGame();
    }

    /**
     * 创建文本元素
     */
    createText() {
        this.emulator.textElem = this.emulator.createElement("div");
        this.emulator.textElem.classList.add("ejs_loading_text");
        if (typeof this.emulator.config.backgroundImg === "string") this.emulator.textElem.classList.add("ejs_loading_text_glow");
        this.emulator.textElem.innerText = this.emulator.localization("Loading...");
        this.emulator.elements.parent.appendChild(this.emulator.textElem);
    }

    /**
     * 本地化文本
     */
    localization(text, log) {
        if (this.emulator.config.langJson && this.emulator.config.langJson[text]) {
            return this.emulator.config.langJson[text];
        }
        if (log) {
            if (!this.emulator.missingLang.includes(text)) {
                this.emulator.missingLang.push(text);
                console.log("Missing translation:", text);
            }
        }
        return text;
    }

    /**
     * 显示消息
     */
    displayMessage(message, time = 3000) {
        const messageElem = this.emulator.createElement("div");
        messageElem.classList.add("ejs_message");
        messageElem.innerText = message;
        this.emulator.elements.parent.appendChild(messageElem);
        setTimeout(() => {
            if (messageElem.parentNode) {
                messageElem.parentNode.removeChild(messageElem);
            }
        }, time);
    }

    /**
     * 创建上下文菜单
     */
    createContextMenu() {
        this.emulator.contextMenu = this.emulator.createElement("div");
        this.emulator.contextMenu.classList.add("ejs_context_menu");
        this.emulator.contextMenu.style.display = "none";
        this.emulator.elements.parent.appendChild(this.emulator.contextMenu);
    }

    /**
     * 关闭弹窗
     */
    closePopup() {
        if (this.emulator.currentPopup) {
            this.emulator.currentPopup.remove();
            this.emulator.currentPopup = null;
        }
    }

    /**
     * 创建弹窗
     */
    createPopup(popupTitle, buttons, hidden = false) {
        this.closePopup();
        const popup = this.emulator.createElement("div");
        popup.classList.add("ejs_popup");
        if (hidden) popup.classList.add("ejs_popup_hidden");
        
        const title = this.emulator.createElement("h3");
        title.innerText = popupTitle;
        popup.appendChild(title);
        
        const buttonContainer = this.emulator.createElement("div");
        buttonContainer.classList.add("ejs_popup_buttons");
        
        buttons.forEach(button => {
            const btn = this.emulator.createElement("button");
            btn.innerText = button.text;
            btn.onclick = () => {
                if (button.callback) button.callback();
                this.closePopup();
            };
            buttonContainer.appendChild(btn);
        });
        
        popup.appendChild(buttonContainer);
        this.emulator.elements.parent.appendChild(popup);
        this.emulator.currentPopup = popup;
    }

    /**
     * 选择文件
     */
    selectFile() {
        return new Promise((resolve) => {
            const input = this.emulator.createElement("input");
            input.type = "file";
            input.accept = ".rom,.nes,.smc,.sfc,.gba,.gb,.gbc,.nds,.3ds,.cia,.cci,.cxi,.app,.bin,.iso,.img,.zip,.7z,.rar";
            input.onchange = (e) => {
                if (e.target.files.length > 0) {
                    resolve(e.target.files[0]);
                } else {
                    resolve(null);
                }
            };
            input.click();
        });
    }

    /**
     * 检查弹窗是否打开
     */
    isPopupOpen() {
        return this.emulator.currentPopup !== null;
    }

    /**
     * 检查是否为子元素
     */
    isChild(first, second) {
        return first.contains(second);
    }

    /**
     * 创建底部菜单栏
     */
    createBottomMenuBar() {
        this.emulator.menu = this.emulator.createElement("div");
        this.emulator.menu.classList.add("ejs_menu");
        this.emulator.elements.parent.appendChild(this.emulator.menu);
        
        // 创建按钮
        const buttonOptions = this.emulator.config.buttonOpts;
        for (const key in buttonOptions) {
            if (buttonOptions[key].visible) {
                const button = this.emulator.createElement("button");
                button.classList.add("ejs_button");
                button.classList.add(`ejs_button_${key}`);
                button.innerHTML = buttonOptions[key].icon;
                button.title = buttonOptions[key].displayName;
                button.onclick = () => {
                    if (buttonOptions[key].callback) {
                        buttonOptions[key].callback();
                    }
                };
                this.emulator.menu.appendChild(button);
            }
        }
    }

    /**
     * 创建链接
     */
    createLink(elem, link, text, useP = false) {
        const a = this.emulator.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        if (useP) {
            const p = this.emulator.createElement("p");
            p.appendChild(a);
            a.innerText = text;
            elem.appendChild(p);
        } else {
            a.innerText = text;
            elem.appendChild(a);
        }
    }

    /**
     * 设置广告
     */
    setupAds(ads, width, height) {
        this.emulator.adContainer = this.emulator.createElement("div");
        this.emulator.adContainer.classList.add("ejs_ad_container");
        this.emulator.adContainer.style.width = width;
        this.emulator.adContainer.style.height = height;
        this.emulator.elements.parent.appendChild(this.emulator.adContainer);
        
        const adFrame = this.emulator.createElement("iframe");
        adFrame.src = ads;
        adFrame.style.width = "100%";
        adFrame.style.height = "100%";
        adFrame.style.border = "none";
        this.emulator.adContainer.appendChild(adFrame);
    }

    /**
     * 广告被阻止
     */
    adBlocked(url, del) {
        if (this.emulator.adContainer) {
            this.emulator.adContainer.style.display = "none";
        }
        if (del) {
            this.emulator.displayMessage(this.emulator.localization("Ad blocker detected"), 5000);
        }
    }

    /**
     * 显示设置菜单
     */
    showSettings() {
        const buttons = [
            {
                text: this.emulator.localization("Volume"),
                callback: () => this.showVolumeSettings()
            },
            {
                text: this.emulator.localization("Controls"),
                callback: () => this.showControlSettings()
            },
            {
                text: this.emulator.localization("Graphics"),
                callback: () => this.showGraphicsSettings()
            },
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Settings"), buttons);
    }

    /**
     * 显示音量设置
     */
    showVolumeSettings() {
        const volumeSlider = this.emulator.createElement("input");
        volumeSlider.type = "range";
        volumeSlider.min = "0";
        volumeSlider.max = "1";
        volumeSlider.step = "0.1";
        volumeSlider.value = this.emulator.volume;
        volumeSlider.onchange = (e) => {
            this.emulator.volume = parseFloat(e.target.value);
            this.emulator.saveSettings();
        };
        
        const buttons = [
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Volume Settings"), buttons);
    }

    /**
     * 显示控制设置
     */
    showControlSettings() {
        const buttons = [
            {
                text: this.emulator.localization("Keyboard"),
                callback: () => this.showKeyboardSettings()
            },
            {
                text: this.emulator.localization("Gamepad"),
                callback: () => this.showGamepadSettings()
            },
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Control Settings"), buttons);
    }

    /**
     * 显示图形设置
     */
    showGraphicsSettings() {
        const buttons = [
            {
                text: this.emulator.localization("Shaders"),
                callback: () => this.showShaderSettings()
            },
            {
                text: this.emulator.localization("Fullscreen"),
                callback: () => this.emulator.toggleFullscreen()
            },
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Graphics Settings"), buttons);
    }

    /**
     * 显示键盘设置
     */
    showKeyboardSettings() {
        this.displayMessage(this.emulator.localization("Press keys to configure"), 3000);
        // 键盘配置逻辑
    }

    /**
     * 显示手柄设置
     */
    showGamepadSettings() {
        this.displayMessage(this.emulator.localization("Press buttons on your gamepad"), 3000);
        // 手柄配置逻辑
    }

    /**
     * 显示着色器设置
     */
    showShaderSettings() {
        const buttons = [
            {
                text: this.emulator.localization("None"),
                callback: () => this.emulator.gameManager.toggleShader(false)
            },
            {
                text: this.emulator.localization("CRT"),
                callback: () => this.emulator.gameManager.toggleShader(true)
            },
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Shader Settings"), buttons);
    }

    /**
     * 显示上下文菜单
     */
    showContextMenu() {
        const buttons = [
            {
                text: this.emulator.localization("Settings"),
                callback: () => this.showSettings()
            },
            {
                text: this.emulator.localization("Screenshot"),
                callback: () => this.emulator.screenshot()
            },
            {
                text: this.emulator.localization("Save State"),
                callback: () => this.emulator.quickSave()
            },
            {
                text: this.emulator.localization("Load State"),
                callback: () => this.emulator.quickLoad()
            },
            {
                text: this.emulator.localization("Close"),
                callback: () => {}
            }
        ];
        this.createPopup(this.emulator.localization("Context Menu"), buttons);
    }
}
