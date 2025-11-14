export interface ElTableEventHanders {
  handleSelectionChange: (selection: Recordable[]) => void
  handleCurrentChange: (currentRow: any) => void
  handleRowClick: (row: Recordable) => void
}

/**
 * ElButtonProps
 * @description el-button原生属性
 * @remarks
 * - `type`: 按钮类型
 * - `size`: 按钮尺寸
 * - `plain`: 按钮是否朴素
 * - `text`: 按钮是否文字按钮
 * - `bg`: 按钮是否背景按钮
 * - `link`: 按钮是否链接按钮
 * - `round`: 按钮是否圆角按钮
 * - `circle`: 按钮是否圆形按钮
 */
export interface ElButtonProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  text?: boolean
  bg?: boolean
  link?: boolean
  round?: boolean
  circle?: boolean
}

export type OptionKeys = {
  label?: string // 自定义标题字段名
  value?: string // 自定义取值字段名
  children?: string // 自定义子级字段名
  disabled?: string // 自定义禁用字段名
}
