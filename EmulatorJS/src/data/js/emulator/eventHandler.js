/**
 * EmulatorJS - Event Handler Module
 * This module provides functions for handling events in the EmulatorJS
 */

import { addEventListener, removeEventListener } from './utils.js';
import { createText } from './ui.js';
import { downloadGameCore } from './fileDownloader.js';

// 初始化事件系统
export function initEventSystem(emulatorState) {
  // 初始化事件监听器存储
  emulatorState.eventListeners = {};
}

// 绑定事件监听器
export function bindListeners(emulatorState, localization) {
  // 创建各种菜单和控制器
  createContextMenu(emulatorState);
  createBottomMenuBar(emulatorState);
  createControlSettingMenu(emulatorState);
  createCheatsMenu(emulatorState);
  createNetplayMenu(emulatorState);
  setVirtualGamepad(emulatorState);
  
  // 键盘事件
  addEventListener(emulatorState.elements.parent, "keydown keyup", function(e) {
    keyChange(emulatorState, e);
  });
  
  // 鼠标/触摸事件
  addEventListener(emulatorState.elements.parent, "mousedown touchstart", (e) => {
    if (document.activeElement !== emulatorState.elements.parent && emulatorState.config.noAutoFocus !== true) {
      emulatorState.elements.parent.focus();
    }
  });
  
  // 窗口大小调整事件
  addEventListener(window, "resize", function() {
    handleResize(emulatorState);
  });
  
  // 全屏切换事件
  addEventListener(window, "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", () => {
    setTimeout(() => {
      handleResize(emulatorState);
      if (emulatorState.config.noAutoFocus !== true) {
        emulatorState.elements.parent.focus();
      }
    }, 0);
  });
  
  // 窗口卸载事件
  addEventListener(window, "beforeunload", (e) => {
    if (!emulatorState.started) return;
    callEvent(emulatorState, "exit");
  });
  
  // 拖拽事件处理
  setupDragAndDrop(emulatorState, localization);
  
  // 游戏手柄处理
  setupGamepadHandler(emulatorState);
}

// 设置拖拽和放置功能
function setupDragAndDrop(emulatorState, localization) {
  let counter = 0;
  
  emulatorState.elements.statePopupPanel = createPopup(emulatorState, "", {}, true);
  emulatorState.elements.statePopupPanel.innerText = localization("Drop save state here to load");
  emulatorState.elements.statePopupPanel.style["text-align"] = "center";
  emulatorState.elements.statePopupPanel.style["font-size"] = "28px";
  
  addEventListener(emulatorState.elements.parent, "dragenter", (e) => {
    e.preventDefault();
    if (!emulatorState.started) return;
    counter++;
    emulatorState.elements.statePopupPanel.parentElement.style.display = "block";
  });
  
  addEventListener(emulatorState.elements.parent, "dragover", (e) => {
    e.preventDefault();
  });
  
  addEventListener(emulatorState.elements.parent, "dragleave", (e) => {
    e.preventDefault();
    if (!emulatorState.started) return;
    counter--;
    if (counter === 0) {
      emulatorState.elements.statePopupPanel.parentElement.style.display = "none";
    }
  });
  
  addEventListener(emulatorState.elements.parent, "dragend", (e) => {
    e.preventDefault();
    if (!emulatorState.started) return;
    counter = 0;
    emulatorState.elements.statePopupPanel.parentElement.style.display = "none";
  });
  
  addEventListener(emulatorState.elements.parent, "drop", (e) => {
    e.preventDefault();
    if (!emulatorState.started) return;
    emulatorState.elements.statePopupPanel.parentElement.style.display = "none";
    counter = 0;
    
    const items = e.dataTransfer.items;
    let file;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind !== "file") continue;
      file = items[i];
      break;
    }
    
    if (!file) return;
    
    const fileHandle = file.getAsFile();
    fileHandle.arrayBuffer().then(data => {
      if (emulatorState.gameManager && emulatorState.gameManager.loadState) {
        emulatorState.gameManager.loadState(new Uint8Array(data));
      }
    });
  });
}

// 设置游戏手柄处理器
function setupGamepadHandler(emulatorState) {
  emulatorState.gamepad = new GamepadHandler(); // https://github.com/ethanaobrien/Gamepad
  
  emulatorState.gamepad.on("connected", (e) => {
    if (!emulatorState.gamepadLabels) return;
    
    for (let i = 0; i < emulatorState.gamepadSelection.length; i++) {
      if (emulatorState.gamepadSelection[i] === "") {
        emulatorState.gamepadSelection[i] = emulatorState.gamepad.gamepads[e.gamepadIndex].id + "_" + emulatorState.gamepad.gamepads[e.gamepadIndex].index;
        break;
      }
    }
    
    if (emulatorState.updateGamepadLabels) {
      emulatorState.updateGamepadLabels();
    }
  });
  
  emulatorState.gamepad.on("disconnected", (e) => {
    const gamepadIndex = emulatorState.gamepad.gamepads.indexOf(emulatorState.gamepad.gamepads.find(f => f.index == e.gamepadIndex));
    const gamepadSelection = emulatorState.gamepad.gamepads[gamepadIndex].id + "_" + emulatorState.gamepad.gamepads[gamepadIndex].index;
    
    for (let i = 0; i < emulatorState.gamepadSelection.length; i++) {
      if (emulatorState.gamepadSelection[i] === gamepadSelection) {
        emulatorState.gamepadSelection[i] = "";
      }
    }
    
    setTimeout(() => {
      if (emulatorState.updateGamepadLabels) {
        emulatorState.updateGamepadLabels();
      }
    }, 10);
  });
  
  emulatorState.gamepad.on("axischanged", function(e) {
    gamepadEvent(emulatorState, e);
  });
  
  emulatorState.gamepad.on("buttondown", function(e) {
    gamepadEvent(emulatorState, e);
  });
  
  emulatorState.gamepad.on("buttonup", function(e) {
    gamepadEvent(emulatorState, e);
  });
}

