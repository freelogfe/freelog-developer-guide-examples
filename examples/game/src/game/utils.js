export function _requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen()
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen()
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen()
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullScreen()
	}
}

export function _cancelFullScreen() {
	if (document.exitFullScreen) {
		document.exitFullScreen()
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen()
	}
}
