<template>
  <div class="flex items-center flex-col gap-2 text-white">
    <img
      src="@/assets/images/loading.png"
      alt="Loading"
      class="w-8 h-8 animate-spin"
      :style="{ width: size + 'px', height: size + 'px' }"
    />
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
  export interface LoadingIndicatorProps {
    text?: string
    size?: number
  }

  defineProps<LoadingIndicatorProps>()
</script>

<style scoped></style>
