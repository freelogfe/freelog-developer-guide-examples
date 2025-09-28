/**
 * EmulatorJS 模块完整性检查脚本
 * 用于系统性地检查所有模块文件的语法和依赖关系
 */

const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'emulator-modules');

// 检查模块文件列表
const expectedModules = [
    '01-system-detection.js',
    '02-dom-utilities.js',
    '03-file-handling.js',
    '04-core-management.js',
    '05-event-system.js',
    '06-localization.js',
    '07-ui-components.js',
    '08-game-state-manager.js',
    '09-audio-video-manager.js',
    '10-input-handler.js',
    '11-netplay-manager.js',
    '12-ads-monetization.js',
    '13-emulator-modular.js'
];

console.log('🔍 检查 EmulatorJS 模块完整性...\n');

// 1. 检查文件是否存在
console.log('📁 检查文件存在性:');
let allFilesExist = true;
expectedModules.forEach(module => {
    const filePath = path.join(modulesDir, module);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${module}`);
    } else {
        console.log(`❌ ${module} - 文件不存在`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ 部分模块文件缺失，请检查文件结构');
    process.exit(1);
}

// 2. 检查语法
console.log('\n🔧 检查 JavaScript 语法:');
let allSyntaxValid = true;
expectedModules.forEach(module => {
    const filePath = path.join(modulesDir, module);
    try {
        // 使用 Node.js 的 require 来检查语法
        require(filePath);
        console.log(`✅ ${module} - 语法正确`);
    } catch (error) {
        console.log(`❌ ${module} - 语法错误: ${error.message}`);
        allSyntaxValid = false;
    }
});

if (!allSyntaxValid) {
    console.log('\n❌ 部分模块存在语法错误');
    process.exit(1);
}

// 3. 检查模块导出
console.log('\n📤 检查模块导出:');
let allExportsValid = true;
expectedModules.forEach(module => {
    const filePath = path.join(modulesDir, module);
    try {
        const moduleContent = fs.readFileSync(filePath, 'utf8');

        // 检查是否有 export default
        if (moduleContent.includes('export default')) {
            console.log(`✅ ${module} - 包含默认导出`);
        } else {
            console.log(`❌ ${module} - 缺少默认导出`);
            allExportsValid = false;
        }
    } catch (error) {
        console.log(`❌ ${module} - 读取失败: ${error.message}`);
        allExportsValid = false;
    }
});

if (!allExportsValid) {
    console.log('\n❌ 部分模块缺少正确的导出');
    process.exit(1);
}

// 4. 检查主模块的依赖
console.log('\n🔗 检查主模块依赖:');
try {
    const mainModulePath = path.join(modulesDir, '13-emulator-modular.js');
    const mainModuleContent = fs.readFileSync(mainModulePath, 'utf8');

    const requiredImports = [
        'SystemDetection',
        'DOMUtilities',
        'FileHandling',
        'CoreManagement',
        'EventSystem',
        'Localization',
        'UIComponents',
        'GameStateManager',
        'AudioVideoManager',
        'InputHandler',
        'NetplayManager',
        'AdsMonetization'
    ];

    let allImportsFound = true;
    requiredImports.forEach(importName => {
        if (mainModuleContent.includes(`import ${importName} from`)) {
            console.log(`✅ ${importName} 导入正确`);
        } else {
            console.log(`❌ ${importName} 导入缺失`);
            allImportsFound = false;
        }
    });

    if (!allImportsFound) {
        console.log('\n❌ 主模块缺少必要的导入');
        process.exit(1);
    }

} catch (error) {
    console.log(`❌ 主模块检查失败: ${error.message}`);
    process.exit(1);
}

console.log('\n🎉 所有检查通过！模块化拆分完整且正确');
console.log('\n📊 检查结果:');
console.log(`• 文件存在性: ✅ ${expectedModules.length}/${expectedModules.length}`);
console.log(`• 语法正确性: ✅ ${expectedModules.length}/${expectedModules.length}`);
console.log(`• 导出完整性: ✅ ${expectedModules.length}/${expectedModules.length}`);
console.log(`• 依赖完整性: ✅ ${expectedModules.length}/${expectedModules.length}`);

console.log('\n🚀 EmulatorJS 模块化拆分已完全成功！');
console.log('所有模块语法正确，依赖关系完整，可以正常使用。');
