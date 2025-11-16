export const findNode = <T = any>(tree: any, func: (node: any) => boolean): T | null => {
  const nodes = Array.isArray(tree) ? tree : [tree]
  
  for (const node of nodes) {
    // 检查当前节点是否匹配
    if (func(node)) {
      return node
    }
    
    // 递归查找子节点
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      const found = findNode(node.children, func)
      if (found) {
        return found
      }
    }
  }
  
  return null
}

export function findNodes(tree: any[], fn: (node: any) => boolean): any[] {
  const result: any[] = []

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (fn(node)) {
        result.push(node)
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(tree)
  return result
}
