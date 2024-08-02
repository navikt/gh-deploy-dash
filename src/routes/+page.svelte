<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<h1>Github deploy dashboard</h1>

<button
	on:click={(e) => {
		e.preventDefault();
		goto('/api/github/oauth/login');
	}}>Login with GitHub</button
>
