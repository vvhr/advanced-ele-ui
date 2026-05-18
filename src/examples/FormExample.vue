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
            <el-radio-group v-model="enableBeauty">
              <el-radio-button :value="true">样式美化</el-radio-button>
              <el-radio-button :value="false">原生样式</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="mode">
              <el-radio-button value="edit">编辑模式</el-radio-button>
              <el-radio-button value="detail">详情模式</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="schemaProps.formItemProps.labelPosition">
              <el-radio-button value="top">居上</el-radio-button>
              <el-radio-button value="left">居左</el-radio-button>
              <el-radio-button value="right">居右</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="enableAnchor">
              <el-radio-button :value="true">导航锚点</el-radio-button>
              <el-radio-button :value="false">隐藏导航</el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button style="margin-left: 0" @click="onReset">重置</el-button>
          </div>
        </div>
      </template>

      <AeForm
        ref="AeFormRef"
        :model="formModel"
        :schemas="formSchemas"
        :schema-props="schemaProps"
        :type="'form'"
        :excontext="{}"
        :anchor="enableAnchor"
        :anchor-props="anchorProps"
        :anchor-affix-style="anchorAffixStyle"
        :auto-init-field="true"
        :scroll-ref="containerRef"
        :disabled="mode === 'detail'"
        :imports="imports"
        :class="enableBeauty ? 'element-plus-beauty' : ''"
      />
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>描述表单示例</span>
          <div class="card-actions">
            <el-radio-group v-model="descriptionsDirection">
              <el-radio-button value="vertical">垂直布局</el-radio-button>
              <el-radio-button value="horizontal">水平布局</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="mode2">
              <el-radio-button value="edit">编辑模式</el-radio-button>
              <el-radio-button value="detail">详情模式</el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="onSubmit2">提交</el-button>
            <el-button style="margin-left: 0" @click="onReset2">重置</el-button>
          </div>
        </div>
      </template>
      <AeForm
        ref="AeDescFormRef"
        :model="formModel2"
        :schemas="formSchemas2"
        :schema-props="schemaProps2"
        :type="'desc'"
        :excontext="{}"
        :auto-init-field="true"
        :disabled="mode2 === 'detail'"
        :class="enableBeauty ? 'element-plus-beauty' : ''"
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
import '@/styles/element-plus-beauty.less'
import { ref, reactive } from 'vue'
import { Form as AeForm, FormSchema, FormSchemaProps } from '@/components/Form'
import type { TableColumn } from '@/components/Table'
import { ElMessage, ElUpload, ElCard } from 'element-plus'
import type { UploadRawFile } from '@/components/Upload'
import type { FormImportItem } from '@/types/imports'
const props = defineProps({
  containerRef: null
})
const imports: FormImportItem[] = [
  {
    name: 'ElUpload',
    component: ElUpload,
    config: {
      modelValueKey: 'fileList'
    },
    isArrayFn: () => true
  },
  {
    name: 'ElCard',
    component: ElCard
  }
]
const enableBeauty = ref(true)
const enableAnchor = ref(false)
const mode = ref('edit')
const mode2 = ref('edit')
const anchorProps = reactive({
  container: props.containerRef,
  offset: 50,
  bound: 15,
  duration: 300,
  type: 'underline',
  selectScrollTop: false
})
const anchorAffixStyle = {
  width: '150px',
  boxShadow: '1px 0px 4px 0 rgba(169,169,169,1)'
}
const schemaProps = reactive<FormSchemaProps>({
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

const schemaProps2 = reactive<FormSchemaProps>({
  layoutProps: {
    span: 12
  },
  formItemProps: {},
  componentProps: {
    clearable: true,
    autoPlaceholder: true
  }
})

const formModel = ref({
  username: '张三',
  idCard: '',
  age: 24,
  sex: 'male',
  skills: ['html', 'css', 'vue'],
  amount: '12345.01',
  email: '123456',
  emailDomain: '@163.com',
  major: '1',
  status: '',
  hobby: ['eat', 'sleep'],
  list: [{ name: '', age: '', sex: '' }],
  address: [],
  longLabel:
    '臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间：尔来二十有一年矣。',
  longLabel2: '',
  images: [
    {
      id: 1,
      name: '示例图片1.png',
      url: 'http://image.howcat.cn/thumbnails/d51a6dbd5758ab999d1246154f2d3178.png'
    },
    {
      id: 2,
      name: '示例图片2.png',
      url: 'https://image.howcat.cn/thumbnails/5d0a2d8352a09debab8f8d233a8fc67d.png'
    }
  ],
  files: [
    {
      name: '示例文件.pdf',
      url: 'https://example.com/template.pdf'
    },
    {
      name: '示例文件.xlsx',
      url: 'https://example.com/template.xlsx'
    },
    {
      name: '示例文件.docx',
      url: 'https://example.com/template.docx'
    }
  ],
  files2: [
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    },
    {
      name: 'food2.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    }
  ],
  article:
    '<h1><span style="color: #2972f4">Advanced Element UI</span></h1><p><span style="color: #2972f4">基于 Vue 3 + Element Plus 的面向低代码、AI的高级组件库</span></p><hr><p></p><p><span style="font-size: 20px"><strong>Introduction</strong></span><br>Advanced Element UI 是一个基于 Element Plus 深度封装的高级组件库，专注于提升中后台系统的开发效率。<br>Element Plus 作为 Vue 3 生态中最受欢迎的 UI 组件库之一，其最大优势在于<strong>保持原生、不过度封装</strong>，这为二次开发提供了极大的灵活性。基于这一特点，我们打造了 Advanced Element UI，通过<strong>配置化驱动</strong>的方式，让复杂的表单和表格开发变得简单高效。<br>本项目的 <code>AeForm</code> 和 <code>AeTable</code> 组件完全基于配置数据驱动渲染，实现了<strong>页面、组件、业务逻辑的完全解耦</strong>。开发者只需关注配置项，即可快速构建复杂的业务场景，大幅减少重复代码，提升开发效率。<br></p><p><span style="font-size: 20px"><strong>Features</strong></span><br>- <strong>开箱即用</strong>：基于 Element Plus，无缝集成到 Vue 3 项目<br>- <strong>风格统一</strong>：二次封装的组件在组件属性和样式上遵循 Element Plus 的风格<br>- <strong>数据驱动</strong>：所有组件都遵循<strong>由配置驱动渲染</strong>的核心思想，拒绝硬编码<br>- <strong>丰富图标</strong>：集成 Iconify，支持 10 万+ 图标库<br>- <strong>类型定义</strong>：完整的类型定义和注释，提供良好的开发体验<br>- <strong>自由扩展</strong>：<code>AeForm</code> 和 <code>AeTable</code> 提供了注册函数，可自行注册任何遵循 Element Plus 属性风格的组件。<br></p>'
})

const formModel2 = ref({
  avatar: [
    {
      name: '示例图片1.png',
      url: 'http://image.howcat.cn/thumbnails/d51a6dbd5758ab999d1246154f2d3178.png'
    }
  ],
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
  longLabel:
    '臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间：尔来二十有一年矣。'
})
const descriptionsDirection = ref<'vertical' | 'horizontal'>('horizontal')
const formSchemas = reactive<FormSchema[]>([
  {
    key: 'baseInfo',
    type: 'Decorator',
    component: 'Divider',
    insideProps: {
      renders: {
        default: () => '基本信息'
      }
    },
    anchorLinkProps: {
      enable: true,
      title: '基本信息'
    },
    layoutProps: { alone: true, span: 24 }
  },
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
    key: 'age1',
    field: 'age',
    label: '年龄',
    value: null,
    component: 'InputNumber',
    layoutProps: { span: 8 },
    componentProps: {
      style: { width: '100%' },
      precision: 0,
      min: 1,
      step: 1
    },
    formItemProps: {
      subLabel: '使用 InputNumber 默认控制按钮',
      autoRules: ['isRequired', 'onlyNumber']
    }
  },
  {
    key: 'age2',
    field: 'age',
    label: '年龄',
    value: null,
    component: 'InputNumber',
    layoutProps: { span: 8 },
    componentProps: {
      style: { width: '100%' },
      precision: 0,
      min: 1,
      step: 1,
      controlsPosition: 'right'
    },
    formItemProps: {
      subLabel: '使用 InputNumber 居右控制按钮',
      autoRules: ['isRequired', 'onlyNumber']
    }
  },
  {
    key: 'age3',
    field: 'age',
    label: '年龄',
    value: null,
    component: 'InputNumber',
    layoutProps: { span: 8 },
    componentProps: {
      style: { width: '100%' },
      precision: 0,
      min: 1,
      step: 1,
      controls: false,
      align: 'left'
    },
    insideProps: {
      renders: {
        suffix: () => '周岁'
      }
    },
    formItemProps: {
      subLabel: '无控制按钮 使用插槽添加后缀',
      autoRules: ['isRequired', 'onlyNumber']
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
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 Radio 默认类型',
      autoRules: ['isRequired']
    }
  },
  {
    key: 'sex2',
    field: 'sex',
    label: '性别',
    value: '',
    component: 'Radio',
    componentProps: {
      options: [
        { label: '男', value: 'male', border: true },
        { label: '女', value: 'female', border: true }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 Radio + border',
      autoRules: ['isRequired']
    }
  },
  {
    key: 'sex3',
    field: 'sex',
    label: '性别',
    component: 'RadioButton',
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 RadioButton 类型',
      autoRules: ['isRequired']
    }
  },
  {
    key: 'skillsAndMajor',
    type: 'Decorator',
    component: 'Divider',
    insideProps: {
      renders: {
        default: () => '专业与技能'
      }
    },
    anchorLinkProps: {
      enable: true,
      title: '专业与技能'
    },
    layoutProps: { alone: true, span: 24 }
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
    layoutProps: { span: 8 },
    formItemProps: {
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'skills2',
    field: 'skills',
    label: '技能',
    value: [],
    component: 'Checkbox',
    componentProps: {
      options: [
        { label: 'HTML', value: 'html', border: true },
        { label: 'CSS', value: 'css', border: true },
        { label: 'JavaScript', value: 'javascript', border: true },
        { label: 'Vue', value: 'vue', border: true },
        { label: 'React', value: 'react', border: true }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'skills3',
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
    layoutProps: { span: 8 },
    formItemProps: {
      autoRules: ['isRequiredArray']
    }
  },
  {
    field: 'major',
    label: '专业',
    value: '',
    component: 'Select',
    componentProps: {
      options: [
        { label: '计算机与科学', value: '1' },
        { label: '软件工程', value: '2' },
        { label: '物联网工程', value: '3' },
        { label: 'AI 人工智能', value: '4' },
        { label: '网络工程', value: '5' }
      ]
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
    key: 'hobby1',
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
      subLabel: '多选模式 默认为信息色 禁用时效果不好'
      // autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 8 }
  },
  {
    key: 'hobby2',
    field: 'hobby',
    label: '爱好',
    value: [],
    component: 'Select',
    componentProps: {
      multiple: true,
      tagType: 'success',
      options: [
        { label: '吃饭', value: 'eat' },
        { label: '睡觉', value: 'sleep' },
        { label: '打游戏', value: 'game' },
        { label: '看电影', value: 'movie' }
      ]
    },
    formItemProps: {
      subLabel: '多选模式 成功色'
      // autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 8 }
  },
  {
    key: 'hobby3',
    field: 'hobby',
    label: '爱好',
    value: [],
    component: 'Select',
    componentProps: {
      multiple: true,
      tagType: 'primary',
      tagEffect: 'dark',
      options: [
        { label: '吃饭', value: 'eat' },
        { label: '睡觉', value: 'sleep' },
        { label: '打游戏', value: 'game' },
        { label: '看电影', value: 'movie' }
      ]
    },
    formItemProps: {
      subLabel: '多选模式 主题色 深色效果'
      // autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 8 }
  },
  {
    key: 'address1',
    field: 'address',
    label: '地址',
    value: [],
    component: 'Cascader',
    componentProps: {
      style: { width: '100%' },
      options: [
        {
          label: '中国',
          value: 'CN',
          children: [
            { label: '北京', value: 'CN-BJ' },
            { label: '上海', value: 'CN-SH' },
            { label: '天津', value: 'CN-TJ' },
            { label: '河北', value: 'CN-HE' },
            { label: '山西', value: 'CN-SX' },
            { label: '辽宁', value: 'CN-LN' },
            { label: '吉林', value: 'CN-JL' },
            { label: '黑龙江', value: 'CN-HL' },
            { label: '江苏', value: 'CN-JS' },
            { label: '浙江', value: 'CN-ZJ' },
            { label: '安徽', value: 'CN-AH' },
            { label: '江西', value: 'CN-JX' },
            { label: '山东', value: 'CN-SD' },
            { label: '河南', value: 'CN-HEN' },
            { label: '湖北', value: 'CN-HB' }
          ]
        },
        {
          label: '美国',
          value: 'US',
          children: [
            { label: '纽约', value: 'US-NY' },
            { label: '洛杉矶', value: 'US-LA' }
          ]
        }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 Cascader 默认属性',
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'address2',
    field: 'address2',
    label: '地址',
    value: '',
    component: 'Cascader',
    componentProps: {
      style: { width: '100%' },
      props: {
        checkStrictly: true,
        emitPath: false
      },
      options: [
        {
          label: '中国',
          value: 'CN',
          children: [
            { label: '北京', value: 'CN-BJ' },
            { label: '上海', value: 'CN-SH' },
            { label: '天津', value: 'CN-TJ' },
            { label: '河北', value: 'CN-HE' },
            { label: '山西', value: 'CN-SX' },
            { label: '辽宁', value: 'CN-LN' },
            { label: '吉林', value: 'CN-JL' },
            { label: '黑龙江', value: 'CN-HL' },
            { label: '江苏', value: 'CN-JS' },
            { label: '浙江', value: 'CN-ZJ' },
            { label: '安徽', value: 'CN-AH' },
            { label: '江西', value: 'CN-JX' },
            { label: '山东', value: 'CN-SD' },
            { label: '河南', value: 'CN-HEN' },
            { label: '湖北', value: 'CN-HB' }
          ]
        },
        {
          label: '美国',
          value: 'US',
          children: [
            { label: '纽约', value: 'US-NY' },
            { label: '洛杉矶', value: 'US-LA' }
          ]
        }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 Cascader + checkStrictly',
      autoRules: ['isRequired']
    }
  },
  {
    key: 'address3',
    field: 'address3',
    label: '地址（多选）',
    value: [],
    component: 'Cascader',
    componentProps: {
      style: { width: '100%' },
      props: { multiple: true },
      tagType: 'primary',
      tagEffect: 'dark',
      options: [
        {
          label: '中国',
          value: 'CN',
          children: [
            { label: '北京', value: 'CN-BJ' },
            { label: '上海', value: 'CN-SH' },
            { label: '天津', value: 'CN-TJ' },
            { label: '河北', value: 'CN-HE' },
            { label: '山西', value: 'CN-SX' },
            { label: '辽宁', value: 'CN-LN' },
            { label: '吉林', value: 'CN-JL' },
            { label: '黑龙江', value: 'CN-HL' },
            { label: '江苏', value: 'CN-JS' },
            { label: '浙江', value: 'CN-ZJ' },
            { label: '安徽', value: 'CN-AH' },
            { label: '江西', value: 'CN-JX' },
            { label: '山东', value: 'CN-SD' },
            { label: '河南', value: 'CN-HEN' },
            { label: '湖北', value: 'CN-HB' }
          ]
        },
        {
          label: '美国',
          value: 'US',
          children: [
            { label: '纽约', value: 'US-NY' },
            { label: '洛杉矶', value: 'US-LA' }
          ]
        }
      ]
    },
    layoutProps: { span: 8 },
    formItemProps: {
      subLabel: '采用 Cascader + multiple',
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'longLabel1',
    field: 'longLabel',
    label: '这是一个非常长的标题',
    value: '',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5,
      placeholder: '请输入内容'
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
    field: 'longLabel2',
    label: '这是一个非常非常非常非常非常非常非常非常非常非常非常非常长的标题',
    value: '',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5,
      placeholder: '请输入内容'
    },
    layoutProps: { span: 12 },
    formItemProps: {
      subLabel: '请切换到居左或居右模式查看效果，使用了labelMaxWidth属性来美化长标题',
      labelMaxWidth: 100,
      autoRules: ['isRequired']
    }
  },
  {
    key: 'upload1',
    field: 'images',
    label: '内置图片上传',
    value: [],
    component: 'Upload',
    componentProps: {
      listType: 'picture',
      previewable: true,
      downloadable: true,
      objectFit: 'contain',
      size: 'default',
      accept: 'image/*',
      tips: '支持上传图片，最多可上传 5 张图片，每张图片不超过 2MB',
      sizeLimit: '2MB',
      limit: 5,
      upload: async (file: UploadRawFile) => {
        // 模拟异步上传
        return new Promise(resolve => {
          resolve({
            url: URL.createObjectURL(file),
            name: file.name
          })
        })
      }
    },
    layoutProps: { span: 12 },
    formItemProps: {
      subLabel: '使用了内置的ae-upload组件的照片墙模式',
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'upload2',
    field: 'files',
    label: '内置列表上传',
    value: [],
    component: 'Upload',
    componentProps: {
      listType: 'text',
      previewable: true,
      downloadable: true,
      size: 'default',
      accept: '*/*',
      tips: '支持上传任意文件，最多可上传 5 个文件，每个文件不超过 2MB',
      sizeLimit: '2MB',
      limit: 5,
      upload: async (file: UploadRawFile) => {
        // 模拟异步上传
        return new Promise(resolve => {
          resolve({
            url: URL.createObjectURL(file),
            name: file.name
          })
        })
      }
    },
    layoutProps: { span: 12 },
    formItemProps: {
      subLabel: '使用了内置的ae-upload组件的文件列表模式',
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'upload3',
    field: 'files2',
    label: '使用el-upload',
    value: [],
    component: 'ElUpload',
    componentProps: {
      accept: '*/*',
      limit: 5,
      listType: 'picture',
      style: { width: '100%' },
      action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15'
    },
    insideProps: {
      renders: {
        default: (form, column, disabled) =>
          !disabled && <el-button type="primary">Click to upload</el-button>,
        tip: (form, column, disabled) =>
          !disabled && <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      }
    },
    layoutProps: { span: 12, alone: true },
    formItemProps: {
      subLabel: '通过imports按需加载了el-upload组件',
      autoRules: ['isRequiredArray']
    }
  },
  {
    key: 'group',
    label: '内置分组容器',
    type: 'Container',
    component: 'Group',
    componentProps: {
      subLabel: '内置分组容器，默认支持折叠展开功能'
    },
    children: [
      {
        field: 'groupInput',
        label: '输入框',
        value: '',
        component: 'Input'
      },
      {
        field: 'groupInput2',
        label: '输入框',
        value: '',
        component: 'Input'
      }
    ],
    layoutProps: { span: 24 }
  },
  {
    key: 'group2',
    label: '内置分组容器(无边框)',
    type: 'Container',
    component: 'Group',
    componentProps: {
      border: false,
      bg: false,
      toggleable: false,
      decor: true,
      subLabel: '无边框容器，使用了decor属性来显示装饰块'
    },
    children: [
      {
        field: 'groupInput',
        label: '输入框',
        value: '',
        component: 'Input'
      },
      {
        field: 'groupInput2',
        label: '输入框',
        value: '',
        component: 'Input'
      }
    ],
    layoutProps: { span: 24 }
  },
  {
    key: 'tip',
    label: '使用内置提示容器',
    type: 'Decorator',
    component: 'Alert',
    componentProps: {
      type: 'info',
      title: '提示',
      description:
        'Form组件本身未初始引入el-card组件，但您可以通过imports属性来按需引入任何组件，下方为按需引入后渲染的el-card作为新的容器组件，容器组件会默认将children中的组件渲染到默认插槽中'
    }
  },
  {
    key: 'card',
    label: '使用el-card',
    type: 'Container',
    component: 'ElCard',
    componentProps: {
      shadow: 'never'
    },
    insideProps: {
      renders: {
        header: () => <span>卡片标题</span>
      }
    },
    children: [
      {
        field: 'cardInput',
        label: '输入框',
        value: '',
        component: 'Input'
      },
      {
        field: 'cardInput2',
        label: '输入框',
        value: '',
        component: 'Input'
      }
    ],
    layoutProps: { span: 24 }
  },
  {
    key: 'disclosure',
    label: '内置折叠容器',
    type: 'Container',
    component: 'Disclosure',
    componentProps: {
      subLabel: '内置折叠容器，默认支持折叠展开功能'
    },
    children: [
      {
        field: 'groupInput',
        label: '输入框',
        value: '',
        component: 'Input'
      },
      {
        field: 'groupInput2',
        label: '输入框',
        value: '',
        component: 'Input'
      }
    ],
    layoutProps: { span: 24 }
  },
  {
    field: 'list',
    label: '列表',
    component: 'Table',
    value: [],
    componentProps: {
      border: true,
      columns: [
        { key: 'listIndex', type: 'index', label: '序号' },
        {
          key: 'listName',
          field: 'name',
          label: '名称',
          editProps: {
            component: 'Input',
            rules: [{ required: true, message: '请输入名称', trigger: 'change' }]
          }
        },
        {
          key: 'listAge',
          field: 'age',
          label: '年龄',
          editProps: {
            component: 'Input',
            rules: [{ required: true, message: '请输入年龄', trigger: 'change' }]
          }
        },
        {
          key: 'listSex',
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
          key: 'listAction',
          label: '操作',
          type: 'action',
          hidden: (row, index, column, form, excontext, editable) => !editable,
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
      ] as TableColumn[]
    },
    outsideProps: {
      enable: true,
      direction: 'column',
      style: { alignItems: 'flex-start', gap: '10px' },
      prependRender: (form, column, disabled, excontext) => {
        const onAdd = () => {
          console.log('add', form)
          form.list.push({ name: '', age: '', sex: '' })
        }
        return !disabled ? (
          <el-button type="primary" onclick={() => onAdd()}>
            添加
          </el-button>
        ) : undefined
      }
    },
    formItemProps: {
      autoRules: ['isRequiredArray']
    },
    layoutProps: { span: 24 }
  },
  {
    field: 'article',
    label: '文章',
    component: 'Editor',
    value: '',
    componentProps: {
      editorHeight: 600,
      viewHeight: 500
    },
    layoutProps: {
      span: 24
    }
  }
])
const formSchemas2 = reactive<FormSchema[]>([
  {
    key: 'desc',
    label: '基本信息',
    type: 'Descriptions',
    componentProps: {
      column: 3,
      extra: '自定义扩展信息',
      labelWidth: '80px',
      _v_direction: () => {
        return descriptionsDirection.value
      }
    },
    children: [
      {
        field: 'avatar',
        label: '头像',
        value: [],
        component: 'Upload',
        componentProps: {
          accept: 'image/*',
          limit: 1,
          listType: 'picture',
          upload: async (file: UploadRawFile) => {
            // 模拟异步上传
            return new Promise(resolve => {
              resolve({
                url: URL.createObjectURL(file),
                name: file.name
              })
            })
          }
        },
        descriptionsItemProps: {
          span: 1,
          rowspan: 2,
          width: 140,
          labelWidth: 50
        },
        formItemProps: {
          subLabel:
            '在formItemProps.subLabel配置副标题时，主标题将展现为特殊样式，并通过tooltip组件展示副标题内容'
        }
      },
      {
        field: 'username',
        label: '用户名',
        value: '',
        component: 'Input',
        descriptionsItemProps: { span: 1 },
        formItemProps: {
          autoRules: ['isRequired']
        }
      },
      {
        field: 'phone',
        label: '手机号码',
        value: '',
        component: 'Input',
        descriptionsItemProps: { span: 1 },
        formItemProps: {
          autoRules: ['isRequired', 'isTelephone']
        }
      },
      {
        field: 'place',
        label: '地点',
        value: '',
        component: 'Cascader',
        componentProps: {
          style: { width: '100%' },
          options: [
            {
              label: '中国',
              value: 'CN',
              children: [
                { label: '北京', value: 'CN-BJ' },
                { label: '上海', value: 'CN-SH' },
                { label: '天津', value: 'CN-TJ' },
                { label: '河北', value: 'CN-HE' },
                { label: '山西', value: 'CN-SX' },
                { label: '辽宁', value: 'CN-LN' },
                { label: '吉林', value: 'CN-JL' },
                { label: '黑龙江', value: 'CN-HL' },
                { label: '江苏', value: 'CN-JS' },
                { label: '浙江', value: 'CN-ZJ' },
                { label: '安徽', value: 'CN-AH' },
                { label: '江西', value: 'CN-JX' },
                { label: '山东', value: 'CN-SD' },
                { label: '河南', value: 'CN-HEN' },
                { label: '湖北', value: 'CN-HB' }
              ]
            },
            {
              label: '美国',
              value: 'US',
              children: [
                { label: '纽约', value: 'US-NY' },
                { label: '洛杉矶', value: 'US-LA' }
              ]
            }
          ]
        },
        descriptionsItemProps: { span: 1 }
      },
      {
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
        descriptionsItemProps: { span: 1 },
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
        descriptionsItemProps: { span: 3 },
        formItemProps: {
          autoRules: ['isRequiredArray']
        }
      },
      {
        field: 'address',
        label: '详细地址',
        value: '',
        component: 'Input',
        componentProps: {
          type: 'textarea',
          rows: 2
        },
        descriptionsItemProps: { span: 3 },
        formItemProps: {
          autoRules: ['isRequired']
        }
      }
    ]
  },
  {
    key: 'desc2',
    label: '其他信息',
    type: 'Descriptions',
    componentProps: {
      column: 24,
      extra: '自定义扩展信息',
      labelWidth: '80px',
      _v_direction: () => {
        return descriptionsDirection.value
      }
    },
    children: [
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
        descriptionsItemProps: { span: 12 }
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
        descriptionsItemProps: { span: 12 }
      },
      {
        field: 'status',
        label: '状态',
        value: '',
        type: 'Inputer',
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
        descriptionsItemProps: { span: 12 }
      },
      {
        field: 'hobby',
        label: '爱好',
        value: [],
        component: 'Select',
        componentProps: {
          multiple: true,
          tagType: 'primary',
          tagEffect: 'dark',
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
        descriptionsItemProps: { span: 12 }
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
        descriptionsItemProps: { span: 24 },
        formItemProps: {
          subLabel: '',
          autoRules: ['isRequired']
        }
      },
      {
        key: 'longLabel2',
        field: 'longLabel',
        label: '这是一个非常非常非常非常非常非常非常非常非常非常非常非常长的标题',
        value: '',
        component: 'Input',
        componentProps: {
          type: 'textarea',
          rows: 5
        },
        descriptionsItemProps: { span: 24 },
        formItemProps: {
          subLabel: '',
          autoRules: ['isRequired']
        }
      }
    ]
  }
])

const AeFormRef = ref()
const AeDescFormRef = ref()

async function onSubmit() {
  if (await AeFormRef?.value?.validate()) {
    ElMessage.success('表单校验成功！请在控制台查看表单数据')
    const formData = AeFormRef?.value?.getFormModel()
    console.log('表单数据：', formData)
  }
}

function onReset() {
  AeFormRef?.value?.clearValues()
  ElMessage.info('表单已重置')
}

async function onSubmit2() {
  if (await AeDescFormRef?.value?.validate()) {
    ElMessage.success('表单校验成功！请在控制台查看表单数据')
    const formData = AeDescFormRef?.value?.getFormModel()
    console.log('表单数据：', formData)
  }
}

function onReset2() {
  AeDescFormRef?.value?.clearValues()
  ElMessage.info('表单已重置')
}
</script>
