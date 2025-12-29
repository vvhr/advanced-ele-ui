import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// 生成构建版本号：dev-YYYYMMDD-HHmm
function generateBuildVersion() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = now.toTimeString().slice(0, 5).replace(':', '')
  return `dev-${date}-${time}`
}

const buildVersion = generateBuildVersion()

// 更新 package.json
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
packageJson.buildVersion = buildVersion
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

// 更新 src/version.ts
const versionTsPath = path.join(rootDir, 'src/version.ts')
let versionTs = fs.readFileSync(versionTsPath, 'utf-8')
versionTs = versionTs.replace(/buildVersion: '[^']*'/, `buildVersion: '${buildVersion}'`)
fs.writeFileSync(versionTsPath, versionTs)

console.log(`✅ Build version updated to: ${buildVersion}`)
