import { ElTable, type FormItemRule, TableColumnCtx } from 'element-plus'
import { DictItem, DictMap } from '@/types/dict'
import type { VNode, Component, CSSProperties, Slots } from 'vue'
import type { ElButtonProps, OptionKeys } from './internal-types'
import type { TableFormImportItem } from '@/types/imports'

/**
 * 表格插槽
 * @description 通过插槽您可以自定义列的渲染
 * @remarks
 * - `expand`: 当存在`type: expand`类型的列时，您可以通过插槽渲染列展开内容
 * - `x--header`: 所有列的标题可通过`{field}--header`插槽来自定义渲染
 * - `x`: 所有单元格数据列可通过`{field}`插槽来自定义渲染
 */
export interface TableSlots extends Slots {
  [key: string]: (data: TableSlotDefault) => any
  [key: `${string}--header`]: () => any
  expand: (data: TableSlotDefault) => any
}

/**
 * 表格事件
 * @description 表格通过emit发送的事件
 * @remarks
 * - `update:modelValue`: 实现表格数据更新
 * - `update:editable`: 双向绑定表格是否开启全局编辑模式
 * - `update:pageSize`: 双向绑定分页器参数-页容量
 * - `update:page`: 双向绑定分页器参数-当前页
 * - `register`: 表格加载完毕时触发，可以用于获取内部el-table的实例
 * - `selection-change`: el-table表格行选择时触发
 * - `page-change`: 分页器触发change方法
 * - `current-change`:  el-table表格当前行改变时触发
 * - `row-click`:  el-table表格行点击时触发
 * - `value-click`: 当列支持clickable时,表格值点击时触发
 * - `action`: 当存在`type: action`的列时，点击某按钮时触发
 */
export interface TableEmits {
  (e: 'update:modelValue', value: Recordable[]): void
  (e: 'update:editable', value: boolean): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:page', value: number): void
  (e: 'register', elTableRef: ComponentRef<typeof ElTable>): void
  (e: 'selection-change', value: Recordable[]): void
  (e: 'page-change', value: { page: number; pageSize: number }): void
  (e: 'current-change', currentRow: any): void
  (e: 'row-click', row: Recordable): void
  (e: 'value-click', key: string, row: Recordable): void
  (e: 'action', event: { name: string; row: Recordable; index: number }): void
}

/**
 * Table组件属性定义
 * @note 涉及到`<el-table>`的属性会透传给`<el-table>`
 */
export interface TableProps {
  // 双向绑定列表数据
  modelValue: Recordable[]
  // 表格的列配置
  columns: TableColumn[]
  // 表格的参考表单对象数据
  form: Recordable
  // 表格的参考数据
  excontext: Recordable
  // 表格的字典集对象
  dict: DictMap
  // 双向绑定的是否开启全局编辑模式
  editable: boolean
  // 双向绑定的分页器参数-当前页
  page: number
  // 双向绑定的分页器参数-每页数量
  pageSize: number
  // 是否全局超出隐藏(优先级低于column.ellipsis)
  ellipsis: boolean
  // 分页器参数(若undefined或false时则不显示分页器)
  pagination: Pagination | undefined | false
  // 加载状态
  loading: boolean
  // 全局对齐方式(优先级低于column.align)
  align: 'left' | 'center' | 'right'
  // 全局标题对齐方式(优先级低于column.headerAlign)
  headerAlign: 'left' | 'center' | 'right'
  // 尺寸
  size: 'small' | 'default' | 'large'
  // 每行的唯一标识(默认为id)
  rowKey: string
  // 当字段为空时显示的字段值
  emptyValue: string
  // 是否开启组件高宽自适应(如果开启，el-table会根据父级高度自动适应，因此需要确保Table.vue的父级有高度，否则el-table会无法显示)
  adaptive: boolean
  // 是否显示合计行
  showSummary: boolean
  // 自定义合计行逻辑
  summaryMethod: (param: { columns: TableColumnCtx<any>[]; data: any[] }) => (string | VNode)[]
  // 强制组件重新渲染的key
  freshKey: number
  // 加载扩展组件
  imports: TableFormImportItem[]
}

