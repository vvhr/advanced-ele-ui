<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download, Printer } from '@element-plus/icons-vue'
import { Dialog } from '../components/Dialog'

const basicDialogVisible = ref(false)
const draggableDialogVisible = ref(false)
const fullscreenDialogVisible = ref(false)
const beforeCloseDialogVisible = ref(false)
const tabsDialogVisible = ref(false)
const customActionsDialogVisible = ref(false)
const activeTab = ref('first')
// 处理基础对话框确认
const handleBasicConfirm = () => {
  ElMessage.success('确认操作')
  basicDialogVisible.value = false
}

// 关闭前确认
const handleBeforeClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭对话框吗？', '提示', {
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

const handleDownload = () => {
  ElMessage.success('下载数据')
}

const handlePrint = () => {
  ElMessage.success('打印数据')
}
</script>

<template>
  <div class="demo-section">
    <div class="section-header">
      <h2>高级对话框</h2>
    </div>
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>使用示例</span>
        </div>
      </template>
      <el-button type="primary" @click="basicDialogVisible = true">基础对话框</el-button>
      <el-button type="primary" @click="draggableDialogVisible = true">可拖拽对话框</el-button>
      <el-button type="primary" @click="fullscreenDialogVisible = true">全屏切换对话框</el-button>
      <el-button type="primary" @click="beforeCloseDialogVisible = true">
        关闭前确认对话框
      </el-button>
      <el-button type="success" @click="tabsDialogVisible = true">标签页对话框</el-button>
      <el-button type="warning" @click="customActionsDialogVisible = true">
        自定义操作按钮
      </el-button>
    </el-card>

    <Dialog
      v-model="basicDialogVisible"
      title="基础对话框"
      width="500px"
      @close="handleBasicConfirm"
    >
      <p>这是一个基础的对话框示例。</p>
      <p>对话框默认支持以下特性：</p>
      <ul>
        <li>标题栏和底部区域带有边框</li>
        <li>关闭时自动销毁内容</li>
        <li>点击遮罩层不关闭（可配置）</li>
        <li>按 ESC 键关闭（可配置）</li>
      </ul>
      <template #footer>
        <el-button @click="basicDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>
    <Dialog v-model="draggableDialogVisible" title="可拖拽对话框" width="600px" :draggable="true">
      <div>
        <p>🖱️ 试试拖动标题栏移动对话框！</p>
        <p>
          拖拽功能默认开启，可以通过
          <code>draggable</code>
          属性控制。
        </p>
        <p>在最大化或全屏状态下，拖拽功能会自动禁用。</p>
      </div>
      <template #footer>
        <el-button @click="draggableDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>
    <Dialog v-model="fullscreenDialogVisible" title="全屏对话框" :fullscreen="true">
      <div>
        <p>全屏模式下对话框会占据整个屏幕。</p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h3>全屏内容展示</h3>
          <p v-for="i in 20" :key="i">这是第 {{ i }} 行内容，全屏模式下可以显示更多内容</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="fullscreenDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>
    <Dialog
      v-model="beforeCloseDialogVisible"
      title="关闭前确认"
      width="500px"
      :before-close="handleBeforeClose"
    >
      <div>
        <p>尝试关闭这个对话框，会弹出确认提示。</p>
        <p>这对于防止用户误操作非常有用。</p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>表单有未保存的修改</li>
            <li>重要操作需要二次确认</li>
            <li>防止误关闭导致数据丢失</li>
          </ul>
        </div>
      </div>
    </Dialog>

    <!-- 标签页对话框 -->
    <Dialog v-model="tabsDialogVisible" title="标签页对话框" width="700px" :scrollable="false">
      <el-tabs
        v-model="activeTab"
        style="height: 100%; display: flex; flex-direction: column"
        type="card"
      >
        <el-tab-pane label="用户管理" name="first">
          <div style="padding: 10px">
            <h4>用户管理</h4>
            <p>这是用户管理的内容区域。</p>
            <p>
              通过设置
              <code>:scrollable="false"</code>
              ，标签页可以自动撑开占满高度。
            </p>
            <div style="padding: 10px; background: var(--el-fill-color-light)">
              <p v-for="i in 10" :key="i">用户数据 {{ i }}</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <div style="padding: 10px">
            <h4>配置管理</h4>
            <p>这是配置管理的内容区域。</p>
            <el-form label-width="100px">
              <el-form-item label="系统名称">
                <el-input placeholder="请输入系统名称" />
              </el-form-item>
              <el-form-item label="系统版本">
                <el-input placeholder="请输入系统版本" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="权限管理" name="third">
          <div style="padding: 10px">
            <h4>权限管理</h4>
            <p>这是权限管理的内容区域。</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="tabsDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>

    <!-- 自定义操作按钮对话框 -->
    <Dialog v-model="customActionsDialogVisible" title="数据详情" width="600px" :fullscreen="true">
      <template #header-actions>
        <div class="dialog-action-btn" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
        </div>
        <div class="dialog-action-btn" @click="handleDownload">
          <el-icon><Download /></el-icon>
        </div>
        <div class="dialog-action-btn" @click="handlePrint">
          <el-icon><Printer /></el-icon>
        </div>
      </template>
      <div>
        <p>📌 标题栏添加了自定义操作按钮：刷新、下载、打印</p>
        <p>
          通过
          <code>#header-actions</code>
          插槽可以在标题栏添加自定义操作按钮。
        </p>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
          <h4>使用场景：</h4>
          <ul>
            <li>数据刷新按钮</li>
            <li>导出/下载按钮</li>
            <li>打印按钮</li>
            <li>帮助/设置按钮</li>
            <li>其他快捷操作</li>
          </ul>
        </div>
        <div style="margin-top: 20px; padding: 20px; background: var(--el-color-info-light-9)">
          <h4>💡 提示：</h4>
          <p>自定义按钮会自动继承统一的样式和 hover 效果。</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="customActionsDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>

    <!-- 二次封装说明 -->
    <el-card class="demo-card feature-card">
      <template #header>
        <div class="card-header">
          <span>🎯 二次封装的优势</span>
        </div>
      </template>
      <div class="feature-content">
        <h3>为什么要二次封装 ElDialog？</h3>
        <p>
          虽然 Element Plus 的 ElDialog
          已经很强大，但在实际项目中，我们发现了一些可以优化的地方。通过二次封装，我们解决了以下问题：
        </p>

        <div class="feature-section">
          <h4>🎨 1. 统一的视觉风格</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生 ElDialog 的标题栏和底部样式需要每次手动调整
            </li>
            <li>
              <strong>解决：</strong>
              统一的 54px 标题栏高度、边框样式、内边距，开箱即用
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🔧 2. 优化的操作按钮</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生关闭按钮样式单一，缺少全屏切换等常用功能
            </li>
            <li>
              <strong>解决：</strong>
              重新设计的操作按钮（32x32px），带 hover 效果，支持全屏切换和自定义按钮
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>📜 3. 内置滚动条支持</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              内容过多时需要手动添加滚动容器，高度计算复杂
            </li>
            <li>
              <strong>解决：</strong>
              内置 ElScrollbar，自动处理滚动，支持 maxHeight 配置
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🖱️ 4. 可选的拖拽功能</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              原生 draggable 属性缺少视觉提示
            </li>
            <li>
              <strong>解决：</strong>
              添加拖拽图标指示器，用户一眼就能看出对话框可拖拽
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🎯 5. 灵活的布局模式</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              嵌套 Tabs、Tree 等组件时，滚动条会导致布局问题
            </li>
            <li>
              <strong>解决：</strong>
              提供 scrollable 属性，可切换为 flex 布局，完美支持各种嵌套场景
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>🔌 6. 扩展性更强</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              标题栏无法方便地添加自定义操作按钮
            </li>
            <li>
              <strong>解决：</strong>
              提供 header-actions 插槽，轻松添加刷新、下载、打印等按钮
            </li>
          </ul>
        </div>

        <div class="feature-section">
          <h4>⚙️ 7. 更好的默认配置</h4>
          <ul>
            <li>
              <strong>问题：</strong>
              每次使用都要配置 destroy-on-close、close-on-click-modal 等属性
            </li>
            <li>
              <strong>解决：</strong>
              预设最佳实践的默认值，减少重复配置
            </li>
          </ul>
        </div>

        <div class="summary">
          <h4>💡 总结</h4>
          <p>
            二次封装不是重复造轮子，而是在保留 Element Plus
            强大功能的基础上，针对实际项目需求进行优化。
            <strong>所有 ElDialog 的原生属性和事件都完全支持</strong>
            ，同时提供了更好的开发体验和用户体验。
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
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
  border-left: 4px solid var(--el-color-primary);
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
  color: var(--el-color-primary);
  font-weight: 600;
}

.summary {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-9) 0%,
    var(--el-color-success-light-9) 100%
  );
  border-radius: 8px;
  border: 1px solid var(--el-color-primary-light-7);
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
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
