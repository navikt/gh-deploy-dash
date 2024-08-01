import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'src/lib/ghapi/schema.js',
	emitLegacyCommonJSImports: false,
	documents: ['src/lib/ghapi/index.ts'],
	generates: {
		'src/lib/ghapi/generated/graphql/': {
			preset: 'client',
			config: { documentMode: 'string' }
		}
	}
};

export default config;
