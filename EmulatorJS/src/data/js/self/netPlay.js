export function createNetplayMenu(emulator) {
    const body = emulator.createPopup("Netplay", {
        "Create a Room": () => {
            if (emulator.isNetplay) {
                emulator.netplay.leaveRoom();
            } else {
                emulator.netplay.showOpenRoomDialog();
            }
        },
        "Close": () => {
            emulator.netplayMenu.style.display = "none";
            emulator.netplay.updateList.stop();
        }
    }, true);
    emulator.netplayMenu = body.parentElement;
    const createButton = emulator.netplayMenu.getElementsByTagName("a")[0];
    const rooms = emulator.createElement("div");
    const title = emulator.createElement("strong");
    title.innerText = emulator.localization("Rooms");
    const table = emulator.createElement("table");
    table.classList.add("ejs_netplay_table");
    table.style.width = "100%";
    table.setAttribute("cellspacing", "0");
    const thead = emulator.createElement("thead");
    const row = emulator.createElement("tr");
    const addToHeader = (text) => {
        const item = emulator.createElement("td");
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
    const tbody = emulator.createElement("tbody");

    table.appendChild(tbody);
    rooms.appendChild(title);
    rooms.appendChild(table);

    const joined = emulator.createElement("div");
    const title2 = emulator.createElement("strong");
    title2.innerText = "{roomname}";
    const password = emulator.createElement("div");
    password.innerText = "Password: ";
    const table2 = emulator.createElement("table");
    table2.classList.add("ejs_netplay_table");
    table2.style.width = "100%";
    table2.setAttribute("cellspacing", "0");
    const thead2 = emulator.createElement("thead");
    const row2 = emulator.createElement("tr");
    const addToHeader2 = (text) => {
        const item = emulator.createElement("td");
        item.innerText = text;
        row2.appendChild(item);
        return item;
    }
    thead2.appendChild(row2);
    addToHeader2("Player").style.width = "80px";
    addToHeader2("Name");
    addToHeader2("").style.width = "80px"; //"join" button
    table2.appendChild(thead2);
    const tbody2 = emulator.createElement("tbody");

    table2.appendChild(tbody2);
    joined.appendChild(title2);
    joined.appendChild(password);
    joined.appendChild(table2);

    joined.style.display = "none";
    body.appendChild(rooms);
    body.appendChild(joined);

    emulator.openNetplayMenu = () => {
        emulator.netplayMenu.style.display = "";
        if (!emulator.netplay || (emulator.netplay && !emulator.netplay.name)) {
            emulator.netplay = {};
            emulator.netplay.table = tbody;
            emulator.netplay.playerTable = tbody2;
            emulator.netplay.passwordElem = password;
            emulator.netplay.roomNameElem = title2;
            emulator.netplay.createButton = createButton;
            emulator.netplay.tabs = [rooms, joined];
            defineNetplayFunctions(emulator);
            const popups = emulator.createSubPopup();
            emulator.netplayMenu.appendChild(popups[0]);
            popups[1].classList.add("ejs_cheat_parent"); //Hehe
            const popup = popups[1];

            const header = emulator.createElement("div");
            const title = emulator.createElement("h2");
            title.innerText = emulator.localization("Set Player Name");
            title.classList.add("ejs_netplay_name_heading");
            header.appendChild(title);
            popup.appendChild(header);

            const main = emulator.createElement("div");
            main.classList.add("ejs_netplay_header");
            const head = emulator.createElement("strong");
            head.innerText = emulator.localization("Player Name");
            const input = emulator.createElement("input");
            input.type = "text";
            input.setAttribute("maxlength", 20);

            main.appendChild(head);
            main.appendChild(emulator.createElement("br"));
            main.appendChild(input);
            popup.appendChild(main);

            popup.appendChild(emulator.createElement("br"));
            const submit = emulator.createElement("button");
            submit.classList.add("ejs_button_button");
            submit.classList.add("ejs_popup_submit");
            submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
            submit.innerText = emulator.localization("Submit");
            popup.appendChild(submit);
            emulator.addEventListener(submit, "click", (e) => {
                if (!input.value.trim()) return;
                emulator.netplay.name = input.value.trim();
                popups[0].remove();
            })
        }
        emulator.netplay.updateList.start();
    }
}


export function defineNetplayFunctions(emulator) {
    function guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    emulator.netplay.url = emulator.config.netplayUrl;
    while (emulator.netplay.url.endsWith("/")) {
        emulator.netplay.url = emulator.netplay.url.substring(0, emulator.netplay.url.length - 1);
    }
    emulator.netplay.current_frame = 0;
    emulator.netplay.getOpenRooms = async () => {
        return JSON.parse(await (await fetch(emulator.netplay.url + "/list?domain=" + window.location.host + "&game_id=" + emulator.config.gameId)).text());
    }
    emulator.netplay.updateTableList = async () => {
        const addToTable = (id, name, current, max) => {
            const row = emulator.createElement("tr");
            row.classList.add("ejs_netplay_table_row");
            const addToHeader = (text) => {
                const item = emulator.createElement("td");
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
            emulator.netplay.table.appendChild(row);
            if (current < max) {
                const join = emulator.createElement("button");
                join.classList.add("ejs_netplay_join_button");
                join.classList.add("ejs_button_button");
                join.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
                join.innerText = emulator.localization("Join");
                parent.appendChild(join);
                emulator.addEventListener(join, "click", (e) => {
                    emulator.netplay.joinRoom(id, name);
                })
                return join;
            }
        }
        const open = await emulator.netplay.getOpenRooms();
        //console.log(open);
        emulator.netplay.table.innerHTML = "";
        for (const k in open) {
            addToTable(k, open[k].room_name, open[k].current, open[k].max);//todo: password
        }
    }
    emulator.netplay.showOpenRoomDialog = () => {
        const popups = emulator.createSubPopup();
        emulator.netplayMenu.appendChild(popups[0]);
        popups[1].classList.add("ejs_cheat_parent"); //Hehe
        const popup = popups[1];

        const header = emulator.createElement("div");
        const title = emulator.createElement("h2");
        title.innerText = emulator.localization("Create a room");
        title.classList.add("ejs_netplay_name_heading");
        header.appendChild(title);
        popup.appendChild(header);

        const main = emulator.createElement("div");

        main.classList.add("ejs_netplay_header");
        const rnhead = emulator.createElement("strong");
        rnhead.innerText = emulator.localization("Room Name");
        const rninput = emulator.createElement("input");
        rninput.type = "text";
        rninput.setAttribute("maxlength", 20);

        const maxhead = emulator.createElement("strong");
        maxhead.innerText = emulator.localization("Max Players");
        const maxinput = emulator.createElement("select");
        maxinput.setAttribute("disabled", "disabled");
        const val2 = emulator.createElement("option");
        val2.value = 2;
        val2.innerText = "2";
        const val3 = emulator.createElement("option");
        val3.value = 3;
        val3.innerText = "3";
        const val4 = emulator.createElement("option");
        val4.value = 4;
        val4.innerText = "4";
        maxinput.appendChild(val2);
        maxinput.appendChild(val3);
        maxinput.appendChild(val4);

        const pwhead = emulator.createElement("strong");
        pwhead.innerText = emulator.localization("Password (optional)");
        const pwinput = emulator.createElement("input");
        pwinput.type = "text";
        pwinput.setAttribute("maxlength", 20);

        main.appendChild(rnhead);
        main.appendChild(emulator.createElement("br"));
        main.appendChild(rninput);

        main.appendChild(maxhead);
        main.appendChild(emulator.createElement("br"));
        main.appendChild(maxinput);

        main.appendChild(pwhead);
        main.appendChild(emulator.createElement("br"));
        main.appendChild(pwinput);

        popup.appendChild(main);

        popup.appendChild(emulator.createElement("br"));
        const submit = emulator.createElement("button");
        submit.classList.add("ejs_button_button");
        submit.classList.add("ejs_popup_submit");
        submit.style["background-color"] = "rgba(var(--ejs-primary-color),1)";
        submit.style.margin = "0 10px";
        submit.innerText = emulator.localization("Submit");
        popup.appendChild(submit);
        emulator.addEventListener(submit, "click", (e) => {
            if (!rninput.value.trim()) return;
            emulator.netplay.openRoom(rninput.value.trim(), parseInt(maxinput.value), pwinput.value.trim());
            popups[0].remove();
        })
        const close = emulator.createElement("button");
        close.classList.add("ejs_button_button");
        close.classList.add("ejs_popup_submit");
        close.style.margin = "0 10px";
        close.innerText = emulator.localization("Close");
        popup.appendChild(close);
        emulator.addEventListener(close, "click", (e) => {
            popups[0].remove();
        })
    }
    emulator.netplay.startSocketIO = (callback) => {
        emulator.netplay.socket = io(emulator.netplay.url);
        emulator.netplay.socket.on("connect", () => callback());
        emulator.netplay.socket.on("users-updated", (users) => {
            emulator.netplay.reset();
            if (emulator.debug) console.log(users);
            emulator.netplay.players = users;
            emulator.netplay.updatePlayersTable();
            if (emulator.netplay.owner) emulator.netplay.sync();
        })
        emulator.netplay.socket.on("disconnect", () => emulator.netplay.roomLeft());
        emulator.netplay.socket.on("data-message", (data) => {
            emulator.netplay.dataMessage(data);
        })
    }
    emulator.netplay.openRoom = (roomName, maxPlayers, password) => {
        const sessionid = guidGenerator();
        emulator.netplay.playerID = guidGenerator();
        emulator.netplay.players = {};
        emulator.netplay.extra = {
            domain: window.location.host,
            game_id: emulator.config.gameId,
            room_name: roomName,
            player_name: emulator.netplay.name,
            userid: emulator.netplay.playerID,
            sessionid: sessionid
        }
        emulator.netplay.players[emulator.netplay.playerID] = emulator.netplay.extra;
        emulator.netplay.users = {};

        emulator.netplay.startSocketIO((error) => {
            emulator.netplay.socket.emit("open-room", {
                extra: emulator.netplay.extra,
                maxPlayers: maxPlayers,
                password: password
            }, (error) => {
                if (error) {
                    if (emulator.debug) console.log("error: ", error);
                    return;
                }
                emulator.netplay.roomJoined(true, roomName, password, sessionid);
            })
        });
    }
    emulator.netplay.leaveRoom = () => {
        if (emulator.debug) console.log("asd");
        emulator.netplay.roomLeft();
    }
    emulator.netplay.joinRoom = (sessionid, roomName) => {
        emulator.netplay.playerID = guidGenerator();
        emulator.netplay.players = {};
        emulator.netplay.extra = {
            domain: window.location.host,
            game_id: emulator.config.gameId,
            room_name: roomName,
            player_name: emulator.netplay.name,
            userid: emulator.netplay.playerID,
            sessionid: sessionid
        }
        emulator.netplay.players[emulator.netplay.playerID] = emulator.netplay.extra;

        emulator.netplay.startSocketIO((error) => {
            emulator.netplay.socket.emit("join-room", {
                extra: emulator.netplay.extra//,
                //password: password
            }, (error, users) => {
                if (error) {
                    if (emulator.debug) console.log("error: ", error);
                    return;
                }
                emulator.netplay.players = users;
                //emulator.netplay.roomJoined(false, roomName, password, sessionid);
                emulator.netplay.roomJoined(false, roomName, "", sessionid);
            })
        });
    }
    emulator.netplay.roomJoined = (isOwner, roomName, password, roomId) => {
        //Will already assume emulator.netplay.players has been refreshed
        emulator.isNetplay = true;
        emulator.netplay.inputs = {};
        emulator.netplay.owner = isOwner;
        if (emulator.debug) console.log(emulator.netplay.extra);
        emulator.netplay.roomNameElem.innerText = roomName;
        emulator.netplay.tabs[0].style.display = "none";
        emulator.netplay.tabs[1].style.display = "";
        if (password) {
            emulator.netplay.passwordElem.style.display = "";
            emulator.netplay.passwordElem.innerText = emulator.localization("Password") + ": " + password
        } else {
            emulator.netplay.passwordElem.style.display = "none";
        }
        emulator.netplay.createButton.innerText = emulator.localization("Leave Room");
        emulator.netplay.updatePlayersTable();
        if (!emulator.netplay.owner) {
            emulator.netplay.oldStyles = [
                emulator.elements.bottomBar.cheat[0].style.display,
                emulator.elements.bottomBar.playPause[0].style.display,
                emulator.elements.bottomBar.playPause[1].style.display,
                emulator.elements.bottomBar.restart[0].style.display,
                emulator.elements.bottomBar.loadState[0].style.display,
                emulator.elements.bottomBar.saveState[0].style.display,
                emulator.elements.bottomBar.saveSavFiles[0].style.display,
                emulator.elements.bottomBar.loadSavFiles[0].style.display,
                emulator.elements.contextMenu.save.style.display,
                emulator.elements.contextMenu.load.style.display
            ]
            emulator.elements.bottomBar.cheat[0].style.display = "none";
            emulator.elements.bottomBar.playPause[0].style.display = "none";
            emulator.elements.bottomBar.playPause[1].style.display = "none";
            emulator.elements.bottomBar.restart[0].style.display = "none";
            emulator.elements.bottomBar.loadState[0].style.display = "none";
            emulator.elements.bottomBar.saveState[0].style.display = "none";
            emulator.elements.bottomBar.saveSavFiles[0].style.display = "none";
            emulator.elements.bottomBar.loadSavFiles[0].style.display = "none";
            emulator.elements.contextMenu.save.style.display = "none";
            emulator.elements.contextMenu.load.style.display = "none";
            emulator.gameManager.resetCheat();
        } else {
            emulator.netplay.oldStyles = [
                emulator.elements.bottomBar.cheat[0].style.display
            ]
        }
        emulator.elements.bottomBar.cheat[0].style.display = "none";
    }
    emulator.netplay.updatePlayersTable = () => {
        const table = emulator.netplay.playerTable;
        table.innerHTML = "";
        const addToTable = (num, playerName) => {
            const row = emulator.createElement("tr");
            const addToHeader = (text) => {
                const item = emulator.createElement("td");
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
        for (const k in emulator.netplay.players) {
            addToTable(i, emulator.netplay.players[k].player_name);
            i++;
        }
    }
    emulator.netplay.roomLeft = () => {
        emulator.isNetplay = false;
        emulator.netplay.tabs[0].style.display = "";
        emulator.netplay.tabs[1].style.display = "none";
        emulator.netplay.extra = null;
        emulator.netplay.playerID = null;
        emulator.netplay.createButton.innerText = emulator.localization("Create a Room");
        emulator.netplay.socket.disconnect();
        emulator.elements.bottomBar.cheat[0].style.display = emulator.netplay.oldStyles[0];
        if (!emulator.netplay.owner) {
            emulator.elements.bottomBar.playPause[0].style.display = emulator.netplay.oldStyles[1];
            emulator.elements.bottomBar.playPause[1].style.display = emulator.netplay.oldStyles[2];
            emulator.elements.bottomBar.restart[0].style.display = emulator.netplay.oldStyles[3];
            emulator.elements.bottomBar.loadState[0].style.display = emulator.netplay.oldStyles[4];
            emulator.elements.bottomBar.saveState[0].style.display = emulator.netplay.oldStyles[5];
            emulator.elements.bottomBar.saveSavFiles[0].style.display = emulator.netplay.oldStyles[6];
            emulator.elements.bottomBar.loadSavFiles[0].style.display = emulator.netplay.oldStyles[7];
            emulator.elements.contextMenu.save.style.display = emulator.netplay.oldStyles[8];
            emulator.elements.contextMenu.load.style.display = emulator.netplay.oldStyles[9];
        }
        emulator.updateCheatUI();
    }
    emulator.netplay.setLoading = (loading) => {
        if (emulator.debug) console.log("loading:", loading);
    }
    let syncing = false;
    emulator.netplay.sync = async () => {
        if (syncing) return;
        syncing = true;
        if (emulator.debug) console.log("sync")
        emulator.netplay.ready = 0;
        const state = emulator.gameManager.getState();
        emulator.netplay.sendMessage({
            state: state
        });
        emulator.netplay.setLoading(true);
        emulator.pause(true);
        emulator.netplay.ready++;
        emulator.netplay.current_frame = 0;
        if (emulator.netplay.ready === emulator.netplay.getUserCount()) {
            emulator.play(true);
        }
        syncing = false;
    }
    emulator.netplay.getUserIndex = (user) => {
        let i = 0;
        for (const k in emulator.netplay.players) {
            if (k === user) return i;
            i++;
        }
        return -1;
    }
    emulator.netplay.getUserCount = () => {
        let i = 0;
        for (const k in emulator.netplay.players) i++;
        return i;
    }
    let justReset = false;
    emulator.netplay.dataMessage = (data) => {
        //console.log(data);
        if (data.sync === true && emulator.netplay.owner) {
            emulator.netplay.sync();
        }
        if (data.state) {
            emulator.netplay.wait = true;
            emulator.netplay.setLoading(true);
            emulator.pause(true);
            emulator.gameManager.loadState(new Uint8Array(data.state));
            emulator.netplay.sendMessage({ ready: true });
        }
        if (data.play && !emulator.owner) {
            emulator.play(true);
        }
        if (data.pause && !emulator.owner) {
            emulator.pause(true);
        }
        if (data.ready && emulator.netplay.owner) {
            emulator.netplay.ready++;
            if (emulator.netplay.ready === emulator.netplay.getUserCount()) {
                emulator.netplay.sendMessage({ readyready: true });
                emulator.netplay.reset();
                setTimeout(() => emulator.play(true), 48);
                emulator.netplay.setLoading(false);
            }
        }
        if (data.readyready) {
            emulator.netplay.setLoading(false);
            emulator.netplay.reset();
            emulator.play(true);
        }
        if (data.shortPause) console.log(data.shortPause);
        if (data.shortPause && data.shortPause !== emulator.netplay.playerID) {
            emulator.pause(true);
            emulator.netplay.wait = true;
            setTimeout(() => emulator.play(true), 48);
        }
        if (data["sync-control"]) {
            data["sync-control"].forEach((value) => {
                let inFrame = parseInt(value.frame);
                let frame = emulator.netplay.currentFrame;
                if (!value.connected_input || value.connected_input[0] < 0) return;
                //if (value.connected_input[0] === emulator.netplay.getUserIndex(emulator.netplay.playerID)) return;
                console.log(value, inFrame, frame);
                if (inFrame === frame) {
                    inFrame++;
                    emulator.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                }
                emulator.netplay.inputsData[inFrame] || (emulator.netplay.inputsData[inFrame] = []);
                emulator.netplay.inputsData[frame] || (emulator.netplay.inputsData[frame] = []);
                if (emulator.netplay.owner) {
                    emulator.netplay.inputsData[frame].push(value);
                    emulator.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                    if (frame - 10 >= inFrame) {
                        emulator.netplay.wait = true;
                        emulator.pause(true);
                        setTimeout(() => {
                            emulator.play(true);
                            emulator.netplay.wait = false;
                        }, 48)
                    }
                } else {
                    emulator.netplay.inputsData[inFrame].push(value);
                    if (emulator.netplay.inputsData[frame]) {
                        emulator.play(true);
                    }
                    if (frame + 10 <= inFrame && inFrame > emulator.netplay.init_frame + 100) {
                        emulator.netplay.sendMessage({ shortPause: emulator.netplay.playerID });
                    }
                }
            });
        }
        if (data.restart) {
            emulator.gameManager.restart();
            emulator.netplay.reset();
            emulator.play(true);
        }
    }
    emulator.netplay.simulateInput = (player, index, value, resp) => {
        if (!emulator.isNetplay) return;
        if (player !== 0 && !resp) return;
        player = emulator.netplay.getUserIndex(emulator.netplay.playerID);
        let frame = emulator.netplay.currentFrame;
        if (emulator.netplay.owner) {
            if (!emulator.netplay.inputsData[frame]) {
                emulator.netplay.inputsData[frame] = [];
            }
            emulator.netplay.inputsData[frame].push({
                frame: frame,
                connected_input: [player, index, value]
            })
            emulator.gameManager.functions.simulateInput(player, index, value);
        } else {
            emulator.netplay.sendMessage({
                "sync-control": [{
                    frame: frame + 10,
                    connected_input: [player, index, value]
                }]
            })
        }
    }
    emulator.netplay.sendMessage = (data) => {
        emulator.netplay.socket.emit("data-message", data);
    }
    emulator.netplay.reset = () => {
        emulator.netplay.init_frame = emulator.netplay.currentFrame;
        emulator.netplay.inputsData = {};
    }
    //let fps;
    //let lastTime;
    emulator.netplay.init_frame = 0;
    emulator.netplay.currentFrame = 0;
    emulator.netplay.inputsData = {};
    emulator.Module.postMainLoop = () => {
        //const newTime = window.performance.now();
        //fps = 1000 / (newTime - lastTime);
        //console.log(fps);
        //lastTime = newTime;
        //frame syncing - working
        //control syncing - broken
        emulator.netplay.currentFrame = parseInt(emulator.gameManager.getFrameNum()) - emulator.netplay.init_frame;
        if (!emulator.isNetplay) return;
        if (emulator.netplay.owner) {
            let to_send = [];
            let i = emulator.netplay.currentFrame - 1;
            emulator.netplay.inputsData[i] ? emulator.netplay.inputsData[i].forEach((value) => {
                value.frame += 10;
                to_send.push(value);
            }) : to_send.push({ frame: i + 10 });
            emulator.netplay.sendMessage({ "sync-control": to_send });
        } else {
            if (emulator.netplay.currentFrame <= 0 || emulator.netplay.inputsData[emulator.netplay.currentFrame]) {
                emulator.netplay.wait = false;
                emulator.play();
                emulator.netplay.inputsData[emulator.netplay.currentFrame].forEach((value) => {
                    if (!value.connected_input) return;
                    console.log(value.connected_input);
                    emulator.gameManager.functions.simulateInput(value.connected_input[0], value.connected_input[1], value.connected_input[2]);
                })
            } else if (!emulator.netplay.syncing) {
                console.log("sync");
                emulator.pause(true);
                emulator.netplay.sendMessage({ sync: true });
                emulator.netplay.syncing = true;
            }
        }
        if (emulator.netplay.currentFrame % 100 === 0) {
            Object.keys(emulator.netplay.inputsData).forEach(value => {
                if (value < emulator.netplay.currentFrame - 50) {
                    emulator.netplay.inputsData[value] = null;
                    delete emulator.netplay.inputsData[value];
                }
            })
        }
    }

    emulator.netplay.updateList = {
        start: () => {
            emulator.netplay.updateList.interval = setInterval(emulator.netplay.updateTableList.bind(emulator), 1000);
        },
        stop: () => {
            clearInterval(emulator.netplay.updateList.interval);
        }
    }
}
