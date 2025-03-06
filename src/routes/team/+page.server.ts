import { getTeams } from '$lib/ghapi/index';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('userToken');
	if (!token) return fail(401);
	else {
		const { teams, errors } = await getTeams(token);
		return { teams, errors };
	}
};
