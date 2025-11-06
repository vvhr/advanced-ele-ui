import type { DictMap, DictItem } from '@/types/dict'

export interface UseDictTools {
  isExistName(name: string): boolean
  getDictOptions(name: string): DictItem[]
  getDictItem(name: string, value: string): DictItem
  getDictItemLabel(name: string, value: string): string
  getDictItemProp(name: string, value: string, prop: string): any
  getTreeDictItemLabel(
    name: string | DictItem[],
    value: string | string[],
    valueIsPath?: boolean,
    fullpath?: boolean,
    separator?: string
  ): string
}

export function useDict(dictMap: DictMap): UseDictTools {
  // 工具方法-字典名是否存在
  function isExistName(name: string) {
    return name in dictMap
  }

  // 工具方法-通过字典名获取字典数组
  function getDictOptions(name: string) {
    return isExistName(name) ? dictMap[name] : []
  }

  // 工具方法-通过字典名和值获取字典项
  function getDictItem(name: string, value: string) {
    const options: DictItem[] = getDictOptions(name)
    const item: DictItem = options.find(item => item.value === value)
    return item || { label: '', value: value }
  }

  // 工具方法-通过字典名和值获取字典项的 label
  function getDictItemLabel(name: string, value: string) {
    return getDictItem(name, value).label || ''
  }

  // 工具方法-通过字典名和值和需的属性获取字典项的属性值
  function getDictItemProp(name: string, value: string, prop: string) {
    return this.getDictItem(name, value)[prop] || ''
  }

  /**
   * 工具方法-通过树形字典的值获取标题
   * @param name 字典类名 或 选项数组
   * @param value 选项值 或 选项完整路径数组
   * @param valueIsPath (默认: `true`) 当`value`是字符串时, 标识`value`是逗号拼接的路径还是最后一级的值
   * @param fullpath (默认: `true`) 是否返回完整路径的标题
   * @param separator (默认: `/`) 当`fullpath`为`true`时，自动拼接的路径分隔符
   *
   * @example
   * // 1.当value是逗号拼接的路径，并返回完整路径的标题：
   * getTreeDictItemLabel('region', '110000,110100,110101', true, true, ' / ')
   * // 返回: 北京市 / 北京市市辖区 / 北京市市辖区东城区
   *
   * // 2.当value是数组路径，且返回完整路径的标题：
   * getTreeDictItemLabel('region', ['110000', '110100', '110101'], false, true, ' / ')
   * // 返回: 北京市 / 北京市市辖区 / 北京市市辖区东城区
   *
   * // 3.当value是最后一级的字符串值，并返回完整路径的标题：
   * getTreeDictItemLabel('region', '110101', false, true, ' / ')
   * // 返回: 北京市 / 北京市市辖区 / 北京市市辖区东城区
   *
   * // 4.当value是最后一级的字符串值，只返回最后一级的标题：
   * getTreeDictItemLabel('region', '110101', false, false)
   * // 返回: 北京市市辖区东城区
   *
   * @returns string
   */
  function getTreeDictItemLabel(
    name: string | DictItem[],
    value: string | string[],
    valueIsPath: boolean = true,
    fullpath: boolean = true,
    separator: string = ' / '
  ) {
    const tree = typeof name === 'string' ? getDictOptions(name) : name
    if (value === null || value === undefined || value === '') return ''
    const nodeLabel = (node: any) => node && (node.label ?? String(node.value ?? ''))
    // 将节点 value 转为字符串以便比较
    const eq = (a: any, b: any) => String(a) === String(b)
    // 情况一：传入的是路径数组（或 value 为 string 且 valueIsPath 为 true）
    let pathArray: string[] | null = null
    if (Array.isArray(value)) {
      pathArray = value.map(v => String(v))
    } else if (valueIsPath) {
      pathArray = String(value)
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }
    if (pathArray) {
      const labels: string[] = []
      let currentLevel = tree
      for (const val of pathArray) {
        if (!currentLevel || currentLevel.length === 0) break
        const found = currentLevel.find((n: any) => eq(n.value, val))
        if (!found) break
        labels.push(nodeLabel(found))
        currentLevel = found.children || []
      }
      if (labels.length === 0) return ''
      return fullpath ? labels.join(separator) : labels[labels.length - 1]
    }
    // 情况二：传入的是单个值（字符串），需要在整棵树中查找并回溯路径
    const target = String(value)
    const stackLabels: string[] = []
    let found = false
    const dfs = (nodes: any[]): boolean => {
      if (!nodes || nodes.length === 0) return false
      for (const n of nodes) {
        stackLabels.push(nodeLabel(n))
        if (eq(n.value, target)) {
          found = true
          return true
        }
        if (n.children && n.children.length > 0) {
          if (dfs(n.children)) return true
        }
        stackLabels.pop()
      }
      return false
    }
    dfs(tree)
    if (!found || stackLabels.length === 0) return ''
    return fullpath ? stackLabels.join(separator) : stackLabels[stackLabels.length - 1]
  }
  return {
    isExistName,
    getDictOptions,
    getDictItem,
    getDictItemLabel,
    getDictItemProp,
    getTreeDictItemLabel
  }
}
