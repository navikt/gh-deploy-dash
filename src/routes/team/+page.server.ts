import { getTeams } from '$lib/ghapi/index.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('userToken');
	if (!token) fail(401);
	else return { teams: await getTeams(token) };
};
