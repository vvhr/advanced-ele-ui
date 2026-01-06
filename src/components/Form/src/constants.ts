import type { DescriptionsProps, InputerName } from './types'

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

export const needClearable: InputerName[] = [
  'Autocomplete',
  'Cascader',
  'DatePicker',
  'Editor',
  'Input',
  'InputNumber',
  'InputTag',
  'Mention',
  'Select',
  'TimePicker',
  'TimeSelect'
]
export const needOptions: InputerName[] = ['Select', 'Cascader', 'Transfer', 'Segmented', 'Mention']
export const noNeedOptions: InputerName[] = ['RadioButton', 'CheckboxButton', 'Radio', 'Checkbox']
export const dateRangeTypes = [
  'years',
  'months',
  'dates',
  'datetimerange',
  'daterange',
  'monthrange',
  'yearrange'
]
export const needInputPlaceholder: InputerName[] = [
  'Autocomplete',
  'Editor',
  'Input',
  'InputNumber',
  'Mention',
  'InputTag'
]
export const needSelectPlaceholder: InputerName[] = [
  'Cascader',
  'DatePicker',
  'Select',
  'TimePicker',
  'TimeSelect'
]
export const COMPONENTS_NEEDING_REF = ['Table']
