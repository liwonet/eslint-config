import { eslintConfig } from './src'

export default eslintConfig(
  {
    formatters: true,
    pnpm: true,
    react: true,
    type: 'lib',
    typescript: true,
    vue: {
      a11y: true,
    },
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
      '**/constants-generated.ts',
    ],
  },
  {
    files: ['src/**/*.ts', '*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
