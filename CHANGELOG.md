# 📝 更新日志

所有重要的更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。


---
## [0.0.4] - 2025-11-08

- ♻️ 重构：**ZwForm** - 为避免插槽在render外调用的警告，已对表单组件代码进行重构。
- 🔧 修复：**ZwTable** - 修复副标题字体过细的Bug
- ✨ 新增：**ZwEditor** - 面向AI的富文本编辑器
- 📦 依赖：aieditor 1.4.2
- 📖 文档：更新 README.md 使用文档

---
## [0.0.3] - 2025-11-06

- ✨ 新增：**ZwForm** - 高级表单组件
- ✨ 新增：**ZwTable** - 高级表格组件
- ✨ 新增：**ZwIcon** - 图标组件
- 📦 依赖：Vue 3.4 + Element Plus 2.11.7 + TypeScript 5.3.3
- 📦 依赖：@iconify/vue 5.0.0 + @vueuse/core 11.0.0 + lodash-es 4.17.21 + dayjs 1.11.13
- 📦 依赖：Vite 5.0.0 + Less 4.2.0
- 📖 文档：添加 README.md 使用文档
- 📖 文档：添加 CHANGELOG.md 更新日志

---

## 版本说明

### 版本号规则

遵循语义化版本规范 (Semantic Versioning):

- **主版本号 (Major)**: 不兼容的 API 修改
- **次版本号 (Minor)**: 向下兼容的功能性新增
- **修订号 (Patch)**: 向下兼容的问题修正

### 更新类型

- ✨ **新增** - 新功能
- 🔧 **修复** - Bug 修复
- ♻️ **重构** - 代码重构
- ⚡ **性能** - 性能优化
- 📖 **文档** - 文档更新
- 📦 **依赖** - 依赖更新
- 🗑️ **废弃** - 废弃功能
- 💥 **破坏** - 破坏性变更
