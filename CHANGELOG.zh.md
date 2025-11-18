# 📝 更新日志

简体中文 | [English](./CHANGELOG.md)

---

## [0.0.9-beta] - 2025-11-18

### 新增
* 组件库入口函数 `install` 增加了 `locale` 配置项，以实现组件库的全面国际化功能。现在默认会加载 `zh-CN` 语言，若您期望使用其他语言可设置为 `en-US`。您也可以通过 `customLocale` 来自定义配置。本项目所有静态文字及控制台文字都已支持国际化。
* 依赖插件 `dayjs` 也会根据当前的组件库语言类型切换语言。
* 新增组件 [AeDialog]，基于 `el-dialog` 二次封装，对样式进行优化，内容区优化滚动，支持拖拽、全屏切换，自定义标题栏按钮。
* 新增组件 [AeDrawer]，基于 `el-drawer` 二次封装，对样式进行优化，内容区优化滚动，支持自定义标题栏按钮。
* 新增组件 [AeTabs] 和 [AeTabPanel]，基于 `el-tabs` 二次封装，内容区启动 `flex` 布局，优化渲染。

### 重构
* 组件 [AeTable] 进行了一次小规模重构，将列的渲染过程进行解耦，便于后期扩展和代码可读性，对原有功能无影响。
* 全局常量 `AUTO_RULES_MAP` 已移除，为了支持国际化，现在已改为 `getAutoRulesMap` 方法。

### 修复Bug
* 组件 [AeEditor] 在 `disabled`: `true` 时且内容为空时, 宽度异常, 现在已添加 `width: 100%`来解决。
* 组件 [AeTable] `watchPage()` 函数未在组件销毁时销毁, 可能存在潜在的内存泄露风险, 现在已修复。
* 组件 [AeForm] 由于 `tree/findNode` 函数对入参`tree`进行了展平处理，破坏了入参的只读性，导致 `AeForm` 组件在校验时异常修改了原始`schemas`，现在已重构`findNode`函数修复该问题。
* 组件 [AeTable] 在监听表单结构化变化时(`watch(schemasFieldsHash)`)实现增量更新初始化字段的策略进行了简化, 避免监听过于复杂的数据结构。

### 文档
* 文档 [README.md] 中已增加关于国际化功能的具体用法和说明。
* 页面 [DialogExample] 中已增加关于 `AeDialog` 组件的用法。
* 页面 [DrawerExample] 中已增加关于 `AeDrawer` 组件的用法。
* 页面 [TabsExample] 中已增加关于 `AeTabs` 组件的用法。

---

## [0.0.8-beta] - 2025-11-14

### 新增
* 组件 [AeTable] 增加了 `imports` 属性，用于自定义引入可编辑组件。
* 组件 [AeTable] 增加了 `TableFormComponentName` 类型，现在已支持大部分 `element-plus` 中的输入性组件。
* 组件 [AeTable] 添加了 `editProps.formItemProps` 属性，可配置 `rules` 或 `autoRules` 实现组件校验。

### 重构
* 组件 [AeForm] 的 `rules.ts` 相关类型定义已迁移至 `types/rules.ts`, 以便于复用在 `AeTable` 组件中。
* 组件 [AeTable] 的 `editProps.rules` 属性已迁移至 `editProps.formItemProps.rules`，与 `AeForm` 的 `FormSchema.formItemProps` 保持一致。

### 文档
* 修正文档 [ReadMe] 中关于 `<AeTable>` 的用法错误，将 `data` 替换为 `v-model`。
* 修正页面 [QuickStartExample] 关于 `<AeTable>` 的用法错误，将 `data` 替换为 `v-model`。

---

## [0.0.7-beta] - 2025-11-13

### 新增
* 添加了 `element-plus-beauty.css` 样式类，用于优化原组件在表单禁用场景下的展示效果。您可以通过为 `AeForm` 添加 `class: "element-plus-beauty"` 来启用该样式类。
* 组件 [AeForm] 增加了 `size` 属性，用于设置表单和描述块尺寸。
* 组件 [AeForm] 已支持 `type: desc` 模式，该模式下将基于 `el-descriptions` 实现带边框的描述表单。该模式下所有表单组件都应该被 `type: Descriptions` 的描述块组件包裹，未被包裹的组件将被忽略。
* 组件 [AeForm] 的 `schemaProps` 属性新增了 `formItemProps.align`,`formItemProps.labelAlign` 用于全局配置描述列属性。
* 组件 [AeForm] 的 `schemaProps` 属性新增了 `descriptionsProps` 用于全局配置所有描述块属性。
* 组件 [AeForm] 的 `schemaProps` 属性新增了 `componentProps.setPlaceholderInDisabled` 可用于设置表单被全局禁用时的占位文本。
* 组件 [AeForm] 的 `schemas` 属性类型接口 `FormSchema` 新增了 `DescriptionsSchema` 类型接口，当您设置 `type: Descriptions` 时即可创建描述块组件。

### 修复Bug
* 正式修复了组件全局类型，现在您可以在 `tsconfig.json` 中添加 `"compilerOptions": { "types": ["advanced-ele-ui/global"] }` 来激活IDE对全局组件的识别。
* 组件 [AeEditor] 在更新 `modelValue` 会强制触发 `focus`，现在已去除。

### 重构
* 组件 [AeForm] 原属性 `dataSource` 已更名为 `excontext`，以便更符合命名规范。
* 组件 [AeTable] 原属性 `dataSource` 已更名为 `excontext`，以便更符合命名规范。

### 文档
* 页面 [FormExample] 已增加当 `AeForm` 的属性为 `type: desc` 时的描述表单示例。

---

## [0.0.6] - 2025-11-11
### 重构
* 重构了所有组件命名空间，将 `Zw` 前缀替换为 `Ae` 前缀，并相应更新替换了所有 `zw-*` 前缀的样式和类型接口。
* 重构了所有组件导出，统一了组件类型命名，现在您可以从组件库内自由导出类型接口。
* 重构了编译流程；现在可正确编译全局组件类型及其它全局类型，并排除了组件库内部的全局类型文件。

### 文档
* 将默认的 `README.md` 替换为英文版本并添加了语言切换；原始的中文版本已移至 `README.zh.md`
* 将 `CHANGELOG.md` 转为英文并重构了变更日志。
---

## 日志模板

```markdown
## 0.0.0 - 2025-X-X
### 新增
* 组件 [XXX] do something...
* do something...
### 修复Bug
* 组件 [XXX] do something...
* do something...
### 重构
* 组件 [XXX] do something...
* do something...
### 文档
* do something...
```
