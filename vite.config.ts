import { defineConfig, loadEnv, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const plugins: PluginOption[] = [nodePolyfills(), vue(), tailwindcss(), vueJsx()]

  if (mode === 'analysis' && command === 'build') {
    plugins.push(
      visualizer({
        open: true,
        filename: `dist/analysis.html`,
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      global: 'globalThis',
      APP_VERSION: JSON.stringify(env.APP_VERSION),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'jse/index-[name]-[hash].js',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
            tonconnect: ['@tonconnect/ui'],
            ton: ['@ton/core', '@ton/ton'],
          },
        },
      },
      target: 'es2015',
    },
  }
})
