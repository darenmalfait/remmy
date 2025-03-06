import { config as defaultConfig } from '@nerdfish/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [
	...defaultConfig,
	{
		ignores: [
			'**/__generated__/**',
			'**/.turbo/**',
			'**/dist/**',
			'**/__tests__/**',
			'**/*.test.ts',
			'**/public/**',
			'**/generated/**',
			'**/.content-collections/**',
		],
	},
]
