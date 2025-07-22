<template >
  <div class="theme-main flex-row">
    <div class="w-300 br-1">
      <div v-for="a in gameList" :key="a.exhibitId" class="w-100x flex-column">
        <div @click="selectGame(a)" :class="['py-30 pl-40 bb-1 cur-pointer ', a.exhibitId === gameId? 'bg-active ' : '']" >
          {{a.exhibitName}}
        </div>
      </div>
    </div>
    <div id="freelog-single" class="mt-40"></div>
  </div>
</template>

<script>
import { freelogApp } from "freelog-runtime";

export default {
  name: "freelog-document-app",
  data() {
    return {
      mount: false,
      gameName: '',
      gameId: '',
      gameList: [],
      widgetApp: null
    };
  },
  computed: {},
  methods: {
    selectGame(item){
      this.gameId  = item.exhibitId
      this.gameName = item.exhibitName
      this.widgetApp.unmount(()=>{
         this.widgetApp.mount()
      })
    },
    getGame(){
      return{
        gameId: this.gameId,
        gameName: this.gameName
      }
    },
    async getSub() {
      const subData = await freelogApp.getSubDep();
      subData.subDep.some(async (sub, index) => {
        if (index === 2) return true;
        this.widgetApp = await freelogApp.mountWidget(
          sub,
          document.getElementById("freelog-single"),
          subData,
          {
            getGame: this.getGame
          },
          "",
          // 'http://localhost:7107'
        );
        // let count = 0 const widgetApp = 
        // const a = setInterval(() => {
        //   count++
        //   widgetApp.unmount()
        //   setTimeout(() => widgetApp.mount(), 2000)
        //   if (count === 4) clearInterval(a)
        // }, 3000);
      });
    },
  },
  async mounted() {
    freelogApp.onLogin(() => {
      window.location.reload();
    });
    const res = await freelogApp.getExhibitListByPage({
      skip: 0,
      limit: 20,
      articleResourceTypes: 'nesrom'
    });
    this.gameList = res.data.data.dataList
    this.gameId = res.data.data.dataList[0].exhibitId
    this.gameName = res.data.data.dataList[0].exhibitName
    !this.mount && this.getSub();
    this.mount = true;
  },
};
</script>

<style lang="scss">
.theme-main {
  height: 100%;
  width: 100%;
}
#freelog-single {
  height: 100%;
  width: 100%;
}
</style>