<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.exhibitName" @click="show(item)">
              <div class="h-80 over-h">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="w-100x flex-column-center h-400 over-h mt-40">
      <span v-if="!imgUrl" class="f-title-3">点击上面图片可在这展示</span>
      <img :src="imgUrl" alt="" v-else class="h-100x" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref } from "vue";
interface DataItem {
  exhibitName: string;
  exhibitTitle: string;
}
const data = ref([] as DataItem[]);
const imgUrl = ref("");
// 获取展品列表
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
  })
  .then((res: any) => {
    let arr = [] as string[];

    res.data.data.dataList.forEach((element: any) => {
      arr.push(element.exhibitId);
    });
    // 查询是否拥有授权
    freelogApp.getExhibitAuthStatus(arr.join(",")).then((auth: any) => {
      data.value = res.data.data.dataList.map((item: any) => {
        auth.data.data.some((au: any) => {
          if (au.exhibitId === item.exhibitId) {
            item.auth = au;
            return true;
          }
          return false;
        });
        return item;
      });
    });
  });
const show = async (data: any) => {
  if (data.auth.isAuth) {
    imgUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
      returnUrl: true,
    });
  } else {
    console.log(data.exhibitId, 9999)
    // 没有授权
    freelogApp
      .addAuth(data.exhibitId, {
        immediate: true,
      })
      .then(async (result: any) => {
        if (result.status === freelogApp.resultType.SUCCESS) {
          imgUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
            returnUrl: true,
          });
        }
      });
  }
};
</script>
