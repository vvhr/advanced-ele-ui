<template>
  <div class="usage-example">
    <h2>RenderDesigner 使用示例</h2>

    <!-- 示例1：在表单配置中使用 RenderDesigner -->
    <el-card class="example-card">
      <template #header>
        <span>示例1：配置 appendRender</span>
      </template>

      <el-form :model="formConfig" label-width="120px">
        <el-form-item label="邮箱字段">
          <el-input v-model="formConfig.email" placeholder="邮箱" />
        </el-form-item>

        <el-form-item label="后置组件">
          <RenderDesigner
            v-model="formConfig.appendRender"
            :available-fields="availableFields"
            @change="handleRenderChange"
          />
        </el-form-item>

        <el-form-item label="配置预览">
          <pre>{{ JSON.stringify(formConfig.appendRender, null, 2) }}</pre>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 示例2：在表单中使用配置 -->
    <el-card class="example-card">
      <template #header>
        <span>示例2：实际表单渲染</span>
      </template>

      <AeForm
        :schemas="formSchemas"
        :model="formModel"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AeForm } from '../../Form'
import { RenderDesigner } from '../index'
import { resolveRender } from '../utils/render-resolver'
import type { FormSchema } from '../../Form/src/types/schema'
import type { RenderComponentConfig } from '../types/designer-config'

const formConfig = ref({
  email: '',
  appendRender: null as RenderComponentConfig | null
})

const formModel = ref({
  type: 1,
  status: 'active',
  email: '',
  emailDomain: '@163.com'
})

const availableFields = [
  { path: 'formModel.type', label: '类型', type: 'number' },
  { path: 'formModel.status', label: '状态', type: 'string' },
  { path: 'formModel.email', label: '邮箱', type: 'string' },
  { path: 'formModel.emailDomain', label: '邮箱域名', type: 'string' }
]

function handleRenderChange(value: RenderComponentConfig | null) {
  console.log('Render 配置变化:', value)
}

// 将配置转换为 FormSchema
const formSchemas = computed<FormSchema[]>(() => {
  const schemas: FormSchema[] = [
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
        style: { gap: '10px' }
      }
    }
  ]

  // 如果有配置的 appendRender，使用 renderResolver 转换
  if (formConfig.value.appendRender) {
    schemas[0].outsideProps!.appendRender = resolveRender(formConfig.value.appendRender)
  }

  return schemas
})
</script>

<style scoped>
.usage-example {
  padding: 20px;
}

.example-card {
  margin-bottom: 20px;
}

pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
