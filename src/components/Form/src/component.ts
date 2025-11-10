import type { Component } from 'vue'
import type { ComponentName } from './types'
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
import { Upload } from '@/components/Upload'

const defaultComponents: Recordable<Component, ComponentName> = {
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
  TreeSelect: ElTreeSelect,
  Upload: Upload
}

/**
 * 定义不同组件的默认值初始化策略
 * 策略函数接收组件的 props，返回 true 表示应初始化为数组 []
 */
const defaultArrayStrategies: Partial<Record<ComponentName, (cps: Recordable) => boolean>> = {
  // 始终为数组的组件
  Checkbox: () => true,
  CheckboxButton: () => true,
  Table: () => true,
  InputTag: () => true,
  Transfer: () => true,
  // 根据 componentProps 条件判断的组件
  Select: (cps: Recordable) => !!cps.multiple,
  TreeSelect: (cps: Recordable) => !!cps.multiple,
  TimePicker: (cps: Recordable) => !!cps.isRange,
  DatePicker: (cps: Recordable) => {
    const rangeTypes = [
      'years',
      'months',
      'dates',
      'datetimerange',
      'daterange',
      'monthrange',
      'yearrange'
    ]
    return rangeTypes.includes(cps.type)
  },
  Cascader: (cps: Recordable) => {
    // 根据 el-cascader 文档，默认 multiple=false, emitPath=true
    // 只有当 multiple=false 且 emitPath=false 时，值才不是数组
    const cascaderProps = { multiple: false, emitPath: true, ...cps.props }
    return !(cascaderProps.multiple === false && cascaderProps.emitPath === false)
  }
}

export { defaultComponents, defaultArrayStrategies }
