<template>
  <button @click="add" style="margin-top: 50px;font-size: 30px;">点我加1</button>
  <div id="freelog-single"></div>
</template>
<script setup>
let app = null;
// 加载自身依赖的插件
const mountSubWidget = async () => {
  const subData = await window.freelogApp.getSubDep();
  subData.subDep.some(async (sub, index) => {
    if (index === 1) return true;
    app = await window.freelogApp.mountWidget(
      sub,
      document.getElementById("freelog-single2"),
      subData,
      "",
      "",
      "http://localhost:8001"
    );
    // 插件加载完成
    app.mountPromise.then(() => {
      // 卸载与重载
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
  const res = await window.freelogApp.getExhibitListByPaging({
    articleResourceTypes: "插件",
    isLoadVersionProperty: 1,
  });
  const widgets = res.data.data.dataList;
  widgets.some(async (widget, index) => {
    if (index === 1) return true;
    // widget.exhibitId = widget.exhibitId + '111'
    app = await window.freelogApp.mountWidget(
      widget,
      document.getElementById("freelog-single"),
      null,
      null,
      null,
      "http://localhost:8002"
    );
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
