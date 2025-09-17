import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import minify from '@node-minify/core';
import terser from '@node-minify/terser';
import cleanCSS from '@node-minify/clean-css';

// 构建模式
const BUILD_MODES = {
  STANDARD: 'standard',    // 标准模式 - 包含源文件和压缩文件
  MINIFIED: 'minified',    // 仅压缩模式 - 只包含压缩文件
  DEVELOPMENT: 'dev'       // 开发模式 - 只包含源文件
};

// 获取构建模式（从命令行参数或环境变量）
const buildMode = process.argv[2] || process.env.BUILD_MODE || BUILD_MODES.STANDARD;
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist-package');
const dataDir = path.join(rootDir, 'data');
const srcDir = path.join(rootDir, 'src');

console.log(`Building EmulatorJS package in ${buildMode} mode...`);

// 清理旧的构建目录
if (fs.existsSync(distDir)) {
  console.log('Cleaning old build directory...');
  fs.rmSync(distDir, { recursive: true });
}

// 创建新的构建目录
console.log('Creating build directory...');
fs.mkdirSync(distDir, { recursive: true });

// 复制 package.json 并修改它以适应发布
console.log('Preparing package.json...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// 为发布包创建一个精简的 package.json
const releasePackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: "src/index.js",
  module: "src/index.js",
  exports: {
    ".": {
      import: "./src/index.js",
      require: "./src/index.js"
    }
  },
  files: [
    "src",
    "data"
  ],
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  bugs: packageJson.bugs,
  homepage: packageJson.homepage
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(releasePackageJson, null, 2));

// 复制文档文件
console.log('Copying documentation files...');
copyDocumentation();

// 复制 src 目录
console.log('Copying src directory...');
copyDir(srcDir, path.join(distDir, 'src'));

// 构建 data 目录
console.log('Building data directory...');
await buildDataDirectory(dataDir, path.join(distDir, 'data'));

console.log(`Package build completed successfully in ${buildMode} mode!`);
console.log(`Package is ready at: ${distDir}`);

/**
 * 复制文档文件
 */
function copyDocumentation() {
  const filesToCopy = ['README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md'];
  
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
 * 构建 data 目录
 * @param {string} src - 源 data 目录
 * @param {string} dest - 目标 data 目录
 */
async function buildDataDirectory(src, dest) {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });
  
  // 根据构建模式处理文件
  switch (buildMode) {
    case BUILD_MODES.STANDARD:
      await buildStandardMode(src, dest);
      break;
    case BUILD_MODES.MINIFIED:
      await buildMinifiedMode(src, dest);
      break;
    case BUILD_MODES.DEVELOPMENT:
      await buildDevelopmentMode(src, dest);
      break;
    default:
      console.warn(`Unknown build mode: ${buildMode}, using standard mode`);
      await buildStandardMode(src, dest);
  }
}

/**
 * 标准模式构建 - 包含源文件和压缩文件
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
async function buildStandardMode(src, dest) {
  console.log('Building in standard mode (source + minified files)...');
  
  // 复制基本文件结构
  copyBasicStructure(src, dest);
  
  // 压缩资产
  await compressAssets(src, dest);
  
  // 复制源文件目录
  const srcSrc = path.join(src, 'src');
  const destSrc = path.join(dest, 'src');
  if (fs.existsSync(srcSrc)) {
    copyDir(srcSrc, destSrc);
  }
  
  console.log('Standard mode build completed');
}

/**
 * 仅压缩模式构建 - 只包含压缩文件
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
async function buildMinifiedMode(src, dest) {
  console.log('Building in minified mode (only minified files)...');
  
  // 复制基本文件结构（排除 src 目录）
  copyBasicStructure(src, dest, { excludeSrc: true });
  
  // 压缩资产
  await compressAssets(src, dest);
  
  // 移除源文件目录（如果存在）
  const destSrc = path.join(dest, 'src');
  if (fs.existsSync(destSrc)) {
    fs.rmSync(destSrc, { recursive: true });
  }
  
  console.log('Minified mode build completed');
}

/**
 * 开发模式构建 - 只包含源文件
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
async function buildDevelopmentMode(src, dest) {
  console.log('Building in development mode (only source files)...');
  
  // 复制基本文件结构
  copyBasicStructure(src, dest);
  
  // 复制源文件目录
  const srcSrc = path.join(src, 'src');
  const destSrc = path.join(dest, 'src');
  if (fs.existsSync(srcSrc)) {
    copyDir(srcSrc, destSrc);
  }
  
  // 创建空的压缩文件占位符（如果需要）
  createPlaceholderFiles(dest);
  
  console.log('Development mode build completed');
}

/**
 * 复制基本文件结构
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 * @param {Object} options - 选项
 */
function copyBasicStructure(src, dest, options = {}) {
  const { excludeSrc = false } = options;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    // 跳过 src 目录（如果指定了排除）
    if (excludeSrc && entry.name === 'src') {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // 复制特定目录
      if (['localization', 'cores', 'compression'].includes(entry.name)) {
        copyDir(srcPath, destPath);
      }
      // 对于其他目录，根据模式决定是否复制
      else if (!excludeSrc || entry.name !== 'src') {
        copyDir(srcPath, destPath);
      }
    } else {
      // 复制特定文件
      if (['loader.js', 'emulator.css', 'version.json'].includes(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * 创建占位符文件
 * @param {string} dest - 目标目录
 */
function createPlaceholderFiles(dest) {
  // 创建空的压缩文件占位符
  const minJsPath = path.join(dest, 'emulator.min.js');
  const minCssPath = path.join(dest, 'emulator.min.css');
  
  if (!fs.existsSync(minJsPath)) {
    fs.writeFileSync(minJsPath, '// Minified version will be generated during build process');
  }
  
  if (!fs.existsSync(minCssPath)) {
    fs.writeFileSync(minCssPath, '/* Minified version will be generated during build process */');
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
    if (fs.existsSync(srcDir)) {
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