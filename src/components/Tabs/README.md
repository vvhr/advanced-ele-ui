# Tabs 组件

基于 Element Plus ElTabs 的二次封装组件，解决实际项目中的高度自适应和性能优化问题。

## 特性

- 📦 继承 ElTabs 所有原生属性
- 📏 支持高度自适应（fill-height）
- ⚡ 支持懒加载（lazy）
- 💾 支持缓存已加载的标签页（keep-alive）
- 🎯 更好的类型提示

## 基础用法

```vue
<template>
  <Tabs v-model="activeTab">
    <TabPane label="用户管理" name="first">
      <div>用户管理内容</div>
    </TabPane>
    <TabPane label="配置管理" name="second">
      <div>配置管理内容</div>
    </TabPane>
  </Tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabPane } from '@/components/Tabs'

const activeTab = ref('first')
</script>
```

## Props

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值，选中选项卡的 name | string \| number | '' |
| fillHeight | 是否填充父容器高度 | boolean | false |
| lazy | 是否懒加载标签页内容 | boolean | false |
| keepAlive | 懒加载模式下是否缓存已加载的标签页 | boolean | true |
| ...其他 | 继承 ElTabs 所有属性 | - | - |

### TabPane Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项卡标题 | string | '' |
| name | 与选项卡绑定值 value 对应的标识符 | string \| number | - |
| disabled | 是否禁用 | boolean | false |
| closable | 标签是否可关闭 | boolean | false |
| lazy | 是否懒加载（优先级高于 Tabs 的 lazy） | boolean | undefined |
| ...其他 | 继承 ElTabPane 所有属性 | - | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 绑定值变化时触发 | (value: string \| number) => void |
| tab-click | tab 被选中时触发 | (pane: any, ev: Event) => void |
| tab-change | activeName 改变时触发 | (name: string \| number) => void |
| tab-remove | 点击 tab 移除按钮时触发 | (name: string \| number) => void |
| tab-add | 点击 tabs 的新增按钮时触发 | () => void |
| edit | 点击 tabs 的新增或移除按钮时触发 | (targetName: string \| number \| undefined, action: 'add' \| 'remove') => void |

## 示例

### 高度自适应

```vue
<template>
  <div style="height: 500px">
    <Tabs v-model="activeTab" fill-height>
      <TabPane label="用户管理" name="first">
        <div>
          <!-- 内容超出高度会自动显示滚动条 -->
          <p v-for="i in 50" :key="i">用户数据 {{ i }}</p>
        </div>
      </TabPane>
      <TabPane label="配置管理" name="second">
        <div>配置管理内容</div>
      </TabPane>
    </Tabs>
  </div>
</template>
```

> 💡 `fill-height` 模式下，Tabs 会占满父容器高度，内容区域超出时自动显示滚动条，避免页面整体滚动。

### 懒加载

```vue
<template>
  <Tabs v-model="activeTab" lazy>
    <TabPane label="用户管理" name="first">
      <UserManagement />
    </TabPane>
    <TabPane label="配置管理" name="second">
      <ConfigManagement />
    </TabPane>
    <TabPane label="日志管理" name="third">
      <LogManagement />
    </TabPane>
  </Tabs>
</template>
```

> 💡 `lazy` 模式下，只有被激活的标签页才会渲染内容，未激活的标签页不会渲染，提升性能。

### 懒加载 + 缓存

```vue
<template>
  <Tabs v-model="activeTab" lazy :keep-alive="true">
    <TabPane label="用户管理" name="first">
      <UserManagement />
    </TabPane>
    <TabPane label="配置管理" name="second">
      <ConfigManagement />
    </TabPane>
  </Tabs>
</template>
```

> 💡 `keep-alive` 为 `true` 时（默认），标签页被激活一次后会缓存，再次激活时不会重新渲染。设置为 `false` 则每次激活都会重新渲染。

### 单个标签页控制懒加载

```vue
<template>
  <Tabs v-model="activeTab">
    <TabPane label="用户管理" name="first">
      <UserManagement />
    </TabPane>
    <TabPane label="配置管理" name="second" :lazy="true">
      <!-- 只有这个标签页使用懒加载 -->
      <ConfigManagement />
    </TabPane>
    <TabPane label="日志管理" name="third">
      <LogManagement />
    </TabPane>
  </Tabs>
</template>
```

> 💡 TabPane 的 `lazy` 属性优先级高于 Tabs 的 `lazy` 属性，可以单独控制某个标签页是否懒加载。

### 结合 Dialog/Drawer 使用

```vue
<template>
  <Dialog v-model="visible" title="用户详情" :scrollable="false" width="800px">
    <Tabs v-model="activeTab" fill-height>
      <TabPane label="基本信息" name="first">
        <el-form>
          <!-- 表单内容 -->
        </el-form>
      </TabPane>
      <TabPane label="详细信息" name="second">
        <div>详细信息内容</div>
      </TabPane>
    </Tabs>
  </Dialog>
</template>
```

> 💡 在 Dialog/Drawer 中使用时，设置 `scrollable="false"` 和 `fill-height`，可以让 Tabs 完美填充容器。

## 二次封装解决的问题

### 1. 高度自适应问题

**问题：** 原生 ElTabs 根据内容决定高度，在固定高度容器中使用时，内容过多会导致页面整体滚动，破坏布局。

**解决：** 提供 `fill-height` 属性，使用 flex 布局让 Tabs 填充父容器高度，内容区域自动显示滚动条。

### 2. 性能优化问题

**问题：** 原生 ElTabs 会一次性渲染所有标签页内容，即使用户没有查看，导致初始加载慢、内存占用高。

**解决：** 提供 `lazy` 属性，只渲染当前激活的标签页，大幅提升性能。

### 3. 缓存控制问题

**问题：** 懒加载后，每次切换标签页都会重新渲染，导致状态丢失、重复请求数据。

**解决：** 提供 `keep-alive` 属性，缓存已加载的标签页，避免重复渲染和数据请求。
