<div align="center">

English | [简体中文](./README.zh.md)

  <h1><a href="https://github.com/vvhr/advanced-ele-ui">Advanced Element UI</a></h1>
  <p>Advanced component library for low-code and AI based on Vue 3 + Element Plus</p>
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
    <a href="http://aeui.vvhrdesign.com" target="_blank">📱 Live Demo</a>
    ·
    <a href="#QuickStart">Quick Start</a>
    ·
    <a href="./CHANGELOG.md">Changelog</a>
    ·
    <a href="#Roadmap">Roadmap</a>
  </h3>
</div>

---
> Warning: This project is in early development and rapid iteration. There may be bugs. Please follow this repository and avoid using it in production environments for now. Stay tuned for the first official release.
> 2025.11.10

## Introduction

Advanced Element UI is a **configuration-driven** advanced component library built on Vue 3 and Element Plus, designed to solve the pain points of repetitive coding in enterprise applications.

### 🎯 What Problems Does It Solve?

**Traditional Development Pain Points:**
- ❌ Writing hundreds of lines of template code for complex forms
- ❌ Repetitive table column definitions and data formatting logic
- ❌ Scattered validation rules and business logic
- ❌ Difficult to maintain dynamic forms and editable tables
- ❌ Lack of unified internationalization solution

**Our Solution:**
- ✅ **Configuration-Driven**: Define complex forms and tables with simple JSON configurations
- ✅ **Complete Decoupling**: Separate UI, data, and business logic for better maintainability
- ✅ **Rich Features**: Built-in data linkage, dynamic properties, inline editing, and more
- ✅ **Type Safety**: Full TypeScript support with intelligent code completion
- ✅ **Extensibility**: Register custom components while maintaining Element Plus style

### 💡 Core Philosophy

We believe that **80% of middle and back-end pages follow similar patterns**. Instead of writing repetitive code, developers should focus on **business logic and data flow**. Advanced Element UI transforms complex UI development into simple configuration management, reducing code by 70%+ while improving maintainability.

### 🚀 Quick Example

**Traditional Way** (100+ lines):
```vue
<template>
  <el-form :model="form" :rules="rules">
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" placeholder="Please enter name" />
    </el-form-item>
    <!-- ... 20+ similar form items -->
  </el-form>
</template>
```

**Advanced Element UI Way** (10 lines):
```vue
<template>
  <AeForm :model="form" :schemas="schemas" />
</template>

<script setup>
const schemas = [
  { field: 'name', label: 'Name', component: 'Input' },
  // ... simple configuration
]
</script>
```

## Features
- **Out of the Box**: Based on Element Plus, seamlessly integrated into Vue 3 projects
- **Unified Style**: Secondary encapsulated components follow Element Plus style in component properties and styles
- **Data Driven**: All components follow the core idea of **rendering driven by configuration**, rejecting hard coding
- **Rich Icons**: Integrated with Iconify, supporting 100,000+ icon libraries
- **Internationalization**: Built-in i18n support for Chinese and English, easily switchable with one line of code
- **Type Definitions**: Complete type definitions and comments, providing a good development experience
- **Free Extension**: `AeForm` and `AeTable` provide registration functions, allowing you to register any component that follows Element Plus property style

---

## Install

1. Make sure Vue 3 and Element Plus are installed in your project
```bash
// use npm
npm install element-plus --save

// use yarn
yarn add element-plus

// use pnpm
pnpm install element-plus
```


2. Install AdvancedEleUI component library
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

### Full Import

Import all components in `main.ts`:

```typescript
import { createApp } from 'vue'

/** Import Element Plus */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/** Import AdvancedEleUI component library */
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)

/** Use English Language */
app.use(AdvancedEleUI, {
  locale: 'en-US'
})
app.mount('#app')
```

#### Internationalization (i18n)

The component library supports Chinese and English. Default is Chinese. You can set the language globally:

```typescript
// Set to English
app.use(AdvancedEleUI, {
  locale: 'en-US'
})

// Or switch at runtime
import { setLocale } from 'advanced-ele-ui'
setLocale('en-US')
```

#### TypeScript Global Component Type Support

If you use TypeScript, to enable IDE recognition of globally registered components, you need to add type declarations.

**Method 1: Add in `tsconfig.json`**

```json
{
  "compilerOptions": {
    "types": ["advanced-ele-ui/global"]
  }
}
```

**Method 2: Add in type declaration file**

Add in `src/env.d.ts` or `src/types/global.d.ts`:

```typescript
/// <reference types="advanced-ele-ui/global" />
```

After configuration, restart your IDE, and you can use components directly in Vue files with full type hints:

```vue
<template>
  <!-- ✅ IDE can recognize components and provide intelligent hints -->
  <AeTable :columns="columns" v-model="data" />
  <AeForm :model="formModel" :schemas="schemas" />
</template>
```

### On-Demand Import

Import only the components you need:

```typescript
import { AeForm, AeTable, AeIcon, AeEditor, AeUpload, AeDialog, AeDrawer, AeTabs, AeTabPanel } from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'
```

---

