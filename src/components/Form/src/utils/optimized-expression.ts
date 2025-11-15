/**
 * 优化后的表达式工具类
 * 解决原有实现中每次都创建新 Function 的性能问题
 */

import type { FormSchema } from '../types'
import type { ExpressionTools } from '../tools'
import { expressionTools } from '../tools'
import * as R from 'lodash-es'
import { logger } from '@/locale'

// 表达式缓存项接口
interface CacheItem {
  func: Function
  dependencies: Set<string>
  lastUsed: number
  hitCount: number
}

// 结果缓存项接口
interface ResultCacheItem {
  result: any
  dependencyHash: string
  timestamp: number
  ttl: number
}

/**
 * 高性能表达式缓存管理器
 */
class ExpressionCache {
  // 函数缓存 - 存储编译后的函数
  private functionCache = new Map<string, CacheItem>()

  // 结果缓存 - 存储计算结果
  private resultCache = new Map<string, ResultCacheItem>()

  // 缓存配置
  private readonly config = {
    maxFunctionCacheSize: 500, // 最大函数缓存数量
    maxResultCacheSize: 1000, // 最大结果缓存数量
    defaultTTL: 5000, // 默认缓存时间 5秒
    cleanupInterval: 30000, // 清理间隔 30秒
    enableResultCache: true, // 是否启用结果缓存
    enableDependencyTracking: true // 是否启用依赖追踪
  }

  // 清理定时器
  private cleanupTimer: NodeJS.Timeout | null = null

  // 统计信息
  private stats = {
    functionCacheHits: 0,
    functionCacheMisses: 0,
    resultCacheHits: 0,
    resultCacheMisses: 0,
    totalExecutions: 0,
    averageExecutionTime: 0
  }

  constructor() {
    this.startCleanupTimer()
  }

  /**
   * 获取或创建缓存的函数
   */
  private getOrCreateFunction(code: string): Function {
    const existing = this.functionCache.get(code)

    if (existing) {
      existing.lastUsed = Date.now()
      existing.hitCount++
      this.stats.functionCacheHits++
      return existing.func
    }

    this.stats.functionCacheMisses++

    try {
      // 创建新函数
      const func = new Function(
        'form',
        'column',
        'disabled',
        'excontext',
        'tools',
        `return ${code}`
      )

      // 分析依赖
      const dependencies = this.config.enableDependencyTracking
        ? this.analyzeDependencies(code)
        : new Set<string>()

      // 缓存函数
      const cacheItem: CacheItem = {
        func,
        dependencies,
        lastUsed: Date.now(),
        hitCount: 1
      }

      this.functionCache.set(code, cacheItem)

      // 检查缓存大小
      this.checkFunctionCacheSize()

      return func
    } catch (error) {
      logger.error('console.form.expressionCompileError', { code }, error)
      // 返回安全的默认函数
      return () => undefined
    }
  }

