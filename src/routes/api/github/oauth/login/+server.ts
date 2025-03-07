import { octokitApp } from '$lib/server/octokit';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const { url: ghUrl } = octokitApp.getWebFlowAuthorizationUrl({
		redirectUrl: 'https://gh-deploy-dash.intern.dev.nav.no/api/github/oauth/callback',
		allowSignup: false,
		scopes: ['repo_deployment', 'read:org', 'repo']
	});

	redirect(303, ghUrl);
};
