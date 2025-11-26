/* prettier-ignore */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    AeForm: typeof import('advanced-ele-ui')['AeForm']
    AeIcon: typeof import('advanced-ele-ui')['AeIcon']
    AeTable: typeof import('advanced-ele-ui')['AeTable']
    AeEditor: typeof import('advanced-ele-ui')['AeEditor']
    AeUpload: typeof import('advanced-ele-ui')['AeUpload']
    AeDialog: typeof import('advanced-ele-ui')['AeDialog']
    AeDrawer: typeof import('advanced-ele-ui')['AeDrawer']
    AeTabs: typeof import('advanced-ele-ui')['AeTabs']
    AeTabPane: typeof import('advanced-ele-ui')['AeTabPane']
  }
}

export {}
