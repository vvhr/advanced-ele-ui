import type { Ref } from 'vue'
import { ElAnchor, ElAnchorLink } from 'element-plus'
import { isHidden, getLabel } from '../utils/schema'
import type { FormProps, FormSchema } from '../types'

export function useRenderAnchor(props: FormProps, formModel: Ref<Recordable>) {
  // 判断 schema 是否应该显示为锚点
  const shouldShowAnchor = (schema: FormSchema): boolean => {
    // Container 和 Descriptions 默认渲染，可通过 enable=false 禁用
    // Decorator 必须显式设置 enable=true 才渲染
    if (schema.type === 'Container' || schema.type === 'Descriptions') {
      if (schema.anchorLinkProps?.enable === false) {
        return false
      }
    } else if (schema.type === 'Decorator') {
      if (schema.anchorLinkProps?.enable !== true) {
        return false
      }
    } else {
      return false
    }
    if (isHidden(schema, formModel.value, props)) {
      return false
    }
    return true
  }

  // 递归渲染锚点链接
  const renderAnchorLinks = (schemas: FormSchema[]) => {
    return schemas.filter(shouldShowAnchor).map(schema => {
      const itemKey = schema.key || schema.field
      const title =
        schema.anchorLinkProps?.title || getLabel(schema, formModel.value, props) || itemKey
      const href = schema.anchorLinkProps?.href || `#${itemKey}`
      // 只有 Container 和 Descriptions 类型才有 children
      const canHaveChildren = schema.type === 'Container' || schema.type === 'Descriptions'
      const hasChildren = canHaveChildren && schema.children?.some(shouldShowAnchor)

      return (
        <ElAnchorLink key={itemKey} title={title} href={href}>
          {hasChildren && renderAnchorLinks(schema.children!)}
        </ElAnchorLink>
      )
    })
  }

  const renderAnchor = () => {
    if (!props.schemas || props.schemas.length < 1) {
      return undefined
    }

    const anchorStyle = {
      position: 'fixed',
      left: '20px',
      top: '100px',
      width: '100px',
      zIndex: 20,
      padding: '10px 10px 10px 0',
      background: 'var(--el-bg-color)',
      borderRadius: 'var(--el-border-radius-base)',
      ...props.anchorAffixStyle
    }

    return (
      <div class="ae-form-anchor" style={anchorStyle}>
        <ElAnchor {...props.anchorProps}>{renderAnchorLinks(props.schemas)}</ElAnchor>
      </div>
    )
  }

  return {
    renderAnchor
  }
}
