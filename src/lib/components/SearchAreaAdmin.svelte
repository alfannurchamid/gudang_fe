<script lang="ts">
	import { goto } from '$app/navigation';
	import areas from '$lib/data/areas';
	import {
		currentPosisi,
		currentAreas,
		posisi,
		areal,
		currentRws,
		rws
	} from '$lib/stores/posisiAndmin';

	export let dataDess: any;
	export let aream: areal[];

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

	function toTitleCase(str: string) {
		if (str !== '') {
			return str.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		} else {
			return '';
		}
	}

	let des: Desas[] = dataDess.desa;

	function expand(idTarget: string) {
		const target = document.getElementById(idTarget)?.style;
		target!.maxHeight = '690px';
		target!.height = 'auto';
	}
	function unexpand(idTarget: string) {
		const target = document.getElementById(idTarget)?.style;
		setTimeout(() => {
			target!.maxHeight = '0';
		}, 500);
	}

	let kecTampil = kecamatan;
	let desTampil: Desas[] = [];
	let rwTampil: string[] = [];
	let rtTampil: string[] = [];
	let KecChange: AreaSearch = {
		nama: '',
		id: null
	};
	let KecChangee: string = KecChange.nama;
	let DesChange: string | null = '';
	let deschangee: Desas = {
		namaDesa: null,
		idDes: null,
		idKec: null
	};
	let RwChange = '';
	let RtChange = '';
	let paramKec: string = '';
	const kecSearch = () => {
		kecTampil = kecamatan.filter((item) => item.nama.startsWith(KecChangee));
	};

	let sesi = 0;
	const desSearch = () => {
		console.log(DesChange);
		if (DesChange === null) {
			desTampil = des.filter((item) => item.namaDesa?.startsWith('') && item.idKec == KecChange.id);
		} else {
			let x = toTitleCase(DesChange);
			desTampil = des.filter((item) => item.namaDesa?.startsWith(x) && item.idKec == KecChange.id);
		}
		console.log(desTampil);
	};

	const kecChanges = (i: number) => {
		KecChangee = KecChange.nama;
		desTampil = des.filter((item: { idKec: number | null }) => item.idKec === i);
		deschangee.idDes = null;
		deschangee.idKec = null;
		deschangee.namaDesa = null;
		DesChange = deschangee.namaDesa;
		RwChange = '';
		rwTampil = [];
		RtChange = '';
		rtTampil = [];
	};

	const desChanges = (i: Desas) => {
		deschangee = i;
		if (deschangee.namaDesa !== null) {
			DesChange = deschangee.namaDesa;
		}
		let rww = aream.filter(
			(item: { desa: string; kec: string }) =>
				item.kec == String(KecChange.id) && item.desa == String(deschangee.idDes)
		);
		rwTampil = rww
			.map((item) => item.rw)
			.filter((value, index, self) => self.indexOf(value) === index);
		RwChange = '';
		RtChange = '';
		rtTampil = [];
	};

	const rwChanges = (rw: string) => {
		RwChange = rw;
		if (deschangee.namaDesa !== null) {
			DesChange = deschangee.namaDesa;
		}
		let rtt = aream.filter(
			(item: { rw: string; desa: string; kec: string }) =>
				item.kec == String(KecChange.id) &&
				item.desa == String(deschangee.idDes) &&
				item.rw == RwChange
		);
		console.log(rtt);
		rtTampil = rtt
			.map((item) => item.rt)
			.filter((value, index, self) => self.indexOf(value) === index);
		RtChange = '';
	};

	const cariSubmit = () => {
		console.log(KecChange.id);
		if (KecChange.id !== null) {
			if (deschangee && deschangee.idDes !== null) {
				if (RwChange !== '') {
					if (RtChange !== '') {
						addRiwayat(
							'nilai/' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange + '/' + RtChange
						);
						console.log('rwwwww ' + RwChange);
						// goto('' + KecChange.id + '/' + deschangee.idDes);
						switch ($posisi) {
							case 0:
								// alert('masokk' + RtChange);
								goto(
									'nilai/' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange + '/' + RtChange
								);
								break;
							case 1:
								goto('' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange + '/' + RtChange);
								// alert($posisi);
								break;
							case 2:
								goto(
									'../' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange + '/' + RtChange
								);
								// alert($posisi);
								break;
							case 3:
								goto(
									'../../' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange + '/' + RtChange
								);
								// alert($posisi);
								break;
							case 4:
								goto(
									'../../../' +
										KecChange.id +
										'/' +
										deschangee.idDes +
										'/' +
										RwChange +
										'/' +
										RtChange
								);
								// alert($posisi);
								break;
						}
					} else {
						console.log('rwwwww ' + RwChange);
						// goto('' + KecChange.id + '/' + deschangee.idDes);
						addRiwayat('nilai/' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);

						switch ($posisi) {
							case 0:
								goto('nilai/' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);
								break;

							case 1:
								goto('' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);
								// alert($posisi);
								break;
							case 2:
								goto('../' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);
								// alert($posisi);
								break;
							case 3:
								goto('../../' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);
								// alert($posisi);
								break;
							case 4:
								goto('../../../' + KecChange.id + '/' + deschangee.idDes + '/' + RwChange);
								// alert($posisi);
								break;
						}
					}
				} else {
					addRiwayat('nilai/' + KecChange.id + '/' + deschangee.idDes);
					console.log(KecChange.id);
					// goto('' + KecChange.id + '/' + deschangee.idDes);
					switch ($posisi) {
						case 0:
							goto('nilai/' + KecChange.id + '/' + deschangee.idDes);
							break;
						case 1:
							goto('' + KecChange.id + '/' + deschangee.idDes);
							// alert($posisi);
							break;
						case 2:
							goto('../' + KecChange.id + '/' + deschangee.idDes);
							// alert($posisi);
							break;
						case 3:
							goto('../../' + KecChange.id + '/' + deschangee.idDes);
							// alert($posisi);
							break;
						case 4:
							goto('../../../' + KecChange.id + '/' + deschangee.idDes);
							// alert($posisi);
							break;
					}
				}
			} else {
				console.log(KecChange.id);
				addRiwayat('nilai/' + KecChange.id);
				// goto('alfan%20nurchamid-009/');
				switch ($posisi) {
					case 0:
						goto('nilai/' + KecChange.id);
						break;
					case 1:
						goto('' + KecChange.id);
						// alert($posisi);
						break;
					case 2:
						goto('../' + KecChange.id);
						// alert($posisi);
						break;
					case 3:
						goto('../../' + KecChange.id);
						// alert($posisi);
						break;
					case 4:
						goto('../../../' + KecChange.id);
						// alert($posisi);
						break;
				}
				currentAreas(KecChange.nama, '', '', '');
			}
		}
	};
	let idAkun = '001';
	const addRiwayat = async (path: string) => {
		let waktu = new Date();
		const response = await fetch('/api/riwayat/001', {
			method: 'POST',
			headers: {
				'Context-Type': 'aplication/json'
			},
			body: JSON.stringify({
				idAkun,
				path,
				waktu
			})
		});
		if (response.ok) {
		}
		// console.log(username, email, password, kelas, alamat, noWa, profile, kodeTugas);
	};