// 键盘事件处理
function keyChange(emulatorState, e) {
  // 键盘事件处理逻辑
  // 这里简化处理，实际应该根据键盘按键映射到游戏控制器
}

// 游戏手柄事件处理
function gamepadEvent(emulatorState, e) {
  // 游戏手柄事件处理逻辑
  // 这里简化处理，实际应该根据游戏手柄输入映射到游戏控制器
}

// 开始按钮点击处理
export function startButtonClicked(emulatorState, e, localization) {
  callEvent(emulatorState, "start-clicked");
  
  if (e.pointerType === "touch") {
    emulatorState.touch = true;
  }
  
  if (e.preventDefault) {
    e.preventDefault();
    if (e.target) e.target.remove();
  } else if (e.remove) {
    e.remove();
  }
  
  createText(emulatorState, localization);
  downloadGameCore(emulatorState, emulatorState.textElem, localization);
}

// 调用事件
export function callEvent(emulatorState, event, data) {
  if (!emulatorState.eventListeners || !Array.isArray(emulatorState.eventListeners[event])) {
    return 0;
  }
  
  emulatorState.eventListeners[event].forEach(callback => callback(data));
  return emulatorState.eventListeners[event].length;
}

// 添加事件监听
export function on(emulatorState, event, func) {
  if (!emulatorState.eventListeners) {
    emulatorState.eventListeners = {};
  }
  
  if (!Array.isArray(emulatorState.eventListeners[event])) {
    emulatorState.eventListeners[event] = [];
  }
  
  emulatorState.eventListeners[event].push(func);
}

// 创建上下文菜单
function createContextMenu(emulatorState) {
  // 创建上下文菜单的逻辑
  emulatorState.elements = emulatorState.elements || {};
  emulatorState.elements.contextMenu = emulatorState.elements.contextMenu || {};
}

// 创建底部菜单栏
function createBottomMenuBar(emulatorState) {
  // 创建底部菜单栏的逻辑
  emulatorState.elements = emulatorState.elements || {};
  emulatorState.elements.bottomBar = emulatorState.elements.bottomBar || {};
}

// 创建控制设置菜单
function createControlSettingMenu(emulatorState) {
  // 创建控制设置菜单的逻辑
}

// 创建作弊菜单
function createCheatsMenu(emulatorState) {
  // 创建作弊菜单的逻辑
}

// 创建网络对战菜单
function createNetplayMenu(emulatorState) {
  // 创建网络对战菜单的逻辑
}

// 设置虚拟游戏手柄
function setVirtualGamepad(emulatorState) {
  // 设置虚拟游戏手柄的逻辑
  emulatorState.virtualGamepad = emulatorState.virtualGamepad || document.createElement('div');
  emulatorState.virtualGamepad.style.display = 'none';
  if (emulatorState.elements && emulatorState.elements.parent) {
    emulatorState.elements.parent.appendChild(emulatorState.virtualGamepad);
  }
}

// 创建弹出窗口
function createPopup(emulatorState, title, content, modal = false) {
  // 创建弹出窗口的逻辑
  const popup = document.createElement('div');
  popup.classList.add('ejs_popup');
  
  const popupContent = document.createElement('div');
  popupContent.classList.add('ejs_popup_content');
  
  if (title) {
    const popupTitle = document.createElement('div');
    popupTitle.classList.add('ejs_popup_title');
    popupTitle.innerText = title;
    popupContent.appendChild(popupTitle);
  }
  
  for (let i in content) {
    popupContent.appendChild(content[i]);
  }
  
  popup.appendChild(popupContent);
  
  if (modal) {
    popup.classList.add('ejs_popup_modal');
  }
  
  if (emulatorState.elements && emulatorState.elements.parent) {
    emulatorState.elements.parent.appendChild(popup);
  }
  
  return popupContent;
}

// 关闭弹出窗口
export function closePopup(emulatorState) {
  // 关闭弹出窗口的逻辑
  const popup = emulatorState.elements.parent.querySelector('.ejs_popup');
  if (popup) {
    popup.remove();
  }
}

// 处理窗口大小调整
export function handleResize(emulatorState) {
  // 处理窗口大小调整的逻辑
  // 这里简化处理，实际应该根据容器大小调整游戏画布大小
  if (emulatorState.canvas) {
    // 调整画布大小
  }
}