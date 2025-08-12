<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.exhibitName" @click="show(item)">
              <div class="h-80 over-h cur-pointer">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
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
import {
  freelogApp,
  ExhibitInfo,
  ResponseDataType,
  PageResult,
} from "freelog-runtime";
import { ref } from "vue";

const data = ref([] as ExhibitInfo[]);
const imgUrl = ref("");
const exhibitInfo = ref("");
console.log(freelogApp.getSelfDep())
freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
    isLoadVersionProperty: 1,
  })
  .then((res: ResponseDataType<PageResult<ExhibitInfo>>) => {
    const exhibitIds = res.data.data.dataList.map((item: ExhibitInfo) => {
      return item.exhibitId;
    });
    freelogApp
      .getExhibitListById({
        exhibitIds: exhibitIds.join(","),
      })
      .then((res: ResponseDataType<ExhibitInfo[]>) => {
        console.log(res.data.data);
        data.value = res.data.data.filter(
          (item: ExhibitInfo) => item.exhibitName != "收费图片"
        );
      });
  });

const show = async (data: ExhibitInfo) => {
  if (data.articleInfo.resourceType.includes("照片")) {
    imgUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
      returnUrl: true,
    });
    freelogApp
      .getExhibitById(data.exhibitId, {
        isLoadVersionProperty: 1,
      })
      .then((res: any) => {
        exhibitInfo.value = JSON.stringify(res.data.data);
      });
    console.log(
      freelogApp.getWechatShareURL(),
      data.coverImages[0],
      {
        title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
        desc: "分享描述", // 分享描述
        imgUrl: data.coverImages[0], // 分享图标
        success: () => {
          console.log("分享成功");
        },
      },
      {
        title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
        imgUrl: data.coverImages[0], // 分享图标
        success: () => {
          console.log("分享成功");
        },
      }
    );
    freelogApp
      .updateWechatShare(
        {
          title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
          desc: "分享描述", // 分享描述
          imgUrl: "https://image.freelog.com/avatar/50050", // data.coverImages[0], // 分享图标
          success: () => {
            console.log("分享成功");
          },
        },
        {
          title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
          imgUrl: "https://image.freelog.com/avatar/50050", // data.coverImages[0], // 分享图标
          success: () => {
            console.log("分享成功");
          },
        }
      )
      .then(() => {
        console.log("调用成功");
      })
      .catch(() => {
        console.log("分享调用失败");
      });
  }
};
</script>
