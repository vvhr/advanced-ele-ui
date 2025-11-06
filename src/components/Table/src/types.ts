import { ElTable, TableColumnCtx } from 'element-plus'
import Table from './Table.vue'
import { DictItem, DictMap } from '@/types/dict'
import type { VNode, Component } from 'vue'

// ZwTable Emits 事件类型声明
export interface TableEmits {
  (e: 'update:modelValue', value: Recordable[]): void
  (e: 'update:editable', value: boolean): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:page', value: number): void
  (
    e: 'register',
    tableRef: ComponentRef<typeof Table>,
    elTableRef: ComponentRef<typeof ElTable>
  ): void
  (e: 'selection-change', value: Recordable[]): void
  (e: 'page-change', value: number): void
  (e: 'current-change', currentRow: any): void
  (e: 'row-click', row: Recordable): void
  (e: 'value-click', columnKey: string, row: Recordable): void
  (e: 'action', name: string, row: Recordable): void
}

// 透传原生el-table事件
export interface ElTableEventHanders {
  handleSelectionChange: (selection: Recordable[]) => void
  handleCurrentChange: (currentRow: any) => void
  handleRowClick: (row: Recordable) => void
}

/**
 * Table组件属性定义
 * @note 涉及到`<el-table>`的属性会透传给`<el-table>`
 */
