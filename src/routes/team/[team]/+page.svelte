<script lang="ts">
	import RepoDeployments from '$lib/components/RepoDeployments.svelte';
	import type { PageData } from './$types';
	import { team } from '$lib/stores/routing';

	export let data: PageData;

	team.set(data.team);
</script>

<h1>Team {data.team} deployments</h1>

<div>
	{#if !data.repositories}
		<p>No repositories with deployments found</p>
	{:else}
		<ul class="repoList">
			{#each data.repositories as repo}
				<li>
					<RepoDeployments {repo} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.repoList {
		list-style: none;
	}
</style>
