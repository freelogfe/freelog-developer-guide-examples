<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card
              :title="item.exhibitName"
              @click="show(item)"
              :class="[item.exhibitName === gameName ? 'selected' : '']"
            >
              <div class="h-80 over-h">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div id="freelog-game"></div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref, onBeforeUnmount } from "vue";

let exhibitWidget: any = null;

const data = ref([] as any[]);
const gameUrl = ref("");
const gameName = ref("");
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "nesrom,红白机",
  })
  .then(async (res: any) => {
    data.value = res.data.data.dataList;
    gameName.value = data.value[0].exhibitName;
    gameUrl.value = await freelogApp.getExhibitFileStream(
      data.value[0].exhibitId,
      {
        returnUrl: true,
      }
    );
    mountExhibitWidget(gameUrl.value, gameName.value);
  });
const show = async (data: any) => {
  gameName.value = data.exhibitName;
  gameUrl.value = await freelogApp.getExhibitFileStream(
    data.exhibitId,
    {
      returnUrl: true,
    }
  );
  exhibitWidget.getApi().startGame(gameUrl.value,gameName.value);
};
// 离开记得卸载插件喔
onBeforeUnmount( () => {
  // exhibitWidget?.unmount();
});
const mountExhibitWidget = async (url: string, name: string) => {
  const res = await freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data?.dataList;
  widgets.forEach(async (widget: any, index: number) => {
    if (widget.exhibitName === "nes-widget") {
      // widget.exhibitId = widget.exhibitId + '111'
      exhibitWidget = await freelogApp.mountWidget({
        widget: widget, // 必传，子插件数据
        container: document.getElementById("freelog-game") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
        topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
        config: {
          defaultGameUrl: url,
          defaultGameName: name,
        }, // 传递给子插件配置数据，会合并到作品上的配置数据
        seq: undefined, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
        // widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
      });
    }
  });
};
</script>
<style>
.selected {
  background-color: lightblue;
}
</style>
