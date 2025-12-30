import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  title: 'Advanced Ele UI',
  description: '基于 Vue3 + Element Plus 的高级组件库',
  lang: 'zh-CN',
  
  themeConfig: {
    siteTitle: 'Advanced Ele UI',
    logo: '/logo.png', // 暂时占位
    
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/form/ae-form' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '基础',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/quickstart' }
          ]
        }
      ],
      '/components/': [
        {
          text: '核心组件',
          items: [
            { text: 'AeForm 表单', link: '/components/form/ae-form' },
            { text: 'AeTable 表格', link: '/components/table/ae-table' }
          ]
        },
        {
            text: '通用组件',
            items: [
                { text: 'AeDialog 对话框', link: '/components/dialog/ae-dialog' },
                { text: 'AeDrawer 抽屉', link: '/components/drawer/ae-drawer' },
                { text: 'AeTabs 标签页', link: '/components/tabs/ae-tabs' },
                { text: 'AeUpload 上传', link: '/components/upload/ae-upload' },
                { text: 'AeEditor 编辑器', link: '/components/editor/ae-editor' },
                { text: 'AeIcon 图标', link: '/components/icon/ae-icon' }
            ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '全局类型', link: '/api/types' },
            { text: '工具函数', link: '/api/utils' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vvhr/advanced-ele-ui' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present vvhr'
    }
  },

  markdown: {
    config: (md) => {
      md.use(demoblockPlugin)
    }
  },

  vite: {
    plugins: [
        vueJsx(),
        demoblockVitePlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src'),
        // 确保 vue 只有一个实例
        'vue': path.resolve(__dirname, '../../node_modules/vue')
      }
    },
    // 处理 less
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  }
})
