import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * 自动生成全局组件类型声明文件
 * 从 src/index.ts 中提取组件导出，生成 dist/global.d.ts
 */
async function generateGlobalDts() {
  const indexFile = resolve(__dirname, 'src/index.ts')
  const targetFile = resolve(__dirname, 'dist/global.d.ts')

  // 读取 src/index.ts 并提取组件导出
  const indexContent = readFileSync(indexFile, 'utf-8')

  // 匹配 // Export components 后面的 export { ... } 语句
  const exportMatch = indexContent.match(/\/\/\s*Export components\s*\nexport\s*{\s*([^}]+)}/)

  if (!exportMatch) {
    console.warn('⚠ Could not find component exports in src/index.ts')
    return
  }

  // 提取组件名称 (AeForm, AeIcon, etc.)
  const components = exportMatch[1]
    .split(',')
    .map(item => {
      const match = item.trim().match(/as\s+(\w+)/)
      return match ? match[1] : null
    })
    .filter(Boolean)

  if (components.length === 0) {
    console.warn('⚠ No components found in exports')
    return
  }

  // 生成导入语句
  const imports = `import type { ${components.join(', ')} } from './index'`

  // 生成组件声明
  const declarations = components.map(name => `    ${name}: typeof ${name}`).join('\n')

  const content = `// GlobalComponents for Volar
${imports}

declare module 'vue' {
  export interface GlobalComponents {
${declarations}
  }
}

export {}
`

  writeFileSync(targetFile, content, 'utf-8')
  console.log(`✓ Created dist/global.d.ts with ${components.length} components`)
}

/**
 * 编译独立的 element-plus-beauty.less 文件
 */
async function compileBeautyStyles() {
  const lessFile = resolve(__dirname, 'src/styles/element-plus-beauty.less')
  const outputFile = resolve(__dirname, 'dist/element-plus-beauty.css')

  try {
    // 使用 lessc 命令编译 less 文件
    await execAsync(`npx lessc ${lessFile} ${outputFile}`)
    console.log('✓ Compiled element-plus-beauty.less to dist/element-plus-beauty.css')
  } catch (error) {
    console.error('✗ Failed to compile element-plus-beauty.less:', error)
  }
}

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
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue', 'src/global.d.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/main.ts',
        'src/App.vue',
        'src/examples/**/*',
        'types/env.d.ts',
        'types/auto-imports.d.ts',
        'types/uno.d.ts',
        'types/components.d.ts',
        'types/global-components.d.ts' // 排除，手动处理
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
      afterBuild: async () => {
        await generateGlobalDts()
        await compileBeautyStyles()
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
