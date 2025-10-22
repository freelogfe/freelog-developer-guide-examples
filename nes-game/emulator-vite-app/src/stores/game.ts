import { defineStore } from "pinia";
import { widgetApi } from "freelog-runtime";

export const useGameUrlStore = defineStore("game", {
  state: () => ({
    url: widgetApi.getData().defaultGameUrl,
    gameName: widgetApi.getData().defaultGameName,
    gameCore: widgetApi.getData().defaultGameCore,
  }),

  actions: {
    setUrl(url: string, name: string, gameCore: string) {
      this.url = url;
      this.gameName = name;
      this.gameCore = gameCore;
    },
  },
});
