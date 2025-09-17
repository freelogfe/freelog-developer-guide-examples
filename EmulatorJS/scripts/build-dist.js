import fs from 'fs';
import path from 'path';
import minify from '@node-minify/core';
import terser from '@node-minify/terser';
import cleanCSS from '@node-minify/clean-css';

// 获取当前工作目录
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const dataDir = path.join(rootDir, 'data');
const srcDir = path.join(rootDir, 'src');

console.log('Building EmulatorJS distribution package...');

// 清理旧的构建目录
if (fs.existsSync(distDir)) {
  console.log('Cleaning old dist directory...');
  fs.rmSync(distDir, { recursive: true });
}

// 创建新的构建目录
console.log('Creating dist directory...');
fs.mkdirSync(distDir, { recursive: true });

// 复制 package.json 并修改它以适应发布
console.log('Preparing package.json for distribution...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// 为发布包创建 package.json
const distPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  type: "module",
  main: "index.js",
  module: "index.js",
  types: "index.d.ts",
  exports: {
    ".": {
      "import": "./index.js",
      "require": "./index.cjs",
      "types": "./index.d.ts"
    },
    "./package.json": "./package.json"
  },
  files: [
    "index.js",
    "index.cjs",
    "index.d.ts",
    "data",
    "README.md",
    "LICENSE"
  ],
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  bugs: packageJson.bugs,
  homepage: packageJson.homepage,
  sideEffects: false
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(distPackageJson, null, 2));

// 复制文档文件
console.log('Copying documentation files...');
copyDocumentation();

// 构建入口文件
console.log('Building entry files...');
buildEntryFiles();

// 复制类型定义文件
console.log('Copying type definitions...');
const srcTypes = path.join(srcDir, 'index.d.ts');
const distTypes = path.join(distDir, 'index.d.ts');
if (fs.existsSync(srcTypes)) {
  fs.copyFileSync(srcTypes, distTypes);
  console.log('Copied type definitions');
}

// 构建和压缩 data 目录
console.log('Building and compressing data directory...');
await buildDataDirectory(dataDir, path.join(distDir, 'data'));

console.log('Distribution package build completed successfully!');
console.log(`Package is ready at: ${distDir}`);

/**
 * 复制文档文件
 */
function copyDocumentation() {
  const filesToCopy = ['README.md', 'LICENSE', 'CONTRIBUTING.md'];
  
  filesToCopy.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file}`);
    }
  });
}

/**
 * 构建入口文件
 */
function buildEntryFiles() {
  // 创建 ESM 入口文件（从 src/index.js 复制并简化）
  const srcIndex = path.join(srcDir, 'index.js');
  const distIndex = path.join(distDir, 'index.js');
  if (fs.existsSync(srcIndex)) {
    fs.copyFileSync(srcIndex, distIndex);
    console.log('Created ESM entry file');
  }
  
  // 创建 CommonJS 入口文件
  const cjsEntry = `/**
 * EmulatorJS - CommonJS Bundle
 * 
 * This is the CommonJS entry point for the EmulatorJS npm package.
 */

const { EmulatorJS, createEmulator, destroyEmulator, EmulatorManager, emulatorManager } = require('./index.js');

module.exports = { EmulatorJS, createEmulator, destroyEmulator, EmulatorManager, emulatorManager };
module.exports.default = { EmulatorJS, createEmulator, destroyEmulator, EmulatorManager, emulatorManager };
`;

  fs.writeFileSync(path.join(distDir, 'index.cjs'), cjsEntry);
  console.log('Created CommonJS entry file');
}

/**
 * 构建和压缩 data 目录
 * @param {string} src - 源 data 目录
 * @param {string} dest - 目标 data 目录
 */
async function buildDataDirectory(src, dest) {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });
  
  // 复制不需要压缩的文件和目录
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // 跳过 src 目录，我们稍后会处理它
    if (entry.name === 'src') {
      continue;
    }
    
    if (entry.isDirectory()) {
      // 复制目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  // 压缩 JavaScript 和 CSS 文件
  await compressAssets(src, dest);
  
  // 复制本地化文件
  const localizationSrc = path.join(src, 'localization');
  const localizationDest = path.join(dest, 'localization');
  if (fs.existsSync(localizationSrc)) {
    copyDir(localizationSrc, localizationDest);
  }
  
  // 复制 cores 目录（如果存在）
  const coresSrc = path.join(src, 'cores');
  const coresDest = path.join(dest, 'cores');
  if (fs.existsSync(coresSrc)) {
    copyDir(coresSrc, coresDest);
  }
  
  // 复制 compression 目录（如果存在）
  const compressionSrc = path.join(src, 'compression');
  const compressionDest = path.join(dest, 'compression');
  if (fs.existsSync(compressionSrc)) {
    copyDir(compressionSrc, compressionDest);
  }
}

/**
 * 压缩 JavaScript 和 CSS 资产
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
async function compressAssets(src, dest) {
  try {
    // 压缩 JavaScript 文件
    const srcDir = path.join(src, 'src');
    const jsFiles = fs.readdirSync(srcDir)
      .filter(file => path.extname(file) === '.js')
      .map(file => path.join(srcDir, file));
    
    console.log('Minifying JavaScript files...');
    if (jsFiles.length > 0) {
      await minify({
        compressor: terser,
        input: jsFiles,
        output: path.join(dest, 'emulator.min.js'),
      });
      console.log('Minified JS successfully');
    } else {
      console.log('No JavaScript files found to minify');
    }
    
    // 压缩 CSS 文件
    const cssFile = path.join(src, 'emulator.css');
    if (fs.existsSync(cssFile)) {
      console.log('Minifying CSS file...');
      await minify({
        compressor: cleanCSS,
        input: cssFile,
        output: path.join(dest, 'emulator.min.css'),
      });
      console.log('Minified CSS successfully');
    } else {
      console.log('No CSS file found to minify');
    }
  } catch (error) {
    console.error('Error during minification:', error);
  }
}

/**
 * 递归复制目录
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}