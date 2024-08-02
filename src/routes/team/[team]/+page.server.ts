import { getDeployments } from '$lib/ghapi/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, cookies }) => {
	const token = cookies.get('userToken');
	return getDeployments(params.team, token);
};
