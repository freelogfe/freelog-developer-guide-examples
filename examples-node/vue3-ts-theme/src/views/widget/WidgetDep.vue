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
      <dep-tree :treeData="treeData" />
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
import { freelogApp, DependencyNodeInfo } from "freelog-runtime";
import { ref } from "vue";
import type { TreeProps } from "ant-design-vue";

type TreeNode = TreeProps["treeData"];
const treeData = ref<TreeNode>([]);
console.log(freelogApp.getSelfProperty());
console.log(freelogApp.getSelfPropertyForTheme());
console.log(freelogApp.getSelfDepForTheme());
Promise.all([
  freelogApp.getSelfProperty(),
  freelogApp.getSelfPropertyForTheme(),
  freelogApp.getSelfDepForTheme(),
]).then((res) => {
  console.log(res);
});
freelogApp.getSelfDep().then((res) => {
  // 获取自身展品依赖
  const subData: DependencyNodeInfo[] = res.data.data;
  treeData.value = [
    {
      title: "  (我是自身)",
      key: "1",
      children: subData.map((item: DependencyNodeInfo) => {
        return {
          title: item.articleName + "  (我是依赖)",
          key: item.articleId,
        };
      }),
    },
  ];
});
</script>
