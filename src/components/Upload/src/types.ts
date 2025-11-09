/**
 * 文件上传组件类型定义
 */

// 原始文件对象
export interface UploadRawFile extends File {
  uid?: string
}

// 用户业务文件对象（字段由用户自定义）
export interface UploadFile {
  [key: string]: any
}

// 文件状态（组件内部使用）
export type UploadStatus = 'uploading' | 'success' | 'fail'

// 内部文件对象（包含状态）
export interface InternalUploadFile {
  uid: string
  status: UploadStatus
  rawFile?: UploadRawFile
  data?: UploadFile
  imageLoadError?: boolean
}

// 文件键映射
export interface FileKeys {
  name: string
  url: string
}

// 示例图/模板
export interface FileTemplate {
  name: string
  url: string
}

// 组件属性
export interface UploadProps {
  modelValue?: UploadFile[]
  fileKeys?: FileKeys
  upload?: (file: UploadRawFile) => Promise<UploadFile | false>
  multiple?: boolean
  accept?: string
  limit?: number
  size?: 'small' | 'default' | 'large'
  sizeLimit?: string | number
  disabled?: boolean
  listType?: 'picture' | 'text'
  examples?: FileTemplate[]
  templates?: FileTemplate[]
  tips?: string
  autoCompress?: boolean
  previewable?: boolean
  downloadable?: boolean
  preview?: (file: UploadFile) => void
  onDownload?: (file: UploadFile) => void
  beforeUpload?: (file: UploadRawFile) => boolean | Promise<boolean>
  beforeRemove?: (file: UploadFile) => boolean | Promise<boolean>
  downloadTemplate?: (template: FileTemplate) => void
}

// 组件事件
export interface UploadEmits {
  (e: 'update:modelValue', fileList: UploadFile[]): void
  (e: 'change', fileList: UploadFile[]): void
  (e: 'upload', file: UploadFile): void
  (e: 'remove', file: UploadFile): void
  (e: 'preview', file: UploadFile): void
}
