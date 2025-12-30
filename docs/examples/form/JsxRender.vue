<template>
  <AeForm :model="model" :schemas="schemas" />
</template>

<script setup lang="tsx">
import { ref } from 'vue'

const model = ref({
  email: '',
  domain: '@gmail.com'
})

const schemas = [
  {
    field: 'email',
    label: 'JSX 渲染示例',
    component: 'Input',
    outsideProps: {
      enable: true,
      direction: 'row',
      // 使用 JSX 渲染后缀
      appendRender: (form) => (
        <div style="margin-left: 10px; color: #409eff; display: flex; align-items: center;">
          <i class="i-ep-info-filled" style="margin-right: 4px"></i>
          当前后缀: <strong>{model.value.domain}</strong>
        </div>
      )
    },
    formItemProps: {
        subLabel: '此示例演示了如何在 schema 中使用 JSX 函数渲染'
    }
  }
]
</script>
