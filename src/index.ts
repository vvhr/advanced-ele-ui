import type { App } from 'vue'
import 'virtual:uno.css'

// 导入组件
import { ZwForm } from './components/Form'
import { Icon } from './components/Icon'
import { ZwTable } from './components/Table'

// 导出类型
export * from './types'

// 导出组件
export { ZwForm, Icon as ZwIcon, ZwTable }

// 安装函数
const install = (app: App) => {
  app.component('ZwForm', ZwForm)
  app.component('ZwIcon', Icon)
  app.component('ZwTable', ZwTable)
}

// 默认导出
export default {
  install,
  version: '0.0.1'
}
