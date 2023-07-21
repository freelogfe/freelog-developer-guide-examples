<template>
  <a-modal
    :visible="props.visible"
    :width="800"
    title="按键设置"
    @ok="handleOk"
    @cancel="cancel"
    okText="保存"
    cancelText="取消"
  >
    <a-tabs v-model:activeKey="activeKey" @change="selectedKey = ''">
      <a-tab-pane key="1" tab="玩家1">
        <div class="flex-column pr-15">
          <div class="flex-row mb-10 space-between">
            <div class="fc-less">双击按键值进行设置</div>
            <a-button type="primary" class="mr-20 w-100" @click="setDefault(1)"
              >恢复默认</a-button
            >
          </div>
          <template v-for="key in key1s" :key="key">
            <div class="flex-row bb-1 py-8">
              <div class="w-80 text-align-right mr-100 shrink-0">
                {{ key }}：
              </div>
              <a-input
                placeholder="请按下想要设置的键"
                :value="inputValue"
                v-if="selectedKey === key && activeKey == '1'"
                @keyup="(e:KeyboardEvent)=>pressChange(e,key)"
              />
              <div
                class="brs-4 b-1 px-10 py-4 cur-pointer"
                v-else
                @click="setSelectKey(key)"
              >
                {{ p1Keys[key] }}
              </div>
            </div>
          </template>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="玩家2" force-render>
        <div class="flex-column pr-15">
          <div class="flex-row mb-10 space-between">
            <div class="fc-less">双击按键值进行设置</div>
            <a-button type="primary" class="mr-20 w-100" @click="setDefault(2)"
              >恢复默认</a-button
            >
          </div>
          <template v-for="key in key2s" :key="key">
            <div class="flex-row bb-1 py-8">
              <div class="w-80 text-align-right mr-100 shrink-0">
                {{ key }}：
              </div>
              <a-input
                placeholder="请按下想要设置的键"
                :value="inputValue"
                v-if="selectedKey === key && activeKey == '2'"
                @keyup="(e:KeyboardEvent)=>pressChange(e,key)"
              />
              <div
                class="brs-4 b-1 px-10 py-4 cur-pointer"
                v-else
                @click="setSelectKey(key)"
              >
                {{ p2Keys[key] }}
              </div>
            </div>
          </template>
        </div></a-tab-pane
      >
    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";

import { freelogApp } from "freelog-runtime";
const activeKey = ref("1");
const selectedKey = ref("");
const inputValue = ref("");

const props = defineProps<{
  visible: boolean;
  p1Keys: any;
  p2Keys: any;
}>();
const p1: any = {
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  A: "KeyK",
  B: "KeyJ",
  C: "KeyI",
  D: "KeyU",
  SELECT: "Digit2",
  START: "Digit1",
};
const p2: any = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  A: "Numpad2",
  B: "Numpad1",
  C: "Numpad5",
  D: "Numpad4",
};
const $emit = defineEmits(["cancel", "save"]);
const key1s = ref(Object.keys(p1));
const key2s = ref(Object.keys(p2));
const p1Keys = reactive({ ...props.p1Keys });
const p2Keys = reactive({ ...props.p2Keys });
const setSelectKey = (key: string) => {
  selectedKey.value = key;
};
const setDefault = (value: number) => {
  if (value === 1) {
    Object.keys(p1Keys).forEach((key: string) => {
      p1Keys[key] = p1[key];
    });
  }
  if (value === 2) {
    Object.keys(p2Keys).forEach((key: string) => {
      p2Keys[key] = p2[key];
    });
  }
  inputValue.value = "";
  selectedKey.value = "";
};
const pressChange = (e: KeyboardEvent, key: string) => {
  if (activeKey.value === "1") {
    const exist = Object.keys(p1Keys).some((key2: string) => {
      if (p1Keys[key2] === e.code) {
        return true;
      }
    });
    if (exist) {
      message.error({
        content: "玩家1按键重复",
        duration: 2,
      });
      inputValue.value = "";
      return;
    }
    p1Keys[key] = e.code;
  } else {
    const exist = Object.keys(p2Keys).some((key2: string) => {
      if (p2Keys[key2] === e.code) {
        return true;
      }
    });
    if (exist) {
      message.error({
        content: "按键重复",
        duration: 2,
      });
      inputValue.value = "";
      return;
    }
    p2Keys[key] = e.code;
  }
  inputValue.value = "";
  selectedKey.value = "";
};
const userData = ref({} as any);
let rawData: any = {};
// 根据自定义的key获取 存储的用户数据，主题、不同的插件与插件 保存数据都是隔离的
freelogApp.getUserData("nesKeys").then((data: any) => {
  rawData = data || {};
  userData.value = data || {};
});

const setData = async (key: string, value: any) => {
  await freelogApp.setUserData("nesKeys", {
    ...rawData,
    ...value,
  });
};

const handleOk = async (e: MouseEvent) => {
  setData("nesKeys", {
    p1Keys: { ...p1Keys },
    p2Keys: { ...p2Keys },
  });
  $emit("save");
};
const cancel = (e: MouseEvent) => {
  $emit("cancel");
};
</script>
