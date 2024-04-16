import { defineStore } from 'pinia'
export const userStore = defineStore('user', {
  state: () => ({ userInfo: null as any }), 
  actions: {
    setUserInfo(data:any) {
      this.userInfo = data
    },
  },
})