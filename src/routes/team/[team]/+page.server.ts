import { getDeployments } from '$lib/ghapi/index.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, params, cookies }) => {
	const token = cookies.get('userToken');
	if (!token) fail(401);
	else {
		const cursor = url.searchParams.get('cursor') ?? undefined;

		return getDeployments({ team: params.team, cursor }, token);
	}
};
