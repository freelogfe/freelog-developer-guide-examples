/**
 * Controls handling functions
 */

export function handleControls(emulator) {
    // Initialize default controllers
    emulator.defaultControllers = {
        0: {
            0: { "value": "x", "value2": "BUTTON_2" },
            1: { "value": "s", "value2": "BUTTON_4" },
            2: { "value": "v", "value2": "SELECT" },
            3: { "value": "enter", "value2": "START" },
            4: { "value": "up arrow", "value2": "DPAD_UP" },
            5: { "value": "down arrow", "value2": "DPAD_DOWN" },
            6: { "value": "left arrow", "value2": "DPAD_LEFT" },
            7: { "value": "right arrow", "value2": "DPAD_RIGHT" },
            8: { "value": "z", "value2": "BUTTON_1" },
            9: { "value": "a", "value2": "BUTTON_3" },
            10: { "value": "q", "value2": "LEFT_TOP_SHOULDER" },
            11: { "value": "e", "value2": "RIGHT_TOP_SHOULDER" },
            12: { "value": "tab", "value2": "LEFT_BOTTOM_SHOULDER" },
            13: { "value": "r", "value2": "RIGHT_BOTTOM_SHOULDER" },
            14: { "value": "", "value2": "LEFT_STICK" },
            15: { "value": "", "value2": "RIGHT_STICK" },
            16: { "value": "h", "value2": "LEFT_STICK_X:+1" },
            17: { "value": "f", "value2": "LEFT_STICK_X:-1" },
            18: { "value": "g", "value2": "LEFT_STICK_Y:+1" },
            19: { "value": "t", "value2": "LEFT_STICK_Y:-1" },
            20: { "value": "l", "value2": "RIGHT_STICK_X:+1" },
            21: { "value": "j", "value2": "RIGHT_STICK_X:-1" },
            22: { "value": "k", "value2": "RIGHT_STICK_Y:+1" },
            23: { "value": "i", "value2": "RIGHT_STICK_Y:-1" },
            24: { "value": "1" },
            25: { "value": "2" },
            26: { "value": "3" },
            27: {},
            28: {},
            29: {}
        },
        1: {},
        2: {},
        3: {}
    };

    // Key mapping
    emulator.keyMap = {
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
    };

    console.log("Controls system initialized");
}

export function setupKeys(emulator) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 30; j++) {
            if (emulator.controls[i][j]) {
                emulator.controls[i][j].value = parseInt(keyLookup(emulator, emulator.controls[i][j].value));
                if (emulator.controls[i][j].value === -1 && emulator.debug) {
                    delete emulator.controls[i][j].value;
                    console.warn("Invalid key for control " + j + " player " + i);
                }
            }
        }
    }
}

function keyLookup(emulator, controllerkey) {
    if (controllerkey === undefined) return 0;
    if (typeof controllerkey === "number") return controllerkey;
    controllerkey = controllerkey.toString().toLowerCase();
    const values = Object.values(emulator.keyMap);
    if (values.includes(controllerkey)) {
        const index = values.indexOf(controllerkey);
        return Object.keys(emulator.keyMap)[index];
    }
    return -1;
}