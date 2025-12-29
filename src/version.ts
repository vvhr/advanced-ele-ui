/**
 * 版本信息
 * @description 用于标识当前构建版本，方便内部测试时验证
 */
export const VERSION_INFO = {
  // npm 版本
  version: '0.1.8',
  // 构建版本（内部测试用）
  buildVersion: 'dev-20251229-1000',
  // 构建时间
  buildTime: new Date().toISOString(),
  // 环境标识
  env: import.meta.env.MODE || 'production'
} as const

/**
 * 获取完整版本信息
 */
export function getVersionInfo() {
  return VERSION_INFO
}

/**
 * 打印版本信息到控制台
 */
export function printVersionInfo() {
  console.log('[Advanced-Ele-UI] Version Info:', VERSION_INFO)
}
