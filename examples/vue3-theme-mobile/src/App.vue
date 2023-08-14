import { freelogApp } from 'freelog-runtime';
<template>
  <router-view></router-view>
</template>
<script setup>
import {freelogApp} from "freelog-runtime";
console.log(freelogApp)
freelogApp.setViewport({
  width: 1200, //"device-width", // immutable
  height: "device-height", // not supported in browser
  "initial-scale": 3, // 0.0-10.0   available for theme
  "maximum-scale": 5, // 0.0-10.0   available for theme
  "minimum-scale": 1, // 0.0-10.0   available for theme
  "user-scalable": "no", // available for theme
  "viewport-fit": "auto", // not supported in browser
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