export interface TableProps {
  // 双向绑定列表数据
  modelValue: Recordable[]
  // 表格的列配置
  columns: ZwTableColumn[]
  // 表格的参考表单对象数据
  form: Recordable
  // 表格的参考数据
  dataSource: Recordable
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
 * { column.hidden: (row, index, column, form, dataSource) => form.type === '1' }
 * // 根据上下文dataSource的type决定是否隐藏当前列
 * { column.hidden: (row, index, column, form, dataSource) => dataSource.type === '1' }
 * // 根据当前行的状态决定当前行是否可勾选
 * { column.typeProps.selectable: (row, index) => row.status !== '0' }
 * // 自定义格式化某行某列的值
 * { column.formatter: (row, index) => row.money + ' 元' }
 */
export type ZwTableColumnFn<T> = (
  row: Recordable,
  index: number,
  column: ZwTableColumn,
  form: Recordable,
  dataSource: Recordable
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
export type ZwTableColumnType =
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

export type ZwTableColumnTypeProps = {
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
  selectable?: ZwTableColumnFn<boolean>
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
  actions?: ZwTableColumnFn<ZwTableAction[]> | ZwTableAction[]
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
export interface ZwTableColumn {
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
   * @example { headerRender: (r, i, column: ZwTableColumn) => <div>{column.label}</div> }
   */
  headerRender?: ZwTableColumnFn<VNode | string>
  /**
   * 列是否隐藏
   * @default false
   * @description 常用于因业务要求的动态隐藏，属于业务性隐藏，而非功能性隐藏，优先级高于visible属性。
   * @note 当使用ZwTableColumnFn来赋值时，请忽略row和index参数。
   * @example { hidden: (r, i, column: ZwTableColumn, form: any) => form.type === 1 }
   */
  hidden?: ZwTableColumnFn<boolean> | boolean
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
  children?: ZwTableColumn[]
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
  type?: ZwTableColumnType
  // 列类型的可配置属性
  typeProps?: ZwTableColumnTypeProps
  // 列对齐方式
  align?: 'left' | 'center' | 'right'
  // 列标题对齐方式
  headerAlign?: 'left' | 'center' | 'right'
  // 仅在未设置type或type=default时可自定义列文本格式化显示
  formatter?: ZwTableColumnFn<string>
  // 仅在未设置type或type=default时可自定义列渲染组件
  render?: ZwTableColumnFn<VNode | string | number>
  // 超出隐藏
  ellipsis?: boolean
  // 可复制
  copyable?: ZwTableColumnFn<boolean> | boolean
  // 自定义复制内容
  copyValueMethod?: ZwTableColumnFn<string>
  // 可点击
  clickable?: ZwTableColumnFn<boolean> | boolean
  // 自定义点击事件
  clickMethod?: ZwTableColumnFn<void>
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
   * @example { exportValueMethod: (row, index, column: ZwTableColumn) => row.name }
   * @return { string | number }
   */
  exportValueMethod?: ZwTableColumnFn<string | number>
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
  editable?: ZwTableColumnFn<boolean> | boolean
  /**
   * 列编辑组件配置
   * @description 简化版的高级表单组件配置
   */
  editProps?: {
    // 编辑组件(Input/DatePicker/InputNumber) 若未设置默认为Input
    component?: string
    // 编辑字段(若未设置则取当前列的field)
    field?: string
    // 编辑组件的属性
    componentProps?: {
      options: ZwTableColumnFn<any[]> | any[]
    } & Recordable
    // 默认值(添加一行时或未取到field的值时默认显示的值)
    defaultValue?: string | number | boolean | Recordable
    // 校验规则
    rules?: Recordable[]
  }

  // 列是否可合计(Table必须添加showSummary属性)
  summable?: boolean
  // 自定义列合计方法
  summaryMethod?: (values: any[]) => string | VNode

  /**
   * 自定义当前列在TablePlus中的功能
   */
  plusSetting?: {
    // 表格表头管理功能
    /**
     * 表格表头管理功能
     * @default 全部功能
     * @description 在使用TablePlus组件时，会自动根据以下属性激活当前列的`表头管理`
     * @note 设置为`false`时表示关闭当前列的`表头管理`功能
     */
    header?: TablePlusHeaderKey[] | false
  }
  // 兼容其他属性
  [key: string]: any
}

/**
 * 表格表头管理功能键名
 * - drag: 列可拖拽排序
 * - width: 列可设置宽度
 * - fixed: 列可固定
 * - align: 列可设置对齐方式
 * - visible: 列可隐藏
 */
export type TablePlusHeaderKey = 'drag' | 'width' | 'fixed' | 'align' | 'visible'

/**
 * 列按钮属性
 * @description 配置按钮属性
 */
export interface ZwTableAction {
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
   * @example { event: (row, index, column: ZwTableColumn) => console.log(row, index, column) }
   */
  event?: ZwTableColumnFn<void>
  /**
   * 是否加载中
   * @default false
   * @description el-button原生属性，可通过函数赋值，当返回`true`时按钮将显示加载中状态
   * @example { loading: (row, index, column: ZwTableColumn) => true }
   */
  loading?: ZwTableColumnFn<boolean> | false
  /**
   * 是否禁用
   * @default false
   * @description el-button原生属性，可通过函数赋值，当返回`true`时按钮将显示禁用状态
   * @example { disabled: (row, index, column: ZwTableColumn) => true }
   */
  disabled?: ZwTableColumnFn<boolean> | boolean
  /**
   * 是否隐藏
   * @default false
   * @description 可通过函数赋值，当返回`true`时按钮将不显示
   * @example { hidden: (row, index, column: ZwTableColumn) => true }
   */
  hidden?: ZwTableColumnFn<boolean> | boolean
  /**
   * 按钮原生属性透传
   * @description 透传el-button原生属性，可配置`ElButtonProps`中的属性
   */
  buttonAttrs?: ElButtonProps & Recordable
}

/**
 * 以下都为el-button原生属性
 *
 * @property type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | '' // 按钮类型
 * @property size?: 'large' | 'default' | 'small'
 * @property plain?: boolean // 按钮是否朴素
 * @property text?: boolean // 按钮是否文字按钮
 * @property bg?: boolean // 按钮是否背景按钮
 * @property link?: boolean // 按钮是否链接按钮
 * @property round?: boolean // 按钮是否圆角按钮
 * @property circle?: boolean // 按钮是否圆形按钮
 */
export interface ElButtonProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | '' // 按钮类型
  size?: 'large' | 'default' | 'small'
  plain?: boolean // 按钮是否朴素
  text?: boolean // 按钮是否文字按钮
  bg?: boolean // 按钮是否背景按钮
  link?: boolean // 按钮是否链接按钮
  round?: boolean // 按钮是否圆角按钮
  circle?: boolean // 按钮是否圆形按钮
}

export type TableSlotDefault = {
  row: Recordable
  column: any
  $index: number
}
