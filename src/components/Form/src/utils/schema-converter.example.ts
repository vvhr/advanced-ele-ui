/**
 * FormSchemaForJson 使用示例
 * 
 * 这个文件展示了如何使用 FormSchemaForJson 来配置表单，
 * 所有配置都可以完全序列化为 JSON 字符串存储。
 */

import type { FormSchemaForJson } from '../types/schema-json'
import { jsonToFormSchemas } from './schema-converter'

/**
 * 示例 1: 简单的 appendRender - 使用组件配置对象
 * 
 * 场景：在输入框后面添加一个查询按钮
 */
const example1: FormSchemaForJson = {
  key: 'username',
  field: 'username',
  label: '用户名',
  component: 'Input',
  outsideProps: {
    enable: true,
    direction: 'row',
    style: { gap: '10px' },
    appendRender: {
      type: 'el-button',
      props: {
        type: 'primary',
        onClick: '{{ console.log("查询", form.username) }}'
      },
      children: ['查询']
    }
  }
}

/**
 * 示例 2: 复杂的 appendRender - 使用组件配置对象
 * 
 * 场景：在邮箱输入框后面添加一个邮箱域名选择器
 */
const example2: FormSchemaForJson = {
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
    appendRender: {
      type: 'el-select',
      props: {
        vModel: 'form.emailDomain',
        style: { width: '120px' },
        disabled: '{{ disabled }}'
      },
      children: [
        {
          type: 'el-option',
          props: { value: '@163.com' },
          children: ['@163.com']
        },
        {
          type: 'el-option',
          props: { value: '@qq.com' },
          children: ['@qq.com']
        },
        {
          type: 'el-option',
          props: { value: '@gmail.com' },
          children: ['@gmail.com']
        }
      ]
    }
  }
}

/**
 * 示例 3: 动态 appendRender - 使用字符串表达式
 * 
 * 场景：根据表单字段动态渲染不同的组件
 * 
 * 注意：这种方式需要运行时支持 JSX 编译，或者使用 Babel 转换
 */
const example3: FormSchemaForJson = {
  key: 'dynamic',
  field: 'dynamic',
  label: '动态字段',
  component: 'Input',
  outsideProps: {
    enable: true,
    appendRender: `{{
      if (form.type === 'A') {
        return h('el-button', { type: 'primary' }, '按钮A')
      } else {
        return h('el-button', { type: 'success' }, '按钮B')
      }
    }}`
  }
}

/**
 * 示例 4: prependRender - 前置组件
 * 
 * 场景：在输入框前面添加一个图标或标签
 */
const example4: FormSchemaForJson = {
  key: 'amount',
  field: 'amount',
  label: '金额',
  component: 'Input',
  outsideProps: {
    enable: true,
    prependRender: {
      type: 'span',
      props: {
        style: { padding: '0 8px', display: 'flex', alignItems: 'center', background: '#f5f7fa' }
      },
      children: ['¥']
    }
  }
}

/**
 * 示例 5: insideProps.renders - 组件内部插槽
 * 
 * 场景：在 Input 组件内部添加后缀
 */
const example5: FormSchemaForJson = {
  key: 'price',
  field: 'price',
  label: '价格',
  component: 'Input',
  insideProps: {
    renders: {
      append: '元' // 简单文本
    }
  }
}

/**
 * 示例 6: insideProps.renders - 复杂插槽内容
 */
const example6: FormSchemaForJson = {
  key: 'price2',
  field: 'price2',
  label: '价格2',
  component: 'Input',
  insideProps: {
    renders: {
      append: {
        type: 'el-button',
        props: {
          type: 'text',
          size: 'small',
          onClick: '{{ form.price2 = "" }}'
        },
        children: ['清空']
      }
    }
  }
}

/**
 * 示例 7: CustomSchema 的 render 属性
 */
const example7: FormSchemaForJson = {
  key: 'custom',
  field: 'custom',
  type: 'Custom',
  label: '自定义组件',
  render: {
    type: 'div',
    props: {
      style: { padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }
    },
    children: [
      {
        type: 'el-button',
        props: {
          type: 'primary',
          onClick: '{{ console.log("自定义按钮点击", form) }}'
        },
        children: ['自定义按钮']
      }
    ]
  }
}

/**
 * 示例 8: 完整的表单配置
 */
const completeExample: FormSchemaForJson[] = [
  {
    key: 'username',
    field: 'username',
    label: '用户名',
    component: 'Input',
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
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
      appendRender: {
        type: 'el-select',
        props: {
          vModel: 'form.emailDomain',
          style: { width: '120px' }
        },
        children: [
          { type: 'el-option', props: { value: '@163.com' }, children: ['@163.com'] },
          { type: 'el-option', props: { value: '@qq.com' }, children: ['@qq.com'] }
        ]
      }
    },
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  }
]

/**
 * 使用方式：
 * 
 * 1. 将 FormSchemaForJson 序列化为 JSON 字符串存储
 * const jsonString = JSON.stringify(completeExample)
 * localStorage.setItem('formSchema', jsonString)
 * 
 * 2. 从 JSON 字符串恢复并转换为 FormSchema
 * const jsonString = localStorage.getItem('formSchema')
 * const jsonSchemas: FormSchemaForJson[] = JSON.parse(jsonString)
 * const schemas = jsonToFormSchemas(jsonSchemas)
 * 
 * 3. 在 Form 组件中使用
 * <AeForm :schemas="schemas" />
 */

// 导出示例供参考
export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  completeExample
}
