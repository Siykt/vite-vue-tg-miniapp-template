<script setup lang="ts">
  import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster :expand="false" rich-colors position="top-center" />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="less"></style>
