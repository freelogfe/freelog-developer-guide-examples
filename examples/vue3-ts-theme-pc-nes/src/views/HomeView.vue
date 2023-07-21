<template>
  <div class="w-100x h-100x p-20 flex-column">
    <div id="freelog-game"></div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref, onUnmounted, watch } from "vue";
import { message } from "ant-design-vue";
const props = defineProps<{
  id: string;
}>();

let exhibitWidget: any = null;
const gameUrl = ref("");
const gameName = ref("");
watch(
  () => props.id,
  (val: any) => {
    if (!val) return;
    freelogApp.getExhibitInfo(val).then(async (res: any) => {
      if (res.data.errCode) {
        message.error(res.data.msg);
        return;
      }
      gameUrl.value = await freelogApp.getExhibitFileStream(
        res.data.data.exhibitId,
        {
          returnUrl: true,
        }
      );
      gameName.value = res.data.data.exhibitName;
      if (!exhibitWidget) {
        mountExhibitWidget(gameUrl.value, gameName.value);
        return;
      }
      exhibitWidget.getApi().startGame(gameUrl.value, gameName.value);
    });
  },
  { immediate: true }
);

// 离开记得卸载插件喔
onUnmounted(async () => {
  await exhibitWidget?.unmount();
});
const mountExhibitWidget = async (url: string, name: string) => {
  // const res = await freelogApp.getExhibitListByPaging({
  //   articleResourceTypes: "插件",
  //   isLoadVersionProperty: 1,
  // });
  // const widgets = res.data.data.dataList;
  // widgets.forEach(async (widget: any, index: number) => {
  //   if (widget.exhibitName === "红白机插件") {
  //     // widget.exhibitId = widget.exhibitId + '111'
  //     exhibitWidget = await freelogApp.mountWidget({
  //       widget: widget, // 必传，子插件数据
  //       container: document.getElementById("freelog-game"), // 必传，自定义一个让插件挂载的div容器
  //       topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
  //       config: {
  //         defaultGameUrl: url,
  //         defaultGameName: name,
  //       }, // 传递给子插件配置数据，会合并到作品上的配置数据
  //       seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
  //       // widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
  //     });
  //   }
  // });
  const subData = await freelogApp.getSubDep();
  console.log(subData)
  subData.subDep.some(async (sub:any, index:number) => {

    if (index === 1) return true;
    exhibitWidget = await freelogApp.mountWidget(
      {
        widget: sub, // 必传，子插件数据
        container: document.getElementById("freelog-game"), // 必传，自定义一个让插件挂载的div容器
        topExhibitData: subData, // 必传，最外层展品数据（子孙插件都需要用）
        config: {
          defaultGameUrl: url,
          defaultGameName: name,
        }, // 传递给子插件配置数据，会合并到作品上的配置数据
        seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
        // widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
      }
    );
  });
};
</script>
<style scoped></style>
