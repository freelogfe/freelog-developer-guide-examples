import { defineStore } from 'pinia'
export const userStore = defineStore('user', {
  state: () => ({ userInfo: null }), 
  actions: {
    setUserInfo(data:any) {
      this.userInfo = data
    },
  },
})