<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.exhibitName" @click="show(item.exhibitId)">
              <div class="h-80 over-h cur-pointer">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <a-button type="primary" class="mt-20" v-if="imgUrl" @click="copyUrl"
      >复制当前图片的分享链接</a-button
    >

    <div class="w-100x flex-column-center h-300 over-h mt-30">
      <span v-if="!imgUrl" class="f-title-3">点击上面图片可在这展示</span>
      <img :src="imgUrl" alt="" v-else class="h-100x" />
    </div>
    <div class="w-100x flex-column-center h-300 over-h mt-30">
      <span class="f-title-3">展品信息</span>
      <div>{{ exhibitInfo }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import {
  freelogApp,
  GetExhibitListByPagingResult,
  ExhibitInfo,
  GetExhibitListByIdResult,
} from "freelog-runtime";
import { ref } from "vue";
import { message } from "ant-design-vue";

interface DataItem {
  exhibitName: string;
  exhibitTitle: string;
}
const data = ref([] as DataItem[]);
const imgUrl = ref("");
const exhibitInfo = ref<any>("");
const route = useRoute();
console.log(route.params, 3333);
const copyUrl = () => {
  const url = freelogApp.getShareUrl(
    JSON.parse(exhibitInfo.value).exhibitId,
    "content"
  );
  console.log(url, JSON.parse(exhibitInfo.value));
  let inputDom = document.createElement("textarea"); // js创建一个文本框
  document.body.appendChild(inputDom); //将文本框暂时创建到实例里面
  inputDom.value = url; //将需要复制的内容赋值到创建的文本框中
  inputDom.select(); //选中文本框中的内容
  inputDom.focus();
  document.execCommand("copy"); //执行复制操作
  document.body.removeChild(inputDom); //最后移出
  message.success("复制成功，快去分享吧！");
};
freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
  })
  .then((res: GetExhibitListByPagingResult) => {
    const exhibitIds = res.data.data.dataList.map((item: ExhibitInfo) => {
      return item.exhibitId;
    });
    freelogApp
      .getExhibitListById({
        exhibitIds: exhibitIds.join(","),
      })
      .then((res: GetExhibitListByIdResult) => {
        data.value = res.data.data.filter(
          (item: ExhibitInfo) => item.exhibitName != "收费图片"
        );
      });
  });

const show = async (exhibitId: string) => {
  imgUrl.value = await freelogApp.getExhibitFileStream(exhibitId, {
    returnUrl: true,
  });
  freelogApp.getExhibitById(exhibitId).then((res) => {
    exhibitInfo.value = JSON.stringify(res.data.data);
  });
};
if (route.params.id) {
  show(route.params.id as string);
}
</script>
