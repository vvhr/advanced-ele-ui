# 📝 ChangeLog

English | [简体中文](./CHANGELOG.zh.md)

---
## [0.0.5] - 2025-11-11
### Refactors
* Refactored all component namespaces, replacing the `Zw` prefix with the `Ae` prefix, and updated all `zw-*` prefixed styles and type interfaces accordingly.
* Refactored all component exports, standardized component type naming, now you can freely import the type interfaces from within the component library.
* Refactored the compilation process; it now correctly compiles global component types and other global types, and excludes the component library's internal global type files.
### Docs
* Replaced the default README.md with an English version and added language switching; the original Chinese version has been moved to README.zh.md
* Converted CHANGELOG.md to English and restructured the changelog.
---

## ChangeLog Template

```markdown
## 0.0.0 - 2025-X-X
### Features
* Components [XXX] do something...
* do something...
### Bug fixes
* Components [XXX] do something...
* do something...
### Refactors
* Components [XXX] do something...
* do something...
### Docs
* do something...
```
