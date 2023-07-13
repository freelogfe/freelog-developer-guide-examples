import { defineStore } from 'pinia'
import { freelogApp } from "freelog-runtime";
const defaultGameUrl = freelogApp?.getSelfConfig().defaultGameUrl || {}
export const useGameUrlStore = defineStore('gameUrl', {
  state: () => ({ url: defaultGameUrl }),
 
  actions: {
    setUrl(url: string) {
      this.url = url
    },
  },
})