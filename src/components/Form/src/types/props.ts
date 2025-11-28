import { ElForm } from 'element-plus'
import { Slots } from 'vue'

/**
 * 表单插槽规范
 * @description 目前支持自定义FormItem的label插槽以及自定义组件插槽
 * @param key 组件插槽名称取自组件配置的key属性（未配置key属性时取自field属性），若key中包含.会自动转换为-，因此使用插槽时需要注意
 * @example
 * // 例如: 组件key值='userInfo.name'时
 *
 * // 1. 自定义组件插槽
 * <template #userInfo-name={ form }>
 *   <my-input v-model="form.userInfo.name"></my-input>
 * </template>
 *
 * // 2. 自定义表单项标题插槽
 * <template #userInfo-name--label>
 *   <span>自定义标题</span>
 * </template>
 *
 * // 3. 自定义Input组件自身的append插槽: 查询按钮(这个查询按钮位于输入框内)
 * <template #userInfo-name--append={ form }>
 *    <span>查询</span>
 * </template>
 *
 * // 4. 自定义插入一个后置组件: 查询按钮(这个查询按钮位于输入框外)
 * <template #userInfo-name--out-append={ form }>
 *   <el-button>查询</el-button>
 * </template>
 *
 * // 5. 自定义插入一个前置组件: 添加按钮(这个查询按钮位于表格前面)
 * <template #userList--out-prepend={ form }>
 *   <el-button>新增员工</el-button>
 * </template>
 */
export interface FormSlots extends Slots {
  // 自定义组件插槽命名方式 ${key}={ form }
  [key: string]: (form: Recordable) => any
  /**
   * 自定义表单项标题插槽
   * @description 该插槽对应FormItem组件的label插槽
   * 文档: https://cn.element-plus.org/zh-CN/component/form#formitem-slots
   */
  [key: `${string}--label`]: () => any
  /**
   * 自定义表单项错误内容插槽
   * @description 该插槽对应FormItem组件的error插槽
   * 文档: https://cn.element-plus.org/zh-CN/component/form#formitem-slots
   */
  [key: `${string}--error`]: () => any

  /**
   * 自定义组件自身插槽
   * @description 该插槽对应组件自身插槽
   * 例如: Input组件的prefix/suffix/append/prepend插槽
   */
  [key: `${string}--${string}`]: (form: Recordable) => any

  /**
   * 自定义组件前置插槽
   * @description 为了更通用，支持给任何组件的前置直接插入自定义组件
   * 例如：在Table组件插入一个添加按钮
   */
  [key: `${string}--out-prepend`]: (form: Recordable) => any

  /**
   * 自定义组件后置插槽
   * @description 为了更通用，支持给任何组件的后置直接插入自定义组件
   * 例如：在Input组件后面插入一个查询按钮，注意不是在Input输入框内部，而是在后面
   */
  [key: `${string}--out-append`]: (form: Recordable) => any
}

export interface FormEmits {
  (e: 'register', elFormRef: ComponentRef<typeof ElForm>): void
  (e: 'update:stepValue', stepValue: number | null): void
  (e: 'init', form: Recordable): void
  (e: 'change', data: { value: any; field: string }): void
}

/**
 * 全局表单项默认配置
 * @description 为所有表单项添加默认配置，以避免重复劳动
 * @remarks
 * - `layoutProps`: 布局属性({@link FspLayoutProps})
 * - `formItemProps`: 表单项属性({@link FspLayoutFormItemProps})
 * - `componentProps`: 组件属性({@link FspComponentProps})
 * - `descriptionsProps`: 描述块属性({@link FspDescriptionsProps})
 */
export interface FormSchemaProps {
  layoutProps?: FspLayoutProps
  formItemProps?: FspLayoutFormItemProps
  componentProps?: FspComponentProps
  descriptionsProps?: FspDescriptionsProps
}

/**
 * 全局表单项默认配置 - 布局属性
 * @description 为所有表单项添加默认布局属性，以避免重复劳动
 * @remarks
 * - `span`: default: `12`(form) / `1`(desc), 栅格占位格数
 * - `alone`: default: `false`, 是否独占一行
 */
interface FspLayoutProps {
  span?: number
  alone?: boolean
}

/**
 * 全局表单项默认配置 - 表单项属性
 * @description 为所有表单项添加默认表单项属性，以避免重复劳动
 * @remarks
 * - `noLabel`: default: `false`, 所有组件的label不可见
 * - `labelPosition`: default: `right`, 设置所有表单组件的label布局方向
 * - `align`: default: `left`, 描述列的内容对齐方式
 * - `labelAlign`: default: `left`, 设置所有描述列标题对齐方式
 */
interface FspLayoutFormItemProps {
  noLabel?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  align?: 'left' | 'right' | 'top'
  labelAlign?: 'left' | 'center' | 'right'
}

/**
 * 全局表单项默认配置 - 组件属性
 * @description 为所有表单项添加默认组件属性，以避免重复劳动
 * @remarks
 * - `disabled`: default: `false`, 是否自动给所有组件添加disabled属性
 * - `clearable`: default: `true`, 是否自动给所有组件添加clearable属性
 * - `autoPlaceholder`: default: `true`, 是否自动根据组件标题和组件类型生成占位文本
 * - `setPlaceholderInDisabled`: 统一设置表单全局禁用时所有占位文本
 */
interface FspComponentProps {
  disabled?: boolean
  clearable?: boolean
  autoPlaceholder?: boolean
  setPlaceholderInDisabled?: string
}

/**
 * 全局表单项默认配置 - 描述块属性
 * @description 为所有表单项添加默认描述块属性，以避免重复劳动
 * @remarks
 * - `column`: 默认: `3`, 列数
 * - `direction`: 默认: `'horizontal'`, 排列方向
 * - `border`: 默认: `true`, 是否显示边框
 */
interface FspDescriptionsProps {
  column?: number
  direction?: 'vertical' | 'horizontal'
  border?: boolean
}
