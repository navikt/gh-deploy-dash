import { getDeployments } from '$lib/ghapi/index.js';
import type { PageLoad } from './$types';
const TOKEN = process.env.GH_PAT;

export const load: PageLoad = ({ params }) => {
	return getDeployments(params.team, TOKEN);
};
