# AGENTS.md - AI 编码代理指南

本文档为 AI 编码代理（如 Claude、Cursor、Copilot 等）提供项目开发指南。

## 项目概述

**Advanced Element UI** 是一个基于 Vue 3 + Element Plus 的**配置驱动型**高级组件库。
核心理念：通过 JSON 配置驱动复杂表单和表格的渲染，减少 70%+ 的重复代码。

### 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **UI 库**: Element Plus 2.9+
- **语言**: TypeScript 5.3+
- **构建**: Vite 5.x + vite-plugin-dts
- **包管理**: pnpm 8.x (必须使用 pnpm)
- **样式**: Less + UnoCSS
- **测试**: Vitest + @vue/test-utils

---

## 构建/测试/Lint 命令

### 开发

```bash
pnpm dev              # 启动开发服务器
pnpm dev:lib          # 监听模式构建库
```

### 构建

```bash
pnpm build            # 完整构建（类型检查 + 打包）
pnpm build:demo       # 构建演示站点
pnpm build:types      # 仅生成类型声明
pnpm check            # 仅运行类型检查 (vue-tsc --noEmit)
```

### 测试

```bash
pnpm test             # 运行所有测试 (vitest)
pnpm test:ui          # 带 UI 界面的测试
pnpm test:coverage    # 运行测试并生成覆盖率报告

# 运行单个测试文件
pnpm test -- tests/components/Form.test.ts

# 运行匹配模式的测试
pnpm test -- --grep "AeForm"
```

### 代码质量

```bash
pnpm eslint .         # 运行 ESLint 检查
pnpm eslint . --fix   # 自动修复 ESLint 问题
```

---

## 代码风格指南

### Prettier 配置 (.prettierrc)

```json
{
  "semi": false, // 不使用分号
  "singleQuote": true, // 使用单引号
  "trailingComma": "none", // 不使用尾随逗号
  "tabWidth": 2, // 2 空格缩进
  "printWidth": 100, // 每行最大 100 字符
  "arrowParens": "avoid", // 箭头函数单参数不加括号
  "endOfLine": "lf" // 使用 LF 换行符
}
```

### ESLint 关键规则

- `vue/multi-word-component-names`: off - 允许单词组件名
- `@typescript-eslint/no-explicit-any`: off - 允许使用 any
- `vue/html-self-closing`: 组件标签必须自闭合
- `prettier/prettier`: error - 强制 Prettier 格式

### TypeScript 配置

- **target**: ES2020
- **strict**: false (宽松模式)
- **路径别名**: `@/` → `src/`, `~/` → 项目根目录

---

## 导入规范

### 导入顺序（按此顺序组织）

```typescript
// 1. Vue 核心
import { defineComponent, ref, computed, watch, onMounted } from 'vue'

// 2. Element Plus 组件
import { ElForm, ElInput, ElSelect } from 'element-plus'

// 3. 第三方库
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// 4. 内部类型（使用 type 关键字）
import type { FormSchema, TableColumn } from './types'

// 5. 内部模块（使用 @ 别名）
import { useForm } from '@/components/Form/src/hook/useForm'
import { isFunction, isObject } from '@/utils/is'
```

### 类型导入

- 纯类型导入必须使用 `import type`
- 混合导入时，类型使用 `type` 前缀：`import { Component, type PropType } from 'vue'`

---

## 命名约定

### 文件命名

- **组件**: PascalCase - `Form.vue`, `Table.vue`
- **工具函数**: camelCase - `useForm.ts`, `format.ts`
- **类型定义**: camelCase - `types.ts`, `schema.ts`
- **样式文件**: kebab-case - `combo-input.less`

### 代码命名

