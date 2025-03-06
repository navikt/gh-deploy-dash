<script lang="ts">
	import { type RepoDeployments } from '$lib/ghapi';
	import { PUBLIC_GITHUB_ORG } from '$env/static/public';
	import EnvironmentDeployment from './EnvironmentDeployment.svelte';

	import { formatDistanceToNow } from 'date-fns';

	export let repo: RepoDeployments[0];
	export let isSuccess: boolean;
	export let errorMsg: string | undefined;

	const pending = repo.states.some((s) => s.waiting);
</script>

<div class="card" class:pending>
	<a
		class="repoLink unstyled"
		href="https://github.com/{PUBLIC_GITHUB_ORG}/{repo.title}"
		target="_blank"
		rel="noreferrer"
	>
		<h4 class="title">{repo.title}</h4>
	</a>
	<div class="commitDeploy">
		<div class="commitMsg">
			<span class="smallDate">
				{formatDistanceToNow(repo.commit?.committedDate, { addSuffix: true })}
			</span>
			<code>{repo.commit?.message}</code>
		</div>
		{#each repo.states as deployment (deployment.createdAt)}
			<EnvironmentDeployment {deployment} repository={repo.title} bind:errorMsg bind:isSuccess />
		{/each}
	</div>
</div>

<style>
	.card {
		padding: 0 1em;
		padding-bottom: 0.5em;
		border: 1px solid #ccc;
		border-radius: 0.1em;
		box-shadow: 0 3px 10px #00000033;
	}

	.title {
		margin: 0.5rem;
	}

	.pending {
		border: 4px solid #ff910044;
	}

	.smallDate {
		font-size: 0.8em;
		color: #666;
	}

	.commitDeploy {
		display: flex;
		align-items: center;
		gap: 1em;
	}

	.commitMsg {
		width: 40%;
	}
</style>
