import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/index.css'
import 'virtual:uno.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
