<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { env } from '$env/dynamic/public';
	import Cookies from 'js-cookie';
	import { Octokit } from 'octokit';

	export let owner: string;
	export let repo: string;
	export let workflow: number;
	export let success: () => void;

	const octokit = new Octokit({
		auth: import.meta.env.DEV ? env.PUBLIC_GH_PAT : Cookies.get('userToken')
	});
	const deploymentsQuery = createQuery({
		queryKey: ['deployments', owner, repo, workflow],
		queryFn: async () =>
			(
				await octokit.rest.actions.getPendingDeploymentsForRun({
					owner,
					repo,
					run_id: workflow
				})
			).data
	});

	let envs: Record<number, boolean> = {};
	let comment: string = '';
	const approveDeployments = async (reject = false) => {
		const env_ids = Object.entries(envs)
			.map(([id, selected]) => (selected ? Number(id) : null))
			.filter((id) => id !== null);
		const res = await octokit.rest.actions.reviewPendingDeploymentsForRun({
			owner,
			repo,
			run_id: workflow,
			environment_ids: env_ids,
			state: reject ? 'rejected' : 'approved',
			comment: comment
		});

		if (res.status === 200) {
			success();
		}
	};
</script>

<div>
	{#if $deploymentsQuery.isLoading}
		<p>Loading</p>
	{:else if $deploymentsQuery.isError}
		<p>Could not retrieve deployments from GitHub</p>
	{:else if $deploymentsQuery.isSuccess}
		<fieldset name="Environments">
			{#each $deploymentsQuery.data as deployment}
				{#if deployment.environment.id}
					<div>
						<input
							name="environment"
							type="checkbox"
							value={deployment.environment.id}
							bind:checked={envs[deployment.environment.id]}
							id={deployment.environment.name}
						/>
						<label for={deployment.environment.name}>{deployment.environment.name}</label>
					</div>
				{/if}
			{/each}
		</fieldset>
		<div class="comment">
			<label for="comment">Comment</label>
			<textarea id="comment" bind:value={comment}></textarea>
		</div>
		<div class="buttonRow">
			<button class="approve" on:click|preventDefault={() => approveDeployments()}>Approve</button>
			<button class="reject" on:click|preventDefault={() => approveDeployments(false)}
				>Reject</button
			>
		</div>
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
