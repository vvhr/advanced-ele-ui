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
}

export interface SchemaProps {
  layoutProps?: {
    span?: number // 默认: 12, 设置所有组件的栅格占位格数
    alone?: boolean // 默认: false, 设置所有组件是否都独占一行
  }
  formItemProps?: {
    noLabel?: boolean // 默认: false, 设置所有组件的label不可见
    labelPosition?: 'left' | 'right' | 'top' // 默认: right 设置所有组件的label布局方向
  }
  componentProps?: {
    disabled?: boolean // 默认: false, 是否自动给所有组件添加disabled属性
    clearable?: boolean // 默认: true, 是否自动给所有组件添加clearable属性
    autoPlaceholder?: boolean // 默认: true, 是否自动根据组件标题和组件类型生成占位文本
  }
}
