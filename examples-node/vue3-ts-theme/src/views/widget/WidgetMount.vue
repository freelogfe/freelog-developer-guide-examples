<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="w-100x h-100x p-40 flex-column">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="加载自身依赖的插件">
        <div class="flex-column">
          <div class="flex-row mb-20">
            <a-button type="primary mr-30" @click="add"
              >给自身依赖插件加1</a-button
            >
            <a-button type="primary mr-30" @click="reload(selfWidget)"
              >重新加载</a-button
            >
          </div>
          <div id="freelog-self"></div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="加载展品类型的插件" force-render>
        <div class="flex-column">
          <div class="flex-row mb-20">
            <a-button type="primary mr-30" @click="add2"
              >给展品依赖插件加1</a-button
            >
            <a-button type="primary mr-30" @click="reload(exhibitWidget)"
              >重新加载</a-button
            >
          </div>
          <div id="freelog-exhibit"></div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import {
  freelogApp,
  ExhibitAuthNodeInfo,
  WidgetController,
  ExhibitInfo,
  GetExhibitListByPagingResult,
} from "freelog-runtime";
import { onBeforeUnmount, ref } from "vue";
const activeKey = ref("1");
let selfWidget: WidgetController = {} as WidgetController;
let exhibitWidget: WidgetController = {} as WidgetController;
const selfWidgetApi = ref({} as any);
const exhibitWidgetApi = ref({} as any);

const add = () => {
  // 获取插件暴露的api
  selfWidgetApi.value.changeMe();
};
const add2 = () => {
  // 获取插件暴露的api
  exhibitWidgetApi.value.changeMe();
};
const reload = (obj: any) => {
  obj.reload().then((result: string) => {
    if (result) {
      console.log("重新渲染成功");
    } else {
      console.log("重新渲染失败");
    }
  });
};
const mountSubWidget = async () => {
  const subData: ExhibitAuthNodeInfo[] =
    await freelogApp.getSelfDependencyTree();
  subData.forEach(async (sub: ExhibitAuthNodeInfo) => {
    if (sub.articleName === "snnaenu/插件开发演示代码插件") {
      selfWidget = await freelogApp.mountArticleWidget({
        articleId: sub.articleId,
        parentNid: sub.parentNid,
        nid: sub.nid,
        topExhibitId: freelogApp.getTopExhibitId(),
        container: document.getElementById("freelog-self") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
        renderWidgetOptions: {
          data: {
            name: "自身依赖插件",
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
        // widget_entry: "https://localhost:8102", // 本地url，dev模式下，可以使用本地url调试子插件
      });
    }
  });
};
const mountExhibitWidget = async () => {
  const res: GetExhibitListByPagingResult =
    await freelogApp.getExhibitListByPage({
      articleResourceTypes: "插件",
      isLoadVersionProperty: 1,
    });
  const widgets = res.data.data?.dataList;

  widgets.forEach(async (widget: ExhibitInfo, index: number) => {
    if (widget.articleInfo.articleName == "snnaenu/插件开发演示代码插件") {
      // widget.exhibitId = widget.exhibitId + '111'
      exhibitWidget = await freelogApp.mountExhibitWidget({
        exhibitId: widget.exhibitId,
        container: document.getElementById("freelog-exhibit") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
        property: widget.versionInfo?.exhibitProperty,
        dependencyTree: widget.versionInfo?.dependencyTree,
        renderWidgetOptions: {
          data: {
            name: "展品插件",
            registerApi: (api: any) => {
              exhibitWidgetApi.value = api;
            },
          },
        },
        seq: 1, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
        // widget_entry: "https://localhost:8102", // 本地url，dev模式下，可以使用本地url调试子插件
      });
      return true;
    }
    return false;
  });
};
// 离开记得卸载插件喔
onBeforeUnmount(async () => {
  await exhibitWidget.unmount();
  await selfWidget.unmount();
});
mountExhibitWidget();
mountSubWidget();
</script>
