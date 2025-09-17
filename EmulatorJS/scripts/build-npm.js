import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import minify from '@node-minify/core';
import terser from '@node-minify/terser';
import cleanCSS from '@node-minify/clean-css';

// 获取当前工作目录
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist-npm');
const dataDir = path.join(rootDir, 'data');
const srcDir = path.join(rootDir, 'src');

console.log('Building EmulatorJS npm package...');

// 清理旧的构建目录
if (fs.existsSync(distDir)) {
  console.log('Cleaning old build directory...');
  fs.rmSync(distDir, { recursive: true });
}

// 创建新的构建目录
console.log('Creating build directory...');
fs.mkdirSync(distDir, { recursive: true });

// 复制 package.json 并修改它以适应 npm 发布
console.log('Preparing package.json...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// 为 npm 包创建一个精简的 package.json
const npmPackageJson = {
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
  dependencies: packageJson.dependencies,
  optionalDependencies: packageJson.optionalDependencies
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(npmPackageJson, null, 2));

// 复制 README.md
console.log('Copying README.md...');
fs.copyFileSync(path.join(rootDir, 'README.md'), path.join(distDir, 'README.md'));

// 复制 LICENSE
console.log('Copying LICENSE...');
fs.copyFileSync(path.join(rootDir, 'LICENSE'), path.join(distDir, 'LICENSE'));

// 复制 src 目录
console.log('Copying src directory...');
copyDir(srcDir, path.join(distDir, 'src'));

// 构建和压缩 data 目录
console.log('Building and compressing data directory...');
await buildDataDirectory(dataDir, path.join(distDir, 'data'));

console.log('NPM package build completed successfully!');
console.log(`Package is ready at: ${distDir}`);

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