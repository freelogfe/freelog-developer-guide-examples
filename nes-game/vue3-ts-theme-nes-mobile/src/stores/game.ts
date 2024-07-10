import { defineStore } from 'pinia'
import { freelogApp } from "freelog-runtime";
const defaultGameUrl = "https://192.168.2.122:8002/Contra" //"https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes"
const defaultGameName = "无游戏"


export const useGameUrlStore = defineStore('game', {
  state: () => ({ url: defaultGameUrl,gameName: defaultGameName }),
 
  actions: {
    setUrl(url: string, name: string) {
      this.url = url
      this.gameName = name
    },
  },
})