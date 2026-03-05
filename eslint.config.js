import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Prettier disables conflicting formatting rules (keep last)
  prettierConfig,

  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-fallthrough': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // VuePress component names are single-word by convention
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    // Cypress test files: allow chai assertion expressions
    files: ['cypress/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  {
    // Ignore build output, vendored scripts, and node_modules
    ignores: [
      'content/.vuepress/dist/**',
      'content/.vuepress/.temp/**',
      'content/.vuepress/.cache/**',
      'content/.vuepress/public/umami.js',
      'node_modules/**',
    ],
  },
)
