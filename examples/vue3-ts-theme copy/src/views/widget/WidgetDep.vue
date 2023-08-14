<template>
  <div class="w-100x h-100x p-40 flex-column">
    <div class="f-regular fw-medium flex-column mb-40 pb-20 bb-1">
      <div class="text-align-left f-title-1 mb-10">涉及api：</div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身展品id: </span>
        <span class="f-title-4">freelogApp.getSelfExhibitId()</span>
      </div>
      <div class="text-align-left pl-40 mb-10 flex-row">
        <span class="f-title-3 mr-10">获取自身展品依赖: </span>
        <span class="f-title-4"
          >freelogApp.getExhibitDepTree(freelogApp.getSelfExhibitId(), {
          isContainRootNode: true, })</span
        >
      </div>
    </div>
    <div class="f-regular fw-medium flex-column mb-40 bb-1 pb-20">
      <div class="text-align-left f-title-1 mb-10">效果展示：</div>
      <DepTree :treeData="treeData" />
    </div>
    <!-- <div class="f-regular fw-medium flex-column mb-40 bb-1 pb-20">
      <div class="text-align-left f-title-1 mb-10">设计缺陷或优化思考：</div>
      <span class="f-title-4 pl-40 text-align-left"
        >缺陷：插件需要判断自己是主题还是插件、判断自己是展品还是依赖的资源。当前支持判断，但没有明确，需要明确的方法支持
      </span>
      <span class="f-title-4 pl-40 text-align-left"
        >优化：当前场景不应该需要插件去判断，自动识别，通过唯一的作品id去获取
      </span>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { reactive, ref } from "vue";
import DepTree from "./_components/DepTree.vue";
const treeData = ref([] as any[]);
freelogApp.getSubDep().then((res: any) => {
  if (res.subDep) {
    let str: Array<string> = [];
    res.subDep.forEach((sub: any) => {
      str.push(sub.nid);
    });
    freelogApp
      .getExhibitDepTree(freelogApp.getSelfExhibitId(), {
        isContainRootNode: true,
      })
      .then((res: any) => {
        const self = res.data.data[0];
        const deps = res.data.data[0].dependencies;
        treeData.value = [
          {
            title: self.resourceName + "  (我是自身)",
            key: self.resourceId,
            children: deps.map((item: any) => {
              return {
                title: item.resourceName + "  (我是依赖)",
                key: item.resourceId,
              };
            }),
          },
        ];
      });
  }
});
</script>
