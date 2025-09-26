// 配置管理模块 - 包含配置管理相关功能

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function loadSettings() {
    // 加载设置
    console.log("Load settings");
}

export function saveSettings() {
    // 保存设置
    console.log("Save settings");
}

export function setupSettingsMenu() {
    // 设置菜单
    console.log("Setup settings menu");
}

export function updateCheatUI() {
    // 更新作弊UI
    console.log("Update cheat UI");
}

export function updateGamepadLabels() {
    // 更新游戏手柄标签
    console.log("Update gamepad labels");
}

export function checkSupportedOpts() {
    // 检查支持的选项
    console.log("Check supported options");
}

export function setupDisksMenu() {
    // 设置磁盘菜单
    console.log("Setup disks menu");
}

export function initControlVars() {
    // 初始化控制变量
    this.defaultControllers = {};
    this.controls = {};
    this.gamepadLabels = [];
    this.gamepadSelection = [];
}

export function buildButtonOptions(buttonOpts) {
    // 构建按钮选项
    return buttonOpts || {};
}

export function preGetSetting(setting) {
    // 预获取设置
    return null;
}

export function setColor(color) {
    if (typeof color !== "string") color = "";
    let getColor = function (color) {
        color = color.toLowerCase();
        if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
            if (color.length === 4) {
                let rv = "#";
                for (let i = 1; i < 4; i++) {
                    rv += color.slice(i, i + 1) + color.slice(i, i + 1);
                }
                color = rv;
            }
            let rv = [];
            for (let i = 1; i < 7; i += 2) {
                rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
            }
            return rv.join(", ");
        }
        return null;
    }
    if (!color || getColor(color) === null) {
        this.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
        return;
    }
    this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}