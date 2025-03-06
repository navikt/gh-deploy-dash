<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_GITHUB_ORG } from '$env/static/public';

	import { Alert } from '@nais/ds-svelte-community';

	export let data: PageData;

	let errMsgs = data.errors?.map((e) => `${e.type}: ${e.message}`);
</script>

<h2>Teams</h2>

{#if errMsgs}
	<Alert variant="error">{errMsgs}</Alert>
{/if}

{#if !data.teams || data.teams.length === 0}
	<span>
		Could not find any teams in the organization. Please make sure you have access to the
		{PUBLIC_GITHUB_ORG} org on GitHub.
	</span>
{:else}
	<ul>
		{#each data.teams as team (team.slug)}
			<li><a href="/team/{team.slug}/">{team.slug}</a></li>
		{/each}
	</ul>
{/if}
