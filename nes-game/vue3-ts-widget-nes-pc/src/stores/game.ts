import { defineStore } from 'pinia'
import { freelogApp } from "freelog-runtime";
const defaultGameUrl = freelogApp?.getSelfConfig().defaultGameUrl || {}
const defaultGameName = freelogApp?.getSelfConfig().defaultGameName || {}


export const useGameUrlStore = defineStore('game', {
  state: () => ({ url: defaultGameUrl,gameName: defaultGameName }),
 
  actions: {
    setUrl(url: string, name: string) {
      this.url = url
      this.gameName = name
    },
  },
})