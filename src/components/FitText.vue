<script setup lang="ts">
  import { useMutationObserver } from '@vueuse/core'
  import type { FittyInstance } from 'fitty'
  import fitty from 'fitty'
  import type { StyleValue } from 'vue'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { isDev } from '@/lib/is'

  export interface FitTextProps {
    sizes?: number[] | number
    multiLine?: boolean
    style?: StyleValue
    textClass?: string
    autoUpdate?: boolean
  }

  const props = withDefaults(defineProps<FitTextProps>(), {
    sizes: () => [8, 12],
    autoUpdate: true,
  })

  const smallSize = computed(() => (Array.isArray(props.sizes) ? props.sizes[0] : props.sizes))
  const isSmallSize = ref(false)
  const fitTextInnerRef = ref<HTMLElement | null>(null)
  const fittyInstance = ref<FittyInstance | null>(null)

  function createFittyInstance() {
    if (!fitTextInnerRef.value) return
    const [minSize, maxSize] = Array.isArray(props.sizes) ? props.sizes : [props.sizes, props.sizes]
    fittyInstance.value = fitty(fitTextInnerRef.value, {
      minSize,
      maxSize,
      multiLine: props.multiLine ?? false,
      observeMutations: false as unknown as undefined,
    })
  }

  function updateContent() {
    if (!fittyInstance.value) return
    fittyInstance.value.fit({ sync: true })
    isSmallSize.value = props.multiLine
      ? false
      : window.getComputedStyle(fittyInstance.value.element).fontSize === `${smallSize.value}px`
  }

  const options = computed(() =>
    props.autoUpdate ? { childList: true, subtree: true, characterData: true } : undefined
  )
  useMutationObserver(fitTextInnerRef, updateContent, options.value)

  onMounted(async () => {
    try {
      createFittyInstance()
      await document.fonts.ready
      updateContent()
    } catch (error) {
      if (isDev()) console.warn('FitText mounted error:', error)
    }
  })

  onUnmounted(() => {
    // 可能有动画，需要延迟销毁
    if (fittyInstance.value) {
      setTimeout(() => {
        fittyInstance.value?.freeze()
        fittyInstance.value?.unsubscribe()
      }, 300)
    }
  })

  watch(
    () => [props.sizes, props.multiLine],
    async ([sizes, multiLine], [oldSizes, oldMultiLine]) => {
      if (sizes.toString() === oldSizes.toString() && multiLine === oldMultiLine) return
      fittyInstance.value?.freeze()
      fittyInstance.value?.unsubscribe()
      createFittyInstance()
      await nextTick()
      updateContent()
    }
  )

  defineExpose({ updateContent })
</script>

<template>
  <div class="fit-text" :class="{ 'is-small-size': isSmallSize }">
    <div ref="fitTextInnerRef" class="fit-text-inner" :class="textClass" :style="style">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .fit-text {
    width: 100%;
    overflow: hidden;

    &-inner {
      display: inline-block;
      white-space: nowrap;
    }

    &.is-small-size {
      width: fit-content;
      overflow: inherit;
    }
  }
</style>
