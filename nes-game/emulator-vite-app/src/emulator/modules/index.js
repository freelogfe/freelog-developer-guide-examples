// 模块入口文件

// 导入所有模块
import { EmulatorJS } from './core.js';
import { EJS_GameManager } from './gameManager.js';

// 导入功能模块
import * as fileDownloader from './fileDownloader.js';
import * as coreSystem from './coreSystem.js';
import * as uiManager from './uiManager.js';
import * as configManager from './configManager.js';
import * as utils from './utils.js';

// 将所有方法绑定到EmulatorJS类原型上
// 文件下载模块
Object.assign(EmulatorJS.prototype, fileDownloader);

// 核心系统模块
Object.assign(EmulatorJS.prototype, coreSystem);

// 用户界面模块
Object.assign(EmulatorJS.prototype, uiManager);

// 配置管理模块
Object.assign(EmulatorJS.prototype, configManager);

// 工具模块
Object.assign(EmulatorJS.prototype, utils);

// 导出所有内容
export {
    EmulatorJS,
    EJS_GameManager
};