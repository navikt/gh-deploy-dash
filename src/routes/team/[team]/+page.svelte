<script lang="ts">
	import RepoDeployments from '$lib/components/RepoDeployments.svelte';
	import type { PageData, ActionData } from './$types';
	import { team } from '$lib/stores/routing';

	export let data: PageData;
	export let form: ActionData;

	team.set(data.team);
</script>

<h1 class="header">Team {data.team} deployments</h1>

<div>
	{#if !data.repositories}
		<p>No repositories with deployments found</p>
	{:else}
		<ul class="repoList">
			{#each data.repositories as repo (repo.title)}
				<li class="list-element">
					<RepoDeployments {repo} isSuccess={!!form?.success} errorMsg={form?.errorMsg} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.header {
		margin-inline: 1em;
	}
	.repoList {
		list-style: none;
		margin: 2em;
		padding: 0;
	}
	.list-element {
		margin-block: 1em;
	}
</style>
