import { computed, defineComponent, h, ref, type VNode } from 'vue'
import { textProps, textEmits } from './types'
import { AeIcon } from '@/components/Icon'
import { ElMessage } from 'element-plus'
import './text.less'

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 解析文本并生成高亮节点
 */
function parseHighlightText(
  text: string,
  patterns: string[],
  hlClass: string,
  hlStyle: string | Record<string, any>,
  onHlClick: (value: string) => void
): (string | VNode)[] {
  if (!patterns || patterns.length === 0 || !text) {
    return [text]
  }

  // 过滤空字符串并转义特殊字符
  const validPatterns = patterns.filter((p) => p && p.trim()).map((p) => escapeRegExp(p))

  if (validPatterns.length === 0) {
    return [text]
  }

  // 构建正则表达式，使用 | 连接所有 patterns
  const regex = new RegExp(`(${validPatterns.join('|')})`, 'g')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    // 检查是否为高亮部分
    if (part && validPatterns.some((pattern) => new RegExp(`^${pattern}$`).test(part))) {
      return h(
        'span',
        {
          key: `hl-${index}`,
          class: ['ae-text__highlight', hlClass].filter(Boolean).join(' '),
          style: hlStyle,
          onClick: () => onHlClick(part)
        },
        part
      )
    }
    return part
  })
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  } catch {
    return false
  }
}

export default defineComponent({
  name: 'AeText',
  props: textProps,
  emits: textEmits,
  setup(props, { emit }) {
    // 是否展开状态
    const isExpanded = ref(false)

    // 计算高亮后的文本节点
    const contentNodes = computed(() => {
      return parseHighlightText(
        props.value,
        props.patterns,
        props.hlClass,
        props.hlStyle,
        (value: string) => emit('hlClick', value)
      )
    })

    // 处理复制
    const handleCopy = async () => {
      const success = await copyToClipboard(props.value)
      if (success) {
        ElMessage.success(props.copySuccessText)
        emit('copy', props.value)
      } else {
        ElMessage.error('复制失败')
      }
    }

    // 切换展开/收起
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return () => {
      const children: VNode[] = []

      // 渲染圆点
      if (props.dotType) {
        children.push(
          h('span', {
            key: 'dot',
            class: ['ae-text__dot', `ae-text__dot--${props.dotType}`]
          })
        )
      }

      // 渲染图标
      if (props.icon) {
        children.push(
          h(
            AeIcon,
            {
              key: 'icon',
              icon: props.icon,
              class: ['ae-text__icon', props.iconClass].filter(Boolean).join(' '),
              style: props.iconStyle
            },
            null
          )
        )
      }

      // 计算文本容器样式类
      const contentClass = ['ae-text__content']
      if (props.truncate && !isExpanded.value) {
        contentClass.push('ae-text__content--truncate')
      }

      // 计算文本容器样式
      const contentStyle: Record<string, any> = {}
      if (typeof props.truncate === 'number' && !isExpanded.value) {
        contentStyle['--ae-text-line-clamp'] = props.truncate
      }

      // 渲染文本内容
      children.push(
        h(
          'span',
          {
            key: 'content',
            class: contentClass,
            style: contentStyle
          },
          contentNodes.value
        )
      )

      // 渲染展开/收起按钮
      if (props.truncate && props.expandable) {
        children.push(
          h(
            'span',
            {
              key: 'expand',
              class: 'ae-text__expand',
              onClick: toggleExpand
            },
            isExpanded.value ? props.collapseText : props.expandText
          )
        )
      }

      // 渲染复制按钮
      if (props.copyable) {
        children.push(
          h(
            AeIcon,
            {
              key: 'copy',
              icon: props.copyIcon,
              class: 'ae-text__copy',
              onClick: handleCopy
            },
            null
          )
        )
      }

      // 根据 block 属性决定使用的容器类
      const rootClass = ['ae-text', props.block ? 'ae-text--block' : 'ae-text--inline']

      return h('div', { class: rootClass }, children)
    }
  }
})

