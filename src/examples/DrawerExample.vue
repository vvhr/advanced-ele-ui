<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, QuestionFilled, Setting } from '@element-plus/icons-vue'
import { Drawer } from '../components/Drawer'

const basicDrawerVisible = ref(false)
const directionDrawerVisible = ref(false)
const drawerDirection = ref<'rtl' | 'ltr' | 'ttb' | 'btt'>('rtl')
const sizeDrawerVisible = ref(false)
const beforeCloseDrawerVisible = ref(false)
const tabsDrawerVisible = ref(false)
const customActionsDrawerVisible = ref(false)
const activeTab = ref('first')

// 处理基础抽屉确认
const handleBasicConfirm = () => {
  ElMessage.success('确认操作')
  basicDrawerVisible.value = false
}

// 打开指定方向的抽屉
const openDirectionDrawer = (direction: 'rtl' | 'ltr' | 'ttb' | 'btt') => {
  drawerDirection.value = direction
  directionDrawerVisible.value = true
}

// 关闭前确认
const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭抽屉吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 自定义操作按钮
const handleRefresh = () => {
  ElMessage.success('刷新数据')
}

const handleHelp = () => {
  ElMessage.info('打开帮助文档')
}

const handleSettings = () => {
  ElMessage.info('打开设置')
}
</script>

