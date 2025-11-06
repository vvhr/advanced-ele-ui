import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

console.log('🚀 开始构建组件库...\n')

try {
  // 1. 类型检查
  console.log('📝 执行类型检查...')
  execSync('vue-tsc --noEmit', { stdio: 'inherit' })
  console.log('✅ 类型检查通过\n')

  // 2. 构建
  console.log('🔨 开始构建...')
  execSync('vite build', { stdio: 'inherit' })
  console.log('✅ 构建完成\n')

  // 3. 读取版本号
  const pkgPath = resolve(process.cwd(), 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

  console.log(`✨ 构建成功! 版本: ${pkg.version}`)
  console.log('\n📦 准备发布到 npm:')
  console.log('   npm publish')
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
}
