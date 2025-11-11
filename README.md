<div align="center">

English | [简体中文](./README.zh.md)

  <h1> Advanced Element UI</h1>
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
    <a href="https://vvhr.github.io/advanced-ele-ui" target="_blank">📱 Live Demo</a>
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
Advanced Element UI is an advanced component library deeply encapsulated based on Element Plus, focusing on improving the development efficiency of middle and back-end systems.

Element Plus, as one of the most popular UI component libraries in the Vue 3 ecosystem, has its greatest advantage in **staying native and not over-encapsulating**, which provides great flexibility for secondary development. Based on this feature, we created Advanced Element UI, making complex form and table development simple and efficient through **configuration-driven** approach.

The `AeForm` and `AeTable` components of this project are completely driven by configuration data, achieving **complete decoupling of pages, components, and business logic**. Developers only need to focus on configuration items to quickly build complex business scenarios, greatly reducing repetitive code and improving development efficiency.

## Features
- **Out of the Box**: Based on Element Plus, seamlessly integrated into Vue 3 projects
- **Unified Style**: Secondary encapsulated components follow Element Plus style in component properties and styles
- **Data Driven**: All components follow the core idea of **rendering driven by configuration**, rejecting hard coding
- **Rich Icons**: Integrated with Iconify, supporting 100,000+ icon libraries
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
app.use(AdvancedEleUI)
app.mount('#app')
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
  <AeTable :columns="columns" :data="data" />
  <AeForm :model="formModel" :schemas="schemas" />
</template>
```

### On-Demand Import

Import only the components you need:

```typescript
import { AeForm, AeTable, AeIcon, AeEditor } from 'advanced-ele-ui'
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

### Short-term Plan (v1.0.0)
- [ ] Improve component documentation and examples
- [ ] Increase unit test coverage
- [ ] Optimize TypeScript type definitions
- [ ] Performance optimization and bug fixes
- [ ] Release the first official version

### Mid-term Plan (v1.x)
- [ ] `AeForm`: Support more form control types
- [ ] `AeTable`: Enhanced virtual scrolling performance
- [ ] `AeDialog`: Dialog component
- [ ] `AeDrawer`: Drawer component
- [ ] Theme customization

### Long-term Plan (v2.x)
- [ ] Visual form designer
- [ ] Visual table configurator
- [ ] AI-assisted configuration generation
- [ ] Low-code platform integration solution
- [ ] Mobile adaptation

> 💡 If you have good ideas or suggestions, feel free to raise them in [Issues](https://github.com/vvhr/advanced-ele-ui/issues)!

---

## Documents and Resources

- [Live Demo](https://vvhr.github.io/advanced-ele-ui) - View live examples of all components
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
