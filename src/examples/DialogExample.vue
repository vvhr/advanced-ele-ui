<script setup lang="ts">
import { ref } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import Dialog from '../components/Dialog'

// 基础对话框
const basicDialogVisible = ref(false)

// 可拖拽对话框
const draggableDialogVisible = ref(false)

// 最大化对话框
const maximizeDialogVisible = ref(false)

// 全屏对话框
const fullscreenDialogVisible = ref(false)

// 表单对话框
const formDialogVisible = ref(false)
const formLoading = ref(false)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  gender: ''
})

// 自定义底部对话框
const customFooterDialogVisible = ref(false)

// 无底部对话框
const noFooterDialogVisible = ref(false)

// 销毁测试对话框
const destroyDialogVisible = ref(false)
const destroyCounter = ref(0)

// 不销毁对话框
const noDestroyDialogVisible = ref(false)
const noDestroyCounter = ref(0)

// 确认前关闭对话框
const beforeCloseDialogVisible = ref(false)

// 处理基础对话框确认
const handleBasicConfirm = () => {
  ElMessage.success('确认操作')
  basicDialogVisible.value = false
}

// 处理表单提交
const handleFormSubmit = async () => {
  formLoading.value = true
  // 模拟异步请求
  await new Promise((resolve) => setTimeout(resolve, 1500))
  formLoading.value = false
  ElMessage.success('提交成功')
  formDialogVisible.value = false
}

// 处理表单取消
const handleFormCancel = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    gender: ''
  }
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

// 增加计数器
const incrementCounter = () => {
  destroyCounter.value++
}

const incrementNoDestroyCounter = () => {
  noDestroyCounter.value++
}
</script>

