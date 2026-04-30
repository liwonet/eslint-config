/* eslint-disable perfectionist/sort-objects */
import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import { isPackageExists } from 'local-pkg'
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'

import { ensurePackages, interopDefault } from '../utils'

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  'vite',
]
const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev',
]
const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev',
]
const NextJsPackages = [
  'next',
]

export async function react(
  options: OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`],
    overrides = {},
    tsconfigPath,
  } = options

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
  ])

  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'react/no-implicit-key': 'error',
    'react/no-leaked-conditional-rendering': 'warn',
  }

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh,
  ] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-hooks')),
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const)

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i))
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i))
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i))
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  return [
    {
      name: 'liwo/react/setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
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
      name: 'liwo/react/rules',
      rules: {
        // recommended rules from @eslint-react core https://eslint-react.xyz/docs/rules/overview
        'react/no-access-state-in-setstate': 'error',
        'react/no-array-index-key': 'warn',
        'react/no-children-count': 'warn',
        'react/no-children-for-each': 'warn',
        'react/no-children-map': 'warn',
        'react/no-children-only': 'warn',
        'react/no-children-to-array': 'warn',
        'react/no-class-component': 'warn',
        'react/no-clone-element': 'warn',
        'react/no-component-will-mount': 'error',
        'react/no-component-will-receive-props': 'error',
        'react/no-component-will-update': 'error',
        'react/no-context-provider': 'warn',
        'react/no-create-ref': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-duplicate-key': 'warn',
        'react/no-forward-ref': 'warn',
        'react/no-missing-component-display-name': 'warn',
        'react/no-missing-key': 'error',
        'react/no-misused-capture-owner-stack': 'warn',
        'react/no-nested-component-definitions': 'error',
        'react/no-set-state-in-component-did-mount': 'warn',
        'react/no-set-state-in-component-did-update': 'warn',
        'react/no-set-state-in-component-will-update': 'warn',
        'react/no-unnecessary-use-prefix': 'warn',
        'react/no-unsafe-component-will-mount': 'warn',
        'react/no-unsafe-component-will-receive-props': 'warn',
        'react/no-unsafe-component-will-update': 'warn',
        'react/no-unstable-context-value': 'warn',
        'react/no-unstable-default-props': 'warn',
        'react/no-unused-class-component-members': 'warn',
        'react/no-use-context': 'warn',

        // recommended rules from @eslint-react/jsx https://eslint-react.xyz/docs/rules/overview
        'react/jsx-no-comment-textnodes': 'warn',
        'react/jsx-no-children-prop': 'warn',
        'react/jsx-no-useless-fragment': 'warn',
        'react/jsx-no-namespace': 'error',

        // recommended rules from @eslint-react/dom https://eslint-react.xyz/docs/rules/overview#dom-rules
        'react/dom-no-dangerously-set-innerhtml': 'warn',
        'react/dom-no-dangerously-set-innerhtml-with-children': 'error',
        'react/dom-no-find-dom-node': 'error',
        'react/dom-no-flush-sync': 'error',
        'react/dom-no-hydrate': 'error',
        'react/dom-no-missing-button-type': 'warn',
        'react/dom-no-missing-iframe-sandbox': 'warn',
        'react/dom-no-render': 'error',
        'react/dom-no-render-return-value': 'error',
        'react/dom-no-script-url': 'warn',
        'react/dom-no-string-style-prop': 'warn',
        'react/dom-no-unknown-property': 'warn',
        'react/dom-no-unsafe-iframe-sandbox': 'warn',
        'react/dom-no-unsafe-target-blank': 'warn',
        'react/dom-no-use-form-state': 'error',
        'react/dom-no-void-elements-with-children': 'error',

        // recommended rules eslint-plugin-react-hooks https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks/src/rules
        ...pluginReactHooks.configs.recommended.rules,

        // recommended rules from @eslint-react/hooks-extra
        'react/set-state-in-effect': 'warn',

        // recommended rules from @eslint-react/web-api https://eslint-react.xyz/docs/rules/overview#web-api-rules
        'react/web-api-no-leaked-event-listener': 'warn',
        'react/web-api-no-leaked-fetch': 'warn',
        'react/web-api-no-leaked-interval': 'warn',
        'react/web-api-no-leaked-resize-observer': 'warn',
        'react/web-api-no-leaked-timeout': 'warn',

        // recommended rules from @eslint-react/naming-convention
        'react/naming-convention-context-name': 'warn',
        'react/naming-convention-id-name': 'warn',
        'react/naming-convention-ref-name': 'warn',

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'config',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport',
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action',
                    'clientLoader',
                    'clientAction',
                    'handle',
                    'shouldRevalidate',
                  ]
                : []),
            ],
          },
        ],

        // overrides
        ...overrides,
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'liwo/react/type-aware-rules',
          rules: {
            ...typeAwareRules,
          },
        }]
      : [],
  ]
}
