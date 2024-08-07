<script lang="ts">
	import type { PageData } from './$types';
	import { team } from '$lib/stores/routing';
	import RepoRelease from '$lib/components/RepoRelease.svelte';

	export let data: PageData;

	team.set(data.team);
</script>

<h1>Team {data.team} Releases</h1>

<div>
	{#if !data.releases}
		<p>No repositories with releases found</p>
	{:else}
		<ul class="repoList">
			{#each data.releases as repo}
				<li>
					<RepoRelease {repo} />
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
