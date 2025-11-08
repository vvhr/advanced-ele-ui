import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

// 用于构建示例网站的配置
export default defineConfig({
    plugins: [
        UnoCSS(),
        vue(),
        vueJsx({
            transformOn: true,
            mergeProps: false
        }),
        AutoImport({
            imports: ['vue', '@vueuse/core'],
            resolvers: [ElementPlusResolver()],
            dts: 'src/types/auto-imports.d.ts',
            eslintrc: {
                enabled: true,
                filepath: '.eslintrc-auto-import.json',
                globalsPropValue: true
            }
        }),
        Components({
            dirs: [],
            resolvers: [ElementPlusResolver()],
            dts: 'src/types/components.d.ts'
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '~': resolve(__dirname, '.')
        }
    },
    base: '/advanced-ele-ui/',
    build: {
        outDir: 'dist-demo',
        emptyOutDir: true
    }
})
