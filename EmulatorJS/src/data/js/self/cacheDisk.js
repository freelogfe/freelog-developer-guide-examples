export function openCacheMenu(emulator) {
    (async () => {
        const list = emulator.createElement("table");
        const tbody = emulator.createElement("tbody");
        const body = emulator.createPopup("Cache Manager", {
            "Clear All": async () => {
                const roms = await emulator.storage.rom.getSizes();
                for (const k in roms) {
                    await emulator.storage.rom.remove(k);
                }
                tbody.innerHTML = "";
            },
            "Close": () => {
                emulator.closePopup();
            }
        });
        const roms = await emulator.storage.rom.getSizes();
        list.style.width = "100%";
        list.style["padding-left"] = "10px";
        list.style["text-align"] = "left";
        body.appendChild(list);
        list.appendChild(tbody);
        const getSize = function (size) {
            let i = -1;
            do {
                size /= 1024, i++;
            } while (size > 1024);
            return Math.max(size, 0.1).toFixed(1) + [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"][i];
        }
        for (const k in roms) {
            const line = emulator.createElement("tr");
            const name = emulator.createElement("td");
            const size = emulator.createElement("td");
            const remove = emulator.createElement("td");
            remove.style.cursor = "pointer";
            name.innerText = k;
            size.innerText = getSize(roms[k]);

            const a = emulator.createElement("a");
            a.innerText = emulator.localization("Remove");
            emulator.addEventListener(remove, "click", () => {
                emulator.storage.rom.remove(k);
                line.remove();
            })
            remove.appendChild(a);

            line.appendChild(name);
            line.appendChild(size);
            line.appendChild(remove);
            tbody.appendChild(line);
        }
    })();
}

export function setupDisksMenu() {
    this.disksMenu = this.createElement("div");
    this.disksMenu.classList.add("ejs_settings_parent");
    const nested = this.createElement("div");
    nested.classList.add("ejs_settings_transition");
    this.disks = {};

    const home = this.createElement("div");
    home.style.overflow = "auto";
    const menus = [];
    this.handleDisksResize = () => {
        let needChange = false;
        if (this.disksMenu.style.display !== "") {
            this.disksMenu.style.opacity = "0";
            this.disksMenu.style.display = "";
            needChange = true;
        }
        let height = this.elements.parent.getBoundingClientRect().height;
        let w2 = this.diskParent.parentElement.getBoundingClientRect().width;
        let disksX = this.diskParent.getBoundingClientRect().x;
        if (w2 > window.innerWidth) disksX += (w2 - window.innerWidth);
        const onTheRight = disksX > (w2 - 15) / 2;
        if (height > 375) height = 375;
        home.style["max-height"] = (height - 95) + "px";
        nested.style["max-height"] = (height - 95) + "px";
        for (let i = 0; i < menus.length; i++) {
            menus[i].style["max-height"] = (height - 95) + "px";
        }
        this.disksMenu.classList.toggle("ejs_settings_center_left", !onTheRight);
        this.disksMenu.classList.toggle("ejs_settings_center_right", onTheRight);
        if (needChange) {
            this.disksMenu.style.display = "none";
            this.disksMenu.style.opacity = "";
        }
    }

    home.classList.add("ejs_setting_menu");
    nested.appendChild(home);
    let funcs = [];
    this.changeDiskOption = (title, newValue) => {
        this.disks[title] = newValue;
        funcs.forEach(e => e(title));
    }
    let allOpts = {};

    // TODO - Why is this duplicated?
    const addToMenu = (title, id, options, defaultOption) => {
        const span = this.createElement("span");
        span.innerText = title;

        const current = this.createElement("div");
        current.innerText = "";
        current.classList.add("ejs_settings_main_bar_selected");
        span.appendChild(current);

        const menu = this.createElement("div");
        menus.push(menu);
        menu.setAttribute("hidden", "");
        menu.classList.add("ejs_parent_option_div");
        const button = this.createElement("button");
        const goToHome = () => {
            const homeSize = this.getElementSize(home);
            nested.style.width = (homeSize.width + 20) + "px";
            nested.style.height = homeSize.height + "px";
            menu.setAttribute("hidden", "");
            home.removeAttribute("hidden");
        }
        this.addEventListener(button, "click", goToHome);

        button.type = "button";
        button.classList.add("ejs_back_button");
        menu.appendChild(button);
        const pageTitle = this.createElement("span");
        pageTitle.innerText = title;
        pageTitle.classList.add("ejs_menu_text_a");
        button.appendChild(pageTitle);

        const optionsMenu = this.createElement("div");
        optionsMenu.classList.add("ejs_setting_menu");

        let buttons = [];
        let opts = options;
        if (Array.isArray(options)) {
            opts = {};
            for (let i = 0; i < options.length; i++) {
                opts[options[i]] = options[i];
            }
        }
        allOpts[id] = opts;

        funcs.push((title) => {
            if (id !== title) return;
            for (let j = 0; j < buttons.length; j++) {
                buttons[j].classList.toggle("ejs_option_row_selected", buttons[j].getAttribute("ejs_value") === this.disks[id]);
            }
            this.menuOptionChanged(id, this.disks[id]);
            current.innerText = opts[this.disks[id]];
        });

        for (const opt in opts) {
            const optionButton = this.createElement("button");
            buttons.push(optionButton);
            optionButton.setAttribute("ejs_value", opt);
            optionButton.type = "button";
            optionButton.value = opts[opt];
            optionButton.classList.add("ejs_option_row");
            optionButton.classList.add("ejs_button_style");

            this.addEventListener(optionButton, "click", (e) => {
                this.disks[id] = opt;
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove("ejs_option_row_selected");
                }
                optionButton.classList.add("ejs_option_row_selected");
                this.menuOptionChanged(id, opt);
                current.innerText = opts[opt];
                goToHome();
            })
            if (defaultOption === opt) {
                optionButton.classList.add("ejs_option_row_selected");
                this.menuOptionChanged(id, opt);
                current.innerText = opts[opt];
            }

            const msg = this.createElement("span");
            msg.innerText = opts[opt];
            optionButton.appendChild(msg);

            optionsMenu.appendChild(optionButton);
        }

        home.appendChild(optionsMenu);

        nested.appendChild(menu);
    }

    if (this.gameManager.getDiskCount() > 1) {
        const diskLabels = {};
        let isM3U = false;
        let disks = {};
        if (this.fileName.split(".").pop() === "m3u") {
            disks = this.gameManager.Module.FS.readFile(this.fileName, { encoding: "utf8" }).split("\n");
            isM3U = true;
        }
        for (let i = 0; i < this.gameManager.getDiskCount(); i++) {
            // default if not an m3u loaded rom is "Disk x"
            // if m3u, then use the file name without the extension
            // if m3u, and contains a |, then use the string after the | as the disk label
            if (!isM3U) {
                diskLabels[i.toString()] = "Disk " + (i + 1);
            } else {
                // get disk name from m3u
                const diskLabelValues = disks[i].split("|");
                // remove the file extension from the disk file name
                let diskLabel = diskLabelValues[0].replace("." + diskLabelValues[0].split(".").pop(), "");
                if (diskLabelValues.length >= 2) {
                    // has a label - use that instead
                    diskLabel = diskLabelValues[1];
                }
                diskLabels[i.toString()] = diskLabel;
            }
        }
        addToMenu(this.localization("Disk"), "disk", diskLabels, this.gameManager.getCurrentDisk().toString());
    }

    this.disksMenu.appendChild(nested);

    this.diskParent.appendChild(this.disksMenu);
    this.diskParent.style.position = "relative";

    const homeSize = this.getElementSize(home);
    nested.style.width = (homeSize.width + 20) + "px";
    nested.style.height = homeSize.height + "px";

    this.disksMenu.style.display = "none";

    if (this.debug) {
        console.log("Available core options", allOpts);
    }

    if (this.config.defaultOptions) {
        for (const k in this.config.defaultOptions) {
            this.changeDiskOption(k, this.config.defaultOptions[k]);
        }
    }
}