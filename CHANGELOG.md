# 📝 ChangeLog

English | [简体中文](./CHANGELOG.zh.md)

---

## [0.1.8] - 2025-01-05

### Features
* Component [AeForm] now fully supports `desginable` mode, and has added the `desginableDirectives` property and `designableColProps` property. When `desginable` mode is activated, all form components at the same level will support the `design` slot for rendering the component design toolbar.
* The component [AeForm] previously did not support setting `subLabel` when using `labelPosition`: `left` or `right` due to insufficient space for display, but now it is supported, and `subLabel` will be shown in the `Tooltip` label.

### Bug fixes
* Fixed the regular expression error in `rules.ts` for validating ID numbers.
* When using the `desc` mode, the width properties (`width`, `minWidth`, `labelWidth`) for description columns in component [AeForm] were conflicting when read from `formItemProps`, they have been moved to `descriptionsItemProps` to avoid conflicts.

### Refactors
* When using the `desc` mode, the attribute configuration for description columns in component [AeForm] has been moved from `layoutProps` to `descriptionsItemProps`, to make the configuration structure clearer and more standardized.
* The `ComponentEventFn` of component [AeForm] has been changed from passing a single parameter to expanding the parameter list, updating from `(event: any) => (event, form, column, disabled, excontext)` to `(...args) => (...args, form, column, disabled, excontext)`. This change will affect the writing of multi-parameter events, so please check carefully.

---

## [0.1.7] - 2025-12-01

### Features
* Component [AeForm] added `change` event, triggered when form field values change, including `key`, `value`, and `oldValue` parameters.
* Component [AeForm] added `init` event, triggered when form initialization is complete.
* Component [AeForm] added subtitle support for description block labels with optimized styling.
* Component [AeForm] added anchor navigation rendering hook function, supporting custom anchor navigation rendering.

### Bug fixes
* Component [AeForm] fixed undeclared `change` event issue.
* Component [AeForm] fixed description item required style concatenation issue.
* Component [AeForm] fixed left margin and label width issues for items without titles.
* Component [AeForm] corrected anchor property type definitions and code formatting issues.
* Component [AeForm] modified anchor component property type definitions.
* Component [AeForm] allowed `Descriptions` type containers when auto-initializing field values.
* Component [AeUpload] optimized exception handling and code structure for file upload process.
* Fixed known slot warnings for Element Plus components in core module.
* Fixed CSS variable injection issue in UnoCSS preflight configuration.
* Fixed display issues with form example cards.

### Docs
* Added form navigation anchor functionality demonstration to example pages.

---

## [0.1.6-beta] - 2025-11-27

### Features
* Component [AeForm] added anchor navigation functionality, supporting quick positioning of form fields.
* Component [AeForm] added anchor navigation rendering hook function, supporting custom anchor rendering logic.

### Bug fixes
* Component [AeForm] fixed left margin and label width issues for items without titles.
* Component [AeForm] corrected anchor property type definitions and code formatting issues.
* Component [AeUpload] optimized exception handling and code structure for file upload process.
* Fixed known slot warnings for Element Plus components in core module.
* Fixed CSS variable injection issue in UnoCSS preflight configuration.

### Docs
* Added form navigation anchor functionality demonstration to example pages.

---

## [0.1.5-beta] - 2025-11-26

### Refactors
* Refactored the core architecture of the component library, adding `withInstall` installation function to all components, supporting independent installation and global registration.
* Added `utils/install.ts` utility module, encapsulating the `withInstall` function and `SFCWithInstall` type definition.
* Optimized component export approach, all components now use the `Ae` prefix for export (e.g., `AeForm`, `AeTable`, etc.), while maintaining backward compatibility.
* Refactored component registration logic in `src/index.ts`, using batch `app.use` method to install all components.
* Optimized Vite build configuration, improved global type declaration generation logic, and added a standalone `global.d.ts` file.

### Bug fixes
* Fixed global type file path, adjusted from `./dist/global.d.ts` to `./global.d.ts`, ensuring type definitions load correctly.
* Added `global.d.ts` to the `files` field in `package.json` to ensure the file is included during publishing.

---

## [0.1.4-beta] - 2025-11-25

### Features
* Component [AeForm] added `scrollToKey` method, supporting scrolling to a specified field position.
* Component [AeForm] added `scrollRef` property to specify the scroll container, enabling more flexible scroll positioning.
* Component [AeForm] now automatically scrolls to the first error field when form validation fails, improving user experience.
* Added `FormExpose` interface and `FormInstance` type definition, completing the form component instance type system.
* The `FormExpose` interface includes complete form operation methods: initialization, get/set form values, batch field operations, validation and reset, etc.

