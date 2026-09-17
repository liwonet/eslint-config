import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

import { eslintConfig } from '../src/factory'

describe('stylex', () => {
  it('does not enforce module extensions in Markdown code blocks', async () => {
    const overrideConfig = await eslintConfig({
      formatters: false,
      react: false,
      stylex: true,
      typescript: false,
      vue: false,
    })
    const eslint = new ESLint({
      overrideConfig,
      overrideConfigFile: true,
    })
    const [result] = await eslint.lintText(`
\`\`\`typescript color.stylex.ts
import * as stylex from '@stylexjs/stylex'

export const color = stylex.defineVars({
  primary: 'blue',
})
\`\`\`
`, {
      filePath: 'article.md',
    })

    expect(result.messages).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        ruleId: '@stylexjs/enforce-extension',
      }),
    ]))
  })
})
