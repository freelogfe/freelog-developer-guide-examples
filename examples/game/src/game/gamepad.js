
import jsnes from 'jsnes'
import { _requestFullscreen, _cancelFullScreen } from './utils'
var rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame
var rAFStop = window.mozCancelRequestAnimationFrame || window.cancelRequestAnimationFrame

var start = null
var _nesInstance = null
var turbo = false
var isFullScreen = false
var listen_gamepad = { 1: true, 2: true }

export default function initGamepad(nesInstance) {
  _nesInstance = nesInstance
  window.addEventListener("gamepadconnected", function(e) {
    const gp = e.gamepad
    turbo = true
    window.f_common_lib.ElementUI.Message.success(`Gamepad(${gp.id}) connected！`)
    gameLoop()
  })

  window.addEventListener("gamepaddisconnected", function() {
    window.f_common_lib.ElementUI.Message.warning("Gamepad disconnected, Waiting for gamepad.")
    rAFStop(start)
  })
} 

export function addGamepadListener(player) {
	listen_gamepad[player] = true
}

export function removeGamepadListener(player) {
	listen_gamepad[player] = false
}

var pressedStatus = { 1: {}, 2: {} }
var controllers = { 1:{}, 2: {} }
var buttonsCache = { 1: [], 2: []  }
var buttonsStatus = { 1: [], 2: [] }
var axesStatus = { 1: [], 2: [] }

var buttonsMap = {
  0: "B",
  1: "A",
  2: "X",
  3: "Y",
  4: "Refresh",
  5: "Fullscreen",
  8: "Select",
  9: "Start",
  12: "Up",
  13: "Down",
  14: "Left",
  15: "Right",
}
var nesButtonMap = {
  'A': { value: jsnes.Controller.BUTTON_A, isHold: true },
  'B': { value: jsnes.Controller.BUTTON_B, isHold: true },
  'Select': { value: jsnes.Controller.BUTTON_SELECT, isHold: true },
  'Start': { value: jsnes.Controller.BUTTON_START, isHold: true },
  'Up': { value: jsnes.Controller.BUTTON_UP, isHold: true },
  'Down': { value: jsnes.Controller.BUTTON_DOWN, isHold: true },
  'Left': { value: jsnes.Controller.BUTTON_LEFT, isHold: true },
  'Right': { value: jsnes.Controller.BUTTON_RIGHT, isHold: true },
  'Refresh': { value: -1, isHold: false },
  'Fullscreen': { value: -2, isHold: false }
}

function gameLoop() {
  if(!turbo) return  
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) return

  Array.from(gamepads).forEach((gp, index) => {
    const player = index + 1
    
    if(listen_gamepad[player]) {
      controllers[player] = gp
      updated(player)
      const keys = Object.keys(nesButtonMap)
      for(let i = 0; i < keys.length; i++) {
        handleButtunPress(keys[i], player)
      }
    }
  })
  

  start = rAF(gameLoop)
}

function handleButtunPress(name, player) {
  var playerPressedStatus = pressedStatus[player]
  const tmp = nesButtonMap[name]
  if(tmp == null) return 
  if(buttonPressed(name, tmp.isHold, player)) {
    playerPressedStatus[name] = true
    _nesInstance.buttonDown(player, tmp.value)
    if(tmp.value < 0) {
      switch(tmp.value) {
        // Refresh
        case -1: {
          _nesInstance.reloadROM()
          break
        }
        // Fullscreen
        case -2: {
          isFullScreen = !isFullScreen
          
          if(isFullScreen) {
            _requestFullscreen(_nesInstance._$canvasDom)
          }else {
            _cancelFullScreen()
          }
          break 
        }
        default: {}
      }
    }
  }else {
    if(playerPressedStatus[name]) {
      _nesInstance.buttonUp(player, tmp.value)
      playerPressedStatus[name] = false
    }
  }
}

function updated(player) {
  // 清除按钮缓存
  buttonsCache[player] = []
  // 从上一帧中移动按钮状态到缓存中
  const btnStatusLeng = buttonsStatus[player].length
  for(let k = 0; k < btnStatusLeng; k++) {
    buttonsCache[player][k] = buttonsStatus[player][k]
  }
  // 清除按钮状态
  buttonsStatus[player] = []
  // 获取 gamepad 对象
  var c = controllers[player] || {}

  // 遍历按键，并将按下的按钮加到数组中
  var pressed = []
  if(c.buttons) {
    const btnsLeng = c.buttons.length
    for(let b = 0; b < btnsLeng; b++) {
      if(isPressed(c.buttons[b])) {
        pressed.push(buttonsMap[b])
      }
    }
  }
  // 遍历坐标值并加到数组中
  var axes = [];
  if(c.axes) {
    const axesLeng = c.axes.length
    for(let a = 0; a < axesLeng; a++) {
      axes.push(c.axes[a].toFixed(2))
    }
  }
  // 分配接收到的值
  axesStatus[player] = axes
  buttonsStatus[player] = pressed
  // 返回按钮以便调试
  
  return pressed
}

function isPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed
  }
  return b == 1.0
}

function buttonPressed(button, hold, player) {
  var btnStatus = buttonsStatus[player], btnCache = buttonsCache[player]
  var newPress = false
  // 轮询按下的按钮
  for(var i=0,s=btnStatus.length; i<s; i++) {
    // 如果我们找到我们想要的按钮
    if(btnStatus[i] == button) {
      // 设置布尔变量（newPress）为 true
      newPress = true
      // 如果我们想检查按住还是单次按下
      if(!hold) {
        // 从上一帧轮询缓存状态
        for(var j=0,p=btnCache.length; j<p; j++) {
          // 如果按钮（之前）已经被按下了则忽略新的按下状态
          if(btnCache[j] == button) {
            newPress = false
          }
        }
      }
    }
  }
  return newPress
}
