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
			Authorization: `token ${token}`
		},
		body: JSON.stringify({ query: query, variables })
	});

	if (!res.ok) {
		console.error(await res.text());
		return undefined;
	}

	return (await res.json()) as { data: Res };
};
