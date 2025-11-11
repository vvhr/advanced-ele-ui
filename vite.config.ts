import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    vueJsx({
      // 配置JSX
      transformOn: true,
      mergeProps: false
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
      dts: 'types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      // 只包含 Element Plus 组件，排除所有自定义组件
      dirs: [], // 不扫描任何目录
      resolvers: [ElementPlusResolver()],
      dts: 'types/components.d.ts'
    }),
    dts({
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.vue',
        'src/global.d.ts',
        'types/global-components.d.ts'
      ],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/main.ts',
        'src/App.vue',
        'src/examples/**/*',
        'types/env.d.ts',
        'types/auto-imports.d.ts',
        'types/uno.d.ts',
        'types/components.d.ts' // unplugin-vue-components 生成的文件
      ],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true,
      copyDtsFiles: false,
      tsconfigPath: './tsconfig.json',
      compilerOptions: {
        declarationMap: false
      },
      beforeWriteFile: (filePath, content) => {
        // 在生成的类型文件顶部添加全局类型引用
        if (filePath.endsWith('index.d.ts')) {
          const globalTypes = `/// <reference types="./global" />

`
          return { filePath, content: globalTypes + content }
        }
        return { filePath, content }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, '.')
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/advanced-ele-ui/' : './',
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AdvancedEleUI',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => {
        if (format === 'es') return 'index.js'
        if (format === 'cjs') return 'index.cjs'
        if (format === 'umd') return 'index.umd.js'
        return `index.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'element-plus', '@iconify/vue', '@vueuse/core', 'lodash-es', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@iconify/vue': 'IconifyVue',
          '@vueuse/core': 'VueUse',
          'lodash-es': '_',
          dayjs: 'dayjs'
        },
        exports: 'named',
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || ''
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild'
  }
})
