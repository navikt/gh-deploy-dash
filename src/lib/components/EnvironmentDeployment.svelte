<script lang="ts">
	import { type RepoDeployments } from '$lib/ghapi';
	import { getWorkflowFromDeploymentUrl } from '$lib/utils';
	import { get } from 'svelte/store';

	export let deployment: RepoDeployments[0]['states'][0];
	export let repository: string;

	import { team } from '$lib/stores/routing';
	import Modal from './Modal.svelte';
	import ReviewDeployments from './ReviewDeployments.svelte';
	let showReviewModal = false;
</script>

<div class="deployment">
	<a
		class="repoLink"
		href="https://console.nav.cloud.nais.io/team/{get(
			team
		)}/{deployment.environment}/app/{repository}"
		><span class="environment">{deployment.environment}</span></a
	>
	<span class={`status status-${deployment.state?.toLowerCase()}`}>
		{#if deployment.url}
			<a class="repoLink" href={deployment.url.replace(/\/job\/.*/, '')}>{deployment.state}</a>
		{:else}
			{deployment.state}
		{/if}
	</span>
	<div class="buttonRow">
		{#if deployment.state === 'WAITING'}
			<button on:click={() => (showReviewModal = true)}>Review deployment</button>
			<Modal bind:showModal={showReviewModal}>
				<h2 slot="header">Review deployment</h2>
				<ReviewDeployments
					repo={repository}
					owner="navikt"
					workflow={Number(getWorkflowFromDeploymentUrl(deployment.url))}
					success={() => (showReviewModal = false)}
				/>
			</Modal>
		{/if}
	</div>
</div>

<style>
	.buttonRow {
		min-height: 2em;
	}
	.deployment {
		display: flex;
		flex-direction: column;
		min-width: 6em;
		gap: 0.5em;
		justify-items: center;
		align-items: center;
	}

	.environment {
		text-decoration: underline;
	}

	.status {
		border-radius: 5px;
		padding: 1px 2px;
	}
	.status-waiting {
		background-color: #ffd799;
	}
	.status-active {
		background-color: #99dead;
	}
	.status-inactive {
		background-color: #cccccc77;
	}
	.status-error {
		background-color: #f68282;
	}
</style>
