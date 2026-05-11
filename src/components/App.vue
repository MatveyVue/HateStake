<template>
<div v-if="showAppLoader" class="app-loader">
  <img class="app-loader-logo" src="./Preloader.jpg" alt="Cap logo">
  <div class="app-loader-bar">
    <div class="app-loader-fill"></div>
  </div>
</div>
<RouterView v-slot="{ Component }">
  <KeepAlive include="home,market,profile">
    <component :is="Component" />
  </KeepAlive>
</RouterView>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const showAppLoader = ref(true)

onMounted(() => {
  setTimeout(() => {
    showAppLoader.value = false
  }, 5000)
})
</script>
