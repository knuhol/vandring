import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import promisePlugin from 'eslint-plugin-promise'
import unicornPlugin from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: [
      '.next/**',
      '.yarn/**',
      'coverage/**',
      'dist/**',
      'build/**',
      'eslint.config.mjs',
      '.prettierrc.js',
    ],
  },
  ...tsEslint.config(eslint.configs.recommended, tsEslint.configs.recommendedTypeChecked),
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: '19',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
  {
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      ...promisePlugin.configs.recommended.rules,
    },
  },
  unicornPlugin.configs['flat/recommended'],
  {
    rules: {
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/no-useless-template-literals': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-for-each': 'off',
      'unicorn/no-non-function-verb-prefix': 'off',
      'unicorn/default-export-style': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/prefer-object-iterable-methods': 'off',
      'unicorn/prefer-uint8array-base64': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
    },
  },
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import/no-cycle': 'error',
      'import/no-relative-packages': 'error',
      'import/no-duplicates': 'error',
      'import/order': 'error',
    },
  },
]