```typescript
// 组件名: PascalCase，以 Ae 为前缀
export default defineComponent({ name: 'AeForm' })

// 组合式函数: camelCase，以 use 为前缀
export function useForm() {}
export function useRenderForm() {}

// 类型/接口: PascalCase
interface FormSchema {}
type ComponentName = 'Input' | 'Select'

// 常量: UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_EMPTY_VALUE = '-'

// Props: camelCase
const props = defineProps<{
  modelValue: string
  showErrorNotice: boolean
}>()

// Emits: kebab-case 事件名
emit('update:modelValue', value)
emit('selection-change', selection)
```

---

## 组件开发规范

### 组件结构

```
src/components/ComponentName/
├── index.ts              # 导出入口，包含 withInstall
├── src/
│   ├── ComponentName.vue # 主组件（或 .tsx）
│   ├── types.ts          # 类型定义
│   ├── constants.ts      # 常量定义
│   ├── hook/             # 组合式函数
│   │   └── useXxx.ts
│   ├── render/           # 渲染函数
│   │   └── RenderXxx.tsx
│   └── components/       # 子组件
└── README.md             # 组件文档（可选）
```

### 组件导出模式

```typescript
// index.ts
import Component from './src/Component.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeComponent: SFCWithInstall<typeof Component> = withInstall(Component)
export default AeComponent

// 导出类型
export type ComponentDefineProps = InstanceType<typeof Component>['$props']
export type { ComponentProps, ComponentEmits } from './src/types'
```

### Vue 组件写法

- 优先使用 `<script lang="tsx">` + `defineComponent` 写法
- 复杂渲染逻辑使用 TSX/JSX
- Props 使用 `PropType` 定义类型
- 必须定义 `name` 属性，以 `Ae` 为前缀

```vue
<script lang="tsx">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'AeExample',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array as PropType<OptionItem[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots, expose }) {
    // 组合式逻辑
    expose({
      /* 暴露的方法 */
    })
    return () => <div class="ae-example">{/* TSX 渲染 */}</div>
  }
})
</script>
```

---

## 类型系统

### 全局类型 (src/types/index.ts)

```typescript
export type Recordable<T = any, K extends PropertyKey = string> = Record<K, T>
export type Nullable<T> = T | null
export type ComponentRef<T> = T extends new (...args: any) => any ? InstanceType<T> : T
```

### 类型工具函数 (src/utils/is.ts)

```typescript
isArray(val) // 检查是否为数组
isFunction(val) // 检查是否为函数
isObject(val) // 检查是否为对象（不含 null）
isNumber(val) // 检查是否为数字
isValidKey(val) // 检查是否为有效的对象键
```

---

## 错误处理

### 日志输出

- 使用 `@/locale` 中的 `logger` 进行国际化日志输出
- 开发环境使用 `console.warn` 提示，不使用 `console.error`

### 表单验证

- 验证失败时通过 `showErrorNotice` 控制是否弹出提示
- 支持滚动到第一个错误项

---

## 样式规范

### CSS 类名

- 组件根元素: `ae-{component-name}` (如 `ae-form`, `ae-table`)
- 子元素: `ae-{component-name}__{element}` (BEM 风格)
- 状态类: `is-{state}` (如 `is-adaptive`, `is-required`)

### Less 变量

- 优先使用 Element Plus CSS 变量: `var(--el-color-primary)`
- 组件内样式使用 `<style lang="less">` 非 scoped

---

## Git 提交规范

### 提交信息格式

```
<type>: <description>

type 类型:
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关
```

### 分支命名

- 功能分支: `feature/功能描述`
- 修复分支: `fix/问题描述`

---

## 重要注意事项

1. **必须使用 pnpm** - 项目配置了 `packageManager: pnpm@8.15.1`
2. **Node.js 版本** - 要求 >= 18.0.0
3. **类型检查** - 提交前运行 `pnpm check` 确保无类型错误
4. **组件注册** - 新组件必须在 `src/index.ts` 中导出
5. **国际化** - 用户可见文本需支持 i18n，参考 `src/locale/`
6. **测试文件** - 放置在 `tests/` 目录，使用 `.test.ts` 后缀
