<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ params, fetch }) => {
		const dataDes = await fetch('/api/datades/all');

		if (dataDes.ok) {
			// console.log(area);
			return {
				props: {
					dataDess: await dataDes.json()
				}
			};
		}
		return {
			props: {
				dataDess: 'gagal'
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { posisi } from '$lib/stores/posisiAndmin';
	export let dataDess;
	// console.log(riwayats);
	let des: Desas[];

	async function getRiw() {
		const riwayat = await fetch('/api/riwayat/001');
		const riwa = await riwayat.json();

		if (riwayat.ok) {
			return riwa.riwayats;
		} else {
			throw new Error(riwa);
		}
		// console.log(riwa.riwayats);
	}

	let desa = dataDess;
	let riwayatss = getRiw();

	// console.log(riwayatss);
	const kecamatan = [
		{ nama: 'wadaslintang', id: 1 },
		{ nama: 'kepil', id: 2 },
		{ nama: 'sapuran', id: 3 },
		{ nama: 'kaliwiro', id: 4 },
		{ nama: 'leksono', id: 5 },
		{ nama: 'selomerto', id: 6 },
		{ nama: 'kalikajar', id: 7 },
		{ nama: 'kertek', id: 8 },
		{ nama: 'wonosobo', id: 9 },
		{ nama: 'watumalang', id: 10 },
		{ nama: 'mojotengah', id: 11 },
		{ nama: 'garung', id: 12 },
		{ nama: 'kejajar', id: 13 },
		{ nama: 'sukoharjo', id: 14 },
		{ nama: 'kalibawang', id: 15 }
	];
	const getNamaDesa = (x: string) => {
		let d: string | null;
		if (x) {
			// d = a[0].namaDesa;
		}

		const r = des;
		const a = r.filter((item) => item.idDes == Number(x));
		d = x;
		console.log(a[0].namaDesa);
		return a[0].namaDesa;
	};

	const getNamaArea = (x: string) => {
		const pat = x.split('/');
		const r = pat.length;
		let patop = '';
		for (let d in pat) {
			let g: null | string = '';
			switch (d) {
				case '1':
					let k = kecamatan.filter((item) => item.id == Number(pat[1]));
					g = String(k[0].nama);
					break;
				case '2':
					let h: string = pat[d];
					if (g !== undefined) {
						g = getNamaDesa(h);
					}
					break;
				case '3':
					g = pat[d];
					break;
				case '4':
					g = '/ ' + pat[d];
					break;
			}
			patop = patop + ' ' + g;
		}
		return patop;
	};

	const perkalianBack = (y: Number) => {
		let hasil = '';
		for (let i = 0; i < y; i++) {
			hasil = hasil + '../';
		}
		return hasil;
	};
</script>

<div
	class="w-1/3 h-full text-xs p-1 flex flex-col justify-between font-semibold  bg-slate-300 bg-opacity-50 backdrop-blur  rounded-xl"
>
	<h6>riwayat pencarian</h6>
	<div class="h-full  w-full mt-1 overflow-y-scroll">
		{#await riwayatss}
			<p>...menunggu</p>
		{:then riwww}
			{#await desa}
				<p>....menunggu desa</p>
			{:then deso}
				{#each riwww as riw}
					<div
						on:click={() => {
							let back = perkalianBack($posisi);
							console.log(back + riw.path);
							goto(back + riw.path);
						}}
						class="w-full bg-gray-100 my-2 h-6 flex items-center justify-center text-xxs hover:bg-slate-50 cursor-default"
					>
						<h4>
							{getNamaArea(riw.path)}
						</h4>
					</div>
				{/each}
			{/await}
		{/await}
	</div>
</div>

<style>
	/* width */
	::-webkit-scrollbar {
		width: 2px;
		height: 2px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: rgb(136, 136, 136);
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: rgb(236, 100, 100);
	}
</style>
