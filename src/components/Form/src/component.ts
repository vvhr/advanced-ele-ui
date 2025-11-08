import type { Component } from 'vue'
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElAlert,
  ElCard,
  ElImage,
  ElResult,
  ElSegmented,
  ElMention,
  ElTreeSelect,
  ElInputTag
} from 'element-plus'
import { ZwTable } from '@/components/Table'
import Group from './components/Group.vue'
import Blank from './components/Blank.vue'
import { Editor } from '@/components/Editor'
import { ComponentName } from '@/components/Form'

const componentMap: Recordable<Component, ComponentName> = {
  /** 容器类组件 */
  Group: Group,
  Blank: Blank,
  /** 装饰类组件名 */
  Alert: ElAlert,
  Divider: ElDivider,
  Image: ElImage,
  Result: ElResult,
  /** 输入类组件名 */
  Autocomplete: ElAutocomplete,
  Cascader: ElCascader,
  Checkbox: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  ColorPicker: ElColorPicker,
  DatePicker: ElDatePicker,
  Editor: Editor,
  Input: ElInput,
  InputNumber: ElInputNumber,
  InputTag: ElInputTag,
  Mention: ElMention,
  Radio: ElRadioGroup,
  RadioButton: ElRadioGroup,
  Rate: ElRate,
  Segmented: ElSegmented,
  Select: ElSelect,
  Slider: ElSlider,
  Switch: ElSwitch,
  Table: ZwTable,
  TimePicker: ElTimePicker,
  TimeSelect: ElTimeSelect,
  Transfer: ElTransfer,
  TreeSelect: ElTreeSelect
}

export { componentMap }
