<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <div style="font-size: 50px">我是插件数字展示：</div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { reactive } from "vue";
freelogApp.getSubDep().then((res: any) => {
  if (res.subDep) {
    let str: Array<string> = [];
    res.subDep.forEach((sub: any) => {
      str.push(sub.nid);
    });
    console.log(res, freelogApp.getSelfExhibitId())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    freelogApp.getExhibitDepInfo(freelogApp.getSelfExhibitId(), str.join(",")).then((res)=>{
      console.log(res)
    });
  }
});
</script>