/**
 * 暴露组件接口
 * @description 可通过ref调用的方法
 * @remarks
 * - `updateSelections`: 更新表格选中行
 * - `validate`: 验证表格表单数据
 * - `resetValidate`: 重置表格表单验证
 */
export interface TableExpose {
  updateSelections: (rows: Recordable[]) => void
  validate: () => Promise<boolean>
  resetValidate: () => void
}

/**
 * 分页器配置
 * @description 分页器原生属性，将会直接透传给`<el-pagination>`
 */
export interface Pagination {
  background?: boolean // 是否为分页按钮添加背景色
  total?: number // 总条数
  layout?: string // 组件布局，子组件名用逗号分隔，默认值： total, sizes, prev, pager, next, jumper
  pageSizes?: number[] // 默认值:	[10, 20, 30, 40, 50, 100]
  prevText?: string // 替代图标显示的上一页文字
  prevIcon?: string | Component
  nextText?: string // 替代图标显示的下一页文字
  nextIcon?: string | Component
  disabled?: boolean // 是否禁用分页
  hideOnSinglePage?: boolean // 只有一页时是否隐藏
}

/**
 * 动态列属性方法函数
 * @description 为了统一所有动态函数的调用方法，采用了以下统一的参数结构。
 * 但是以下参数并不始终有效，具体要看该函数是否存在该参数来源
 * 比如：column.hidden，这是一个表列是否隐藏的属性，它与表格的行数据无关，因此row和index是无效的
 * @example
 * // 根据上下文form的type决定是否隐藏当前列
 * { column.hidden: (row, index, column, form, excontext) => form.type === '1' }
 * // 根据上下文excontext的type决定是否隐藏当前列
 * { column.hidden: (row, index, column, form, excontext) => excontext.type === '1' }
 * // 根据当前行的状态决定当前行是否可勾选
 * { column.typeProps.selectable: (row, index) => row.status !== '0' }
 * // 自定义格式化某行某列的值
 * { column.formatter: (row, index) => row.money + ' 元' }
 */
export type TableColumnFn<T> = (
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable,
  editable: boolean
) => T

/**
 * 表格列类型
 * @description 指定表格列的特殊呈现方式及功能类型
 * @default 'default'
 * @typeParam 'default'    - 默认列类型，普通文本展示
 * @typeParam 'radio'      - 单选列，显示单选框
 * @typeParam 'selection'  - 多选列，显示复选框（用于表格行选择）
 * @typeParam 'index'      - 索引列，自动显示行序号
 * @typeParam 'expand'     - 展开列，显示展开/折叠按钮
 * @typeParam 'action'     - 操作列，用于放置操作按钮组
 * @typeParam 'dict'       - 字典列，自动转换字典值显示
 * @typeParam 'date'       - 日期列，自动格式化时间/日期显示
 * @typeParam 'amount'     - 金额列，自动格式化金额显示（如千分位）
 * @typeParam 'sensitive'  - 敏感信息列，自动进行脱敏处理
 */
export type TableColumnType =
  | 'default'
  | 'radio'
  | 'selection'
  | 'index'
  | 'expand'
  | 'action'
  | 'dict'
  | 'date'
  | 'amount'
  | 'sensitive'

