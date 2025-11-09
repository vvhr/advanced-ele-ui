export type ComponentName = ContainerName | DecoratorName | InputerName

/**
 * 容器类组件名
 * @description 容器类组件，用于包裹其他组件
 * - Group: 具有标题/副标题/折叠展开功能的卡片型容器组件
 * - Blank: 空白容器组件，该组件无可见样式，一般用于统一控制子组件的显隐
 */
export type ContainerName = 'Group' | 'Blank'

/**
 * 装饰类组件名
 * @description 装饰类组件，一般用于展示信息
 * - Divider: 分割线组件，采用el-divider组件渲染，支持原生所有属性功能
 * - Alert: 警告提示组件，采用el-alert组件渲染，支持原生所有属性功能
 * - Image: 图片组件，采用el-image组件渲染，支持原生所有属性功能
 * - Result: 结果组件，采用el-result组件渲染，支持原生所有属性功能
 */
export type DecoratorName = 'Divider' | 'Alert' | 'Image' | 'Result'

/**
 * 输入类组件名
 * @description 输入类组件，一般用于用户输入信息
 * - Autocomplete: 自动完成组件，采用el-autocomplete组件渲染，支持原生所有属性功能
 * - Cascader: 级联选择框组件，采用el-cascader组件渲染，根据componentProps.options属性渲染el-cascader-panel
 * - Checkbox: 多选框组件，采用el-checkbox-group组件渲染，根据componentProps.options属性渲染el-checkbox
 * - CheckboxButton: 多选框按钮组件，采用el-checkbox-group组件渲染，根据componentProps.options属性渲染el-checkbox-button
 * - ColorPicker: 颜色选择器组件，采用el-color-picker组件渲染，支持原生所有属性功能
 * - DatePicker: 日期选择器组件，采用el-date-picker组件渲染，支持原生所有属性功能
 * - Editor: 富文本组件，采用zw-editor组件渲染
 * - Input: 输入框组件，采用el-input组件渲染，支持原生所有属性功能
 * - InputNumber: 数字输入框组件，采用el-input-number组件渲染，支持原生所有属性功能
 * - Mention: 提及组件，采用el-mention组件渲染，支持原生所有属性功能
 * - Radio: 单选框组件，采用el-radio-group组件渲染，根据componentProps.options属性渲染el-radio
 * - RadioButton: 单选框按钮组件，采用el-radio-group组件渲染，根据componentProps.options属性渲染el-radio-button
 * - Rate: 评分组件，采用el-rate组件渲染，支持原生所有属性功能
 * - Segmented: 分段器组件，采用el-segmented组件渲染，支持原生所有属性功能
 * - Select: 下拉选择框组件，采用el-select组件渲染，根据componentProps.options属性渲染el-option
 * - Slider: 滑块组件，采用el-slider组件渲染，支持原生所有属性功能
 * - Switch: 开关组件，采用el-switch组件渲染，支持原生所有属性功能
 * - Table: 表格组件，采用zw-table组件渲染
 * - TimePicker: 时间选择器组件，采用el-time-picker组件渲染，支持原生所有属性功能
 * - TimeSelect: 时间选择器组件，采用el-time-select组件渲染，支持原生所有属性功能
 * - Transfer: 穿梭框组件，采用el-transfer组件渲染，支持原生所有属性功能
 */
export type InputerName =
  | 'Radio'
  | 'RadioButton'
  | 'Checkbox'
  | 'CheckboxButton'
  | 'Input'
  | 'InputTag'
  | 'Autocomplete'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'TimeSelect'
  | 'TreeSelect'
  | 'Table'
  | 'Mention'
  | 'Segmented'
  | 'Editor'
  | 'Upload'
