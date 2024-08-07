<script lang="ts">
	import type { RepoReleases } from '$lib/ghapi';
	import RepoCard from './RepoCard.svelte';

	export let repo: NonNullable<RepoReleases[0]>;
	export let behindBy = repo.latestRelease?.tag?.compare?.behindBy ?? 0;
</script>

<RepoCard pending={undefined} {repo}>
	<div>
		LatestRelease: {repo.latestRelease?.tag?.name}
	</div>
	{#if behindBy > 0}
		<div>
			Release is behind by {behindBy} commits!
		</div>
	{:else}
		<div>All up to date! :)</div>
	{/if}
</RepoCard>
