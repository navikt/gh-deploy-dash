import { OAuthApp } from '@octokit/oauth-app';

export const octokitApp = new OAuthApp({
	clientType: 'oauth-app',
	clientId: process.env.GH_CLIENT_ID!,
	clientSecret: process.env.GH_CLIENT_SECRET!
});
