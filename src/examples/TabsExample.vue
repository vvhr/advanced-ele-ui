<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabPane } from '../components/Tabs'

const basicTab = ref('first')
const fillHeightTab = ref('first')
</script>

<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级标签页</h2>
    </div>

    <!-- 基础用法 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>基础用法</span>
        </div>
      </template>
      <Tabs v-model="basicTab">
        <TabPane label="用户管理" name="first">
          <div class="tab-content">
            <h4>用户管理</h4>
            <p>这是一个基础的标签页示例。</p>
            <p>所有标签页内容会一次性渲染。</p>
          </div>
        </TabPane>
        <TabPane label="配置管理" name="second">
          <div class="tab-content">
            <h4>配置管理</h4>
            <p>配置管理的内容区域。</p>
          </div>
        </TabPane>
        <TabPane label="角色管理" name="third">
          <div class="tab-content">
            <h4>角色管理</h4>
            <p>角色管理的内容区域。</p>
          </div>
        </TabPane>
      </Tabs>
    </el-card>

    <!-- 高度自适应 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>高度自适应（fill-height）</span>
        </div>
      </template>
      <div style="height: 400px; border: 2px dashed var(--el-border-color); padding: 10px">
        <Tabs v-model="fillHeightTab" fill-height>
          <TabPane label="用户列表" name="first">
            <div class="tab-content">
              <h4>用户列表（内容超出显示滚动条）</h4>
              <p>
                设置
                <code>fill-height</code>
                后，标签页会填充父容器高度。
              </p>
              <p>内容超出时会自动显示滚动条，而不是让整个页面滚动。</p>
              <div style="margin-top: 20px">
                <p
                  v-for="i in 50"
                  :key="i"
                  style="padding: 5px; background: var(--el-fill-color-light); margin: 5px 0"
                >
                  用户数据 {{ i }}
                </p>
              </div>
            </div>
          </TabPane>
          <TabPane label="配置列表" name="second">
            <div class="tab-content">
              <h4>配置列表</h4>
              <p>这个标签页的内容较少，不会出现滚动条。</p>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.demo-section {
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-content {
  padding: 20px;
}

.tab-content h4 {
  margin: 0 0 15px 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 600;
}

.tab-content p {
  margin: 10px 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

code {
  padding: 2px 6px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--el-color-primary);
  font-size: 14px;
}
</style>
