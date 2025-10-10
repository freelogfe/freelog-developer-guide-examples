export const setVirtualGamepad = (emulator) => {
    emulator.virtualGamepad = emulator.createElement("div");
    emulator.toggleVirtualGamepad = (show) => {
        emulator.virtualGamepad.style.display = show ? "" : "none";
    }
    emulator.virtualGamepad.classList.add("ejs_virtualGamepad_parent");
    emulator.elements.parent.appendChild(emulator.virtualGamepad);

    const speedControlButtons = [
        { "type": "button", "text": "Fast", "id": "speed_fast", "location": "center", "left": -35, "top": 50, "fontSize": 15, "block": true, "input_value": 27 },
        { "type": "button", "text": "Slow", "id": "speed_slow", "location": "center", "left": 95, "top": 50, "fontSize": 15, "block": true, "input_value": 29 },
    ];
    if (emulator.rewindEnabled) {
        speedControlButtons.push({ "type": "button", "text": "Rewind", "id": "speed_rewind", "location": "center", "left": 30, "top": 50, "fontSize": 15, "block": true, "input_value": 28 });
    }

    let info;
    if (emulator.config.VirtualGamepadSettings && function (set) {
        if (!Array.isArray(set)) {
            console.warn("Virtual gamepad settings is not array! Using default gamepad settings");
            return false;
        }
        if (!set.length) {
            console.warn("Virtual gamepad settings is empty! Using default gamepad settings");
            return false;
        }
        for (let i = 0; i < set.length; i++) {
            if (!set[i].type) continue;
            try {
                if (set[i].type === "zone" || set[i].type === "dpad") {
                    if (!set[i].location) {
                        console.warn("Missing location value for " + set[i].type + "! Using default gamepad settings");
                        return false;
                    } else if (!set[i].inputValues) {
                        console.warn("Missing inputValues for " + set[i].type + "! Using default gamepad settings");
                        return false;
                    }
                    continue;
                }
                if (!set[i].location) {
                    console.warn("Missing location value for button " + set[i].text + "! Using default gamepad settings");
                    return false;
                } else if (!set[i].type) {
                    console.warn("Missing type value for button " + set[i].text + "! Using default gamepad settings");
                    return false;
                } else if (!set[i].id.toString()) {
                    console.warn("Missing id value for button " + set[i].text + "! Using default gamepad settings");
                    return false;
                } else if (!set[i].input_value.toString()) {
                    console.warn("Missing input_value for button " + set[i].text + "! Using default gamepad settings");
                    return false;
                }
            } catch (e) {
                console.warn("Error checking values! Using default gamepad settings");
                return false;
            }
        }
        return true;
    }(emulator.config.VirtualGamepadSettings)) {
        info = emulator.config.VirtualGamepadSettings;
    } else if ("gba" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 10, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -90, "bold": true, "block": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -90, "bold": true, "block": true, "input_value": 11 }
        ];
        info.push(...speedControlButtons);
    } else if ("gb" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 10, "top": 70, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("nes" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("n64" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "Z", "id": "z", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 1 },
            { "type": "button", "text": "C-Up", "id": "c-up", "location": "right", "left": 40, "top": 120, "bold": true, "input_value": 2 },
            { "type": "button", "text": "C-Down", "id": "c-down", "location": "right", "left": 40, "top": 160, "bold": true, "input_value": 3 },
            { "type": "button", "text": "C-Left", "id": "c-left", "location": "right", "left": 40, "top": 200, "bold": true, "input_value": 4 },
            { "type": "button", "text": "C-Right", "id": "c-right", "location": "right", "left": 40, "top": 240, "bold": true, "input_value": 5 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("snes" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("md" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("psx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ps2" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xbox" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xbox360" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxone" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("switch" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("dreamcast" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("genesis" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("arcade" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("atari" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("c64" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("lynx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("tg16" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("tgcd" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("3do" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("saturn" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("psp" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ps3" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ps4" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ps5" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("wii" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "1", "id": "1", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "2", "id": "2", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("wiiu" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "1", "id": "1", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "2", "id": "2", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("3ds" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("vita" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("n3ds" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("psv" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxseries" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxxr" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxxs" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxs" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxr" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xboxone" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xbox360" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("xbox" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ps2" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("psx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "O", "id": "o", "location": "right", "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "Triangle", "id": "triangle", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "Square", "id": "square", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("md" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 81, "top": 80, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("snes" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("nes" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("gb" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 10, "top": 70, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("n64" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "Z", "id": "z", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 1 },
            { "type": "button", "text": "C-Up", "id": "c-up", "location": "right", "left": 40, "top": 120, "bold": true, "input_value": 2 },
            { "type": "button", "text": "C-Down", "id": "c-down", "location": "right", "left": 40, "top": 160, "bold": true, "input_value": 3 },
            { "type": "button", "text": "C-Left", "id": "c-left", "location": "right", "left": 40, "top": 200, "bold": true, "input_value": 4 },
            { "type": "button", "text": "C-Right", "id": "c-right", "location": "right", "left": 40, "top": 240, "bold": true, "input_value": 5 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("n64" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": -10, "top": 95, "input_value": 1, "bold": true },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 150, "input_value": 0, "bold": true },
            { "type": "zone", "id": "stick", "location": "left", "left": "50%", "top": "100%", "joystickInput": true, "inputValues": [16, 17, 18, 19] },
            { "type": "zone", "id": "dpad", "location": "left", "left": "50%", "top": "0%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "top": -10, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "L", "id": "l", "block": true, "location": "top", "left": 10, "top": -40, "bold": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "block": true, "location": "top", "right": 10, "top": -40, "bold": true, "input_value": 11 },
            { "type": "button", "text": "Z", "id": "z", "block": true, "location": "top", "left": 10, "bold": true, "input_value": 12 },
            { "fontSize": 20, "type": "button", "text": "CU", "id": "cu", "joystickInput": true, "location": "right", "left": 25, "top": -65, "input_value": 23 },
            { "fontSize": 20, "type": "button", "text": "CD", "id": "cd", "joystickInput": true, "location": "right", "left": 25, "top": 15, "input_value": 22 },
            { "fontSize": 20, "type": "button", "text": "CL", "id": "cl", "joystickInput": true, "location": "right", "left": -15, "top": -25, "input_value": 21 },
            { "fontSize": 20, "type": "button", "text": "CR", "id": "cr", "joystickInput": true, "location": "right", "left": 65, "top": -25, "input_value": 20 }
        ];
        info.push(...speedControlButtons);
    } else if ("nds" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -100, "bold": true, "block": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -100, "bold": true, "block": true, "input_value": 11 }
        ];
        info.push(...speedControlButtons);
    } else if ("snes" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "X", "id": "x", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -100, "bold": true, "block": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -100, "bold": true, "block": true, "input_value": 11 }
        ];
        info.push(...speedControlButtons);
    } else if (["segaMD", "segaCD", "sega32x"].includes(emulator.getControlScheme())) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 145, "top": 70, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "right": 145, "top": 0, "bold": true, "input_value": 10 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "right": 75, "top": 0, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Z", "id": "z", "location": "right", "right": 5, "top": 0, "bold": true, "input_value": 11 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Mode", "id": "mode", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("segaMS" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "1", "id": "button_1", "location": "right", "left": 10, "top": 40, "bold": true, "input_value": 0 },
            { "type": "button", "text": "2", "id": "button_2", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] }
        ];
        info.push(...speedControlButtons);
    } else if ("segaGG" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "1", "id": "button_1", "location": "right", "left": 10, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "2", "id": "button_2", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("segaSaturn" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 145, "top": 70, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "right": 145, "top": 0, "bold": true, "input_value": 9 },
            { "type": "button", "text": "Y", "id": "y", "location": "right", "right": 75, "top": 0, "bold": true, "input_value": 10 },
            { "type": "button", "text": "Z", "id": "z", "location": "right", "right": 5, "top": 0, "bold": true, "input_value": 11 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -90, "bold": true, "block": true, "input_value": 12 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -90, "bold": true, "block": true, "input_value": 13 },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("atari2600" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "", "id": "button_1", "location": "right", "right": 10, "top": 70, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Reset", "id": "reset", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("atari7800" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "1", "id": "button_1", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "2", "id": "button_2", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Reset", "id": "reset", "location": "center", "left": -35, "fontSize": 15, "block": true, "input_value": 9 },
            { "type": "button", "text": "Pause", "id": "pause", "location": "center", "left": 95, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 2 },
        ];
        info.push(...speedControlButtons);
    } else if ("lynx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "B", "id": "button_1", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "button_2", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Opt 1", "id": "option_1", "location": "center", "left": -35, "fontSize": 15, "block": true, "input_value": 10 },
            { "type": "button", "text": "Opt 2", "id": "option_2", "location": "center", "left": 95, "fontSize": 15, "block": true, "input_value": 11 },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("jaguar" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 145, "top": 70, "bold": true, "input_value": 8 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 1 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Option", "id": "option", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Pause", "id": "pause", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("vb" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 150, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 5, "top": 150, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "left_dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "dpad", "id": "right_dpad", "location": "right", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [19, 18, 17, 16] },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -90, "bold": true, "block": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -90, "bold": true, "block": true, "input_value": 11 },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("3do" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 145, "top": 70, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "C", "id": "c", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "L", "id": "l", "location": "left", "left": 3, "top": -90, "bold": true, "block": true, "input_value": 10 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "right": 3, "top": -90, "bold": true, "block": true, "input_value": 11 },
            { "type": "button", "text": "X", "id": "x", "location": "center", "left": -5, "fontSize": 15, "block": true, "bold": true, "input_value": 2 },
            { "type": "button", "text": "P", "id": "p", "location": "center", "left": 60, "fontSize": 15, "block": true, "bold": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("pce" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "II", "id": "ii", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "I", "id": "i", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Run", "id": "run", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    } else if ("ngp" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 5, "top": 50, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Option", "id": "option", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else if ("ws" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 150, "bold": true, "input_value": 0 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "right": 5, "top": 150, "bold": true, "input_value": 8 },
            { "type": "dpad", "id": "x_dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "dpad", "id": "y_dpad", "location": "right", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [13, 12, 10, 11] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 },
        ];
        info.push(...speedControlButtons);
    } else if ("coleco" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "L", "id": "l", "location": "right", "left": 10, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "R", "id": "r", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 0 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] }
        ];
        info.push(...speedControlButtons);
    } else if ("pcfx" === emulator.getControlScheme()) {
        info = [
            { "type": "button", "text": "I", "id": "i", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
            { "type": "button", "text": "II", "id": "ii", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
            { "type": "button", "text": "III", "id": "iii", "location": "right", "right": 145, "top": 70, "bold": true, "input_value": 9 },
            { "type": "button", "text": "IV", "id": "iv", "location": "right", "right": 5, "top": 0, "bold": true, "input_value": 1 },
            { "type": "button", "text": "V", "id": "v", "location": "right", "right": 75, "top": 0, "bold": true, "input_value": 10 },
            { "type": "button", "text": "VI", "id": "vi", "location": "right", "right": 145, "top": 0, "bold": true, "input_value": 11 },
            { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 },
            { "type": "button", "text": "Run", "id": "run", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 }
        ];
        info.push(...speedControlButtons);
    } else {
        info = [
            { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "bold": true, "input_value": 9 },
            { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "bold": true, "input_value": 1 },
            { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
            { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
            { "type": "zone", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
            { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
            { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
        ];
        info.push(...speedControlButtons);
    }
    for (let i = 0; i < info.length; i++) {
        if (info[i].text) {
            info[i].text = emulator.localization(info[i].text);
        }
    }
    info = JSON.parse(JSON.stringify(info));

    const up = emulator.createElement("div");
    up.classList.add("ejs_virtualGamepad_top");
    const down = emulator.createElement("div");
    down.classList.add("ejs_virtualGamepad_bottom");
    const left = emulator.createElement("div");
    left.classList.add("ejs_virtualGamepad_left");
    const right = emulator.createElement("div");
    right.classList.add("ejs_virtualGamepad_right");
    const elems = { top: up, center: down, left, right };

    emulator.virtualGamepad.appendChild(up);
    emulator.virtualGamepad.appendChild(down);
    emulator.virtualGamepad.appendChild(left);
    emulator.virtualGamepad.appendChild(right);

    emulator.toggleVirtualGamepadLeftHanded = (enabled) => {
        left.classList.toggle("ejs_virtualGamepad_left", !enabled);
        right.classList.toggle("ejs_virtualGamepad_right", !enabled);
        left.classList.toggle("ejs_virtualGamepad_right", enabled);
        right.classList.toggle("ejs_virtualGamepad_left", enabled);
    }

    const leftHandedMode = false;
    const blockCSS = "height:31px;text-align:center;border:1px solid #ccc;border-radius:5px;line-height:31px;";
    const controlSchemeCls = `cs_${emulator.getControlScheme()}`.split(/\s/g).join("_");

    for (let i = 0; i < info.length; i++) {
        if (info[i].type !== "button") continue;
        if (leftHandedMode && ["left", "right"].includes(info[i].location)) {
            info[i].location = (info[i].location === "left") ? "right" : "left";
            const amnt = JSON.parse(JSON.stringify(info[i]));
            if (amnt.left) {
                info[i].right = amnt.left;
            }
            if (amnt.right) {
                info[i].left = amnt.right;
            }
        }
        let style = "";
        if (info[i].left) {
            style += "left:" + info[i].left + (typeof info[i].left === "number" ? "px" : "") + ";";
        }
        if (info[i].right) {
            style += "right:" + info[i].right + (typeof info[i].right === "number" ? "px" : "") + ";";
        }
        if (info[i].top) {
            style += "top:" + info[i].top + (typeof info[i].top === "number" ? "px" : "") + ";";
        }
        if (!info[i].bold) {
            style += "font-weight:normal;";
        } else if (info[i].bold) {
            style += "font-weight:bold;";
        }
        info[i].fontSize = info[i].fontSize || 30;
        style += "font-size:" + info[i].fontSize + "px;";
        if (info[i].block) {
            style += blockCSS;
        }
        if (["top", "center", "left", "right"].includes(info[i].location)) {
            const button = emulator.createElement("div");
            button.style = style;
            button.innerText = info[i].text;
            button.classList.add("ejs_virtualGamepad_button", controlSchemeCls);
            if (info[i].id) {
                button.classList.add(`b_${info[i].id}`);
            }
            elems[info[i].location].appendChild(button);
            const value = info[i].input_new_cores || info[i].input_value;
            let downValue = info[i].joystickInput === true ? 0x7fff : 1;
            emulator.addEventListener(button, "touchstart touchend touchcancel", (e) => {
                e.preventDefault();
                if (e.type === "touchend" || e.type === "touchcancel") {
                    e.target.classList.remove("ejs_virtualGamepad_button_down");

                    // 清除连发定时器
                    if (e.target.nesRapidFireInterval) {
                        clearInterval(e.target.nesRapidFireInterval);
                        e.target.nesRapidFireInterval = null;
                    }

                    window.setTimeout(() => {
                        // NES特殊处理：将X键映射到A键，Y键映射到B键
                        let mappedValue = value;
                        if ("nes" === emulator.getControlScheme()) {
                            if (value == 9) { // X键映射到A键(8)
                                mappedValue = 8;
                            } else if (value == 1) { // Y键映射到B键(0)
                                mappedValue = 0;
                            }
                        }
                        emulator.gameManager.simulateInput(0, mappedValue, 0);
                    })
                } else {
                    e.target.classList.add("ejs_virtualGamepad_button_down");
                    // NES特殊处理：将X键映射到A键，Y键映射到B键
                    let mappedValue = value;
                    if ("nes" === emulator.getControlScheme()) {
                        if (value == 9) { // X键映射到A键(8)
                            mappedValue = 8;
                        } else if (value == 1) { // Y键映射到B键(0)
                            mappedValue = 0;
                        }
                    }
                    emulator.gameManager.simulateInput(0, mappedValue, downValue);

                    // 如果是NES的X或Y键，启动连发功能
                    if ("nes" === emulator.getControlScheme() && (value == 9 || value == 1)) {
                        // 清除可能存在的旧定时器
                        if (e.target.nesRapidFireInterval) {
                            clearInterval(e.target.nesRapidFireInterval);
                        }

                        // 设置连发定时器 (每100ms触发一次)
                        e.target.nesRapidFireInterval = setInterval(() => {
                            emulator.gameManager.simulateInput(0, mappedValue, downValue);
                            // 短暂延迟后释放按键，模拟按键点击效果
                            setTimeout(() => {
                                emulator.gameManager.simulateInput(0, mappedValue, 0);
                            }, 30);
                        }, 100);
                    }
                }
            })
        }
    }

    const createDPad = (opts) => {
        const container = opts.container;
        const callback = opts.event;
        const dpadMain = emulator.createElement("div");
        dpadMain.classList.add("ejs_dpad_main");
        const vertical = emulator.createElement("div");
        vertical.classList.add("ejs_dpad_vertical");
        const horizontal = emulator.createElement("div");
        horizontal.classList.add("ejs_dpad_horizontal");
        const bar1 = emulator.createElement("div");
        bar1.classList.add("ejs_dpad_bar");
        const bar2 = emulator.createElement("div");
        bar2.classList.add("ejs_dpad_bar");

        horizontal.appendChild(bar1);
        vertical.appendChild(bar2);
        dpadMain.appendChild(vertical);
        dpadMain.appendChild(horizontal);

        const updateCb = (e) => {
            e.preventDefault();
            const touch = e.targetTouches[0];
            if (!touch) return;
            const rect = dpadMain.getBoundingClientRect();
            const x = touch.clientX - rect.left - dpadMain.clientWidth / 2;
            const y = touch.clientY - rect.top - dpadMain.clientHeight / 2;
            let up = 0,
                down = 0,
                left = 0,
                right = 0,
                angle = Math.atan(x / y) / (Math.PI / 180);

            if (y <= -10) {
                up = 1;
            }
            if (y >= 10) {
                down = 1;
            }

            if (x >= 10) {
                right = 1;
                left = 0;
                if (angle < 0 && angle >= -35 || angle > 0 && angle <= 35) {
                    right = 0;
                }
                up = (angle < 0 && angle >= -55 ? 1 : 0);
                down = (angle > 0 && angle <= 55 ? 1 : 0);
            }

            if (x <= -10) {
                right = 0;
                left = 1;
                if (angle < 0 && angle >= -35 || angle > 0 && angle <= 35) {
                    left = 0;
                }
                up = (angle > 0 && angle <= 55 ? 1 : 0);
                down = (angle < 0 && angle >= -55 ? 1 : 0);
            }

            dpadMain.classList.toggle("ejs_dpad_up_pressed", up);
            dpadMain.classList.toggle("ejs_dpad_down_pressed", down);
            dpadMain.classList.toggle("ejs_dpad_right_pressed", right);
            dpadMain.classList.toggle("ejs_dpad_left_pressed", left);

            callback(up, down, left, right);
        }
        const cancelCb = (e) => {
            e.preventDefault();
            dpadMain.classList.remove("ejs_dpad_up_pressed");
            dpadMain.classList.remove("ejs_dpad_down_pressed");
            dpadMain.classList.remove("ejs_dpad_right_pressed");
            dpadMain.classList.remove("ejs_dpad_left_pressed");

            callback(0, 0, 0, 0);
        }

        emulator.addEventListener(dpadMain, "touchstart touchmove", updateCb);
        emulator.addEventListener(dpadMain, "touchend touchcancel", cancelCb);


        container.appendChild(dpadMain);
    }

    info.forEach((dpad, index) => {
        if (dpad.type !== "dpad") return;
        if (leftHandedMode && ["left", "right"].includes(dpad.location)) {
            dpad.location = (dpad.location === "left") ? "right" : "left";
            const amnt = JSON.parse(JSON.stringify(dpad));
            if (amnt.left) {
                dpad.right = amnt.left;
            }
            if (amnt.right) {
                dpad.left = amnt.right;
            }
        }
        const elem = emulator.createElement("div");
        let style = "";
        if (dpad.left) {
            style += "left:" + dpad.left + ";";
        }
        if (dpad.right) {
            style += "right:" + dpad.right + ";";
        }
        if (dpad.top) {
            style += "top:" + dpad.top + ";";
        }
        elem.classList.add(controlSchemeCls);
        if (dpad.id) {
            elem.classList.add(`b_${dpad.id}`);
        }
        elem.style = style;
        elems[dpad.location].appendChild(elem);
        createDPad({
            container: elem,
            event: (up, down, left, right) => {
                if (dpad.joystickInput) {
                    if (up === 1) up = 0x7fff;
                    if (down === 1) down = 0x7fff;
                    if (left === 1) left = 0x7fff;
                    if (right === 1) right = 0x7fff;
                }
                emulator.gameManager.simulateInput(0, dpad.inputValues[0], up);
                emulator.gameManager.simulateInput(0, dpad.inputValues[1], down);
                emulator.gameManager.simulateInput(0, dpad.inputValues[2], left);
                emulator.gameManager.simulateInput(0, dpad.inputValues[3], right);
            }
        });
    })

    info.forEach((zone, index) => {
        if (zone.type !== "zone") return;
        if (leftHandedMode && ["left", "right"].includes(zone.location)) {
            zone.location = (zone.location === "left") ? "right" : "left";
            const amnt = JSON.parse(JSON.stringify(zone));
            if (amnt.left) {
                zone.right = amnt.left;
            }
            if (amnt.right) {
                zone.left = amnt.right;
            }
        }
        const elem = emulator.createElement("div");
        emulator.addEventListener(elem, "touchstart touchmove touchend touchcancel", (e) => {
            e.preventDefault();
        });
        elem.classList.add(controlSchemeCls);
        if (zone.id) {
            elem.classList.add(`b_${zone.id}`);
        }
        elems[zone.location].appendChild(elem);
        const zoneObj = nipplejs.create({
            "zone": elem,
            "mode": "static",
            "position": {
                "left": zone.left,
                "top": zone.top
            },
            "color": zone.color || "red"
        });
        zoneObj.on("end", () => {
            emulator.gameManager.simulateInput(0, zone.inputValues[0], 0);
            emulator.gameManager.simulateInput(0, zone.inputValues[1], 0);
            emulator.gameManager.simulateInput(0, zone.inputValues[2], 0);
            emulator.gameManager.simulateInput(0, zone.inputValues[3], 0);
        });
        zoneObj.on("move", (e, info) => {
            const degree = info.angle.degree;
            const distance = info.distance;
            if (zone.joystickInput === true) {
                let x = 0, y = 0;
                if (degree > 0 && degree <= 45) {
                    x = distance / 50;
                    y = -0.022222222222222223 * degree * distance / 50;
                }
                if (degree > 45 && degree <= 90) {
                    x = 0.022222222222222223 * (90 - degree) * distance / 50;
                    y = -distance / 50;
                }
                if (degree > 90 && degree <= 135) {
                    x = 0.022222222222222223 * (90 - degree) * distance / 50;
                    y = -distance / 50;
                }
                if (degree > 135 && degree <= 180) {
                    x = -distance / 50;
                    y = -0.022222222222222223 * (180 - degree) * distance / 50;
                }
                if (degree > 135 && degree <= 225) {
                    x = -distance / 50;
                    y = -0.022222222222222223 * (180 - degree) * distance / 50;
                }
                if (degree > 225 && degree <= 270) {
                    x = -0.022222222222222223 * (270 - degree) * distance / 50;
                    y = distance / 50;
                }
                if (degree > 270 && degree <= 315) {
                    x = -0.022222222222222223 * (270 - degree) * distance / 50;
                    y = distance / 50;
                }
                if (degree > 315 && degree <= 359.9) {
                    x = distance / 50;
                    y = 0.022222222222222223 * (360 - degree) * distance / 50;
                }
                if (x > 0) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[0], 0x7fff * x);
                    emulator.gameManager.simulateInput(0, zone.inputValues[1], 0);
                } else {
                    emulator.gameManager.simulateInput(0, zone.inputValues[1], 0x7fff * -x);
                    emulator.gameManager.simulateInput(0, zone.inputValues[0], 0);
                }
                if (y > 0) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[2], 0x7fff * y);
                    emulator.gameManager.simulateInput(0, zone.inputValues[3], 0);
                } else {
                    emulator.gameManager.simulateInput(0, zone.inputValues[3], 0x7fff * -y);
                    emulator.gameManager.simulateInput(0, zone.inputValues[2], 0);
                }

            } else {
                if (degree >= 30 && degree < 150) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[0], 1);
                } else {
                    window.setTimeout(() => {
                        emulator.gameManager.simulateInput(0, zone.inputValues[0], 0);
                    }, 30);
                }
                if (degree >= 210 && degree < 330) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[1], 1);
                } else {
                    window.setTimeout(() => {
                        emulator.gameManager.simulateInput(0, zone.inputValues[1], 0);
                    }, 30);
                }
                if (degree >= 120 && degree < 240) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[2], 1);
                } else {
                    window.setTimeout(() => {
                        emulator.gameManager.simulateInput(0, zone.inputValues[2], 0);
                    }, 30);
                }
                if (degree >= 300 || degree >= 0 && degree < 60) {
                    emulator.gameManager.simulateInput(0, zone.inputValues[3], 1);
                } else {
                    window.setTimeout(() => {
                        emulator.gameManager.simulateInput(0, zone.inputValues[3], 0);
                    }, 30);
                }
            }
        });
    })

    if (emulator.touch || emulator.hasTouchScreen) {
        const menuButton = emulator.createElement("div");
        menuButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>';
        menuButton.classList.add("ejs_virtualGamepad_open");
        menuButton.style.display = "none";
        emulator.on("start", () => {
            menuButton.style.display = "";
            if (matchMedia('(pointer:fine)').matches && emulator.getSettingValue("menu-bar-button") !== "visible") {
                menuButton.style.opacity = 0;
                emulator.changeSettingOption('menu-bar-button', 'hidden', true);
            }
        });
        emulator.elements.parent.appendChild(menuButton);
        let timeout;
        let ready = true;
        emulator.addEventListener(menuButton, "touchstart touchend mousedown mouseup click", (e) => {
            if (!ready) return;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                ready = true;
            }, 2000)
            ready = false;
            e.preventDefault();
            emulator.menu.toggle();
        })
        emulator.elements.menuToggle = menuButton;
    }

    emulator.virtualGamepad.style.display = "none";
}