### Bug fixes
* Component [AeForm] fixed form scroll positioning logic, corrected the container retrieval logic for `scrollRef` in `useForm`.
* Component [AeForm] optimized error message logic, ensuring field labels display correctly.
* Component [AeEditor] fixed missing class name issue.

### Refactors
* Exported `FormInstance` type to a standalone file `src/components/Form/src/types/instance.ts`.
* Updated `TableInstance` type, merging the `TableExpose` interface definition.
* Optimized component import and global type declaration generation logic in Vite configuration.

### Docs
* Updated example code [FormExample] to support the new scroll functionality.

---

## [0.1.3-beta] - 2025-11-25

### Features
* Component [AeForm] added form component instance type definition, providing complete type support.

---

## [0.1.2-beta] - 2025-11-24

### Bug fixes
* Component [AeDialog] adjusted dialog styles to ensure correct display, adding box-sizing border calculation for scrollbars.
* Component [AeDialog] forced dialog padding to 0 to avoid layout shifts.

---

## [0.1.1-beta] - 2025-11-20

### Bug fixes
* Component [AeDialog] fixed `fullscreen` configuration error.
* Component [AeDialog] fixed close button not working issue.
* Fixed UnoCSS configuration issues.

### Refactors
* Removed `vite.config.demo.ts` configuration file, simplifying build configuration.

---

## [0.1.0] - 2025-11-20

### Features
* Add support for the `element-plus-beauty.css` stylesheet, now you can enable this style class by adding `class: "element-plus-beauty"` to `AeForm`.
* The component library now supports global one-time import of form and table extension components. You can enable this by passing the extension component configuration in the `app.use(AdvancedEleUI, { formImports: [], tableImports: [] })` parameter.
* The `TableSchemaFn` in component [AeTable] has added a parameter `editable`, which helps you implement dynamic properties based on the table's editable state.

### Refactors
* To avoid confusion with component event naming, the original property `onDownload` in component [AeUpload] has been renamed to `downloadFile`.

### Bug fixes
* The component [AeForm/Group] was not supporting dark theme, now the background color and border color have been fixed to follow the `element-plus` style variables.
* In component [AeForm] when using `AeTable`, the `editable` property was not responsive to the component's `disabled` state, which has now been corrected.
* There was a code error in component [AeTable] when performing `v-model` two-way binding on editable components, which has been fixed.

### Docs
* The example page `App.vue` now supports **theme switching**.

---

## [0.0.9-beta] - 2025-11-18

### Features
* The entry function `install` of the component library has added a `locale` configuration item to achieve full internationalization functionality for the component library. The default will load the `zh-CN` language, and you can set it to `en-US` if you want to use another language. You can also customize the configuration via `customLocale`. All static text and console messages in this project now support internationalization.
* The dependent plugin `dayjs` will also switch languages according to the current locale of the component library.
* New component [AeDialog], based on `el-dialog`, is re-encapsulated with optimized styles, content area scrolling, support for drag and full screen toggle, and custom title bar buttons.
* New component [AeDrawer], based on `el-drawer`, is re-encapsulated with optimized styles, content area scrolling, and support for custom title bar buttons.
* New components [AeTabs] and [AeTabPanel], based on `el-tabs`, have content areas initialized with `flex` layout and optimized rendering.

### Refactors
* Component [AeTable] has undergone a small-scale refactoring, decoupling the rendering process of columns to facilitate future expansion and improve code readability, without affecting the original functionality.
* The global constant `AUTO_RULES_MAP` has been removed and replaced with the `getAutoRulesMap` method to support internationalization.

### Bug Fixes
* Component [AeEditor] had an abnormal width when `disabled`: `true` and content was empty. Now `width: 100%` has been added to resolve this issue.
* Component [AeTable] had the `watchPage()` function not being destroyed when the component was destroyed, which may cause potential memory leakage risks. This issue has been fixed.
* Component [AeForm] had an issue where the `tree/findNode` function flattened the input parameter `tree`, breaking its immutability and causing the original `schemas` to be abnormally modified during validation. This problem has been fixed by refactoring the `findNode` function.
* Component [AeTable] simplified the strategy for initializing fields with incremental updates when listening for changes in the form structure (`watch(schemasFieldsHash)`), avoiding the monitoring of overly complex data structures.

### Docs
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
