import Form from './src/Form.vue'

export type FormDefineProps = InstanceType<typeof Form>['$props']
export type FormInstance = InstanceType<typeof Form>
export type { ComponentName } from './src/types/components'
export type { FormImportItem, FormImportItemConfig } from './src/types/import'
export type { FormSlots, FormEmits, FormSchemaProps } from './src/types/props'
export type { AutoRules } from './src/types/rules'
export type {
  FormSchema,
  FormSchemaBase,
  StepSchema,
  ContainerSchema,
  DecoratorSchema,
  InputerSchema,
  CustomSchema
} from './src/types/schema'
export type { OutsideProps, InsideProps, FormItemProps, LayoutProps } from './src/types/schema'
export type {
  AnyComponentProps,
  ComponentProps,
  ComponentEvent,
  OptionKeys
} from './src/types/schema-component'
export type { FormSchemaType, FormSchemaFn, ComponentEventFn } from './src/types/schema-ext'
export type {
  OutsidePropsDirection,
  OutsidePropsPrependSlot,
  OutsidePropsAppendSlot,
  OutsidePropsPrependRender,
  OutsidePropsAppendRender
} from './src/types/schema-ext'
export type {
  InsidePropsSlots,
  InsidePropsRenders,
  InsidePropsRender
} from './src/types/schema-ext'
export { AUTO_RULES_MAP } from './src/constants'
export { Form }
export default Form