  /**
   * 分析表达式依赖
   */
  private analyzeDependencies(code: string): Set<string> {
    const dependencies = new Set<string>()

    // 匹配 form.xxx 模式
    const formFieldRegex = /form\.([a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*)/g
    let match

    while ((match = formFieldRegex.exec(code)) !== null) {
      dependencies.add(`form.${match[1]}`)
    }

    // 匹配 excontext.xxx 模式
    const excontextRegex = /excontext\.([a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*)/g
    while ((match = excontextRegex.exec(code)) !== null) {
      dependencies.add(`excontext.${match[1]}`)
    }

    // 匹配 disabled 和 column 引用
    if (code.includes('disabled')) {
      dependencies.add('disabled')
    }
    if (code.includes('column')) {
      dependencies.add('column')
    }

    return dependencies
  }

  /**
   * 生成依赖哈希
   */
  private generateDependencyHash(
    code: string,
    form: Recordable,
    column: FormSchema,
    disabled: boolean,
    excontext: Recordable
  ): string {
    const cacheItem = this.functionCache.get(code)
    if (!cacheItem || !this.config.enableDependencyTracking) {
      // 如果没有依赖信息，使用全量哈希
      return this.hashObject({ form, column: column.field || column.key, disabled, excontext })
    }

    // 只包含相关依赖的值
    const relevantData: any = {}

    cacheItem.dependencies.forEach(dep => {
      if (dep.startsWith('form.')) {
        const path = dep.substring(5)
        relevantData[dep] = R.get(form, path)
      } else if (dep.startsWith('excontext.')) {
        const path = dep.substring(11)
        relevantData[dep] = R.get(excontext, path)
      } else if (dep === 'disabled') {
        relevantData.disabled = disabled
      } else if (dep === 'column') {
        relevantData.column = column.field || column.key
      }
    })

    return this.hashObject(relevantData)
  }

  /**
   * 简单对象哈希
   */
  private hashObject(obj: any): string {
    return JSON.stringify(obj, Object.keys(obj).sort())
  }

  /**
   * 执行表达式（带缓存）
   */
  executeExpression(
    code: string,
    form: Recordable,
    column: FormSchema,
    disabled: boolean,
    excontext: Recordable,
    tools: ExpressionTools = expressionTools
  ): any {
    const startTime = performance.now()
    this.stats.totalExecutions++

    try {
      // 检查结果缓存
      if (this.config.enableResultCache) {
        const dependencyHash = this.generateDependencyHash(code, form, column, disabled, excontext)
        const resultCacheKey = `${code}|${dependencyHash}`
        const cachedResult = this.resultCache.get(resultCacheKey)

        if (cachedResult && this.isResultCacheValid(cachedResult)) {
          this.stats.resultCacheHits++
          this.updateExecutionTime(startTime)
          return cachedResult.result
        }

        this.stats.resultCacheMisses++
      }

      // 获取函数并执行
      const func = this.getOrCreateFunction(code)
      const result = func(form, column, disabled, excontext, tools)

      // 缓存结果
      if (this.config.enableResultCache) {
        this.cacheResult(code, result, form, column, disabled, excontext)
      }

      this.updateExecutionTime(startTime)
      return result
    } catch (error) {
      logger.error('console.form.expressionExecuteError', { code }, error)
      this.updateExecutionTime(startTime)
      return undefined
    }
  }

  /**
   * 缓存执行结果
   */
  private cacheResult(
    code: string,
    result: any,
    form: Recordable,
    column: FormSchema,
    disabled: boolean,
    excontext: Recordable
  ): void {
    const dependencyHash = this.generateDependencyHash(code, form, column, disabled, excontext)
    const resultCacheKey = `${code}|${dependencyHash}`

    const cacheItem: ResultCacheItem = {
      result,
      dependencyHash,
      timestamp: Date.now(),
      ttl: this.config.defaultTTL
    }

    this.resultCache.set(resultCacheKey, cacheItem)
    this.checkResultCacheSize()
  }

  /**
   * 检查结果缓存是否有效
   */
  private isResultCacheValid(item: ResultCacheItem): boolean {
    return Date.now() - item.timestamp < item.ttl
  }

  /**
   * 更新执行时间统计
   */
  private updateExecutionTime(startTime: number): void {
    const executionTime = performance.now() - startTime
    this.stats.averageExecutionTime =
      (this.stats.averageExecutionTime * (this.stats.totalExecutions - 1) + executionTime) /
      this.stats.totalExecutions
  }

  /**
   * 检查函数缓存大小
   */
  private checkFunctionCacheSize(): void {
    if (this.functionCache.size > this.config.maxFunctionCacheSize) {
      this.cleanupFunctionCache()
    }
  }

  /**
   * 检查结果缓存大小
   */
  private checkResultCacheSize(): void {
    if (this.resultCache.size > this.config.maxResultCacheSize) {
      this.cleanupResultCache()
    }
  }

  /**
   * 清理函数缓存（LRU策略）
   */
  private cleanupFunctionCache(): void {
    const entries = Array.from(this.functionCache.entries())

    // 按最后使用时间和命中次数排序
    entries.sort((a, b) => {
      const scoreA = a[1].lastUsed + a[1].hitCount * 1000
      const scoreB = b[1].lastUsed + b[1].hitCount * 1000
      return scoreA - scoreB
    })

    // 删除最少使用的 25%
    const deleteCount = Math.floor(entries.length * 0.25)
    for (let i = 0; i < deleteCount; i++) {
      this.functionCache.delete(entries[i][0])
    }
  }

  /**
   * 清理结果缓存
   */
  private cleanupResultCache(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    this.resultCache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => this.resultCache.delete(key))

    // 如果还是太多，删除最旧的
    if (this.resultCache.size > this.config.maxResultCacheSize) {
      const entries = Array.from(this.resultCache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

      const deleteCount = this.resultCache.size - this.config.maxResultCacheSize
      for (let i = 0; i < deleteCount; i++) {
        this.resultCache.delete(entries[i][0])
      }
    }
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupResultCache()
    }, this.config.cleanupInterval)
  }

