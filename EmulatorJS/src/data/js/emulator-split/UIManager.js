/**
 * 用户界面管理模块
 * 负责管理模拟器的各种UI元素和交互
 */
export class UIManager {
    constructor(emulator) {
        this.emulator = emulator;
        // 初始化事件监听器
        this.mousemoveListener = null;
        // 这些函数现在在 VirtualGamepad 中实现
        // 不再需要在 UIManager 中直接调用
    }

    createContextMenu() {
        this.emulator.elements.contextmenu = this.emulator.createElement("div");
        this.emulator.elements.contextmenu.classList.add("ejs_context_menu");
        this.emulator.addEventListener(this.emulator.game, "contextmenu", (e) => {
            e.preventDefault();
            if ((this.emulator.config.buttonOpts && this.emulator.config.buttonOpts.rightClick === false) || !this.emulator.started) return;
            const parentRect = this.emulator.elements.parent.getBoundingClientRect();
            this.emulator.elements.contextmenu.style.display = "block";
            const rect = this.emulator.elements.contextmenu.getBoundingClientRect();
            const up = e.offsetY + rect.height > parentRect.height - 25;
            const left = e.offsetX + rect.width > parentRect.width - 5;
            this.emulator.elements.contextmenu.style.left = (e.offsetX - (left ? rect.width : 0)) + "px";
            this.emulator.elements.contextmenu.style.top = (e.offsetY - (up ? rect.height : 0)) + "px";
        })
        const hideMenu = () => {
            this.emulator.elements.contextmenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.contextmenu, "contextmenu", (e) => e.preventDefault());
        this.emulator.addEventListener(this.emulator.elements.parent, "contextmenu", (e) => e.preventDefault());
        this.emulator.addEventListener(this.emulator.game, "mousedown touchend", hideMenu);
        const parent = this.emulator.createElement("ul");
        const addButton = (title, hidden, functi0n) => {
            const li = this.emulator.createElement("li");
            if (hidden) li.hidden = true;
            const a = this.emulator.createElement("a");
            if (functi0n instanceof Function) {
                this.emulator.addEventListener(li, "click", (e) => {
                    e.preventDefault();
                    functi0n();
                });
            }
            a.href = "#";
            a.onclick = "return false";
            a.innerText = this.emulator.localization(title);
            li.appendChild(a);
            parent.appendChild(li);
            hideMenu();
            return li;
        }
        
        // 添加截图功能
        let screenshotUrl;
        const screenshot = addButton("Take Screenshot", false, () => {
            if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
            const date = new Date();
            const fileName = this.emulator.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
            this.emulator.screenshot((blob, format) => {
                screenshotUrl = URL.createObjectURL(blob);
                const a = this.emulator.createElement("a");
                a.href = screenshotUrl;
                a.download = fileName + "." + format;
                a.click();
                hideMenu();
            });
        });

        // 添加屏幕录制功能
        let screenMediaRecorder = null;
        const startScreenRecording = addButton("Start Screen Recording", false, () => {
            if (screenMediaRecorder !== null) {
                screenMediaRecorder.stop();
            }
            screenMediaRecorder = this.emulator.screenRecord();
            startScreenRecording.setAttribute("hidden", "hidden");
            stopScreenRecording.removeAttribute("hidden");
            hideMenu();
        });
        const stopScreenRecording = addButton("Stop Screen Recording", true, () => {
            if (screenMediaRecorder !== null) {
                screenMediaRecorder.stop();
                screenMediaRecorder = null;
            }
            startScreenRecording.removeAttribute("hidden");
            stopScreenRecording.setAttribute("hidden", "hidden");
            hideMenu();
        });

        // 添加快速保存和加载功能
        const qSave = addButton("Quick Save", false, () => {
            const slot = this.emulator.getSettingValue("save-state-slot") ? this.emulator.getSettingValue("save-state-slot") : "1";
            if (this.emulator.gameManager.quickSave(slot)) {
                this.emulator.displayMessage(this.emulator.localization("SAVED STATE TO SLOT") + " " + slot);
            } else {
                this.emulator.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
            }
            hideMenu();
        });
        const qLoad = addButton("Quick Load", false, () => {
            const slot = this.emulator.getSettingValue("save-state-slot") ? this.emulator.getSettingValue("save-state-slot") : "1";
            this.emulator.gameManager.quickLoad(slot);
            this.emulator.displayMessage(this.emulator.localization("LOADED STATE FROM SLOT") + " " + slot);
            hideMenu();
        });

        this.emulator.elements.contextMenu = {
            screenshot: screenshot,
            startScreenRecording: startScreenRecording,
            stopScreenRecording: stopScreenRecording,
            save: qSave,
            load: qLoad
        }

        // 添加版本信息
        addButton("EmulatorJS v" + this.emulator.ejs_version, false, () => {
            hideMenu();
            const body = this.emulator.createPopup("EmulatorJS", {
                "Close": () => {
                    this.emulator.closePopup();
                }
            });
            body.style.display = "flex";
            const menu = this.emulator.createElement("div");
            body.appendChild(menu);
            menu.classList.add("ejs_list_selector");
            const parent = this.emulator.createElement("ul");
            const addButton = (title, hidden, functi0n) => {
                const li = this.emulator.createElement("li");
                if (hidden) li.hidden = true;
                const a = this.emulator.createElement("a");
                if (functi0n instanceof Function) {
                    this.emulator.addEventListener(li, "click", (e) => {
                        e.preventDefault();
                        functi0n(li);
                    });
                }
                a.href = "#";
                a.onclick = "return false";
                a.innerText = this.emulator.localization(title);
                li.appendChild(a);
                parent.appendChild(li);
                hideMenu();
                return li;
            }
            
            // 添加许可证信息
            const license = this.emulator.createElement("div");
            license.style.display = "none";
            
            // 添加RetroArch信息
            const retroarch = this.emulator.createElement("div");
            retroarch.style.display = "none";
            
            // 添加主页链接
            const home = this.emulator.createElement("div");
            this.emulator.createLink(home, "https://emulatorjs.com", "Homepage");
            
            // 添加GitHub链接
            const github = this.emulator.createElement("div");
            this.emulator.createLink(github, "https://github.com/EmulatorJS/EmulatorJS", "GitHub");
            
            // 添加许可证链接
            const licenseLink = this.emulator.createElement("div");
            this.emulator.createLink(licenseLink, "https://github.com/EmulatorJS/EmulatorJS/blob/master/LICENSE", "License");
            
            // 添加RetroArch许可证链接
            const retroarchLicense = this.emulator.createElement("div");
            this.emulator.createLink(retroarchLicense, "https://github.com/libretro/RetroArch/blob/master/LICENSE", "RetroArch License");
            
            // 添加核心许可证链接
            const coreLicense = this.emulator.createElement("div");
            this.emulator.createLink(coreLicense, "https://github.com/EmulatorJS/EmulatorJS/blob/master/CORES.md", "Core Licenses");
            
            // 添加关于信息
            const about = this.emulator.createElement("div");
            about.innerText = "EmulatorJS is a JavaScript port of various emulators. It is not affiliated with any of the emulator authors or the copyright holders of the games it emulates.";
            about.style.textAlign = "center";
            about.style.marginTop = "20px";
            
            // 添加许可证内容
            const licenseContent = this.emulator.createElement("div");
            licenseContent.style.textAlign = "center";
            licenseContent.style.marginTop = "20px";
            licenseContent.style.whiteSpace = "pre-wrap";
            licenseContent.style.maxHeight = "300px";
            licenseContent.style.overflowY = "auto";
            licenseContent.innerText = this.emulator.license || "No license information available.";
            
            // 添加RetroArch内容
            const retroarchContent = this.emulator.createElement("div");
            retroarchContent.style.textAlign = "center";
            retroarchContent.style.marginTop = "20px";
            retroarchContent.style.whiteSpace = "pre-wrap";
            retroarchContent.style.maxHeight = "300px";
            retroarchContent.style.overflowY = "auto";
            retroarchContent.innerText = "RetroArch is a front-end for libretro cores. It is not affiliated with any of the core authors or the copyright holders of the games it emulates.";
            
            // 添加许可证按钮
            const licenseButton = addButton("License", false, (li) => {
                license.style.display = license.style.display === "none" ? "" : "none";
                licenseContent.style.display = license.style.display === "none" ? "" : "none";
            });
            
            // 添加RetroArch按钮
            const retroarchButton = addButton("RetroArch", false, (li) => {
                retroarch.style.display = retroarch.style.display === "none" ? "" : "none";
                retroarchContent.style.display = retroarch.style.display === "none" ? "" : "none";
            });
            
            // 添加关闭按钮
            const closeButton = addButton("Close", false, () => {
                this.emulator.closePopup();
            });
            
            // 添加所有元素到菜单
            menu.appendChild(home);
            menu.appendChild(github);
            menu.appendChild(licenseLink);
            menu.appendChild(retroarchLicense);
            menu.appendChild(coreLicense);
            menu.appendChild(licenseButton);
            menu.appendChild(license);
            menu.appendChild(licenseContent);
            menu.appendChild(retroarchButton);
            menu.appendChild(retroarch);
            menu.appendChild(retroarchContent);
            menu.appendChild(closeButton);
            menu.appendChild(about);
        });

        // 添加所有元素到上下文菜单
        this.emulator.elements.contextmenu.appendChild(parent);
    }

