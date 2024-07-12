import { defineStore } from 'pinia'
import { widgetApi } from "freelog-runtime";
// const defaultGameUrl = widgetApi.getData().defaultGameUrl || "https://192.168.2.122:8002/rom/飞龙之拳3(J).nes" //"https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes"
// const defaultGameName = widgetApi.getData().defaultGameName || "无游戏"

export const useGameUrlStore = defineStore('game', {
  state: () => ({ url: widgetApi.getData().defaultGameUrl,gameName: widgetApi.getData().defaultGameName }),
 
  actions: {
    setUrl(url: string, name: string) {
      this.url = url
      this.gameName = name
    },
  },
})