<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级抽屉</h2>
    </div>
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
        </div>
      </template>
      <el-button type="primary" @click="basicDrawerVisible = true">基础抽屉</el-button>
      <el-button type="success" @click="openDirectionDrawer('rtl')">从右侧打开</el-button>
      <el-button type="success" @click="openDirectionDrawer('ltr')">从左侧打开</el-button>
      <el-button type="success" @click="openDirectionDrawer('ttb')">从顶部打开</el-button>
      <el-button type="success" @click="openDirectionDrawer('btt')">从底部打开</el-button>
      <el-button type="warning" @click="sizeDrawerVisible = true">自定义尺寸</el-button>
      <el-button type="danger" @click="beforeCloseDrawerVisible = true">关闭前确认抽屉</el-button>
      <el-button type="info" @click="tabsDrawerVisible = true">标签页抽屉</el-button>
      <el-button @click="customActionsDrawerVisible = true">自定义操作按钮</el-button>
    </el-card>

    <!-- 基础抽屉 -->
    <Drawer v-model="basicDrawerVisible" title="基础抽屉" @close="handleBasicConfirm">
      <p>这是一个基础的抽屉示例。</p>
      <p>抽屉默认支持以下特性：</p>
      <ul>
        <li>标题栏和底部区域带有边框</li>
        <li>关闭时自动销毁内容</li>
        <li>点击遮罩层不关闭（可配置）</li>
        <li>内置滚动条支持</li>
        <li>优化的关闭按钮样式</li>
      </ul>
      <template #footer>
        <el-button @click="basicDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBasicConfirm">确认</el-button>
      </template>
    </Drawer>

    <!-- 方向抽屉 -->
    <Drawer v-model="directionDrawerVisible" title="方向抽屉" :direction="drawerDirection">
      <div>
        <p>📍 当前打开方向：{{ drawerDirection }}</p>
        <p>抽屉支持四个方向打开：</p>
        <ul>
          <li>
            <code>rtl</code>
            - 从右到左（默认）
          </li>
          <li>
            <code>ltr</code>
            - 从左到右
          </li>
          <li>
            <code>ttb</code>
            - 从上到下
          </li>
          <li>
            <code>btt</code>
            - 从下到上
          </li>
        </ul>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>侧边栏导航（rtl/ltr）</li>
            <li>筛选面板（rtl/ltr）</li>
            <li>通知面板（ttb）</li>
            <li>底部操作面板（btt）</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="directionDrawerVisible = false">关闭</el-button>
      </template>
    </Drawer>

    <!-- 自定义尺寸抽屉 -->
    <Drawer v-model="sizeDrawerVisible" title="自定义尺寸" size="50%">
      <div>
        <p>📏 当前抽屉宽度：50%</p>
        <p>
          可以通过
          <code>size</code>
          属性自定义抽屉尺寸：
        </p>
        <ul>
          <li>
            百分比：
            <code>30%</code>
            、
            <code>50%</code>
            、
            <code>80%</code>
          </li>
          <li>
            像素值：
            <code>400px</code>
            、
            <code>600px</code>
          </li>
        </ul>
        <div style="margin-top: 20px">
          <h4>内容区域滚动测试：</h4>
          <div style="padding: 20px; background: var(--el-fill-color-light)">
            <p v-for="i in 30" :key="i">这是第 {{ i }} 行内容，用于测试滚动效果</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="sizeDrawerVisible = false">关闭</el-button>
      </template>
    </Drawer>

    <!-- 关闭前确认抽屉 -->
    <Drawer v-model="beforeCloseDrawerVisible" title="关闭前确认" :before-close="handleBeforeClose">
      <div>
        <p>尝试关闭这个抽屉，会弹出确认提示。</p>
        <p>这对于防止用户误操作非常有用。</p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>表单有未保存的修改</li>
            <li>重要操作需要二次确认</li>
            <li>防止误关闭导致数据丢失</li>
            <li>编辑器内容未保存</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-color-warning-light-9)">
          <h4>💡 提示：</h4>
          <p>可以通过点击关闭按钮、按 ESC 键或点击遮罩层来触发关闭前确认。</p>
        </div>
      </div>
    </Drawer>

    <!-- 标签页抽屉 -->
    <Drawer v-model="tabsDrawerVisible" title="标签页抽屉" size="50%" :scrollable="false">
      <el-tabs
        v-model="activeTab"
        style="height: 100%; display: flex; flex-direction: column"
        type="card"
      >
        <el-tab-pane label="基本信息" name="first">
          <div style="padding: 10px">
            <h4>基本信息</h4>
            <p>
              通过设置
              <code>:scrollable="false"</code>
              ，标签页可以自动撑开占满高度。
            </p>
            <el-form label-width="100px" style="margin-top: 20px">
              <el-form-item label="用户名">
                <el-input placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input placeholder="请输入手机号" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="second">
          <div style="padding: 10px">
            <h4>详细信息</h4>
            <p>这是详细信息的内容区域。</p>
            <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
              <p v-for="i in 15" :key="i">详细信息数据 {{ i }}</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="third">
          <div style="padding: 10px">
            <h4>操作日志</h4>
            <p>这是操作日志的内容区域。</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="tabsDrawerVisible = false">取消</el-button>
        <el-button type="primary">保存</el-button>
      </template>
    </Drawer>

    <!-- 自定义操作按钮抽屉 -->
    <Drawer v-model="customActionsDrawerVisible" title="设置中心" size="40%">
      <template #header-actions>
        <div class="drawer-action-btn" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
        </div>
        <div class="drawer-action-btn" @click="handleHelp">
          <el-icon><QuestionFilled /></el-icon>
        </div>
        <div class="drawer-action-btn" @click="handleSettings">
          <el-icon><Setting /></el-icon>
        </div>
      </template>
      <div>
        <p>📌 标题栏添加了自定义操作按钮：刷新、帮助、设置</p>
        <p>
          通过
          <code>#header-actions</code>
          插槽可以在标题栏添加自定义操作按钮。
        </p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>刷新按钮 - 重新加载数据</li>
            <li>帮助按钮 - 打开帮助文档</li>
            <li>设置按钮 - 快速访问设置</li>
            <li>搜索按钮 - 快速搜索功能</li>
            <li>筛选按钮 - 数据筛选</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-color-info-light-9)">
          <h4>💡 提示：</h4>
          <p>自定义按钮会自动继承统一的样式和 hover 效果，保持视觉一致性。</p>
          <p>按钮会显示在关闭按钮之前，从左到右排列。</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="customActionsDrawerVisible = false">关闭</el-button>
      </template>
    </Drawer>

    <!-- 二次封装说明 -->
    <el-card class="demo-card feature-card">
      <template #header>
        <div class="card-header">
          <span>🎯 二次封装的优势</span>
        </div>
      </template>
      <div class="feature-content">
        <h3>为什么要二次封装 ElDrawer？</h3>
        <p>
          抽屉组件在现代 Web 应用中使用频繁，但原生 ElDrawer
          在实际使用中存在一些可以改进的地方。通过二次封装，我们提供了更好的开发体验：
        </p>

        <div class="feature-section">
          <h4>🎨 1. 统一的视觉规范</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生 ElDrawer 的标题栏样式不够统一，需要每次手动调整
            </li>
            <li>
              <strong>解决：</strong>
              标准化的 54px 标题栏、统一的边框和内边距，与 Dialog 保持一致的设计语言
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🔧 2. 优化的关闭按钮</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生关闭按钮位置和样式不够友好
            </li>
            <li>
              <strong>解决：</strong>
              重新设计的 32x32px 关闭按钮，带 hover 效果和过渡动画，点击区域更大更易用
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>📜 3. 智能滚动处理</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              内容区域滚动需要手动处理，高度计算繁琐
            </li>
            <li>
              <strong>解决：</strong>
              内置 ElScrollbar，自动处理内容滚动，内容区域自动填充剩余空间
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🎯 4. 灵活的布局模式</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              嵌套 Tabs、表单、表格等组件时，滚动条会破坏布局
            </li>
            <li>
              <strong>解决：</strong>
              提供 scrollable 属性，可切换为 flex 布局，完美适配各种内容类型
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🔌 5. 可扩展的标题栏</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              标题栏无法方便地添加额外的操作按钮
            </li>
            <li>
              <strong>解决：</strong>
              提供 header-actions 插槽，轻松添加刷新、帮助、设置等常用按钮
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>📐 6. 多方向支持</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              不同方向的抽屉样式需要单独调整
            </li>
            <li>
              <strong>解决：</strong>
              支持 rtl、ltr、ttb、btt 四个方向，样式自动适配，无需额外配置
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>⚙️ 7. 开箱即用的配置</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              每次使用都要配置 destroy-on-close、close-on-click-modal 等常用属性
            </li>
            <li>
              <strong>解决：</strong>
              预设最佳实践的默认值，减少 80% 的重复配置代码
            </li>
          </ul>
        </div>

        <div class="summary">
          <h4>💡 总结</h4>
          <p>
            二次封装的 Drawer 组件在保留 ElDrawer 所有功能的同时，针对实际项目中的痛点进行了优化。
            <strong>完全兼容 ElDrawer 的所有原生属性和事件</strong>
            ，让你在享受更好体验的同时，不失去任何灵活性。特别适合需要频繁使用抽屉组件的中后台系统。
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
code {
  padding: 2px 6px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--el-color-primary);
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin: 5px 0;
  line-height: 1.6;
}

h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

p {
  margin: 10px 0;
  line-height: 1.6;
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
  border-left: 4px solid var(--el-color-success);
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
  color: var(--el-color-success);
  font-weight: 600;
}

.summary {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    var(--el-color-success-light-9) 0%,
    var(--el-color-primary-light-9) 100%
  );
  border-radius: 8px;
  border: 1px solid var(--el-color-success-light-7);
}

.summary h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.summary p {
  color: var(--el-text-color-regular);
  margin: 0;
}

.summary strong {
  color: var(--el-color-success);
  font-weight: 600;
}
</style>
