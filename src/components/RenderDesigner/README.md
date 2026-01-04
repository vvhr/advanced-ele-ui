# RenderDesigner 组件

## 概述

RenderDesigner 是一个独立的可视化设计器组件，用于设计 Form 组件的 render 属性。采用**非入侵式设计**，Form 组件本身不需要知道 RenderDesigner 的存在。

## 设计理念

### 非入侵式架构

```
┌─────────────────────────────────────────┐
│      RenderDesigner 组件                │
│  (可视化设计器，输出 JSON 配置)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      renderResolver 工具类               │
│  (将 JSON 转换为 render 函数)           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Form 组件                           │
│  (使用标准的 render 函数，无需修改)      │
└─────────────────────────────────────────┘
```

### 核心原则

1. **Form 组件零修改**：Form 组件不需要任何改动，只需要使用标准的 `render` 函数
2. **独立设计器**：RenderDesigner 是完全独立的组件，可以单独使用
3. **JSON 配置**：设计器输出的是完全可序列化的 JSON 配置
4. **转换层**：通过 renderResolver 将 JSON 转换为 render 函数

## 使用方式

### 1. 在设计器中使用 RenderDesigner

```vue
<template>
  <RenderDesigner
    v-model="renderConfig"
    :params="designerParams"
    :available-fields="availableFields"
    :available-components="availableComponents"
    @change="handleConfigChange"
  />
</template>

<script setup lang="ts">
import { RenderDesigner } from '@/components/RenderDesigner'
import type { RenderDesignerValue } from '@/components/RenderDesigner'

const renderConfig = ref<RenderDesignerValue>(null)
const designerParams = {
  formModel: { type: 1, status: 'active' },
  disabled: false,
  // ...
}

const availableFields = [
  { path: 'formModel.type', label: '类型', type: 'number' },
  { path: 'formModel.status', label: '状态', type: 'string' }
]

const availableComponents = [
  { name: 'el-button', label: '按钮' },
  { name: 'el-input', label: '输入框' }
]

function handleConfigChange(value: RenderDesignerValue) {
  // 保存配置到数据库
  saveConfig(value)
}
</script>
```

### 2. 在 Form 组件中使用 renderResolver

```vue
<template>
  <AeForm :schemas="formSchemas" />
</template>

<script setup lang="ts">
import { AeForm } from 'advanced-ele-ui'
import { resolveRender } from '@/components/RenderDesigner'
import type { FormSchema } from 'advanced-ele-ui'

// 从数据库读取的 JSON 配置
const renderConfigFromDB = {
  type: 'el-button',
  text: '查询',
  condition: {
    expression: {
      type: 'operator',
      operator: 'eq',
      children: [
        { type: 'field', field: 'formModel.type' },
        { type: 'value', value: 1 }
      ]
    }
  },
  events: {
    click: {
      eventType: 'click',
      actions: [
        {
          type: 'setField',
          setField: {
            field: 'formModel.status',
            value: { type: 'value', value: 'active' }
          }
        }
      ]
    }
  }
}

// 使用 renderResolver 转换为 render 函数
const formSchemas: FormSchema[] = [
  {
    key: 'email',
    field: 'email',
    label: '邮箱',
    component: 'Input',
    outsideProps: {
      enable: true,
      appendRender: resolveRender(renderConfigFromDB)
    }
  }
]
</script>
```

## 配置数据结构

### RenderComponentConfig

RenderDesigner 输出的 JSON 配置结构：

```typescript
interface RenderComponentConfig {
  type: string                    // 组件类型
  props?: Record<string, any>      // 组件属性
  children?: any                   // 子元素
  slots?: Record<string, any>      // 插槽
  condition?: ConditionConfig     // 条件渲染
  style?: Record<string, any>      // 样式
  className?: string | ExpressionNode  // 类名
  events?: Record<string, EventHandlerConfig>  // 事件
  key?: string                     // 唯一标识
}
```

### ExpressionNode

表达式节点结构：

```typescript
interface ExpressionNode {
  type: 'field' | 'value' | 'operator' | 'function' | 'group'
  field?: string
  value?: any
  operator?: string
  functionName?: string
  functionArgs?: ExpressionNode[]
  children?: ExpressionNode[]
}
```

## 三个场景示例

### 场景1：条件显示的按钮

**RenderDesigner 配置**：
```json
{
  "type": "el-button",
  "props": {
    "type": "primary"
  },
  "children": ["查询"],
  "condition": {
    "expression": {
      "type": "operator",
      "operator": "eq",
      "children": [
        { "type": "field", "field": "formModel.type" },
        { "type": "value", "value": 1 }
      ]
    }
  },
  "events": {
    "click": {
      "eventType": "click",
      "actions": [
        {
          "type": "setField",
          "setField": {
            "field": "formModel.status",
            "value": { "type": "value", "value": "active" }
          }
        }
      ]
    }
  }
}
```

**在 Form 中使用**：
```typescript
const formSchemas: FormSchema[] = [
  {
    key: 'email',
    field: 'email',
    component: 'Input',
    outsideProps: {
      enable: true,
      appendRender: resolveRender(buttonConfig)
    }
  }
]
```

### 场景2：动态文本块

**RenderDesigner 配置**：
```json
{
  "type": "span",
  "children": {
    "type": "operator",
    "operator": "conditional",
    "children": [
      {
        "type": "operator",
        "operator": "eq",
        "children": [
          { "type": "field", "field": "formModel.type" },
          { "type": "value", "value": 1 }
        ]
      },
      { "type": "value", "value": "类型A" },
      { "type": "value", "value": "类型B" }
    ]
  },
  "props": {
    "prefixIcon": {
      "name": "InfoFilled",
      "library": "element-plus"
    }
  },
  "style": {
    "fontSize": "14px",
    "color": "#333333"
  }
}
```

### 场景3：render 中的输入框

**RenderDesigner 配置**：
```json
{
  "type": "el-input",
  "props": {
    "vModel": {
      "type": "fieldBinding",
      "field": "formModel.emailDomain",
      "twoWay": true
    },
    "placeholder": "请选择邮箱域名",
    "disabled": {
      "type": "operator",
      "operator": "eq",
      "children": [
        { "type": "field", "field": "formModel.type" },
        { "type": "value", "value": 2 }
      ]
    }
  }
}
```

## renderResolver 配置

### 基本使用

```typescript
import { createRenderResolver } from '@/components/RenderDesigner'

const resolver = createRenderResolver({
  customComponents: {
    'my-custom-button': MyCustomButton
  },
  expressionTools: {
    lodash: _,
    dayjs: dayjs
  },
  debug: true
})

const renderFn = resolver.resolve(config)
```

### 便捷函数

```typescript
import { resolveRender } from '@/components/RenderDesigner'

// 直接解析为 render 函数
const renderFn = resolveRender(config, {
  customComponents: { /* ... */ },
  expressionTools: { /* ... */ }
})
```

## 优势

1. **完全解耦**：Form 组件和 RenderDesigner 完全独立
2. **易于扩展**：可以轻松添加新的组件类型和表达式函数
3. **完全序列化**：所有配置都可以存储为 JSON
4. **类型安全**：完整的 TypeScript 类型定义
5. **易于测试**：renderResolver 可以独立测试

## 注意事项

1. **组件注册**：使用自定义组件时，需要在 renderResolver 中注册
2. **表达式安全**：生产环境应该使用更安全的表达式执行方式
3. **性能考虑**：renderResolver 会在每次渲染时执行，注意性能优化
4. **事件处理**：事件操作中的自定义代码需要谨慎处理安全性
