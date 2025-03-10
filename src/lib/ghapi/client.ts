import type { GraphQlQueryResponse } from '@octokit/graphql/types';
import type { TypedDocumentString } from './generated/graphql/graphql';

export const executeGraphql = async <Res, Vars>(
	{ token }: { token: string },
	query: TypedDocumentString<Res, Vars>,
	...[variables]: Vars extends Record<string, never> ? [] : [Vars]
) => {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: import.meta.env.DEV ? `token ${process.env.GH_PAT}` : `Bearer ${token}`
		},
		body: JSON.stringify({ query: query, variables })
	});

	if (!res.ok) {
		console.error(`GH GraphQL req failed with status: ${res.status} ${res.statusText}`);
		console.error(await res.text());
		return undefined;
	}

	return (await res.json()) as {
		data: Res;
		errors: GraphQlQueryResponse<never>['errors'];
	};
};
