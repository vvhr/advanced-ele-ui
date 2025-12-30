<template>
  <AeTable
    v-model="data"
    :columns="columns"
    :pagination="pagination"
    @page-change="onPageChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const data = ref([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 }
])

const columns = [
  { type: 'index', label: '序号', width: 60 },
  { field: 'name', label: '姓名' },
  { field: 'age', label: '年龄' }
]

const pagination = reactive({
  total: 2,
  page: 1,
  pageSize: 10
})

const onPageChange = ({ page, pageSize }) => {
  console.log('Page changed:', page, pageSize)
}
</script>
