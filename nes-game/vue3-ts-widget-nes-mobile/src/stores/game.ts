import { defineStore } from 'pinia'
import { widgetApi } from "freelog-runtime";
const defaultGameUrl =  "https://192.168.2.122:8002/Contra.nes" //"https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes"
const defaultGameName = "魂斗罗"

export const useGameUrlStore = defineStore('game', {
  state: () => ({ url: defaultGameUrl,gameName: defaultGameName }),
  // state: () => ({ url: widgetApi.getData().defaultGameUrl,gameName: widgetApi.getData().defaultGameName }),

  actions: {
    setUrl(url: string, name: string) {
      this.url = url
      this.gameName = name
    },
  },
})