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
            <el-radio-group v-model="mode">
              <el-radio-button value="edit">编辑模式</el-radio-button>
              <el-radio-button value="detail">详情模式</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="schemaProps.formItemProps.labelPosition">
              <el-radio-button value="top">居上</el-radio-button>
              <el-radio-button value="left">居左</el-radio-button>
              <el-radio-button value="right">居右</el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onReset" style="margin-left: 0">重置</el-button>
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
        :disabled="mode === 'detail'"
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

const mode = ref('edit')

const schemaProps = reactive<SchemaProps>({
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
})

const formModel = ref({
  username: '张三',
  idCard: '420521202001010011',
  sex: 'male',
  skills: ['html', 'css', 'vue'],
  amount: '12345.01',
  email: '123456',
  emailDomain: '@163.com',
  status: 'active',
  hobby: ['eat', 'sleep'],
  list: [{ name: '', age: '', sex: '' }],
  longLabel: ''
})

const formSchemas = reactive<FormSchema[]>([
  {
    field: 'username',
    label: '用户名',
    value: '',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'idCard',
    label: '证件号码',
    value: '',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired', 'isIdCard']
    }
  },
  {
    key: 'sex1',
    field: 'sex',
    label: '性别',
    value: '',
    component: 'Radio',
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    key: 'sex2',
    field: 'sex',
    label: '性别',
    component: 'RadioButton',
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    key: 'skills1',
    field: 'skills',
    label: '技能',
    value: [],
    component: 'Checkbox',
    componentProps: {
      options: [
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' }
      ]
    },
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'skills2',
    field: 'skills',
    label: '技能',
    value: [],
    component: 'CheckboxButton',
    componentProps: {
      options: [
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' }
      ]
    },
    layoutProps: { span: 12 },
    formItemProps: {
      autoRules: ['isRequiredArray']
    }
  },
  {
    field: 'amount',
    label: '余额',
    value: '',
    component: 'Input',
    insideProps: {
      renders: {
        append: () => '元'
      }
    },
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
  {
    field: 'email',
    label: '邮箱号',
    value: '',
    component: 'Input',
    componentProps: {
      style: { flex: 1 }
    },
    outsideProps: {
      enable: true,
      direction: 'row',
      style: { gap: '10px' },
      appendRender: (form: Recordable, column: FormSchema, disabled: boolean) => {
        const domains = ['@163.com', '@qq.com', '@gmail.com']
        return (
          <el-select vModel={form.emailDomain} style={'width: 120px'} disabled={disabled}>
            {domains.map(domain => (
              <el-option value={domain}></el-option>
            ))}
          </el-select>
        )
      }
    },
    formItemProps: {
      autoRules: ['isRequired']
    },
    layoutProps: { span: 12 }
  },
  {
    field: 'status',
    label: '状态',
    value: '',
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
    field: 'hobby',
    label: '爱好',
    value: [],
    component: 'Select',
    componentProps: {
      multiple: true,
      options: [
        { label: '吃饭', value: 'eat' },
        { label: '睡觉', value: 'sleep' },
        { label: '打游戏', value: 'game' },
        { label: '看电影', value: 'movie' }
      ]
    },
    formItemProps: {
      // autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 12 }
  },
  {
    key: 'longLabel1',
    field: 'longLabel',
    label: '这是一个非常长的标题',
    value: '',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    layoutProps: { span: 12 },
    formItemProps: {
      subLabel: '请切换到居左或居右模式查看效果，使用了labelMaxWidth属性来美化长标题',
      labelMaxWidth: 100,
      autoRules: ['isRequired']
    }
  },
  {
    key: 'longLabel2',
    field: 'longLabel',
    label: '这是一个非常非常非常非常非常非常非常非常非常非常非常非常长的标题',
    value: '',
    component: 'Input',
    layoutProps: { span: 12 },
    formItemProps: {
      subLabel: '请切换到居左或居右模式查看效果，使用了labelMaxWidth属性来美化长标题',
      labelMaxWidth: 100,
      autoRules: ['isRequired']
    }
  },
  {
    field: 'list',
    label: '列表',
    component: 'Table',
    value: [],
    componentProps: {
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
  zwFormRef?.value?.clearValues()
  ElMessage.info('表单已重置')
}
</script>
