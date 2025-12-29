import Form from './src/Form.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeForm: SFCWithInstall<typeof Form> = withInstall(Form)
export default AeForm

export type FormDefineProps = InstanceType<typeof Form>['$props']
export type { FormInstance, FormExpose } from './src/types/instance'
export type { ComponentName } from './src/types/components'
export type { FormSlots, FormEmits, FormSchemaProps, DesignableColProps } from './src/types/props'
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
export type {
  FormSchemaType,
  FormSchemaFn,
  ComponentEventFn,
  FormSchemaDomFn
} from './src/types/schema-ext'
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

// 兼容旧的导出方式
export { AeForm as Form }
