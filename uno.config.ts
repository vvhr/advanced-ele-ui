import { defineConfig, presetAttributify, presetIcons } from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'
export default defineConfig({
  presets: [
    presetWind3({
      // 禁用 preflight 中的 CSS 变量注入
      preflight: false
    }),
    presetAttributify(), // 属性化模式（可选）
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  shortcuts: {
    // 自定义快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center'
  }
})
