<script lang="ts">
	export let pg: any;
</script>

<div
	class="w-full py-3 hover:bg-gray-50 transition-all duration-100 border-b cursor-default backdrop-blur bg-opacity-20 flex justify-around items-center"
>
	<div
		class="w-10 h-10 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center"
	>
		{#if pg.path_foto != ""}
			<!-- <h1 class="text-xxs">{pg.path_foto}</h1> -->
			<img
				src="http://127.0.0.1:8000/api/api/v1/auth/poto_profile?file={pg.path_foto}"
				alt="profile"
			/>
		{:else}
			<h1 class="text-slate-100 text-3xl font-semibold uppercase">
				{pg.full_name[0]}
			</h1>
		{/if}
	</div>
	<div class="flex flex-col justify-between w-10/12 h-full p-1">
		<div class="flex w-full justify-between">
			<h1 class=" font-semibold">{pg.full_name}</h1>
			<h1 class=" text-xxs">{pg.tanggal_daftar.substr(0, 10)}</h1>
		</div>
		<div>
			<h1 class="  text-xs text-slate-600">
				{pg.alamat}
			</h1>
		</div>
	</div>
</div>
