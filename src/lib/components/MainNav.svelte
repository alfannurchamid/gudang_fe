<script lang="ts">
	// @ts-ignore
	import Iconsurv from "$lib/static/Iconsurv.svelte";
	import Icondata from "$lib/static/Icondata.svelte";
	import Files from "$lib/static/images/file-rounded.svelte";
	import DocIn from "$lib/static/images/doc-in.svelte";
	import DocOut from "$lib/static/images/doc-out.svelte";
	import SkilGerigiOtak from "$lib/static/images/skil-gerigi-otak.svelte";
	import FileWorld from "$lib/static/images/file-world.svelte";
	import FileEdit from "$lib/static/images/file-edit.svelte";
	import Money from "$lib/static/images/money.svelte";
	import Neraca from "$lib/static/images/neraca.svelte";
	import LabaRugi from "$lib/static/images/laba_rugi.svelte";
	import Book from "$lib/static/images/book.svelte";
	import Bell from "$lib/static/images/bell.svelte";
	import Akuns from "$lib/static/images/akuns.svelte";
	import { GetCookie } from "$lib/stores/cokies";
	import { user, updateUser } from "$lib/stores/userLogin";

	let hambarClicked = false;
	import {
		currentPosisi,
		currentPosisiBase,
		currentAreas,
		posisiBase,
		posisi,
		areal,
		currentRws,
		rws,
	} from "$lib/stores/posisiAndmin";
	import { goto } from "$app/navigation";
	import BarangSeting from "$lib/static/barang-seting.svelte";
	import PersonWorld from "$lib/static/images/person-world.svelte";
	import Customers from "$lib/static/images/customers.svelte";
	import { onMount } from "svelte";
	import JurnalUum from "$lib/static/images/jurnal_uum.svelte";
	let laporan_chacked = false;
	let super_admin = false;

	const hambarClick = () => {
		const LL = document.getElementById("LL")?.classList;
		const Nav = document.getElementById("nav")?.classList;
		const line1 = document.getElementById("L1")?.classList;
		const line2 = document.getElementById("L2")?.classList;
		const line3 = document.getElementById("L3")?.classList;

		if (hambarClicked) {
			Nav?.remove("w-48");
			Nav?.add("w-10");
			LL?.remove("justify-center");
			LL?.add("justify-between");
			line1?.remove("rotate-45");
			line2?.remove("hidden");
			line3?.remove("-rotate-45", "-translate-y-1");
		} else {
			Nav?.remove("w-10");
			Nav?.add("w-48");
			LL?.remove("justify-between");
			LL?.add("justify-center");
			line1?.add("rotate-45");
			line2?.add("hidden");
			line3?.add("-rotate-45", "-translate-y-1");
		}
		hambarClicked = !hambarClicked;
		setTimeout(() => {
			melebarButton = !melebarButton;
		}, 100);
	};
	let melebarButton = true;

	const buttonNavClick = (a: number) => {
		switch (a) {
			case 0:
				currentPosisiBase(0);
				switch ($posisi) {
					case 0:
						goto("admin/barang");
						break;
					case 1:
						goto("../admin/barang");
						// alert($posisi);
						break;
				}
				break;
			case 1:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/setting_doc");
						break;
					case 1:
						goto("../admin/setting_doc");
						// alert($posisi);
						break;
				}
				break;

			case 2:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/suplier");
						break;
					case 1:
						goto("../admin/suplier");
						// alert($posisi);
						break;
				}

				break;

			case 3:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/customer");
						break;
					case 1:
						goto("../admin/customer");
						// alert($posisi);
						break;
				}
				break;

			case 4:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/po");
						break;
					case 1:
						goto("../admin/po");
						// alert($posisi);
						break;
				}

				break;
			case 5:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/transaksi_in");
						break;
					case 1:
						goto("../admin/transaksi_in");
						// alert($posisi);
						break;
				}

				break;
			case 6:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/transaksi_out");
						break;
					case 1:
						goto("../admin/transaksi_out");
						// alert($posisi);
						break;
				}

				break;
			case 9:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/pemberitahuan");
						break;
					case 1:
						goto("../admin/pemberitahuan");
						// alert($posisi);
						break;
				}

				break;
			case 10:
				currentPosisiBase(0);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("admin/userlog");
						break;
					case 1:
						goto("../admin/userlog");
						// alert($posisi);
						break;
				}

				break;

			// laporann

			case 7:
				currentPosisiBase(1);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("laporan_bc/laporan_posisi");
						break;
					case 1:
						goto("../laporan_bc/laporan_posisi");
						// alert($posisi);
						break;
				}
				break;

			case 8:
				currentPosisiBase(1);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("laporan_bc/laporan_mutasi");
						break;
					case 1:
						goto("../laporan_bc/laporan_mutasi");
						// alert($posisi);
						break;
				}
				break;

			case 11:
				currentPosisiBase(2);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("akuntan/neraca");
						break;
					case 1:
						goto("../akuntan/neraca");
						// alert($posisi);
						break;
				}
				break;
			case 12:
				currentPosisiBase(2);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("akuntan/laba_rugi");
						break;
					case 1:
						goto("../akuntan/laba_rugi");
						// alert($posisi);
						break;
				}
				break;

			case 13:
				currentPosisiBase(2);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("akuntan/buku_besar");
						break;
					case 1:
						goto("../akuntan/buku_besar");
						// alert($posisi);
						break;
				}
				break;

			case 14:
				currentPosisiBase(2);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("akuntan/jurnal_umum");
						break;
					case 1:
						goto("../akuntan/jurnal_umum");
						// alert($posisi);
						break;
				}
				break;

			case 15:
				currentPosisiBase(2);
				// console.log('yeee' + $posisi);
				switch ($posisi) {
					case 0:
						goto("akuntan/akun");
						break;
					case 1:
						goto("../akuntan/akun");
						// alert($posisi);
						break;
				}
				break;
		}
	};
	let BC = false;
	let akuntan_check = false;
	let akses = "1";

	onMount(async () => {
		let aaccess = GetCookie("access");
		// if (document.readyState && $user && $user.access) {
		// 	aaccess = $user.access.toString();
		// }
		if (aaccess == "0") {
			akses = aaccess;
			laporan_chacked = true;
			BC = true;
		} else if (aaccess == "5") {
			akses = aaccess;

			super_admin = true;
		}
	});

	const panel = (i: number) => {
		switch (i) {
			case 0:
				akuntan_check = false;
				laporan_chacked = false;
				break;
			case 1:
				akuntan_check = true;
				laporan_chacked = false;
				break;
			case 2:
				akuntan_check = false;
				laporan_chacked = true;
				break;
		}
	};
