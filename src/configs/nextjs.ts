import type { OptionsNextJS, TypedFlatConfigItem } from '../types'

import { GLOB_SRC } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

function normalizeRules(rules: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) =>
      [key, typeof value === 'string' ? [value] : value],
    ),
  )
}

export async function nextjs(
  options: OptionsNextJS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides = {},
    rootDir,
  } = options

  await ensurePackages([
    '@next/eslint-plugin-next',
  ])

  const pluginNextJS = await interopDefault(import('@next/eslint-plugin-next'))

  function getRules(name: keyof typeof pluginNextJS.configs): Record<string, any> {
    const rules = pluginNextJS.configs?.[name]?.rules
    if (!rules)
      throw new Error(`[@liwo/eslint-config] Failed to find config ${name} in @next/eslint-plugin-next`)
    return normalizeRules(rules)
  }

  return [
    {
      name: 'liwo/nextjs/setup',
      plugins: {
        next: pluginNextJS,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'liwo/nextjs/rules',
      rules: {
        ...getRules('recommended'),
        ...getRules('core-web-vitals'),

        // overrides
        ...overrides,
      },
      settings: {
        ...(rootDir ? { next: { rootDir } } : {}),
        react: {
          version: 'detect',
        },
      },
    },
  ]
}
