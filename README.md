<div align="center">

English | [简体中文](./README.zh.md)

  <h1><a href="https://github.com/vvhr/advanced-ele-ui">Advanced Element UI</a></h1>
  <p>**Configuration-Driven** Advanced component library built on Vue 3 and Element Plus</p>
  <img alt="logo" height="154px" src="https://img.howcat.cn/LxLGz5p-v_cQsTA0sP_oQ" title="logo" width="400px"/>

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
- ✅ `AeDialog`: Dialog component: A feature-rich dialog component.  
- ✅ `AeDrawer`: Drawer component: A feature-rich drawer component.
- ✅ `AeTabs`: Tabs component: A feature-rich tabs component.
---

## Roadmap

- ⬜ Build the `advanced-ele-ui-docs` component library documentation project to provide better usage guidance!

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
