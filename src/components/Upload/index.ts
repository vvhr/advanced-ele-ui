import Upload from './src/Upload.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeUpload: SFCWithInstall<typeof Upload> = withInstall(Upload)
export default AeUpload

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

// 兼容旧的导出方式
export { AeUpload as Upload }
