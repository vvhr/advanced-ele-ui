# 📝 更新日志

简体中文 | [English](./CHANGELOG.md)

---
## [0.0.5] - 2025-11-11
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