  /**
   * 停止清理定时器
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.functionCache.clear()
    this.resultCache.clear()
    this.resetStats()
  }

  /**
   * 重置统计信息
   */
  private resetStats(): void {
    this.stats = {
      functionCacheHits: 0,
      functionCacheMisses: 0,
      resultCacheHits: 0,
      resultCacheMisses: 0,
      totalExecutions: 0,
      averageExecutionTime: 0
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const functionCacheTotal = this.stats.functionCacheHits + this.stats.functionCacheMisses
    const resultCacheTotal = this.stats.resultCacheHits + this.stats.resultCacheMisses

    return {
      ...this.stats,
      functionCacheHitRate:
        functionCacheTotal > 0
          ? ((this.stats.functionCacheHits / functionCacheTotal) * 100).toFixed(2) + '%'
          : '0%',
      resultCacheHitRate:
        resultCacheTotal > 0
          ? ((this.stats.resultCacheHits / resultCacheTotal) * 100).toFixed(2) + '%'
          : '0%',
      functionCacheSize: this.functionCache.size,
      resultCacheSize: this.resultCache.size,
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * 估算内存使用量
   */
  private estimateMemoryUsage(): string {
    const functionCacheSize = this.functionCache.size * 1024 // 假设每个函数 1KB
    const resultCacheSize = this.resultCache.size * 256 // 假设每个结果 256B
    const totalBytes = functionCacheSize + resultCacheSize

    if (totalBytes < 1024) return `${totalBytes}B`
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)}KB`
    return `${(totalBytes / (1024 * 1024)).toFixed(1)}MB`
  }

  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    this.stopCleanupTimer()
    this.clear()
  }
}

// 全局缓存实例
const expressionCache = new ExpressionCache()

// 优化后的表达式执行函数
export function runFormSchemaExpFunction(
  code: string,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable,
  tools: ExpressionTools
) {
  return expressionCache.executeExpression(code, form, column, disabled, excontext, tools)
}

export function getFormSchemaExpFunction(
  code: string,
  form: Recordable,
  column: FormSchema,
  disabled: boolean,
  excontext: Recordable,
  tools: ExpressionTools
) {
  // 返回一个函数，该函数会使用缓存
  return () => expressionCache.executeExpression(code, form, column, disabled, excontext, tools)
}

// 工具函数
export function clearExpressionCache() {
  expressionCache.clear()
}

export function getExpressionCacheStats() {
  return expressionCache.getStats()
}

export function destroyExpressionCache() {
  expressionCache.destroy()
}

// 开发环境下的调试工具
if (process.env.NODE_ENV === 'development') {
  // 暴露到全局对象，方便调试
  ;(window as any).__expressionCache = {
    getStats: () => expressionCache.getStats(),
    clear: () => expressionCache.clear(),
    cache: expressionCache
  }
}

// 导出缓存实例（用于测试）
export { expressionCache }
