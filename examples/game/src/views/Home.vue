<template>
  <img alt="Vue logo" src="../assets/logo.png" />
  <button @click="reload">reload</button>
  <button @click="show">show window</button>
  <HelloWorld msg="Vue.js Demo" @close="close"> </HelloWorld>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  created() {
    console.log('vue2.0写法 created');
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    reload() {
      window.data = '23223232323'
      window.location.reload()
    },
    show(){
      console.log(window.data)
    },
    
    close() {
      console.log('close');
    },
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
