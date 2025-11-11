<div align="center">

[English](./README.md) | 简体中文

  <h1> Advanced Element UI</h1>
  <p>基于 Vue 3 + Element Plus 的面向低代码、AI的高级组件库</p>
  <img alt="logo" height="154px" src="https://image.howcat.cn/thumbnails/5d0a2d8352a09debab8f8d233a8fc67d.png" title="logo" width="400px"/>

  [![npm version](https://img.shields.io/npm/v/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![npm downloads](https://img.shields.io/npm/dt/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![license](https://img.shields.io/npm/l/advanced-ele-ui.svg?style=flat-square)](https://github.com/vvhr/advanced-ele-ui/blob/main/LICENSE)
  [![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square)](https://pnpm.io/)
  [![Vue](https://img.shields.io/badge/Vue-≥3.2.0-green?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![Element Plus](https://img.shields.io/badge/Element%20Plus-≥2.9.0-409eff?style=flat-square)](https://element-plus.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

  <br/>

  <h3>
    <a href="https://vvhr.github.io/advanced-ele-ui" target="_blank">📱 在线演示</a>
    ·
    <a href="#QuickStart">快速开始</a>
    ·
    <a href="./CHANGELOG.zh.md">更新日志</a>
    ·
    <a href="#Roadmap">更新计划</a>
  </h3>
</div>

---
> Warning： 项目正处于前期建设、高速迭代过程中，可能存在bug，建议您持续关注本仓库，暂时请勿用于生产环境，保持更新，本项目将在近期确定第一个正式版本。
> 2025.11.10

## Introduction
Advanced Element UI 是一个基于 Element Plus 深度封装的高级组件库，专注于提升中后台系统的开发效率。
Element Plus 作为 Vue 3 生态中最受欢迎的 UI 组件库之一，其最大优势在于**保持原生、不过度封装**，这为二次开发提供了极大的灵活性。基于这一特点，我们打造了 Advanced Element UI，通过**配置化驱动**的方式，让复杂的表单和表格开发变得简单高效。
本项目的 `AeForm` 和 `AeTable` 组件完全基于配置数据驱动渲染，实现了**页面、组件、业务逻辑的完全解耦**。开发者只需关注配置项，即可快速构建复杂的业务场景，大幅减少重复代码，提升开发效率。

## Features
- **开箱即用**：基于 Element Plus，无缝集成到 Vue 3 项目
- **风格统一**：二次封装的组件在组件属性和样式上遵循 Element Plus 的风格
- **数据驱动**：所有组件都遵循**由配置驱动渲染**的核心思想，拒绝硬编码
- **丰富图标**：集成 Iconify，支持 10 万+ 图标库
- **类型定义**：完整的类型定义和注释，提供良好的开发体验
- **自由扩展**：`AeForm` 和 `AeTable` 提供了注册函数，可自行注册任何遵循 Element Plus 属性风格的组件。

---

## Install

1. 确保您的项目已安装 Vue 3 和 Element Plus
```bash
// use npm
npm install element-plus --save

// use yarn
yarn add element-plus

// use pnpm
pnpm install element-plus
```

> 中国大陆用户可使用镜像加速: npm config set registry https://registry.npmmirror.com


2. 安装AdvancedEleUI 组件库
```bash
// use npm
npm install advanced-ele-ui

// use yarn
yarn add advanced-ele-ui

// use pnpm
pnpm add advanced-ele-ui
```

---

## QuickStart

### 完整引入

在 `main.ts` 中引入所有组件：

```typescript
import { createApp } from 'vue'

/** 引入 Element Plus */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** 引入 AdvancedEleUI 组件库 */
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(AdvancedEleUI)
app.mount('#app')
```

#### TypeScript 全局组件类型支持

如果你使用 TypeScript，为了让 IDE 能够识别全局注册的组件，需要添加类型声明。

**方式一：在 `tsconfig.json` 中添加**

```json
{
  "compilerOptions": {
    "types": ["advanced-ele-ui/global"]
  }
}
```

**方式二：在类型声明文件中添加**

在 `src/env.d.ts` 或 `src/types/global.d.ts` 中添加：

```typescript
/// <reference types="advanced-ele-ui/global" />
```

配置完成后，重启 IDE，即可在 Vue 文件中直接使用组件并获得完整的类型提示：

```vue
<template>
  <!-- ✅ IDE 能够识别组件并提供智能提示 -->
  <AeTable :columns="columns" :data="data" />
  <AeForm :model="formModel" :schemas="schemas" />
</template>
```

### 按需引入

只引入需要的组件：

```typescript
import { AeForm, AeTable, AeIcon, AeEditor } from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'
```

---

## Component
- ✅ `AeForm`: 高级表单组件: 基于数据驱动的功能强大的表单组件，支持多种表单控件，专注于解决数据联动，动态属性的复杂场景。
- ✅ `AeTable`: 高级表格组件: 基于数据驱动的功能丰富的表格组件，支持多种列类型和行内编辑。
- ✅ `AeIcon`: 动态图标组件: 基于 [Iconify](https://icon-sets.iconify.design/)，支持 10 万+ 图标库动态渲染。
- ✅ `AeEditor`: 富文本组件: 基于 [AiEditor](https://aieditor.dev/docs) 二次封装的富文本组件，支持 AI 助手功能。
- ✅ `AeUpload`: 上传组件: 原生实现的功能丰富的上传组件，组件本身不控制上传，完全交由您实现上传请求，组件专注于数据和样式。

---

## Roadmap

### 🎯 近期计划 (v1.0.0)
- ⬜ 发布第一个正式版本
- ⬜ `AeForm`: 将完善 `type`: `desc` 模式, 常用于详情页信息展示，满足您希望以类似Word表单的样式展示表单的想法。
- ⬜ `AeForm`: 将完善 `designable`: `true` 模式, 该模式将用于在`AeFormDesginer`中实现表单工具栏、拖拽、选中等功能，计划采用非入侵式设计，只提供钩子函数，不直接编入`AeForm`组件内部。
- ⬜ `AeTable`: 完善 `editable`: `true` 时, 渲染可编辑组件的策略，将引入更多组件类型，并支持与`AeForm`的按需注册组件的功能。
- ⬜ 构建 `advanced-ele-ui-docs` 组件库文档项目，以便为您提供更好的使用指南！

### 🔮 中期计划 (v1.x)
- ⬜ `AeDialog`: 增强对话框组件，`el-dialog`目前在样式和功能上较为粗糙，我们将封装一个更美观且可控的对话框组件。
- ⬜ `AeDrawer`: 抽屉组件，同上。
> 以下组件将独立发布为 **advanced-ai-ui** 组件包，以便按需引入。
- ⬜ `AeInputAI`: 专用于 AI 聊天场景的对话框组件，支持自定义工具栏，文本输入、文件上传、图片上传、语音输入，支持主题切换。
- ⬜ `AeMessageAI`: 专用于 AI 聊天场景的聊天气泡框组件，支持头像、名称、时间、内容区、深度思考区、携带的图片、文件显示，复制、重新发送、点赞、反馈、语音播放等按钮。支持携带自定义尾部控件。
> 以下组件将独立发布为 **advanced-lowcode-ui** 组件包，以便按需引入。
- ⬜ `AeFormDesginer`: 可视化表单设计器。
- ⬜ `AeTableDesginer`: 可视化表格设计器。
- ⬜ `AeCodeViewer`: 轻量级代码阅读器，具备浅色/深色主题切换，语法高亮，支持 js.ts.vue2.vue3.css.less等语言代码的展示。支持显示行号，折叠展开。
- ⬜ `AeCodeEditor`: 代码编辑器，双向绑定，具备主题切换，代码高亮，行号显示，折叠展开，自定义补全等功能，基本的语法检查。
- ⬜ `AeJsonViewer`: JSON 阅读器，支持主题切换，轻量级显示 JSON 数据，节点展开收缩，支持对不同类型的值使用不同的高亮色。
- ⬜ `AeJsonEditor`: 轻量级 JSON 编辑器，以树形节点展示 JSON 数据，支持节点展开收缩，支持属性名或值的编辑，支持为对象添加或删除属性，支持为数组添加新成员或删除已有成员。
- ⬜ `AeJsFuncEditor`: JavaScript 函数编辑器，与代码编辑器不同的是，专注于对单个函数的内容区编辑，而函数名称、入参、出参类型是预先固定的。可用于表单设计器中配置组件函数属性。
- ⬜ `AeOptionsEditor`: 选项编辑器，专用于自定义选项数据，可预先自定义选项的数据结构、最大数量、是否树形，并根据该结构渲染输入框。支持快速导入模式。
- ⬜ `AeSandbox`: 代码沙盒插件，可在线执行并验证函数或代码，内置了安全检查避免非法注入。

> 💡 如果您有好的想法或建议，欢迎在 [Issues](https://github.com/vvhr/advanced-ele-ui/issues) 中提出！

---

## Documents and Resources

- [在线演示](https://vvhr.github.io/advanced-ele-ui) - 查看所有组件的实时示例
- [NPM 包](https://www.npmjs.com/package/advanced-ele-ui) - 查看发布版本和下载统计
- [更新日志](./CHANGELOG.md) - 了解版本更新内容
- [问题反馈](https://github.com/vvhr/advanced-ele-ui/issues) - 提交 Bug 或功能建议

---

## Contribution

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## OSL
本项目基于 [MIT](./LICENSE) 协议开源。

---

## Thanks For
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [Iconify](https://iconify.design/) - 统一的图标框架
- [VueUse](https://vueuse.org/) - Vue 组合式 API 工具集
- [AiEditor](https://aieditor.dev/) - 智能文本编辑器

---

## Contact
- 作者：vvhr
- 邮箱：vvhr_anen@163.com
- GitHub：[@vvhr](https://github.com/vvhr)

---

<div align="center">
  <sub>Built with ❤️ by vvhr</sub>
</div>
