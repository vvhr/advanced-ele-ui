/**
 * RenderDesigner 使用示例
 * 
 * 展示如何在实际项目中使用 RenderDesigner 和 renderResolver
 */

import { resolveRender, createRenderResolver } from '../utils/render-resolver'
import type { RenderComponentConfig } from '../types/designer-config'
import type { FormSchema } from '../../Form/src/types/schema'

/**
 * 示例1：条件显示的按钮
 * 
 * 场景：创建一个按钮，仅在 formModel.type === 1 时显示，点击后设置 formModel.status = "active"
 */
export const example1ButtonConfig: RenderComponentConfig = {
  type: 'el-button',
  props: {
    type: 'primary'
  },
  children: ['查询'],
  condition: {
    expression: {
      type: 'operator',
      operator: 'eq',
      children: [
        { type: 'field', field: 'formModel.type' },
        { type: 'value', value: 1 }
      ]
    }
  },
  events: {
    click: {
      eventType: 'click',
      actions: [
        {
          type: 'setField',
          setField: {
            field: 'formModel.status',
            value: { type: 'value', value: 'active' }
          }
        }
      ]
    }
  }
}

/**
 * 示例2：动态文本块
 * 
 * 场景：创建一个文本块，文本内容根据 formModel.type 动态变化
 */
export const example2TextConfig: RenderComponentConfig = {
  type: 'span',
  children: {
    type: 'operator',
    operator: 'conditional',
    children: [
      {
        type: 'operator',
        operator: 'eq',
        children: [
          { type: 'field', field: 'formModel.type' },
          { type: 'value', value: 1 }
        ]
      },
      { type: 'value', value: '类型A' },
      { type: 'value', value: '类型B' }
    ]
  },
  style: {
    fontSize: '14px',
    color: '#333333',
    padding: '8px'
  }
}

/**
 * 示例3：render 中的输入框
 * 
 * 场景：创建一个输入框，绑定到 formModel.emailDomain，当 formModel.type === 2 时禁用
 */
export const example3InputConfig: RenderComponentConfig = {
  type: 'el-input',
  props: {
    vModel: {
      type: 'fieldBinding',
      field: 'formModel.emailDomain',
      twoWay: true
    },
    placeholder: '请选择邮箱域名',
    disabled: {
      type: 'operator',
      operator: 'eq',
      children: [
        { type: 'field', field: 'formModel.type' },
        { type: 'value', value: 2 }
      ]
    }
  }
}

/**
 * 使用示例：在 Form 组件中使用
 */
export function createFormSchemasWithRender(): FormSchema[] {
  // 从数据库读取的 JSON 配置（示例）
  const buttonConfigFromDB = example1ButtonConfig
  const textConfigFromDB = example2TextConfig
  const inputConfigFromDB = example3InputConfig

  // 使用 renderResolver 转换为 render 函数
  return [
    {
      key: 'email',
      field: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        style: { flex: 1 }
      },
      outsideProps: {
        enable: true,
        direction: 'row',
        style: { gap: '10px' },
        // 使用 resolveRender 将 JSON 配置转换为 render 函数
        appendRender: resolveRender(buttonConfigFromDB)
      },
      formItemProps: {
        autoRules: ['isRequired']
      }
    },
    {
      key: 'description',
      field: 'description',
      label: '描述',
      component: 'Input',
      outsideProps: {
        enable: true,
        prependRender: resolveRender(textConfigFromDB)
      }
    },
    {
      key: 'custom',
      field: 'custom',
      type: 'Custom',
      label: '自定义组件',
      // CustomSchema 的 render 属性
      render: resolveRender(inputConfigFromDB)
    }
  ]
}

/**
 * 使用示例：带自定义组件的 renderResolver
 */
export function createFormSchemasWithCustomComponents(): FormSchema[] {
  // 创建带自定义组件的 resolver
  const resolver = createRenderResolver({
    customComponents: {
      'my-custom-button': () => import('@/components/MyCustomButton.vue'),
      'my-icon': () => import('@/components/MyIcon.vue')
    },
    expressionTools: {
      lodash: require('lodash-es'),
      dayjs: require('dayjs')
    },
    debug: process.env.NODE_ENV === 'development'
  })

  const customButtonConfig: RenderComponentConfig = {
    type: 'my-custom-button',
    props: {
      text: '自定义按钮'
    },
    events: {
      click: {
        eventType: 'click',
        actions: [
          {
            type: 'showMessage',
            showMessage: {
              message: '自定义按钮被点击',
              type: 'success'
            }
          }
        ]
      }
    }
  }

  return [
    {
      key: 'test',
      field: 'test',
      label: '测试',
      component: 'Input',
      outsideProps: {
        enable: true,
        appendRender: resolver.resolve(customButtonConfig)
      }
    }
  ]
}

/**
 * 使用示例：从 API 获取配置并转换为 render 函数
 */
export async function loadFormSchemasFromAPI(): Promise<FormSchema[]> {
  // 从 API 获取 JSON 配置
  const response = await fetch('/api/form-schemas')
  const schemas = await response.json()

  // 转换每个 schema 中的 render 配置
  return schemas.map((schema: any) => {
    if (schema.outsideProps?.appendRender) {
      schema.outsideProps.appendRender = resolveRender(schema.outsideProps.appendRender)
    }
    if (schema.outsideProps?.prependRender) {
      schema.outsideProps.prependRender = resolveRender(schema.outsideProps.prependRender)
    }
    if (schema.render) {
      schema.render = resolveRender(schema.render)
    }
    return schema
  })
}

/**
 * 使用示例：在 Vue 组件中使用
 */
export const vueComponentExample = `
<template>
  <AeForm :schemas="formSchemas" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AeForm } from 'advanced-ele-ui'
import { resolveRender } from '@/components/RenderDesigner'
import type { FormSchema } from 'advanced-ele-ui'
import type { RenderComponentConfig } from '@/components/RenderDesigner'

const formSchemas = ref<FormSchema[]>([])

onMounted(async () => {
  // 从数据库或 API 获取 JSON 配置
  const renderConfigFromDB: RenderComponentConfig = {
    type: 'el-button',
    props: { type: 'primary' },
    children: ['查询'],
    condition: {
      expression: {
        type: 'operator',
        operator: 'eq',
        children: [
          { type: 'field', field: 'formModel.type' },
          { type: 'value', value: 1 }
        ]
      }
    },
    events: {
      click: {
        eventType: 'click',
        actions: [
          {
            type: 'setField',
            setField: {
              field: 'formModel.status',
              value: { type: 'value', value: 'active' }
            }
          }
        ]
      }
    }
  }

  // 转换为 FormSchema
  formSchemas.value = [
    {
      key: 'email',
      field: 'email',
      label: '邮箱',
      component: 'Input',
      outsideProps: {
        enable: true,
        appendRender: resolveRender(renderConfigFromDB)
      }
    }
  ]
})
</script>
`
