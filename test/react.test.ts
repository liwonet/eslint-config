import { ESLint } from 'eslint'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { eslintConfig } from '../src/factory'

const packages = vi.hoisted(() => ({ tanstackRouter: false }))

vi.mock('local-pkg', async (importOriginal) => {
  const actual = await importOriginal<typeof import('local-pkg')>()
  return {
    ...actual,
    isPackageExists: (...args: Parameters<typeof actual.isPackageExists>) =>
      args[0] === '@tanstack/react-router' ? packages.tanstackRouter : actual.isPackageExists(...args),
  }
})

describe('react', () => {
  beforeEach(() => {
    packages.tanstackRouter = false
  })

  const routeCode = `
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <div>Hello</div>
}
`

  async function lintRoute(overrides = {}) {
    const eslint = new ESLint({
      overrideConfig: await eslintConfig({
        formatters: false,
        react: { overrides },
        typescript: false,
        vue: false,
      }),
      overrideConfigFile: true,
    })
    const [result] = await eslint.lintText(routeCode, { filePath: 'src/routes/index.jsx' })
    return result.messages.filter(message => message.ruleId === 'react-refresh/only-export-components')
  }

  it('allows unexported route components when TanStack Router is installed', async () => {
    packages.tanstackRouter = true

    expect(await lintRoute()).toEqual([])
  })

  it('keeps Fast Refresh checks enabled without TanStack Router', async () => {
    expect(await lintRoute()).toEqual(expect.arrayContaining([
      expect.objectContaining({ messageId: 'localComponents', severity: 1 }),
    ]))
  })

  it('allows explicitly enabling Fast Refresh checks with TanStack Router', async () => {
    packages.tanstackRouter = true

    expect(await lintRoute({ 'react-refresh/only-export-components': 'warn' })).toEqual(expect.arrayContaining([
      expect.objectContaining({ messageId: 'localComponents', severity: 1 }),
    ]))
  })

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
