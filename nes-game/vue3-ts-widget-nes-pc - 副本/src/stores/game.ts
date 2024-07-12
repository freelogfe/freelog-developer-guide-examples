import { defineStore } from 'pinia'
import { widgetApi } from "freelog-runtime";
 


export const useGameUrlStore = defineStore('game', {
  state: () => ({ url: widgetApi.getData().defaultGameUrl,gameName: widgetApi.getData().defaultGameName }),
 
  actions: {
    setUrl(url: string, name: string) {
      this.url = url
      this.gameName = name
    },
  },
})