</script>

<div
	id="nav"
	class="fixed  text-xs w-10 bg-sky-800 backdrop-brightness-90 shadow-lg   bg-opacity-25  backdrop-blur-sm  pt-24 px-1 h-full transition-all duration-300"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => {
			hambarClick();
		}}
		class="w-full h-8 rounded-xl grid items-center  justify-items-end px-1"
	>
		<div id="LL" class="w-6 h-6 flex flex-col justify-between">
			<div
				id="L1"
				class="w-full h-1 rounded-full delay-200 transition-all  duration-500
   bg-white "
			/>
			<div
				id="L2"
				class="w-full h-1 rounded-full delay-200 transition-all duration-500
 bg-white "
			/>

			<div
				id="L3"
				class="w-full h-1 rounded-full delay-200 transition-all duration-500
 bg-white "
			/>
		</div>
	</div>
	{#if laporan_chacked || $posisiBase == 1}
		<div
			class=" grid grid-cols-1 gap-2 items-center  mt-4 justify-items-center"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(7);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Files />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">
						laporan posisi barang per dokumen pabean
					</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(8);
				}}
				class="w-full h-8 mt-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Files />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">
						laporan pertanggungjawaban mutasi barang
					</h1>
				</div>
			</div>
		</div>
	{:else if akuntan_check || $posisiBase == 2}
		<div
			class=" grid grid-cols-1 gap-2 items-center  mt-4 justify-items-center"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(11);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Neraca />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">neraca</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(12);
				}}
				class="w-full h-8 mt-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<LabaRugi />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">laba rugi</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(13);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Book />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">buku besar</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(14);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<JurnalUum />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">jurnal umum</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(15);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Akuns />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">Akun</h1>
				</div>
			</div>
		</div>
	{:else}
		<div
			class=" grid grid-cols-1 gap-2 items-center  mt-4 justify-items-center"
		>
			{#if super_admin}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => {
						buttonNavClick(9);
					}}
					class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
				>
					<Bell />
					<div
						class:melebarButton
						class="flex items-center ml-2 font-medium text-white"
					>
						<h1 class=" cursor-default">pemberitahuan</h1>
					</div>
				</div>
			{/if}

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(4);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<FileWorld />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">purchase order</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(1);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<FileEdit />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">kelola dokumen</h1>
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(5);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<DocIn />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">pemasukan</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(6);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<DocOut />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">pengeluaran</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(10);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<SkilGerigiOtak />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">user log</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(0);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<BarangSeting />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">barang</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(2);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<PersonWorld />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">suplier</h1>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					buttonNavClick(3);
				}}
				class="w-full h-8 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
			>
				<Customers />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">customer</h1>
				</div>
			</div>
		</div>
	{/if}
</div>
<div
	id="nav1"
	class="fixed  rounded-br-lg flex text-xs z-30 bg-sky-800 shadow-lg  bg-opacity-50 backdrop-blur pt-10 px-3 h-20 transition-all duration-300"
>
	{#if !BC}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => {
				panel(0);
				currentPosisiBase(0);
			}}
			class="w-full h-8 rounded-lg flex-col transition-all duration-200 hover:-translate-y-0.5  flex  px-1 items-center"
		>
			<PersonWorld />
			<div
				class:melebarButton
				class="flex items-center ml-2 font-medium text-white"
			>
				<h1 class=" cursor-default">admin</h1>
			</div>
		</div>
		{#if super_admin}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					panel(1);
					currentPosisiBase(2);
				}}
				class="w-full h-8 mr-2 rounded-lg flex-col transition-all duration-200 hover:-translate-y-0.5  flex   items-center"
			>
				<Money />
				<div
					class:melebarButton
					class="flex items-center ml-2 font-medium text-white"
				>
					<h1 class=" cursor-default">keuangan</h1>
				</div>
			</div>
		{/if}
	{/if}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => {
			panel(2);
		}}
		class="w-full h-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5  flex flex-col mt-2  px-1 items-center"
	>
		<Files />
		<div class:melebarButton class="flex items-center font-medium text-white">
			<h1 class=" cursor-default">laporan</h1>
		</div>
	</div>
</div>

<style>
	.melebarButton {
		@apply hidden;
	}
</style>
