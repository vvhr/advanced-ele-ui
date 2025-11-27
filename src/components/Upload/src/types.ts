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
  // 支持扩展
  [key: string]: any
}

/**
 * 上传组件属性
 * @description 上传组件属性
 * @remarks
 * - `modelValue`: 双向绑定业务系统的文件列表, 务必含有文件名称和文件预览地址的字段
 * - `fileKeys`: 文件列表的键映射，默认为 { name: 'name', url: 'url' }, 用于获取文件名称和文件预览地址
 * - `upload`: 上传文件处理函数，返回一个 Promise，resolve 返回业务系统的文件对象，reject 返回 false. 或直接返回false表示上传失败
 * - `multiple`: 是否支持多文件选择, 默认为 false, 透传给 input 组件
 * - `accept`: 接受的文件类型, 默认为 '*', 透传给 input 组件
 * - `limit`: 最大上传文件数量, 默认为不限制, 如果为单文件上传请设置为 1
 * - `size`: 组件尺寸, 默认为 'default'
 * - `sizeLimit`: 文件大小限制, 默认为不设限制, 默认单位为 MB
 * - `disabled`: 是否禁用上传组件, 默认为 false
 * - `listType`: 文件列表类型, 默认为 'picture', 可选值有 'picture' | 'text'
 * - `objectFit`: 图片填充模式, 默认为 'fill', 可选值有 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
 * - `examples`: 示例图列表, 默认不显示, 示例对象: {@link FileTemplate}
 * - `templates`: 模板列表, 默认不显示, 示例对象: {@link FileTemplate}
 * - `tips`: 提示信息, 默认不显示
 * - `autoCompress`: 是否自动压缩图片, 默认为 false
 * - `previewable`: 是否允许预览文件, 默认为 true
 * - `downloadable`: 是否允许下载文件, 默认为 false
 * - `preview`: 文件预览处理函数, 未定义时将仅对图片文件根据url进行预览
 * - `downloadFile`: 文件下载处理函数, 未定义时将仅对图片文件根据url进行下载
 * - `beforeUpload`: 上传文件前的处理函数, 返回 true 或 Promise<true> 表示允许上传, 返回 false 或 Promise<false> 表示不允许上传
 * - `beforeRemove`: 删除文件前的处理函数, 一般用于删除前检查及调用API删除云盘文件, 返回 true 或 Promise<true> 表示允许删除, 返回 false 或 Promise<false> 表示不允许删除.
 * - `downloadTemplate`: 模板下载处理函数, 未定义时将仅对模板文件根据url进行下载
 */
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
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  examples?: FileTemplate[]
  templates?: FileTemplate[]
  tips?: string
  autoCompress?: boolean
  previewable?: boolean
  downloadable?: boolean
  preview?: (file: UploadFile) => void
  downloadFile?: (file: UploadFile) => void
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
