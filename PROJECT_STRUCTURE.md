# 项目结构说明

## 📁 完整目录结构

```
advanced-ele-ui/
├── .git/                       # Git 版本控制
├── .idea/                      # IDE 配置
├── dist/                       # 构建输出目录（自动生成）
│   ├── advanced-ele-ui.es.js   # ES Module 格式
│   ├── advanced-ele-ui.umd.js  # UMD 格式
│   ├── style.css               # 样式文件
│   └── *.d.ts                  # TypeScript 类型声明
│
├── scripts/                    # 构建脚本
│   └── build.js                # 自定义构建脚本
│
├── src/                        # 源代码目录
│   ├── components/             # 组件目录
│   │   ├── Form/              # 表单组件
│   │   │   ├── src/           # 组件源码
│   │   │   │   ├── Form.vue   # 主组件
│   │   │   │   ├── types.ts   # 类型定义
│   │   │   │   ├── hook/      # 组合式函数
│   │   │   │   ├── render/    # 渲染函数
│   │   │   │   └── utils/     # 工具函数
│   │   │   └── index.ts       # 组件导出
│   │   │
│   │   ├── Icon/              # 图标组件
│   │   │   ├── src/
│   │   │   └── index.ts
│   │   │
│   │   └── Table/             # 表格组件
│   │       ├── src/
│   │       └── index.ts
│   │
│   ├── types/                 # 全局类型定义
│   │   ├── global.d.ts        # 全局类型声明
│   │   └── index.ts           # 类型导出
│   │
│   ├── App.vue                # 开发预览页面
│   ├── main.ts                # 开发环境入口
│   ├── index.ts               # 组件库入口（构建入口）
│   └── env.d.ts               # 环境类型声明
│
├── .editorconfig              # 编辑器配置
├── .gitignore                 # Git 忽略文件
├── .npmignore                 # npm 发布忽略文件
├── CHANGELOG.md               # 更新日志
├── index.html                 # 开发页面模板
├── LICENSE                    # 开源协议
├── package.json               # 项目配置
├── PROJECT_STRUCTURE.md       # 项目结构说明（本文件）
├── PUBLISH.md                 # 发布指南
├── README.md                  # 项目说明
├── SETUP.md                   # 设置指南
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node 环境 TS 配置
└── vite.config.ts             # Vite 构建配置
```

## 📝 核心文件说明

### 配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | 项目配置，包含依赖、脚本、发布信息 |
| `tsconfig.json` | TypeScript 主配置，用于源码编译 |
| `tsconfig.node.json` | Node 环境的 TS 配置，用于构建脚本 |
| `vite.config.ts` | Vite 构建配置，定义构建规则和插件 |
| `.editorconfig` | 编辑器统一配置 |
| `.gitignore` | Git 版本控制忽略规则 |
| `.npmignore` | npm 发布时忽略的文件 |

### 入口文件

| 文件 | 用途 |
|------|------|
| `src/index.ts` | 组件库入口，用于构建和发布 |
| `src/main.ts` | 开发环境入口，用于本地开发预览 |
| `index.html` | 开发服务器的 HTML 模板 |

### 文档文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目介绍和使用说明 |
| `SETUP.md` | 开发环境设置指南 |
| `PUBLISH.md` | npm 发布流程指南 |
| `CHANGELOG.md` | 版本更新日志 |
| `PROJECT_STRUCTURE.md` | 项目结构说明（本文件）|
| `LICENSE` | 开源协议（MIT） |

## 🔧 构建流程

### 开发模式
```
src/main.ts → Vite Dev Server → http://localhost:5173
```

### 构建模式
```
src/index.ts → Vite Build → dist/
  ├── advanced-ele-ui.es.js    (ES Module)
  ├── advanced-ele-ui.umd.js   (UMD)
  ├── style.css                (样式)
  └── *.d.ts                   (类型声明)
```

## 📦 发布内容

通过 `.npmignore` 配置，只发布以下内容到 npm：

```
advanced-ele-ui/
├── dist/                   # 构建产物
│   ├── *.js               # 编译后的 JS 文件
│   ├── *.css              # 样式文件
│   └── *.d.ts             # 类型声明文件
├── package.json           # 包配置
├── README.md              # 使用说明
├── LICENSE                # 开源协议
└── CHANGELOG.md           # 更新日志
```

## 🎯 关键特性

### 1. 双模式支持
- **开发模式**: 使用 `src/main.ts` 作为入口，可以在浏览器中预览和调试组件
- **构建模式**: 使用 `src/index.ts` 作为入口，构建可发布的组件库

### 2. 多格式输出
- **ES Module**: 支持现代打包工具的 tree-shaking
- **UMD**: 支持直接在浏览器中使用

### 3. TypeScript 支持
- 完整的类型定义
- 自动生成 `.d.ts` 类型声明文件
- 严格的类型检查

### 4. 样式处理
- 支持 Less 预处理器
- 自动提取和合并样式
- 单独输出 `style.css` 文件

### 5. 外部依赖
将以下依赖标记为外部依赖（不打包进组件库）：
- `vue`
- `element-plus`
- `@iconify/vue`
- `@vueuse/core`
- `lodash-es`
- `dayjs`

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 开发模式
npm run dev

# 3. 构建
npm run build

# 4. 发布
npm publish
```

## 📚 组件开发规范

每个组件应遵循以下结构：

```
ComponentName/
├── src/
│   ├── ComponentName.vue    # 组件实现
│   ├── types.ts             # 类型定义
│   ├── hooks/               # 组合式函数（可选）
│   ├── utils/               # 工具函数（可选）
│   └── styles/              # 样式文件（可选）
└── index.ts                 # 组件导出
```

组件导出示例：
```typescript
import Component from './src/Component.vue'

Component.name = 'ComponentName'

export default Component
export * from './src/types'
```