export type TableColumnTypeProps = {
  /**
   * 自定义索引列的索引值
   * @default row.$index + 1
   * @notes 仅当 `column.type === 'index'` 时生效。
   */
  index?: number | ((index: number) => number)
  /**
   * 是否叠加索引
   * @default true
   * @description 索引列是否根据分页参数叠加索引值
   * @notes 仅当 `column.type === 'index'` 时生效。
   */
  reserveIndex?: boolean

  /**
   * 函数判断每一行是否可勾选
   * @default true
   * @description 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
   * @notes 仅当 `column.type === 'selection'` 时生效。
   * @example { selectable: (row, index) => true }
   */
  selectable?: TableColumnFn<boolean>
  /**
   * 数据刷新后是否保留选项
   * @default false
   * @description 仅对 type=selection 的列有效，默认值为 false，即刷新或翻页之后已勾选项会清空。设置为 true 后，选项会保存
   * @notes 仅当 `column.type === 'selection'` 时生效，Table组件必须配置`row-key`属性。
   */
  reserveSelection?: boolean

  /**
   * 自定义操作列的按钮组
   * @description 仅对 type=action 的列有效，类型为 Function 或 Array，返回值是一个数组，数组的每一项是一个操作按钮对象
   * @notes 仅当 `column.type === 'action'` 时生效。
   * @example
   * // 查看按钮
   * [{ label: '查看', value: 'detail', icon: 'icon-park-outline:search', event: () => void }]
   * // 修改按钮
   * [{ label: '修改', value: 'edit', icon: 'icon-park-outline:edit', event: () => void }]
   */
  actions?: TableColumnFn<TableAction[]> | TableAction[]
  /**
   * 操作列按钮组下拉菜单属性
   * @description 仅对 type=action 的列有效，类型为 Object，操作列按钮组下拉菜单属性
   */
  actionDropdown?: {
    noIcon?: boolean
    noLabel?: boolean
    size?: ElButtonProps['size']
  }
  /**
   * 全局字典名
   * @description 仅对 type=dict 的列有效，类型为 String，字典名，表格会自动从全局字典中取出字典数组来解析
   * @notes 仅当 `column.type === 'dict'` 时生效。
   */
  dictName?: string
  /**
   * 字典数组
   * @description 仅对 type=dict 的列有效，类型为 Array，字典数组，如果未配置`dictName`，表格会自动解析字典数组来解析字典值
   * @notes 仅当 `column.type === 'dict'` 时生效。
   */
  dictOptions?: DictItem[]
  /**
   * 字典是否是树型
   * @default false
   * @description 仅对 type=dict 的列有效，如果为`true`，则会递归解析字典树结构来解析选项名称
   * @notes 仅当 `column.type === 'dict'` 时生效。
   */
  dictIsTree?: boolean
  /**
   * 字典值是路径
   * @default true
   * @description 仅对 type=dict 的列有效，如果为`true`，则`value`是逗号拼接的路径，否则为最后一级值
   * @notes 仅当 `column.type === 'dict' 且 column.typeProps.dictIsTree === true` 时生效。
   */
  dictValueIsPath?: boolean
  /**
   * 字典标题是否返回完整路径
   * @default true
   * @description 仅对 type=dict 的列有效，如果为`true`，则返回完整路径的标题，否则为最后一级标题
   * @notes 仅当 `column.type === 'dict' 且 column.typeProps.dictIsTree === true` 时生效。
   */
  dictLabelFullpath?: boolean
  /**
   * 字典标题分隔符
   * @default '/'
   * @description 仅对 type=dict 的列有效，自动拼接的路径分隔符
   * @notes 仅当 `column.type === 'dict' 且 column.typeProps.dictIsTree === true` 且 column.typeProps.fullpath === true` 时生效。
   */
  dictLabelSeparator?: string
  /**
   * 字典标题展示类型
   * @default 'text'
   * @description 仅对 type=dict 的列有效，类型为 String，字典视图类型，可选值有 tag、text、dot-tag
   * - tag：标签样式，根据option的属性渲染el-tag，支持icon属性渲染图标
   * - dot-tag：圆点标签样式，根据option的属性渲染el-tag，不支持icon图标
   * - text：文本样式，直接显示选项标题
   * @notes 仅当 `column.type === 'dict' 且 column.typeProps.dictIsTree === false` 时生效。
   */
  dictViewType?: 'tag' | 'text' | 'dot-tag'
  /**
   * 自定义字典标题的展示组件内容
   * @description 当不使用`dictViewType`时，使用本属性可自定义字典标题的展示组件内容
   * @notes 仅当 `column.type === 'dict' 且 column.typeProps.dictIsTree === false 且 column.typeProps.dictViewType === undefined` 时生效。
   * @param originValue 原始字典值
   * @param value 翻译后的值
   * @param option 字典项对象
   */
  dictViewRender?: (originValue: any, value: any, option: any) => VNode | string

  /**
   * 自定义日期格式化规则
   * @default 'YYYY-MM-DD'
   * @description 仅对 type=date 的列有效，类型为 String，日期格式化规则(基于dayjs插件, 格式示例: 'YYYY-MM-DD HH:mm:ss')
   */
  dateFormat?: string

  /**
   * 金额是否显示千分位分隔符
   * @default false
   * @description 仅对 type=amount 的列有效
   */
  amountThousand?: boolean
  /**
   * 金额是否显示小数位
   * @default true
   * @description 仅对 type=amount 的列有效
   */
  amountDecimal?: boolean
  /**
   * 金额小数位数
   * @default 2
   * @description 仅对 type=amount 的列有效
   */
  amountDigits?: number
  /**
   * 金额单位
   * @default ''
   * @description 仅对 type=amount 的列有效，自定义金额单位(例如:$、￥、元)
   */
  amountUnit?: string
  /**
   * 金额单位位置
   * @default 'right'
   * @description 仅对 type=amount 的列有效，金额单位位置
   * - left：金额单位在金额左侧
   * - right：金额单位在金额右侧
   */
  amountUnitPosition?: 'left' | 'right'

  /**
   * 敏感信息加密类型
   * @default ''
   * @description 仅对 type=sensitive 的列有效，类型为 String，敏感信息类型，可选值有 phone、idCard、email
   * - phone：手机号码
   * - idCard：身份证号码
   * - email：邮箱地址
   */
  sensitiveType?: 'phone' | 'idCard' | 'email'
  /**
   * 自定义敏感信息加密匹配规则
   * @description 仅对 type=sensitive 的列有效，类型为 Array，自定义敏感信息加密匹配规则，格式为[正则表达式, 替换值]
   */
  sensitiveRegex?: [RegExp | string, string]
  /**
   * 敏感信息是否允许鼠标hover时显示原文本
   * @default false
   * @description 仅对 type=sensitive 的列有效，如果为`true`，则鼠标hover时显示原文本
   */
  sensitiveHover?: boolean
  // 兼容其他属性
  [key: string]: any
}
/**
 * 表格列定义
 */
