<template>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-shengyinkai"></use>
  </svg>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
  >
    <template v-for="item in list" :key="item">
      <div class="flex-row space-between px-10 py-10 mt-20 align-center">
        <div class="flex-row align-center">
          <div class="h-40 w-40 over-h mr-20">
            <img :src="item.coverImages[0]" alt="" class="h-100x" />
          </div>
          <span class="">{{ item.exhibitName }}</span>
        </div>
        <van-button
          class="w-100"
          type="primary"
          size="small"
          block
          round
          @click="start(item)"
          >开始游戏</van-button
        >
      </div>
    </template>
  </van-list>
  <div id="freelog-game" v-show="showWdiget"></div>
</template>

<script lang="ts" setup>
const list = ref([] as any[]);
const loading = ref(true);
const finished = ref(true);
const showWdiget = ref(false);
import { freelogApp } from "freelog-runtime";
import { ref, onBeforeUnmount } from "vue";

let exhibitWidget: any = null;

const gameUrl = ref("");
const gameName = ref("");
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "nesrom,红白机",
  })
  .then(async (res: any) => {
    list.value = res.data.data.dataList;
    gameName.value = list.value[0].exhibitName;
    gameUrl.value = await freelogApp.getExhibitFileStream(
      list.value[0].exhibitId,
      {
        returnUrl: true,
      }
    );
    console.log(list.value);
    loading.value = false;
    mountExhibitWidget(gameUrl.value, gameName.value);
  });
const start = async (data: any) => {
  gameName.value = data.exhibitName;
  gameUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
    returnUrl: true,
  });
  showWdiget.value = true;
  exhibitWidget.getApi().startGame(gameUrl.value, gameName.value);
};
// 离开记得卸载插件喔
onBeforeUnmount(() => {
  exhibitWidget?.unmount();
});
const mountExhibitWidget = async (url: string, name: string) => {
  const res = await freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data.dataList;
  widgets.forEach(async (widget: any, index: number) => {
    if (widget.exhibitName === "nes-widget-mobile") {
      // widget.exhibitId = widget.exhibitId + '111'
      exhibitWidget = await freelogApp.mountWidget({
        widget: widget, // 必传，子插件数据
        container: document.getElementById("freelog-game"), // 必传，自定义一个让插件挂载的div容器
        topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
        config: {
          defaultGameUrl: url,
          defaultGameName: name,
          showList: () => {
            showWdiget.value = false;
          },
        }, // 传递给子插件配置数据，会合并到作品上的配置数据
        seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
        // widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
      });
    }
  });
};
</script>
<style scoped lang="scss">
#freelog-game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
