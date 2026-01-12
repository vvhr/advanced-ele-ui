# 📝 更新日志

简体中文 | [English](./CHANGELOG.md)

---

## [0.2.0] - 2025-01-07

### 新增
* 新增组件 `AeText`：增强文本组件，支持前置图标、圆点、引用块样式、文本高亮匹配及高亮文本点击事件。
  - **文本截断与展开**：支持单行或多行截断，可选展开/收起功能
  - **复制功能**：一键复制文本到剪贴板，支持自定义成功提示
  - **图标自定义**：支持 `iconClass` 和 `iconStyle` 自定义图标样式
  - **圆点样式优化**：圆点现在带有渐变边框和光晕效果，支持悬停动画
* 组件 `AeForm` 新增 `controlled` 属性，用来决定表单值是否“受控”。默认 `false`（非受控）。
  - 受控模式（`controlled: true`）：双向绑定
    - 必须用 `v-model:model` 绑定表单对象。
    - 表单直接读写你传入的 `model`，不再维护内部副本。
    - 不需要 `setValues` / `getFormModel` 做同步。
  - 非受控模式（默认）：单向初始化
    - 你传入的 `model` 只作为初始值。
    - 表单内部维护自己的数据。
    - 取值用 `getFormModel`，更新用 `setValues` / `setValue`。
  - 怎么选：
    - 优先用非受控：更稳、更好控，也避免多个组件同时改同一个对象导致覆盖/顺序冲突，且不会“悄悄改脏”原始数据。
    - 内外同步难做、手动同步成本高时，用受控：直接绑定，省去同步逻辑。 
  
* 组件 `AeDialog` 新增 `close` 事件，用于在窗口关闭时通知父级。
* 组件 `AeForm` 现已支持在 `FormItemProps` 中配置 `addClass` 属性，用于向 `ae-form-item` 元素添加自定义类名。

### 修复Bug
* 组件 [AeForm] 在自动生成占位文本(`autoPlaceholder`)功能中，未对 `InputTag` 组件进行适配，现已修复。

### 已知缺陷
* 组件 [AeForm] 目前未对动态注册的组件适配`autoPlaceholder`、`auto set clearable`等功能，后续将在注册配置中添加。

---

## [0.1.9] - 2025-01-05

### 新增
* 组件 [AeForm] 已全面支持 `desginable` 模式，并新增了 `desginableDirectives` 属性和 `designableColProps` 属性，在`desginable` 模式激活时，所有表单组件同级将支持 `design` 插槽，用于渲染组件设计工具栏，
* 组件 [AeForm] 过去使用 `form` 模式且采用 `labelPosition`: `left` 或 `right` 时，由于没有充足的空间显示，因此不支持设置 `subLabel`，现在已支持，`subLabel`将会显示在 `Tooltip` 标签中。

### 修复Bug
* 修正 `rules.ts` 中校验身份证号码的正则表达式错误。
* 组件 [AeForm] 使用 `desc` 模式时，描述列的宽度属性(`width`,`minWidth`,`labelWidth`)从 `formItemProps` 读取时存在冲突，已迁移至`descriptionsItemProps`，避免冲突。

### 重构
* 组件 [AeForm] 使用 `desc` 模式时，关于描述列的属性配置从`layoutProps`迁移至`descriptionsItemProps`，以便配置结构更清晰和规范。

---

## [0.1.7] - 2025-12-01

### 新增
* 组件 [AeForm] 新增 `change` 事件，在表单字段值变化时触发，包含 `key`、`value` 和 `oldValue` 参数。
* 组件 [AeForm] 新增 `init` 事件，在表单初始化完成时触发。
* 组件 [AeForm] 为描述块标签添加副标题支持，优化样式展示。
* 组件 [AeForm] 新增锚点导航渲染钩子函数，支持自定义锚点导航渲染。

### 修复Bug
* 组件 [AeForm] 修复组件未声明的 `change` 事件问题。
* 组件 [AeForm] 修复描述项必填样式拼接问题。
* 组件 [AeForm] 修复无标题项左边距和标签宽度问题。
* 组件 [AeForm] 修正锚点属性类型及代码格式问题。
* 组件 [AeForm] 修改锚点组件属性类型定义。
* 组件 [AeForm] 自动初始化字段值时允许 `Descriptions` 类型容器。
* 组件 [AeUpload] 优化文件上传流程的异常处理和代码结构。
* 修复核心模块中 Element Plus 组件的已知 slot 警告。
* 修复 UnoCSS 配置中 preflight 的 CSS 变量注入问题。
* 修复表单示例卡片的显示问题。

### 文档
* 示例页面添加表单导航锚点功能演示。

---

## [0.1.6-beta] - 2025-11-27

### 新增
* 组件 [AeForm] 新增锚点导航功能，支持表单字段快速定位。
* 组件 [AeForm] 新增锚点导航渲染钩子函数，支持自定义锚点渲染逻辑。

