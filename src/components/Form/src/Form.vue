<script lang="tsx">
import {
  defineComponent,
  type PropType,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  unref,
  toRaw,
  CSSProperties
} from 'vue'
import { FormSchema, FormSchemaProps } from './types'
import type { FormImportItem } from '@/types/imports'
import { useRenderForm } from './render/useRenderForm'
import { useForm } from './hook/useForm'
import { useRenderAnchor } from './render/useRenderAnchor'
import { useImport } from './hook/useImport'
export default defineComponent({
  name: 'AeForm',
  props: {
    // 表单数据对象
    model: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    // 表单组件配置项
    schemas: {
      type: Array as PropType<FormSchema[]>,
      default: () => []
    },
    // 双向绑定-当前步骤值
    stepValue: {
      type: [Number, null],
      default: null
    },
    /**
     * 表单禁用状态
     * @default false
     * @description 表单禁用状态,将控制表单内所有组件的禁用状态，当值为`true`时,优先级高于每个组件的`disabled`属性
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 表单类型
     * @default 'form'
     * @description 表单类型，默认为`form`，可选值为`form`或`desc`
     * - `form`: 常规模式
     * - `desc`: 描述模式，通过el-descriptions组件包裹
     */
    type: {
      type: String as PropType<'form' | 'desc'>,
      default: 'form'
    },
    /**
     * 表单尺寸
     */
    size: {
      type: String as PropType<'small' | 'default' | 'large'>,
      default: 'default'
    },
    /**
     * 是否为设计模式
     * @default false
     * @description 是否为设计模式，将显示设计模式下的工具栏以及允许组件被拖拽
     */
    designable: {
      type: Boolean,
      default: false
    },
    /**
     * 表单扩展上下文
     * @description 表单扩展上下文，您可以通过此属性来传递一些额外的数据给表单，表单会自动将此数据传递给所有组件来实现数据联动
     */
    excontext: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    /**
     * 表单组件配置项默认配置
     * @description 针对一些特殊场景,避免重复对所有schema进行配置，可在本属性中统一配置
     */
    schemaProps: {
      type: Object as PropType<FormSchemaProps>,
      default: () => ({})
    },
    // 表单标题宽度
    labelWidth: {
      type: [String, Number],
      default: '120px'
    },
    // 表单校验不通过时是否额外弹出提示消息块
    showErrorNotice: {
      type: Boolean,
      default: true
    },
    // 传入滚动条的Ref,当校验不通过时自动滚动到第一个错误项
    scrollRef: {
      type: Object as PropType<HTMLDivElement | null>,
      default: null
    },
    // 是否自动初始化字段
    autoInitField: {
      type: Boolean,
      default: true
    },
    /**
     * 加载扩展组件（局部注册，优先级高于全局注册）
     * @description 您可以通过此属性来按需加载一些组件，局部注册的组件会覆盖全局注册的同名组件
     * @param {FormImportItem[]} imports - 需要导入的组件列表
     */
    imports: {
      type: Array as PropType<FormImportItem[]>,
      default: () => []
    },
    /**
     * 启用锚点
     */
    anchor: {
      type: Boolean,
      default: false
    },
    /**
     * 锚点组件属性
     */
    anchorProps: {
      type: Object as PropType<Recordable>,
      default: () => {}
    },
    /**
     * 描点容器样式
     */
    anchorAffixStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => {}
    }
  },
  emits: ['register', 'update:stepValue'],
  setup: (props, { emit, attrs, slots, expose }) => {
    const { components, arrayStrategies, componentConfigs } = useImport(props.imports)

    const {
      isValidating,
      formModel,
      elFormRef,
      baseElRowRef,
      componentRefs,
      schemasKeys,
      initValues,
      getDefaultModel,
      getFormModel,
      getElFormRef,
      setValues,
      clearValues,
      setValue,
      delValue,
      resetValidate,
      validate,
      scrollToKey
    } = useForm(props, props.schemas, components, arrayStrategies)

    onMounted(() => {
      emit('register', unref(elFormRef))
      // 组件完成加载时会初始化一次表单,但如果组件配置或表单对象是异步传入的, 则需要手动调用初始化函数
      unref(props).autoInitField ? initValues(props.model) : setValues(props.model)
      // resetValidate()
    })

    onBeforeUnmount(() => {
      // 清理表单数据
      formModel.value = {}
      // 清理其他引用
      elFormRef.value = null
    })
    // 监听表单结构化 - 优化版本
    const schemasFieldsHash = computed(() => {
      // 使用 toRaw 避免访问响应式代理
      const rawSchemas = toRaw(unref(props).schemas)
      // 只提取影响字段初始化的关键属性
      const extractFieldInfo = (schema: FormSchema): string => {
        const { key, field, type, component, value, children } = schema
        let info = `${field || key}:${type || 'Inputer'}:${component || ''}:${value !== undefined ? 'hasValue' : 'noValue'}`
        // 递归处理子组件
        if (children && Array.isArray(children)) {
          // 只记录 children 的数量和 key，不深度遍历
          info += `:children[${children.length}:${children.map(c => c.key || c.field).join(',')}]`
        }
        return info
      }
      return rawSchemas.map(extractFieldInfo).join('|')
    })

    watch(
      schemasFieldsHash,
      () => {
        // 在校验期间不执行初始化，避免不必要的重新渲染
        if (isValidating.value) return

        // 为对象中不存在的组件字段进行创建
        unref(props).autoInitField && initValues(unref(formModel))
        resetValidate()
      },
      {
        immediate: false
      }
    )

    expose({
      initValues,
      getDefaultModel,
      getFormModel,
      getElFormRef,
      setValues,
      clearValues,
      setValue,
      delValue,
      validate,
      resetValidate,
      scrollToKey
    })
    const { renderForm } = useRenderForm(
      props,
      emit,
      attrs,
      slots,
      formModel,
      elFormRef,
      componentRefs,
      baseElRowRef,
      schemasKeys,
      components,
      componentConfigs
    )
    const { renderAnchor } = useRenderAnchor(props, formModel)
    return () => (
      <div class="ae-form">
        {props.anchor && renderAnchor()}
        {renderForm()}
      </div>
    )
  }
})
</script>

<style lang="less">
.ae-form {
  .ae-description-item-label.is-required {
    &::before {
      left: 0;
      content: '*';
      color: var(--el-color-danger);
      margin-right: 4px;
    }
  }
  .ae-description-item-content {
    .ae-form-item {
      margin-top: 11px;
      margin-bottom: 11px;
      &.no-margin-bottom {
        margin-bottom: 0;
        margin-top: 0;
      }
    }
  }
  // 居上布局时
  .el-form-item--label-top {
    // 没有使用自定义label插槽时
    &.is-normal-label {
      // 设置副标题的颜色和尺寸
      .ae-form-item-label {
        > .sub-label {
          // 副标题默认小于主标题1px的尺寸
          font-size: clamp(12px, calc(var(--el-font-size-base, '14px') - 1px), 16px);
          color: var(--el-color-info);
        }
      }
      &.is-required {
        // 使必填*号变为绝对定位
        .el-form-item__label {
          width: 100%;
          position: relative;
          &::before {
            position: absolute;
            left: 0;
          }
        }
        // 由于必填*号被绝对定位, 因此需要将主标题往右移动10px
        .ae-form-item-label {
          > .label {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
