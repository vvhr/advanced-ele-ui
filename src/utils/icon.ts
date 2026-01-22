import { addIcon as iconifyAddIcon, addCollection as iconifyAddCollection } from '@iconify/vue'

/**
 * 图标数据接口
 * 符合 Iconify 图标格式规范
 */
export interface IconData {
  /** SVG body (不包含 <svg> 标签) */
  body: string
  /** 图标宽度 (默认16) */
  width?: number
  /** 图标高度 (默认16) */
  height?: number
  /** 左偏移 */
  left?: number
  /** 上偏移 */
  top?: number
  /** 旋转角度 (0-3,每个值代表90度) */
  rotate?: number
  /** 水平翻转 */
  hFlip?: boolean
  /** 垂直翻转 */
  vFlip?: boolean
}

/**
 * 图标集接口
 * 用于批量注册图标
 */
export interface IconCollection {
  /** 图标集前缀,使用时格式为 prefix:icon-name */
  prefix: string
  /** 图标集合 */
  icons: Record<string, IconData>
  /** 默认宽度 (所有图标) */
  width?: number
  /** 默认高度 (所有图标) */
  height?: number
  /** 最后修改时间 */
  lastModified?: number
}

/**
 * 添加单个自定义图标
 * @param name 图标名称,格式为 "prefix:icon-name" 或 "prefix-icon-name"
 * @param data 图标数据
 * @example
 * ```ts
 * import { addIcon } from 'advanced-ele-ui'
 *
 * addIcon('my-icons:home', {
 *   body: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
 *   width: 24,
 *   height: 24
 * })
 * ```
 */
export function addIcon(name: string, data: IconData): void {
  iconifyAddIcon(name, data)
}

/**
 * 添加自定义图标集
 * @param collection 图标集配置
 * @returns 是否添加成功
 * @example
 * ```ts
 * import { addIconCollection } from 'advanced-ele-ui'
 *
 * addIconCollection({
 *   prefix: 'my-icons',
 *   width: 24,
 *   height: 24,
 *   icons: {
 *     'home': { body: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' },
 *     'user': { body: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>' }
 *   }
 * })
 *
 * // 使用: <ae-icon icon="my-icons:home" />
 * ```
 */
export function addIconCollection(collection: IconCollection): boolean {
  return iconifyAddCollection(collection as Parameters<typeof iconifyAddCollection>[0])
}

/**
 * 批量添加多个图标集
 * @param collections 图标集数组
 * @example
 * ```ts
 * import { addIconCollections } from 'advanced-ele-ui'
 *
 * addIconCollections([
 *   { prefix: 'brand', icons: { ... } },
 *   { prefix: 'custom', icons: { ... } }
 * ])
 * ```
 */
export function addIconCollections(collections: IconCollection[]): void {
  collections.forEach(collection => addIconCollection(collection))
}