export interface TableColumn {
  // 字段名(列默认根据字段名渲染内容)
  field?: string
  // 列唯一标识(对不需要设置field的列必须设置key)
  key?: string
  // 列标题文本
  label?: string
  // 次标题文本
  subLabel?: string
  // 当字段为空时显示的字段值
  emptyValue?: string
  /**
   * 自定义渲染标题
   * @description 自定义渲染标题组件替代默认表头，已定义的column.label和column.subLabel属性将无效，赋值时，请忽略row和index参数。
   * @note 对type=index、type=selection、type=radio、type=expand或多级表头的父表头无效
   * @example { headerRender: (r, i, column: AeTableColumn) => <div>{column.label}</div> }
   */
  headerRender?: TableColumnFn<VNode | string>
  /**
   * 列是否隐藏
   * @default false
   * @description 常用于因业务要求的动态隐藏，属于业务性隐藏，而非功能性隐藏，优先级高于visible属性。
   * @note 当使用AeTableColumnFn来赋值时，请忽略row和index参数。
   * @example { hidden: (r, i, column: AeTableColumn, form: any) => form.type === 1 }
   */
  hidden?: TableColumnFn<boolean> | boolean
  /**
   * 列是否可见
   * @default true
   * @description 通常不需要定义该属性，该属性用途：
   * @note 1. 表格助手，用户侧需要隐藏该列时使用，也就意味着只有hidden属性为true的列才会经过visible的二次控制
   * @note 2. 用于业务逻辑与功能性分离，因业务要求动态隐藏使用column.hidden，因功能性隐藏使用column.visible
   */
  visible?: boolean
  /**
   * 实现多级表头（父+多子表头）
   * @note 注意事项：children中的子表头不支持TablePlus的表头管理功能。
   */
  children?: TableColumn[]
  // 列宽度
  width?: number | string
  // 列最小宽
  minWidth?: string | number
  /**
   * 表格列是否固定
   * @default false
   * @note 列固定时，列宽度必须设置，否则列宽度将无效
   * @example { fixed: true, width: 100 }
   * @typeParam 'true' | 'false' | 'right' | 'left'
   */
  fixed?: string | boolean
  // 表格列类型
  type?: TableColumnType
  // 列类型的可配置属性
  typeProps?: TableColumnTypeProps
  // 列对齐方式
  align?: 'left' | 'center' | 'right'
  // 列标题对齐方式
  headerAlign?: 'left' | 'center' | 'right'
  // 仅在未设置type或type=default时可自定义列文本格式化显示
  formatter?: TableColumnFn<string>
  // 仅在未设置type或type=default时可自定义列渲染组件
  render?: TableColumnFn<VNode | string | number>
  // 超出隐藏
  ellipsis?: boolean
  // 可复制
  copyable?: TableColumnFn<boolean> | boolean
  // 自定义复制内容
  copyValueMethod?: TableColumnFn<string>
  // 可点击
  clickable?: TableColumnFn<boolean> | boolean
  // 自定义点击事件
  clickMethod?: TableColumnFn<void>
  /**
   * 是否可导出
   * @default true
   * @description 服务于TablePlus的导出功能，当设置为`false`时则不可导出
   */
  exportable?: boolean
  /**
   * 自定义导出值
   * @description 服务于TablePlus的导出功能，导出值会默认根据`column.type`或`column.formatter`取值，你也可以通过本函数自定义导出值
   * @note 列导出时，如果使用column.render渲染的列，则必须使用本函数来取值，否则默认输出field字段的值
   * @example { exportValueMethod: (row, index, column: AeTableColumn) => row.name }
   * @return { string | number }
   */
  exportValueMethod?: TableColumnFn<string | number>
  /**
   * 列原生属性透传
   * @description `column`本身拥有一些特殊属性（比如`field`,`label`）经过处理后会传给`<el-table-column>`，
   * 但`<el-table-column>`还有一些其他原生属性，可以放到`column.columnAttrs`中定义
   * @note 优先级高于已处理过的属性，比如`columnAttrs.label`会覆盖`column.label`
   */
  columnAttrs?: {
    columnKey?: string
    sortable?: boolean
    resizable?: boolean
  } & Recordable

