<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Teams</h2>

<ul>
	{#each data.teams as team}
		<li><a href="/team/{team.slug}/">{team.slug}</a></li>
	{/each}
</ul>
