import { fail, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { octokitApp } from '$lib/server/octokit';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (state && code) {
		const { authentication } = await octokitApp.createToken({ code, state });

		cookies.set('userToken', authentication.token, { sameSite: 'strict', path: '/' });
		redirect(303, '/team');
	} else {
		fail(400, { msg: 'Invalid state or code returned from callback' });
	}

	// We should never get here
	return new Response(null, { status: 400 });
};