  /**
   * 列是否显示编辑组件
   * @default true
   * @note 当`Table`的`editable`为`true`时，表格所有列将根据本字段的值显示编辑组件
   */
  editable?: TableColumnFn<boolean> | boolean
  /**
   * 列编辑组件配置
   * @description 简化版的高级表单组件配置，表格中的表单不应该过于复杂，因此仅支持有限的组件类型和有限的功能
   */
  editProps?: TableColumnEditProps

  // 列是否可合计(Table必须添加showSummary属性)
  summable?: boolean
  // 自定义列合计方法
  summaryMethod?: (values: any[]) => string | VNode

  // /**
  //  * 自定义当前列在TablePlus中的功能
  //  */
  // plusSetting?: {
  //   // 表格表头管理功能
  //   /**
  //    * 表格表头管理功能
  //    * @default 全部功能
  //    * @description 在使用TablePlus组件时，会自动根据以下属性激活当前列的`表头管理`
  //    * @note 设置为`false`时表示关闭当前列的`表头管理`功能
  //    */
  //   header?: TablePlusHeaderKey[] | false
  // }
  // 兼容其他属性
  [key: string]: any
}

export type TableFormComponentName =
  | 'Autocomplete'
  | 'Cascader'
  | 'Checkbox'
  | 'DatePicker'
  | 'Input'
  | 'InputNumber'
  | 'InputTag'
  | 'Mention'
  | 'Radio'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'TimePicker'
  | 'TimeSelect'
  | 'TreeSelect'
  | 'Upload'

