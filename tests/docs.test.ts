import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const docs = ['README.md', 'README.zh.md', 'CHANGELOG.md', 'CHANGELOG.zh.md']

describe('documentation examples', () => {
  it('uses the exported AeTabPane component name', () => {
    docs.forEach(file => {
      const content = readFileSync(resolve(rootDir, file), 'utf-8')

      expect(content, file).not.toContain('AeTabPanel')
    })
  })
})
