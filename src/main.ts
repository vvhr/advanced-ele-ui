import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:uno.css'
import App from './App.vue'

const app = createApp(App)

// 过滤 Element Plus 组件的已知 slot 警告（组件内部实现问题）
app.config.warnHandler = (msg, instance, _trace) => {
  if (
    msg.includes('Slot "default" invoked outside of the render function') &&
    (instance?.$options?.name?.startsWith('El') || (instance as any)?.type?.name?.startsWith('El'))
  ) {
    return
  }
  console.warn(msg)
}

app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
