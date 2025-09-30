/**
 * 网络游戏管理模块
 * 负责处理多人在线游戏功能
 */
class NetplayManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.enabled = false;
        this.owner = false;
        this.roomId = "";
        this.playerId = "";
        this.players = [];
        this.socket = null;
        this.messageQueue = [];
    }

    init() {
        if (!this.emulator.netplayEnabled) return;

        // 创建WebSocket连接
        this.socket = new WebSocket(this.emulator.config.netplayUrl);

        // 连接打开
        this.socket.onopen = () => {
            console.log("Netplay connected");
            this.enabled = true;
        };

        // 连接关闭
        this.socket.onclose = () => {
            console.log("Netplay disconnected");
            this.enabled = false;
        };

        // 接收消息
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };

        // 连接错误
        this.socket.onerror = (error) => {
            console.error("Netplay error:", error);
            this.enabled = false;
        };
    }

    createRoom() {
        if (!this.enabled) return;

        this.owner = true;
        this.roomId = this.generateRoomId();
        this.playerId = this.generatePlayerId();

        // 发送创建房间消息
        this.sendMessage({
            type: "createRoom",
            roomId: this.roomId,
            playerId: this.playerId
        });

        // 显示房间ID
        this.emulator.displayMessage(this.emulator.localization("Room ID") + ": " + this.roomId);
    }

    joinRoom(roomId) {
        if (!this.enabled) return;

        this.owner = false;
        this.roomId = roomId;
        this.playerId = this.generatePlayerId();

        // 发送加入房间消息
        this.sendMessage({
            type: "joinRoom",
            roomId: roomId,
            playerId: this.playerId
        });
    }

    sendMessage(message) {
        if (!this.enabled || !this.socket) return;

        // 将消息添加到队列
        this.messageQueue.push(message);

        // 处理队列中的消息
        this.processMessageQueue();
    }

    processMessageQueue() {
        if (!this.enabled || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

        // 处理队列中的所有消息
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.socket.send(JSON.stringify(message));
        }
    }

    handleMessage(message) {
        switch (message.type) {
            case "roomCreated":
                // 房间创建成功
                this.emulator.displayMessage(this.emulator.localization("Room created successfully"));
                break;

            case "playerJoined":
                // 玩家加入
                this.players.push(message.playerId);
                break;

            case "playerLeft":
                // 玩家离开
                const index = this.players.indexOf(message.playerId);
                if (index !== -1) {
                    this.players.splice(index, 1);
                }
                break;

            case "gameState":
                // 接收游戏状态
                if (message.state) {
                    this.emulator.gameManager.loadState(message.state);
                }
                break;

            case "pause":
                // 暂停游戏
                this.emulator.pause();
                break;

            case "play":
                // 开始游戏
                this.emulator.play();
                break;

            case "restart":
                // 重启游戏
                this.emulator.gameManager.restart();
                break;

            case "chat":
                // 聊天消息
                this.emulator.displayMessage(message.playerId + ": " + message.text);
                break;
        }
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8);
    }

    generatePlayerId() {
        return Math.random().toString(36).substring(2, 8);
    }

    reset() {
        this.enabled = false;
        this.owner = false;
        this.roomId = "";
        this.playerId = "";
        this.players = [];
        this.messageQueue = [];

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
