export function createNetplayMenu() {
    const body = this.createPopup("Netplay", {
        "Create a Room": () => {
            if (this.isNetplay) {
                this.netplay.leaveRoom();
            } else {
                this.netplay.showOpenRoomDialog();
            }
        },
        "Close": () => {
            this.netplayMenu.style.display = "none";
            this.netplay.updateList.stop();
        }
    }, true);
    this.netplayMenu = body.parentElement;
    const createButton = this.netplayMenu.getElementsByTagName("a")[0];
    const rooms = this.createElement("div");
    const title = this.createElement("strong");
    title.innerText = this.localization("Rooms");
    const table = this.createElement("table");
    table.classList.add("ejs_netplay_table");
    table.style.width = "100%";
    table.setAttribute("cellspacing", "0");
    const thead = this.createElement("thead");
    const row = this.createElement("tr");
    const addToHeader = (text) => {
        const item = this.createElement("td");
        item.innerText = text;
        item.style["text-align"] = "center";
        row.appendChild(item);
        return item;
    }
    thead.appendChild(row);
    addToHeader("Room Name").style["text-align"] = "left";
    addToHeader("Players").style.width = "80px";
    addToHeader("").style.width = "80px"; //"join" button
    table.appendChild(thead);
    const tbody = this.createElement("tbody");

    table.appendChild(tbody);
    rooms.appendChild(title);
    rooms.appendChild(table);

    const joined = this.createElement("div");
    const title2 = this.createElement("strong");
    title2.innerText = "{roomname}";
    const password = this.createElement("div");
    password.innerText = "Password: ";
    const table2 = this.createElement("table");
    table2.classList.add("ejs_netplay_table");
    table2.style.width = "100%";
    table2.setAttribute("cellspacing", "0");
    const thead2 = this.createElement("thead");
    const row2 = this.createElement("tr");
    const addToHeader2 = (text) => {
        const item = this.createElement("td");
        item.innerText = text;
        row2.appendChild(item);
        return item;
    }
    thead2.appendChild(row2);
    addToHeader2("Player").style.width = "80px";
    addToHeader2("Name");
    addToHeader2("").style.width = "80px"; //"join" button
    table2.appendChild(thead2);
    const tbody2 = this.createElement("tbody");

    table2.appendChild(tbody2);
    joined.appendChild(title2);
    joined.appendChild(password);
    joined.appendChild(table2);

    joined.style.display = "none";
    body.appendChild(rooms);
    body.appendChild(joined);

    this.openNetplayMenu = () => {
        this.netplayMenu.style.display = "";
        if (!this.netplay || (this.netplay && !this.netplay.name)) {
            this.netplay = {};
            this.netplay.table = tbody;
            this.netplay.playerTable = tbody2;
            this.netplay.passwordElem = password;
            this.netplay.roomNameElem = title2;
            this.netplay.createButton = createButton;
            this.netplay.tabs = [rooms, joined];
            this.defineNetplayFunctions();
            const popups = this.createSubPopup();
            this.netplayMenu.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent"); //Hehe
            const popup = popups[1];

            const header = this.createElement("div");
            const title = this.createElement("h2");
            title.innerText = this.localization("Set Player Name");
            title.classList.add("ejs_netplay_name_heading");
            header.appendChild(title);
            popup.appendChild(header);

            const main = this.createElement("div");
            main.classList.add("ejs_netplay_header");
            const head = this.createElement("strong");
            head.innerText = this.localization("Player Name");
            const input = this.createElement("input");
            input.type = "text";
            input.setAttribute("maxlength", 20);

            main.appendChild(head);
            main.appendChild(this.createElement("br"));
            main.appendChild(input);
            popup.appendChild(main);

            popup.appendChild(this.createElement("br"));
            const submit = this.createElement("button");
            submit.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            submit.innerText = this.localization("Submit");
            popup.appendChild(submit);
            this.addEventListener(submit, "click", (e) => {
                if (!input.value.trim()) return;
                this.netplay.name = input.value.trim();
                popups[0].remove();
            })
        }
        this.netplay.updateList.start();
    }
}
export function defineNetplayFunctions() {
    function guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    this.netplay.url = this.config.netplayUrl;
    while (this.netplay.url.endsWith("/")) {
        this.netplay.url = this.netplay.url.substring(0, this.netplay.url.length - 1);
    }
    this.netplay.current_frame = 0;
    this.netplay.getOpenRooms = async () => {
        return JSON.parse(await (await fetch(this.netplay.url + "/list?domain=" + window.location.host + "&game_id=" + this.config.gameId)).text());
    }
    this.netplay.updateTableList = async () => {
        const addToTable = (id, name, current, max) => {
            const row = this.createElement("tr");
            row.classList.add("ejs_netplay_table_row");
            const addToHeader = (text) => {
                const item = this.createElement("td");
                item.innerText = text;
                item.style.padding = "10px 0";
                item.style["text-align"] = "center";
                row.appendChild(item);
                return item;
            }
            addToHeader(name).style["text-align"] = "left";
            addToHeader(current + "/" + max).style.width = "80px";

            const parent = addToHeader("");
            parent.style.width = "80px";
            this.netplay.table.appendChild(row);
            if (current < max) {
                const join = this.createElement("button");
                join.classList.add("ejs_netplay_join_button");
                join.classList.add("ejs_button_button");
                join.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
                join.innerText = this.localization("Join");
                parent.appendChild(join);
                this.addEventListener(join, "click", (e) => {
                    this.netplay.joinRoom(id, name);
                })
                return join;
            }
        }
        const open = await this.netplay.getOpenRooms();
        //console.log(open);
        this.netplay.table.innerHTML = "";
        for (const k in open) {
            addToTable(k, open[k].room_name, open[k].current, open[k].max);//todo: password
        }
    }
    this.netplay.showOpenRoomDialog = () => {
        const popups = this.createSubPopup();
        this.netplayMenu.appendChild(popups[0]);
        popups[1].classList.add("ejs_cheat_parent"); //Hehe
        const popup = popups[1];

        const header = this.createElement("div");
        const title = this.createElement("h2");
        title.innerText = this.localization("Create a room");
        title.classList.add("ejs_netplay_name_heading");
        header.appendChild(title);
        popup.appendChild(header);

        const main = this.createElement("div");

        main.classList.add("ejs_netplay_header");
        const rnhead = this.createElement("strong");
        rnhead.innerText = this.localization("Room Name");
        const rninput = this.createElement("input");
        rninput.type = "text";
        rninput.setAttribute("maxlength", 20);

        const maxhead = this.createElement("strong");
        maxhead.innerText = this.localization("Max Players");
        const maxinput = this.createElement("select");
        maxinput.setAttribute("disabled", "disabled");
        const val2 = this.createElement("option");
        val2.value = 2;
        val2.innerText = "2";
        const val3 = this.createElement("option");
        val3.value = 3;
        val3.innerText = "3";
        const val4 = this.createElement("option");
        val4.value = 4;
        val4.innerText = "4";
        maxinput.appendChild(val2);
        maxinput.appendChild(val3);
        maxinput.appendChild(val4);

        const pwhead = this.createElement("strong");
        pwhead.innerText = this.localization("Password (optional)");
        const pwinput = this.createElement("input");
        pwinput.type = "text";
        pwinput.setAttribute("maxlength", 20);

        main.appendChild(rnhead);
        main.appendChild(this.createElement("br"));
        main.appendChild(rninput);

        main.appendChild(maxhead);
        main.appendChild(this.createElement("br"));
        main.appendChild(maxinput);

        main.appendChild(pwhead);
        main.appendChild(this.createElement("br"));
        main.appendChild(pwinput);

        popup.appendChild(main);

        popup.appendChild(this.createElement("br"));
        const submit = this.createElement("button");
        submit.classList.add("ejs_button_button");
        submit.classList.add("ejs_popup_submit");
        submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
        submit.style.margin = "0 10px";
        submit.innerText = this.localization("Submit");
        popup.appendChild(submit);
        this.addEventListener(submit, "click", (e) => {
            if (!rninput.value.trim()) return;
            this.netplay.openRoom(rninput.value.trim(), parseInt(maxinput.value), pwinput.value.trim());
            popups[0].remove();
        })
        const close = this.createElement("button");
        close.classList.add("ejs_button_button");
        close.classList.add("ejs_popup_submit");
        close.style.margin = "0 10px";
        close.innerText = this.localization("Close");
        popup.appendChild(close);
        this.addEventListener(close, "click", (e) => {
            popups[0].remove();
        })
    }
    this.netplay.startSocketIO = (callback) => {
        this.netplay.socket = io(this.netplay.url);
        this.netplay.socket.on("connect", () => callback());
        this.netplay.socket.on("users-updated", (users) => {
            this.netplay.reset();
            if (this.debug) console.log(users);
            this.netplay.players = users;
            this.netplay.updatePlayersTable();
            if (this.netplay.owner) this.netplay.sync();
        })
        this.netplay.socket.on("disconnect", () => this.netplay.roomLeft());
        this.netplay.socket.on("data-message", (data) => {
            this.netplay.dataMessage(data);
        })
    }
    this.netplay.openRoom = (roomName, maxPlayers, password) => {
        const sessionid = guidGenerator();
        this.netplay.playerID = guidGenerator();
        this.netplay.players = {};
        this.netplay.extra = {
            domain: window.location.host,
            game_id: this.config.gameId,
            room_name: roomName,
            player_name: this.netplay.name,
            userid: this.netplay.playerID,
            sessionid: sessionid
        }
        this.netplay.players[this.netplay.playerID] = this.netplay.extra;
        this.netplay.users = {};

        this.netplay.startSocketIO((error) => {
            this.netplay.socket.emit("open-room", {
                extra: this.netplay.extra,
                maxPlayers: maxPlayers,
                password: password
            }, (error) => {
                if (error) {
                    if (this.debug) console.log("error: ", error);
                    return;
                }
                this.netplay.roomJoined(true, roomName, password, sessionid);
            })
        });
    }
    this.netplay.leaveRoom = () => {
        if (this.debug) console.log("asd");
        this.netplay.roomLeft();
    }
    this.netplay.joinRoom = (sessionid, roomName) => {
        this.netplay.playerID = guidGenerator();
        this.netplay.players = {};
        this.netplay.extra = {
            domain: window.location.host,
            game_id: this.config.gameId,
            room_name: roomName,
            player_name: this.netplay.name,
            userid: this.netplay.playerID,
            sessionid: sessionid
        }
        this.netplay.players[this.netplay.playerID] = this.netplay.extra;

        this.netplay.startSocketIO((error) => {
            this.netplay.socket.emit("join-room", {
                extra: this.netplay.extra//,
                //password: password
            }, (error, users) => {
                if (error) {
                    if (this.debug) console.log("error: ", error);
                    return;
                }
                this.netplay.players = users;
                //this.netplay.roomJoined(false, roomName, password, sessionid);
                this.netplay.roomJoined(false, roomName, "", sessionid);
            })
        });
    }
    this.netplay.roomJoined = (isOwner, roomName, password, roomId) => {
        //Will already assume this.netplay.players has been refreshed
        this.isNetplay = true;
        this.netplay.inputs = {};
        this.netplay.owner = isOwner;
        if (this.debug) console.log(this.netplay.extra);
        this.netplay.roomNameElem.innerText = roomName;
        this.netplay.tabs[0].style.display = "none";
        this.netplay.tabs[1].style.display = "";
        if (password) {
            this.netplay.passwordElem.style.display = "";
            this.netplay.passwordElem.innerText = this.localization("Password") + ": " + password
        } else {
            this.netplay.passwordElem.style.display = "none";
        }
        this.netplay.createButton.innerText = this.localization("Leave Room");
        this.netplay.updatePlayersTable();
        if (!this.netplay.owner) {
            this.netplay.oldStyles = [
                this.elements.bottomBar.cheat[0].style.display,
                this.elements.bottomBar.playPause[0].style.display,
                this.elements.bottomBar.playPause[1].style.display,
                this.elements.bottomBar.restart[0].style.display,
                this.elements.bottomBar.loadState[0].style.display,
                this.elements.bottomBar.saveState[0].style.display,
                this.elements.bottomBar.saveSavFiles[0].style.display,
                this.elements.bottomBar.loadSavFiles[0].style.display,
                this.elements.contextMenu.save.style.display,
                this.elements.contextMenu.load.style.display
            ]
            this.elements.bottomBar.cheat[0].style.display = "none";
            this.elements.bottomBar.playPause[0].style.display = "none";
            this.elements.bottomBar.playPause[1].style.display = "none";
            this.elements.bottomBar.restart[0].style.display = "none";
            this.elements.bottomBar.loadState[0].style.display = "none";
            this.elements.bottomBar.saveState[0].style.display = "none";
            this.elements.bottomBar.saveSavFiles[0].style.display = "none";
            this.elements.bottomBar.loadSavFiles[0].style.display = "none";
            this.elements.contextMenu.save.style.display = "none";
            this.elements.contextMenu.load.style.display = "none";
            this.gameManager.resetCheat();
        } else {
            this.netplay.oldStyles = [
                this.elements.bottomBar.cheat[0].style.display
            ]
        }
        this.elements.bottomBar.cheat[0].style.display = "none";
    }
    this.netplay.updatePlayersTable = () => {
        const table = this.netplay.playerTable;
        table.innerHTML = "";
        const addToTable = (num, playerName) => {
            const row = this.createElement("tr");
            const addToHeader = (text) => {
                const item = this.createElement("td");
                item.innerText = text;
                row.appendChild(item);
                return item;
            }
            addToHeader(num).style.width = "80px";
            addToHeader(playerName);
            addToHeader("").style.width = "80px"; //"join" button
            table.appendChild(row);
        }
        let i = 1;
        for (const k in this.netplay.players) {
            addToTable(i, this.netplay.players[k].player_name);
            i++;
        }
    }
    this.netplay.roomLeft = () => {
        this.isNetplay = false;
        this.netplay.tabs[0].style.display = "";
        this.netplay.tabs[1].style.display = "none";
        this.netplay.extra = null;
        this.netplay.playerID = null;
        this.netplay.createButton.innerText = this.localization("Create a Room");
        this.netplay.socket.disconnect();
        this.elements.bottomBar.cheat[0].style.display = this.netplay.oldStyles[0];
        if (!this.netplay.owner) {
            this.elements.bottomBar.playPause[0].style.display = this.netplay.oldStyles[1];
            this.elements.bottomBar.playPause[1].style.display = this.netplay.oldStyles[2];
            this.elements.bottomBar.restart[0].style.display = this.netplay.oldStyles[3];
            this.elements.bottomBar.loadState[0].style.display = this.netplay.oldStyles[4];
            this.elements.bottomBar.saveState[0].style.display = this.netplay.oldStyles[5];
            this.elements.bottomBar.saveSavFiles[0].style.display = this.netplay.oldStyles[6];
            this.elements.bottomBar.loadSavFiles[0].style.display = this.netplay.oldStyles[7];
            this.elements.contextMenu.save.style.display = this.netplay.oldStyles[8];
            this.elements.contextMenu.load.style.display = this.netplay.oldStyles[9];
        }
        this.updateCheatUI();
    }
    this.netplay.setLoading = (loading) => {
        if (this.debug) console.log("loading:", loading);
    }
    let syncing = false;
    this.netplay.sync = async () => {
        if (syncing) return;
        syncing = true;
        if (this.debug) console.log("sync")
        this.netplay.ready = 0;
        const state = this.gameManager.getState();
        this.netplay.sendMessage({
            state: state
        });
        this.netplay.setLoading(true);
        this.pause(true);
        this.netplay.ready++;
        this.netplay.current_frame = 0;
        if (this.netplay.ready === this.netplay.getUserCount()) {
            this.play(true);
        }
        syncing = false;
    }
    this.netplay.getUserIndex = (user) => {
        let i = 0;
        for (const k in this.netplay.players) {
            if (k === user) return i;
            i++;
        }
        return -1;
    }
    this.netplay.getUserCount = () => {
        let i = 0;
        for (const k in this.netplay.players) i++;
        return i;
    }
    let justReset = false;
    this.netplay.dataMessage = (data) => {
        //console.log(data);
        if (data.sync === true && this.netplay.owner) {
            this.netplay.sync();
        }
        if (data.state) {
            this.netplay.wait = true;
            this.netplay.setLoading(true);
            this.pause(true);
            this.gameManager.loadState(new Uint8Array(data.state));
            this.netplay.sendMessage({ ready: true });
        }
        if (data.play && !this.owner) {
            this.play(true);
        }
        if (data.pause && !this.owner) {
            this.pause(true);
        }
        if (data.ready && this.netplay.owner) {
            this.netplay.ready++;
            if (this.netplay.ready === this.netplay.getUserCount()) {
                this.netplay.sendMessage({ readyready: true });
                this.netplay.reset();
                setTimeout(() => this.play(true), 48);
                this.netplay.setLoading(false);
            }
        }
        if (data.readyready) {
            this.netplay.setLoading(false);
            this.netplay.reset();
            this.play(true);
        }
        if (data.shortPause) console.log(data.shortPause);
        if (data.shortPause && data.shortPause !== this.netplay.playerID) {
            this.pause(true);
            this.netplay.wait = true;
            setTimeout(() => this.play(true), 48);
        }
        if (data["sync-control"]) {
            data["sync-control"].forEach((value) => {
                let inFrame = parseInt(value.frame);
                let frame = this.netplay.currentFrame;
                if (!value.connected_input || value.connected_input[0] < 0) return;
                //if (value.connected_input[0] === this.netplay.getUserIndex(this.netplay.playerID)) return;
                console.log(value, inFrame, frame);
                if (inFrame === frame) {
                    inFrame++;
                    this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                }
                this.netplay.inputsData[inFrame] || (this.netplay.inputsData[inFrame] = []);
                this.netplay.inputsData[frame] || (this.netplay.inputsData[frame] = []);
                if (this.netplay.owner) {
                    this.netplay.inputsData[frame].push(value);
                    this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                    if (frame - 10 >= inFrame) {
                        this.netplay.wait = true;
                        this.pause(true);
                        setTimeout(() => {
                            this.play(true);
                            this.netplay.wait = false;
                        }, 48)
                    }
                } else {
                    this.netplay.inputsData[inFrame].push(value);
                    if (this.netplay.inputsData[frame]) {
                        this.play(true);
                    }
                    if (frame + 10 <= inFrame && inFrame > this.netplay.init_frame + 100) {
                        this.netplay.sendMessage({ shortPause: this.netplay.playerID });
                    }
                }
            });
        }
        if (data.restart) {
            this.gameManager.restart();
            this.netplay.reset();
            this.play(true);
        }
    }
    this.netplay.simulateInput = (player, index, value, resp) => {
        if (!this.isNetplay) return;
        if (player !== 0 && !resp) return;
        player = this.netplay.getUserIndex(this.netplay.playerID);
        let frame = this.netplay.currentFrame;
        if (this.netplay.owner) {
            if (!this.netplay.inputsData[frame]) {
                this.netplay.inputsData[frame] = [];
            }
            this.netplay.inputsData[frame].push({
                frame: frame,
                connected_input: [player, index, value]
            })
            this.gameManager.functions.simulateInput(player, index, value);
        } else {
            this.netplay.sendMessage({
                "sync-control": [{
                    frame: frame + 10,
                    connected_input: [player, index, value]
                }]
            })
        }
    }
    this.netplay.sendMessage = (data) => {
        this.netplay.socket.emit("data-message", data);
    }
    this.netplay.reset = () => {
        this.netplay.init_frame = this.netplay.currentFrame;
        this.netplay.inputsData = {};
    }
    //let fps;
    //let lastTime;
    this.netplay.init_frame = 0;
    this.netplay.currentFrame = 0;
    this.netplay.inputsData = {};
    this.Module.postMainLoop = () => {
        //const newTime = window.performance.now();
        //fps = 1000 / (newTime - lastTime);
        //console.log(fps);
        //lastTime = newTime;
        //frame syncing - working
        //control syncing - broken
        this.netplay.currentFrame = parseInt(this.gameManager.getFrameNum()) - this.netplay.init_frame;
        if (!this.isNetplay) return;
        if (this.netplay.owner) {
            let to_send = [];
            let i = this.netplay.currentFrame - 1;
            this.netplay.inputsData[i] ? this.netplay.inputsData[i].forEach((value) => {
                value.frame += 10;
                to_send.push(value);
            }) : to_send.push({ frame: i + 10 });
            this.netplay.sendMessage({ "sync-control": to_send });
        } else {
            if (this.netplay.currentFrame <= 0 || this.netplay.inputsData[this.netplay.currentFrame]) {
                this.netplay.wait = false;
                this.play();
                this.netplay.inputsData[this.netplay.currentFrame].forEach((value) => {
                    if (!value.connected_input) return;
                    console.log(value.connected_input);
                    this.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                })
            } else if (!this.netplay.syncing) {
                console.log("sync");
                this.pause(true);
                this.netplay.sendMessage({ sync: true });
                this.netplay.syncing = true;
            }
        }
        if (this.netplay.currentFrame % 100 === 0) {
            Object.keys(this.netplay.inputsData).forEach(value => {
                if (value < this.netplay.currentFrame - 50) {
                    this.netplay.inputsData[value] = null;
                    delete this.netplay.inputsData[value];
                }
            })
        }
    }

    this.netplay.updateList = {
        start: () => {
            this.netplay.updateList.interval = setInterval(this.netplay.updateTableList.bind(this), 1000);
        },
        stop: () => {
            clearInterval(this.netplay.updateList.interval);
        }
    }
}
