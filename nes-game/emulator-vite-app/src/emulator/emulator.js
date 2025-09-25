// EmulatorJS 主模块

// 导入所有子模块
import * as utils from './modules/utils.js';
import * as fileDownloader from './modules/fileDownloader.js';
import * as ui from './modules/ui.js';
import * as eventHandler from './modules/eventHandler.js';
import * as recorder from './modules/recorder.js';
import EmulatorJS, { initEmulator, checkForUpdates, destroy } from './modules/emulatorCore.js';

// 导出所有功能
const ejs = {
    // 核心功能
    init: initEmulator,
    checkForUpdates: checkForUpdates,
    destroy: destroy,
    
    // 工具函数
    utils: utils,
    
    // 文件下载
    fileDownloader: fileDownloader,
    
    // UI 功能
    ui: ui,
    
    // 事件处理
    eventHandler: eventHandler,
    
    // 录制功能
    recorder: recorder,
    
    // 版本信息
    version: "4.2.3",
    
    // 主要的模拟器函数
    EmulatorJS: EmulatorJS
};

// 添加一些全局方法到window对象，以便与原有代码兼容
ejs.getCores = utils.getCores;
ejs.getCore = utils.getCore;
ejs.requiresThreads = utils.requiresThreads;
ejs.requiresWebGL2 = utils.requiresWebGL2;
ejs.versionAsInt = utils.versionAsInt;

// 为了兼容性，保持原有的API结构
export default EmulatorJS;

// 导出所有其他功能
export { 
    utils,
    fileDownloader,
    ui,
    eventHandler,
    recorder,
    initEmulator,
    checkForUpdates,
    destroy
};

// 挂载到window对象，以便全局访问
if (typeof window !== 'undefined') {
    window.EmulatorJS = EmulatorJS;
    window.ejs = ejs;
    
    // 添加一些必要的全局辅助函数
    window.EJS_requireThreads = utils.requiresThreads;
    window.EJS_requireWebGL2 = utils.requiresWebGL2;
    window.EJS_getCores = utils.getCores;
    window.EJS_getCore = utils.getCore;
    window.EJS_versionAsInt = utils.versionAsInt;
}