    createControlSettingMenu() {
        // 创建控制设置菜单
        let buttonListeners = [];
        this.emulator.checkGamepadInputs = () => buttonListeners.forEach(elem => elem());
        this.emulator.gamepadLabels = [];
        this.emulator.gamepadSelection = [];
        this.emulator.controls = JSON.parse(JSON.stringify(this.emulator.defaultControllers));
        
        const body = this.emulator.createPopup("Control Settings", {
            "Reset": () => {
                this.emulator.controls = JSON.parse(JSON.stringify(this.emulator.defaultControllers));
                this.emulator.controlManager.setupKeys();
                this.emulator.checkGamepadInputs();
                this.emulator.saveSettings();
            },
            "Clear": () => {
                this.emulator.controls = { 0: {}, 1: {}, 2: {}, 3: {} };
                this.emulator.controlManager.setupKeys();
                this.emulator.checkGamepadInputs();
                this.emulator.saveSettings();
            },
            "Close": () => {
                this.emulator.controlMenu.style.display = "none";
            }
        }, true);
        
        this.emulator.setupKeys();
        this.emulator.controlMenu = body.parentElement;
        body.classList.add("ejs_control_body");
        
        // 获取控制方案
        const getControlScheme = () => {
            if (this.emulator.config.controlScheme && typeof this.emulator.config.controlScheme === "string") {
                return this.emulator.config.controlScheme;
            } else {
                return this.emulator.coreManager.getCore(true);
            }
        };
        
        // 定义不同控制方案的按钮
        let buttons;
        const scheme = getControlScheme();
        
        if ("gb" === scheme) {
            buttons = [
                { id: 8, label: this.emulator.localization("A") },
                { id: 0, label: this.emulator.localization("B") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
            ];
        } else if ("nes" === scheme) {
            buttons = [
                { id: 8, label: this.emulator.localization("A") },
                { id: 0, label: this.emulator.localization("B") },
                { id: 9, label: this.emulator.localization("X") },
                { id: 1, label: this.emulator.localization("Y") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
            ];
        } else if ("snes" === scheme) {
            buttons = [
                { id: 8, label: this.emulator.localization("A") },
                { id: 0, label: this.emulator.localization("B") },
                { id: 9, label: this.emulator.localization("X") },
                { id: 1, label: this.emulator.localization("Y") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
                { id: 10, label: this.emulator.localization("L") },
                { id: 11, label: this.emulator.localization("R") },
            ];
        } else if ("n64" === scheme) {
            buttons = [
                { id: 0, label: this.emulator.localization("A") },
                { id: 1, label: this.emulator.localization("B") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("D-PAD UP") },
                { id: 5, label: this.emulator.localization("D-PAD DOWN") },
                { id: 6, label: this.emulator.localization("D-PAD LEFT") },
                { id: 7, label: this.emulator.localization("D-PAD RIGHT") },
                { id: 10, label: this.emulator.localization("L") },
                { id: 11, label: this.emulator.localization("R") },
                { id: 12, label: this.emulator.localization("Z") },
                { id: 19, label: this.emulator.localization("STICK UP") },
                { id: 18, label: this.emulator.localization("STICK DOWN") },
                { id: 17, label: this.emulator.localization("STICK LEFT") },
                { id: 16, label: this.emulator.localization("STICK RIGHT") },
                { id: 23, label: this.emulator.localization("C-PAD UP") },
                { id: 22, label: this.emulator.localization("C-PAD DOWN") },
                { id: 21, label: this.emulator.localization("C-PAD LEFT") },
                { id: 20, label: this.emulator.localization("C-PAD RIGHT") },
            ];
        } else if ("gba" === scheme) {
            buttons = [
                { id: 8, label: this.emulator.localization("A") },
                { id: 0, label: this.emulator.localization("B") },
                { id: 10, label: this.emulator.localization("L") },
                { id: 11, label: this.emulator.localization("R") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
            ];
        } else if ("nds" === scheme) {
            buttons = [
                { id: 8, label: this.emulator.localization("A") },
                { id: 0, label: this.emulator.localization("B") },
                { id: 9, label: this.emulator.localization("X") },
                { id: 1, label: this.emulator.localization("Y") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
                { id: 10, label: this.emulator.localization("L") },
                { id: 11, label: this.emulator.localization("R") },
                { id: 14, label: this.emulator.localization("Microphone") },
            ];
        } else {
            // 默认按钮配置
            buttons = [
                { id: 0, label: this.emulator.localization("B") },
                { id: 1, label: this.emulator.localization("Y") },
                { id: 2, label: this.emulator.localization("SELECT") },
                { id: 3, label: this.emulator.localization("START") },
                { id: 4, label: this.emulator.localization("UP") },
                { id: 5, label: this.emulator.localization("DOWN") },
                { id: 6, label: this.emulator.localization("LEFT") },
                { id: 7, label: this.emulator.localization("RIGHT") },
                { id: 8, label: this.emulator.localization("A") },
                { id: 9, label: this.emulator.localization("X") },
                { id: 10, label: this.emulator.localization("L") },
                { id: 11, label: this.emulator.localization("R") },
            ];
        }
        
        // 添加通用按钮
        buttons.push(
            { id: 24, label: this.emulator.localization("QUICK SAVE STATE") },
            { id: 25, label: this.emulator.localization("QUICK LOAD STATE") },
            { id: 26, label: this.emulator.localization("CHANGE STATE SLOT") },
            { id: 27, label: this.emulator.localization("FAST FORWARD") },
            { id: 29, label: this.emulator.localization("SLOW MOTION") },
            { id: 28, label: this.emulator.localization("REWIND") }
        );
        
        // 清理未使用的按钮ID
        let nums = [];
        for (let i = 0; i < buttons.length; i++) {
            nums.push(buttons[i].id);
        }
        for (let i = 0; i < 30; i++) {
            if (!nums.includes(i)) {
                delete this.emulator.defaultControllers[0][i];
                delete this.emulator.defaultControllers[1][i];
                delete this.emulator.defaultControllers[2][i];
                delete this.emulator.defaultControllers[3][i];
                delete this.emulator.controls[0][i];
                delete this.emulator.controls[1][i];
                delete this.emulator.controls[2][i];
                delete this.emulator.controls[3][i];
            }
        }
        
        // 创建玩家选择标签
        let selectedPlayer;
        let players = [];
        let playerDivs = [];
        
        const playerSelect = this.emulator.createElement("ul");
        playerSelect.classList.add("ejs_control_player_bar");
        for (let i = 1; i < 5; i++) {
            const playerContainer = this.emulator.createElement("li");
            playerContainer.classList.add("tabs-title");
            playerContainer.setAttribute("role", "presentation");
            const player = this.emulator.createElement("a");
            player.innerText = this.emulator.localization("Player") + " " + i;
            player.setAttribute("role", "tab");
            player.setAttribute("aria-controls", "controls-" + (i - 1));
            player.setAttribute("aria-selected", "false");
            player.id = "controls-" + (i - 1) + "-label";
            this.emulator.addEventListener(player, "click", (e) => {
                e.preventDefault();
                players[selectedPlayer].classList.remove("ejs_control_selected");
                playerDivs[selectedPlayer].setAttribute("hidden", "");
                selectedPlayer = i - 1;
                players[i - 1].classList.add("ejs_control_selected");
                playerDivs[i - 1].removeAttribute("hidden");
            })
            playerContainer.appendChild(player);
            playerSelect.appendChild(playerContainer);
            players.push(playerContainer);
        }
        body.appendChild(playerSelect);
        
        // 创建控制器配置区域
        const controls = this.emulator.createElement("div");
        for (let i = 0; i < 4; i++) {
            if (!this.emulator.controls[i]) this.emulator.controls[i] = {};
            const player = this.emulator.createElement("div");
            const playerTitle = this.emulator.createElement("div");
            
            // 创建游戏手柄选择
            const gamepadTitle = this.emulator.createElement("div");
            gamepadTitle.innerText = this.emulator.localization("Connected Gamepad") + ": ";
            
            const gamepadName = this.emulator.createElement("select");
            gamepadName.classList.add("ejs_gamepad_dropdown");
            gamepadName.setAttribute("title", "gamepad-" + i);
            gamepadName.setAttribute("index", i);
            this.emulator.gamepadLabels.push(gamepadName);
            this.emulator.gamepadSelection.push("");
            this.emulator.addEventListener(gamepadName, "change", e => {
                const controller = e.target.value;
                const player = parseInt(e.target.getAttribute("index"));
                if (controller === "notconnected") {
                    this.emulator.gamepadSelection[player] = "";
                } else {
                    for (let j = 0; j < this.emulator.gamepadSelection.length; j++) {
                        if (player === j) continue;
                        if (this.emulator.gamepadSelection[j] === controller) {
                            this.emulator.gamepadSelection[j] = "";
                        }
                    }
                    this.emulator.gamepadSelection[player] = controller;
                    this.emulator.updateGamepadLabels();
                }
            });
            
            const def = this.emulator.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            gamepadName.appendChild(def);
            gamepadTitle.appendChild(gamepadName);
            gamepadTitle.classList.add("ejs_gamepad_section");
            
            playerTitle.appendChild(gamepadTitle);
            
            // 添加虚拟手柄选项（仅限第一个玩家且触摸设备）
            if ((this.emulator.touch || this.emulator.hasTouchScreen) && i === 0) {
                const vgp = this.emulator.createElement("div");
                vgp.style = "width:25%;float:right;clear:none;padding:0;font-size: 11px;padding-left: 2.25rem;";
                vgp.classList.add("ejs_control_row");
                vgp.classList.add("ejs_cheat_row");
                const input = this.emulator.createElement("input");
                input.type = "checkbox";
                input.checked = true;
                input.value = "o";
                input.id = "ejs_vp";
                vgp.appendChild(input);
                const label = this.emulator.createElement("label");
                label.for = "ejs_vp";
                label.innerText = "Virtual Gamepad";
                vgp.appendChild(label);
                label.addEventListener("click", (e) => {
                    input.checked = !input.checked;
                    this.emulator.changeSettingOption("virtual-gamepad", input.checked ? "enabled" : "disabled");
                })
                this.emulator.on("start", (e) => {
                    if (this.emulator.getSettingValue("virtual-gamepad") === "disabled") {
                        input.checked = false;
                    }
                })
                playerTitle.appendChild(vgp);
            }
            
            const headingPadding = this.emulator.createElement("div");
            headingPadding.style = "clear:both;";
            playerTitle.appendChild(headingPadding);
            player.appendChild(playerTitle);
            
            // 为每个按钮创建配置项
            for (const buttonIdx in buttons) {
                const k = buttons[buttonIdx].id;
                const controlLabel = buttons[buttonIdx].label;
                
                const buttonText = this.emulator.createElement("div");
                buttonText.setAttribute("data-id", k);
                buttonText.setAttribute("data-index", i);
                buttonText.setAttribute("data-label", controlLabel);
                buttonText.style = "margin-bottom:10px;";
                buttonText.classList.add("ejs_control_bar");
                
                const title = this.emulator.createElement("div");
                title.style = "width:25%;float:left;font-size:12px;";
                const label = this.emulator.createElement("label");
                label.innerText = controlLabel + ":";
                title.appendChild(label);
                
                const textBoxes = this.emulator.createElement("div");
                textBoxes.style = "width:50%;float:left;";
                
                // 创建两个文本框，分别用于键盘和手柄配置
                const textBox1Parent = this.emulator.createElement("div");
                textBox1Parent.style = "width:50%;float:left;padding: 0 5px;";
                const textBox1 = this.emulator.createElement("input");
                textBox1.style = "text-align:center;height:25px;width: 100%;";
                textBox1.type = "text";
                textBox1.setAttribute("readonly", "");
                textBox1.setAttribute("placeholder", "");
                textBox1Parent.appendChild(textBox1);
                
                const textBox2Parent = this.emulator.createElement("div");
                textBox2Parent.style = "width:50%;float:left;padding: 0 5px;";
                const textBox2 = this.emulator.createElement("input");
                textBox2.style = "text-align:center;height:25px;width: 100%;";
                textBox2.type = "text";
                textBox2.setAttribute("readonly", "");
                textBox2.setAttribute("placeholder", "");
                textBox2Parent.appendChild(textBox2);
                
                // 添加按钮监听器
                buttonListeners.push(() => {
                    textBox2.value = "";
                    textBox1.value = "";
                    if (this.emulator.controls[i][k] && this.emulator.controls[i][k].value !== undefined) {
                        let value = this.emulator.controlManager.keyMap[this.emulator.controls[i][k].value];
                        value = this.emulator.localization(value);
                        textBox2.value = value;
                    }
                    if (this.emulator.controls[i][k] && this.emulator.controls[i][k].value2 !== undefined && this.emulator.controls[i][k].value2 !== "") {
                        let value2 = this.emulator.controls[i][k].value2.toString();
                        if (value2.includes(":")) {
                            value2 = value2.split(":");
                            value2 = this.emulator.localization(value2[0]) + ":" + this.emulator.localization(value2[1])
                        } else if (!isNaN(value2)) {
                            value2 = this.emulator.localization("BUTTON") + " " + this.emulator.localization(value2);
                        } else {
                            value2 = this.emulator.localization(value2);
                        }
                        textBox1.value = value2;
                    }
                });
                
                // 设置初始值
                if (this.emulator.controls[i][k] && this.emulator.controls[i][k].value) {
                    let value = this.emulator.controlManager.keyMap[this.emulator.controls[i][k].value];
                    value = this.emulator.localization(value);
                    textBox2.value = value;
                }
                if (this.emulator.controls[i][k] && this.emulator.controls[i][k].value2) {
                    let value2 = this.emulator.controls[i][k].value2.toString();
                    if (value2.includes(":")) {
                        value2 = value2.split(":");
                        value2 = this.emulator.localization(value2[0]) + ":" + this.emulator.localization(value2[1])
                    } else if (!isNaN(value2)) {
                        value2 = this.emulator.localization("BUTTON") + " " + this.emulator.localization(value2);
                    } else {
                        value2 = this.emulator.localization(value2);
                    }
                    textBox1.value = value2;
                }
                
                textBoxes.appendChild(textBox1Parent);
                textBoxes.appendChild(textBox2Parent);
                
                const padding = this.emulator.createElement("div");
                padding.style = "clear:both;";
                textBoxes.appendChild(padding);
                
                const setButton = this.emulator.createElement("div");
                setButton.style = "width:25%;float:left;";
                const button = this.emulator.createElement("a");
                button.classList.add("ejs_control_set_button");
                button.innerText = this.emulator.localization("Set");
                setButton.appendChild(button);
                
                const padding2 = this.emulator.createElement("div");
                padding2.style = "clear:both;";
                
                buttonText.appendChild(title);
                buttonText.appendChild(textBoxes);
                buttonText.appendChild(setButton);
                buttonText.appendChild(padding2);
                
                player.appendChild(buttonText);
                
                // 添加按钮事件监听器
                this.emulator.addEventListener(buttonText, "mousedown", (e) => {
                    e.preventDefault();
                    // 显示控制配置弹窗
                    const popup = this.emulator.controlMenu.querySelector(".ejs_popup_container");
                    if (popup) {
                        popup.removeAttribute("hidden");
                        const popupMsg = popup.querySelector(".ejs_popup_box");
                        popupMsg.innerText = "[ " + controlLabel + " ]\n" + this.emulator.localization("Press Keyboard");
                        popupMsg.setAttribute("button-num", k);
                        popupMsg.setAttribute("player-num", i);
                    }
                });
            }
            controls.appendChild(player);
            player.setAttribute("hidden", "");
            playerDivs.push(player);
        }
        body.appendChild(controls);
        
        // 设置默认选中的玩家
        selectedPlayer = 0;
        players[0].classList.add("ejs_control_selected");
        playerDivs[0].removeAttribute("hidden");
        
        // 创建控制配置弹窗
        const popup = this.emulator.createElement("div");
        popup.classList.add("ejs_popup_container");
        popup.setAttribute("hidden", "");
        
        const popupMsg = this.emulator.createElement("div");
        popupMsg.classList.add("ejs_popup_box");
        popupMsg.innerText = "";
        
        this.emulator.addEventListener(popup, "mousedown click touchstart", (e) => {
            if (this.emulator.isChild(popupMsg, e.target)) return;
            popup.setAttribute("hidden", "");
        });
        
        const clearButton = this.emulator.createElement("a");
        clearButton.classList.add("ejs_control_set_button");
        clearButton.innerText = this.emulator.localization("Clear");
        
        this.emulator.addEventListener(clearButton, "mousedown click touchstart", (e) => {
            const num = popupMsg.getAttribute("button-num");
            const player = popupMsg.getAttribute("player-num");
            if (!this.emulator.controls[player]) {
                this.emulator.controls[player] = {};
            }
            if (!this.emulator.controls[player][num]) {
                this.emulator.controls[player][num] = {};
            }
            this.emulator.controls[player][num].value = 0;
            this.emulator.controls[player][num].value2 = "";
            popup.setAttribute("hidden", "");
            this.emulator.checkGamepadInputs();
            this.emulator.saveSettings();
        });
        
        popupMsg.appendChild(this.emulator.createElement("br"));
        popupMsg.appendChild(clearButton);
        popup.appendChild(popupMsg);
        this.emulator.controlMenu.appendChild(popup);
        
        // 添加到游戏区域
        this.emulator.game.appendChild(this.emulator.controlMenu);
    }

    createCheatsMenu() {
        const body = this.emulator.createPopup("Cheats", {
            "Add Cheat": () => {
                const popups = this.emulator.createSubPopup();
                this.emulator.cheatMenu.appendChild(popups[0]);
                popups[1].classList.add("ejs_cheat_parent");
                popups[1].style.width = "100%";
                const popup = popups[1];
                const header = this.emulator.createElement("div");
                header.classList.add("ejs_cheat_header");
                const title = this.emulator.createElement("h2");
                title.innerText = this.emulator.localization("Add Cheat Code");
                title.classList.add("ejs_cheat_heading");
                const close = this.emulator.createElement("button");
                close.classList.add("ejs_cheat_close");
                header.appendChild(title);
                header.appendChild(close);
                popup.appendChild(header);
                this.emulator.addEventListener(close, "click", (e) => {
                    popups[0].remove();
                })

                const main = this.emulator.createElement("div");
                main.classList.add("ejs_cheat_main");
                const header3 = this.emulator.createElement("strong");
                header3.innerText = this.emulator.localization("Code");
                main.appendChild(header3);
                main.appendChild(this.emulator.createElement("br"));
                const mainText = this.emulator.createElement("textarea");
                mainText.classList.add("ejs_cheat_code");
                mainText.style.width = "100%";
                mainText.style.height = "80px";
                main.appendChild(mainText);
                main.appendChild(this.emulator.createElement("br"));
                const header2 = this.emulator.createElement("strong");
                header2.innerText = this.emulator.localization("Description");
                main.appendChild(header2);
                main.appendChild(this.emulator.createElement("br"));
                const mainText2 = this.emulator.createElement("input");
                mainText2.type = "text";
                mainText2.classList.add("ejs_cheat_code");
                main.appendChild(mainText2);
                main.appendChild(this.emulator.createElement("br"));
                popup.appendChild(main);

                const footer = this.emulator.createElement("footer");
                const submit = this.emulator.createElement("button");
                const closeButton = this.emulator.createElement("button");
                submit.innerText = this.emulator.localization("Submit");
                closeButton.innerText = this.emulator.localization("Close");
                submit.classList.add("ejs_button_button");
                closeButton.classList.add("ejs_button_button");
                submit.classList.add("ejs_popup_submit");
                closeButton.classList.add("ejs_popup_submit");
                submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
                footer.appendChild(submit);
                const span = this.emulator.createElement("span");
                span.innerText = " ";
                footer.appendChild(span);
                footer.appendChild(closeButton);
                popup.appendChild(footer);

                this.emulator.addEventListener(submit, "click", (e) => {
                    if (!mainText.value.trim() || !mainText2.value.trim()) return;
                    popups[0].remove();
                    this.emulator.cheats.push({
                        code: mainText.value,
                        desc: mainText2.value,
                        checked: false
                    });
                    this.emulator.updateCheatUI();
                    this.emulator.saveSettings();
                })
                this.emulator.addEventListener(closeButton, "click", (e) => {
                    popups[0].remove();
                })
            },
            "Close": () => {
                this.emulator.cheatMenu.style.display = "none";
            }
        }, true);
        this.emulator.cheatMenu = body.parentElement;
        this.emulator.cheatMenu.getElementsByTagName("h4")[0].style["padding-bottom"] = "0px";
        const msg = this.emulator.createElement("div");
        msg.style["padding-top"] = "0px";
        msg.style["padding-bottom"] = "15px";
        msg.innerText = this.emulator.localization("Note that some cheats require a restart to disable");
        body.appendChild(msg);
        const rows = this.emulator.createElement("div");
        body.appendChild(rows);
        rows.classList.add("ejs_cheat_rows");
        this.emulator.elements.cheatRows = rows;
    }

    createNetplayMenu() {
        // 创建网络游戏菜单
        this.emulator.netplayMenu = this.emulator.createElement("div");
        this.emulator.netplayMenu.classList.add("ejs_netplay_menu");
        this.emulator.netplayMenu.style.display = "none";
        
        const header = this.emulator.createElement("div");
        header.classList.add("ejs_netplay_header");
        const title = this.emulator.createElement("h2");
        title.innerText = this.emulator.localization("Netplay");
        title.classList.add("ejs_netplay_heading");
        const close = this.emulator.createElement("button");
        close.classList.add("ejs_netplay_close");
        header.appendChild(title);
        header.appendChild(close);
        this.emulator.netplayMenu.appendChild(header);
        
        this.emulator.addEventListener(close, "click", () => {
            this.emulator.netplayMenu.style.display = "none";
        });
        
        // 添加房间创建区域
        const createRoom = this.emulator.createElement("div");
        createRoom.classList.add("ejs_netplay_create_room");
        
        const createRoomTitle = this.emulator.createElement("h3");
        createRoomTitle.innerText = this.emulator.localization("Create Room");
        createRoom.appendChild(createRoomTitle);
        
        const createRoomButton = this.emulator.createElement("button");
        createRoomButton.classList.add("ejs_netplay_create_room_button");
        createRoomButton.innerText = this.emulator.localization("Create Room");
        createRoom.appendChild(createRoomButton);
        
        this.emulator.netplayMenu.appendChild(createRoom);
        
        // 添加房间加入区域
        const joinRoom = this.emulator.createElement("div");
        joinRoom.classList.add("ejs_netplay_join_room");
        
        const joinRoomTitle = this.emulator.createElement("h3");
        joinRoomTitle.innerText = this.emulator.localization("Join Room");
        joinRoom.appendChild(joinRoomTitle);
        
        const roomIdInput = this.emulator.createElement("input");
        roomIdInput.setAttribute("type", "text");
        roomIdInput.setAttribute("placeholder", this.emulator.localization("Room ID"));
        roomIdInput.classList.add("ejs_netplay_room_id");
        joinRoom.appendChild(roomIdInput);
        
        const joinRoomButton = this.emulator.createElement("button");
        joinRoomButton.classList.add("ejs_netplay_join_room_button");
        joinRoomButton.innerText = this.emulator.localization("Join Room");
        joinRoom.appendChild(joinRoomButton);
        
        this.emulator.netplayMenu.appendChild(joinRoom);
        
        // 添加事件监听器
        this.emulator.addEventListener(createRoomButton, "click", () => {
            this.emulator.createRoom();
            this.emulator.netplayMenu.style.display = "none";
        });
        
        this.emulator.addEventListener(joinRoomButton, "click", () => {
            const roomId = roomIdInput.value.trim();
            if (roomId) {
                this.emulator.joinRoom(roomId);
                this.emulator.netplayMenu.style.display = "none";
            }
        });
        
        const body = this.emulator.createPopup("Netplay", {
            "Create a Room": () => {
                if (this.emulator.isNetplay) {
                    this.emulator.netplay.leaveRoom();
                } else {
                    this.emulator.netplay.showOpenRoomDialog();
                }
            },
            "Close": () => {
                this.emulator.netplayMenu.style.display = "none";
                this.emulator.netplay.updateList.stop();
            }
        }, true);
        this.emulator.netplayMenu = body.parentElement;
        const createButton = this.emulator.netplayMenu.getElementsByTagName("a")[0];
        const rooms = this.emulator.createElement("div");
        const title1 = this.emulator.createElement("strong");
        title1.innerText = this.emulator.localization("Rooms");
        const table = this.emulator.createElement("table");
        table.classList.add("ejs_netplay_table");
        table.style.width = "100%";
        table.setAttribute("cellspacing", "0");
        const thead = this.emulator.createElement("thead");
        const row = this.emulator.createElement("tr");
        const addToHeader = (text) => {
            const item = this.emulator.createElement("td");
            item.innerText = text;
            item.style["text-align"] = "center";
            row.appendChild(item);
            return item;
        }
        thead.appendChild(row);
        addToHeader("Room Name").style["text-align"] = "left";
        addToHeader("Players").style.width = "80px";
        addToHeader("").style.width = "80px"; //"join" button
        table.appendChild(thead);
        const tbody = this.emulator.createElement("tbody");
        table.appendChild(tbody);
        rooms.appendChild(title1);
        rooms.appendChild(table);

        const joined = this.emulator.createElement("div");
        const title2 = this.emulator.createElement("strong");
        title2.innerText = "{roomname}";
        const password = this.emulator.createElement("div");
        password.innerText = "Password: ";
        const table2 = this.emulator.createElement("table");
        table2.classList.add("ejs_netplay_table");
        table2.style.width = "100%";
        table2.setAttribute("cellspacing", "0");
        const thead2 = this.emulator.createElement("thead");
        const row2 = this.emulator.createElement("tr");
        const addToHeader2 = (text) => {
            const item = this.emulator.createElement("td");
            item.innerText = text;
            row2.appendChild(item);
            return item;
        }
        thead2.appendChild(row2);
        addToHeader2("Player").style.width = "80px";
        addToHeader2("Name");
        addToHeader2("").style.width = "80px"; //"join" button
        table2.appendChild(thead2);
        const tbody2 = this.emulator.createElement("tbody");
        table2.appendChild(tbody2);
        joined.appendChild(title2);
        joined.appendChild(password);
        joined.appendChild(table2);

        joined.style.display = "none";
        body.appendChild(rooms);
        body.appendChild(joined);

        this.emulator.openNetplayMenu = () => {
            this.emulator.netplayMenu.style.display = "";
            if (!this.emulator.netplay || (this.emulator.netplay && !this.emulator.netplay.name)) {
                this.emulator.netplay = {};
                this.emulator.netplay.table = tbody;
                this.emulator.netplay.playerTable = tbody2;
                this.emulator.netplay.passwordElem = password;
                this.emulator.netplay.roomNameElem = title2;
                this.emulator.netplay.createButton = createButton;
                this.emulator.netplay.tabs = [rooms, joined];
                this.emulator.defineNetplayFunctions();
                const popups = this.emulator.createSubPopup();
                this.emulator.netplayMenu.appendChild(popups[0]);
                popups[1].classList.add("ejs_cheat_parent"); //Hehe
                const popup = popups[1];

                const header = this.emulator.createElement("div");
                const title = this.emulator.createElement("h2");
                title.innerText = this.emulator.localization("Set Player Name");
                title.classList.add("ejs_netplay_name_heading");
                header.appendChild(title);
                popup.appendChild(header);

                const main = this.emulator.createElement("div");
                main.classList.add("ejs_netplay_header");
                const head = this.emulator.createElement("strong");
                head.innerText = this.emulator.localization("Player Name");
                const input = this.emulator.createElement("input");
                input.type = "text";
                input.setAttribute("maxlength", 20);

                main.appendChild(head);
                main.appendChild(this.emulator.createElement("br"));
                main.appendChild(input);
                popup.appendChild(main);

                popup.appendChild(this.emulator.createElement("br"));
                const submit = this.emulator.createElement("button");
                submit.classList.add("ejs_button_button");
                submit.classList.add("ejs_popup_submit");
                submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
                submit.innerText = this.emulator.localization("Submit");
                popup.appendChild(submit);
                this.emulator.addEventListener(submit, "click", (e) => {
                    if (!input.value.trim()) return;
                    this.emulator.netplay.name = input.value.trim();
                    popups[0].remove();
                })
            }
            this.emulator.netplay.updateList.start();
        }
    }

    createBottomMenuBar() {
        let ignoreEvents = false;
        const show = () => {
            if (ignoreEvents) return;
            if (this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                this.emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
                if (this.emulator.isMobile) {
                    hide();
                }
            }
        }
        const hide = () => {
            if (ignoreEvents) return;
            if (!this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                this.emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
            }
        }
        const clickListener = (e) => {
            if (ignoreEvents) return;
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.isPopupOpen()) return;
            hide();
        }
        const mouseListener = (e) => {
            if (ignoreEvents) return;
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.isPopupOpen()) return;

            const rect = this.emulator.elements.parent.getBoundingClientRect();
            const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
            if (angle < 0) angle += 360;
            if (angle < 85 || angle > 95) return;
            show();
        }
        if (this.mousemoveListener) this.emulator.removeEventListener(this.mousemoveListener);

        if ((this.emulator.preGetSafeSetting("menubarBehavior") || "downward") === "downward") {
            this.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", mouseListener);
        } else {
            this.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", clickListener);
        }

        this.emulator.addEventListener(this.emulator.elements.parent, "click", clickListener);
        this.createBottomMenuBarListeners();

        this.emulator.elements.parent.appendChild(this.emulator.elements.menu);

        let tmout;
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.elements.menu, e.target) || this.emulator.isChild(this.emulator.elements.menuToggle, e.target)) return;
            if (!this.emulator.started || this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden") || this.emulator.isPopupOpen()) return;
            const width = this.emulator.elements.parent.getBoundingClientRect().width;
            if (width > 575) return;
            clearTimeout(tmout);
            tmout = setTimeout(() => {
                ignoreEvents = false;
            }, 2000)
            ignoreEvents = true;
            this.emulator.uiManager.close();
        })

        let paddingSet = false;
        //Now add buttons
        const addButton = (buttonConfig, callback, element, both) => {
            const button = this.emulator.createElement("button");
            button.type = "button";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("role", "presentation");
            svg.setAttribute("focusable", "false");
            svg.innerHTML = buttonConfig.icon;
            const text = this.emulator.createElement("span");
            text.innerText = this.emulator.localization(buttonConfig.displayName);
            if (paddingSet) text.classList.add("ejs_menu_text_right");
            text.classList.add("ejs_menu_text");

            button.classList.add("ejs_menu_button");
            button.appendChild(svg);
            button.appendChild(text);
            if (element) {
                element.appendChild(button);
            } else {
                this.emulator.elements.menu.appendChild(button);
            }
            if (callback instanceof Function) {
                this.emulator.addEventListener(button, "click", callback);
            }

            if (buttonConfig.callback instanceof Function) {
                this.emulator.addEventListener(button, "click", buttonConfig.callback);
            }
            return both ? [button, svg, text] : button;
        }

        const restartButton = addButton(this.emulator.config.buttonOpts.restart, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.gameManager.restart();
                this.emulator.netplay.reset();
                this.emulator.netplay.sendMessage({ restart: true });
                this.emulator.play();
            } else if (!this.emulator.isNetplay) {
                this.emulator.gameManager.restart();
            }
        });
        const pauseButton = addButton(this.emulator.config.buttonOpts.pause, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.pause();
                this.emulator.gameManager.saveSaveFiles();
                this.emulator.netplay.sendMessage({ pause: true });
            } else if (!this.emulator.isNetplay) {
                this.emulator.pause();
            }
        });
        const playButton = addButton(this.emulator.config.buttonOpts.play, () => {
            if (this.emulator.isNetplay && this.emulator.netplay.owner) {
                this.emulator.play();
                this.emulator.netplay.sendMessage({ play: true });
            } else if (!this.emulator.isNetplay) {
                this.emulator.play();
            }
        });
        playButton.style.display = "none";
        this.emulator.togglePlaying = (dontUpdate) => {
            this.emulator.paused = !this.emulator.paused;
            if (!dontUpdate) {
                if (this.emulator.paused) {
                    pauseButton.style.display = "none";
                    playButton.style.display = "";
                } else {
                    pauseButton.style.display = "";
                    playButton.style.display = "none";
                }
            }
            this.emulator.gameManager.toggleMainLoop(this.emulator.paused ? 0 : 1);

            //I now realize its not easy to pause it while the cursor is locked, just in case I guess
            if (this.emulator.enableMouseLock) {
                if (this.emulator.canvas.exitPointerLock) {
                    this.emulator.canvas.exitPointerLock();
                } else if (this.emulator.canvas.mozExitPointerLock) {
                    this.emulator.canvas.mozExitPointerLock();
                }
            }
        }
        this.emulator.play = (dontUpdate) => {
            if (this.emulator.paused) this.emulator.togglePlaying(dontUpdate);
        }
        this.emulator.pause = (dontUpdate) => {
            if (!this.emulator.paused) this.emulator.togglePlaying(dontUpdate);
        }

        let stateUrl;
        const saveState = addButton(this.emulator.config.buttonOpts.saveState, async () => {
            let state;
            try {
                state = this.emulator.gameManager.getState();
            } catch (e) {
                this.emulator.displayMessage(this.emulator.localization("FAILED TO SAVE STATE"));
                return;
            }
            const { screenshot, format } = await this.emulator.takeScreenshot(this.emulator.capture.photo.source, this.emulator.capture.photo.format, this.emulator.capture.photo.upscale);
            const called = this.emulator.callEvent("saveState", {
                screenshot: screenshot,
                format: format,
                state: state
            });
            if (called > 0) return;
            if (stateUrl) URL.revokeObjectURL(stateUrl);
            if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
                this.emulator.storage.states.put(this.emulator.getBaseFileName() + ".state", state);
                this.emulator.displayMessage(this.emulator.localization("SAVE SAVED TO BROWSER"));
            } else {
                const blob = new Blob([state]);
                stateUrl = URL.createObjectURL(blob);
                const a = this.emulator.createElement("a");
                a.href = stateUrl;
                a.download = this.emulator.getBaseFileName() + ".state";
                a.click();
            }
        });
        const loadState = addButton(this.emulator.config.buttonOpts.loadState, async () => {
            const called = this.emulator.callEvent("loadState");
            if (called > 0) return;
            if (this.emulator.getSettingValue("save-state-location") === "browser" && this.emulator.saveInBrowserSupported()) {
                this.emulator.storage.states.get(this.emulator.getBaseFileName() + ".state").then(e => {
                    this.emulator.gameManager.loadState(e);
                    this.emulator.displayMessage(this.emulator.localization("SAVE LOADED FROM BROWSER"));
                })
            } else {
                const file = await this.emulator.selectFile();
                const state = new Uint8Array(await file.arrayBuffer());
                this.emulator.gameManager.loadState(state);
            }
        });
        const controlMenu = addButton(this.emulator.config.buttonOpts.gamepad, () => {
            this.emulator.controlMenu.style.display = "";
        });
        const cheatMenu = addButton(this.emulator.config.buttonOpts.cheat, () => {
            this.emulator.cheatMenu.style.display = "";
        });

        const cache = addButton(this.emulator.config.buttonOpts.cacheManager, () => {
            this.emulator.openCacheMenu();
        });

        if (this.emulator.config.disableDatabases) cache.style.display = "none";

        let savUrl;

        const saveSavFiles = addButton(this.emulator.config.buttonOpts.saveSavFiles, async () => {
            const file = await this.emulator.gameManager.getSaveFile();
            const { screenshot, format } = await this.emulator.takeScreenshot(this.emulator.capture.photo.source, this.emulator.capture.photo.format, this.emulator.capture.photo.upscale);
            const called = this.emulator.callEvent("saveSave", {
                screenshot: screenshot,
                format: format,
                save: file
            });
            if (called > 0) return;
            const blob = new Blob([file]);
            savUrl = URL.createObjectURL(blob);
            const a = this.emulator.createElement("a");
            a.href = savUrl;
            a.download = this.emulator.gameManager.getSaveFilePath().split("/").pop();
            a.click();
        });
        const loadSavFiles = addButton(this.emulator.config.buttonOpts.loadSavFiles, async () => {
            const called = this.emulator.callEvent("loadSave");
            if (called > 0) return;
            const file = await this.emulator.selectFile();
            const sav = new Uint8Array(await file.arrayBuffer());
            const path = this.emulator.gameManager.getSaveFilePath();
            const paths = path.split("/");
            let cp = "";
            for (let i = 0; i < paths.length - 1; i++) {
                if (paths[i] === "") continue;
                cp += "/" + paths[i];
                if (!this.emulator.gameManager.FS.analyzePath(cp).exists) this.emulator.gameManager.FS.mkdir(cp);
            }
            if (this.emulator.gameManager.FS.analyzePath(path).exists) this.emulator.gameManager.FS.unlink(path);
            this.emulator.gameManager.FS.writeFile(path, sav);
            this.emulator.gameManager.loadSaveFiles();
        });
        const netplay = addButton(this.emulator.config.buttonOpts.netplay, async () => {
            this.emulator.openNetplayMenu();
        });

        // add custom buttons
        // get all elements from this.emulator.config.buttonOpts with custom: true
        if (this.emulator.config.buttonOpts) {
            for (const [key, value] of Object.entries(this.emulator.config.buttonOpts)) {
                if (value.custom === true) {
                    const customBtn = addButton(value);
                }
            }
        }

        const spacer = this.emulator.createElement("span");
        spacer.classList.add("ejs_menu_bar_spacer");
        this.emulator.elements.menu.appendChild(spacer);
        paddingSet = true;

        const volumeSettings = this.emulator.createElement("div");
        volumeSettings.classList.add("ejs_volume_parent");
        const muteButton = addButton(this.emulator.config.buttonOpts.mute, () => {
            muteButton.style.display = "none";
            unmuteButton.style.display = "";
            this.emulator.muted = true;
            this.emulator.setVolume(0);
        }, volumeSettings);
        const unmuteButton = addButton(this.emulator.config.buttonOpts.unmute, () => {
            if (this.emulator.volume === 0) this.emulator.volume = 0.5;
            muteButton.style.display = "";
            unmuteButton.style.display = "none";
            this.emulator.muted = false;
            this.emulator.setVolume(this.emulator.volume);
        }, volumeSettings);
        unmuteButton.style.display = "none";

        const volumeSlider = this.emulator.createElement("input");
        volumeSlider.setAttribute("data-range", "volume");
        volumeSlider.setAttribute("type", "range");
        volumeSlider.setAttribute("min", 0);
        volumeSlider.setAttribute("max", 1);
        volumeSlider.setAttribute("step", 0.01);
        volumeSlider.setAttribute("autocomplete", "off");
        volumeSlider.setAttribute("role", "slider");
        volumeSlider.setAttribute("aria-label", "Volume");
        volumeSlider.setAttribute("aria-valuemin", 0);
        volumeSlider.setAttribute("aria-valuemax", 100);

        this.emulator.setVolume = (volume) => {
            this.emulator.saveSettings();
            this.emulator.muted = (volume === 0);
            volumeSlider.value = volume;
            volumeSlider.setAttribute("aria-valuenow", volume * 100);
            volumeSlider.setAttribute("aria-valuetext", (volume * 100).toFixed(1) + "%");
            volumeSlider.setAttribute("style", "--value: " + volume * 100 + "%;margin-left: 5px;position: relative;z-index: 2;");
            if (this.emulator.Module.AL && this.emulator.Module.AL.currentCtx && this.emulator.Module.AL.currentCtx.sources) {
                this.emulator.Module.AL.currentCtx.sources.forEach(e => {
                    e.gain.gain.value = volume;
                })
            }
            if (!this.emulator.config.buttonOpts || this.emulator.config.buttonOpts.mute !== false) {
                unmuteButton.style.display = (volume === 0) ? "" : "none";
                muteButton.style.display = (volume === 0) ? "none" : "";
            }
        }

        this.emulator.addEventListener(volumeSlider, "change mousemove touchmove mousedown touchstart mouseup", (e) => {
            setTimeout(() => {
                const newVal = parseFloat(volumeSlider.value);
                if (newVal === 0 && this.emulator.muted) return;
                this.emulator.volume = newVal;
                this.emulator.setVolume(this.emulator.volume);
            }, 5);
        })

        if (!this.emulator.config.buttonOpts || this.emulator.config.buttonOpts.volume !== false) {
            volumeSettings.appendChild(volumeSlider);
        }

        this.emulator.elements.menu.appendChild(volumeSettings);

        const contextMenuButton = addButton(this.emulator.config.buttonOpts.contextMenu, () => {
            if (this.emulator.elements.contextmenu.style.display === "none") {
                this.emulator.elements.contextmenu.style.display = "block";
                this.emulator.elements.contextmenu.style.left = (getComputedStyle(this.emulator.elements.parent).width.split("px")[0] / 2 - getComputedStyle(this.emulator.elements.contextmenu).width.split("px")[0] / 2) + "px";
                this.emulator.elements.contextmenu.style.top = (getComputedStyle(this.emulator.elements.parent).height.split("px")[0] / 2 - getComputedStyle(this.emulator.elements.contextmenu).height.split("px")[0] / 2) + "px";
                setTimeout(this.emulator.uiManager.close.bind(this), 20);
            } else {
                this.emulator.elements.contextmenu.style.display = "none";
            }
        });

        this.emulator.diskParent = this.emulator.createElement("div");
        this.emulator.diskParent.id = "ejs_disksMenu";
        this.emulator.disksMenuOpen = false;
        const diskButton = addButton(this.emulator.config.buttonOpts.diskButton, () => {
            this.emulator.disksMenuOpen = !this.emulator.disksMenuOpen;
            diskButton[1].classList.toggle("ejs_svg_rotate", this.emulator.disksMenuOpen);
            this.emulator.disksMenu.style.display = this.emulator.disksMenuOpen ? "" : "none";
            diskButton[2].classList.toggle("ejs_disks_text", this.emulator.disksMenuOpen);
        }, this.emulator.diskParent, true);
        this.emulator.elements.menu.appendChild(this.emulator.diskParent);
        this.emulator.closeDisksMenu = () => {
            if (!this.emulator.disksMenu) return;
            this.emulator.disksMenuOpen = false;
            diskButton[1].classList.toggle("ejs_svg_rotate", this.emulator.disksMenuOpen);
            diskButton[2].classList.toggle("ejs_disks_text", this.emulator.disksMenuOpen);
            this.emulator.disksMenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.disksMenu, e.target)) return;
            if (e.pointerType === "touch") return;
            if (e.target === diskButton[0] || e.target === diskButton[2]) return;
            this.emulator.closeDisksMenu();
        })

        this.emulator.settingParent = this.emulator.createElement("div");
        this.emulator.settingsMenuOpen = false;
        const settingButton = addButton(this.emulator.config.buttonOpts.settings, () => {
            this.emulator.settingsMenuOpen = !this.emulator.settingsMenuOpen;
            settingButton[1].classList.toggle("ejs_svg_rotate", this.emulator.settingsMenuOpen);
            this.emulator.settingsMenu.style.display = this.emulator.settingsMenuOpen ? "" : "none";
            settingButton[2].classList.toggle("ejs_settings_text", this.emulator.settingsMenuOpen);
        }, this.emulator.settingParent, true);
        this.emulator.elements.menu.appendChild(this.emulator.settingParent);
        this.emulator.closeSettingsMenu = () => {
            if (!this.emulator.settingsMenu) return;
            this.emulator.settingsMenuOpen = false;
            settingButton[1].classList.toggle("ejs_svg_rotate", this.emulator.settingsMenuOpen);
            settingButton[2].classList.toggle("ejs_settings_text", this.emulator.settingsMenuOpen);
            this.emulator.settingsMenu.style.display = "none";
        }
        this.emulator.addEventListener(this.emulator.elements.parent, "mousedown touchstart", (e) => {
            if (this.emulator.isChild(this.emulator.settingsMenu, e.target)) return;
            if (e.pointerType === "touch") return;
            if (e.target === settingButton[0] || e.target === settingButton[2]) return;
            this.emulator.closeSettingsMenu();
        })

        this.emulator.addEventListener(this.emulator.canvas, "click", (e) => {
            if (e.pointerType === "touch") return;
            if (this.emulator.enableMouseLock && !this.emulator.paused) {
                if (this.emulator.canvas.requestPointerLock) {
                    this.emulator.canvas.requestPointerLock();
                } else if (this.emulator.canvas.mozRequestPointerLock) {
                    this.emulator.canvas.mozRequestPointerLock();
                }
                this.emulator.uiManager.close();
            }
        })

        const enter = addButton(this.emulator.config.buttonOpts.enterFullscreen, () => {
            this.emulator.toggleFullscreen(true);
        });
        const exit = addButton(this.emulator.config.buttonOpts.exitFullscreen, () => {
            this.emulator.toggleFullscreen(false);
        });
        exit.style.display = "none";

        this.emulator.toggleFullscreen = (fullscreen) => {
            if (fullscreen) {
                if (this.emulator.elements.parent.requestFullscreen) {
                    this.emulator.elements.parent.requestFullscreen();
                } else if (this.emulator.elements.parent.mozRequestFullScreen) {
                    this.emulator.elements.parent.mozRequestFullScreen();
                } else if (this.emulator.elements.parent.webkitRequestFullscreen) {
                    this.emulator.elements.parent.webkitRequestFullscreen();
                } else if (this.emulator.elements.parent.msRequestFullscreen) {
                    this.emulator.elements.parent.msRequestFullscreen();
                }
                exit.style.display = "";
                enter.style.display = "none";
                if (this.emulator.isMobile) {
                    try {
                        screen.orientation.lock(this.emulator.getCore(true) === "nds" ? "portrait" : "landscape").catch(e => { });
                    } catch (e) { }
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                exit.style.display = "none";
                enter.style.display = "";
                if (this.emulator.isMobile) {
                    try {
                        screen.orientation.unlock();
                    } catch (e) { }
                }
            }
        }

        let exitMenuIsOpen = false;
        const exitEmulation = addButton(this.emulator.config.buttonOpts.exitEmulation, async () => {
            if (exitMenuIsOpen) return;
            exitMenuIsOpen = true;
            const popups = this.emulator.createSubPopup();
            this.emulator.game.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent");
            popups[1].style.width = "100%";
            const popup = popups[1];
            const header = this.emulator.createElement("div");
            header.classList.add("ejs_cheat_header");
            const title = this.emulator.createElement("h2");
            title.innerText = this.emulator.localization("Are you sure you want to exit?");
            title.classList.add("ejs_cheat_heading");
            const close = this.emulator.createElement("button");
            close.classList.add("ejs_cheat_close");
            header.appendChild(title);
            header.appendChild(close);
            popup.appendChild(header);
            this.emulator.addEventListener(close, "click", (e) => {
                exitMenuIsOpen = false
                popups[0].remove();
            })
            popup.appendChild(this.emulator.createElement("br"));

            const footer = this.emulator.createElement("footer");
            const submit = this.emulator.createElement("button");
            const closeButton = this.emulator.createElement("button");
            submit.innerText = this.emulator.localization("Exit");
            closeButton.innerText = this.emulator.localization("Cancel");
            submit.classList.add("ejs_button_button");
            closeButton.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            closeButton.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            footer.appendChild(submit);
            const span = this.emulator.createElement("span");
            span.innerText = " ";
            footer.appendChild(span);
            footer.appendChild(closeButton);
            popup.appendChild(footer);

            this.emulator.addEventListener(closeButton, "click", (e) => {
                popups[0].remove();
                exitMenuIsOpen = false
            })

            this.emulator.addEventListener(submit, "click", (e) => {
                popups[0].remove();
                const body = this.emulator.createPopup("EmulatorJS has exited", {});
                this.emulator.callEvent("exit");
            })
            setTimeout(this.emulator.uiManager.close.bind(this), 20);
        });

        this.emulator.addEventListener(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", (e) => {
            if (e.target !== this.emulator.elements.parent) return;
            if (document.fullscreenElement === null) {
                exit.style.display = "none";
                enter.style.display = "";
            } else {
                //not sure if this is possible, lets put it here anyways
                exit.style.display = "";
                enter.style.display = "none";
            }
        })

        const hasFullscreen = !!(this.emulator.elements.parent.requestFullscreen || this.emulator.elements.parent.mozRequestFullScreen || this.emulator.elements.parent.webkitRequestFullscreen || this.emulator.elements.parent.msRequestFullscreen);

        if (!hasFullscreen) {
            exit.style.display = "none";
            enter.style.display = "none";
        }

        this.emulator.elements.bottomBar = {
            playPause: [pauseButton, playButton],
            restart: [restartButton],
            settings: [settingButton],
            contextMenu: [contextMenuButton],
            fullscreen: [enter, exit],
            saveState: [saveState],
            loadState: [loadState],
            gamepad: [controlMenu],
            cheat: [cheatMenu],
            cacheManager: [cache],
            saveSavFiles: [saveSavFiles],
            loadSavFiles: [loadSavFiles],
            netplay: [netplay],
            exit: [exitEmulation]
        }

        if (this.emulator.config.buttonOpts) {
            if (this.emulator.debug) console.log(this.emulator.config.buttonOpts);
            if (this.emulator.config.buttonOpts.playPause.visible === false) {
                pauseButton.style.display = "none";
                playButton.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.contextMenuButton === false && this.emulator.config.buttonOpts.rightClick !== false && this.emulator.isMobile === false) contextMenuButton.style.display = "none"
            if (this.emulator.config.buttonOpts.restart.visible === false) restartButton.style.display = "none"
            if (this.emulator.config.buttonOpts.settings.visible === false) settingButton[0].style.display = "none"
            if (this.emulator.config.buttonOpts.fullscreen.visible === false) {
                enter.style.display = "none";
                exit.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.mute.visible === false) {
                muteButton.style.display = "none";
                unmuteButton.style.display = "none";
            }
            if (this.emulator.config.buttonOpts.saveState.visible === false) saveState.style.display = "none";
            if (this.emulator.config.buttonOpts.loadState.visible === false) loadState.style.display = "none";
            if (this.emulator.config.buttonOpts.saveSavFiles.visible === false) saveSavFiles.style.display = "none";
            if (this.emulator.config.buttonOpts.loadSavFiles.visible === false) loadSavFiles.style.display = "none";
            if (this.emulator.config.buttonOpts.gamepad.visible === false) controlMenu.style.display = "none";
            if (this.emulator.config.buttonOpts.cheat.visible === false) cheatMenu.style.display = "none";
            if (this.emulator.config.buttonOpts.cacheManager.visible === false) cache.style.display = "none";
            if (this.emulator.config.buttonOpts.netplay.visible === false) netplay.style.display = "none";
            if (this.emulator.config.buttonOpts.diskButton.visible === false) diskButton[0].style.display = "none";
            if (this.emulator.config.buttonOpts.volumeSlider.visible === false) volumeSlider.style.display = "none";
            if (this.emulator.config.buttonOpts.exitEmulation.visible === false) exitEmulation.style.display = "none";
        }

        this.emulator.uiManager.failedToStart = () => {
            if (!this.emulator.config.buttonOpts) this.emulator.config.buttonOpts = {};
            this.emulator.config.buttonOpts.mute = false;

            settingButton[0].style.display = "";

            // Hide all except settings button.
            pauseButton.style.display = "none";
            playButton.style.display = "none";
            contextMenuButton.style.display = "none";
            restartButton.style.display = "none";
            enter.style.display = "none";
            exit.style.display = "none";
            muteButton.style.display = "none";
            unmuteButton.style.display = "none";
            saveState.style.display = "none";
            loadState.style.display = "none";
            saveSavFiles.style.display = "none";
            loadSavFiles.style.display = "none";
            controlMenu.style.display = "none";
            cheatMenu.style.display = "none";
            cache.style.display = "none";
            netplay.style.display = "none";
            diskButton[0].style.display = "none";
            volumeSlider.style.display = "none";
            exitEmulation.style.display = "none";

            this.emulator.elements.menu.style.opacity = "";
            this.emulator.elements.menu.style.background = "transparent";
            this.emulator.virtualGamepad.style.display = "none";
            settingButton[0].classList.add("shadow");
            this.emulator.menu.open(true);
        }
    }

    open(force) {
        // 打开菜单
        if (!this.emulator.started && force !== true) return;
        if (this.emulator.elements.menu) {
            this.emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
            if (force !== true) {
                // 设置自动关闭定时器
                setTimeout(() => {
                    this.close();
                }, 3000);
            }
        }
    }

    toggle() {
        // 切换菜单显示状态
        if (!this.emulator.started) return;
        if (this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
            this.open();
        } else {
            this.close();
        }
    }

    close() {
        // 关闭所有菜单和弹窗
        if (this.emulator.elements.menu) {
            this.emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
        }
        if (this.emulator.elements.contextmenu) {
            this.emulator.elements.contextmenu.style.display = "none";
        }
        if (this.emulator.controlMenu) {
            this.emulator.controlMenu.style.display = "none";
        }
        if (this.emulator.cheatMenu) {
            this.emulator.cheatMenu.style.display = "none";
        }
        if (this.emulator.netplayMenu) {
            this.emulator.netplayMenu.style.display = "none";
        }
        if (this.emulator.settingsMenu) {
            this.emulator.settingsMenu.style.display = "none";
        }
        if (this.emulator.disksMenu) {
            this.emulator.disksMenu.style.display = "none";
        }
        if (this.emulator.statePopupPanel) {
            this.emulator.statePopupPanel.parentElement.style.display = "none";
        }
    }

    createBottomMenuBarListeners() {
        let ignoreEvents = false;
        const clickListener = (e) => {
            if (e.pointerType === "touch") return;
            if (!this.emulator.started || ignoreEvents || document.pointerLockElement === this.emulator.canvas) return;
            if (this.emulator.isPopupOpen()) return;
            show();
        }
        const mouseListener = (e) => {
            if (!this.emulator.started || ignoreEvents || document.pointerLockElement === this.emulator.canvas) return;
            if (this.emulator.isPopupOpen()) return;
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            const threshold = this.emulator.elements.menu.offsetHeight + 30;
            const mouseY = e.clientY;

            if (mouseY >= window.innerHeight - threshold) {
                show();
                return;
            }
            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            if (angle < 85 || angle > 95) return;
            show();
        }
        if (this.mousemoveListener) this.emulator.removeEventListener(this.mousemoveListener);

        if ((this.emulator.preGetSafeSetting("menubarBehavior") || "downward") === "downward") {
            this.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", mouseListener);
        } else {
            this.mousemoveListener = this.emulator.addEventListener(this.emulator.elements.parent, "mousemove", clickListener);
        }

        this.emulator.addEventListener(this.emulator.elements.parent, "click", clickListener);
    }


}
