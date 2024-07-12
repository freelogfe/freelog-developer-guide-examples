<script setup>
import { ref, computed } from 'vue'
import { NesVue } from 'nes-vue'

const gameList = [
  "https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes",
  "https://taiyuuki.github.io/nes-vue/Super Mario Bros 3.nes",
  "https://taiyuuki.github.io/nes-vue/Mighty Final Fight (USA).nes",
  "https://taiyuuki.github.io/nes-vue/Mitsume ga Tooru (Japan).nes"
]
const fm2List = [
  [
    "https://taiyuuki.github.io/nes-vue/happylee-supermariobros,warped.fm2",
    0
  ],
  [
    "https://taiyuuki.github.io/nes-vue/lordtom,maru,tompa-smb3-warps.fm2",
    -1
  ],
  [
    "https://taiyuuki.github.io/nes-vue/xipov3-mightyfinalfight.fm2",
    0
  ],
  [
    "https://taiyuuki.github.io/nes-vue/jy,aiqiyou-mitsumegatooru.fm2",
    0
  ]
]
const gameURL = ref(gameList[0])
const nes = ref(null)
const slt = ref(null)
const disable = ref(true)
const isPaused = ref(false)
const pauseLabel = computed(() => isPaused.value ? 'Play' : 'Pause')

function fetchFm2() {
  const fm2 = fm2List[gameList.indexOf(slt.value.value)]
  nes.value.fm2URL(...fm2)
    .then(() => {
      disable.value = false
  })
}

function resetGame() {
  nes.value.reset()
  isPaused.value = false
  tasPlaying.value = false
}

function stopGame() {
  nes.value.stop()
  disable.value = true
}

function selectRom() {
  gameURL.value = slt.value.value
  disable.value = true
  tasPlaying.value = false
}

const tasPlaying = ref(false)
function playTAS() {
  nes.value.fm2Play()
  tasPlaying.value = true
}

function stopTAS() {
  nes.value.fm2Stop()
  isPaused.value = false
  tasPlaying.value = false
}


function pause() {
  if (isPaused.value) {
    nes.value.play()
  } else {
    nes.value.pause()
  }
  isPaused.value = !isPaused.value
}
</script>

<template>
  <div class="box">
    <nes-vue
      ref="nes"
      :url="gameURL"
      :width="512"
      :height="480"
      @success="fetchFm2"
    />
  </div>
  <div class="btns">
    <select
      ref="slt"
      name="rom"
      class="slt"
      @change="selectRom"
    >
      <option
        v-for="rom in gameList"
        :value="rom"
        :key="rom"
      >
        {{ rom.replace('.nes', '').replace('https://taiyuuki.github.io/nes-vue/', '') }}
      </option>
    </select>
    <button @click="resetGame">
      Reset
    </button>
    <button @click="stopGame">
      Stop
    </button>
    <button @click="pause" style="width:4em" :disabled="disable">
      {{ pauseLabel }}
    </button>
    <button @click="playTAS" :disabled="disable">
      Play TAS Video
    </button>
    <button @click="stopTAS" v-show="tasPlaying">
      Stop TAS Video
    </button>
  </div>
</template>

<style>
.box {
  position: relative;
  display: inline-block;
}

.btns {
  margin-top: 5px;
}
  
button, select, input {
  margin-right: 5px
}

.slt {
  width: 100px;
}
</style>