### 修复Bug
* 组件 [AeForm] 修复无标题项左边距和标签宽度问题。
* 组件 [AeForm] 修正锚点属性类型及代码格式问题。
* 组件 [AeUpload] 优化文件上传流程的异常处理和代码结构。
* 修复核心模块中 Element Plus 组件的已知 slot 警告。
* 修复 UnoCSS 配置中 preflight 的 CSS 变量注入问题。

### 文档
* 示例页面添加表单导航锚点功能演示。

---

## [0.1.5-beta] - 2025-11-26

### 重构
* 组件库核心架构重构，为所有组件统一添加 `withInstall` 安装函数，支持组件独立安装和全局注册。
* 新增 `utils/install.ts` 工具模块，封装 `withInstall` 函数和 `SFCWithInstall` 类型定义。
* 优化组件导出方式，所有组件现在统一使用 `Ae` 前缀导出（如 `AeForm`、`AeTable` 等），同时保持向后兼容。
* 重构 `src/index.ts` 中的组件注册逻辑，使用批量 `app.use` 方式安装所有组件。
* 优化 Vite 构建配置，改进全局类型声明生成逻辑，新增独立的 `global.d.ts` 文件。

### 修复Bug
* 修正全局类型文件路径，从 `./dist/global.d.ts` 调整为 `./global.d.ts`，确保类型定义正确加载。
* 在 `package.json` 的 `files` 字段中添加 `global.d.ts`，确保发布时包含该文件。

---

## [0.1.4-beta] - 2025-11-25

### 新增
* 组件 [AeForm] 新增 `scrollToKey` 方法，支持滚动到指定字段位置。
* 组件 [AeForm] 新增 `scrollRef` 属性，用于指定滚动容器，实现更灵活的滚动定位。
* 组件 [AeForm] 在表单验证失败时自动滚动到第一个错误字段，提升用户体验。
* 新增 `FormExpose` 接口和 `FormInstance` 类型定义，完善表单组件实例类型系统。
* `FormExpose` 接口包含完整的表单操作方法：初始化、获取/设置表单值、批量操作字段、验证及重置等。

### 修复Bug
* 组件 [AeForm] 修复表单滚动定位逻辑，修正 `useForm` 中 `scrollRef` 的容器获取逻辑。
* 组件 [AeForm] 优化错误提示逻辑，确保字段标签正确显示。
* 组件 [AeEditor] 修复类名缺失问题。

### 重构
* 将 `FormInstance` 类型导出至独立文件 `src/components/Form/src/types/instance.ts`。
* 更新 `TableInstance` 类型，合并 `TableExpose` 接口定义。
* 优化 Vite 配置中的组件导入和全局类型声明生成逻辑。

### 文档
* 更新示例代码 [FormExample] 以支持新的滚动功能。

---

## [0.1.3-beta] - 2025-11-25

### 新增
* 组件 [AeForm] 新增表单组件实例类型定义，提供完整的类型支持。

---

## [0.1.2-beta] - 2025-11-24

### 修复Bug
* 组件 [AeDialog] 调整对话框样式以确保正确显示，为滚动条添加盒模型边框计算。
* 组件 [AeDialog] 强制设置对话框内边距为 0 以避免布局偏移。

---

## [0.1.1-beta] - 2025-11-20

### 修复Bug
* 组件 [AeDialog] 修复 `fullscreen` 配置错误。
* 组件 [AeDialog] 修复关闭按钮无效问题。
* 修复 UnoCSS 配置问题。

### 重构
* 移除 `vite.config.demo.ts` 配置文件，简化构建配置。

---

## [0.1.0] - 2025-11-20

### 新增
* 添加 `element-plus-beauty.css` 样式文件支持，现在您可以为 `AeForm` 添加 `class: "element-plus-beauty"` 来启用该样式类。
* 组件库已支持全局一次性引入表单扩展组件和表格扩展组件，您可以在 `app.use(AdvancedEleUI, { formImports: [], tableImports: [] })` 参数中传入扩展组件配置，来启用全局一次性引入。
* 组件 [AeTable] 中关于 `TableSchemaFn` 中已增加参数 `editable`，便于您基于表格可编辑状态实现动态属性。

### 重构
* 未避免与组件事件命名方式混淆，组件 [AeUpload] 原属性 `onDownload` 已更名为 `downloadFile`。

### 修复Bug
* 组件 [AeForm/Group] 未支持暗黑主题，现已修复背景色和边框色，遵循 `element-plus` 的样式变量。
* 在组件 [AeForm] 中使用 `AeTable` 时，`editable` 属性未根据组件的 `disabled` 实现响应式，目前已修正。
* 组件 [AeTable] 对可编辑组件进行 `v-model` 双向绑定时代码错误，已修复。

### 文档
* 示例页 `App.vue` 已支持**主题切换**。

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
