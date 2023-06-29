
import jsnes from 'jsnes'
import initGamepad from './gamepad'
import { _requestFullscreen, _cancelFullScreen } from './utils'

var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH*SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4*1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0, audio_read_cursor = 0;
var listen_player_key = {
	1: true,
	2: true
}
var currentNesData = null
var $canvasDom = null
var isFullscreen = false

var nes = new jsnes.NES({
	onFrame: function(framebuffer_24){
		for(var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
	},
	onAudioSample: function(l, r){
		audio_samples_L[audio_write_cursor] = l;
		audio_samples_R[audio_write_cursor] = r;
		audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
	},
});
initGamepad(nes)

export const DEFAULT_BUTTON_KEY_VERSION = '0.1.0'
export const DEFAULT_BUTTON_KEY_MAP = { 
	'ArrowUp': { 
		player: 1, key: 'ArrowUp', keyCode: 38, label: 'Up', value: jsnes.Controller.BUTTON_UP, isPreventDefault: true 
	},
	'ArrowDown': { 
		player: 1, key: 'ArrowDown', keyCode: 40, label: 'Down', value: jsnes.Controller.BUTTON_DOWN, isPreventDefault: true 
	},
	'ArrowLeft': { 
		player: 1, key: 'ArrowLeft', keyCode: 37, label: 'Left', value: jsnes.Controller.BUTTON_LEFT, isPreventDefault: true 
	},
	'ArrowRight': { 
		player: 1,	key: 'ArrowRight', keyCode: 39, label: 'Right', value: jsnes.Controller.BUTTON_RIGHT, isPreventDefault: true 
	},
	'a': { 
		player: 1, key: 'a', keyCode: 65, label: 'A', value: jsnes.Controller.BUTTON_A 
	}, 
	's': { 
		player: 1, key: 's', keyCode: 83, label: 'B', value: jsnes.Controller.BUTTON_B 
	},
	'Tab': { 
		player: 1, key: 'Tab', keyCode: 9, label: 'Select', value: jsnes.Controller.BUTTON_SELECT, isPreventDefault: true 
	},
	'Enter': { 
		player: 1, key: 'Enter', keyCode: 13, label: 'Start', value: jsnes.Controller.BUTTON_START 
	},
	'F1': {
		player: 1, key: 'F1', keyCode: 112, label: 'Refresh', value: -1, isPreventDefault: true 
	},
	'F2': {
		player: 1, key: 'F2', keyCode: 113, label: 'FullScreen', value: -2, isPreventDefault: true 
	},	
	'o': { 
		player: 2, key: 'o', keyCode: 79, label: 'Up', value: jsnes.Controller.BUTTON_UP, isPreventDefault: true 
	},
	'l': { 
		player: 2, key: 'l', keyCode: 76, label: 'Down', value: jsnes.Controller.BUTTON_DOWN, isPreventDefault: true 
	},
	'k': { 
		player: 2, key: 'k', keyCode: 75, label: 'Left', value: jsnes.Controller.BUTTON_LEFT, isPreventDefault: true 
	},
	';': { 
		player: 2,	key: ';', keyCode: 186, label: 'Right', value: jsnes.Controller.BUTTON_RIGHT, isPreventDefault: true 
	},
	'd': { 
		player: 2, key: 'd', keyCode: 68, label: 'A', value: jsnes.Controller.BUTTON_A 
	}, 
	'f': { 
		player: 2, key: 'f', keyCode: 70, label: 'B', value: jsnes.Controller.BUTTON_B 
	}
}

export function addPlayerKeyListener(player) {
	listen_player_key[player] = true
}

export function removePlayerKeyListener(player) {
	listen_player_key[player] = false
}

var handleKeydown = function(event) {
	keyboard(nes.buttonDown, event, DEFAULT_BUTTON_KEY_MAP)
}

var handleKeyup = function(event) {
	keyboard(nes.buttonUp, event, DEFAULT_BUTTON_KEY_MAP)
}

document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)

