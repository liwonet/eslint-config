import { eslintConfig } from './src'

export default eslintConfig(
  {
    pnpm: true,
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
