import ComboInput from './src/ComboInput'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'

export const AeComboInput: SFCWithInstall<typeof ComboInput> = withInstall(ComboInput)
export default AeComboInput

export type { ComboInputProps, ComboInputEmits, ComboTemplate } from './src/types'

// 兼容旧的导出方式
export { AeComboInput as ComboInput }