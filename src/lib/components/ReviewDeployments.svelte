<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { env } from '$env/dynamic/public';
	import { enhance } from '$app/forms';
	import Cookies from 'js-cookie';
	import { Octokit } from 'octokit';
	import { Alert } from '@nais/ds-svelte-community';

	export let owner: string;
	export let repo: string;
	export let workflow: number;
	export let success: () => void;
	export let isMounted: boolean;
	export let errorMsg: string | undefined;
	export let isSuccess: boolean | undefined;

	$: if (isSuccess) success();

	const octokit = new Octokit({
		auth: import.meta.env.DEV ? env.PUBLIC_GH_PAT : Cookies.get('userToken')
	});

	$: deploymentsQuery = createQuery({
		queryKey: ['deployments', owner, repo, workflow],
		queryFn: async () =>
			(
				await octokit.rest.actions.getPendingDeploymentsForRun({
					owner,
					repo,
					run_id: workflow
				})
			).data,
		enabled: isMounted
	});
</script>

<div>
	{#if $deploymentsQuery.isLoading}
		<p>Loading</p>
	{:else if $deploymentsQuery.isError}
		<p>Could not retrieve deployments from GitHub</p>
	{:else if $deploymentsQuery.isSuccess}
		<form
			method="POST"
			action="?/reviewdeployment"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						window.location.reload();
					}
				};
			}}
		>
			<input type="hidden" id="owner" name="owner" value={owner} />
			<input type="hidden" id="repo" name="repo" value={repo} />
			<input type="hidden" id="run_id" name="run_id" value={workflow} />

			<fieldset name="Environments">
				{#each $deploymentsQuery.data as deployment (deployment.environment.id)}
					{#if deployment.environment.id}
						<div>
							<input
								name="environment"
								type="checkbox"
								value={deployment.environment.id}
								id={deployment.environment.name}
							/>
							<label for={deployment.environment.name}>{deployment.environment.name}</label>
						</div>
					{/if}
				{/each}
			</fieldset>
			<div class="comment">
				<label for="comment">Comment</label>
				<textarea name="comment"></textarea>
			</div>
			{#if errorMsg}
				<Alert variant="error" size="small">
					{errorMsg}
				</Alert>
			{/if}
			<div class="buttonRow">
				<button class="approve" name="state" value="approved">Approve</button>
				<button class="reject" name="state" value="rejected">Reject</button>
			</div>
		</form>
	{/if}
</div>

<style>
	.comment {
		margin: 1em 0;
		display: flex;
		flex-direction: column;
	}
	.buttonRow {
		margin: 1em 0;
		display: flex;
		justify-items: center;
		justify-content: space-between;
	}

	.approve {
		background-color: lightgreen;
	}
	.reject {
		background-color: salmon;
	}
</style>
