# AeIcon 图标组件

[English](./ICON.md) | [简体中文](./ICON.zh.md)

`AeIcon` 是一个基于 [Iconify](https://iconify.design/) 的动态图标组件，支持 10 万+ 图标库。

## 基本用法

```vue
<template>
  <!-- Iconify 在线图标 -->
  <AeIcon icon="ep:user" />
  <AeIcon icon="mdi:home" :size="24" color="#409eff" />
  
  <!-- 本地 SVG 图标（需要 svg-icon 插件支持） -->
  <AeIcon icon="svg-icon:logo" />
</template>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | `string` | - | 图标名称（必填）。支持 Iconify 格式 `prefix:icon-name` 或本地 svg `svg-icon:name` |
| size | `string \| number` | `16` | 图标大小 |
| color | `string` | - | 图标颜色 |

---

## 自定义图标集

组件支持注册自定义图标集，让您可以使用相同的 `prefix:icon-name` 格式来使用本地 SVG 图标。

### 方式一：安装时注册（推荐）

在安装组件库时注册自定义图标集：

```typescript
// main.ts
import { createApp } from 'vue'
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'

const app = createApp(App)

app.use(AdvancedEleUI, {
  iconCollections: [
    {
      prefix: 'my-icons',
      width: 24,
      height: 24,
      icons: {
        'home': {
          body: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>'
        },
        'user': {
          body: '<circle cx="12" cy="8" r="4"/><path d="M12 14c-6.63 0-12 2.69-12 6v2h24v-2c0-3.31-5.37-6-12-6z"/>'
        },
        'settings': {
          body: '<path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>'
        }
      }
    }
  ]
})

app.mount('#app')
```

然后在组件中使用：

```vue
<template>
  <AeIcon icon="my-icons:home" :size="24" />
  <AeIcon icon="my-icons:user" :size="24" color="#409eff" />
  <AeIcon icon="my-icons:settings" :size="24" />
</template>
```

### 方式二：动态注册

在运行时动态注册图标：

```typescript
import { addIcon, addIconCollection } from 'advanced-ele-ui'

// 添加单个图标
addIcon('my-icons:custom', {
  body: '<path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>',
  width: 24,
  height: 24
})

// 添加图标集
addIconCollection({
  prefix: 'brand',
  width: 24,
  height: 24,
  icons: {
    'logo': { body: '<rect width="24" height="24" rx="4"/>' },
    'icon-a': { body: '<circle cx="12" cy="12" r="10"/>' }
  }
})
```

### 方式三：从 JSON 文件加载

您可以将图标集定义为 JSON 文件：

```json
// src/icons/my-icons.json
{
  "prefix": "my-icons",
  "width": 24,
  "height": 24,
  "icons": {
    "home": { "body": "<path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/>" },
    "user": { "body": "<circle cx=\"12\" cy=\"8\" r=\"4\"/>" }
  }
}
```

然后导入并注册：

```typescript
// main.ts
import { addIconCollection } from 'advanced-ele-ui'
import myIcons from './icons/my-icons.json'

addIconCollection(myIcons)
```

---

## API 参考

### 类型定义

```typescript
/**
 * 图标数据接口
 * 符合 Iconify 图标格式规范
 */
interface IconData {
  /** SVG body (不包含 <svg> 标签) */
  body: string
  /** 图标宽度 (默认 16) */
  width?: number
  /** 图标高度 (默认 16) */
  height?: number
  /** 左偏移 */
  left?: number
  /** 上偏移 */
  top?: number
  /** 旋转角度 (0-3, 每个值代表 90 度) */
  rotate?: number
  /** 水平翻转 */
  hFlip?: boolean
  /** 垂直翻转 */
  vFlip?: boolean
}

/**
 * 图标集接口
 * 用于批量注册图标
 */
interface IconCollection {
  /** 图标集前缀，使用时格式为 prefix:icon-name */
  prefix: string
  /** 图标集合 */
  icons: Record<string, IconData>
  /** 默认宽度 (所有图标) */
  width?: number
  /** 默认高度 (所有图标) */
  height?: number
  /** 最后修改时间 */
  lastModified?: number
}
```

### 函数

| 函数 | 说明 |
|------|------|
| `addIcon(name: string, data: IconData): void` | 添加单个自定义图标 |
| `addIconCollection(collection: IconCollection): boolean` | 添加图标集 |
| `addIconCollections(collections: IconCollection[]): void` | 批量添加多个图标集 |

---

## 将 SVG 文件转换为图标集

以下是一个简单的 Node.js 脚本，用于将本地 SVG 文件转换为图标集：

```typescript
// scripts/generate-icons.ts
import fs from 'fs'
import path from 'path'

const iconsDir = './src/icons'
const outputFile = './src/icons/collection.json'

const icons: Record<string, { body: string }> = {}

fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('.svg'))
  .forEach(file => {
    const content = fs.readFileSync(path.join(iconsDir, file), 'utf-8')
    // 提取 <svg> 标签内的内容
    const match = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
    if (match) {
      const name = file.replace('.svg', '')
      icons[name] = { body: match[1].trim() }
    }
  })

const collection = {
  prefix: 'local',
  width: 24,
  height: 24,
  icons
}

fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2))
console.log(`已生成 ${Object.keys(icons).length} 个图标`)
```

运行：

```bash
npx ts-node scripts/generate-icons.ts
```

---

## 最佳实践

1. **使用描述性前缀**：选择能描述图标集的唯一前缀（如 `brand`、`custom`、`app`）

2. **统一尺寸**：在图标集级别设置默认的 `width` 和 `height`，确保图标尺寸一致

3. **优化 SVG 路径**：在添加到图标集之前，移除不必要的属性并优化路径

4. **按需加载**：对于大型图标集，考虑按需注册图标，而不是一次性全部加载

5. **类型安全**：导入类型以获得更好的 TypeScript 支持：

```typescript
import type { IconData, IconCollection } from 'advanced-ele-ui'

const myIcon: IconData = {
  body: '<path d="..."/>',
  width: 24,
  height: 24
}
```

---

## 相关资源

- [Iconify 图标集](https://icon-sets.iconify.design/) - 浏览 10 万+ 图标
- [Iconify 文档](https://iconify.design/docs/) - 官方 Iconify 文档
- [SVG 路径编辑器](https://yqnn.github.io/svg-path-editor/) - 在线 SVG 路径编辑工具
