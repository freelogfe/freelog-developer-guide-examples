import path from "path";
import { fileURLToPath } from "url";
import minify from "@node-minify/core";
import terser from "@node-minify/terser";
import cleanCSS from "@node-minify/clean-css";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../");

async function doMinify() {
    // List all JS files in the data/src directory explicitly
    const srcDir = path.join(rootPath, "data", "src");
    const jsFiles = fs.readdirSync(srcDir)
        .filter(file => path.extname(file) === ".js")
        .map(file => path.join(srcDir, file));
    
    console.log("Files to minify:", jsFiles);
    
    if (jsFiles.length === 0) {
        console.error("No JavaScript files found to minify");
        return;
    }
    
    await minify({
        compressor: terser,
        input: jsFiles,
        output: path.join(rootPath, "data", "emulator.min.js"),
    })
        .catch(function (err) {
            console.error("Error during JS minification:", err);
        })
        .then(function() {
            console.log("Minified JS");
        });
    await minify({
        compressor: cleanCSS,
        input: path.join(rootPath, "data", "emulator.css"),
        output: path.join(rootPath, "data", "emulator.min.css"),
    })
        .catch(function (err) {
            console.error("Error during CSS minification:", err);
        })
        .then(function() {
            console.log("Minified CSS");
        });
}

console.log("Minifying");
await doMinify();
console.log("Minifying Done!");