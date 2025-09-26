// 用户界面模块 - 包含用户界面相关功能

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function createContextMenu() {
    const contextMenu = this.createElement("div");
    contextMenu.classList.add("ejs_context_menu");
    contextMenu.setAttribute("hidden", "");
    this.elements.contextmenu = contextMenu;

    const createHeading = (text) => {
        const heading = this.createElement("div");
        heading.classList.add("ejs_context_menu_heading");
        heading.innerText = this.localization(text);
        return heading;
    }

    const createButton = (text, func) => {
        const button = this.createElement("a");
        button.classList.add("ejs_context_menu_button");
        button.innerText = this.localization(text);
        this.addEventListener(button, "click", (e) => {
            e.preventDefault();
            func();
            contextMenu.setAttribute("hidden", "");
        })
        return button;
    };

    const spacer = this.createElement("div");
    spacer.classList.add("ejs_context_menu_spacer");

    // File menu
    contextMenu.appendChild(createHeading("File"));
    if (!this.config.buttonOpts || this.config.buttonOpts.restart !== false) {
        contextMenu.appendChild(createButton("Restart", () => {
            this.gameManager.restart();
        }));
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.close !== false) {
        contextMenu.appendChild(createButton("Exit", () => {
            this.destory();
        }));
    }

    // Save menu
    contextMenu.appendChild(spacer.cloneNode());
    contextMenu.appendChild(createHeading("Save"));
    if (!this.config.buttonOpts || this.config.buttonOpts.saveState !== false) {
        contextMenu.appendChild(createButton("Save State", () => {
            this.gameManager.saveState();
        }));
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.loadState !== false) {
        contextMenu.appendChild(createButton("Load State", () => {
            this.gameManager.loadState();
        }));
    }

    // Settings menu
    contextMenu.appendChild(spacer.cloneNode());
    contextMenu.appendChild(createHeading("Settings"));
    if (!this.config.buttonOpts || this.config.buttonOpts.settings !== false) {
        contextMenu.appendChild(createButton("Settings", () => {
            this.openSettingsMenu();
        }));
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.controls !== false) {
        contextMenu.appendChild(createButton("Controls", () => {
            this.openControlMenu();
        }));
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.cheats !== false) {
        contextMenu.appendChild(createButton("Cheats", () => {
            this.openCheatsMenu();
        }));
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.disk !== false) {
        contextMenu.appendChild(createButton("Change Disc", () => {
            this.openDiskMenu();
        }));
    }

    // Screenshot menu
    contextMenu.appendChild(spacer.cloneNode());
    contextMenu.appendChild(createHeading("Screenshot"));
    if (!this.config.buttonOpts || this.config.buttonOpts.screenshot !== false) {
        contextMenu.appendChild(createButton("Take Screenshot", () => {
            this.gameManager.screenshot();
        }));
    }

    // Record menu
    if (this.config.recorder !== false) {
        contextMenu.appendChild(spacer.cloneNode());
        contextMenu.appendChild(createHeading("Record"));
        if (!this.config.buttonOpts || this.config.buttonOpts.video !== false) {
            contextMenu.appendChild(createButton("Record Video", () => {
                this.recorder.toggle();
            }));
        }
    }

    this.elements.parent.appendChild(contextMenu);
}

