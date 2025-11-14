import type { Component } from 'vue'
import type { TableFormComponentName } from './types'
import {
  ElCascader,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElAutocomplete,
  ElMention,
  ElTreeSelect,
  ElInputTag
} from 'element-plus'
import { Upload } from '@/components/Upload'

const defaultComponents: Recordable<Component, TableFormComponentName> = {
  /** 输入类组件名 */
  Autocomplete: ElAutocomplete,
  Cascader: ElCascader,
  Checkbox: ElCheckboxGroup,
  DatePicker: ElDatePicker,
  Input: ElInput,
  InputNumber: ElInputNumber,
  InputTag: ElInputTag,
  Mention: ElMention,
  Radio: ElRadioGroup,
  Select: ElSelect,
  Slider: ElSlider,
  Switch: ElSwitch,
  TimePicker: ElTimePicker,
  TimeSelect: ElTimeSelect,
  TreeSelect: ElTreeSelect,
  Upload: Upload
}

/**
 * 定义不同组件的默认值初始化策略
 * 策略函数接收组件的 props，返回 true 表示应初始化为数组 []
 */
const defaultArrayStrategies: Partial<
  Record<TableFormComponentName, (cps: Recordable) => boolean>
> = {
  // 始终为数组的组件
  Checkbox: () => true,
  InputTag: () => true,
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
