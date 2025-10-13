export function buildButtonOptions(buttonUserOpts, defaultButtonAliases, defaultButtonOptions) {
    let mergedButtonOptions = defaultButtonOptions;

    // merge buttonUserOpts with mergedButtonOptions
    if (buttonUserOpts) {
        for (const key in buttonUserOpts) {
            let searchKey = key;
            // If the key is an alias, find the actual key in the default buttons
            if (defaultButtonAliases[key]) {
                // Use the alias to find the actual key
                // and update the searchKey to the actual key
                searchKey = defaultButtonAliases[key];
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

                if (defaultButtonOptions[searchKey]) {
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
            }

            // behaviour exceptions
            switch (searchKey) {
                case "playPause":
                    mergedButtonOptions.play.visible = mergedButtonOptions.playPause.visible;
                    mergedButtonOptions.pause.visible = mergedButtonOptions.playPause.visible;
                    break;

                case "mute":
                    mergedButtonOptions.unmute.visible = mergedButtonOptions.mute.visible;
                    break;

                case "fullscreen":
                    mergedButtonOptions.enterFullscreen.visible = mergedButtonOptions.fullscreen.visible;
                    mergedButtonOptions.exitFullscreen.visible = mergedButtonOptions.fullscreen.visible;
                    break;
            }
        }
    }

    return mergedButtonOptions;
}
