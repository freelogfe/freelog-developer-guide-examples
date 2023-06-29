import './index.less'
import { 
  nes_load_url, 
  playAnimationFrame, pauseAnimationFrame, setUpNesAudio, resetKeyboard, resetNes,
  addPlayerKeyListener, removePlayerKeyListener,
  DEFAULT_BUTTON_KEY_MAP, DEFAULT_BUTTON_KEY_VERSION } from './nes-embed'
import { addGamepadListener, removeGamepadListener } from './gamepad'  
import { _requestFullscreen } from './utils'

var isPlayAudio = true
var nesAudioContext = null, nesAudioScriptNode = null, nesContext = null
class FreelogSingleJsnes extends HTMLElement {
  constructor() {
    super()
    this.$targetSelectedDom = null
    this.isChangingKey = false
    this.modalVisible = false
    this.isPlayingNes = false
    this.isRenderNes = false
    this.modalInstance = null
    this.listenPlayerKey = [ true, true, false, false ]
    this.lastListenPlayerKey = [ true, true, false, false ]
    this.getDefaultKeysMap()
    nesContext = this
  }

  connectedCallback (){
    this.setNesBoxSize()
    this.bindEvent()
    if(document.readyState === 'complete'){
      this.initNes()
    } else {
      window.onload = this.initNes.bind(this)
    }
  }

  getDefaultKeysMap() {
    var dKeysMap = localStorage.getItem('DEFAULT_BUTTON_KEY_MAP')
    var dKeysVersion = localStorage.getItem('DEFAULT_BUTTON_KEY_VERSION')
    try {
      if(dKeysMap != null) {
        dKeysMap = JSON.parse(dKeysMap)
        if(dKeysVersion === DEFAULT_BUTTON_KEY_VERSION) {
          dKeysMap = Object.assign({}, dKeysMap)
        }else {
          dKeysMap = Object.assign({}, DEFAULT_BUTTON_KEY_MAP)
        }
        
      }else {
        dKeysMap = DEFAULT_BUTTON_KEY_MAP
      }
    }catch(e) {
      console.log(e)
      dKeysMap = DEFAULT_BUTTON_KEY_MAP
    }
    
    dKeysMap = typeof dKeysMap === 'string' ? JSON.parse(dKeysMap) : dKeysMap
    dKeysMap = Object.assign({}, dKeysMap)
    this.defaultKeysMap = dKeysMap
    this.keysArray = Object.values(dKeysMap)
  }

  setNesBoxSize() {
    const { innerWidth, innerHeight } = window
    const $nesWrapper =	document.getElementById('nes-wrapper')
    var width
    width = Math.min(innerWidth, innerHeight) * .9
    width = parseInt(width)

    $nesWrapper.style.width = `${width}px`
  }

  bindEvent() {
    window.onresize = this.setNesBoxSize.bind(this)
    this.getDom()
    this.querySelector('.modal-body table tbody').addEventListener('click', this.handleChangeKey.bind(this), false)
    this.$modalCloseBtn.addEventListener('click', this.closeModal.bind(this), false)
    this.$modalSaveBtn.addEventListener('click', this.saveKeyControls.bind(this), false)
    this.$controlsBtn.addEventListener('click', this.openModal.bind(this), false)
    this.$playerBtn.addEventListener('click', this.playNes.bind(this), false)
    this.$loudSpeaker.addEventListener('click', this.toggleLoudSpeaker.bind(this), false)
    this.querySelector('.modal-body table thead').addEventListener('click', this.tapSwitchBtn.bind(this), false)
    this.$gamepadList.addEventListener('click', this.tapSwitchBtn.bind(this), false)
    this.$fullScreenBtn.addEventListener('click', this.tapFullScreenBtn.bind(this), false)
    this.$refreshBtn.addEventListener('click', resetNes, false)
    document.addEventListener('keydown', this.handleKeydown.bind(this), false)
    window.addEventListener("gamepadconnected", this.initGamepad.bind(this))
    window.addEventListener("gamepaddisconnected",this.initGamepad.bind(this))
  }

