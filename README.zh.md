<div align="center">

[English](./README.md) | 简体中文

  <h1><a href="https://github.com/vvhr/advanced-ele-ui">Advanced Element UI</a></h1>
  <p>基于 Vue 3 和 Element Plus 构建的**配置驱动**高级组件库</p>
  <img alt="logo" height="154px" src="https://img.howcat.cn/LxLGz5p-v_cQsTA0sP_oQ" title="logo" width="400px"/>

  [![npm version](https://img.shields.io/npm/v/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![npm downloads](https://img.shields.io/npm/dt/advanced-ele-ui.svg?style=flat-square)](https://www.npmjs.com/package/advanced-ele-ui)
  [![license](https://img.shields.io/npm/l/advanced-ele-ui.svg?style=flat-square)](https://github.com/vvhr/advanced-ele-ui/blob/main/LICENSE)
  [![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=flat-square)](https://pnpm.io/)

  [![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/vvhr/advanced-ele-ui)
  [![Vue](https://img.shields.io/badge/Vue-≥3.2.0-green?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![Element Plus](https://img.shields.io/badge/Element%20Plus-≥2.9.0-409eff?style=flat-square)](https://element-plus.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

  <br/>

  <h3>
    <a href="http://aeui.vvhrdesign.com" target="_blank">在线演示</a>
    ·
    <a href="#QuickStart">快速开始</a>
    ·
    <a href="./CHANGELOG.zh.md">更新日志</a>
    ·
    <a href="https://zread.ai/vvhr/advanced-ele-ui">技术文档</a>
  </h3>
</div>

---

> 现在，您可以访问由 `ZRead` 提供支持的 [技术文档](https://zread.ai/vvhr/advanced-ele-ui) 并点击 `Ask AI` 按钮的方式快速检索本项目的知识！

---


## Introduction

Advanced Element UI 是一个基于 Vue 3 和 Element Plus 构建的**配置驱动**高级组件库，旨在解决企业级应用中二次封装、重复编码的痛点。

### 🎯 解决什么问题？

**传统开发痛点：**
- ❌ 复杂表单需要编写数百行模板代码
- ❌ 重复的表格列定义和数据格式化逻辑
- ❌ 验证规则和业务逻辑分散难以维护
- ❌ 动态表单和可编辑表格实现困难
- ❌ 缺少统一的国际化解决方案

**我们的解决方案：**
- ✅ **配置驱动**：用简单的 JSON 配置定义复杂的表单和表格
- ✅ **完全解耦**：UI、数据、业务逻辑分离，易于维护
- ✅ **功能丰富**：内置数据联动、动态属性、行内编辑等高级功能
- ✅ **类型安全**：完整的 TypeScript 支持，智能代码补全
- ✅ **可扩展性**：注册自定义组件，保持 Element Plus 风格

### 💡 核心理念

我们相信**中后台 80% 的页面都遵循相似的模式**。与其编写重复代码，开发者应该专注于**业务逻辑和数据流**。Advanced Element UI 将复杂的 UI 开发转化为简单的配置管理，减少 70%+ 的代码量，同时提升可维护性。

### 🚀 快速示例

**传统方式**（100+ 行）：
```vue
<template>
  <el-form :model="form">
    <el-row>
      <el-col :span="12">
        <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入电话' }]">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '请输入电话' }]">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="3" placeholder="请输入地址" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- ... 20+ 个类似的表单项 -->
  </el-form>
</template>
```

**Advanced Element UI 方式**（10 行）：
```vue
<template>
  <AeForm :model="form" :schemas="schemas" />
</template>

<script setup>
const schemas = [
  { field: 'name', label: '姓名', component: 'Input', layoutProps: { span: 12 }, formItemProps: { autoRules: ['isRequired']} },
  { field: 'phone', label: '电话', component: 'Input', layoutProps: { span: 12 }, formItemProps: { autoRules: ['isRequired']} },
  { field: 'address', label: '地址', component: 'Input', componentProps: { type: 'textarea', rows: 3 }, layoutProps: { span: 24 } },
  // ... 简单配置
]
</script>
```

## Features
- **开箱即用**：基于 Element Plus，无缝集成到 Vue 3 项目
- **风格统一**：二次封装的组件在组件属性和样式上遵循 Element Plus 的风格
- **数据驱动**：所有组件都遵循**由配置驱动渲染**的核心思想，拒绝硬编码
- **丰富图标**：集成 Iconify，支持 10 万+ 图标库
- **国际化支持**：内置中英文国际化，一行代码即可切换语言
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

#### 国际化配置

组件库支持中英文，默认为中文。可以全局设置语言：

```typescript
// 设置为英文
app.use(AdvancedEleUI, {
  locale: 'en-US'
})

// 或运行时切换
import { setLocale } from 'advanced-ele-ui'
setLocale('en-US')
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
  <AeTable :columns="columns" v-model="data" />
  <AeForm :model="formModel" :schemas="schemas" />
</template>
```

### 按需引入

只引入需要的组件：

```typescript
import { AeForm, AeTable, AeIcon, AeEditor, AeUpload, AeDialog, AeDrawer, AeTabs, AeTabPanel } from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'
```

---

## Component
- ✅ `AeForm`: 高级表单组件: 基于数据驱动的功能强大的表单组件，支持多种表单控件，专注于解决数据联动，动态属性的复杂场景。
- ✅ `AeTable`: 高级表格组件: 基于数据驱动的功能丰富的表格组件，支持多种列类型和行内编辑。
- ✅ `AeIcon`: 动态图标组件: 基于 [Iconify](https://icon-sets.iconify.design/)，支持 10 万+ 图标库动态渲染。支持[自定义图标集](./ICON.zh.md)。
- ✅ `AeEditor`: 富文本组件: 基于 [AiEditor](https://aieditor.dev/docs) 二次封装的富文本组件，支持 AI 助手功能。
- ✅ `AeUpload`: 上传组件: 原生实现的功能丰富的上传组件，组件本身不控制上传，完全交由您实现上传请求，组件专注于数据和样式。
- ✅ `AeDialog`: 对话框组件: 基于 `el-dialog` 二次封装的高级对话框组件，优化样式，额外扩展了窗口拖拽、窗口全屏、内容区高度自适应等功能。
- ✅ `AeDrawer`: 抽屉组件: 基于 `el-drawer` 二次封装的高级抽屉组件，优化样式，额外扩展了窗口全屏、内容区高度自适应等功能。
- ✅ `AeTabs`: 标签页组件: 基于 `el-tabs` 二次封装的高级标签页组件，额外扩展了高性能渲染、内容区高度撑开等功能。
- ✅ `AeText`: 增强文本组件: 增强文本显示，支持前置图标、圆点、引用块，支持高亮文字匹配和交互
- ✅ `AeComboInput`: 组合输入组件: 将组合输入的"邮箱号"/"不动产证号"等场景的多组件组合进行原子化封装。
---

## Roadmap
> 💡 如果您有好的想法或建议，欢迎在 [Issues](https://github.com/vvhr/advanced-ele-ui/issues) 中提出！

---

## Documents and Resources

- [在线演示](http://aeui.vvhrdesign.com) - 查看所有组件的实时示例
- [技术文档](https://zread.ai/vvhr/advanced-ele-ui) - 由 [ZRead.ai](https://zread.ai/) 生成的完整技术文档
- [NPM 包](https://www.npmjs.com/package/advanced-ele-ui) - 查看发布版本和下载统计
- [更新日志](./CHANGELOG.zh.md) - 了解版本更新内容
- [图标组件指南](./ICON.zh.md) - 自定义图标集和使用方法
- [问题反馈](https://github.com/vvhr/advanced-ele-ui/issues) - 提交 Bug 或功能建议
- [ZRead](https://zread.ai/) - Github 文档自动生成及知识检索
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
