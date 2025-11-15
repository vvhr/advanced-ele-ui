/**
 * 国际化日志工具
 * @description 提供国际化的 console 输出
 */
import { t } from './index'
import { replacePlaceholder } from './utils'

/**
 * 日志工具类
 */
export class Logger {
  /**
   * 输出警告信息
   * @param path 翻译路径
   * @param params 参数对象
   * @param data 额外数据
   */
  static warn(path: string, params?: Record<string, any>, ...data: any[]) {
    const message = params ? replacePlaceholder(t(path), params) : t(path)
    console.warn(message, ...data)
  }

  /**
   * 输出错误信息
   * @param path 翻译路径
   * @param params 参数对象
   * @param data 额外数据
   */
  static error(path: string, params?: Record<string, any>, ...data: any[]) {
    const message = params ? replacePlaceholder(t(path), params) : t(path)
    console.error(message, ...data)
  }

  /**
   * 输出日志信息
   * @param path 翻译路径
   * @param params 参数对象
   * @param data 额外数据
   */
  static log(path: string, params?: Record<string, any>, ...data: any[]) {
    const message = params ? replacePlaceholder(t(path), params) : t(path)
    console.log(message, ...data)
  }

  /**
   * 输出成功信息（带样式）
   * @param path 翻译路径
   * @param params 参数对象
   */
  static success(path: string, params?: Record<string, any>) {
    const message = params ? replacePlaceholder(t(path), params) : t(path)
    console.log(`%c✓ ${message}`, 'color: #4CAF50;')
  }
}

/**
 * 快捷方法
 */
export const logger = {
  warn: Logger.warn.bind(Logger),
  error: Logger.error.bind(Logger),
  log: Logger.log.bind(Logger),
  success: Logger.success.bind(Logger)
}