  getDom() {
    const self = this
    self.$nesTitle = self.querySelector('.nes-title')
    self.$modalCloseBtn = self.querySelector('.modal-header .modal-close-btn')
    self.$modalSaveBtn = self.querySelector('.modal-footer .modal-save-btn')
    self.$controlsBtn = self.querySelector('.controls-btn')
    self.$fullScreenBtn = self.querySelector('.full-screen-btn')
    self.$refreshBtn = self.querySelector('.refresh-btn')
    self.$playerBtn = self.querySelector('.start-btn')
    self.$nesBtnGroup = self.querySelector('.nes-btn-group')
    self.$loudSpeaker = self.querySelector('.nes-loud-speaker')
    self.$canvas = self.querySelector('#nes-canvas')
    self.$loading = self.querySelector('.f-loading')
    self.$gamepadList = self.querySelector('.modal-box .gamepad-list')
  }

  initNes() {
    this.rendesControls()
    this.renderGamepadList()
    this.renderTableHead()
    this.renderNesTitle()
    this.renderNesPreviewImage()
    this.renderNes()
      .then(() => {
        this.isRenderNes = true
        this.toggleClass(this.$nesBtnGroup, 'visible', 'add')
      })
  }

  initGamepad() {
    const gps = navigator.getGamepads()
    this.listenPlayerKey[2] = gps[0] != null
    this.listenPlayerKey[3] = gps[1] != null
    this.renderTableHead()
    this.renderGamepadList()
    this.rendesControls()
  }

  initModal() {
    var Modal = window.f_common_lib.Vue.extend({
      data: function () {
        return {
          dialogVisible: false,
          player1Value: true,
          player2Value: true,
          controlsData: []
        }
      },
      methods: {
        closeModal() {},
      },
      created() {},
      mounted() {},
    })
    // 创建 Modal 实例，并挂载到一个元素上。
    this.modalInstance = new Modal().$mount('.modal-box')
  }

  renderGamepadList() {
    const gps = navigator.getGamepads()
    const arr = Array.from(gps)
    var gpListHTML = arr.filter(gp => gp != null).map((gp, index) => {
      index += 2
      const className = this.listenPlayerKey[index] ? 'active' : 'inactive'
      const btnText = this.listenPlayerKey[index] ? '禁用' : '启用'
      
      return `
        <li class="${className}" data-index="${index}">
          <strong>Gamepad-${gp.index}: </strong>${gp.id}
          <button class="gp-switch-btn" type="text">${btnText}</button>
        </li>
      `
    }).join('')
    this.$gamepadList.innerHTML = gpListHTML
  }

  renderTableHead() {
    var theadHTML = [0, 1].map((gp, index) => {
      const className = this.listenPlayerKey[index] ? 'active' : 'inactive'
      const btnText = this.listenPlayerKey[index] ? '禁用' : '启用'
      
      return `
        <th class="${className}" data-index="${index}">
          Player ${index + 1}
          <button type="text">${btnText}</button>
        </th>
      `
    }).join('')
    this.querySelector('.modal-body thead tr').innerHTML = '<th>Button</th>' + theadHTML
  }

  rendesControls() {
    const p1KeysArray = this.keysArray.filter(item => item.player === 1)
    const p2KeysArray = this.keysArray.filter(item => item.player === 2)
    const player2KeyMap = {}
    p2KeysArray.forEach(item => {
      player2KeyMap[item.value] = item
    })
    this.querySelector('.modal-body table tbody').innerHTML = p1KeysArray.sort((k1, k2) => {
      if(k1.value > k2.value) {
        return 1
      }else if(k2.value > k1.value){
        return -1
      }else {
        return 0
      }
    }).map(item => {
      const { label, key, keyCode, isPreventDefault = false, value, player = 1 } = item
      const player2Item = player2KeyMap[value]
      const className1 = this.listenPlayerKey[0] ? 'active' : 'inactive'
      const className2 = this.listenPlayerKey[1] ? 'active' : 'inactive'
      const threeTdHTML = player2Item ? `<td class="${className2}" data-prevent-default="${player2Item.isPreventDefault}" data-label="${player2Item.label}" data-key="${player2Item.key}" data-key-code="${player2Item.keyCode}" data-value="${player2Item.value}" data-player="${player2Item.player}">${player2Item.key}</td>` : `<td class="${className2}"></td>`
      return `
        <tr>
          <td>${label}</td>
          <td class="${className1}" data-prevent-default="${isPreventDefault}" data-label="${label}" data-key="${key}" data-key-code="${keyCode}" data-value="${value}" data-player="${player}">${key}</td>
          ${threeTdHTML}
        </tr>
      `
    }).join('')
  }

