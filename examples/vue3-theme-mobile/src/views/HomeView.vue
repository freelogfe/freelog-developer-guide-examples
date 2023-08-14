<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <input type="text" v-model="value">
    <button @click="update">点我试试</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { freelogApp } from "freelog-runtime";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data: ()=>{
   return {value: 1} 
  },
  methods: {
    update() {
      freelogApp.setViewport({
        width: 1200, //"device-width", // immutable
        height: "device-height", // not supported in browser
        "initial-scale": this.value, // 0.0-10.0   available for theme
        "maximum-scale": 5, // 0.0-10.0   available for theme
        "minimum-scale": 1, // 0.0-10.0   available for theme
        "user-scalable": "no", // available for theme
        "viewport-fit": "auto", // not supported in browser
      });
    },
  },
};
</script>
