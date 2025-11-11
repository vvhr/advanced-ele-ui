export const findNode = <T = any>(tree: any, func: (node: any) => boolean): T | null => {
  const list = Array.isArray(tree) ? tree : [...tree]
  for (const node of list) {
    if (func(node)) return node
    node.children && list.push(...node.children)
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
