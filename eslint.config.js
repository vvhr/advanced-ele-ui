import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...vue.configs['flat/recommended'],
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier
    },
    rules: {
      // Vue 相关规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],

      // TypeScript 相关规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // 通用规则
      'no-console': 'off',
      'no-debugger': 'off',
      'no-unused-vars': 'off',
      'vue/no-unused-vars': 'warn',
      'prefer-const': 'warn',

      // Prettier 集成
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '.output',
      '.nuxt',
      '.eslintrc-auto-import.json',
      'types/auto-imports.d.ts',
      'types/components.d.ts'
    ]
  }
]
