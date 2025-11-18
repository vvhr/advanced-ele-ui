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

    <!-- 二次封装说明 -->
    <el-card class="demo-card feature-card">
      <template #header>
        <div class="card-header">
          <span>🎯 二次封装的优势</span>
        </div>
      </template>
      <div class="feature-content">
        <h3>为什么要二次封装 ElTabs？</h3>
        <p>
          原生 ElTabs
          在实际项目中存在两个主要问题：高度自适应困难和性能优化不足。通过二次封装，我们提供了更好的解决方案：
        </p>

        <div class="feature-section">
          <h4>📏 1. 高度自适应问题</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生 ElTabs 根据内容决定高度，在固定高度容器中使用时，内容过多会导致页面整体滚动
            </li>
            <li>
              <strong>影响：</strong>
              破坏页面布局，用户体验差，特别是在 Dialog/Drawer 中使用时
            </li>
            <li>
              <strong>解决：</strong>
              提供 fill-height 属性，使用 flex 布局让 Tabs 填充父容器高度，内容区域自动显示滚动条
            </li>
            <li>
              <strong>效果：</strong>
              标签页内容区域独立滚动，不影响页面整体布局，视口内容完整
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>⚡ 2. 性能优化问题</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生 ElTabs 会一次性渲染所有标签页内容，即使用户没有查看
            </li>
            <li>
              <strong>影响：</strong>
              初始加载慢、内存占用高、不必要的 API 请求、组件生命周期浪费
            </li>
            <li>
              <strong>解决：</strong>
              提供 lazy 属性，只渲染当前激活的标签页，未激活的标签页不会渲染
            </li>
            <li>
              <strong>效果：</strong>
              大幅提升初始加载速度，减少内存占用，避免不必要的数据请求
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>💾 3. 缓存控制问题</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              懒加载后，每次切换标签页都会重新渲染，导致状态丢失、重复请求数据
            </li>
            <li>
              <strong>影响：</strong>
              用户输入的表单数据丢失、重复的 API 请求、组件状态无法保持
            </li>
            <li>
              <strong>解决：</strong>
              提供 keep-alive 属性（默认 true），缓存已加载的标签页
            </li>
            <li>
              <strong>效果：</strong>
              标签页状态保持，避免重复渲染和数据请求，用户体验更流畅
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🎯 4. 灵活的控制粒度</h4>
          <ul>
            <li>
              <strong>全局控制：</strong>
              在 Tabs 组件上设置 lazy 和 keep-alive，所有标签页统一行为
            </li>
            <li>
              <strong>单独控制：</strong>
              在 TabPane 组件上设置 lazy，可以单独控制某个标签页的行为
            </li>
            <li>
              <strong>优先级：</strong>
              TabPane 的 lazy 属性优先级高于 Tabs 的 lazy 属性
            </li>
          </ul>
        </div>

        <div class="summary">
          <h4>💡 总结</h4>
          <p>
            二次封装的 Tabs 组件完美解决了原生 ElTabs 在实际项目中的痛点。
            <strong>完全兼容 ElTabs 的所有原生属性和事件</strong>
            ，同时提供了更好的高度控制和性能优化。特别适合：
          </p>
          <ul>
            <li>✅ 在 Dialog/Drawer 中使用标签页</li>
            <li>✅ 标签页内容较多，需要性能优化</li>
            <li>✅ 需要保持标签页状态的场景</li>
            <li>✅ 固定高度容器中的标签页布局</li>
          </ul>
        </div>
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

.feature-card {
  margin-top: 20px;
}

.feature-content {
  line-height: 1.8;
}

.feature-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 15px;
}

.feature-content > p {
  color: var(--el-text-color-regular);
  margin-bottom: 20px;
}

.feature-section {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border-left: 4px solid var(--el-color-warning);
}

.feature-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.feature-section ul {
  margin: 0;
  padding-left: 20px;
}

.feature-section li {
  margin: 8px 0;
  color: var(--el-text-color-regular);
}

.feature-section strong {
  color: var(--el-color-warning);
  font-weight: 600;
}

.summary {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    var(--el-color-warning-light-9) 0%,
    var(--el-color-success-light-9) 100%
  );
  border-radius: 8px;
  border: 1px solid var(--el-color-warning-light-7);
}

.summary h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.summary p {
  color: var(--el-text-color-regular);
  margin: 0 0 10px 0;
}

.summary ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.summary li {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}

.summary strong {
  color: var(--el-color-warning);
  font-weight: 600;
}
</style>
