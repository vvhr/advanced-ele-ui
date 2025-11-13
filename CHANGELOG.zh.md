# 📝 更新日志

简体中文 | [English](./CHANGELOG.md)

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
