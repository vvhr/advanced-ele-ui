# FormSchema 可视化配置器设计方案

## 一、核心设计思路

### 1.1 问题分析

低代码表单设计器需要解决的核心问题：
- **render 属性的可视化配置**：用户无法直接编写 JSX/函数代码
- **复杂逻辑的可视化表达**：条件判断、事件处理等需要可视化构建
- **配置的完全序列化**：所有配置必须能存储为 JSON

### 1.2 解决方案架构

```
┌─────────────────────────────────────────────────────────┐
│              可视化配置器界面层                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │组件选择器│  │属性编辑器│  │表达式构建│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              配置数据结构层                               │
│  VisualComponentConfig (可视化配置对象)                  │
│  - ExpressionNode (表达式节点树)                        │
│  - EventHandlerConfig (事件处理器配置)                  │
│  - ConditionConfig (条件配置)                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              转换层                                       │
│  VisualConfig → ComponentConfig → FormSchema            │
│  (可视化配置 → 组件配置 → 表单配置)                      │
└─────────────────────────────────────────────────────────┘
```

## 二、数据结构设计

### 2.1 表达式可视化构建

**问题**：如何让用户可视化构建 `formModel.type === 1` 这样的表达式？

**解决方案**：使用表达式节点树（ExpressionNode）

```typescript
// 用户操作：选择字段 "formModel.type" → 选择操作符 "等于" → 输入值 "1"
// 生成的数据结构：
{
  type: 'operator',
  operator: 'eq',
  children: [
    {
      type: 'field',
      field: 'formModel.type'
    },
    {
      type: 'value',
      value: 1
    }
  ]
}
```

**可视化界面设计**：
```
┌─────────────────────────────────────┐
│ 表达式构建器                        │
├─────────────────────────────────────┤
│ [formModel.type] [等于] [1]        │
│   └─字段选择器  └─操作符  └─值输入  │
│                                     │
│ [+ 添加条件] [且/或]                │
└─────────────────────────────────────┘
```

### 2.2 事件处理器可视化配置

**问题**：如何让用户可视化配置"点击按钮后设置某个字段的值"？

**解决方案**：使用事件操作链（EventAction）

```typescript
// 用户操作：
// 1. 选择操作类型："设置字段值"
// 2. 选择目标字段："formModel.status"
// 3. 设置值表达式：选择字段 "formModel.type"
// 生成的数据结构：
{
  eventType: 'click',
  actions: [
    {
      type: 'setField',
      setField: {
        field: 'formModel.status',
        value: {
          type: 'field',
          field: 'formModel.type'
        }
      }
    }
  ]
}
```

**可视化界面设计**：
```
┌─────────────────────────────────────┐
│ 事件处理器                          │
├─────────────────────────────────────┤
│ 操作列表：                          │
│ ┌─────────────────────────────────┐ │
│ │ [设置字段值]                     │ │
│ │   目标字段: [formModel.status ▼] │ │
│ │   值: [formModel.type ▼]        │ │
│ └─────────────────────────────────┘ │
│ [+ 添加操作]                        │
└─────────────────────────────────────┘
```

### 2.3 组件配置可视化

**问题**：如何让用户可视化配置一个按钮的所有属性？

**解决方案**：使用配置元数据（ConfigItemMetadata）指导界面渲染

```typescript
// 按钮组件的配置元数据
{
  key: 'text',
  label: '按钮文本',
  valueType: 'string',
  group: '基础',
  order: 1
}
```

**可视化界面设计**：
```
┌─────────────────────────────────────┐
│ 组件配置面板                        │
├─────────────────────────────────────┤
│ [基础]                              │
│   按钮文本: [___________]           │
│   按钮类型: [默认 ▼]                │
│   按钮大小: [默认 ▼]                │
│                                     │
│ [图标]                              │
│   前置图标: [选择图标...]           │
│                                     │
│ [条件]                              │
│   显示条件: [表达式构建器...]       │
│                                     │
│ [事件]                              │
│   点击事件: [事件处理器...]         │
└─────────────────────────────────────┘
```

## 三、三个场景的具体实现

### 场景1：条件显示的按钮