## Components
- ✅ `AeForm`: Advanced form component: A powerful data-driven form component that supports multiple form controls, focusing on solving complex scenarios of data linkage and dynamic properties.
- ✅ `AeTable`: Advanced table component: A feature-rich data-driven table component that supports multiple column types and inline editing.
- ✅ `AeIcon`: Dynamic icon component: Based on [Iconify](https://icon-sets.iconify.design/), supporting 100,000+ icon libraries for dynamic rendering.
- ✅ `AeEditor`: Rich text component: A rich text component based on [AiEditor](https://aieditor.dev/docs) with AI assistant functionality.
- ✅ `AeUpload`: Upload component: A feature-rich native upload component. The component itself does not control uploading, leaving it entirely to you to implement upload requests. The component focuses on data and styles.

---

## Roadmap

### 🎯 Short-term Plan (v1.0.0)
- ⬜ Release the first official version
- ✅ `AeForm`: Improve the `type`: `desc` mode, commonly used for displaying information on detail pages, to satisfy the idea of presenting forms in a Word-like form style.
- ⬜ `AeForm`: Improve the `designable`: `true` mode, which will be used in `AeFormDesginer` to implement form toolbar, drag-and-drop, selection, etc. The plan is to adopt a non-intrusive design that only provides hook functions and does not embed directly into the `AeForm` component.
- ✅ `AeTable`: Improve the strategy for rendering editable components when `editable`: `true`; introduce more component types and support on-demand registration of components with `AeForm`.
- ✅ Write the `element-plus-beauty.less` style class to optimize the native styles of `element-plus` components, providing a better user experience when they are disabled.
- ⬜ Build the `advanced-ele-ui-docs` component library documentation project to provide better usage guidance!

### 🔮 Mid-term Plan (v1.x)
- ✅ `AeDialog`: Enhance the dialog component. `el-dialog` is currently rough in style and functionality; we will encapsulate a more attractive and controllable dialog component.
- ✅ `AeDrawer`: Drawer component, same as above.
- ✅ `AeTabs`: Tabs component, same as above.
> The following components will be released separately as the **advanced-ai-ui** component package for on-demand importing.
- ⬜ `AeInputAI`: A dialog component specialized for AI chat scenarios, supporting a custom toolbar, text input, file upload, image upload, voice input, and theme switching.
- ⬜ `AeMessageAI`: A chat bubble component for AI chat scenarios, supporting avatar, name, time, content area, deep-thought area, attached images and file display, buttons for copy, resend, like, feedback, voice playback, etc. Supports custom footer controls.
> The following components will be released separately as the **advanced-lowcode-ui** component package for on-demand importing.
- ⬜ `AeFormDesginer`: Visual form designer.
- ⬜ `AeTableDesginer`: Visual table designer.
- ⬜ `AeCodeViewer`: Lightweight code viewer with light/dark theme switching and syntax highlighting, supporting display of languages such as js, ts, vue2, vue3, css, less, etc. Supports line numbers and fold/unfold.
- ⬜ `AeCodeEditor`: Code editor with two-way binding, theme switching, syntax highlighting, line numbers, folding/unfolding, custom completion, and basic syntax checking.
- ⬜ `AeJsonViewer`: JSON viewer that supports theme switching, lightweight JSON display, node expand/collapse, and different highlight colors for different value types.
- ⬜ `AeJsonEditor`: Lightweight JSON editor that displays JSON data as tree nodes, supports node expand/collapse, editing property names or values, adding or removing properties for objects, and adding or removing members for arrays.
- ⬜ `AeJsFuncEditor`: JavaScript function editor that, unlike a code editor, focuses on editing the body of a single function while the function name, input parameters, and output types are predefined. Can be used in the form designer to configure component function properties.
- ⬜ `AeOptionsEditor`: Options editor specialized for custom option data; allows predefining the option data structure, maximum count, and whether it's hierarchical, and renders input fields based on that structure. Supports quick import mode.
- ⬜ `AeSandbox`: Code sandbox plugin that can execute and validate functions or code online, with built-in security checks to prevent illegal injection.

> 💡 If you have good ideas or suggestions, feel free to raise them in [Issues](https://github.com/vvhr/advanced-ele-ui/issues)!

---

## Documents and Resources

- [Live Demo](http://aeui.vvhrdesign.com) - View live examples of all components
- [NPM Package](https://www.npmjs.com/package/advanced-ele-ui) - View release versions and download statistics
- [Changelog](./CHANGELOG.md) - Learn about version updates
- [Issue Feedback](https://github.com/vvhr/advanced-ele-ui/issues) - Submit bugs or feature suggestions

---

## Contribution

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Submit a Pull Request

---

## License
This project is open source under the [MIT](./LICENSE) license.

---

## Thanks For
- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Element Plus](https://element-plus.org/) - Vue 3 based component library
- [Iconify](https://iconify.design/) - Unified icon framework
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities
- [AiEditor](https://aieditor.dev/) - Intelligent text editor

---

## Contact
- Author: vvhr
- Email: vvhr_anen@163.com
- GitHub: [@vvhr](https://github.com/vvhr)

---

<div align="center">
  <sub>Built with ❤️ by vvhr</sub>
</div>
