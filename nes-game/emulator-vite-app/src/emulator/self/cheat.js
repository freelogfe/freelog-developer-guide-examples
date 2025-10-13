export function updateCheatUI() {
    if (!this.gameManager) return;
    this.elements.cheatRows.innerHTML = "";

    const addToMenu = (desc, checked, code, is_permanent, i) => {
        const row = this.createElement("div");
        row.classList.add("ejs_cheat_row");
        const input = this.createElement("input");
        input.type = "checkbox";
        input.checked = checked;
        input.value = i;
        input.id = "ejs_cheat_switch_" + i;
        row.appendChild(input);
        const label = this.createElement("label");
        label.for = "ejs_cheat_switch_" + i;
        label.innerText = desc;
        row.appendChild(label);
        label.addEventListener("click", (e) => {
            input.checked = !input.checked;
            this.cheats[i].checked = input.checked;
            this.cheatChanged(input.checked, code, i);
            this.saveSettings();
        })
        if (!is_permanent) {
            const close = this.createElement("a");
            close.classList.add("ejs_cheat_row_button");
            close.innerText = "×";
            row.appendChild(close);
            close.addEventListener("click", (e) => {
                this.cheatChanged(false, code, i);
                this.cheats.splice(i, 1);
                this.updateCheatUI();
                this.saveSettings();
            })
        }
        this.elements.cheatRows.appendChild(row);
        this.cheatChanged(checked, code, i);
    }
    this.gameManager.resetCheat();
    for (let i = 0; i < this.cheats.length; i++) {
        addToMenu(this.cheats[i].desc, this.cheats[i].checked, this.cheats[i].code, this.cheats[i].is_permanent, i);
    }
}
export function cheatChanged(checked, code, index) {
    if (!this.gameManager) return;
    this.gameManager.setCheat(index, checked, code);
}