**需求**：创建一个按钮，仅在 `formModel.type === 1` 时显示，点击后触发事件

**可视化配置流程**：
1. 用户拖拽"按钮"组件到配置区域
2. 在"基础"分组中设置按钮文本："查询"
3. 在"条件"分组中打开"显示条件"编辑器
   - 选择字段：`formModel.type`
   - 选择操作符：`等于`
   - 输入值：`1`
4. 在"事件"分组中打开"点击事件"编辑器
   - 添加操作："设置字段值"
   - 目标字段：`formModel.status`
   - 值：`"active"`

**生成的配置数据结构**：
```json
{
  "type": "el-button",
  "text": "查询",
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

### 场景2：动态文本块

**需求**：创建一个文本块，能够自定义内容和样式，支持前置图标，文本内容根据 `formModel.type` 动态变化

**可视化配置流程**：
1. 用户拖拽"文本块"组件到配置区域
2. 在"基础"分组中选择"文本内容（表达式）"
   - 打开表达式构建器
   - 构建表达式：`formModel.type === 1 ? "类型A" : "类型B"`
3. 在"图标"分组中选择"前置图标"
   - 选择图标库：Element Plus
   - 选择图标：InfoFilled
4. 在"样式"分组中配置样式
   - 字体大小：14px
   - 颜色：#333333
   - 内边距：8px

**生成的配置数据结构**：
```json
{
  "type": "text",
  "content": {
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
  "prefixIcon": {
    "name": "InfoFilled",
    "library": "element-plus"
  },
  "style": {
    "fontSize": "14px",
    "color": "#333333",
    "padding": "8px"
  }
}
```

### 场景3：render 中的输入框

**需求**：在 appendRender 中创建一个输入框，绑定到 `formModel.emailDomain`，并自定义属性

**可视化配置流程**：
1. 用户选择"输入框"组件
2. 在"基础"分组中配置"绑定字段"
   - 打开字段选择器
   - 选择字段：`formModel.emailDomain`
   - 启用双向绑定
3. 在"基础"分组中设置"占位符"："请选择邮箱域名"
4. 在"状态"分组中配置"是否禁用"
   - 选择"表达式"
   - 构建表达式：`formModel.type === 2`

**生成的配置数据结构**：
```json
{
  "type": "el-input",
  "fieldBinding": {
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
```

## 四、可视化编辑器界面设计

### 4.1 组件选择器

```
┌─────────────────────────────────────┐
│ 组件库                              │
├─────────────────────────────────────┤
│ [基础组件]                          │
│   [按钮] [文本] [输入框] [图标]     │
│                                     │
│ [表单组件]                          │
│   [选择器] [日期] [上传]            │
│                                     │
│ [布局组件]                          │
│   [容器] [分割线]                   │
└─────────────────────────────────────┘
```

### 4.2 属性编辑器

**设计原则**：
- 按分组展示配置项
- 根据 valueType 渲染不同的输入控件
- 支持表达式和静态值切换
- 提供配置项说明和示例

**界面布局**：
```
┌─────────────────────────────────────┐
│ 属性配置                            │
├─────────────────────────────────────┤
│ [基础 ▼]                            │
│   按钮文本: [___________]           │
│   按钮类型: [默认 ▼]                │
│                                     │
│ [样式 ▼]                            │
│   按钮大小: [默认 ▼]                │
│                                     │
│ [条件 ▼]                            │
│   显示条件: [表达式构建器...]       │
│                                     │
│ [事件 ▼]                            │
│   点击事件: [事件处理器...]         │
└─────────────────────────────────────┘
```

### 4.3 表达式构建器

**设计原则**：
- 可视化构建表达式树
- 支持字段选择、值输入、操作符选择
- 支持嵌套条件（且/或）
- 实时预览表达式结果

**界面布局**：
```
┌─────────────────────────────────────┐
│ 表达式构建器                        │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐  ┌──────┐  ┌──────┐  │
│  │字段选择 │  │操作符│  │值输入│  │
│  │[type ▼] │  │[= ▼] │  │[1]   │  │
│  └─────────┘  └──────┘  └──────┘  │
│                                     │
│  [+ 添加条件] [且 ▼]                │
│                                     │
│  预览: formModel.type === 1         │
└─────────────────────────────────────┘
```

### 4.4 事件处理器编辑器

**设计原则**：
- 操作链式编辑
- 每个操作独立配置
- 支持操作顺序调整
- 支持操作删除和复制

**界面布局**：
```
┌─────────────────────────────────────┐
│ 事件处理器                          │
├─────────────────────────────────────┤
│ 操作列表：                          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [设置字段值]              [×]   │ │
│ │   目标字段: [status ▼]         │ │
│ │   值: [表达式构建器...]        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [显示消息]                [×]   │ │
│ │   消息: [操作成功]              │ │
│ │   类型: [成功 ▼]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ 添加操作]                        │
└─────────────────────────────────────┘
```

## 五、数据流转过程

### 5.1 配置阶段

```
用户操作
  ↓
可视化编辑器界面
  ↓
生成 VisualComponentConfig
  ↓
序列化为 JSON
  ↓
存储到数据库/本地存储
```

### 5.2 运行阶段

```
读取 JSON 配置
  ↓
解析为 VisualComponentConfig
  ↓
转换为 ComponentConfig
  (将 ExpressionNode 转换为字符串表达式)
  ↓
转换为 FormSchema
  (将 ComponentConfig 转换为渲染函数)
  ↓
Form 组件渲染
```

### 5.3 转换器实现要点

1. **ExpressionNode → 字符串表达式**
   ```typescript
   function expressionNodeToString(node: ExpressionNode): string {
     if (node.type === 'operator') {
       const left = expressionNodeToString(node.children[0])
       const right = expressionNodeToString(node.children[1])
       return `${left} ${operatorToString(node.operator)} ${right}`
     }
     // ...
   }
   ```

2. **EventHandlerConfig → 函数代码**
   ```typescript
   function eventHandlerToCode(config: EventHandlerConfig): string {
     const actionsCode = config.actions.map(action => {
       if (action.type === 'setField') {
         return `form.${action.setField.field} = ${expressionNodeToString(action.setField.value)}`
       }
       // ...
     }).join('; ')
     return `{{ ${actionsCode} }}`
   }
   ```

3. **VisualComponentConfig → ComponentConfig**
   ```typescript
   function visualToComponent(config: VisualComponentConfig): ComponentConfig {
     return {
       type: config.type,
       props: {
         ...config.props,
         onClick: config.events?.click ? eventHandlerToCode(config.events.click) : undefined
       },
       condition: config.condition ? expressionNodeToString(config.condition.expression) : undefined
     }
   }
   ```

## 六、关键技术点

### 6.1 表达式节点树的构建

- 使用递归数据结构表示表达式
- 支持字段引用、值、操作符、函数调用
- 支持嵌套条件（括号）

### 6.2 配置元数据驱动

- 通过 ConfigItemMetadata 描述每个配置项
- 根据 valueType 动态渲染编辑控件
- 支持配置项之间的依赖关系

### 6.3 字段绑定系统

- 提供字段选择器，列出所有可用字段
- 支持嵌套字段路径（如 `user.name`）
- 支持数组字段（如 `items[0].value`）

### 6.4 事件操作链

- 将复杂的事件处理逻辑拆分为多个操作
- 每个操作独立配置，易于理解
- 支持操作顺序调整

## 七、扩展性考虑

### 7.1 自定义组件支持

- 组件注册时提供配置元数据
- 支持自定义配置项编辑器
- 支持组件特定的表达式函数

### 7.2 表达式函数库

- 预定义常用函数（isEmpty, length, formatDate 等）
- 支持自定义函数注册
- 函数参数的可视化配置

### 7.3 模板系统

- 提供常用配置模板
- 支持模板保存和分享
- 支持配置片段复用

## 八、总结

这个设计方案的核心思想是：

1. **数据结构先行**：设计能够完全序列化的数据结构
2. **元数据驱动**：通过元数据描述配置项，指导界面渲染
3. **可视化构建**：将复杂逻辑拆分为可视化操作
4. **分层转换**：VisualConfig → ComponentConfig → FormSchema

通过这种方式，用户可以完全通过可视化操作完成 render 属性的配置，同时保证配置的完全序列化和可存储性。
