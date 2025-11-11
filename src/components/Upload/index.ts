import Upload from './src/Upload.vue'

export type UploadDefineProps = InstanceType<typeof Upload>['$props']
export type UploadInstance = InstanceType<typeof Upload>
export type {
  UploadProps,
  UploadEmits,
  UploadFile,
  UploadRawFile,
  FileKeys,
  FileTemplate
} from './src/types'
export { Upload }
export default Upload
