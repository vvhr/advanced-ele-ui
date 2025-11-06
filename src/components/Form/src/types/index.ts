import Form from '../Form.vue'
export * from './components'
export * from './schema'
export * from './rules'
export * from './props'
export * from './schema-component'
export * from './schema-ext'
export type FormProps = InstanceType<typeof Form>['$props']
