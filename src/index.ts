import type { App } from 'vue'
import 'virtual:uno.css'

// 导入组件
import { ZwForm } from './components/Form'
import { Icon } from './components/Icon'
import { ZwTable } from './components/Table'
import { Editor } from './components/Editor'
import { Upload } from './components/Upload'
// 导出类型
export * from './types'

// 导出组件
export { ZwForm, Icon as ZwIcon, ZwTable, Editor as ZwEditor, Upload as ZwUpload }

// 安装函数
const install = (app: App) => {
  app.component('ZwForm', ZwForm)
  app.component('ZwTable', ZwTable)
  app.component('ZwIcon', Icon)
  app.component('ZwEditor', Editor)
  app.component('ZwUpload', Upload)
}

// 默认导出
export default {
  install,
  version: '0.0.1'
}