/**
 * 表格列可编辑模式配置
 * @description 在此属性中配置可编辑时的组件所需所有属性
 * @properties
 * - `field`: 标识组件的`v-model`绑定值，未设置时默认取TableColumn的`field`属性
 * - `component`: 标识组件名称,未设置时默认为Input
 * - `defaultValue`: 默认值
 * - `componentProps`: 组件属性
 * - `componentEvent`: 组件事件
 * - `formItemProps`: 表单项属性
 * - `insideProps`: 组件内部插槽
 */
export interface TableColumnEditProps {
  field?: string
  component?: TableFormComponentName | string
  defaultValue?: any
  componentProps?: TableFormComponentProps
  componentEvent?: TableFormComponentEvents
  formItemProps?: {
    rules?: FormItemRule[]
    autoRules?: TableFormAutoRules[]
  }
  insideProps?: {
    renders?: TableFormInsidePropsRenders
  }
}

export interface TableFormComponentProps {
  /**
   * 组件强制刷新标志
   * @default 0
   * @description 需要重绘组件时将其值进行更新
   */
  freshKey?: string | number
  /**
   * 是否禁用组件
   * @default false
   * @description 组件是否禁用首先受控于`FormProps.disabled`属性,其次是组件内部定义的`disabled`属性
   */
  disabled?: TableColumnFn<boolean> | boolean
  /**
   * 显示清空按钮
   * @default false
   * @description 当为true时，会显示清空按钮点击后触发onClear事件
   */
  clearable?: boolean
  /**
   * 选项
   * @description 适用于`Select`,`Radio`,`Checkbox`,`Cascader`等组件渲染选项
   */
  options?: TableColumnFn<any[]> | any[]
  /**
   * 自定义选项字段
   * @description 自定义`label`,`value`,`children`等字段名
   */
  optionKeys?: OptionKeys
  // 组件上的style属性
  style?: CSSProperties | string
  /**
   * 占位符
   * @default 默认根据组件类型及组件标题生成
   * @description 适用于`Select` `Input` 等组件
   */
  placeholder?: string
  // 其他组件自身属性
  [key: string]: any
}

/**
 * 列按钮属性
 * @description 配置按钮属性
 */
