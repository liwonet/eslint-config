import type { OptionsStylex, TypedFlatConfigItem } from '../types'

import { GLOB_MARKDOWN_CODE, GLOB_SRC } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function stylex(
  options: OptionsStylex = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides = {},
  } = options

  await ensurePackages([
    '@stylexjs/eslint-plugin',
  ])

  const pluginStylex = await interopDefault(import('@stylexjs/eslint-plugin'))

  return [
    {
      name: 'liwo/stylex/setup',
      plugins: {
        '@stylexjs': pluginStylex,
      },
    },
    {
      files,
      name: 'liwo/stylex/rules',
      rules: {
        '@stylexjs/enforce-extension': 'error',
        '@stylexjs/no-conflicting-props': 'error',
        '@stylexjs/no-unused': 'error',
        '@stylexjs/valid-shorthands': 'error',
        '@stylexjs/valid-styles': 'error',

        // overrides
        ...overrides,
      },
    },
    {
      files: [GLOB_MARKDOWN_CODE],
      name: 'liwo/stylex/markdown-disables',
      rules: {
        // Markdown processors use generated virtual filenames, so the rule
        // cannot see filenames declared in code fence metadata.
        '@stylexjs/enforce-extension': 'off',
      },
    },
  ]
}
