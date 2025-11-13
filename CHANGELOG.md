# 📝 ChangeLog

English | [简体中文](./CHANGELOG.zh.md)

---

## [0.0.7-beta] - 2025-11-13

### 新增
* Added the `element-plus-beauty.css` class to optimize the display of original components in form disabled scenarios. You can enable this class by adding `class: "element-plus-beauty"` to `AeForm`.
* Component [AeForm] has added the `size` property to set the size of the form and description blocks.
* Component [AeForm] now supports the `type: desc` mode, which will implement a description form with borders based on `el-descriptions`. In this mode, all form components should be wrapped by the description block component with `type: Descriptions`, and any un-wrapped components will be ignored.
* The `schemaProps` property of component [AeForm] has added `formItemProps.align` and `formItemProps.labelAlign` for global configuration of description column properties.
* The `schemaProps` property of component [AeForm] has added `descriptionsProps` for global configuration of all description block properties.
* The `schemaProps` property of component [AeForm] has added `componentProps.setPlaceholderInDisabled` to set the placeholder text when the form is globally disabled.
* The `schemas` property type interface `FormSchema` of component [AeForm] has added the `DescriptionsSchema` type interface. You can create a description block component by setting `type: Descriptions`.

### Bug fixes
* Officially fixed the global type of the component. Now you can add `"compilerOptions": { "types": ["advanced-ele-ui/global"] }` to `tsconfig.json` to activate the IDE's recognition of global components.
* The component [AeEditor] no longer forces a `focus` when updating `modelValue`.

### Refactors
* The original property `dataSource` of component [AeForm] has been renamed to `excontext` to better conform to naming conventions.
* The original property `dataSource` of component [AeTable] has been renamed to `excontext` to better conform to naming conventions.

### Docs
* The page [FormExample] has added an example of the description form when the property of `AeForm` is set to `type: desc`.

---

## [0.0.6] - 2025-11-11
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