export function createBottomMenuBar() {
    const bar = this.createElement("div");
    bar.classList.add("ejs_bottom_bar");

    const saveSavFiles = this.createElement("a");
    saveSavFiles.classList.add("ejs_bottom_bar_button");
    saveSavFiles.innerText = this.localization("Save");
    this.addEventListener(saveSavFiles, "click", () => {
        this.gameManager.saveSaveFiles();
        this.displayMessage(this.localization("Saved"));
    })

    const loadSavFiles = this.createElement("a");
    loadSavFiles.classList.add("ejs_bottom_bar_button");
    loadSavFiles.innerText = this.localization("Load");
    this.addEventListener(loadSavFiles, "click", async () => {
        const file = await this.selectFile(this.localization("Select save file to load"));
        const data = new Uint8Array(await file.arrayBuffer());
        const path = this.gameManager.getSaveFilePath();
        const paths = path.split("/");
        let cp = "";
        for (let i = 0; i < paths.length - 1; i++) {
            if (paths[i] === "") continue;
            cp += "/" + paths[i];
            if (!this.gameManager.FS.analyzePath(cp).exists) this.gameManager.FS.mkdir(cp);
        }
        if (this.gameManager.FS.analyzePath(path).exists) this.gameManager.FS.unlink(path);
        this.gameManager.FS.writeFile(path, data);
        this.gameManager.loadSaveFiles();
        this.displayMessage(this.localization("Loaded"));
    })

    const saveState = this.createElement("a");
    saveState.classList.add("ejs_bottom_bar_button");
    saveState.innerText = this.localization("Save State");
    this.addEventListener(saveState, "click", () => {
        this.gameManager.saveState();
        this.displayMessage(this.localization("Saved"));
    })

    const loadState = this.createElement("a");
    loadState.classList.add("ejs_bottom_bar_button");
    loadState.innerText = this.localization("Load State");
    this.addEventListener(loadState, "click", async () => {
        const file = await this.selectFile(this.localization("Select state file to load"));
        const data = new Uint8Array(await file.arrayBuffer());
        const path = "/states/load.state";
        const paths = path.split("/");
        let cp = "";
        for (let i = 0; i < paths.length - 1; i++) {
            if (paths[i] === "") continue;
            cp += "/" + paths[i];
            if (!this.gameManager.FS.analyzePath(cp).exists) this.gameManager.FS.mkdir(cp);
        }
        if (this.gameManager.FS.analyzePath(path).exists) this.gameManager.FS.unlink(path);
        this.gameManager.FS.writeFile(path, data);
        this.gameManager.loadState(path);
        this.displayMessage(this.localization("Loaded"));
    })

    const toggleFastForward = this.createElement("a");
    toggleFastForward.classList.add("ejs_bottom_bar_button");
    toggleFastForward.innerText = this.localization("Fast Forward");
    this.addEventListener(toggleFastForward, "click", () => {
        this.isFastForward = !this.isFastForward;
        this.gameManager.toggleFastForward(this.isFastForward);
        toggleFastForward.style.background = this.isFastForward ? "var(--ejs-primary-color)" : "";
    })

    const toggleSlowMotion = this.createElement("a");
    toggleSlowMotion.classList.add("ejs_bottom_bar_button");
    toggleSlowMotion.innerText = this.localization("Slow Motion");
    this.addEventListener(toggleSlowMotion, "click", () => {
        this.isSlowMotion = !this.isSlowMotion;
        this.gameManager.toggleSlowMotion(this.isSlowMotion);
        toggleSlowMotion.style.background = this.isSlowMotion ? "var(--ejs-primary-color)" : "";
    })

    const toggleRewind = this.createElement("a");
    toggleRewind.classList.add("ejs_bottom_bar_button");
    toggleRewind.innerText = this.localization("Rewind");
    this.addEventListener(toggleRewind, "click", () => {
        this.gameManager.toggleRewind(true);
        setTimeout(() => {
            this.gameManager.toggleRewind(false);
        }, 1000);
    })

    const fullscreen = this.createElement("a");
    fullscreen.classList.add("ejs_bottom_bar_button");
    fullscreen.innerText = this.localization("Fullscreen");
    this.addEventListener(fullscreen, "click", () => {
        this.toggleFullscreen();
    })

    const settings = this.createElement("a");
    settings.classList.add("ejs_bottom_bar_button");
    settings.innerText = this.localization("Settings");
    this.addEventListener(settings, "click", () => {
        this.openSettingsMenu();
    })

    const controls = this.createElement("a");
    controls.classList.add("ejs_bottom_bar_button");
    controls.innerText = this.localization("Controls");
    this.addEventListener(controls, "click", () => {
        this.openControlMenu();
    })

    const cheats = this.createElement("a");
    cheats.classList.add("ejs_bottom_bar_button");
    cheats.innerText = this.localization("Cheats");
    this.addEventListener(cheats, "click", () => {
        this.openCheatsMenu();
    })

    const disk = this.createElement("a");
    disk.classList.add("ejs_bottom_bar_button");
    disk.innerText = this.localization("Change Disc");
    this.addEventListener(disk, "click", () => {
        this.openDiskMenu();
    })

    const screenshot = this.createElement("a");
    screenshot.classList.add("ejs_bottom_bar_button");
    screenshot.innerText = this.localization("Screenshot");
    this.addEventListener(screenshot, "click", () => {
        this.gameManager.screenshot();
    })

    const record = this.createElement("a");
    record.classList.add("ejs_bottom_bar_button");
    record.innerText = this.localization("Record");
    this.addEventListener(record, "click", () => {
        this.recorder.toggle();
    })

    // Add buttons based on config
    if (!this.config.buttonOpts || this.config.buttonOpts.save !== false) {
        bar.appendChild(saveSavFiles);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.load !== false) {
        bar.appendChild(loadSavFiles);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.saveState !== false) {
        bar.appendChild(saveState);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.loadState !== false) {
        bar.appendChild(loadState);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.fastForward !== false) {
        bar.appendChild(toggleFastForward);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.slowMotion !== false) {
        bar.appendChild(toggleSlowMotion);
    }
    if (this.rewindEnabled && (!this.config.buttonOpts || this.config.buttonOpts.rewind !== false)) {
        bar.appendChild(toggleRewind);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.fullscreen !== false) {
        bar.appendChild(fullscreen);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.settings !== false) {
        bar.appendChild(settings);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.controls !== false) {
        bar.appendChild(controls);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.cheats !== false) {
        bar.appendChild(cheats);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.disk !== false) {
        bar.appendChild(disk);
    }
    if (!this.config.buttonOpts || this.config.buttonOpts.screenshot !== false) {
        bar.appendChild(screenshot);
    }
    if (this.config.recorder !== false && (!this.config.buttonOpts || this.config.buttonOpts.record !== false)) {
        bar.appendChild(record);
    }

    this.elements.parent.appendChild(bar);
    this.elements.bottomBar = {
        bar,
        saveSavFiles: [saveSavFiles],
        loadSavFiles: [loadSavFiles],
        saveState: [saveState],
        loadState: [loadState],
        toggleFastForward: [toggleFastForward],
        toggleSlowMotion: [toggleSlowMotion],
        toggleRewind: [toggleRewind],
        fullscreen: [fullscreen],
        settings: [settings],
        controls: [controls],
        cheats: [cheats],
        disk: [disk],
        screenshot: [screenshot],
        record: [record]
    };
}

export function createControlSettingMenu() {
    // 控制设置菜单实现
    console.log("Create control setting menu");
}

export function createCheatsMenu() {
    // 作弊菜单实现
    console.log("Create cheats menu");
}

export function openSettingsMenu() {
    // 打开设置菜单
    console.log("Open settings menu");
}

export function openControlMenu() {
    // 打开控制菜单
    console.log("Open control menu");
}

export function openCheatsMenu() {
    // 打开作弊菜单
    console.log("Open cheats menu");
}

export function openDiskMenu() {
    // 打开磁盘菜单
    console.log("Open disk menu");
}

export function toggleFullscreen(fullscreen) {
    // 切换全屏
    console.log("Toggle fullscreen");
}

export function selectFile(message) {
    // 选择文件
    console.log("Select file");
    return Promise.resolve();
}

export function handleResize() {
    // 处理大小调整
    console.log("Handle resize");
}