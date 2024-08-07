import { getReleases } from '$lib/ghapi/index.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('userToken');
	if (!token) fail(401);
	else {
		return { team: params.team, releases: await getReleases(token, { team: params.team }) };
	}
};
