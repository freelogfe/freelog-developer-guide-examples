<template>
  <button @click="add" style="margin-top: 50px; font-size: 30px">
    我是主题：点我给插件加1
  </button>
  <div id="freelog-single"></div>
</template>
<script setup>
import { freelogApp } from "freelog-runtime";

let app = null;
// 加载自身依赖的插件
const mountSubWidget = async () => {
  const subData = await freelogApp.getSubDep();
  subData.subDep.some(async (sub, index) => {
    if (index === 0) return true;
    app = await freelogApp.mountWidget({
      widget: sub, // 必传，子插件数据
      container: document.getElementById("freelog-single"), // 必传，自定义一个让插件挂载的div容器
      topExhibitData: subData, // 必传，最外层展品数据（子孙插件都需要用）
      config: {}, // 子插件配置数据，需要另外获取作品上的配置数据
      seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      // widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
    });
    // 使用此函数可以保证在插件加载完成后 再执行
    app.mountPromise.then(() => {
      // 卸载之后重新加载
      // app.unmount.then(() => {
      //   app.mount.then(() => {
      //   })
      // })
    });
  });
};
const add = () => {
  app.getApi().changeMe();
};

// 加载展品类型的插件s
const mountExhibitWidget = async () => {
  const res = await freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data.dataList;
  widgets.some(async (widget, index) => {
    if (index === 1) { 
      return true;
    }
    // widget.exhibitId = widget.exhibitId + '111'
    app = await freelogApp.mountWidget({
      widget: widget, // 必传，子插件数据
      container: document.getElementById("freelog-single"), // 必传，自定义一个让插件挂载的div容器
      topExhibitData: null, // 必传，最外层展品数据（子孙插件都需要用）
      config: {}, // 子插件配置数据，需要另外获取作品上的配置数据
      seq: null, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      widget_entry: "https://localhost:8002", // 本地url，dev模式下，可以使用本地url调试子插件
    });
  });
};
mountExhibitWidget();
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
