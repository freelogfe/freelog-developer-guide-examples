export const openCacheMenu = (emulator) => {
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