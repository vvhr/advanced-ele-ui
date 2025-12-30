<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  text: '默认文本',
  num1: 1,
  single: '',
  r1: '1',
  files: [],
  content: '<p>Hello</p>'
})

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' }
]

const schemas = [
  {
    key: 'divider1',
    type: 'Decorator',
    component: 'Divider',
    insideProps: { renders: { default: () => '基础输入' } },
    layoutProps: { span: 24 }
  },
  {
    field: 'text',
    label: '文本框',
    component: 'Input'
  },
  {
    field: 'num1',
    label: '数字',
    component: 'InputNumber'
  },
  {
    key: 'divider2',
    type: 'Decorator',
    component: 'Divider',
    insideProps: { renders: { default: () => '选择类' } },
    layoutProps: { span: 24 }
  },
  {
    field: 'single',
    label: '下拉选择',
    component: 'Select',
    componentProps: { options }
  },
  {
    field: 'r1',
    label: '单选框',
    component: 'Radio',
    componentProps: { options }
  },
  {
    key: 'divider3',
    type: 'Decorator',
    component: 'Divider',
    insideProps: { renders: { default: () => '高级组件' } },
    layoutProps: { span: 24 }
  },
  {
    field: 'files',
    label: '上传',
    component: 'Upload',
    componentProps: { limit: 1 }
  },
  {
    field: 'content',
    label: '编辑器',
    component: 'Editor',
    layoutProps: { span: 24 },
    componentProps: { viewHeight: 200 }
  }
]
</script>