</script>

<div class="flex z-20 static text-center w-full text-xs pt-2 justify-center   ">
	<div
		class="mx-2 cursor-default text-blue-500 items-center flex hover:text-blue-400"
		on:click={() => {
			goto('/admin/alfan%20nurchamid-009/nilai/');
		}}
	>
		kabupaten
	</div>

	<div class=" w-auto h-8 text-sm  flex justify-between items-center px-2  bg-slate-200 rounded-xl">
		<div class="grid grid-cols-4 gap-32   0">
			<!-- pilih kec -->
			<div style="margin-top: -2px ;" class="flex  static flex-col">
				.
				<div
					id="ddkec"
					style="max-height: 0;"
					class="w-32 absolute  z-10 overflow-hidden transition-all duration-300 bg-white rounded-l-lg"
				>
					<div
						class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-3"
					>
						<h4>...</h4>
					</div>
					{#each kecTampil as kec}
						<div
							on:click={() => {
								KecChange = kec;
								console.log(kecTampil);
								console.log(kec.id);
								kecChanges(kec.id);
							}}
							class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-4"
						>
							<h4>
								{kec.nama}
							</h4>
						</div>
					{/each}
				</div>
				<input
					autocomplete="off"
					id="kec"
					bind:value={KecChangee}
					on:keyup={() => {
						kecSearch();
					}}
					on:focus={() => expand('ddkec')}
					on:blur={() => unexpand('ddkec')}
					type="text"
					class="absolute  rounded-l-lg w-32 px-2 "
					placeholder="kecamatan"
					style="margin-top:1px ; z-index:10 ;"
				/>
			</div>
			<!-- pilih desa -->
			<div style="margin-top: -2px ;" class="flex  static flex-col">
				.
				<div
					id="dddesa"
					style="max-height: 0;"
					class="w-32 absolute z-10 overflow-hidden transition-all duration-300 bg-white "
				>
					<div
						class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-3"
					>
						<h4>...</h4>
					</div>
					{#each desTampil as desa}
						<div
							on:click={() => {
								desChanges(desa);
							}}
							class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-355"
						>
							<h4>
								{desa.namaDesa}
							</h4>
						</div>
					{/each}
				</div>
				<input
					autocomplete="off"
					id="des"
					bind:value={DesChange}
					on:keyup={() => {
						desSearch();
					}}
					on:focus={() => expand('dddesa')}
					on:blur={() => unexpand('dddesa')}
					type="text"
					class="absolute   w-32 px-2 "
					placeholder="desa"
					style="margin-top:1px ; z-index:10 ;"
				/>
			</div>
			<!-- pilih rw -->
			<div style="margin-top: -2px ;" class="flex  static flex-col">
				.
				<div
					id="ddRw"
					style="max-height: 0;"
					class="w-16 absolute z-10 overflow-hidden transition-all duration-300 bg-white "
				>
					<div
						class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-4"
					>
						<h4>...</h4>
					</div>
					{#each rwTampil as rwE}
						<!-- svelte-ignore missing-declaration -->
						<div
							on:click={() => {
								rwChanges(rwE);
								// RwChange = String(rwE);
								// kecChanges();
							}}
							class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-3"
						>
							<h4>
								{rwE}
							</h4>
						</div>
					{/each}
				</div>
				<input
					autocomplete="off"
					id="Rw"
					bind:value={RwChange}
					on:keyup={() => {
						// kecSearch();
					}}
					on:focus={() => expand('ddRw')}
					on:blur={() => unexpand('ddRw')}
					type="text"
					class="absolute   w-16 px-2 "
					placeholder="rw"
					style="margin-top:1px ; z-index:10 ;"
				/>
			</div>
			<!-- rtChange -->
			<div style="margin-top: -2px ;" class="flex -ml-16 static flex-col">
				.
				<div
					id="ddRt"
					style="max-height: 0;"
					class="w-16 absolute z-10 rounded-r-lg overflow-hidden transition-all duration-300 bg-white "
				>
					<div
						class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-4"
					>
						<h4>...</h4>
					</div>
					{#each rtTampil as rtE}
						<!-- svelte-ignore missing-declaration -->
						<div
							on:click={() => {
								RtChange = rtE;
								// RtChange = String(rtE);
								// kecChanges();
							}}
							class="w-full hover:bg-slate-200 cursor-default flex items-center justify-center h-4 py-4"
						>
							<h4>
								{rtE}
							</h4>
						</div>
					{/each}
				</div>
				<input
					autocomplete="off"
					id="Rt"
					bind:value={RtChange}
					on:keyup={() => {
						// kecSearch();
					}}
					on:focus={() => expand('ddRt')}
					on:blur={() => unexpand('ddRt')}
					type="text"
					class="absolute rounded-r-lg  w-16 px-2 "
					placeholder="rt"
					style="margin-top:1px ; z-index:10 ;"
				/>
			</div>
		</div>
		<div
			on:click={() => {
				cariSubmit();
			}}
			class="h-4 btn-success-small"
		>
			cari
		</div>
	</div>
</div>
