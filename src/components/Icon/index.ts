import Icon from './src/Icon.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeIcon: SFCWithInstall<typeof Icon> = withInstall(Icon)
export default AeIcon

export type { IconProps } from './src/types'

// 兼容旧的导出方式
export { AeIcon as Icon }

// 导出图标注册工具
export { addIcon, addIconCollection, addIconCollections } from '@/utils/icon'
export type { IconData, IconCollection } from '@/utils/icon'
