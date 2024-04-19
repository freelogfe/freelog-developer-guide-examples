<template>
  <div class="home p-40 y-auto h-100x">
    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="item.exhibitName" @click="showTree(item)">
            <div class="h-80 over-h cur-pointer">
              <img class="h-100x" :src="item.coverImages[0]" alt="" />
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <div class="f-title-3 m-20">点击卡片展示依赖树</div>
    <DepTree :treeData="treeData" @select="show" />
    <div class="w-100x flex-column-center over-h">
      <span v-if="!imgUrl" class="f-title-3">点击子节点展示图片</span>
      <img :src="imgUrl" alt="" v-else class="w-100x" />
    </div>
    <div class="w-100x flex-column-center h-300 over-h mt-30">
      <span class="f-title-3">依赖信息</span>
      <div class="mt-20">{{ exhibitInfo }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref } from "vue";
import DepTree from "./_components/DepTree.vue";
const imgUrl = ref("");

const treeData = ref([] as any[]);
const exhibitInfo = ref("");
const data = ref([] as any[]);
const show = async (node: any) => {
  // 顶级的展品id，当前资源的父资源的nid，当前资源的资源id
  imgUrl.value = await freelogApp.getExhibitDepFileStream(node.node.exhibitId, {
    parentNid: node.node.parent.node.nid,
    subArticleId: node.node.resourceId,
    returnUrl: true,
  });
  freelogApp
    .getExhibitDepInfo(node.node.exhibitId, {
      articleNids: node.node.parent.node.nid,
    })
    .then((res) => {
      exhibitInfo.value = JSON.stringify(res.data?.data);
    });
};
const showTree = async (exhibit: any) => {
  // exhibit.data.data.dataList.forEach((exhibit: any) => {
  freelogApp
    .getExhibitDepTree(exhibit.exhibitId, {
      // isContainRootNode: false,
      maxDeep: 10,
    })
    .then((res: any) => {
      const obj = { ...res.data.data[0], exhibitId: exhibit.exhibitId };
      obj.title = obj.resourceName;
      obj.key = obj.resourceId;
      function deep(data: any, top: any) {
        if (data?.length) {
          data.forEach((item: any) => {
            const next = {
              ...item,
              title: item.resourceName,
              key: item.resourceId,
              exhibitId: exhibit.exhibitId,
            };
            top.children = top.children || [];
            top.children.push(next);
            deep(next.dependencies, next);
          });
        }
      }
      deep(res.data.data[0].dependencies, obj);
      treeData.value = [obj];
    });
  // });
};
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
  })
  .then((res: any) => {
    data.value = res.data.data.dataList.filter(
      (item: any) => item.exhibitName != "收费图片"
    );
  });
</script>
