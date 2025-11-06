<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级表单组件</h2>
      <p>支持多种表单控件、自动校验、动态表单等功能</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>基础表单示例</span>
          <div class="card-actions">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onReset">重置</el-button>
          </div>
        </div>
      </template>

      <ZwForm
        ref="zwFormRef"
        :model="formModel"
        :schemas="formSchemas"
        :schema-props="schemaProps"
        :type="'form'"
        :data-source="{}"
        :auto-init-field="true"
      />
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>🎯 支持多种表单控件（Input、Select、DatePicker 等）</li>
        <li>✅ 内置自动校验规则（必填、邮箱、手机号等）</li>
        <li>🔄 支持动态表单项（显示/隐藏、禁用/启用）</li>
        <li>📋 支持表格嵌套（可编辑表格）</li>
        <li>🎨 灵活的布局配置（栅格布局）</li>
        <li>🔧 丰富的插槽支持（前置、后置、自定义渲染）</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import { ZwForm, FormSchema, SchemaProps } from '@/components/Form'
import { ElMessage } from 'element-plus'

const schemaProps: SchemaProps = {
  layoutProps: {
    span: 12
  },
  formItemProps: {
    labelPosition: 'top'
  },
  componentProps: {
    clearable: true,
    autoPlaceholder: true
  }
}

const formModel = ref({
  username: '张三',
  idCard: '',
  nickname: '',
  amount: '',
  email: '',
  status: 'active',
  list: [{ name: '', age: '', sex: '' }]
})

const formSchemas = reactive<FormSchema[]>([
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'idCard',
    label: '证件号码',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'amount',
    label: '余额',
    component: 'Input',
    componentProps: {
      easySlots: { append: '元' }
    },
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
  {
    field: 'email',
    label: '邮箱号',
    component: 'Input',
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
  {
    field: 'status',
    label: '状态',
    value: 'active',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 'active', type: 'success' },
        { label: '禁用', value: 'inactive', type: 'danger' }
      ]
    },
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
  {
    field: 'list',
    label: '列表',
    component: 'Table',
    value: [{ name: '', age: '', sex: '' }],
    componentProps: {
      editable: true,
      border: true,
      columns: [
        { key: 'index', type: 'index', label: '序号' },
        {
          field: 'name',
          label: '名称',
          editProps: {
            component: 'Input',
            rules: [{ required: true, message: '请输入名称', trigger: 'change' }]
          }
        },
        {
          field: 'age',
          label: '年龄',
          editProps: {
            component: 'Input',
            rules: [{ required: true, message: '请输入年龄', trigger: 'change' }]
          }
        },
        {
          field: 'sex',
          label: '性别',
          editProps: {
            component: 'Select',
            componentProps: {
              options: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' }
              ]
            },
            rules: [{ required: true, message: '请选择性别', trigger: 'change' }]
          }
        },
        {
          key: 'action',
          label: '操作',
          type: 'action',
          fixed: 'right',
          width: 100,
          editable: false,
          typeProps: {
            actions: [
              {
                label: '删除',
                name: 'delete',
                event: (row, index, column, form) => {
                  form.list.splice(index, 1)
                },
                type: 'primary',
                buttonAttrs: { size: 'small' }
              }
            ]
          }
        }
      ]
    },
    outsideProps: {
      enable: true,
      direction: 'column',
      style: { alignItems: 'flex-start', gap: '10px' },
      prependRender: form => {
        const onAdd = () => {
          form.list.push({ name: '', age: '', sex: '' })
        }
        return (
          <el-button type="primary" onclick={() => onAdd()}>
            添加
          </el-button>
        )
      }
    },
    formItemProps: {
      autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 24 }
  }
])

const zwFormRef = ref()

async function onSubmit() {
  if (await zwFormRef?.value?.validate()) {
    ElMessage.success('表单校验成功！请在控制台查看表单数据')
    const formData = zwFormRef?.value?.getFormModel()
    console.log('表单数据：', formData)
  }
}

function onReset() {
  zwFormRef?.value?.clearValues({
    username: '张三',
    list: [{ name: '', age: '', sex: '' }]
  })
  ElMessage.info('表单已重置')
}
</script>