export interface TableAction {
  /**
   * 按钮文字内容
   * @description 必须设置按钮文字内容，若不希望显示文本，请设置`noLabel`属性为`true`
   */
  label: string
  /**
   * 按钮是否不显示文本
   * @default false
   * @description 当设置为`true`时，按钮在非下拉列表中时将不显示文本
   */
  noLabel?: boolean
  /**
   * 按钮名称
   * @description 按钮名称，用于区分按钮，必须设置按钮名称，否则将无法触发按钮点击事件
   * @example
   * - detail: 详情按钮
   * - edit: 编辑按钮
   */
  name: string // 按钮名称
  /**
   * 按钮图标名称
   * @description 仅支持iconify图标，详情请查看[iconify](https://iconify.design/)
   */
  icon?: string
  /**
   * 按钮是否不显示图标
   * @default false
   * @description 当设置为`true`时，按钮在非下拉列表中时将不显示图标
   */
  noIcon?: boolean
  /**
   * 按钮类型
   * @default ''
   * @description 自动为主按钮和其他按钮设置样式
   * - `primary`: 主按钮样式
   * - `second`: 次按钮样式
   * - `默认`: 默认按钮样式
   */
  type?: 'primary' | 'second' | ''
  /**
   * 合并下拉按钮方式
   * @default 'never'
   * @description 当可见按钮数超过2个时, 会根据本属性将当前按钮合并到`更多`下拉按钮中
   * - `always`: 始终合并到更多按钮中
   * - `auto`: 当按钮宽度超过容器宽度时合并到更多按钮中
   * - `never`: 始终不合并到更多按钮中
   */
  dropdown?: 'always' | 'auto' | 'never'
  /**
   * 按钮点击事件
   * @description 自定义按钮点击事件，虽然Table组件会通过action事件通知父页面，你也可以通过本属性直接配置点击事件
   * @example { event: (row, index, column: AeTableColumn) => console.log(row, index, column) }
   */
  event?: TableColumnFn<void>
  /**
   * 是否加载中
   * @default false
   * @description el-button原生属性，可通过函数赋值，当返回`true`时按钮将显示加载中状态
   * @example { loading: (row, index, column: AeTableColumn) => true }
   */
  loading?: TableColumnFn<boolean> | false
  /**
   * 是否禁用
   * @default false
   * @description el-button原生属性，可通过函数赋值，当返回`true`时按钮将显示禁用状态
   * @example { disabled: (row, index, column: AeTableColumn) => true }
   */
  disabled?: TableColumnFn<boolean> | boolean
  /**
   * 是否隐藏
   * @default false
   * @description 可通过函数赋值，当返回`true`时按钮将不显示
   * @example { hidden: (row, index, column: AeTableColumn) => true }
   */
  hidden?: TableColumnFn<boolean> | boolean
  /**
   * 按钮原生属性透传
   * @description 透传el-button原生属性，可配置`ElButtonProps`中的属性
   */
  buttonAttrs?: ElButtonProps & Recordable
}

export type TableSlotDefault = {
  row: Recordable
  column: any
  $index: number
}

export type TableFormComponentEventFn<T> = (
  event: T,
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable
) => void

export interface TableFormComponentEvents {
  /**
   * 值发生变化时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onChange?: TableFormComponentEventFn<any>
  /**
   * 在点击由 `clearable` 属性生成的清空按钮时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onClear?: TableFormComponentEventFn<void>
  /**
   * 输入框失去焦点时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onBlur?: TableFormComponentEventFn<FocusEvent>
  /**
   * 输入框获得焦点时触发
   * @notes 适用于`Select` `Input` 等组件
   */
  onFocus?: TableFormComponentEventFn<FocusEvent>
  // 其他事件，以element plus的组件文档中的事件为准
  [key: string]: TableFormComponentEventFn<any>
}

/**
 * 渲染插槽类型对象
 * @description 如果你希望直接在schema配置中直接编写组件自身的插槽代码, 你需要将插槽名称添加到renders中, 并返回对应的页面代码
 * @example
 * // 1.Input组件的自身插槽 添加一个查询按钮
 * { insideProps.renders.prepend: (row, index, form, column, excontext) => (
 *  <el-button>查询</el-button>
 * )}
 * // 2.条件判断(动态化) 仅在表单可编辑时添加一个查询按钮
 * { insideProps.renders.append: (row, index, form, column, excontext) => (
 *   if(disabled) return undefined
 *   else return <el-button>查询</el-button>
 * )}
 * // 3.纯文本
 * { insideProps.renders.suffix: '元' }
 */
export type TableFormInsidePropsRenders = Recordable<TableFormInsidePropsRender>
export type TableFormInsidePropsRender = TableColumnFn<VNode | string | false> | false | string

export type TableFormAutoRules =
  | 'isRequired' // 不为空
  | 'isRequiredArray' // 不为空数组
  | 'noSpace' // 不得包含空格
  | 'normalText' // 常规文本 无特殊符号
  | 'isIdCard' // 身份证号码
  | 'isMobilePhone' // 11位手机号码
  | 'isTelephone' // 通用号码
  | 'noChinese' // 无汉字
  | 'isCreditCode' // 统一社会信用代码
  | 'onlyNumber' // 只能输入数字
  | 'onlyLetter' // 只能输入字母
  | 'isEmail' // 邮箱号