<template>
  <div class="dialog-example">
    <h1>Dialog 对话框示例</h1>

    <div class="example-section">
      <h2>基础用法</h2>
      <p>最基本的对话框用法，包含标题、内容和底部按钮。</p>
      <el-button type="primary" @click="basicDialogVisible = true">打开基础对话框</el-button>

      <Dialog
        v-model="basicDialogVisible"
        title="基础对话框"
        width="500px"
        @confirm="handleBasicConfirm"
      >
        <p>这是一个基础的对话框示例。</p>
        <p>对话框默认支持以下特性：</p>
        <ul>
          <li>标题栏和底部区域带有边框</li>
          <li>关闭时自动销毁内容</li>
          <li>点击遮罩层不关闭（可配置）</li>
          <li>按 ESC 键关闭（可配置）</li>
        </ul>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>可拖拽对话框</h2>
      <p>通过鼠标拖拽标题栏可以移动对话框位置。</p>
      <el-button type="primary" @click="draggableDialogVisible = true">
        打开可拖拽对话框
      </el-button>

      <Dialog
        v-model="draggableDialogVisible"
        title="可拖拽对话框"
        width="600px"
        :draggable="true"
      >
        <div style="padding: 20px 0">
          <p>🖱️ 试试拖动标题栏移动对话框！</p>
          <p>拖拽功能默认开启，可以通过 <code>draggable</code> 属性控制。</p>
          <p>在最大化或全屏状态下，拖拽功能会自动禁用。</p>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>最大化功能</h2>
      <p>点击标题栏的最大化按钮可以将对话框最大化。</p>
      <el-button type="primary" @click="maximizeDialogVisible = true">
        打开带最大化的对话框
      </el-button>

      <Dialog
        v-model="maximizeDialogVisible"
        title="最大化对话框"
        width="500px"
        :show-maximize="true"
      >
        <div style="padding: 20px 0">
          <p>📐 点击标题栏右侧的最大化按钮试试！</p>
          <p>最大化后对话框会占据几乎整个屏幕（留有边距）。</p>
          <p>再次点击可以还原到原始大小。</p>
          <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
            <h3>内容区域</h3>
            <p>最大化后可以显示更多内容...</p>
            <p v-for="i in 10" :key="i">这是第 {{ i }} 行内容</p>
          </div>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>全屏对话框</h2>
      <p>支持全屏显示对话框。</p>
      <el-button type="primary" @click="fullscreenDialogVisible = true">
        打开全屏对话框
      </el-button>

      <Dialog
        v-model="fullscreenDialogVisible"
        title="全屏对话框"
        :show-fullscreen="true"
        :show-maximize="true"
      >
        <div style="padding: 20px 0">
          <p>🖥️ 点击全屏按钮可以切换全屏模式！</p>
          <p>全屏模式下对话框会占据整个屏幕。</p>
          <div style="margin-top: 20px; padding: 20px; background: var(--el-fill-color-light)">
            <h3>全屏内容展示</h3>
            <p v-for="i in 20" :key="i">这是第 {{ i }} 行内容，全屏模式下可以显示更多内容</p>
          </div>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>表单对话框</h2>
      <p>在对话框中使用表单，关闭时自动重置表单数据。</p>
      <el-button type="primary" @click="formDialogVisible = true">打开表单对话框</el-button>

      <Dialog
        v-model="formDialogVisible"
        title="用户信息"
        width="500px"
        :confirm-loading="formLoading"
        @confirm="handleFormSubmit"
        @cancel="handleFormCancel"
      >
        <ElForm :model="formData" label-width="80px">
          <ElFormItem label="姓名">
            <ElInput v-model="formData.name" placeholder="请输入姓名" />
          </ElFormItem>
          <ElFormItem label="邮箱">
            <ElInput v-model="formData.email" placeholder="请输入邮箱" />
          </ElFormItem>
          <ElFormItem label="手机号">
            <ElInput v-model="formData.phone" placeholder="请输入手机号" />
          </ElFormItem>
          <ElFormItem label="性别">
            <ElRadioGroup v-model="formData.gender">
              <ElRadio value="male">男</ElRadio>
              <ElRadio value="female">女</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElForm>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>自定义底部</h2>
      <p>通过插槽自定义底部按钮。</p>
      <el-button type="primary" @click="customFooterDialogVisible = true">
        打开自定义底部对话框
      </el-button>

      <Dialog v-model="customFooterDialogVisible" title="自定义底部" width="500px">
        <p>这个对话框使用了自定义的底部按钮。</p>
        <template #footer>
          <el-button @click="customFooterDialogVisible = false">关闭</el-button>
          <el-button type="warning" @click="ElMessage.warning('警告操作')">警告</el-button>
          <el-button type="danger" @click="ElMessage.error('危险操作')">危险</el-button>
          <el-button type="success" @click="ElMessage.success('成功操作')">成功</el-button>
        </template>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>无底部按钮</h2>
      <p>隐藏底部按钮区域。</p>
      <el-button type="primary" @click="noFooterDialogVisible = true">
        打开无底部对话框
      </el-button>

      <Dialog
        v-model="noFooterDialogVisible"
        title="无底部按钮"
        width="500px"
        :footer="false"
        :show-footer-border="false"
      >
        <div style="padding: 20px 0">
          <p>这个对话框没有底部按钮区域。</p>
          <p>可以通过右上角的关闭按钮或按 ESC 键关闭。</p>
          <div style="margin-top: 20px; text-align: center">
            <el-button type="primary" @click="noFooterDialogVisible = false">
              我知道了
            </el-button>
          </div>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>销毁测试</h2>
      <p>默认情况下，关闭对话框会销毁内部组件，每次打开都是全新的状态。</p>
      <el-button type="primary" @click="destroyDialogVisible = true">
        打开销毁测试对话框
      </el-button>

      <Dialog
        v-model="destroyDialogVisible"
        title="销毁测试（destroyOnClose=true）"
        width="500px"
        :destroy-on-close="true"
      >
        <div style="padding: 20px 0">
          <p>当前计数：{{ destroyCounter }}</p>
          <p>每次打开对话框，计数器都会重置为 0（因为组件被销毁了）。</p>
          <el-button type="primary" @click="incrementCounter">增加计数</el-button>
          <p style="margin-top: 20px; color: var(--el-color-success)">
            ✅ 这对于表单场景非常有用，无需手动重置表单数据！
          </p>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>不销毁测试</h2>
      <p>设置 destroyOnClose 为 false，关闭对话框不会销毁内部组件。</p>
      <el-button type="primary" @click="noDestroyDialogVisible = true">
        打开不销毁对话框
      </el-button>

      <Dialog
        v-model="noDestroyDialogVisible"
        title="不销毁测试（destroyOnClose=false）"
        width="500px"
        :destroy-on-close="false"
      >
        <div style="padding: 20px 0">
          <p>当前计数：{{ noDestroyCounter }}</p>
          <p>关闭后再打开，计数器的值会保留（因为组件没有被销毁）。</p>
          <el-button type="primary" @click="incrementNoDestroyCounter">增加计数</el-button>
          <p style="margin-top: 20px; color: var(--el-color-info)">
            ℹ️ 适用于需要保持状态的场景
          </p>
        </div>
      </Dialog>
    </div>

    <div class="example-section">
      <h2>关闭前确认</h2>
      <p>通过 beforeClose 回调在关闭前进行确认。</p>
      <el-button type="primary" @click="beforeCloseDialogVisible = true">
        打开关闭前确认对话框
      </el-button>

      <Dialog
        v-model="beforeCloseDialogVisible"
        title="关闭前确认"
        width="500px"
        :before-close="handleBeforeClose"
      >
        <div style="padding: 20px 0">
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
    </div>

    <div class="example-section">
      <h2>API 说明</h2>
      <div class="api-table">
        <h3>Props</h3>
        <table>
          <thead>
            <tr>
              <th>属性名</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>model-value / v-model</td>
              <td>是否显示对话框</td>
              <td>boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>draggable</td>
              <td>是否可拖拽</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>show-maximize</td>
              <td>是否显示最大化按钮</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>show-fullscreen</td>
              <td>是否显示全屏按钮</td>
              <td>boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>destroy-on-close</td>
              <td>关闭时是否销毁内容</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>show-header-border</td>
              <td>是否显示标题栏底部边框</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>show-footer-border</td>
              <td>是否显示底部区域顶部边框</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>confirm-text</td>
              <td>确认按钮文本</td>
              <td>string</td>
              <td>'确定'</td>
            </tr>
            <tr>
              <td>cancel-text</td>
              <td>取消按钮文本</td>
              <td>string</td>
              <td>'取消'</td>
            </tr>
            <tr>
              <td>confirm-loading</td>
              <td>确认按钮加载状态</td>
              <td>boolean</td>
              <td>false</td>
            </tr>
          </tbody>
        </table>

        <h3 style="margin-top: 30px">Events</h3>
        <table>
          <thead>
            <tr>
              <th>事件名</th>
              <th>说明</th>
              <th>回调参数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>confirm</td>
              <td>点击确认按钮时触发</td>
              <td>-</td>
            </tr>
            <tr>
              <td>cancel</td>
              <td>点击取消按钮时触发</td>
              <td>-</td>
            </tr>
            <tr>
              <td>open</td>
              <td>对话框打开时触发</td>
              <td>-</td>
            </tr>
            <tr>
              <td>opened</td>
              <td>对话框打开动画结束时触发</td>
              <td>-</td>
            </tr>
            <tr>
              <td>close</td>
              <td>对话框关闭时触发</td>
              <td>-</td>
            </tr>
            <tr>
              <td>closed</td>
              <td>对话框关闭动画结束时触发</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>

        <h3 style="margin-top: 30px">Slots</h3>
        <table>
          <thead>
            <tr>
              <th>插槽名</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>default</td>
              <td>对话框内容</td>
            </tr>
            <tr>
              <td>title</td>
              <td>对话框标题</td>
            </tr>
            <tr>
              <td>footer</td>
              <td>对话框底部</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.dialog-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 32px;
    margin-bottom: 30px;
    color: var(--el-text-color-primary);
  }

  .example-section {
    margin-bottom: 40px;
    padding: 20px;
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);

    h2 {
      font-size: 24px;
      margin-bottom: 10px;
      color: var(--el-text-color-primary);
    }

    p {
      margin-bottom: 15px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }

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
      color: var(--el-text-color-regular);

      li {
        margin: 5px 0;
        line-height: 1.6;
      }
    }
  }

  .api-table {
    margin-top: 20px;

    h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: var(--el-text-color-primary);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--el-bg-color);

      th,
      td {
        padding: 12px;
        text-align: left;
        border: 1px solid var(--el-border-color-lighter);
      }

      th {
        background: var(--el-fill-color-light);
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      td {
        color: var(--el-text-color-regular);
      }

      code {
        padding: 2px 6px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
