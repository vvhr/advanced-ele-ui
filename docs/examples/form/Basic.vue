<template>
  <AeForm
    ref="aeFormRef"
    :model="formModel"
    :schemas="schemas"
  />
  <el-button type="primary" @click="onSubmit">提交</el-button>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formModel = ref({
  username: '',
  password: ''
})

const schemas = reactive([
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    formItemProps: {
      autoRules: ['isRequired']
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
    componentProps: {
      type: 'password',
      showPassword: true
    },
    formItemProps: {
      autoRules: ['isRequired']
    }
  }
])

const aeFormRef = ref()

const onSubmit = async () => {
  if (await aeFormRef.value.validate()) {
    ElMessage.success('校验通过')
    console.log(aeFormRef.value.getFormModel())
  }
}
</script>
