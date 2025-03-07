import { env } from '$env/dynamic/private';
import { PUBLIC_GITHUB_ORG } from '$env/static/public';
import { executeGraphql } from './client';
import { graphql } from './generated/graphql/index';

const repositoriesQuery = graphql(`
	query repositories($org: String!, $team: String!, $cursor: String) {
		organization(login: $org) {
			team(slug: $team) {
				repositories(first: 30, after: $cursor, orderBy: { field: PUSHED_AT, direction: DESC }) {
					pageInfo {
						endCursor
						hasNextPage
					}
					totalCount
					nodes {
						name
						isArchived
						deployments(first: 10, orderBy: { direction: DESC, field: CREATED_AT }) {
							totalCount
							nodes {
								environment
								commit {
									abbreviatedOid
									message
									committedDate
								}
								latestStatus {
									logUrl
									createdAt
								}
								state
							}
						}
					}
				}
			}
		}
	}
`);

const envOrder = (envString: string | null | undefined) => {
	switch (envString) {
		case 'dev-gcp':
			return 0;
		case 'prod-gcp':
			return 1;
		case 'dev-fss':
			return 2;
		case 'prod-fss':
			return 3;
		default:
			return 10;
	}
};

type Params = { team: string; cursor?: string };
export const getDeployments = async (params: Params, token: string) => {
	const res = await executeGraphql({ token }, repositoriesQuery, {
		team: params.team,
		org: PUBLIC_GITHUB_ORG
	});
	const repositories = res?.data.organization?.team?.repositories;

	const repos = repositories?.nodes?.filter(
		(r) => !r?.isArchived && (r?.deployments.totalCount ?? 0) > 0
	);

	const reposWithDeployments = repos
		?.map((r) => {
			const deployments = r?.deployments.nodes;
			if (!deployments) return null;
			const lastdeployment = deployments[0];
			if (!lastdeployment || !lastdeployment.commit) return null;

			const deployStates = deployments
				.filter((d) => d?.commit?.abbreviatedOid === lastdeployment.commit?.abbreviatedOid)
				.map((d) => ({
					environment: d?.environment,
					commit: d?.commit,
					state: d?.state,
					waiting: d?.state === 'WAITING',
					url: d?.latestStatus?.logUrl,
					createdAt: d?.latestStatus?.createdAt
				}));

			deployStates.sort((a, b) => envOrder(a.environment) - envOrder(b.environment));

			return {
				title: r.name,
				commit: lastdeployment?.commit,
				states: deployStates
			};
		})
		.filter((a) => a !== null);

	reposWithDeployments?.sort(
		(a, b) =>
			new Date(b.commit.committedDate as string).getTime() -
			new Date(a.commit.committedDate as string).getTime()
	);

	return {
		repositories: reposWithDeployments,
		team: params.team
	};
};

export type RepoDeployments = NonNullable<
	Awaited<ReturnType<typeof getDeployments>>['repositories']
>;

const teamsQuery = graphql(`
	query teams($org: String!) {
		organization(login: $org) {
			teams(role: MEMBER, first: 10) {
				nodes {
					slug
				}
			}
		}
	}
`);

const BLIST_TEAMS = env.GH_TEAMS_BLIST?.split(',') ?? [];

export const getTeams = async (token: string) => {
	const res = await executeGraphql({ token }, teamsQuery, {
		org: PUBLIC_GITHUB_ORG
	});

	const teams = res?.data.organization?.teams?.nodes?.filter(
		(t) => t?.slug && !BLIST_TEAMS.includes(t?.slug)
	);

	return { teams: teams?.filter((t) => t !== null), errors: res?.errors };
};
