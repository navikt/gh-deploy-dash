<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_GITHUB_ORG } from '$env/static/public';

	export let data: PageData;
</script>

<h2>Teams</h2>

<ul>
	{#if !data.teams || data.teams.length === 0}
		<span>
			Fant ingen team i organisasjonen. Pass på at du har gitt github appen tilgang til {PUBLIC_GITHUB_ORG}
			organisasjonen.
		</span>
	{:else}
		{#each data.teams as team}
			<li><a href="/team/{team.slug}/">{team.slug}</a></li>
		{/each}
	{/if}
</ul>
