import { octokitApp } from '$lib/server/octokit';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const { url: ghUrl } = octokitApp.getWebFlowAuthorizationUrl({
		redirectUrl: 'http://localhost:5173/api/github/oauth/callback',
		allowSignup: false,
		scopes: ['repo_deployment', 'read:org', 'repo:status']
	});

	redirect(303, ghUrl);
};
