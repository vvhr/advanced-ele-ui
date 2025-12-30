<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button @click="editable = !editable">
        {{ editable ? '退出编辑' : '进入编辑' }}
      </el-button>
      <el-button type="primary" @click="onSubmit">获取数据</el-button>
    </div>
    <AeTable
      ref="tableRef"
      v-model="data"
      :columns="columns"
      :editable="editable"
      border
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const editable = ref(true)
const tableRef = ref()

const data = ref([
  {
    input: '示例文本',
    number: 10,
    select: '1',
    radio: '1',
    checkbox: ['html']
  }
])

const columns = [
  {
    field: 'input',
    label: 'Input 输入框',
    editProps: {
      component: 'Input',
      formItemProps: { rules: [{ required: true, message: '必填' }] }
    }
  },
  {
    field: 'number',
    label: 'InputNumber',
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0, max: 100 }
    }
  },
  {
    field: 'select',
    label: 'Select 选择',
    editProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '选项A', value: '1' },
          { label: '选项B', value: '2' }
        ]
      }
    }
  },
  {
    field: 'radio',
    label: 'Radio 单选',
    editProps: {
      component: 'Radio',
      componentProps: {
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      }
    }
  },
  {
    field: 'checkbox',
    label: 'Checkbox 多选',
    width: 200,
    editProps: {
      component: 'Checkbox',
      componentProps: {
        options: [
          { label: 'HTML', value: 'html' },
          { label: 'CSS', value: 'css' }
        ]
      }
    }
  }
]

const onSubmit = async () => {
  if (await tableRef.value.validate()) {
    ElMessage.success('校验通过')
    console.log(data.value)
  }
}
</script>
