<div align="center">
  <h1>🎨 Advanced Element UI</h1>
  <p>基于 Vue 3 + Element Plus 的高级组件库</p>

  [![npm version](https://img.shields.io/npm/v/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![npm downloads](https://img.shields.io/npm/dm/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![license](https://img.shields.io/npm/l/advanced-ele-ui.svg?style=flat-square)](https://github.com/vvhr/advanced-ele-ui/blob/main/LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)](https://www.typescriptlang.org/)
  [![Vue](https://img.shields.io/badge/Vue-3.4-green?style=flat-square)](https://vuejs.org/)
</div>

---

## ✨ 特性

- 🚀 **开箱即用** - 基于 Element Plus，无缝集成到 Vue 3 项目
- 📝 **高级表单** - 基于数据驱动表单渲染，支持动态表单、自动校验、嵌套表格等复杂场景
- 📊 **强大表格** - 基于数据驱动表格渲染，可编辑表格、多种列类型、金额格式化、敏感信息脱敏
- 🎨 **丰富图标** - 集成 Iconify，支持 10 万+ 图标库
- 💪 **TypeScript** - 完整的类型定义，提供良好的开发体验
- 🎯 **按需引入** - 支持 Tree Shaking，减小打包体积
- 📦 **轻量级** - 核心代码精简，依赖合理


## 📚 介绍
Element Plus 是一个非常优秀的基础组件库，相比其他Vue3组件库，他最大的特点就是没有过度包装，非常适合二次开发。
本项目的`ZwForm`及`ZwTable`组件完全基于配置化数据来渲染组件，其目的是将页面、组件、业务代码解耦，开发者仅需关心组件的配置，即可快速实现业务需求。
传统表单开发是"写代码画表单"，数据驱动表单开发是"写配置生成表单"——前者直观但重复劳动多，后者高效但需要理解配置规则。

---

## 📦 安装

### 使用 npm
```bash
npm install advanced-ele-ui
```

### 使用 yarn
```bash
yarn add advanced-ele-ui
```

### 使用 pnpm
```bash
pnpm add advanced-ele-ui
```

---

## 🔧 快速开始

### 完整引入

在 `main.ts` 中引入所有组件：

```typescript
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

/** 引入 AdvancedEleUI 组件库 */
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(AdvancedEleUI)
app.mount('#app')
```

### 按需引入

只引入需要的组件：

```typescript
import { ZwForm, ZwTable, ZwIcon } from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'
```

---

## 📚 组件介绍

### 📝 ZwForm - 高级表单组件

功能强大的表单组件，支持多种表单控件和复杂场景。

**核心特性：**
- ✅ 完全配置化驱动表单组件渲染，支持动态表单、自动校验、嵌套表格等复杂场景
- ✅ 支持Element Plus所有输入性组件，额外扩展了可编辑表格组件、上传组件、富文本组件等
- ✅ 内置自动校验规则（必填、邮箱、手机号等），兼容自定义校验规则
- ✅ 动态表单项（显示/隐藏、禁用/启用），组件所有属性及事件可支持动态化
- ✅ 灵活的布局配置（栅格布局），所有组件都由el-col包裹，可自定义el-col属性
- ✅ 丰富的插槽支持，提供自定义组件插槽、组件自身插槽、组件前后置通用插槽等

---

### 📊 ZwTable - 高级表格组件

功能丰富的表格组件，支持多种列类型和行内编辑。

**核心特性：**
- ✅ 完全配置化驱动表格组件渲染
- ✅ 支持Element Plus的Table组件所有功能
- ✅ 内置多种列类型（索引、选择、操作、字典、日期、金额、敏感信息）
- ✅ 支持行内编辑模式，且可校验
- ✅ 内置分页器

---

### 🎨 Icon - 图标组件

基于 Iconify 的图标组件，支持海量图标库。

**核心特性：**
- 🎨 支持 Iconify 全部图标库（10 万+ 图标）
- 📏 灵活的尺寸设置
- 🌈 自定义颜色
- ⚡ 按需加载，性能优秀

**图标资源：**
- Element Plus 图标：`ep:icon-name`
- Material Design：`mdi:icon-name`
- Font Awesome：`fa:icon-name`
- 更多图标库：访问 [Iconify](https://icon-sets.iconify.design/)

---

## 🔌 依赖要求

本组件库需要以下依赖：

| 依赖           | 版本      | 说明                                       |
|--------------|---------|------------------------------------------|
| Vue          | ^3.2.0  | Vue 3 框架，本项目并未使用vue3.4的新特性，但不建议较老版本的vue3 |
| Element Plus | ^2.11.0 | UI 组件库，建议始终保持较新的element-plus版本           |

**注意：** Vue 和 Element Plus 需要在项目中单独安装，它们是 `peerDependencies`。

---

## 📖 完整文档

更多详细文档和示例，请访问：

- [在线演示](https://vvhr.github.io/advanced-ele-ui)
- [GitHub 仓库](https://github.com/vvhr/advanced-ele-ui)
- [更新日志](./CHANGELOG.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。

---

## 💖 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [Iconify](https://iconify.design/) - 统一的图标框架
- [VueUse](https://vueuse.org/) - Vue 组合式 API 工具集

---

## 📞 联系方式

- 作者：vvhr
- 邮箱：vvhr_anen@163.com
- GitHub：[@vvhr](https://github.com/vvhr)

---

<div align="center">
  <sub>Built with ❤️ by vvhr</sub>
</div>