  renderNesTitle() {
    const { presentableName } = this.dataset
    this.$nesTitle.innerHTML = presentableName
  }

  renderNesPreviewImage() {
    const { previewImage } = this.dataset
    if(previewImage) {
      const $previewImg = document.createElement('img') 
      $previewImg.className = 'visible'
      $previewImg.setAttribute('src', previewImage)
      this.$nesBtnGroup.appendChild($previewImg)
    }
  }

   renderNes() {
    this.toggleClass(this.$loading, 'visible', 'add')
    // const { presentableName, presentableId } = this.dataset
    // const url = window.FreelogApp.QI.resolvePresentableDataUrl(presentableId) 'http://localhost:7105/Contra'
    const promiseData  = window.freelogApp.getExhibitFileStream('61e7b893f04747002e473d63')  
    this.$nesTitle.innerHTML = '红白机'
    return nes_load_url(this.$canvas, promiseData, false)
      .then(() => {
        resetKeyboard(this.defaultKeysMap)
        this.toggleClass(this.$loading, 'visible', 'delete')
      })
      .catch(e => {
        console.error(e)
        this.toggleClass(this.$loading, 'visible', 'delete')
      })
  }
  
  initNesAudio() {
    const [ audioContext, audioScriptNode ] = setUpNesAudio()
    nesAudioContext = audioContext
    nesAudioScriptNode = audioScriptNode
    this.toggleLoudSpeaker(isPlayAudio)
    this.toggleClass(this.$loudSpeaker, 'visible', 'add')
  }

  playNes() {
    this.initNesAudio()
    this.isPlayingNes = true
    playAnimationFrame()
    this.toggleClass(this.$nesBtnGroup, 'visible', 'delete')
  }

  tapSwitchBtn(e) {
    if(e.target.nodeName === 'BUTTON') {
      const $parentNode = e.target.parentNode
      const index = +$parentNode.dataset.index
      this.listenPlayerKey[index] = !this.listenPlayerKey[index] 
      this.renderTableHead()
      this.renderGamepadList()
      this.rendesControls()
    }
  }

  tapFullScreenBtn() {
    _requestFullscreen(this.$canvas)
  }

  handleKeydown(event) {
    switch(event.which) {
      case 13: {
        if(nesContext === this) {
          if(this.isPlayingNes || !this.isRenderNes) break 
          if(!this.modalVisible) {
            this.playNes()
            this.isPlayingNes = true
          }
        }
        break
      }
    }
    this.resetKey(event)
  }

  handleChangeKey(event) {
    const $dom = event.target
    if($dom.dataset.key != null) {
      const $formerSelectedDom = this.querySelector('table .selected')
      if($formerSelectedDom) {
        const { key } = $formerSelectedDom.dataset
        $formerSelectedDom.className = ''
        $formerSelectedDom.innerHTML = key
      }
      $dom.className = 'selected'
      $dom.innerHTML = 'Press key or button...'
      this.$targetSelectedDom = $dom
      this.isChangingKey = true
    }
  }
  
  resetKey(event) {
    if(this.isChangingKey) {
      const $dom = this.$targetSelectedDom
      const { key, which } = event

      const $tmpNode = this.querySelector(`[data-key-code="${which}"]`)
      if($tmpNode != null) {
        $tmpNode.innerHTML = ''
        $tmpNode.setAttribute('data-key', '')
        $tmpNode.setAttribute('data-key-code', '')
      }
      
      $dom.setAttribute('data-key', key)
      $dom.setAttribute('data-key-code', which)
      $dom.innerHTML = key
      
      this.isChangingKey = false
    }
  }

