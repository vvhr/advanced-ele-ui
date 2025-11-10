// GlobalComponents for Volar
import type { ZwForm } from '../components/Form'
import type { Icon } from '../components/Icon'
import type { ZwTable } from '../components/Table'
import type { Editor } from '../components/Editor'
import type { Upload } from '../components/Upload'

declare module 'vue' {
  export interface GlobalComponents {
    ZwForm: typeof ZwForm
    ZwIcon: typeof Icon
    ZwTable: typeof ZwTable
    ZwEditor: typeof Editor
    ZwUpload: typeof Upload
  }
}

export {}
