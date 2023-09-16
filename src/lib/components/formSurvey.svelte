<script lang="ts">
	import IconX from '$lib/components/iconX.svelte';

	const surveyFormClick1 = () => {
		const surveyForm = document.getElementById('formSurvey')?.classList;
		surveyForm?.add('translate-y-full');
	};
	const eliminasiSubmit = () => {
		const surveyEliminasi = document.getElementById('formEliminasi')?.classList;
		surveyEliminasi?.add('hidden');

		const formIndikasi = document.getElementById('formIndikasi')?.classList;
		formIndikasi?.remove('hidden');
	};

	const indikasiSubmit = () => {
		const surveyForm = document.getElementById('formEliminasi')?.classList;
		surveyForm?.add('translate-y-full');
	};
</script>

<div
	id="formSurvey"
	class="w-full  translate-y-full  p-2 top-12 left-0 right-0 z-10 fixed  backdrop-blur-sm duration-500 transition h-full bg-slate-200 bg-opacity-50 rounded-t-2xl "
>
	<div class="w-full flex justify-end ">
		<button
			class="btn-close grid items-center justify-items-center"
			on:click={() => {
				surveyFormClick1();
			}}
		>
			<IconX />
		</button>
	</div>

	<div class="px-8 py-32  h-full">
		<div class="py-2 flex bg-slate-100 rounded-xl text-sm w-full">
			<div class=" w-full">
				<h1 class=" text-base text-center font-semibold">k</h1>
				<div id="formIndikasi" class="hidden">
					<form class="  rounded-lg p-2">
						<h1 class="font-bold text-base mb-6 text-center text-slate-500">Indikasi</h1>
						<div class="form-check">
							<div class="flex  my-2 justify-center">
								<div class="btn-antipati">Antipati</div>
							</div>
							<div class="flex  my-2 justify-center">
								<div class="btn-cuek">cuek</div>
							</div>
							<div class="flex  my-2 justify-center">
								<div class="btn-memperhatikan">memperhatikan</div>
							</div>
							<div class="flex  my-2 justify-center">
								<div class="btn-simpati">simpati</div>
							</div>
							<div class="flex  my-2 justify-center">
								<div class="btn-loyal">loyal</div>
							</div>
							<div class="flex  my-2 justify-center">
								<div class=" btn-aktif">aktif</div>
							</div>
						</div>
						<div class="flex w-full justify-around">
							<button type="button" class="btn-success-small"> rekam </button>
						</div>
					</form>
				</div>

				<div id="formEliminasi" class="px-5 ">
					<form class="  rounded-lg p-2">
						<h1 class="font-bold text-base mb-6 text-center  text-slate-500">Eliminasi</h1>
						<div class="form-check">
							<div class="flex  my-2">
								<div class="form-check">
									<input
										class="form-check-input h-6 w-6 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="radio"
										name="flexRadioDefault"
										id="flexRadioDefault20"
									/>
								</div>
								<label class=" text-sm " for="email">Meninggal</label>
							</div>
							<div class="flex  my-2">
								<div class="form-check">
									<input
										class="form-check-input h-6 w-6 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="radio"
										name="flexRadioDefault"
										id="flexRadioDefault20"
									/>
								</div>
								<label class=" text-sm " for="email">Pns</label>
							</div>
							<div class="flex  my-2">
								<div class="form-check">
									<input
										class="form-check-input h-6 w-6 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="radio"
										name="flexRadioDefault"
										id="flexRadioDefault20"
									/>
								</div>
								<label class=" text-sm " for="email">Tni</label>
							</div>
							<div class="flex  my-2">
								<div class="form-check">
									<input
										class="form-check-input h-6 w-6 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="radio"
										name="flexRadioDefault"
										id="flexRadioDefault20"
									/>
								</div>
								<label class=" text-sm " for="email">Polri</label>
							</div>
							<div class="flex  my-2">
								<div class="form-check">
									<input
										class="form-check-input h-6 w-6 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="radio"
										name="flexRadioDefault"
										id="flexRadioDefault20"
									/>
								</div>
								<label class=" text-sm " for="email">pindah</label>
							</div>
						</div>
						<div class="flex w-full justify-around">
							<button class="btn-secondary-small" type="reset">reset</button>
							<button
								type="button"
								on:click={() => {
									eliminasiSubmit();
								}}
								class="btn-success-small"
							>
								lanjut
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
