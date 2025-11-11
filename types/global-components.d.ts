// GlobalComponents for Volar

declare module 'vue' {
  export interface GlobalComponents {
    AeForm: import('advanced-ele-ui').AeForm
    AeIcon: import('advanced-ele-ui').AeIcon
    AeTable: import('advanced-ele-ui').AeTable
    AeEditor: import('advanced-ele-ui').AeEditor
    AeUpload: import('advanced-ele-ui').AeUpload
  }
}

export {}
