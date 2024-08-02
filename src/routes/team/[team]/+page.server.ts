import { getDeployments } from '$lib/ghapi/index.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, cookies }) => {
	const token = cookies.get('userToken');
	if (!token) fail(401);
	else return getDeployments(params.team, token);
};
