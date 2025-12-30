# 快速开始

## 安装

推荐使用 pnpm 进行安装：

```bash
pnpm add advanced-ele-ui element-plus
```

## 全局注册

在 `main.ts` 中引入组件库和样式：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/element-plus-beauty.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(AdvancedEleUI)
app.mount('#app')
```
