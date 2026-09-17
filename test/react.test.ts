import { describe, expect, it } from 'vitest'

import { eslintConfig } from '../src/factory'

describe('react', () => {
  it('allows Next.js exports when the Next.js config is explicitly enabled', async () => {
    const configs = await eslintConfig({
      formatters: false,
      nextjs: true,
      react: true,
      typescript: false,
    })
    const reactConfig = configs.find(config => config.name === 'liwo/react/rules')
    const rule = reactConfig?.rules?.['react-refresh/only-export-components'] as [string, { allowExportNames: string[] }]

    expect(rule[1].allowExportNames).toEqual(expect.arrayContaining([
      'generateMetadata',
      'generateStaticParams',
      'metadata',
      'viewport',
    ]))
  })
})
