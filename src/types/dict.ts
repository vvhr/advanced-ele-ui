// 选项用途
export type Useful = 'read' | 'edit'

export type DictItem = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
  useful?: Useful[]
  children?: DictItem[]
  // el-tag原生事项
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''
  color?: string // 定义颜色样式
  icon?: string // 定义图标(仅支持iconify图标, 不支持element-plus图标)
  hit?: boolean
  effect?: 'dark' | 'light' | 'plain'
  round?: boolean
}

export type DictMap = Record<string, DictItem[]>
