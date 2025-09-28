/**
 * Main EmulatorJS Class - Modular Version
 * Integrates all emulator modules into a single cohesive class
 */
import SystemDetection from './01-system-detection.js';
import DOMUtilities from './02-dom-utilities.js';
import FileHandling from './03-file-handling.js';
import CoreManagement from './04-core-management.js';
import EventSystem from './05-event-system.js';
import Localization from './06-localization.js';
import UIComponents from './07-ui-components.js';
import GameStateManager from './08-game-state-manager.js';
import AudioVideoManager from './09-audio-video-manager.js';
import InputHandler from './10-input-handler.js';
import NetplayManager from './11-netplay-manager.js';
import AdsMonetization from './12-ads-monetization.js';

export default class EmulatorJS {
    constructor(element, config) {
        // 完全按照原始emulator.js的执行顺序

        // 1. 初始化核心属性
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.initControlVars();  // 初始化控制器变量
        this.debug = (window.EJS_DEBUG_XX === true);
        if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;

        // Initialize button options definitions first
        this.defaultButtonOptions = {
            playPause: {
                visible: true,
                icon: "play",
                displayName: "Play/Pause"
            },
            play: {
                visible: true,
                icon: '<svg viewBox="0 0 320 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>',
                displayName: "Play"
            },
            pause: {
                visible: true,
                icon: '<svg viewBox="0 0 320 512"><path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/></svg>',
                displayName: "Pause"
            },
            restart: {
                visible: true,
                icon: '<svg viewBox="0 0 512 512"><path d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"/></svg>',
                displayName: "Restart"
            },
            mute: {
                visible: true,
                icon: '<svg viewBox="0 0 640 512"><path d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"/></svg>',
                displayName: "Mute"
            },
            unmute: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"/></svg>',
                displayName: "Unmute"
            },
            settings: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>',
                displayName: "Settings"
            },
            fullscreen: {
                visible: true,
                icon: "fullscreen",
                displayName: "Fullscreen"
            },
            enterFullscreen: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z"/></svg>',
                displayName: "Enter Fullscreen"
            },
            exitFullscreen: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272zM296 240h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.5 12.5-32.76 .0002-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-78.06 78.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C272 229.3 282.7 240 296 240z"/></svg>',
                displayName: "Exit Fullscreen"
            },
            saveState: {
                visible: true,
                icon: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>',
                displayName: "Save State"
            },
            loadState: {
                visible: true,
                icon: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"/></svg>',
                displayName: "Load State"
            },
            screenRecord: {
                visible: true
            },
            gamepad: {
                visible: true,
                icon: '<svg viewBox="0 0 640 512"><path fill="currentColor" d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg>',
                displayName: "Control Settings"
            },
            cheat: {
                visible: true,
                icon: '<svg viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
                displayName: "Cheats"
            },
            volumeSlider: {
                visible: true
            },
            saveSavFiles: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 6.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M8 3H16V8.4C16 8.73137 15.7314 9 15.4 9H8.6C8.26863 9 8 8.73137 8 8.4V3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M12 12H1M1 12L4 9M1 12L4 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                displayName: "Export Save File"
            },
            loadSavFiles: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 7.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M16 3V8.4C16 8.73137 15.7314 9 15.4 9H13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 3V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12H12M12 12L9 9M12 12L9 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                displayName: "Import Save File"
            },
            quickSave: {
                visible: true
            },
            quickLoad: {
                visible: true
            },
            screenshot: {
                visible: true
            },
            cacheManager: {
                visible: true,
                icon: '<svg viewBox="0 0 1800 1800"><path d="M896 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5T231 896 128 768V598q119 84 325 127t443 43zm0 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128v-170q119 84 325 127t443 43zm0-384q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128V982q119 84 325 127t443 43zM896 0q208 0 385 34.5t280 93.5 103 128v128q0 69-103 128t-280 93.5T896 640t-385-34.5T231 512 128 384V256q0-69 103-128t280-93.5T896 0z"/></svg>',
                displayName: "Cache Manager"
            },
            exitEmulation: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460"><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 14.000061 7.636414 L 14.000061 4.5 C 14.000061 4.223877 13.776123 3.999939 13.5 3.999939 L 4.5 3.999939 C 4.223877 3.999939 3.999939 4.223877 3.999939 4.5 L 3.999939 19.5 C 3.999939 19.776123 4.223877 20.000061 4.5 20.000061 L 13.5 20.000061 C 13.776123 20.000061 14.000061 19.776123 14.000061 19.5 L 14.000061 16.363586 " transform="matrix(21.333333,0,0,21.333333,0,0)"/><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 9.999939 12 L 21 12 M 21 12 L 18.000366 8.499939 M 21 12 L 18 15.500061 " transform="matrix(21.333333,0,0,21.333333,0,0)"/></svg>',
                displayName: "Exit Emulation"
            },
            netplay: {
                visible: false,
                icon: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M364.215 192h131.43c5.439 20.419 8.354 41.868 8.354 64s-2.915 43.581-8.354 64h-131.43c5.154-43.049 4.939-86.746 0-128zM185.214 352c10.678 53.68 33.173 112.514 70.125 151.992.221.001.44.008.661.008s.44-.008.661-.008c37.012-39.543 59.467-98.414 70.125-151.992H185.214zm174.13-192h125.385C452.802 84.024 384.128 27.305 300.95 12.075c30.238 43.12 48.821 96.332 58.394 147.925zm-27.35 32H180.006c-5.339 41.914-5.345 86.037 0 128h151.989c5.339-41.915 5.345-86.037-.001-128zM152.656 352H27.271c31.926 75.976 100.6 132.695 183.778 147.925-30.246-43.136-48.823-96.35-58.393-147.925zm206.688 0c-9.575 51.605-28.163 104.814-58.394 147.925 83.178-15.23 151.852-71.949 183.778-147.925H359.344zm-32.558-192c-10.678-53.68-33.174-112.514-70.125-151.992-.221 0-.44-.008-.661-.008s.44.008-.661.008C218.327 47.551 195.872 106.422 185.214 160h141.572zM16.355 192C10.915 212.419 8 233.868 8 256s2.915 43.581 8.355 64h131.43c-4.939-41.254-5.154-84.951 0-128H16.355zm136.301-32c9.575-51.602 28.161-104.81 58.394-147.925C127.872 27.305 59.198 84.024 27.271 160h125.385z"/></svg>',
                displayName: "Netplay"
            },
            diskButton: {
                visible: true,
                icon: '<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.109 473.109"><path d="M340.963,101.878H12.105C5.423,101.878,0,107.301,0,113.983v328.862c0,6.68,5.423,12.105,12.105,12.105h328.857 c6.685,0,12.104-5.426,12.104-12.105V113.983C353.067,107.301,347.647,101.878,340.963,101.878z M67.584,120.042h217.895v101.884 H67.584V120.042z M296.076,429.228H56.998V278.414h239.079V429.228z M223.947,135.173h30.269v72.638h-30.269V135.173z M274.13,315.741H78.933v-12.105H274.13V315.741z M274.13,358.109H78.933v-12.105H274.13V358.109z M274.13,398.965H78.933v-12.105 H274.13V398.965z M473.109,30.263v328.863c0,6.68-5.426,12.105-12.105,12.105H384.59v-25.724h31.528V194.694H384.59v-56.489h20.93 V36.321H187.625v43.361h-67.583v-49.42c0-6.682,5.423-12.105,12.105-12.105H461.01C467.695,18.158,473.109,23.581,473.109,30.263z M343.989,51.453h30.269v31.321c-3.18-1.918-6.868-3.092-10.853-3.092h-19.416V51.453z M394.177,232.021h-9.581v-12.105h9.581 V232.021z M384.59,262.284h9.581v12.105h-9.581V262.284z M384.59,303.14h9.581v12.104h-9.581V303.14z"/></svg>',
                displayName: "Disks"
            },
            contextMenu: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>',
                displayName: "Context Menu"
            }
        };
        this.defaultButtonAliases = {
            volume: "volumeSlider"
        };

        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);
        this.config.settingsLanguage = window.EJS_settingsLanguage || false;
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];

        // 2. 设置DOM元素
        this.setElements(element);
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

        // 3. 检测设备和浏览器
        this.isMobile = (function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        })();
        this.hasTouchScreen = (function () {
            if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
                if (navigator.maxTouchPoints > 0) {
                    return true;
                }
            } else {
                if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                    return true;
                } else if (window.TouchEvent || ("ontouchstart" in window)) {
                    return true;
                }
            }
            return false;
        })();

        // 4. 初始化Canvas和视频设置
        this.canvas = this.createElement("canvas");
        this.canvas.classList.add("ejs_canvas");
        this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
        this.videoRotationChanged = false;
        this.capture = this.capture || {};
        this.capture.photo = this.capture.photo || {};
        this.capture.photo.source = ["canvas", "retroarch"].includes(this.capture.photo.source) ? this.capture.photo.source : "canvas";
        this.capture.photo.format = (typeof this.capture.photo.format === "string") ? this.capture.photo.format : "png";
        this.capture.photo.upscale = (typeof this.capture.photo.upscale === "number") ? this.capture.photo.upscale : 1;
        this.capture.video = this.capture.video || {};
        this.capture.video.format = (typeof this.capture.video.format === "string") ? this.capture.video.format : "detect";
        this.capture.video.upscale = (typeof this.capture.video.upscale === "number") ? this.capture.video.upscale : 1;
        this.capture.video.fps = (typeof this.capture.video.fps === "number") ? this.capture.video.fps : 30;
        this.capture.video.videoBitrate = (typeof this.capture.video.videoBitrate === "number") ? this.capture.video.videoBitrate : 2.5 * 1024 * 1024;
        this.capture.video.audioBitrate = (typeof this.capture.video.audioBitrate === "number") ? this.capture.video.audioBitrate : 192 * 1024;

        // 5. 初始化事件监听器
        this.bindListeners();
        this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
        this.fullscreen = false;
        this.enableMouseLock = false;
        this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
        this.webgl2Enabled = (() => {
            let setting = this.preGetSetting("webgl2Enabled");
            if (setting === "disabled" || !this.supportsWebgl2) {
                return false;
            } else if (setting === "enabled") {
                return true;
            }
            return null;
        })();
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // 6. 初始化存储系统
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

        // 7. 设置游戏背景
        this.game.classList.add("ejs_game");
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }

        // 8. 处理作弊码
        if (Array.isArray(this.config.cheats)) {
            for (let i = 0; i < this.config.cheats.length; i++) {
                const cheat = this.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }

        // 9. 创建开始按钮和处理窗口大小
        this.createStartButton();
        this.handleResize();
    }

    /**
     * Initialize default controller variables
     */
    initControlVars() {
        this.defaultControllers = {
            0: {
                0: {
                    "value": "x",
                    "value2": "BUTTON_2"
                },
                1: {
                    "value": "s",
                    "value2": "BUTTON_4"
                },
                2: {
                    "value": "v",
                    "value2": "SELECT"
                },
                3: {
                    "value": "enter",
                    "value2": "START"
                },
                4: {
                    "value": "up arrow",
                    "value2": "DPAD_UP"
                },
                5: {
                    "value": "down arrow",
                    "value2": "DPAD_DOWN"
                },
                6: {
                    "value": "left arrow",
                    "value2": "DPAD_LEFT"
                },
                7: {
                    "value": "right arrow",
                    "value2": "DPAD_RIGHT"
                },
                8: {
                    "value": "z",
                    "value2": "BUTTON_1"
                },
                9: {
                    "value": "a",
                    "value2": "BUTTON_3"
                },
                10: {
                    "value": "q",
                    "value2": "LEFT_TOP_SHOULDER"
                },
                11: {
                    "value": "e",
                    "value2": "RIGHT_TOP_SHOULDER"
                },
                12: {
                    "value": "tab",
                    "value2": "LEFT_BOTTOM_SHOULDER"
                },
                13: {
                    "value": "r",
                    "value2": "RIGHT_BOTTOM_SHOULDER"
                },
                14: {
                    "value": "",
                    "value2": "LEFT_STICK"
                },
                15: {
                    "value": "",
                    "value2": "RIGHT_STICK"
                },
                16: {
                    "value": "h",
                    "value2": "LEFT_STICK_X:+1"
                },
                17: {
                    "value": "f",
                    "value2": "LEFT_STICK_X:-1"
                },
                18: {
                    "value": "g",
                    "value2": "LEFT_STICK_Y:+1"
                },
                19: {
                    "value": "t",
                    "value2": "LEFT_STICK_Y:-1"
                },
                20: {
                    "value": "l",
                    "value2": "RIGHT_STICK_X:+1"
                },
                21: {
                    "value": "j",
                    "value2": "RIGHT_STICK_X:-1"
                },
                22: {
                    "value": "k",
                    "value2": "RIGHT_STICK_Y:+1"
                },
                23: {
                    "value": "i",
                    "value2": "RIGHT_STICK_Y:-1"
                },
                24: {
                    "value": "1"
                },
                25: {
                    "value": "2"
                },
                26: {
                    "value": "3"
                },
                27: {},
                28: {},
                29: {},
            },
            1: {},
            2: {},
            3: {}
        }
        this.keyMap = {
            0: "",
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause/break",
            20: "caps lock",
            27: "escape",
            32: "space",
            33: "page up",
            34: "page down",
            35: "end",
            36: "home",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            45: "insert",
            46: "delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            91: "left window key",
            92: "right window key",
            93: "select key",
            96: "numpad 0",
            97: "numpad 1",
            98: "numpad 2",
            99: "numpad 3",
            100: "numpad 4",
            101: "numpad 5",
            102: "numpad 6",
            103: "numpad 7",
            104: "numpad 8",
            105: "numpad 9",
            106: "multiply",
            107: "add",
            109: "subtract",
            110: "decimal point",
            111: "divide",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "num lock",
            145: "scroll lock",
            186: "semi-colon",
            187: "equal sign",
            188: "comma",
            189: "dash",
            190: "period",
            191: "forward slash",
            192: "grave accent",
            219: "open bracket",
            220: "back slash",
            221: "close bracket",
            222: "single quote"
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules(element) {
        // Initialize modules
        this.systemDetection = new SystemDetection(this);
        this.domUtilities = new DOMUtilities(this);
        this.fileHandling = new FileHandling(this);
        this.coreManagement = new CoreManagement(this);
        this.eventSystem = new EventSystem(this);
        this.localization = new Localization(this);
        this.uiComponents = new UIComponents(this);
        this.gameStateManager = new GameStateManager(this);
        this.audioVideoManager = new AudioVideoManager(this);
        this.inputHandler = new InputHandler(this);
        this.netplayManager = new NetplayManager(this);
        this.adsMonetization = new AdsMonetization(this);

        // Bind localization method
        this.localizationModule = this.localization;
        this.localization = this.localization.localization.bind(this.localization);

        // Initialize capture settings
        this.audioVideoManager.initializeCaptureSettings();

        // Initialize input handler
        this.inputHandler.initializeInput();

        // Initialize ads from config
        this.adsMonetization.initializeFromConfig();

        // Set elements
        this.setElements(element);

        // Load settings
        this.gameStateManager.loadSettings();

        // Update cheat UI
        this.updateCheatUI();

        // Update gamepad labels
        this.updateGamepadLabels();

        // Set volume if not muted
        if (!this.muted) this.setVolume(this.volume);

        // Focus parent element if auto focus is enabled
        if (this.config.noAutoFocus !== true) this.elements.parent.focus();

        // Remove loading text
        this.textElem.remove();
        this.textElem = null;

        // Update game classes
        this.game.classList.remove("ejs_game");
        this.game.classList.add("ejs_canvas_parent");

        // Create context menu
        this.uiComponents.createContextMenu();

        // Create bottom menu bar
        this.uiComponents.createBottomMenuBar();

        // Create control setting menu
        this.createControlSettingMenu();

        // Create cheats menu
        this.createCheatsMenu();

        // Create netplay menu
        this.createNetplayMenu();

        // Set virtual gamepad
        this.setVirtualGamepad();

        // Bind listeners
        this.bindListeners();

        // Handle resize
        this.handleResize();

        // Call ready event
        this.callEvent("ready");
    }
            unmute: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"/></svg>',
                displayName: "Unmute"
            },
            settings: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>',
                displayName: "Settings"
            },
            fullscreen: {
                visible: true,
                icon: "fullscreen",
                displayName: "Fullscreen"
            },
            enterFullscreen: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z"/></svg>',
                displayName: "Enter Fullscreen"
            },
            exitFullscreen: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272zM296 240h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.5 12.5-32.76 .0002-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-78.06 78.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C272 229.3 282.7 240 296 240z"/></svg>',
                displayName: "Exit Fullscreen"
            },
            saveState: {
                visible: true,
                icon: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>',
                displayName: "Save State"
            },
            loadState: {
                visible: true,
                icon: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"/></svg>',
                displayName: "Load State"
            },
            screenRecord: {
                visible: true
            },
            gamepad: {
                visible: true,
                icon: '<svg viewBox="0 0 640 512"><path fill="currentColor" d="M480 96H160C71.6 96 0 167.6 0 256s71.6 160 160 160c44.8 0 85.2-18.4 114.2-48h91.5c29 29.6 69.5 48 114.2 48 88.4 0 160-71.6 160-160S568.4 96 480 96zM256 276c0 6.6-5.4 12-12 12h-52v52c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-52H76c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h52v-52c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h52c6.6 0 12 5.4 12 12v40zm184 68c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-80c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg>',
                displayName: "Control Settings"
            },
            cheat: {
                visible: true,
                icon: '<svg viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
                displayName: "Cheats"
            },
            volumeSlider: {
                visible: true
            },
            saveSavFiles: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 6.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M8 3H16V8.4C16 8.73137 15.7314 9 15.4 9H8.6C8.26863 9 8 8.73137 8 8.4V3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M12 12H1M1 12L4 9M1 12L4 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                displayName: "Export Save File"
            },
            loadSavFiles: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 7.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M16 3V8.4C16 8.73137 15.7314 9 15.4 9H13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 3V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12H12M12 12L9 9M12 12L9 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                displayName: "Import Save File"
            },
            quickSave: {
                visible: true
            },
            quickLoad: {
                visible: true
            },
            screenshot: {
                visible: true
            },
            cacheManager: {
                visible: true,
                icon: '<svg viewBox="0 0 1800 1800"><path d="M896 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5T231 896 128 768V598q119 84 325 127t443 43zm0 768q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128v-170q119 84 325 127t443 43zm0-384q237 0 443-43t325-127v170q0 69-103 128t-280 93.5-385 34.5-385-34.5-280-93.5-103-128V982q119 84 325 127t443 43zM896 0q208 0 385 34.5t280 93.5 103 128v128q0 69-103 128t-280 93.5T896 640t-385-34.5T231 512 128 384V256q0-69 103-128t280-93.5T896 0z"/></svg>',
                displayName: "Cache Manager"
            },
            exitEmulation: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460"><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 14.000061 7.636414 L 14.000061 4.5 C 14.000061 4.223877 13.776123 3.999939 13.5 3.999939 L 4.5 3.999939 C 4.223877 3.999939 3.999939 4.223877 3.999939 4.5 L 3.999939 19.5 C 3.999939 19.776123 4.223877 20.000061 4.5 20.000061 L 13.5 20.000061 C 13.776123 20.000061 14.000061 19.776123 14.000061 19.5 L 14.000061 16.363586 " transform="matrix(21.333333,0,0,21.333333,0,0)"/><path style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(255,255,255);stroke-opacity:1;stroke-miterlimit:4;" d="M 9.999939 12 L 21 12 M 21 12 L 18.000366 8.499939 M 21 12 L 18 15.500061 " transform="matrix(21.333333,0,0,21.333333,0,0)"/></svg>',
                displayName: "Exit Emulation"
            },
            netplay: {
                visible: false,
                icon: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M364.215 192h131.43c5.439 20.419 8.354 41.868 8.354 64s-2.915 43.581-8.354 64h-131.43c5.154-43.049 4.939-86.746 0-128zM185.214 352c10.678 53.68 33.173 112.514 70.125 151.992.221.001.44.008.661.008s.44-.008.661-.008c37.012-39.543 59.467-98.414 70.125-151.992H185.214zm174.13-192h125.385C452.802 84.024 384.128 27.305 300.95 12.075c30.238 43.12 48.821 96.332 58.394 147.925zm-27.35 32H180.006c-5.339 41.914-5.345 86.037 0 128h151.989c5.339-41.915 5.345-86.037-.001-128zM152.656 352H27.271c31.926 75.976 100.6 132.695 183.778 147.925-30.246-43.136-48.823-96.35-58.393-147.925zm206.688 0c-9.575 51.605-28.163 104.814-58.394 147.925 83.178-15.23 151.852-71.949 183.778-147.925H359.344zm-32.558-192c-10.678-53.68-33.174-112.514-70.125-151.992-.221 0-.44-.008-.661-.008s-.44.008-.661.008C218.327 47.551 195.872 106.422 185.214 160h141.572zM16.355 192C10.915 212.419 8 233.868 8 256s2.915 43.581 8.355 64h131.43c-4.939-41.254-5.154-84.951 0-128H16.355zm136.301-32c9.575-51.602 28.161-104.81 58.394-147.925C127.872 27.305 59.198 84.024 27.271 160h125.385z"/></svg>',
                displayName: "Netplay"
            },
            diskButton: {
                visible: true,
                icon: '<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.109 473.109"><path d="M340.963,101.878H12.105C5.423,101.878,0,107.301,0,113.983v328.862c0,6.68,5.423,12.105,12.105,12.105h328.857 c6.685,0,12.104-5.426,12.104-12.105V113.983C353.067,107.301,347.647,101.878,340.963,101.878z M67.584,120.042h217.895v101.884 H67.584V120.042z M296.076,429.228H56.998V278.414h239.079V429.228z M223.947,135.173h30.269v72.638h-30.269V135.173z M274.13,315.741H78.933v-12.105H274.13V315.741z M274.13,358.109H78.933v-12.105H274.13V358.109z M274.13,398.965H78.933v-12.105 H274.13V398.965z M473.109,30.263v328.863c0,6.68-5.426,12.105-12.105,12.105H384.59v-25.724h31.528V194.694H384.59v-56.489h20.93 V36.321H187.625v43.361h-67.583v-49.42c0-6.682,5.423-12.105,12.105-12.105H461.01C467.695,18.158,473.109,23.581,473.109,30.263z M343.989,51.453h30.269v31.321c-3.18-1.918-6.868-3.092-10.853-3.092h-19.416V51.453z M394.177,232.021h-9.581v-12.105h9.581 V232.021z M384.59,262.284h9.581v12.105h-9.581V262.284z M384.59,303.14h9.581v12.104h-9.581V303.14z"/></svg>',
                displayName: "Disks"
            },
            contextMenu: {
                visible: true,
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>',
                displayName: "Context Menu"
            }
        };
        this.defaultButtonAliases = {
            volume: "volumeSlider"
        };

        this.config.settingsLanguage = window.EJS_settingsLanguage || false;
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];
        this.textElem = null;
        this.canvas = null;
        this.virtualGamepad = null;
        this.game = null;
        this.elements = {};
        this.storage = {};
        this.resetTimeout = null;
        this.videoRotation = 0;
        this.videoRotationChanged = false;
        this.startButton = null;
        this.gameManager = null;
        this.Module = null;
        this.fileName = null;
        this.compression = null;
        this.defaultCoreOpts = {};
        this.saveFileExt = null;
        this.coreName = null;
        this.repository = null;
        this.isNetplay = false;
        this.ignoreEvents = false;
        this.settingsLoaded = false;
        this.settings = {};
        this.allSettings = {};
        this.controls = { 0: {}, 1: {}, 2: {}, 3: {} };
        this.controllers = { 0: {}, 1: {}, 2: {}, 3: {} };
        this.controlPopup = null;
        this.controlMenu = null;
        this.gamepadLabels = [];
        this.gamepadSelection = [];
        this.keyMap = {};
        this.settingsMenu = null;
        this.settingsMenuOpen = false;
        this.disksMenuOpen = false;
        this.diskParent = null;
        this.menu = {
            open: () => {
                this.elements.menu.style.display = "";
            },
            close: () => {
                this.elements.menu.style.display = "none";
            },
            toggle: () => {
                if (this.elements.menu.style.display === "none") {
                    this.elements.menu.style.display = "";
                } else {
                    this.elements.menu.style.display = "none";
                }
            },
            failedToStart: () => {
                // Handle failed to start scenario
            }
        };
        this.capture = {};
        this.capture.photo = {};
        this.capture.video = {};
        this.screenMediaRecorder = null;
        this.functions = {};
        this.msgElem = null;
        this.msgTimeout = null;
        this.cheatMenu = null;
        this.netplayMenu = null;

        // Initialize button options after basic setup
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);

        // Initialize modules first
        this.initializeModules(element);

        // Initialize storage system
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

        // Setup game background
        this.game.classList.add("ejs_game");
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }

        // Process cheats if provided
        if (Array.isArray(this.config.cheats)) {
            for (let i = 0; i < this.config.cheats.length; i++) {
                const cheat = this.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }

        // Initialize storage system
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

        // Setup game background
        this.game.classList.add("ejs_game");
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }

        // Process cheats if provided
        if (Array.isArray(this.config.cheats)) {
            for (let i = 0; i < this.config.cheats.length; i++) {
                const cheat = this.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }

        // Create start button and handle resize
        this.startButton = this.createStartButton();
        this.handleResize();
    }

    /**
     * Initialize default controller variables
     */
    initControlVars() {
        this.defaultControllers = {
            0: {
                0: {
                    "value": "x",
                    "value2": "BUTTON_2"
                },
                1: {
                    "value": "s",
                    "value2": "BUTTON_4"
                },
                2: {
                    "value": "v",
                    "value2": "SELECT"
                },
                3: {
                    "value": "enter",
                    "value2": "START"
                },
                4: {
                    "value": "up arrow",
                    "value2": "DPAD_UP"
                },
                5: {
                    "value": "down arrow",
                    "value2": "DPAD_DOWN"
                },
                6: {
                    "value": "left arrow",
                    "value2": "DPAD_LEFT"
                },
                7: {
                    "value": "right arrow",
                    "value2": "DPAD_RIGHT"
                },
                8: {
                    "value": "z",
                    "value2": "BUTTON_1"
                },
                9: {
                    "value": "a",
                    "value2": "BUTTON_3"
                },
                10: {
                    "value": "q",
                    "value2": "LEFT_TOP_SHOULDER"
                },
                11: {
                    "value": "e",
                    "value2": "RIGHT_TOP_SHOULDER"
                },
                12: {
                    "value": "tab",
                    "value2": "LEFT_BOTTOM_SHOULDER"
                },
                13: {
                    "value": "r",
                    "value2": "RIGHT_BOTTOM_SHOULDER"
                },
                14: {
                    "value": "",
                    "value2": "LEFT_STICK",
                },
                15: {
                    "value": "",
                    "value2": "RIGHT_STICK",
                },
                16: {
                    "value": "h",
                    "value2": "LEFT_STICK_X:+1"
                },
                17: {
                    "value": "f",
                    "value2": "LEFT_STICK_X:-1"
                },
                18: {
                    "value": "g",
                    "value2": "LEFT_STICK_Y:+1"
                },
                19: {
                    "value": "t",
                    "value2": "LEFT_STICK_Y:-1"
                },
                20: {
                    "value": "l",
                    "value2": "RIGHT_STICK_X:+1"
                },
                21: {
                    "value": "j",
                    "value2": "RIGHT_STICK_X:-1"
                },
                22: {
                    "value": "k",
                    "value2": "RIGHT_STICK_Y:+1"
                },
                23: {
                    "value": "i",
                    "value2": "RIGHT_STICK_Y:-1"
                },
                24: {
                    "value": "1"
                },
                25: {
                    "value": "2"
                },
                26: {
                    "value": "3"
                },
                27: {},
                28: {},
                29: {},
            },
            1: {},
            2: {},
            3: {}
        }
        this.keyMap = {
            0: "",
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause/break",
            20: "caps lock",
            27: "escape",
            32: "space",
            33: "page up",
            34: "page down",
            35: "end",
            36: "home",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            45: "insert",
            46: "delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            91: "left window key",
            92: "right window key",
            93: "select key",
            96: "numpad 0",
            97: "numpad 1",
            98: "numpad 2",
            99: "numpad 3",
            100: "numpad 4",
            101: "numpad 5",
            102: "numpad 6",
            103: "numpad 7",
            104: "numpad 8",
            105: "numpad 9",
            106: "multiply",
            107: "add",
            109: "subtract",
            110: "decimal point",
            111: "divide",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "num lock",
            145: "scroll lock",
            186: "semi-colon",
            187: "equal sign",
            188: "comma",
            189: "dash",
            190: "period",
            191: "forward slash",
            192: "grave accent",
            219: "open bracket",
            220: "back slash",
            221: "close bracket",
            222: "single quote"
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules(element) {
        // Initialize modules
        this.systemDetection = new SystemDetection(this);
        this.domUtilities = new DOMUtilities(this);
        this.fileHandling = new FileHandling(this);
        this.coreManagement = new CoreManagement(this);
        this.eventSystem = new EventSystem(this);
        this.localization = new Localization(this);
        this.uiComponents = new UIComponents(this);
        this.gameStateManager = new GameStateManager(this);
        this.audioVideoManager = new AudioVideoManager(this);
        this.inputHandler = new InputHandler(this);
        this.netplayManager = new NetplayManager(this);
        this.adsMonetization = new AdsMonetization(this);

        // Bind localization method
        this.localizationModule = this.localization;
        this.localization = this.localization.localization.bind(this.localization);

        // Initialize capture settings
        this.audioVideoManager.initializeCaptureSettings();

        // Initialize input handler
        this.inputHandler.initializeInput();

        // Initialize ads from config
        this.adsMonetization.initializeFromConfig();

        // Set elements
        this.setElements(element);
    }

    /**
     * Initialize the emulator
     */
    async initialize() {
        // Initialize system properties
        this.initializeSystemProperties();

        // Initialize storage
        this.initializeStorage();

        // Setup game background
        this.setupGameBackground();

        // Initialize cheats
        this.initializeCheats();

        // Create start button
        this.startButton = this.createStartButton();

        // Initialize canvas
        this.initializeCanvas();

        // Setup settings menu
        this.setupSettingsMenu();

        // Load settings
        this.gameStateManager.loadSettings();

        // Update cheat UI
        this.updateCheatUI();

        // Update gamepad labels
        this.updateGamepadLabels();

        // Set volume if not muted
        if (!this.muted) this.setVolume(this.volume);

        // Focus parent element if auto focus is enabled
        if (this.config.noAutoFocus !== true) this.elements.parent.focus();

        // Remove loading text
        this.textElem.remove();
        this.textElem = null;

        // Update game classes
        this.game.classList.remove("ejs_game");
        this.game.classList.add("ejs_canvas_parent");

        // Create context menu
        this.uiComponents.createContextMenu();

        // Create bottom menu bar
        this.uiComponents.createBottomMenuBar();

        // Create control setting menu
        this.createControlSettingMenu();

        // Create cheats menu
        this.createCheatsMenu();

        // Create netplay menu
        this.createNetplayMenu();

        // Set virtual gamepad
        this.setVirtualGamepad();

        // Bind listeners
        this.bindListeners();

        // Handle resize
        this.handleResize();

        // Call ready event
        this.callEvent("ready");
    }

    // Delegate methods to appropriate modules
    getCores() {
        let rv = {
            "atari5200": ["a5200"],
            "vb": ["beetle_vb"],
            "nds": ["melonds", "desmume", "desmume2015"],
            "arcade": ["fbneo", "fbalpha2012_cps1", "fbalpha2012_cps2"],
            "nes": ["fceumm", "nestopia"],
            "gb": ["gambatte"],
            "coleco": ["gearcoleco"],
            "segaMS": ["smsplus", "genesis_plus_gx", "picodrive"],
            "segaMD": ["genesis_plus_gx", "picodrive"],
            "segaGG": ["genesis_plus_gx"],
            "segaCD": ["genesis_plus_gx", "picodrive"],
            "sega32x": ["picodrive"],
            "sega": ["genesis_plus_gx", "picodrive"],
            "lynx": ["handy"],
            "mame": ["mame2003_plus", "mame2003"],
            "ngp": ["mednafen_ngp"],
            "pce": ["mednafen_pce"],
            "pcfx": ["mednafen_pcfx"],
            "psx": ["pcsx_rearmed", "mednafen_psx_hw"],
            "ws": ["mednafen_wswan"],
            "gba": ["mgba"],
            "n64": ["mupen64plus_next", "parallel_n64"],
            "3do": ["opera"],
            "psp": ["ppsspp"],
            "atari7800": ["prosystem"],
            "snes": ["snes9x"],
            "atari2600": ["stella2014"],
            "jaguar": ["virtualjaguar"],
            "segaSaturn": ["yabause"],
            "amiga": ["puae"],
            "c64": ["vice_x64sc"],
            "c128": ["vice_x128"],
            "pet": ["vice_xpet"],
            "plus4": ["vice_xplus4"],
            "vic20": ["vice_xvic"],
            "dos": ["dosbox_pure"]
        };
        if (this.isSafari && this.isMobile) {
            rv.n64 = rv.n64.reverse();
        }
        return rv;
    }

    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }

    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }

    getCore(generic) {
        const cores = this.getCores();
        const core = this.config.system;
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
            return core;
        }
        const gen = this.getCore(true);
        if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
            return this.preGetSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return core;
    }

    checkForUpdates() {
        return this.systemDetection.checkForUpdates();
    }

    versionAsInt(ver) {
        return this.systemDetection.versionAsInt(ver);
    }

    createElement(type) {
        return this.domUtilities.createElement(type);
    }

    addEventListener(element, listener, callback) {
        return this.domUtilities.addEventListener(element, listener, callback);
    }

    removeEventListener(data) {
        return this.domUtilities.removeEventListener(data);
    }

    downloadFile(path, progressCB, notWithPath, opts) {
        return this.fileHandling.downloadFile(path, progressCB, notWithPath, opts);
    }

    toData(data, rv) {
        return this.fileHandling.toData(data, rv);
    }

    checkCompression(data, msg, fileCbFunc) {
        return this.fileHandling.checkCompression(data, msg, fileCbFunc);
    }

    getBaseFileName(force) {
        return this.fileHandling.getBaseFileName(force);
    }

    saveInBrowserSupported() {
        return this.fileHandling.saveInBrowserSupported();
    }

    localization(text, log) {
        return this.fileHandling.localization(text, log);
    }

    initGameCore(js, wasm, thread) {
        return this.coreManagement.initGameCore(js, wasm, thread);
    }

    startGame() {
        return this.coreManagement.startGame();
    }

    checkStarted() {
        return this.coreManagement.checkStarted();
    }

    checkSupportedOpts() {
        return this.coreManagement.checkSupportedOpts();
    }

    getSavExt() {
        return this.coreManagement.getSavExt();
    }

    restart() {
        return this.coreManagement.restart();
    }

    pause() {
        return this.coreManagement.pause();
    }

    play() {
        return this.coreManagement.play();
    }

    fastForward() {
        return this.coreManagement.fastForward();
    }

    slowMotion() {
        return this.coreManagement.slowMotion();
    }

    rewind() {
        return this.coreManagement.rewind();
    }

    quickSave(slot = "1") {
        return this.coreManagement.quickSave(slot);
    }

    quickLoad(slot = "1") {
        return this.coreManagement.quickLoad(slot);
    }

    getDiskCount() {
        return this.coreManagement.getDiskCount();
    }

    switchDisk(disk) {
        return this.coreManagement.switchDisk(disk);
    }

    getCoreInfo() {
        return this.coreManagement.getCoreInfo();
    }

    getGameManager() {
        return this.coreManagement.getGameManager();
    }

    getModule() {
        return this.coreManagement.getModule();
    }

    isRunning() {
        return this.coreManagement.isRunning();
    }

    getGameState() {
        return this.coreManagement.getGameState();
    }

    setGameOption(option, value) {
        return this.coreManagement.setGameOption(option, value);
    }

    getGameOption(option) {
        return this.coreManagement.getGameOption(option);
    }

    saveGameSettings() {
        return this.coreManagement.saveGameSettings();
    }

    loadGameSettings() {
        return this.coreManagement.loadGameSettings();
    }

    reset() {
        return this.coreManagement.reset();
    }

    hardReset() {
        return this.coreManagement.hardReset();
    }

    on(event, func) {
        return this.eventSystem.on(event, func);
    }

    callEvent(event, data) {
        return this.eventSystem.callEvent(event, data);
    }

    off(event, func) {
        return this.eventSystem.off(event, func);
    }

    removeAllListeners(event) {
        return this.eventSystem.removeAllListeners(event);
    }

    listenerCount(event) {
        return this.eventSystem.listenerCount(event);
    }

    eventNames() {
        return this.eventSystem.eventNames();
    }

    hasListeners(event) {
        return this.eventSystem.hasListeners(event);
    }

    waitFor(event) {
        return this.eventSystem.waitFor(event);
    }

    once(event, func) {
        return this.eventSystem.once(event, func);
    }

    onMultiple(events, func) {
        return this.eventSystem.onMultiple(events, func);
    }

    offMultiple(events, func) {
        return this.eventSystem.offMultiple(events, func);
    }

    clear() {
        return this.eventSystem.clear();
    }

    getDebugInfo() {
        return this.eventSystem.getDebugInfo();
    }

    setVolume(volume) {
        return this.audioVideoManager.setVolume(volume);
    }

    mute() {
        return this.audioVideoManager.mute();
    }

    unmute() {
        return this.audioVideoManager.unmute();
    }

    getVolume() {
        return this.audioVideoManager.getVolume();
    }

    isMuted() {
        return this.audioVideoManager.isMuted();
    }

    takeScreenshot(source = "canvas", format = "png", upscale = 1) {
        return this.audioVideoManager.takeScreenshot(source, format, upscale);
    }

    startScreenRecording() {
        return this.audioVideoManager.startScreenRecording();
    }

    stopScreenRecording() {
        return this.audioVideoManager.stopScreenRecording();
    }

    screenRecord() {
        return this.audioVideoManager.screenRecord();
    }

    collectScreenRecordingMediaTracks() {
        return this.audioVideoManager.collectScreenRecordingMediaTracks();
    }

    quickSave(slot = "1") {
        return this.gameStateManager.quickSave(slot);
    }

    quickLoad(slot = "1") {
        return this.gameStateManager.quickLoad(slot);
    }

    saveSettings() {
        return this.gameStateManager.saveSettings();
    }

    getSettingValue(setting) {
        return this.gameStateManager.getSettingValue(setting);
    }

    setSettingValue(setting, value) {
        return this.gameStateManager.setSettingValue(setting, value);
    }

    getLocalStorageKey() {
        let identifier = (this.config.gameId || 1) + "-" + this.getCore(true);
        if (typeof this.config.gameName === "string") {
            identifier += "-" + this.config.gameName;
        } else if (typeof this.config.gameUrl === "string" && !this.config.gameUrl.toLowerCase().startsWith("blob:")) {
            identifier += "-" + this.config.gameUrl;
        } else if (this.config.gameUrl instanceof File) {
            identifier += "-" + this.config.gameUrl.name;
        }
        return identifier;
    }

    getCoreSettings() {
        return this.gameStateManager.getCoreSettings();
    }

    loadSettings() {
        return this.gameStateManager.loadSettings();
    }

    saveStateToBrowser(state) {
        return this.gameStateManager.saveStateToBrowser(state);
    }

    loadStateFromBrowser() {
        return this.gameStateManager.loadStateFromBrowser();
    }

    createNetplayRoom(playerName = "Player 1") {
        return this.netplayManager.createRoom(playerName);
    }

    joinNetplayRoom(roomId, playerName = "Player 2") {
        return this.netplayManager.joinRoom(roomId, playerName);
    }

    leaveNetplayRoom() {
        return this.netplayManager.leaveRoom();
    }

    getNetplayStatus() {
        return this.netplayManager.getConnectionStatus();
    }

    setupAds(ads, width, height) {
        return this.adsMonetization.setupAds(ads, width, height);
    }

    adBlocked(url, del) {
        return this.adsMonetization.adBlocked(url, del);
    }

    checkAdBlock() {
        return this.adsMonetization.checkAdBlock();
    }

    enableAdBlockDetection() {
        return this.adsMonetization.enableAdBlockDetection();
    }

    // Additional methods that need to be implemented
    destory() {
        if (!this.started) return;
        this.callEvent("exit");
    }

    buildButtonOptions(buttonUserOpts) {
        let mergedButtonOptions = this.defaultButtonOptions;

        // merge buttonUserOpts with mergedButtonOptions
        if (buttonUserOpts) {
            for (const key in buttonUserOpts) {
                let searchKey = key;
                // If the key is an alias, find the actual key in the default buttons
                if (this.defaultButtonAliases[key]) {
                    // Use the alias to find the actual key
                    // and update the searchKey to the actual key
                    searchKey = this.defaultButtonAliases[key];
                }

                // prevent the contextMenu button from being overridden
                if (searchKey === "contextMenu")
                    continue;

                // Check if the button exists in the default buttons, and update its properties
                if (!mergedButtonOptions[searchKey]) {
                    console.warn(`Button "${searchKey}" is not a valid button.`);
                    continue;
                }

                // if the value is a boolean, set the visible property to the value
                if (typeof buttonUserOpts[searchKey] === "boolean") {
                    mergedButtonOptions[searchKey].visible = buttonUserOpts[searchKey];
                } else if (typeof buttonUserOpts[searchKey] === "object") {
                    // If the value is an object, merge it with the default button properties

                    if (this.defaultButtonOptions[searchKey]) {
                        // copy properties from the button definition if they aren't null
                        for (const prop in buttonUserOpts[searchKey]) {
                            if (buttonUserOpts[searchKey][prop] !== null) {
                                mergedButtonOptions[searchKey][prop] = buttonUserOpts[searchKey][prop];
                            }
                        }
                    } else {
                        // button was not in the default buttons list and is therefore a custom button
                        // verify that the value has a displayName, icon, and callback property
                        if (buttonUserOpts[searchKey].displayName && buttonUserOpts[searchKey].icon && buttonUserOpts[searchKey].callback) {
                            mergedButtonOptions[searchKey] = {
                                visible: true,
                                displayName: buttonUserOpts[searchKey].displayName,
                                icon: buttonUserOpts[searchKey].icon,
                                callback: buttonUserOpts[searchKey].callback,
                                custom: true
                            };
                        } else {
                            console.warn(`Custom button "${searchKey}" is missing required properties`);
                        }
                    }
                } else {
                    // if the value is a string, set the icon property to the value
                    if (typeof buttonUserOpts[searchKey] === "string") {
                        mergedButtonOptions[searchKey].icon = buttonUserOpts[searchKey];
                    } else {
                        // if the value is a function, set the callback property to the value
                        if (typeof buttonUserOpts[searchKey] === "function") {
                            mergedButtonOptions[searchKey].callback = buttonUserOpts[searchKey];
                        }
                    }
                }
            }
        }

        return mergedButtonOptions;
    }

    setElements(element) {
        const game = this.createElement("div");
        const elem = document.querySelector(element);
        elem.innerHTML = "";
        elem.appendChild(game);
        this.game = game;

        this.elements = {
            main: this.game,
            parent: elem
        }
        this.elements.parent.classList.add("ejs_parent");
    }

    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            if (color === "") return "rgb(51, 51, 51)";
            if (color.startsWith("#")) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgb(${r}, ${g}, ${b})`;
            }
            return color;
        };
        this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
    }

    initializeSystemProperties() {
        this.isMobile = (function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        })();
        this.hasTouchScreen = (function () {
            if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
                if (navigator.maxTouchPoints > 0) {
                    return true;
                }
            } else {
                if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                    return true;
                } else if (window.TouchEvent || ("ontouchstart" in window)) {
                    return true;
                }
            }
            return false;
        })();
        this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
        this.fullscreen = false;
        this.enableMouseLock = false;
        this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
        this.webgl2Enabled = (() => {
            let setting = this.preGetSetting("webgl2Enabled");
            if (setting === "disabled" || !this.supportsWebgl2) {
                return false;
            } else if (setting === "enabled") {
                return true;
            }
            return null;
        })();
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE(),
                states: new window.EJS_DUMMYSTORAGE()
            };
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("rom"),
                core: new window.EJS_STORAGE("core"),
                states: new window.EJS_STORAGE("states")
            };
        }
    }

    initializeStorage() {
        return !!window.indexedDB && (typeof this.config.gameName === "string" || !this.config.gameUrl.startsWith("blob:"));
    }

    setupGameBackground() {
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }
    }

    initializeCheats() {
        // Initialize cheats system
    }

    createStartButton() {
        const button = this.createElement("div");
        button.classList.add("ejs_start_button");
        let border = 0;
        if (typeof this.config.backgroundImg === "string") {
            button.classList.add("ejs_start_button_border");
            border = 1;
        }
        button.innerText = (typeof this.config.startBtnName === "string") ? this.config.startBtnName : this.localization("Start Game");
        if (this.config.alignStartButton == "top") {
            button.style.bottom = "calc(100% - 20px)";
        } else if (this.config.alignStartButton == "center") {
            button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
        }
        this.elements.parent.appendChild(button);
        this.addEventListener(button, "touchstart", () => {
            this.touch = true;
        })
        this.addEventListener(button, "click", this.startButtonClicked.bind(this));
        if (this.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.callEvent("ready");
        }, 20);
        return button;
    }

    initializeCanvas() {
        this.canvas = this.createElement("canvas");
        this.canvas.classList.add("ejs_canvas");
        this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
        this.videoRotationChanged = false;
        this.game.appendChild(this.canvas);
    }

    createText() {
        this.textElem = this.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
    }

    displayMessage(message, time) {
        if (!this.msgElem) {
            this.msgElem = this.createElement("div");
            this.msgElem.classList.add("ejs_message");
            this.elements.parent.appendChild(this.msgElem);
        }
        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(() => {
            this.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.msgElem.innerText = message;
    }

    // Additional placeholder methods that need full implementation
    startButtonClicked(e) {
        this.callEvent("start-clicked");
        if (e.pointerType === "touch") {
            this.touch = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.textElem = this.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
        this.downloadGameCore();
    }

    downloadGameCore() {
        this.textElem.innerText = this.localization("Download Game Core");
        if (!this.config.threads && this.requiresThreads(this.getCore())) {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("This core requires threads, but EJS_threads is not set!");
            return;
        }
        if (!this.supportsWebgl2 && this.requiresWebGL2(this.getCore())) {
            this.startGameError(this.localization("Outdated graphics driver"));
            return;
        }
        if (this.config.threads && typeof window.SharedArrayBuffer !== "function") {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            return;
        }
        // Implementation continues...
    }

    startGameError(message) {
        console.log(message);
        this.textElem.innerText = message;
        this.textElem.classList.add("ejs_error_text");
        this.setupSettingsMenu();
        this.gameStateManager.loadSettings();
        this.menu.failedToStart();
        this.handleResize();
        this.failedToStart = true;
    }

    handleResize() {
        // Handle resize logic
    }

    preGetSetting(setting) {
        if (window.localStorage && !this.config.disableLocalStorage) {
            let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (coreSpecific && coreSpecific.settings) {
                    return coreSpecific.settings[setting];
                }
            } catch (e) {
                console.warn("Could not load previous settings", e);
                return null;
            }
        }
        return null;
    }

    setupSettingsMenu() {
        // Setup settings menu
    }

    updateCheatUI() {
        // Update cheat UI
    }

    updateGamepadLabels() {
        // Update gamepad labels
    }

    createControlSettingMenu() {
        // Create control setting menu
    }

    createCheatsMenu() {
        // Create cheats menu
    }

    createNetplayMenu() {
        // Create netplay menu
    }

    setVirtualGamepad() {
        // Set virtual gamepad
    }

    bindListeners() {
        // Bind event listeners
    }

    closePopup() {
        if (this.currentPopup) {
            this.currentPopup.remove();
            this.currentPopup = null;
        }
    }

    isPopupOpen() {
        return this.cheatMenu && this.cheatMenu.style.display !== "none" ||
               this.netplayMenu && this.netplayMenu.style.display !== "none" ||
               this.controlMenu && this.controlMenu.style.display !== "none" ||
               this.currentPopup !== null;
    }

    isChild(parent, child) {
        if (!parent || !child) return false;
        const adown = parent.nodeType === 9 ? parent.documentElement : parent;
        return parent.compareDocumentPosition && parent.compareDocumentPosition(child) & 16;
    }

    toggleFullscreen(fullscreen) {
        if (fullscreen) {
            if (this.game.requestFullscreen) {
                this.game.requestFullscreen();
            } else if (this.game.webkitRequestFullscreen) {
                this.game.webkitRequestFullscreen();
            } else if (this.game.mozRequestFullScreen) {
                this.game.mozRequestFullScreen();
            } else if (this.game.msRequestFullscreen) {
                this.game.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    openNetplayMenu() {
        console.log("Opening netplay menu");
        // Simplified netplay menu opening
    }
}
