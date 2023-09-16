<script>
	import { onMount } from 'svelte';
	onMount(() => {
		if (document.readyState) {
			const target = document.getElementById('loader')?.classList;
			setTimeout(() => {
				target?.add('hidden');
			}, 800);
		}
	});
</script>

<div
	id="loader"
	class="backdrop-blur-xl z-50 transition duration-500  fixed grid justify-center items-center bg-opacity-20 bg-red-400 w-screen h-screen"
>
	<h1>mohon tunggu sebentar..</h1>
</div>
