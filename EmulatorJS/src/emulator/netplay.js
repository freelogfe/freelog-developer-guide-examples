/**
 * Netplay functionality functions
 */

export function handleNetworking(emulator) {
    // Initialize netplay properties
    emulator.netplay = {
        url: emulator.config.netplayUrl || "https://netplay.emulatorjs.org",
        current_frame: 0,
        players: {},
        inputsData: {}
    };
    
    console.log("Netplay system initialized");
}

export function startNetplay(emulator) {
    if (!emulator.config.netplayUrl || typeof emulator.config.gameId !== "number") {
        console.warn("Netplay not properly configured");
        return;
    }
    
    emulator.isNetplay = true;
    console.log("Netplay started");
}

export function leaveNetplay(emulator) {
    emulator.isNetplay = false;
    if (emulator.netplay.socket) {
        emulator.netplay.socket.disconnect();
    }
    console.log("Netplay session ended");
}

/**
 * Generate a unique ID for netplay sessions
 */
function guidGenerator() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function joinNetplayRoom(emulator, sessionid, roomName) {
    emulator.netplay.playerID = guidGenerator();
    emulator.netplay.players = {};
    emulator.netplay.extra = {
        domain: window.location.host,
        game_id: emulator.config.gameId,
        room_name: roomName,
        player_name: emulator.netplay.name,
        userid: emulator.netplay.playerID,
        sessionid: sessionid
    };
    emulator.netplay.players[emulator.netplay.playerID] = emulator.netplay.extra;
    
    console.log(`Joining netplay room: ${roomName}`);
}

export function createNetplayRoom(emulator, roomName, maxPlayers, password) {
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
    };
    emulator.netplay.players[emulator.netplay.playerID] = emulator.netplay.extra;
    emulator.netplay.users = {};
    
    console.log(`Creating netplay room: ${roomName}`);
}