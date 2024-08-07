<script lang="ts">
	import type { RepoDeployments } from '$lib/ghapi';
	import EnvironmentDeployment from './EnvironmentDeployment.svelte';
	import RepoCard from './RepoCard.svelte';

	export let repo: RepoDeployments[0];

	const pending = repo.states.some((s) => s.waiting);
</script>

<RepoCard {pending} {repo}>
	{#each repo.states as deployment}
		<EnvironmentDeployment {deployment} repository={repo.title} />
	{/each}
</RepoCard>
