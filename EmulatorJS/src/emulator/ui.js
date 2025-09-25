/**
 * UI handling functions
 */

export function createUI(emulator) {
    // Create main game container
    createGameContainer(emulator);
    
    // Create start button
    createStartButton(emulator);
    
    // Create loading text
    createLoadingText(emulator);
    
    console.log("UI components created");
}

function createGameContainer(emulator) {
    emulator.game.classList.add("ejs_game");
    if (typeof emulator.config.backgroundImg === "string") {
        emulator.game.classList.add("ejs_game_background");
        if (emulator.config.backgroundBlur) emulator.game.classList.add("ejs_game_background_blur");
        emulator.game.setAttribute("style", `--ejs-background-image: url("${emulator.config.backgroundImg}"); --ejs-background-color: ${emulator.config.backgroundColor || "rgb(51, 51, 51)"};`);
    } else {
        emulator.game.setAttribute("style", "--ejs-background-color: " + (emulator.config.backgroundColor || "rgb(51, 51, 51)") + ";");
    }
}

function createStartButton(emulator) {
    const button = document.createElement("div");
    button.classList.add("ejs_start_button");
    let border = 0;
    if (typeof emulator.config.backgroundImg === "string") {
        button.classList.add("ejs_start_button_border");
        border = 1;
    }
    button.innerText = (typeof emulator.config.startBtnName === "string") ? emulator.config.startBtnName : "Start Game";
    
    // Position based on config
    if (emulator.config.alignStartButton == "top") {
        button.style.bottom = "calc(100% - 20px)";
    } else if (emulator.config.alignStartButton == "center") {
        button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
    }
    
    emulator.elements.parent.appendChild(button);
    
    // Add event listeners
    button.addEventListener("touchstart", () => {
        emulator.state.touch = true;
    });
    
    button.addEventListener("click", () => startButtonClicked(emulator, button));
    
    if (emulator.config.startOnLoad === true) {
        startButtonClicked(emulator, button);
    }
    
    // Call ready event
    setTimeout(() => {
        if (emulator.functions && emulator.functions.ready) {
            emulator.functions.ready.forEach(fn => fn());
        }
    }, 20);
}

function createLoadingText(emulator) {
    emulator.textElem = document.createElement("div");
    emulator.textElem.classList.add("ejs_loading_text");
    if (typeof emulator.config.backgroundImg === "string") {
        emulator.textElem.classList.add("ejs_loading_text_glow");
    }
    emulator.textElem.innerText = "Loading...";
    // Will be added to parent when start button is clicked
}

function startButtonClicked(emulator, button) {
    // Call start-clicked event
    if (emulator.functions && emulator.functions["start-clicked"]) {
        emulator.functions["start-clicked"].forEach(fn => fn());
    }
    
    // Remove button
    button.remove();
    
    // Add loading text to parent
    emulator.elements.parent.appendChild(emulator.textElem);
    
    // Start the actual emulator
    startEmulator(emulator);
}

function startEmulator(emulator) {
    console.log("Starting emulator...");
    // This would connect to the actual emulator core
    // Implementation would depend on specific emulator integration
}