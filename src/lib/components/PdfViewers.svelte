<script>
	// @ts-nocheck

	import { onMount } from "svelte";
	/**
	 * @type {typeof import("svelte-pdf").default}
	 */
	let PdfViewer;
	let tampil = true;
	onMount(async () => {
		tampil = false;
		const module = await import("svelte-pdf");
		setTimeout(() => {
			PdfViewer = module.default;
			tampil = true;
		}, 3000);
	});
</script>

<svelte:component
	this={PdfViewer}
	style="width: 60%;"
	url={"http://127.0.0.1:8000/api/api/v1/data/laporan?file=laporan.pdf"}
/>
<div
	class:tampil
	class="w-2/3 h-full bg-slate-100 flex justify-center items-center"
>
	<h1>memuatu....</h1>
</div>

<style>
	.tampil {
		@apply hidden;
	}
</style>
