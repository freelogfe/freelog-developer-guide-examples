export function getDefaultControllers() {
    return {
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
};
export function getKeyMap() {
    return {
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
        221: "close braket",
        222: "single quote"
    }
};

export const defaultButtonOptions = {
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
        icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23 23"><path d="M3 7.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M6 21V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M16 3V8.4C16 8.73137 15.7314 9 15.4 9H13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="transparent"></path><path d="M8 3V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12H12M12 12L9 9M12 12L9 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
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
export const defaultButtonAliases = {
    volume: "volumeSlider"
};
export function keyLookup(controllerkey) {
    if (controllerkey === undefined) return 0;
    if (typeof controllerkey === "number") return controllerkey;
    controllerkey = controllerkey.toString().toLowerCase()
    const values = Object.values(this.keyMap);
    if (values.includes(controllerkey)) {
        const index = values.indexOf(controllerkey);
        return Object.keys(this.keyMap)[index];
    }
    return -1;
}
   
export function keyChange(e) {
    if (e.repeat) return;
    if (!this.started) return;
    if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
        const num = this.controlPopup.getAttribute("button-num");
        const player = this.controlPopup.getAttribute("player-num");
        if (!this.controls[player][num]) {
            this.controls[player][num] = {};
        }
        this.controls[player][num].value = e.keyCode;
        this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
        this.checkGamepadInputs();
        this.saveSettings();
        return;
    }
    if (this.settingsMenu.style.display !== "none" || this.isPopupOpen() || this.getSettingValue("keyboardInput") === "enabled") return;
    e.preventDefault();
    const special = [16, 17, 18, 19, 20, 21, 22, 23];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 30; j++) {
            if (this.controls[i][j] && this.controls[i][j].value === e.keyCode) {
                // NES特殊处理：将X键映射到A键，Y键映射到B键
                let mappedButton = j;
                if ("nes" === this.getControlScheme()) {
                    if (j === 9) { // X键映射到A键(8)
                        mappedButton = 8;
                    } else if (j === 1) { // Y键映射到B键(0)
                        mappedButton = 0;
                    }
                }
                this.gameManager.simulateInput(i, mappedButton, (e.type === "keyup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
            }
        }
    }
}
export function setupKeys() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 30; j++) {
            if (this.controls[i][j]) {
                this.controls[i][j].value = parseInt(this.keyLookup(this.controls[i][j].value));
                if (this.controls[i][j].value === -1 && this.debug) {
                    delete this.controls[i][j].value;
                    console.warn("Invalid key for control " + j + " player " + i);
                }
            }
        }
    }
}
export function createControlSettingMenu() {
    let buttonListeners = [];
    this.checkGamepadInputs = () => buttonListeners.forEach(elem => elem());
    this.gamepadLabels = [];
    this.gamepadSelection = [];
    this.controls = JSON.parse(JSON.stringify(this.defaultControllers));
    const body = this.createPopup("Control Settings", {
        "Reset": () => {
            this.controls = JSON.parse(JSON.stringify(this.defaultControllers));
            this.setupKeys();
            this.checkGamepadInputs();
            this.saveSettings();
        },
        "Clear": () => {
            this.controls = { 0: {}, 1: {}, 2: {}, 3: {} };
            this.setupKeys();
            this.checkGamepadInputs();
            this.saveSettings();
        },
        "Close": () => {
            this.controlMenu.style.display = "none";
        }
    }, true);
    this.setupKeys();
    this.controlMenu = body.parentElement;
    body.classList.add("ejs_control_body");

    let buttons;
    if ("gb" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("nes" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 9, label: this.localization("X") },
            { id: 1, label: this.localization("Y") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
        if (this.getCore() === "nestopia") {
            buttons.push({ id: 10, label: this.localization("SWAP DISKS") });
        } else {
            buttons.push({ id: 10, label: this.localization("SWAP DISKS") });
            buttons.push({ id: 11, label: this.localization("EJECT/INSERT DISK") });
        }
    } else if ("snes" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 9, label: this.localization("X") },
            { id: 1, label: this.localization("Y") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
        ];
    } else if ("n64" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("A") },
            { id: 1, label: this.localization("B") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("D-PAD UP") },
            { id: 5, label: this.localization("D-PAD DOWN") },
            { id: 6, label: this.localization("D-PAD LEFT") },
            { id: 7, label: this.localization("D-PAD RIGHT") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 12, label: this.localization("Z") },
            { id: 19, label: this.localization("STICK UP") },
            { id: 18, label: this.localization("STICK DOWN") },
            { id: 17, label: this.localization("STICK LEFT") },
            { id: 16, label: this.localization("STICK RIGHT") },
            { id: 23, label: this.localization("C-PAD UP") },
            { id: 22, label: this.localization("C-PAD DOWN") },
            { id: 21, label: this.localization("C-PAD LEFT") },
            { id: 20, label: this.localization("C-PAD RIGHT") },
        ];
    } else if ("gba" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("nds" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 9, label: this.localization("X") },
            { id: 1, label: this.localization("Y") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 14, label: this.localization("Microphone") },
        ];
    } else if ("vb" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("LEFT D-PAD UP") },
            { id: 5, label: this.localization("LEFT D-PAD DOWN") },
            { id: 6, label: this.localization("LEFT D-PAD LEFT") },
            { id: 7, label: this.localization("LEFT D-PAD RIGHT") },
            { id: 19, label: this.localization("RIGHT D-PAD UP") },
            { id: 18, label: this.localization("RIGHT D-PAD DOWN") },
            { id: 17, label: this.localization("RIGHT D-PAD LEFT") },
            { id: 16, label: this.localization("RIGHT D-PAD RIGHT") },
        ];
    } else if (["segaCD", "sega32x"].includes(this.getControlScheme())) {
        buttons = [
            { id: 1, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 8, label: this.localization("C") },
            { id: 10, label: this.localization("X") },
            { id: 9, label: this.localization("Y") },
            { id: 11, label: this.localization("Z") },
            { id: 3, label: this.localization("START") },
            { id: 2, label: this.localization("MODE") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("segaMS" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("BUTTON 1 / START") },
            { id: 8, label: this.localization("BUTTON 2") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("segaGG" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("BUTTON 1") },
            { id: 8, label: this.localization("BUTTON 2") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("segaSaturn" === this.getControlScheme()) {
        buttons = [
            { id: 1, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 8, label: this.localization("C") },
            { id: 9, label: this.localization("X") },
            { id: 10, label: this.localization("Y") },
            { id: 11, label: this.localization("Z") },
            { id: 12, label: this.localization("L") },
            { id: 13, label: this.localization("R") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("3do" === this.getControlScheme()) {
        buttons = [
            { id: 1, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 8, label: this.localization("C") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 2, label: this.localization("X") },
            { id: 3, label: this.localization("P") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("atari2600" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("FIRE") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("RESET") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 10, label: this.localization("LEFT DIFFICULTY A") },
            { id: 12, label: this.localization("LEFT DIFFICULTY B") },
            { id: 11, label: this.localization("RIGHT DIFFICULTY A") },
            { id: 13, label: this.localization("RIGHT DIFFICULTY B") },
            { id: 14, label: this.localization("COLOR") },
            { id: 15, label: this.localization("B/W") },
        ];
    } else if ("atari7800" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("BUTTON 1") },
            { id: 8, label: this.localization("BUTTON 2") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("PAUSE") },
            { id: 9, label: this.localization("RESET") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 10, label: this.localization("LEFT DIFFICULTY") },
            { id: 11, label: this.localization("RIGHT DIFFICULTY") },
        ];
    } else if ("lynx" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 10, label: this.localization("OPTION 1") },
            { id: 11, label: this.localization("OPTION 2") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("jaguar" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 1, label: this.localization("C") },
            { id: 2, label: this.localization("PAUSE") },
            { id: 3, label: this.localization("OPTION") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("pce" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("I") },
            { id: 0, label: this.localization("II") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("RUN") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("ngp" === this.getControlScheme()) {
        buttons = [
            { id: 0, label: this.localization("A") },
            { id: 8, label: this.localization("B") },
            { id: 3, label: this.localization("OPTION") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("ws" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("A") },
            { id: 0, label: this.localization("B") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("X UP") },
            { id: 5, label: this.localization("X DOWN") },
            { id: 6, label: this.localization("X LEFT") },
            { id: 7, label: this.localization("X RIGHT") },
            { id: 13, label: this.localization("Y UP") },
            { id: 12, label: this.localization("Y DOWN") },
            { id: 10, label: this.localization("Y LEFT") },
            { id: 11, label: this.localization("Y RIGHT") },
        ];
    } else if ("coleco" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("LEFT BUTTON") },
            { id: 0, label: this.localization("RIGHT BUTTON") },
            { id: 9, label: this.localization("1") },
            { id: 1, label: this.localization("2") },
            { id: 11, label: this.localization("3") },
            { id: 10, label: this.localization("4") },
            { id: 13, label: this.localization("5") },
            { id: 12, label: this.localization("6") },
            { id: 15, label: this.localization("7") },
            { id: 14, label: this.localization("8") },
            { id: 2, label: this.localization("*") },
            { id: 3, label: this.localization("#") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("pcfx" === this.getControlScheme()) {
        buttons = [
            { id: 8, label: this.localization("I") },
            { id: 0, label: this.localization("II") },
            { id: 9, label: this.localization("III") },
            { id: 1, label: this.localization("IV") },
            { id: 10, label: this.localization("V") },
            { id: 11, label: this.localization("VI") },
            { id: 3, label: this.localization("RUN") },
            { id: 2, label: this.localization("SELECT") },
            { id: 12, label: this.localization("MODE1") },
            { id: 13, label: this.localization("MODE2") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
        ];
    } else if ("psp" === this.getControlScheme()) {
        buttons = [
            { id: 9, label: this.localization("\u25B3") }, // △
            { id: 1, label: this.localization("\u25A1") }, // □
            { id: 0, label: this.localization("\uFF58") }, // ｘ
            { id: 8, label: this.localization("\u25CB") }, // ○
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 19, label: this.localization("STICK UP") },
            { id: 18, label: this.localization("STICK DOWN") },
            { id: 17, label: this.localization("STICK LEFT") },
            { id: 16, label: this.localization("STICK RIGHT") },
        ];
    } else {
        buttons = [
            { id: 0, label: this.localization("B") },
            { id: 1, label: this.localization("Y") },
            { id: 2, label: this.localization("SELECT") },
            { id: 3, label: this.localization("START") },
            { id: 4, label: this.localization("UP") },
            { id: 5, label: this.localization("DOWN") },
            { id: 6, label: this.localization("LEFT") },
            { id: 7, label: this.localization("RIGHT") },
            { id: 8, label: this.localization("A") },
            { id: 9, label: this.localization("X") },
            { id: 10, label: this.localization("L") },
            { id: 11, label: this.localization("R") },
            { id: 12, label: this.localization("L2") },
            { id: 13, label: this.localization("R2") },
            { id: 14, label: this.localization("L3") },
            { id: 15, label: this.localization("R3") },
            { id: 19, label: this.localization("L STICK UP") },
            { id: 18, label: this.localization("L STICK DOWN") },
            { id: 17, label: this.localization("L STICK LEFT") },
            { id: 16, label: this.localization("L STICK RIGHT") },
            { id: 23, label: this.localization("R STICK UP") },
            { id: 22, label: this.localization("R STICK DOWN") },
            { id: 21, label: this.localization("R STICK LEFT") },
            { id: 20, label: this.localization("R STICK RIGHT") },
        ];
    }
    if (["arcade", "mame"].includes(this.getControlScheme())) {
        for (const buttonIdx in buttons) {
            if (buttons[buttonIdx].id === 2) {
                buttons[buttonIdx].label = this.localization("INSERT COIN");
            }
        }
    }
    buttons.push(
        { id: 24, label: this.localization("QUICK SAVE STATE") },
        { id: 25, label: this.localization("QUICK LOAD STATE") },
        { id: 26, label: this.localization("CHANGE STATE SLOT") },
        { id: 27, label: this.localization("FAST FORWARD") },
        { id: 29, label: this.localization("SLOW MOTION") },
        { id: 28, label: this.localization("REWIND") }
    );
    let nums = [];
    for (let i = 0; i < buttons.length; i++) {
        nums.push(buttons[i].id);
    }
    for (let i = 0; i < 30; i++) {
        if (!nums.includes(i)) {
            delete this.defaultControllers[0][i];
            delete this.defaultControllers[1][i];
            delete this.defaultControllers[2][i];
            delete this.defaultControllers[3][i];
            delete this.controls[0][i];
            delete this.controls[1][i];
            delete this.controls[2][i];
            delete this.controls[3][i];
        }
    }

    //if (_this.statesSupported === false) {
    //    delete buttons[24];
    //    delete buttons[25];
    //    delete buttons[26];
    //}
    let selectedPlayer;
    let players = [];
    let playerDivs = [];

    const playerSelect = this.createElement("ul");
    playerSelect.classList.add("ejs_control_player_bar");
    for (let i = 1; i < 5; i++) {
        const playerContainer = this.createElement("li");
        playerContainer.classList.add("tabs-title");
        playerContainer.setAttribute("role", "presentation");
        const player = this.createElement("a");
        player.innerText = this.localization("Player") + " " + i;
        player.setAttribute("role", "tab");
        player.setAttribute("aria-controls", "controls-" + (i - 1));
        player.setAttribute("aria-selected", "false");
        player.id = "controls-" + (i - 1) + "-label";
        this.addEventListener(player, "click", (e) => {
            e.preventDefault();
            players[selectedPlayer].classList.remove("ejs_control_selected");
            playerDivs[selectedPlayer].setAttribute("hidden", "");
            selectedPlayer = i - 1;
            players[i - 1].classList.add("ejs_control_selected");
            playerDivs[i - 1].removeAttribute("hidden");
        })
        playerContainer.appendChild(player);
        playerSelect.appendChild(playerContainer);
        players.push(playerContainer);
    }
    body.appendChild(playerSelect);

    const controls = this.createElement("div");
    for (let i = 0; i < 4; i++) {
        if (!this.controls[i]) this.controls[i] = {};
        const player = this.createElement("div");
        const playerTitle = this.createElement("div");

        const gamepadTitle = this.createElement("div");
        gamepadTitle.innerText = this.localization("Connected Gamepad") + ": ";

        const gamepadName = this.createElement("select");
        gamepadName.classList.add("ejs_gamepad_dropdown");
        gamepadName.setAttribute("title", "gamepad-" + i);
        gamepadName.setAttribute("index", i);
        this.gamepadLabels.push(gamepadName);
        this.gamepadSelection.push("");
        this.addEventListener(gamepadName, "change", e => {
            const controller = e.target.value;
            const player = parseInt(e.target.getAttribute("index"));
            if (controller === "notconnected") {
                this.gamepadSelection[player] = "";
            } else {
                for (let i = 0; i < this.gamepadSelection.length; i++) {
                    if (player === i) continue;
                    if (this.gamepadSelection[i] === controller) {
                        this.gamepadSelection[i] = "";
                    }
                }
                this.gamepadSelection[player] = controller;
                this.updateGamepadLabels();
            }
        });
        const def = this.createElement("option");
        def.setAttribute("value", "notconnected");
        def.innerText = "Not Connected";
        gamepadName.appendChild(def);
        gamepadTitle.appendChild(gamepadName);
        gamepadTitle.classList.add("ejs_gamepad_section");

        const leftPadding = this.createElement("div");
        leftPadding.style = "width:25%;float:left;";
        leftPadding.innerHTML = "&nbsp;";

        const aboutParent = this.createElement("div");
        aboutParent.style = "font-size:12px;width:50%;float:left;";
        const gamepad = this.createElement("div");
        gamepad.style = "text-align:center;width:50%;float:left;";
        gamepad.innerText = this.localization("Gamepad");
        aboutParent.appendChild(gamepad);
        const keyboard = this.createElement("div");
        keyboard.style = "text-align:center;width:50%;float:left;";
        keyboard.innerText = this.localization("Keyboard");
        aboutParent.appendChild(keyboard);

        const headingPadding = this.createElement("div");
        headingPadding.style = "clear:both;";

        playerTitle.appendChild(gamepadTitle);
        playerTitle.appendChild(leftPadding);
        playerTitle.appendChild(aboutParent);

        if ((this.touch || this.hasTouchScreen) && i === 0) {
            const vgp = this.createElement("div");
            vgp.style = "width:25%;float:right;clear:none;padding:0;font-size: 11px;padding-left: 2.25rem;";
            vgp.classList.add("ejs_control_row");
            vgp.classList.add("ejs_cheat_row");
            const input = this.createElement("input");
            input.type = "checkbox";
            input.checked = true;
            input.value = "o";
            input.id = "ejs_vp";
            vgp.appendChild(input);
            const label = this.createElement("label");
            label.for = "ejs_vp";
            label.innerText = "Virtual Gamepad";
            vgp.appendChild(label);
            label.addEventListener("click", (e) => {
                input.checked = !input.checked;
                this.changeSettingOption("virtual-gamepad", input.checked ? "enabled" : "disabled");
            })
            this.on("start", (e) => {
                if (this.getSettingValue("virtual-gamepad") === "disabled") {
                    input.checked = false;
                }
            })
            playerTitle.appendChild(vgp);
        }

        playerTitle.appendChild(headingPadding);

        player.appendChild(playerTitle);

        for (const buttonIdx in buttons) {
            const k = buttons[buttonIdx].id;
            const controlLabel = buttons[buttonIdx].label;

            const buttonText = this.createElement("div");
            buttonText.setAttribute("data-id", k);
            buttonText.setAttribute("data-index", i);
            buttonText.setAttribute("data-label", controlLabel);
            buttonText.style = "margin-bottom:10px;";
            buttonText.classList.add("ejs_control_bar");

            const title = this.createElement("div");
            title.style = "width:25%;float:left;font-size:12px;";
            const label = this.createElement("label");
            label.innerText = controlLabel + ":";
            title.appendChild(label);

            const textBoxes = this.createElement("div");
            textBoxes.style = "width:50%;float:left;";

            const textBox1Parent = this.createElement("div");
            textBox1Parent.style = "width:50%;float:left;padding: 0 5px;";
            const textBox1 = this.createElement("input");
            textBox1.style = "text-align:center;height:25px;width: 100%;";
            textBox1.type = "text";
            textBox1.setAttribute("readonly", "");
            textBox1.setAttribute("placeholder", "");
            textBox1Parent.appendChild(textBox1);

            const textBox2Parent = this.createElement("div");
            textBox2Parent.style = "width:50%;float:left;padding: 0 5px;";
            const textBox2 = this.createElement("input");
            textBox2.style = "text-align:center;height:25px;width: 100%;";
            textBox2.type = "text";
            textBox2.setAttribute("readonly", "");
            textBox2.setAttribute("placeholder", "");
            textBox2Parent.appendChild(textBox2);

            buttonListeners.push(() => {
                textBox2.value = "";
                textBox1.value = "";
                if (this.controls[i][k] && this.controls[i][k].value !== undefined) {
                    let value = this.keyMap[this.controls[i][k].value];
                    value = this.localization(value);
                    textBox2.value = value;
                }
                if (this.controls[i][k] && this.controls[i][k].value2 !== undefined && this.controls[i][k].value2 !== "") {
                    let value2 = this.controls[i][k].value2.toString();
                    if (value2.includes(":")) {
                        value2 = value2.split(":");
                        value2 = this.localization(value2[0]) + ":" + this.localization(value2[1])
                    } else if (!isNaN(value2)) {
                        value2 = this.localization("BUTTON") + " " + this.localization(value2);
                    } else {
                        value2 = this.localization(value2);
                    }
                    textBox1.value = value2;
                }
            })

            if (this.controls[i][k] && this.controls[i][k].value) {
                let value = this.keyMap[this.controls[i][k].value];
                value = this.localization(value);
                textBox2.value = value;
            }
            if (this.controls[i][k] && this.controls[i][k].value2) {
                let value2 = this.controls[i][k].value2.toString();
                if (value2.includes(":")) {
                    value2 = value2.split(":");
                    value2 = this.localization(value2[0]) + ":" + this.localization(value2[1])
                } else if (!isNaN(value2)) {
                    value2 = this.localization("BUTTON") + " " + this.localization(value2);
                } else {
                    value2 = this.localization(value2);
                }
                textBox1.value = value2;
            }

            textBoxes.appendChild(textBox1Parent);
            textBoxes.appendChild(textBox2Parent);

            const padding = this.createElement("div");
            padding.style = "clear:both;";
            textBoxes.appendChild(padding);

            const setButton = this.createElement("div");
            setButton.style = "width:25%;float:left;";
            const button = this.createElement("a");
            button.classList.add("ejs_control_set_button");
            button.innerText = this.localization("Set");
            setButton.appendChild(button);

            const padding2 = this.createElement("div");
            padding2.style = "clear:both;";

            buttonText.appendChild(title);
            buttonText.appendChild(textBoxes);
            buttonText.appendChild(setButton);
            buttonText.appendChild(padding2);

            player.appendChild(buttonText);

            this.addEventListener(buttonText, "mousedown", (e) => {
                e.preventDefault();
                this.controlPopup.parentElement.parentElement.removeAttribute("hidden");
                this.controlPopup.innerText = "[ " + controlLabel + " ]\n" + this.localization("Press Keyboard");
                this.controlPopup.setAttribute("button-num", k);
                this.controlPopup.setAttribute("player-num", i);
            })
        }
        controls.appendChild(player);
        player.setAttribute("hidden", "");
        playerDivs.push(player);
    }
    body.appendChild(controls);

    selectedPlayer = 0;
    players[0].classList.add("ejs_control_selected");
    playerDivs[0].removeAttribute("hidden");

    const popup = this.createElement("div");
    popup.classList.add("ejs_popup_container");
    const popupMsg = this.createElement("div");
    this.addEventListener(popup, "mousedown click touchstart", (e) => {
        if (this.isChild(popupMsg, e.target)) return;
        this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
    })
    const btn = this.createElement("a");
    btn.classList.add("ejs_control_set_button");
    btn.innerText = this.localization("Clear");
    this.addEventListener(btn, "mousedown click touchstart", (e) => {
        const num = this.controlPopup.getAttribute("button-num");
        const player = this.controlPopup.getAttribute("player-num");
        if (!this.controls[player][num]) {
            this.controls[player][num] = {};
        }
        this.controls[player][num].value = 0;
        this.controls[player][num].value2 = "";
        this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
        this.checkGamepadInputs();
        this.saveSettings();
    })
    popupMsg.classList.add("ejs_popup_box");
    popupMsg.innerText = "";
    popup.setAttribute("hidden", "");
    const popMsg = this.createElement("div");
    this.controlPopup = popMsg;
    popup.appendChild(popupMsg);
    popupMsg.appendChild(popMsg);
    popupMsg.appendChild(this.createElement("br"));
    popupMsg.appendChild(btn);
    this.controlMenu.appendChild(popup);
}
