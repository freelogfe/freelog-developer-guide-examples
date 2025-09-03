import { useState, useEffect, useRef } from "react";
import "./App.css";

// 声明全局EmulatorJS变量
declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
    EJS_gameName: string;
    EJS_VirtualGamepadSettings: any;
    EJS_ready: () => void;
    EJS_onGameStart: () => void;
    EJS_onSaveState: () => void;
    EJS_onLoadState: () => void;
    EJS_defaultControls: any;
    EJS_controlScheme: any;
  }
}

function App() {
  const [isEmulatorLoaded, setIsEmulatorLoaded] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // 页面加载完成后自动初始化游戏
  useEffect(() => {
    console.log("页面加载完成，自动启动 hun.nes 游戏");
    const timer = setTimeout(() => {
      initializeEmulator();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 初始化EmulatorJS
  const initializeEmulator = () => {
    if (!gameContainerRef.current) return;

    console.log("开始初始化 EmulatorJS，游戏文件: /hun.nes");

    // 清除之前的模拟器
    if (isEmulatorLoaded) {
      const existingEmulator = gameContainerRef.current.querySelector("#game");
      if (existingEmulator) {
        existingEmulator.remove();
      }
    }

    // 创建游戏容器
    const gameDiv = document.createElement("div");
    gameDiv.id = "game";
    gameDiv.style.width = "100%";
    gameDiv.style.height = "100%";
    gameContainerRef.current.appendChild(gameDiv);

    // 设置EmulatorJS配置 - 自动加载 hun.nes
    window.EJS_player = "#game";
    window.EJS_core = "nes";
    window.EJS_gameUrl = "/hun.nes";
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data";
    window.EJS_startOnLoaded = true;
    window.EJS_gameName = "Hun Game";

  

    // 配置虚拟手柄设置 - 使用官方文档的配置格式
    window.EJS_VirtualGamepadSettings = [
      // 左侧方向键
      {
        type: "dpad",
        location: "left",
        left: "50%",
        top: "50%",
        joystickInput: false,
        inputValues: [4, 5, 6, 7], // 上、下、左、右
      },
      // 右侧动作按钮 - 根据官方文档配置
      {
        type: "button",
        text: "Y",
        id: "y",
        location: "right",
        left: 0,
        top: 0,
        bold: true,
        input_value: 9, // Y键 - 对应 BUTTON_3
      },
      {
        type: "button",
        text: "X",
        id: "x",
        location: "right",
        left: 70,
        top: 0,
        bold: true,
        input_value: 1, // X键 - 对应 BUTTON_2
      },
      {
        type: "button",
        text: "B",
        id: "b",
        location: "right",
        left: 0,
        top: 70,
        bold: true,
        input_value: 8, // B键 - 对应 BUTTON_1
      },
      {
        type: "button",
        text: "A",
        id: "a",
        location: "right",
        left: 70,
        top: 70,
        bold: true,
        input_value: 0, // A键 - 对应 BUTTON_4
      },
      // 中间菜单按钮
      {
        type: "button",
        text: "Start",
        id: "start",
        location: "center",
        left: 60,
        top: 20,
        fontSize: 15,
        block: true,
        input_value: 3, // START
      },
      {
        type: "button",
        text: "Select",
        id: "select",
        location: "center",
        left: -5,
        top: 20,
        fontSize: 15,
        block: true,
        input_value: 2, // SELECT
      },
    ];

    // 事件回调
    window.EJS_ready = () => {
      console.log("模拟器准备就绪");
      setIsEmulatorLoaded(true);
      console.log("检测到移动设备，虚拟游戏手柄已启用");
    };

    window.EJS_onGameStart = () => {
      console.log("游戏已开始");
      console.log("使用屏幕上的虚拟按钮控制游戏");
      console.log(window.EJS_defaultControls);
    };

    window.EJS_onSaveState = () => {
      console.log("状态已保存");
    };

    window.EJS_onLoadState = () => {
      console.log("状态已加载");
    };

    // 动态加载EmulatorJS脚本
    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    script.onload = () => {
      console.log("EmulatorJS脚本加载完成");
    };
    script.onerror = () => {
      console.error("EmulatorJS脚本加载失败");
    };
    document.head.appendChild(script);
  };

  return (
    <div className="app">
      <main className="app-main">
        {/* 移动端游戏界面：中间游戏画面 */}
        <div className="game-container">
          <div className="mobile-game-layout">
            {/* 中间游戏画面 */}
            <div className="game-screen">
              <div className="emulator-wrapper" ref={gameContainerRef}>
                {/* EmulatorJS将在这里渲染 */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
