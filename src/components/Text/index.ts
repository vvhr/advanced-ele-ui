import Text from './src/Text'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeText: SFCWithInstall<typeof Text> = withInstall(Text)
export default AeText

export type { TextProps, TextEmits, DotType } from './src/types'

// 兼容旧的导出方式
export { AeText as Text }
