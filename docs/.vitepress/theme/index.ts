import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'
import './custom.css'

// 引入组件库样式 (假设构建或开发时的路径，这里直接引入源码样式以便热更)
import '../../../src/styles/element-plus-beauty.less'

// 引入所有组件进行注册 (为了方便编写 demo)
// 注意：在实际生产中可能需要引用打包后的产物，但在文档开发模式下引用源码更方便调试
import * as AdvancedEleUI from '../../../src/index'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    // 注册组件库
    // 这里我们模拟 install 过程，因为 src/index.ts 导出了 install 方法
    // 如果 install 是默认导出，使用 AdvancedEleUI.default
    if (AdvancedEleUI.default && typeof AdvancedEleUI.default.install === 'function') {
        app.use(AdvancedEleUI.default)
    } else {
        // 如果是按需导出，或者结构不同，尝试全量注册
        // 这里根据 index.ts 的常见结构，假设导出了 components
        Object.keys(AdvancedEleUI).forEach(key => {
            if (key !== 'default' && key !== 'install') {
                 // 简单的全量注册尝试，具体依赖 index.ts 结构
                 // app.component(key, AdvancedEleUI[key])
            }
        })
    }

    // 注册 DemoBlock 组件
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
  }
}
