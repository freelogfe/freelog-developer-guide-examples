// 模块入口文件 - 负责整合所有模块并导出

// 导入核心模块
import { EmulatorJS } from './core.js';
import { EJS_GameManager } from './gameManager.js';

// 导入功能模块
import * as fileDownloader from './fileDownloader.js';
import * as coreSystem from './coreSystem.js';
import * as uiManager from './uiManager.js';
import * as configManager from './configManager.js';
import * as utils from './utils.js';

// 将功能模块的方法绑定到EmulatorJS原型上
Object.assign(EmulatorJS.prototype, fileDownloader);
Object.assign(EmulatorJS.prototype, coreSystem);
Object.assign(EmulatorJS.prototype, uiManager);
Object.assign(EmulatorJS.prototype, configManager);
Object.assign(EmulatorJS.prototype, utils);

// 导出类
export { EmulatorJS, EJS_GameManager };

// 默认导出
export default EmulatorJS;