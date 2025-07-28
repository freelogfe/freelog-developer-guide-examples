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
import {
  freelogApp,
  ResponseDataType,
  PageResult,
  ExhibitInfo,
  DependArticleInfo,
} from "freelog-runtime";
import { ref } from "vue";
import DepTree from "./_components/DepTree.vue";
const imgUrl = ref("");

const treeData = ref([] as any[]);
const exhibitInfo = ref("");
const data = ref([] as any[]);
const show = async (node: any) => {
  // 顶级的展品id，当前资源的父资源的nid，当前资源的资源id
  imgUrl.value = await freelogApp.getExhibitDepFileStream(node.node.exhibitId, {
    nid: node.node.parentNid,
    returnUrl: true,
  });
  console.log(node, imgUrl.value);
  freelogApp
    .getExhibitDepInfo(node.node.exhibitId, {
      articleNids: node.node.parent.node.nid,
    })
    .then((res: ResponseDataType<DependArticleInfo[]>) => {
      exhibitInfo.value = JSON.stringify(res.data.data);
    });
};
const showTree = async (exhibit: any) => {
  // exhibit.data.data.dataList.forEach((exhibit: any) => {
  freelogApp
    .getExhibitById(exhibit.exhibitId, {
      isLoadVersionProperty: 1,
    })
    .then((res: ResponseDataType<ExhibitInfo>) => {
      let tree: any = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const obj: any = res.data.data.versionInfo.dependencyTree;
      const deep: any = [];

      obj.forEach((item: any) => {
        const next = {
          ...item,
          title: item.articleName,
          key: item.articleId,
          children: [],
          parentNid: item.parentNid,
          exhibitId: exhibit.exhibitId,
          nid: item.nid,
        };
        if (item.deep === 1) {
          tree = next;
        } else {
          deep[item.deep - 2] = deep[item.deep] || [];
          deep[item.deep - 2].push(next);
        }
      });
      /**
       * 一层循环，后续循环下一层
       *
       */
      deep.forEach((element: any, index: number) => {
        if (index === 1) {
          tree.children = [...element];
        }
        element.forEach((item: any) => {
          if (deep[index + 1]) {
            deep[index + 1].forEach((next: any) => {
              if (next.parentNid === item.nid) {
                item.children = [...item.children, next];
              }
            });
          }
        });
      });
      console.log(tree, deep);
      treeData.value = [tree];
    });
  // });
};
freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
    isLoadVersionProperty: 1,
  })
  .then((res: ResponseDataType<PageResult<ExhibitInfo>>) => {
    data.value = res.data.data.dataList.filter(
      (item: ExhibitInfo) => item.exhibitName != "收费图片"
    );
  });
</script>
