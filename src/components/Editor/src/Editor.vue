<script lang="tsx">
import {
  defineComponent,
  onUnmounted,
  onMounted,
  ref,
  watch,
  computed,
  unref,
  PropType,
  nextTick
} from 'vue'
import { AiEditor, type AiEditorOptions } from 'aieditor'
import 'aieditor/dist/style.css'
import { AddToolItem, ToolbarKey } from './types'
import { FULL_TOOLBAR_KEYS, SIMPLE_TOOLBAR_KEYS } from './constants'
import { getStyleWidth } from './utils'
import { useDebounceFn } from '@vueuse/core'

export default defineComponent({
  name: 'Editor',
  props: {
    // 双向绑定编辑器的content
    modelValue: {
      type: String,
      default: ''
    },
    // 禁止输入 org: editable
    disabled: {
      type: Boolean,
      default: false
    },
    // 占位符
    placeholder: {
      type: String,
      default: ''
    },
    // 高度
    height: {
      type: [Number, String],
      default: 350
    },
    // 模式 simple: 简单模式 full: 全功能模式 custom: 自定义模式
    mode: {
      type: String as PropType<'simple' | 'full' | 'custom'>,
      default: 'simple'
    },
    // 尺寸 org: toolbarSize
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    },
    // 工具栏按钮列表 custom模式时根据此配置生成工具栏
    toolbarKeys: {
      type: Array as PropType<ToolbarKey[]>,
      default: () => []
    },
    // 排除的工具栏按钮列表 simple模式或full模式时根据此配置排除
    toolbarExcludeKeys: {
      type: Array as PropType<ToolbarKey[]>,
      default: () => []
    },
    // 增加工具栏按钮 simple模式时根据此配置在对应位置插入组件
    addToolbarKeys: {
      type: Array as PropType<AddToolItem[]>,
      default: () => []
    },
    // 主题 light: 浅色 dark: 深色
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light'
    },
    // 内容是否是markdown格式, 此属性将控制输入和输出为markdown格式
    contentIsMarkdown: {
      type: Boolean,
      default: false
    },
    // 是否自动保存（缓存）当前编辑的内容
    contentRetention: {
      type: Boolean,
      default: false
    },
    // 自动保存的缓存key
    contentRetentionKey: {
      type: String,
      default: 'zw-ai-editor-content'
    },
    // 允许自由调整尺寸 org: draggable
    resizable: {
      type: Boolean,
      default: true
    },
    // 工具栏是否显示提示
    toolbarTipEnable: {
      type: Boolean,
      default: true
    },
    // 语言 zh: 中文 en: 英文
    lang: {
      type: String,
      default: 'zh'
    },
    // 编辑器实例配置
    editorOptions: {
      type: Object as PropType<AiEditorOptions>,
      default: () => {
        return {}
      }
    }
  },
  emits: ['change', 'update:modelValue', 'focus', 'blur', 'created', 'destroy'],
  setup(props, { emit }) {
    let isInternalUpdate = false
    let lastEmittedValue = ''
    const editorRef = ref<ComponentRef<AiEditor>>()
    function setEditorRef(ref: ComponentRef<AiEditor>) {
      editorRef.value = ref
    }

    let aiEditor: AiEditor | null = null

    function getOptions(): AiEditorOptions {
      let toolbarKeys: ToolbarKey[] = []
      const toolbarExcludeKeys: ToolbarKey[] = props.toolbarExcludeKeys || []
      if (props.mode === 'custom') {
        toolbarKeys = props.toolbarKeys || []
      } else if (props.mode === 'simple') {
        toolbarKeys = SIMPLE_TOOLBAR_KEYS
        if (props.addToolbarKeys?.length) {
          const toolbarKeysCopy = [...toolbarKeys]
          // 先收集所有需要插入的项及其目标位置
          const insertions: { position: number; key: ToolbarKey }[] = []
          props.addToolbarKeys.forEach((item: AddToolItem) => {
            if (Array.isArray(item) && item.length === 2) {
              const [position, key] = item
              let targetPosition = -1

              if (typeof position === 'number') {
                targetPosition = position
              } else if (typeof position === 'string') {
                const findPositionKey = toolbarKeysCopy.findIndex(item => item === position)
                if (findPositionKey > -1) {
                  targetPosition = findPositionKey + 1
                }
              }

              if (targetPosition > -1) {
                insertions.push({ position: targetPosition, key })
              }
            }
          })
          // 按位置排序，从后往前插入，避免位置偏移影响
          insertions
            .sort((a, b) => b.position - a.position)
            .forEach(({ position, key }) => {
              toolbarKeysCopy.splice(position, 0, key)
            })
          toolbarKeys = toolbarKeysCopy
        }
      } else {
        toolbarKeys = FULL_TOOLBAR_KEYS
      }
      return {
        ...props.editorOptions,
        lang: props.lang || 'zh',
        toolbarSize: props.size || 'small',
        toolbarKeys: toolbarKeys,
        toolbarExcludeKeys: toolbarExcludeKeys,
        editable: !props.disabled,
        placeholder: props.placeholder || '',
        theme: props.theme || 'light',
        content: props.modelValue,
        contentIsMarkdown: props.contentIsMarkdown || false,
        contentRetention: props.contentRetention || false,
        contentRetentionKey: props.contentRetentionKey || 'zw-ai-editor-content',
        draggable: props.resizable,
        toolbarTipEnable: props.toolbarTipEnable || true
      }
    }

    function getValue(instance: AiEditor) {
      return instance ? (props.contentIsMarkdown ? instance.getMarkdown() : instance.getHtml()) : ''
    }
    function setValue(value: string) {
      if (aiEditor) {
        if (props.contentIsMarkdown) {
          aiEditor.setMarkdownContent(value)
        } else {
          aiEditor.setContent(value)
        }
        aiEditor.focus()
      }
    }

    // 防抖的 emit 函数
    const debouncedEmit = useDebounceFn((value: string) => {
      emit('change', value)
      emit('update:modelValue', value)
    }, 500)

    function initEditor() {
      const options = getOptions()
      if (aiEditor) {
        aiEditor.destroy()
        aiEditor = null
      }
      aiEditor = new AiEditor({
        ...options,
        element: editorRef.value as Element,
        onChange: aiEditor => {
          if (isInternalUpdate) {
            return
          }
          const value = getValue(aiEditor)
          // 避免重复 emit 相同的值
          if (value !== lastEmittedValue) {
            lastEmittedValue = value
            debouncedEmit(value)
          }
        },
        onFocus: () => {
          emit('focus')
        },
        onBlur: () => {
          emit('blur')
        },
        onCreated: aiEditor => {
          emit('created')
        },
        onDestroy: () => {
          emit('destroy')
        }
      })
    }
    // 监听modelValue变化实现双向绑定
    watch(
      () => props.modelValue,
      value => {
        if (aiEditor) {
          /** 关键代码, 如果新值与编辑器值相同则不更新编辑器值 */
          const currentValue = getValue(aiEditor)
          if (currentValue === value) {
            return
          }
          // 仅在非编辑器内修改时, 才触发更新编辑器值
          isInternalUpdate = true
          setValue(value)
          nextTick(() => {
            isInternalUpdate = false
          })
        }
      },
      { immediate: false }
    )
    // 监听disabled变化
    watch(
      () => props.disabled,
      value => {
        if (aiEditor) {
          aiEditor.setEditable(!value)
        }
      },
      { immediate: false }
    )
    // 监听mode变化
    watch(
      () => props.mode,
      value => {
        initEditor()
      },
      { immediate: false }
    )

    onMounted(async () => {
      await nextTick()
      initEditor()
    })
    onUnmounted(() => {
      aiEditor && aiEditor.destroy()
    })

    const editorStyle = computed(() => {
      return {
        height: getStyleWidth(props.height) || '350px'
      }
    })

    return () => (
      <div
        ref={(ref: any) => setEditorRef(ref)}
        style={editorStyle.value}
        class="zw-ai-editor"
      ></div>
    )
  }
})
</script>

<style scoped lang="less"></style>
