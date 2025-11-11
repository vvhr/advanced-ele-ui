<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级表格组件</h2>
      <p>支持多种列类型、可编辑、分页、排序等功能</p>
    </div>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>基础表格示例</span>
          <div class="card-actions">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
          </div>
        </div>
      </template>

      <AeTable
        ref="AeTableRef"
        v-model="tableData"
        :columns="tableColumns"
        :form="{}"
        :data-source="{}"
        :dict="{}"
        :pagination="tablePagination"
        :loading="tableLoading"
        border
        stripe
      />
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <span>可编辑表格示例</span>
      </template>

      <AeTable
        v-model="editableTableData"
        :columns="editableTableColumns"
        :form="{}"
        :data-source="{}"
        :dict="{}"
        :editable="true"
        border
      />
    </el-card>

    <el-card class="demo-card feature-card">
      <template #header>
        <span>✨ 核心特性</span>
      </template>
      <ul class="feature-list">
        <li>📋 多种列类型（索引、选择、操作、字典、日期、金额、敏感信息）</li>
        <li>✏️ 支持行内编辑模式</li>
        <li>📄 内置分页功能</li>
        <li>🔍 支持排序、筛选</li>
        <li>📌 支持列固定</li>
        <li>💰 金额格式化（千分位、小数位）</li>
        <li>🔒 敏感信息脱敏（手机号、身份证、邮箱）</li>
        <li>🎯 灵活的操作列配置</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Table as AeTable, TableColumn } from '@/components/Table'
import { ElMessage } from 'element-plus'

const AeTableRef = ref()
const tableLoading = ref(false)
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    amount: 12345.67,
    status: 'active',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13900139000',
    amount: 98765.43,
    status: 'inactive',
    createTime: '2024-02-20 14:20:00'
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13700137000',
    amount: 54321.0,
    status: 'active',
    createTime: '2024-03-10 09:15:00'
  }
])

const tablePagination = reactive({
  total: 3,
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper'
})

const tableColumns: TableColumn[] = [
  { key: 'selection', type: 'selection', width: 55, fixed: 'left' },
  { key: 'index', type: 'index', label: '序号', width: 80 },
  { field: 'name', label: '姓名', width: 120, subLabel: '自定义副标题' },
  { field: 'age', label: '年龄', width: 100 },
  { field: 'email', label: '邮箱', minWidth: 180 },
  {
    field: 'phone',
    label: '手机号',
    width: 150,
    type: 'sensitive',
    typeProps: { sensitiveType: 'phone', sensitiveHover: true }
  },
  {
    field: 'amount',
    label: '金额',
    width: 150,
    type: 'amount',
    typeProps: {
      amountThousand: true,
      amountDecimal: true,
      amountDigits: 2,
      amountUnit: '元',
      amountUnitPosition: 'right'
    }
  },
  {
    field: 'status',
    label: '状态',
    width: 100,
    type: 'dict',
    typeProps: {
      dictViewType: 'tag',
      dictOptions: [
        { label: '正常', value: 'active', type: 'success' },
        { label: '禁用', value: 'inactive', type: 'danger' }
      ]
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    width: 180,
    type: 'date',
    typeProps: { dateFormat: 'YYYY-MM-DD HH:mm:ss' }
  },
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 200,
    fixed: 'right',
    typeProps: {
      actions: [
        {
          label: '查看',
          name: 'view',
          icon: 'ep:view',
          event: row => {
            ElMessage.info(`查看：${row.name}`)
          }
        },
        {
          label: '编辑',
          name: 'edit',
          icon: 'ep:edit',
          type: 'primary',
          event: row => {
            ElMessage.success(`编辑：${row.name}`)
          }
        }
      ]
    }
  }
]

const editableTableData = ref([
  { id: 1, name: '产品A', price: 100, quantity: 10 },
  { id: 2, name: '产品B', price: 200, quantity: 20 },
  { id: 3, name: '产品C', price: 300, quantity: 30 }
])

const editableTableColumns: TableColumn[] = [
  { key: 'index', type: 'index', label: '序号', width: 80 },
  {
    field: 'name',
    label: '产品名称',
    editProps: {
      component: 'Input',
      rules: [{ required: true, message: '请输入产品名称' }]
    }
  },
  {
    field: 'price',
    label: '单价',
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0, options: [] } as any,
      rules: [{ required: true, message: '请输入单价' }]
    }
  },
  {
    field: 'quantity',
    label: '数量',
    editProps: {
      component: 'InputNumber',
      componentProps: { min: 0, options: [] } as any,
      rules: [{ required: true, message: '请输入数量' }]
    }
  },
  {
    field: 'total',
    label: '总价',
    formatter: row => (row.price * row.quantity).toFixed(2)
  }
]

function handleAdd() {
  ElMessage.success('新增功能')
}

function handleRefresh() {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('刷新成功')
  }, 1000)
}
</script>
