<template>
  <div class="w-100x h-100x p-20 flex-column">
    <div id="freelog-game"></div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp, DependencyNodeInfo } from "freelog-runtime";
import { ref, onUnmounted, watch } from "vue";
import { message } from "ant-design-vue";
const selfWidgetApi = ref({} as any);
const props = defineProps<{
  id: string;
}>();

let selfWidget: any = null;
const gameUrl = ref("");
const gameName = ref("");
watch(
  () => props.id,
  (val: any) => {
    if (!val) return;
    freelogApp.getExhibitById(val).then(async (res: any) => {
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
      if (!selfWidget) {
        mountArticleWidget(gameUrl.value, gameName.value);
        return;
      }
      selfWidgetApi.value.startGame(gameUrl.value, gameName.value);
    });
  },
  { immediate: true }
);

// 离开记得卸载插件喔
onUnmounted(async () => {
  await selfWidget?.unmount();
});
const mountArticleWidget = async (url: string, name: string) => {
  const res = await freelogApp.getSelfDep();
  const subData = res.data.data;
  subData.forEach(async (sub: DependencyNodeInfo) => {
    if (sub.articleName === "snnaenu/nes-widget") {
      selfWidget = await freelogApp.mountArticleWidget({
        articleId: sub.articleId,
        parentNid: sub.parentNid,
        nid: sub.nid,
        topExhibitId: freelogApp.getTopExhibitId(),
        container: document.getElementById("freelog-game") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
        renderWidgetOptions: {
          iframe:true,
          data: {
            defaultGameUrl: url,
            defaultGameName: name,
            registerApi: (api: any) => {
              selfWidgetApi.value = api;
            },
          },
          lifeCycles: {
            mounted: (e: CustomEvent) => {
              console.log(e, "mounted");
            },
          },
        },
        seq: 0, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
        widget_entry: "https://localhost:8203", // 本地url，dev模式下，可以使用本地url调试子插件
      });
    }
  });
};
</script>
<style scoped></style>
