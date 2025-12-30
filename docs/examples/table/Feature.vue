<template>
  <AeTable
    v-model="data"
    :columns="columns"
    border
    stripe
    :show-summary="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const data = ref([
  {
    name: '张三',
    amount: 1234567.89,
    phone: '13812345678',
    status: '1',
    date: '2025-01-01 12:00:00'
  },
  {
    name: '李四',
    amount: 98765.43,
    phone: '13987654321',
    status: '0',
    date: '2025-02-15 09:30:00'
  }
])

const columns = [
  { type: 'index', label: '#', width: 50, fixed: 'left' },
  { field: 'name', label: '姓名 (固定列)', width: 120, fixed: 'left' },
  {
    field: 'amount',
    label: '金额 (千分位)',
    type: 'amount',
    minWidth: 150,
    summable: true, // 开启合计
    typeProps: {
      amountThousand: true,
      amountUnit: '¥',
      amountUnitPosition: 'left'
    }
  },
  {
    field: 'phone',
    label: '手机号 (脱敏)',
    minWidth: 140,
    type: 'sensitive',
    typeProps: {
      sensitiveType: 'phone',
      sensitiveHover: true // 悬浮显示明文
    }
  },
  {
    field: 'status',
    label: '状态 (字典Tag)',
    type: 'dict',
    typeProps: {
      dictViewType: 'tag',
      dictOptions: [
        { label: '启用', value: '1', type: 'success' },
        { label: '禁用', value: '0', type: 'danger' }
      ]
    }
  },
  {
    field: 'date',
    label: '日期格式化',
    type: 'date',
    minWidth: 160,
    typeProps: {
      dateFormat: 'YYYY年MM月DD日'
    }
  },
  {
    key: 'action',
    label: '操作',
    type: 'action',
    width: 180,
    fixed: 'right',
    typeProps: {
      actions: [
        {
          label: '编辑',
          name: 'edit',
          type: 'primary',
          event: (row) => ElMessage.success(`编辑: ${row.name}`)
        },
        {
          label: '删除',
          name: 'delete',
          type: '', // 默认样式
          event: (row) => ElMessage.warning(`删除: ${row.name}`)
        }
      ]
    }
  }
]
</script>