  openModal() {
    removePlayerKeyListener(1)
    this.modalVisible = true
    const $modalBox = this.querySelector('.modal-box')
    const $modal = this.querySelector('.modal-box .modal')
    const $modalMask = this.querySelector('.modal-box .modal-mask')
    $modalBox.style.display = "block"
    setTimeout(() => {
      this.toggleClass($modal, 'show', 'add')
      this.toggleClass($modalMask, 'show', 'add')
    })
  }

  closeModal() {
    addPlayerKeyListener(1)
    this.modalVisible = false
    this.isChangingKey = false
    const $modalBox = this.querySelector('.modal-box')
    const $modal = this.querySelector('.modal-box .modal')
    const $modalMask = this.querySelector('.modal-box .modal-mask')
    setTimeout(() => {
      $modalBox.style.display = "none"
    }, 200)
    this.toggleClass($modal, 'show', 'delete')
    this.toggleClass($modalMask, 'show', 'delete')

    const $target = this.querySelector('table .selected')
    if($target) {
      const { key } = $target.dataset
      $target.className = ''
      $target.innerHTML = key
    }
    this.listenPlayerKey = this.lastListenPlayerKey.slice()
    this.renderTableHead()
    this.renderGamepadList()
    this.rendesControls()

    this.defaultKeysMap = {}
    this.keysArray.forEach(keyItem => {
      this.defaultKeysMap[keyItem.key] = keyItem
    })
  }

  toggleClass ($dom, className, type){
    var classList = $dom.classList
    classList = new Set(classList)
    if(type === 'add') {
      classList.add(className)
    }else if(type === 'delete'){
      classList.delete(className)
    }else {
      if(classList.has(className)) {
        classList.delete(className)
      }else {
        classList.add(className)
      }
    }
    
    $dom.className = [...classList].join(' ')
  }

  saveKeyControls() {
    const $keyTds = Array.from(this.querySelectorAll('[data-label]'))
    
    this.defaultKeysMap = {}
    $keyTds.forEach($td => {
      const { label, key, keyCode, preventDefault, value, player } = $td.dataset
      if(label) {
        this.defaultKeysMap[key] = Object.assign({}, {
          label, key, 
          player: parseInt(player),
          keyCode: parseInt(keyCode), 
          isPreventDefault: preventDefault === 'true', 
          value: parseInt(value), 
        })
      }
      
    })
    
    this.keysArray = Object.values(this.defaultKeysMap)
    this.lastListenPlayerKey = this.listenPlayerKey.map((item, index) => {  
      if(index < 2) {
        const player = index + 1
        if(item) {
          addPlayerKeyListener(player)
        }else {
          removePlayerKeyListener(player)
        }
      }else {
        const player = index - 1
        if(item) {
          addGamepadListener(player)
        }else {
          removeGamepadListener(player)
        }
      }
      return item
    })
    
    this.closeModal()
    resetKeyboard(this.defaultKeysMap)
    
    localStorage.setItem('DEFAULT_BUTTON_KEY_MAP', JSON.stringify(this.defaultKeysMap))
    localStorage.setItem('DEFAULT_BUTTON_KEY_VERSION', DEFAULT_BUTTON_KEY_VERSION)
    window.f_common_lib.ElementUI.Message.success({ 
      message: `按键设置保存成功！` 
    })
  }

  toggleLoudSpeaker(param) {
    if(nesAudioContext == null) return 
    if(typeof param == 'object') {
      isPlayAudio = !isPlayAudio
    }

    if(isPlayAudio) {
      nesAudioContext.resume()
      this.toggleClass(this.$loudSpeaker, 'active', 'add')
    }else {
      nesAudioContext.suspend()
      this.toggleClass(this.$loudSpeaker, 'active', 'delete')
    }
  }

  disconnectedCallback() {
    if(nesAudioScriptNode != null) {
      nesAudioScriptNode.disconnect(nesAudioContext.destination)
      nesAudioScriptNode = null
    }
    
    if(nesAudioContext != null) {
      nesAudioContext.suspend()
      nesAudioContext = null
    } 
    pauseAnimationFrame()
    // document.removeEventListener('keydown', tmpHandleKeydown)
    // tmpHandleKeydown = null
  }
}
// document.getElementById('app').appendChild(FreelogSingleJsnes)
customElements.define('freelog-single-jsnes', FreelogSingleJsnes);
