import { env } from '$env/dynamic/private';
import { getDeployments } from '$lib/ghapi/index.js';
import { createOAuthUserAuth } from '@octokit/auth-oauth-app';
import { fail } from '@sveltejs/kit';
import { Octokit, RequestError } from 'octokit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, params, cookies }) => {
	const token = cookies.get('userToken');
	if (!token) fail(401);
	else {
		const cursor = url.searchParams.get('cursor') ?? undefined;

		return getDeployments({ team: params.team, cursor }, token);
	}
};

export const actions = {
	reviewdeployment: async ({ cookies, request }) => {
		const token = cookies.get('userToken');
		if (!token) fail(401);

		const data = await request.formData();

		const owner = data.get('owner') as string;
		const repo = data.get('repo') as string;
		const run_id = data.get('run_id') as string;
		const enviroment = data.getAll('environment') as string[];
		const comment = data.get('comment') as string;
		const state = data.get('state') as 'rejected' | 'approved';

		const env_ids = enviroment.map((e) => Number(e));

		const octokit = import.meta.env.DEV
			? new Octokit({
					auth: import.meta.env.DEV ? env.GH_PAT : token
				})
			: new Octokit({
					authStrategy: createOAuthUserAuth,
					auth: {
						clientId: env.GH_CLIENT_ID,
						clientSecret: env.GH_CLIENT_SECRET,
						clientType: 'oauth-app',
						token
					}
				});
		let errorMsg: string | undefined;
		let success = false;

		try {
			const res = await octokit.rest.actions.reviewPendingDeploymentsForRun({
				owner,
				repo,
				run_id: Number(run_id),
				environment_ids: env_ids,
				state,
				comment: comment
			});

			if (res.status === 200) {
				success = true;
			}
		} catch (error) {
			if (error instanceof RequestError) errorMsg = error.message;
		}

		return { errorMsg, success };
	}
} satisfies Actions;
