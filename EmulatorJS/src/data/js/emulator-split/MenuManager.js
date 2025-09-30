/**
 * 菜单管理模块
 * 负责创建和管理模拟器的各种菜单界面
 */
class MenuManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.mousemoveListener = null;
        this.createBottomMenuBarListeners();
    }

    createContextMenu() {
        const contextMenu = this.emulator.createElement("div");
        contextMenu.classList.add("ejs_context_menu");
        contextMenu.style.display = "none";

        const items = [
            { "name": "save", "icon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>`, "text": this.emulator.localization("Save State") },
            { "name": "load", "icon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>`, "text": this.emulator.localization("Load State") },
            { "name": "reset", "icon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>`, "text": this.emulator.localization("Reset") },
            { "name": "settings", "icon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></svg>`, "text": this.emulator.localization("Settings") }
        ];

        items.forEach(item => {
            const button = this.emulator.createElement("button");
            button.classList.add("ejs_context_menu_button");
            button.innerHTML = `<div>${item.icon}</div><div>${item.text}</div>`;
            button.addEventListener("click", () => {
                contextMenu.style.display = "none";
                if (item.name === "save") {
                    this.emulator.emulatorJS.saveState();
                } else if (item.name === "load") {
                    this.emulator.emulatorJS.loadState();
                } else if (item.name === "reset") {
                    this.emulator.emulatorJS.restart();
                } else if (item.name === "settings") {
                    this.emulator.emulatorJS.openSettings();
                }
            });
            contextMenu.appendChild(button);
        });

        this.emulator.elements.parent.appendChild(contextMenu);
        this.emulator.elements.contextMenu = contextMenu;

        // 添加右键菜单事件
        this.emulator.addEventListener(this.emulator.elements.parent, "contextmenu", (e) => {
            e.preventDefault();
            if (!this.emulator.started) return;

            const rect = this.emulator.elements.parent.getBoundingClientRect();
            contextMenu.style.left = e.clientX - rect.left + "px";
            contextMenu.style.top = e.clientY - rect.top + "px";
            contextMenu.style.display = "block";
        });

        // 点击其他地方关闭菜单
        this.emulator.addEventListener(window, "click", () => {
            contextMenu.style.display = "none";
        });
    }

    createBottomMenuBarListeners() {
        const menuToggle = this.emulator.createElement("div");
        menuToggle.classList.add("ejs_menu_toggle");
        menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
        this.emulator.elements.parent.appendChild(menuToggle);
        this.emulator.elements.menuToggle = menuToggle;

        const menuToggleListener = () => {
            if (this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
                this.emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
            } else {
                this.emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
            }
        };

        this.emulator.addEventListener(menuToggle, "click", menuToggleListener);
    }

    createControlSettingMenu() {
        const body = this.emulator.createPopup("Control Settings", {
            "Reset": () => {
                this.emulator.controls = JSON.parse(JSON.stringify(this.emulator.defaultControllers));
                this.emulator.setupKeys();
                this.emulator.checkGamepadInputs();
                this.emulator.saveSettings();
            },
            "Clear": () => {
                this.emulator.controls = { 0: {}, 1: {}, 2: {}, 3: {} };
                this.emulator.setupKeys();
                this.emulator.checkGamepadInputs();
                this.emulator.saveSettings();
            },
            "Close": () => {
                this.emulator.controlMenu.style.display = "none";
            }
        }, true);
        body.classList.add("ejs_control_body");

        this.emulator.controlMenu = body.parentElement;

        // 创建控制器选择器
        for (let i = 0; i < 4; i++) {
            const controllerDiv = this.emulator.createElement("div");
            controllerDiv.classList.add("ejs_controller_div");
            controllerDiv.setAttribute("data-controller", i);

            const controllerTitle = this.emulator.createElement("div");
            controllerTitle.classList.add("ejs_controller_title");
            controllerTitle.innerHTML = `<h3>${this.emulator.localization("Controller")} ${i + 1}</h3>`;
            controllerDiv.appendChild(controllerTitle);

            // 键盘控制设置
            const keyboardDiv = this.emulator.createElement("div");
            keyboardDiv.classList.add("ejs_keyboard_controls");
            controllerDiv.appendChild(keyboardDiv);

            // 游戏手柄控制设置
            const gamepadDiv = this.emulator.createElement("div");
            gamepadDiv.classList.add("ejs_gamepad_controls");
            controllerDiv.appendChild(gamepadDiv);

            // 游戏手柄选择器
            const gamepadSelectDiv = this.emulator.createElement("div");
            gamepadSelectDiv.classList.add("ejs_gamepad_select_div");
            gamepadSelectDiv.innerHTML = `<h4>${this.emulator.localization("Gamepad")}</h4>`;

            const gamepadSelect = this.emulator.createElement("select");
            gamepadSelect.classList.add("ejs_gamepad_select");
            this.emulator.gamepadLabels.push(gamepadSelect);
            gamepadSelectDiv.appendChild(gamepadSelect);

            controllerDiv.appendChild(gamepadSelectDiv);

            body.appendChild(controllerDiv);
        }

        this.emulator.setupKeys();
        this.emulator.updateGamepadLabels();
    }

    createCheatsMenu() {
        const body = this.emulator.createPopup("Cheats", {
            "Close": () => {
                this.emulator.cheatMenu.style.display = "none";
            }
        }, true);
        body.classList.add("ejs_cheat_body");

        this.emulator.cheatMenu = body.parentElement;

        // 创建作弊码列表
        const cheatList = this.emulator.createElement("div");
        cheatList.classList.add("ejs_cheat_list");

        // 添加永久作弊码
        this.cheats.forEach((cheat, index) => {
            if (cheat.is_permanent) {
                const cheatDiv = this.emulator.createElement("div");
                cheatDiv.classList.add("ejs_cheat_div");

                const cheatCheckbox = this.emulator.createElement("input");
                cheatCheckbox.type = "checkbox";
                cheatCheckbox.checked = cheat.checked;
                cheatCheckbox.addEventListener("change", () => {
                    cheat.checked = cheatCheckbox.checked;
                    if (cheat.checked) {
                        this.emulator.gameManager.Module._EJS_AddCheat(cheat.code);
                    } else {
                        this.emulator.gameManager.Module._EJS_RemoveCheat(cheat.code);
                    }
                });

                const cheatLabel = this.emulator.createElement("label");
                cheatLabel.innerHTML = cheat.desc;

                cheatDiv.appendChild(cheatCheckbox);
                cheatDiv.appendChild(cheatLabel);
                cheatList.appendChild(cheatDiv);
            }
        });

        body.appendChild(cheatList);
        this.emulator.updateCheatUI();
    }

    createNetplayMenu() {
        if (!this.emulator.netplayEnabled) return;

        const body = this.emulator.createPopup("Netplay", {
            "Close": () => {
                this.emulator.netplayMenu.style.display = "none";
            }
        }, true);
        body.classList.add("ejs_netplay_body");

        this.emulator.netplayMenu = body.parentElement;

        // 创建网络游戏设置
        const netplayDiv = this.emulator.createElement("div");
        netplayDiv.classList.add("ejs_netplay_div");

        const netplayTitle = this.emulator.createElement("h3");
        netplayTitle.textContent = this.emulator.localization("Netplay Settings");
        netplayDiv.appendChild(netplayTitle);

        // 创建房间ID输入
        const roomIdDiv = this.emulator.createElement("div");
        roomIdDiv.classList.add("ejs_room_id_div");

        const roomIdLabel = this.emulator.createElement("label");
        roomIdLabel.textContent = this.emulator.localization("Room ID");

        const roomIdInput = this.emulator.createElement("input");
        roomIdInput.type = "text";
        roomIdInput.placeholder = this.emulator.localization("Enter Room ID");

        roomIdDiv.appendChild(roomIdLabel);
        roomIdDiv.appendChild(roomIdInput);
        netplayDiv.appendChild(roomIdDiv);

        // 创建创建房间按钮
        const createRoomButton = this.emulator.createElement("button");
        createRoomButton.classList.add("ejs_button");
        createRoomButton.textContent = this.emulator.localization("Create Room");
        createRoomButton.addEventListener("click", () => {
            this.emulator.netplay.createRoom();
        });

        netplayDiv.appendChild(createRoomButton);

        // 创建加入房间按钮
        const joinRoomButton = this.emulator.createElement("button");
        joinRoomButton.classList.add("ejs_button");
        joinRoomButton.textContent = this.emulator.localization("Join Room");
        joinRoomButton.addEventListener("click", () => {
            this.emulator.netplay.joinRoom(roomIdInput.value);
        });

        netplayDiv.appendChild(joinRoomButton);

        body.appendChild(netplayDiv);
    }

    open() {
        if (!this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
            this.emulator.elements.menu.classList.add("ejs_menu_bar_hidden");
        }
    }

    close() {
        if (this.emulator.elements.menu.classList.contains("ejs_menu_bar_hidden")) {
            this.emulator.elements.menu.classList.remove("ejs_menu_bar_hidden");
        }
    }
}
