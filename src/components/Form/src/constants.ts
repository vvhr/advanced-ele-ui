import type { DescriptionsProps } from './types'

export const DEFAULT_DESCS_ATTRS: DescriptionsProps = {
  border: true,
  column: 3,
  direction: 'horizontal'
}

export const SchemaType = {
  STEP: 'Step',
  CONTAINER: 'Container',
  DECORATOR: 'Decorator',
  INPUTER: 'Inputer',
  CUSTOM: 'Custom',
  DESCRIPTIONS: 'Descriptions'
} as const

export const needClearable = [
  'Autocomplete',
  'Cascader',
  'DatePicker',
  'Editor',
  'Input',
  'InputNumber',
  'Mention',
  'Select',
  'TimePicker',
  'TimeSelect'
]
export const needOptions = ['Select', 'Radio', 'Checkbox', 'Cascader', 'Transfer', 'Segmented']
export const noNeedOptions = ['RadioButton', 'CheckboxButton']
export const dateRangeTypes = [
  'years',
  'months',
  'dates',
  'datetimerange',
  'daterange',
  'monthrange',
  'yearrange'
]
