/**
 * EmulatorJS - Main Entry Point
 * This file serves as the main entry point that integrates all the emulator modules
 */

import createEmulator, { getCores, requiresThreads, requiresWebGL2, getCore } from './emulator/emulatorCore.js';

// 创建默认导出
const EmulatorJS = {
  // 创建模拟器实例的主要方法
  create: function(config) {
    return createEmulator(config);
  },
  
  // 静态工具方法
  getCores: getCores,
  requiresThreads: requiresThreads,
  requiresWebGL2: requiresWebGL2,
  getCore: getCore
};

// 如果在浏览器环境中，挂载到window对象
export default EmulatorJS;

// 为了保持向后兼容性，导出所有必要的函数

// 确保在CommonJS环境中也能正常工作
if (typeof window !== 'undefined') {
  window.EmulatorJS = EmulatorJS;
}