function keyboard(callback, event, keyMap){
	var target = null
	const keyMapArr = Object.values(keyMap)
	for(let i = 0; i < keyMapArr.length; i++) {
		if(+keyMapArr[i].keyCode === event.which) {
			target = keyMapArr[i]
			break
		}
	}

	if(target != null) {
		const jsnesButton = target.value
		const isPreventDefault = target.isPreventDefault

		if(!listen_player_key[target.player]) return 
		if(jsnesButton > -1) {
			callback(target.player, jsnesButton)
			
			if(isPreventDefault) {
				event.preventDefault()
			}
		}else {
			switch(target.label) {
				case 'Refresh': {
					if(event.type === 'keyup') return 
					resetNes()
					break
				}
				case 'FullScreen': {
					if(event.type === 'keyup') return 
					isFullscreen = !isFullscreen
					
					if(isFullscreen) {
						_requestFullscreen($canvasDom)
					}else {
						_cancelFullScreen()
					}
					break
				}
				default: {}
			}
		}
	}
}

export function nes_load_url($canvas, path, immediate = true){
	// path = 'http://localhost:7105/Contra'
	// path = 'http://qi.testfreelog.com/v2/auths/exhibits/80000077/61e7b893f04747002e473d63/fileStream	'
	nes_init($canvas);
	return path //getNesData(path)
		.then(nesData => {
			currentNesData = nesData.data
			console.log(nesData.data.indexOf("NES\x1a"))
			nes.loadROM(nesData.data)
		})
		.then(() => {
			initAnimationFrame()
			if(!immediate) {
				pauseAnimationFrame()
			}
		})	
}

function nes_init($canvas){
	$canvasDom = $canvas
	nes._$canvasDom = $canvas
	canvas_ctx = $canvas.getContext("2d");
	image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	canvas_ctx.fillStyle = "black";
	canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// Allocate framebuffer array.
	var buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
	framebuffer_u32 = new Uint32Array(buffer);
	
	// setUpNesAudio()
}

function getNesData(path) {
	return new Promise((resolve, reject) => {
		var req = new XMLHttpRequest()
		req.open("GET", path)
		req.withCredentials = true;
		req.overrideMimeType("text/plain; charset=x-user-defined")
		req.onerror = () => console.log(`Error loading ${path}: ${req.statusText}`)
		
		req.onload = function() {
			if (this.status === 200) {
				currentNesData = this.responseText
				resolve(this.responseText)
			} else if (this.status === 0) {
				// Aborted, so ignore error
			} else {
				req.onerror()
			}
		};
		
		req.send()
	})
}

function initAnimationFrame() {
	if(!onAnimationFrame.isInitAnimationFrame) {
			onAnimationFrame.isInitAnimationFrame = true
			isRunAnimationFrame = true
			window.requestAnimationFrame(onAnimationFrame)
		}
}

function onAnimationFrame(){
	if(!isRunAnimationFrame) return 
	window.requestAnimationFrame(onAnimationFrame);
	
	image.data.set(framebuffer_u8);
	canvas_ctx.putImageData(image, 0, 0);
	nes.frame();
}

var isRunAnimationFrame = false
export function playAnimationFrame() {
	if(!isRunAnimationFrame) {
		isRunAnimationFrame = true
		onAnimationFrame()
	}else {
		isRunAnimationFrame = true
	}
}

export function pauseAnimationFrame() {
	isRunAnimationFrame = false
}

export function setUpNesAudio() {
	// Setup audio.
	var audioContext = new window.AudioContext();
	var audioScriptNode = audioContext.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	audioScriptNode.onaudioprocess = audio_callback;
	audioScriptNode.connect(audioContext.destination);
	return [ audioContext, audioScriptNode ]
}

export function resetNes() {
	nes.reloadROM()
}

function audio_callback(event){
	var dst = event.outputBuffer;
	var len = dst.length;
	
	// Attempt to avoid buffer underruns.
	if(audio_remain() < AUDIO_BUFFERING) nes.frame();
	
	var dst_l = dst.getChannelData(0);
	var dst_r = dst.getChannelData(1);
	for(var i = 0; i < len; i++){
		var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
		dst_l[i] = audio_samples_L[src_idx];
		dst_r[i] = audio_samples_R[src_idx];
	}
	
	audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

function audio_remain(){
	return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

export function resetKeyboard(keyMap) {
	document.removeEventListener('keydown', handleKeydown)
	document.removeEventListener('keyup', handleKeyup)

	keyMap = Object.assign({}, keyMap)
	handleKeydown = function(event) {
		keyboard(nes.buttonDown, event, keyMap)
	}

	handleKeyup = function(event) {
		keyboard(nes.buttonUp, event, keyMap)
	}
	
	document.addEventListener('keydown', handleKeydown);
	document.addEventListener('keyup', handleKeyup);
}

