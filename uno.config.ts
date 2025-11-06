import { defineConfig, presetAttributify, presetIcons, presetWind } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(), // Tailwind / Windi CSS 预设
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
