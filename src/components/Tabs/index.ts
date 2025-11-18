import Tabs from './src/Tabs.vue'
import TabPane from './src/TabPane.vue'
import type { TabsProps as ElTabsProps, TabPaneProps as ElTabPaneProps } from 'element-plus'

/**
 * Tabs 组件的 Props 类型定义
 * 继承 ElTabs 的所有原生属性，并扩展自定义属性
 */
export type TabsProps = InstanceType<typeof Tabs>['$props'] & Partial<ElTabsProps>

/**
 * TabPane 组件的 Props 类型定义
 * 继承 ElTabPane 的所有原生属性，并扩展自定义属性
 */
export type TabPaneProps = InstanceType<typeof TabPane>['$props'] & Partial<ElTabPaneProps>

/**
 * Tabs 组件实例类型
 */
export type TabsInstance = InstanceType<typeof Tabs>

/**
 * TabPane 组件实例类型
 */
export type TabPaneInstance = InstanceType<typeof TabPane>

/**
 * Tabs 组件的 Emits 类型定义
 */
export type TabsEmits = {
  'update:modelValue': (value: string | number) => void
  'tab-click': (pane: any, ev: Event) => void
  'tab-change': (name: string | number) => void
  'tab-remove': (name: string | number) => void
  'tab-add': () => void
  edit: (targetName: string | number | undefined, action: 'add' | 'remove') => void
}

export { Tabs, TabPane }
export default Tabs
