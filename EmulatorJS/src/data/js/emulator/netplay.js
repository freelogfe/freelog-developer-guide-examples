/**
 * 网络对战功能模块
 */
class NetplayManager {
    constructor(options) {
        // 支持两种初始化方式：直接传入emulator或通过options对象
        this.emulator = options.emulator || options;
        this.socket = null;
        this.connected = false;
        this.currentRoom = null;
        this.players = [];
        this.isHost = false;
        this.syncCounter = 0;
        this.inputsData = {};
        this.setup();
    }

    setup() {
        // 初始化网络对战系统
        console.log('Netplay manager initialized');
        this.loadSettings();
    }

    // 加载网络对战设置
    loadSettings() {
        const settings = this.emulator.getSettings('netplay');
        if (settings) {
            this.playerName = settings.playerName || this.generateRandomName();
            this.host = settings.host || 'ws://localhost:8081';
        } else {
            this.playerName = this.generateRandomName();
            this.host = 'ws://localhost:8081';
        }
    }

    // 保存网络对战设置
    saveSettings() {
        this.emulator.saveSettings('netplay', {
            playerName: this.playerName,
            host: this.host
        });
    }

    // 生成随机玩家名称
    generateRandomName() {
        const adjectives = ['Happy', 'Fast', 'Brave', 'Clever', 'Strong', 'Quick', 'Smart', 'Lucky'];
        const nouns = ['Gamer', 'Player', 'Warrior', 'Hero', 'Ninja', 'Wizard', 'Knight', 'Champion'];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(Math.random() * 1000);
        return `${adjective}${noun}${number}`;
    }

    // 生成GUID
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 开始Socket.IO连接
    startSocketIO() {
        if (this.socket && this.connected) {
            console.log('Already connected to netplay server');
            return;
        }
        
        if (!window.io) {
            console.error('Socket.IO library not found');
            return;
        }
        
        console.log(`Connecting to netplay server: ${this.host}`);
        
        this.socket = window.io(this.host, {
            transports: ['websocket'],
            query: {
                playerName: this.playerName,
                gameHash: this.getGameHash()
            }
        });
        
        // 绑定Socket.IO事件
        this.bindSocketEvents();
    }

    // 绑定Socket.IO事件
    bindSocketEvents() {
        if (!this.socket) return;
        
        // 连接成功
        this.socket.on('connect', () => {
            console.log('Connected to netplay server');
            this.connected = true;
            this.emulator.showNotification('已连接到网络对战服务器');
        });
        
        // 连接断开
        this.socket.on('disconnect', (reason) => {
            console.log(`Disconnected from netplay server: ${reason}`);
            this.connected = false;
            this.currentRoom = null;
            this.players = [];
            this.isHost = false;
            this.emulator.showNotification('与网络对战服务器断开连接');
        });
        
        // 错误
        this.socket.on('error', (error) => {
            console.error('Netplay error:', error);
            this.emulator.showNotification(`网络对战错误: ${error.message || '未知错误'}`);
        });
        
        // 房间列表更新
        this.socket.on('room_list', (rooms) => {
            this.handleRoomListUpdate(rooms);
        });
        
        // 房间加入成功
        this.socket.on('room_joined', (roomInfo) => {
            this.handleRoomJoined(roomInfo);
        });
        
        // 房间离开
        this.socket.on('room_left', () => {
            this.handleRoomLeft();
        });
        
        // 玩家加入房间
        this.socket.on('player_joined', (player) => {
            this.handlePlayerJoined(player);
        });
        
        // 玩家离开房间
        this.socket.on('player_left', (playerId) => {
            this.handlePlayerLeft(playerId);
        });
        
        // 输入同步
        this.socket.on('input_sync', (data) => {
            this.handleInputSync(data);
        });
        
        // 帧同步
        this.socket.on('frame_sync', (data) => {
            this.handleFrameSync(data);
        });
        
        // 同步控制
        this.socket.on('sync_control', (data) => {
            this.handleSyncControl(data);
        });
    }

