/**
 * EmulatorJS - Cheats Manager Module
 * 作弊码管理
 */

export class CheatsManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.cheats = [];
    }

    init() {
        // 初始化作弊码列表
        this.loadCheats();
    }

    loadCheats() {
        // 从配置加载作弊码
        if (Array.isArray(this.emulator.config.cheats)) {
            for (let i = 0; i < this.emulator.config.cheats.length; i++) {
                const cheat = this.emulator.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    });
                }
            }
        }
    }

    addCheat(desc, code, is_permanent = false) {
        this.cheats.push({
            desc: desc,
            checked: false,
            code: code,
            is_permanent: is_permanent
        });
    }

    removeCheat(index) {
        if (index >= 0 && index < this.cheats.length) {
            this.cheats.splice(index, 1);
        }
    }

    toggleCheat(index) {
        if (index >= 0 && index < this.cheats.length) {
            this.cheats[index].checked = !this.cheats[index].checked;
            this.applyCheats();
        }
    }

    applyCheats() {
        const enabledCheats = this.cheats.filter(cheat => cheat.checked);
        if (this.emulator.gameManager && this.emulator.gameManager.setCheat) {
            this.emulator.gameManager.setCheat(enabledCheats.map(cheat => cheat.code));
        }
    }

    getCheats() {
        return this.cheats;
    }

    getEnabledCheats() {
        return this.cheats.filter(cheat => cheat.checked);
    }

    clearCheats() {
        this.cheats = [];
        if (this.emulator.gameManager && this.emulator.gameManager.setCheat) {
            this.emulator.gameManager.setCheat([]);
        }
    }

    createCheatsMenu() {
        const menu = this.emulator.createElement("div");
        menu.style.padding = "20px";
        menu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        menu.style.color = "white";
        menu.style.borderRadius = "8px";
        menu.style.minWidth = "300px";

        const title = this.emulator.createElement("h3");
        title.innerText = "Cheats";
        title.style.marginBottom = "15px";
        title.style.color = "white";
        menu.appendChild(title);

        if (this.cheats.length === 0) {
            const noCheats = this.emulator.createElement("p");
            noCheats.innerText = "No cheats available";
            noCheats.style.color = "#ccc";
            menu.appendChild(noCheats);
        } else {
            this.cheats.forEach((cheat, index) => {
                const cheatItem = this.emulator.createElement("div");
                cheatItem.style.display = "flex";
                cheatItem.style.alignItems = "center";
                cheatItem.style.marginBottom = "10px";

                const checkbox = this.emulator.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = cheat.checked;
                checkbox.style.marginRight = "10px";
                this.emulator.addEventListener(checkbox, "change", () => {
                    this.toggleCheat(index);
                    checkbox.checked = cheat.checked;
                });

                const label = this.emulator.createElement("label");
                label.innerText = cheat.desc;
                label.style.flex = "1";
                label.style.cursor = "pointer";
                this.emulator.addEventListener(label, "click", () => {
                    checkbox.checked = !checkbox.checked;
                    this.toggleCheat(index);
                });

                cheatItem.appendChild(checkbox);
                cheatItem.appendChild(label);
                menu.appendChild(cheatItem);
            });
        }

        const buttons = this.emulator.createElement("div");
        buttons.style.marginTop = "15px";
        buttons.style.textAlign = "right";

        const clearButton = this.emulator.createElement("button");
        clearButton.innerText = "Clear All";
        clearButton.style.marginRight = "10px";
        clearButton.style.padding = "5px 10px";
        clearButton.style.backgroundColor = "#f44336";
        clearButton.style.color = "white";
        clearButton.style.border = "none";
        clearButton.style.borderRadius = "4px";
        clearButton.style.cursor = "pointer";
        this.emulator.addEventListener(clearButton, "click", () => {
            this.clearCheats();
            this.emulator.closePopup();
            this.createCheatsMenu();
        });

        const closeButton = this.emulator.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.padding = "5px 10px";
        closeButton.style.backgroundColor = "#2196F3";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "4px";
        closeButton.style.cursor = "pointer";
        this.emulator.addEventListener(closeButton, "click", () => {
            this.emulator.closePopup();
        });

        buttons.appendChild(clearButton);
        buttons.appendChild(closeButton);
        menu.appendChild(buttons);

        return menu;
    }

    showCheatsMenu() {
        const menu = this.createCheatsMenu();
        const popup = this.emulator.uiManager.createPopup("Cheats", {}, true);
        popup[1].appendChild(menu);
        this.emulator.game.appendChild(popup[0]);
        this.emulator.game.appendChild(popup[1]);
        this.emulator.currentPopup = popup[1];
    }

    validateCheatCode(code) {
        // 基本的作弊码验证
        if (typeof code !== "string") return false;
        if (code.length === 0) return false;
        
        // 检查是否是有效的十六进制代码
        const hexPattern = /^[0-9A-Fa-f]+$/;
        if (!hexPattern.test(code)) return false;
        
        return true;
    }

    parseCheatString(cheatString) {
        // 解析作弊码字符串
        const lines = cheatString.split('\n');
        const cheats = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    const desc = parts[0].trim();
                    const code = parts[1].trim();
                    if (this.validateCheatCode(code)) {
                        cheats.push({
                            desc: desc,
                            code: code,
                            checked: false,
                            is_permanent: false
                        });
                    }
                }
            }
        }
        
        return cheats;
    }

    importCheats(cheatString) {
        const importedCheats = this.parseCheatString(cheatString);
        this.cheats = [...this.cheats, ...importedCheats];
        return importedCheats.length;
    }

    exportCheats() {
        let exportString = "# EmulatorJS Cheats\n";
        exportString += "# Generated on " + new Date().toISOString() + "\n\n";
        
        for (const cheat of this.cheats) {
            exportString += `${cheat.desc}=${cheat.code}\n`;
        }
        
        return exportString;
    }
}
