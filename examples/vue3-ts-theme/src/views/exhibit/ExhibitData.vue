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
import { ref, onUnmounted } from "vue";

let exhibitWidget: any = null;

const data = ref([] as any[]);
const gameName = ref("");
const gameId = ref("");
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "nesrom,红白机",
  })
  .then((res: any) => {
    data.value = res.data.data.dataList;
    gameName.value = data.value[0].exhibitName;
    gameId.value = data.value[0].exhibitId;
    mountExhibitWidget();
  });
const show = async (data: any) => {
  gameName.value = data.exhibitName;
  gameId.value = data.exhibitId;
  exhibitWidget.unmount();
  exhibitWidget.unmountPromise.then(() => {
    setTimeout(() => {
      exhibitWidget.mount();
    }, 300);
  });
};
// 离开记得卸载插件喔
onUnmounted(async () => {
  await exhibitWidget?.unmount();
});
const mountExhibitWidget = async () => {
  const res = await freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data.dataList;
  console.log(widgets);
  widgets.forEach(async (widget: any, index: number) => {
    if (widget.exhibitName === "nes-widget") {
      // widget.exhibitId = widget.exhibitId + '111'
      exhibitWidget = await freelogApp.mountWidget({
        widget: widget, // 必传，子插件数据
        container: document.getElementById("freelog-game"), // 必传，自定义一个让插件挂载的div容器
        topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
        config: {
          // 传递给插件，让其自己获取展品内容
          getGame: () => {
            return {
              gameName: gameName.value,
              gameId: gameId.value,
            };
          },
        }, // 传递给子插件配置数据，会合并到作品上的配置数据
        seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
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
