// 用户界面模块 - 包含用户界面相关功能

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function createContextMenu() {
    this.elements.contextmenu = this.createElement("div");
    this.elements.contextmenu.classList.add("ejs_context_menu");
    this.addEventListener(this.game, "contextmenu", (e) => {
        e.preventDefault();
        if ((this.config.buttonOpts && this.config.buttonOpts.rightClick === false) || !this.started) return;
        const parentRect = this.elements.parent.getBoundingClientRect();
        this.elements.contextmenu.style.display = "block";
        const rect = this.elements.contextmenu.getBoundingClientRect();
        const up = e.offsetY + rect.height > parentRect.height - 25;
        const left = e.offsetX + rect.width > parentRect.width - 5;
        this.elements.contextmenu.style.left = (e.offsetX - (left ? rect.width : 0)) + "px";
        this.elements.contextmenu.style.top = (e.offsetY - (up ? rect.height : 0)) + "px";
    })
    const hideMenu = () => {
        this.elements.contextmenu.style.display = "none";
    }
    this.addEventListener(this.elements.contextmenu, "contextmenu", (e) => e.preventDefault());
    this.addEventListener(this.elements.parent, "contextmenu", (e) => e.preventDefault());
    this.addEventListener(this.game, "mousedown touchend", hideMenu);
    const parent = this.createElement("ul");
    const addButton = (title, hidden, functi0n) => {
        //<li><a href="#" onclick="return false">'+title+'</a></li>
        const li = this.createElement("li");
        if (hidden) li.hidden = true;
        const a = this.createElement("a");
        if (functi0n instanceof Function) {
            this.addEventListener(li, "click", (e) => {
                e.preventDefault();
                functi0n();
            });
        }
        a.href = "#";
        a.onclick = "return false";
        a.innerText = this.localization(title);
        li.appendChild(a);
        parent.appendChild(li);
        hideMenu();
        return li;
    }
    let screenshotUrl;
    const screenshot = addButton("Take Screenshot", false, () => {
        if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
        const date = new Date();
        const fileName = this.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
        this.screenshot((blob, format) => {
            screenshotUrl = URL.createObjectURL(blob);
            const a = this.createElement("a");
            a.href = screenshotUrl;
            a.download = fileName + "." + format;
            a.click();
            hideMenu();
        });
    });

    let screenMediaRecorder = null;
    const startScreenRecording = addButton("Start Screen Recording", false, () => {
        if (screenMediaRecorder !== null) {
            screenMediaRecorder.stop();
        }
        screenMediaRecorder = this.screenRecord();
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

    if (!this.capture || !this.capture.video) {
        startScreenRecording.hidden = true;
    }

    const qSave = addButton("Quick Save", false, () => {
        const slot = this.getSettingValue("save-state-slot") ? this.getSettingValue("save-state-slot") : "1";
        if (this.gameManager.quickSave(slot)) {
            this.displayMessage(this.localization("SAVED STATE TO SLOT") + " " + slot);
        } else {
            this.displayMessage(this.localization("FAILED TO SAVE STATE"));
        }
        hideMenu();
    });

    const qLoad = addButton("Quick Load", false, () => {
        const slot = this.getSettingValue("save-state-slot") ? this.getSettingValue("save-state-slot") : "1";
        this.gameManager.quickLoad(slot);
        this.displayMessage(this.localization("LOADED STATE FROM SLOT") + " " + slot);
        hideMenu();
    });

    if (!this.gameManager.supportsStates()) {
        qSave.hidden = true;
        qLoad.hidden = true;
    }

    const ejsInfo = addButton("EmulatorJS v" + this.ejs_version, false, () => {
        hideMenu();
        // 这里应该打开一个弹窗显示EmulatorJS信息
        console.log("Show EmulatorJS info");
    });

    this.elements.contextmenu.appendChild(parent);
    this.game.appendChild(this.elements.contextmenu);
}

export function createBottomMenuBar() {
    // 底部菜单栏实现
    console.log("Create bottom menu bar");
}

export function createControlSettingMenu() {
    // 控制设置菜单实现
    console.log("Create control setting menu");
}

export function setupDisksMenu() {
    // 磁盘菜单设置实现
    console.log("Setup disks menu");
}

export function setupSettingsMenu() {
    // 设置菜单实现
    console.log("Setup settings menu");
}

export function loadSettings() {
    // 加载设置实现
    console.log("Load settings");
}

export function updateCheatUI() {
    // 更新作弊界面实现
    console.log("Update cheat UI");
}

export function updateGamepadLabels() {
    // 更新游戏手柄标签实现
    console.log("Update gamepad labels");
}