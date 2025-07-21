import { antfu } from './src'

export default antfu(
  {
    astro: true,
    formatters: true,
    pnpm: true,
    react: true,
    solid: true,
    svelte: true,
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
