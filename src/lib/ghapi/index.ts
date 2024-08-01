import { executeGraphql } from './client.js';
import { graphql } from './generated/graphql/index.js';

const repositoriesQuery = graphql(`
	query repositories($team: String!) {
		organization(login: "navikt") {
			team(slug: $team) {
				repositories(first: 50) {
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

export const getDeployments = async (team: string, token: string) => {
	const res = await executeGraphql({ token }, repositoriesQuery, { team });

	const repos = res?.data.organization?.team?.repositories.nodes?.filter(
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
		(a, b) => new Date(b.commit.committedDate) - new Date(a.commit.committedDate)
	);

	return { repositories: reposWithDeployments, team };
};

export type RepoDeployments = NonNullable<
	Awaited<ReturnType<typeof getDeployments>>['repositories']
>;
