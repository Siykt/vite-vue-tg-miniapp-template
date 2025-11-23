<script setup lang="ts">
  import { ref } from 'vue'

  const appVersion = ref(APP_VERSION)
</script>

<template>
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <img src="/android-chrome-512x512.png" alt="TGMiniApp" className="w-20 h-20" />
    <h1 className="text-2xl font-bold">TG MiniApp</h1>
    <div className="flex flex-col gap-2 justify-center items-center">
      <p className="text-sm text-gray-500">{{ $t('home.description') }}</p>
      <div className="flex gap-2">
        <p className="text-sm text-gray-500">
          {{ $t('home.author') }}:
          <a
            href="https://github.com/Siykt"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 ml-1"
          >
            Siykt
          </a>
        </p>
        <p className="text-sm text-gray-500">
          {{ $t('home.email') }}:
          <a
            href="mailto:cnsiykt@163.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 ml-1"
          >
            cnsiykt@163.com
          </a>
        </p>
        <p className="text-sm text-gray-500">{{ $t('home.version') }}: {{ appVersion }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  // something
</style>
