<script lang="ts">
	import { type RepoDeployments } from '$lib/ghapi';
	import { getWorkflowFromDeploymentUrl } from '$lib/utils';
	import { get } from 'svelte/store';
	import { PUBLIC_GITHUB_ORG } from '$env/static/public';

	export let deployment: RepoDeployments[0]['states'][0];
	export let repository: string;
	export let errorMsg: string | undefined;
	export let isSuccess: boolean | undefined;

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
					owner={PUBLIC_GITHUB_ORG}
					workflow={Number(getWorkflowFromDeploymentUrl(deployment.url))}
					success={() => (showReviewModal = false)}
					bind:isMounted={showReviewModal}
					{isSuccess}
					{errorMsg}
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
	.status-error,
	.status-failure {
		background-color: #f68282;
	}

	.status-failure {
		border-color: red;
	}
</style>
