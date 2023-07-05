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
import { freelogApp } from "freelog-runtime";
import { reactive, ref } from "vue";
const activeKey = ref("1");
let selfWidget: any = null;
let exhibitWidget: any = null;

const add = () => {
  // 获取插件暴露的api
  selfWidget.getApi().changeMe();
};
const add2 = () => {
  // 获取插件暴露的api
  exhibitWidget.getApi().changeMe();
};
const reload = (obj: any) => {
  obj.unmount();
  obj.unmountPromise.then(() => {
    // 插件卸载完成 setTimeout只是为了效果，可以直接加载
    setTimeout(() => {
      obj.mount();
      obj.mountPromise.then(()=>{
        // 加载完成后
      })
    },500);
  });
};
const mountSubWidget = async () => {
  const subData = await freelogApp.getSubDep();
  subData.subDep.some(async (sub: any, index: number) => {
    if (index === 1) return true;
    selfWidget = await window.freelogApp.mountWidget({
      widget: sub, // 必传，子插件数据
      container: document.getElementById("freelog-self"), // 必传，自定义一个让插件挂载的div容器
      topExhibitData: subData, // 必传，最外层展品数据（子孙插件都需要用）
      config: {
        name: "我是主题依赖的插件",
      }, // 传递给子插件配置数据，会合并到作品上的配置数据
      seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
    });
    // 使用此函数可以保证在插件加载完成后 再执行
    selfWidget.mountPromise.then(() => {
      // 卸载之后重新加载
      // app.unmount.then(() => {
      //   app.mount.then(() => {
      //   })
      // })
    });
  });
};
const mountExhibitWidget = async () => {
  const res = await freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data.dataList;
  console.log(widgets);
  widgets.some(async (widget: any, index: number) => {
    if (index === 1) {
      return true;
    }
    // widget.exhibitId = widget.exhibitId + '111'
    exhibitWidget = await freelogApp.mountWidget({
      widget: widget, // 必传，子插件数据
      container: document.getElementById("freelog-exhibit"), // 必传，自定义一个让插件挂载的div容器
      topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
      config: {
        name: "我是展品类型的插件",
      }, // 传递给子插件配置数据，会合并到作品上的配置数据
      seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
    });
  });
};

mountExhibitWidget();
mountSubWidget();
</script>
