import Form from '../Form.vue'
export * from './components'
export * from './schema'
export * from './props'
export * from './schema-component'
export * from './schema-ext'
export * from './import'
export type FormProps = InstanceType<typeof Form>['$props']
