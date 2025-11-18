# 📝 ChangeLog

English | [简体中文](./CHANGELOG.zh.md)

---

## [0.0.9-beta] - 2025-11-18

### New Features
* The entry function `install` of the component library has added a `locale` configuration item to achieve full internationalization functionality for the component library. The default will load the `zh-CN` language, and you can set it to `en-US` if you want to use another language. You can also customize the configuration via `customLocale`. All static text and console messages in this project now support internationalization.
* The dependent plugin `dayjs` will also switch languages according to the current locale of the component library.
* New component [AeDialog], based on `el-dialog`, is re-encapsulated with optimized styles, content area scrolling, support for drag and full screen toggle, and custom title bar buttons.
* New component [AeDrawer], based on `el-drawer`, is re-encapsulated with optimized styles, content area scrolling, and support for custom title bar buttons.
* New components [AeTabs] and [AeTabPanel], based on `el-tabs`, have content areas initialized with `flex` layout and optimized rendering.

### Refactoring
* Component [AeTable] has undergone a small-scale refactoring, decoupling the rendering process of columns to facilitate future expansion and improve code readability, without affecting the original functionality.
* The global constant `AUTO_RULES_MAP` has been removed and replaced with the `getAutoRulesMap` method to support internationalization.

### Bug Fixes
* Component [AeEditor] had an abnormal width when `disabled`: `true` and content was empty. Now `width: 100%` has been added to resolve this issue.
* Component [AeTable] had the `watchPage()` function not being destroyed when the component was destroyed, which may cause potential memory leakage risks. This issue has been fixed.
* Component [AeForm] had an issue where the `tree/findNode` function flattened the input parameter `tree`, breaking its immutability and causing the original `schemas` to be abnormally modified during validation. This problem has been fixed by refactoring the `findNode` function.
* Component [AeTable] simplified the strategy for initializing fields with incremental updates when listening for changes in the form structure (`watch(schemasFieldsHash)`), avoiding the monitoring of overly complex data structures.

### Documentation
* The document [README.md] has added specific usage and explanations about the internationalization feature.
* The page [DialogExample] has added usage examples for the `AeDialog` component.
* The page [DrawerExample] has added usage examples for the `AeDrawer` component.
* The page [TabsExample] has added usage examples for the `AeTabs` component.


---

## [0.0.8-beta] - 2025-11-14

### Features
* Component [AeTable] has added the `imports` property to customize the import of editable components.
* Component [AeTable] has added the `TableFormComponentName` type, now supporting most input components from `element-plus`.
* Component [AeTable] has added the `editProps.formItemProps` property, which allows configuration of `rules` or `autoRules` to achieve component validation.

### Refactors
* The `rules.ts` related type definitions for component [AeForm] have been moved to `types/rules.ts`, to facilitate reuse in the [AeTable] component.
* The `editProps.rules` property for component [AeTable] has been moved to `editProps.formItemProps.rules`, aligning with `FormSchema.formItemProps` in [AeForm].

### Docs
* Fixed the usage error in the document [ReadMe] regarding `<AeTable>`, replacing `data` with `v-model`.
* Fixed the usage error on the page [QuickStartExample] regarding `<AeTable>`, replacing `data` with `v-model`.

---

## [0.0.7-beta] - 2025-11-13

### Features
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