    // 获取游戏哈希值
    getGameHash() {
        // 生成当前游戏的唯一哈希值
        if (!this.emulator.gamePath) {
            return 'no_game';
        }
        
        // 简单实现，实际应用中可能需要更复杂的哈希算法
        let hash = 0;
        if (this.emulator.gamePath.length === 0) return hash;
        for (let i = 0; i < this.emulator.gamePath.length; i++) {
            const char = this.emulator.gamePath.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString();
    }

    // 获取房间列表
    getRoomList() {
        if (this.socket && this.connected) {
            this.socket.emit('get_room_list');
        }
    }

    // 处理房间列表更新
    handleRoomListUpdate(rooms) {
        console.log('Room list updated:', rooms);
        // 更新UI中的房间列表
        if (this.emulator.menuManager && this.emulator.menuManager.updateRoomList) {
            this.emulator.menuManager.updateRoomList(rooms);
        }
    }

    // 创建房间
    createRoom(roomName, maxPlayers = 2, password = '') {
        if (this.socket && this.connected) {
            const roomData = {
                roomName,
                maxPlayers,
                password,
                gameHash: this.getGameHash(),
                platform: this.emulator.platform
            };
            
            this.socket.emit('create_room', roomData);
            this.isHost = true;
        }
    }

    // 加入房间
    joinRoom(roomId, password = '') {
        if (this.socket && this.connected) {
            const joinData = {
                roomId,
                password
            };
            
            this.socket.emit('join_room', joinData);
        }
    }

    // 离开房间
    leaveRoom() {
        if (this.socket && this.connected && this.currentRoom) {
            this.socket.emit('leave_room');
        }
    }

    // 处理房间加入成功
    handleRoomJoined(roomInfo) {
        console.log('Joined room:', roomInfo);
        this.currentRoom = roomInfo;
        this.players = roomInfo.players || [];
        
        // 更新UI状态
        this.emulator.netplayJoined = true;
        
        // 通知用户
        this.emulator.showNotification(`已加入房间: ${roomInfo.name}`);
        
        // 如果是菜单管理器中正在显示网络对战菜单，则更新玩家列表
        if (this.emulator.menuManager && this.emulator.menuManager.updatePlayersTable) {
            this.emulator.menuManager.updatePlayersTable(this.players);
        }
    }

    // 处理房间离开
    handleRoomLeft() {
        console.log('Left room');
        this.currentRoom = null;
        this.players = [];
        this.isHost = false;
        
        // 更新UI状态
        this.emulator.netplayJoined = false;
        
        // 通知用户
        this.emulator.showNotification('已离开房间');
    }

    // 处理玩家加入房间
    handlePlayerJoined(player) {
        console.log('Player joined:', player);
        this.players.push(player);
        
        // 更新UI中的玩家列表
        if (this.emulator.menuManager && this.emulator.menuManager.updatePlayersTable) {
            this.emulator.menuManager.updatePlayersTable(this.players);
        }
        
        // 通知用户
        this.emulator.showNotification(`${player.name} 加入了房间`);
    }

    // 处理玩家离开房间
    handlePlayerLeft(playerId) {
        console.log('Player left:', playerId);
        this.players = this.players.filter(player => player.id !== playerId);
        
        // 更新UI中的玩家列表
        if (this.emulator.menuManager && this.emulator.menuManager.updatePlayersTable) {
            this.emulator.menuManager.updatePlayersTable(this.players);
        }
        
        // 通知用户
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            this.emulator.showNotification(`${player.name} 离开了房间`);
        }
    }

    // 发送输入数据
    sendInput(inputData) {
        if (this.socket && this.connected && this.currentRoom) {
            this.syncCounter++;
            
            const data = {
                frame: this.syncCounter,
                input: inputData,
                timestamp: Date.now()
            };
            
            this.socket.emit('input_sync', data);
        }
    }

    // 处理输入同步数据
    handleInputSync(data) {
        // 存储其他玩家的输入数据
        if (data.playerId && data.input && data.frame) {
            this.inputsData[data.playerId] = {
                input: data.input,
                frame: data.frame,
                timestamp: Date.now()
            };
        }
    }

    // 处理帧同步
    handleFrameSync(data) {
        // 在主机客户端处理帧同步逻辑
        if (this.isHost) {
            // 实现帧同步逻辑
        }
    }

    // 处理同步控制数据
    handleSyncControl(data) {
        console.log('Sync control:', data);
        
        // 根据同步控制命令执行相应的操作
        switch (data.command) {
            case 'pause':
                this.emulator.pause();
                break;
            case 'resume':
                this.emulator.resume();
                break;
            case 'reset':
                this.emulator.reset();
                break;
            case 'sync_state':
                this.handleSyncState(data);
                break;
        }
    }

    // 处理状态同步
    handleSyncState(data) {
        // 实现状态同步逻辑
        // 这通常涉及到接收和应用游戏状态数据
    }

    // 发送消息
    sendMessage(message) {
        if (this.socket && this.connected && this.currentRoom) {
            this.socket.emit('chat_message', {
                message,
                timestamp: Date.now()
            });
        }
    }

    // 模拟输入
    simulateInput(playerId, inputData) {
        // 实现模拟其他玩家输入的逻辑
    }

    // 断开连接
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.currentRoom = null;
            this.players = [];
            this.isHost = false;
        }
    }

    // 设置玩家名称
    setPlayerName(name) {
        if (name && name.trim()) {
            this.playerName = name.trim();
            this.saveSettings();
            
            // 如果已经连接，通知服务器更新玩家名称
            if (this.socket && this.connected) {
                this.socket.emit('update_player_name', { name: this.playerName });
            }
        }
    }

    // 设置服务器地址
    setHost(host) {
        if (host && host.trim()) {
            this.host = host.trim();
            this.saveSettings();
            
            // 如果已经连接，重新连接到新的服务器
            if (this.socket && this.connected) {
                this.disconnect();
                this.startSocketIO();
            }
        }
    }

    // 获取当前房间信息
    getCurrentRoomInfo() {
        return this.currentRoom;
    }

    // 获取玩家列表
    getPlayers() {
        return this.players;
    }

    // 获取连接状态
    isConnected() {
        return this.connected;
    }

    // 获取是否在房间中
    isInRoom() {
        return this.currentRoom !== null;
    }

    // 获取是否为主机
    isHostPlayer() {
        return this.isHost;
    }
}

// 导出模块
export default NetplayManager;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.NetplayManager = NetplayManager;
}