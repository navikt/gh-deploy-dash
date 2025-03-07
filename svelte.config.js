//import { optimizeImports } from '@nais/ds-svelte-community-preprocess-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()], // [vitePreprocess(), optimizeImports()],

	kit: {
		adapter: adapter({ dynamic_origin: true }),
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
