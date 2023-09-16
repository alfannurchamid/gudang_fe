<script lang="ts">
	import Chart2 from './Chart2.svelte';
	import IconFile from '$lib/static/IconFile.svelte';
	import { onMount } from 'svelte';
	export let totalkab: number[];
	export let totalGlobal: number;
	export let po: number;
	export let namaArea: string;
	let chartTampil = false;
	let totalkabTampil = [0, 0, 0, 0, 0, 0];
	console.log(totalkab);

	if (!totalkab) {
		totalkab = totalkabTampil;
		chartTampil = false;
		totalkab = totalkab;
		// alert('totalkab undefined');
	} else {
		totalkabTampil = totalkab;
	}

	const pageLaporanOpen = () => {
		const target = document.getElementById('pageLaporan')?.classList;
		target?.remove('translate-y-full');
	};
</script>

<div class="w-3/4 h-full bg-slate-300 bg-opacity-40 flex flex-col justify-start p-2 rounded-xl">
	<div class=" mb-2 flex justify-center w-full">
		{#if po == 2}
			<div
				on:click={() => {
					pageLaporanOpen();
				}}
				class="w-1/4 h-18  flex flex-col justify-center"
			>
				<IconFile />
				<div class="text-xxs text-start ">laporan</div>
			</div>
		{/if}

		<div class="w-3/4 h-18 ">
			<h1 class="text-xs font-semibold">Total se {namaArea}:</h1>
			<h1 class="text-xl">{totalGlobal}</h1>
		</div>
	</div>

	{#if !chartTampil}
		<Chart2 {totalkab} {totalGlobal} />
	{/if}

	<div class="w-full text-xs flex flex-col p-4 px-3">
		<div
			class="flex justify-between items-center text-white font-medium h-6 bg-red-400 rounded-full my-1 px-3"
		>
			<h1>aktif</h1>
			{#if totalkab[0]}
				<h1>{totalkab[0]}</h1>
			{/if}
		</div>
		<div
			class="flex justify-between items-center text-white font-medium h-6 bg-violet-400 rounded-full my-1 px-3"
		>
			<h1>loyal</h1>
			{#if totalkab[1]}
				<h1>{totalkab[1]}</h1>
			{/if}
		</div>
		<div
			class="flex justify-between items-center text-white font-medium h-6 bg-orange-400 rounded-full my-1 px-3"
		>
			<h1>simpati</h1>
			{#if totalkab[2]}
				<h1>{totalkab[2]}</h1>
			{/if}
		</div>
		<div
			class="flex justify-between items-center text-white font-medium h-6 bg-pink-400  rounded-full my-1 px-3"
		>
			<h1>memperhatikan</h1>
			{#if totalkab[3]}
				<h1>{totalkab[3]}</h1>
			{/if}
		</div>
		<div
			class="flex justify-between items-center text-white font-medium h-6  bg-lime-400  rounded-full my-1 px-3"
		>
			<h1>cuek</h1>
			{#if totalkab[4]}
				<h1>{totalkab[4]}</h1>
			{/if}
		</div>
		<div
			class="flex justify-between items-center text-white font-medium h-6 bg-fuchsia-600 rounded-full my-1 px-3"
		>
			<h1>benci</h1>
			{#if totalkab[5]}
				<h1>{totalkab[5]}</h1>
			{/if}
		</div>
	</div>
</div>
