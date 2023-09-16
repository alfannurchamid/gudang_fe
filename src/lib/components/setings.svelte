<script lang="ts">
	import { goto } from "$app/navigation";
	import { DelCookie, GetCookie } from "$lib/stores/cokies";
	import { user, updateUser, lengkap } from "$lib/stores/userLogin";
	import { RefreshToken } from "$lib/stores/auth";
	import gembok from "$lib/components/gembok.svelte";
	import Gembok from "$lib/components/gembok.svelte";

	import { onMount } from "svelte";
	import { getDes } from "$lib/stores/trackingArea";

	let adaProfile = false;
	let errEmail = true;
	if ($user?.path_foto !== "NULL") {
		adaProfile = true;
	}
	let buka = true;
	const ubah = (t: string) => {
		const target = document.getElementById("formUbah" + t)?.classList;
		const target1 = document.getElementById("LinkUbah" + t)?.classList;
		const target2 = document.getElementById("btnBatal" + t)?.classList;
		if (buka) {
			target?.remove("hidden");
			target1?.add("hidden");
			target2?.remove("hidden");
			target?.add("flex");
		} else {
			target?.remove("flex");
			target?.add("hidden");
			target1?.remove("hidden");
			target2?.add("hidden");
		}
	};

	let userfront = $user;
	let email = "";
	let noWa = "";
	let password = "";
	let confirm_password = "";
	let path_foto = "";
	let nik = "";
	let adaAccToken = true;

	let filevar: any;
	const logout = () => {
		DelCookie("accesskey");
		DelCookie("refreshkey");
		DelCookie("complete");
		goto("/");
	};

	let accessKey: string | null = "";
	let refreshKey: string | null = "";

	let kecamatan = "";
	onMount(async () => {
		let des = "";

		const dataDes1 = await fetch("/api/datades/des-" + des);
		const dataDes = await dataDes1.json();
	});
	onMount(async () => {
		accessKey = GetCookie("accesskey");
		refreshKey = GetCookie("refreshkey");

		// 	// console.log(accessKey);

		// 	const response = await fetch('http://127.0.0.1:8000/api/api/v1/auth/profile', {
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer ' + accessKey
		// 		},
		// 		credentials: 'include'
		// 	});

		// 	const content = await response.json();
		// 	// console.log(content);
		// 	// console.log(content.data);

		// 	updateUser(content.data);
	});

	let updareEroor = false;
	const upadateProfile = async (target: string) => {
		let dataPost: string = "";
		switch (target) {
			case "email":
				dataPost = JSON.stringify({
					email,
				});
				break;
			case "noWa":
				dataPost = JSON.stringify({
					noWa,
				});
				break;
			case "password":
				dataPost = JSON.stringify({
					password,
					confirm_password,
				});
				break;
			case "path_foto":
				dataPost = JSON.stringify({
					path_foto,
				});
				break;
			case "nik":
				dataPost = JSON.stringify({
					nik,
				});
				break;
		}

		accessKey = GetCookie("accesskey");
		refreshKey = GetCookie("refreshkey");
		if (!accessKey) {
			await RefreshToken(refreshKey);
			accessKey = GetCookie("accesskey");
		}
		const response = await fetch(
			"http://127.0.0.1:8000/api/api/v1/auth/profile",
			{
				method: "PUT",
				headers: {
					accept: "*/*",
					"Content-Type": "application/json",
					Authorization: "Bearer " + accessKey,
				},
				body: dataPost,
				credentials: "include",
			}
		);

		if (response.ok && userfront) {
			switch (target) {
				case "email":
					userfront.email = email;
					break;
				case "noWa":
					userfront.noWa = noWa;
					break;
				case "path_foto":
					userfront.path_foto = path_foto;
					break;
				case "nik":
					userfront.nik = nik;

					accessKey = GetCookie("accesskey");
					refreshKey = GetCookie("refreshkey");
					if (!accessKey) {
						await RefreshToken(refreshKey);
						accessKey = GetCookie("accesskey");
					}
					const updater = async () => {
						const response = await fetch(
							"http://127.0.0.1:8000/api/api/v1/auth/profile",
							{
								headers: {
									"Content-Type": "application/json",
									Authorization: "Bearer " + accessKey,
								},
								credentials: "include",
							}
						);
						if (response.ok) {
							const content = await response.json();
							console.log(content.data, "conten.data nya ini bossssss");
							updateUser(content.data);
							$lengkap = true;
						}
					};
					updater();

					break;
			}
			buka = false;
			ubah(target);
			console.log(userfront);
			updateUser(userfront);
		} else {
			if (refreshKey && adaAccToken) {
				if (accessKey === null) {
					console.log("undefided access keyyyyy", accessKey);
					RefreshToken(refreshKey);
					upadateProfile(target);
					adaAccToken = false;
				} else {
					// console.log(await response.json());
				}
			} else {
				logout();
			}
			const errore = await response.json();
			const erore = errore.detail;
			console.log(erore);
			const targetHtml = document.getElementById("error" + target);
			targetHtml?.classList.remove("hidden");
			setTimeout(() => {
				targetHtml?.classList.add("hidden");
			}, 5000);
			targetHtml!.innerHTML = erore;
		}
	};

	const uploadImage = async () => {
		let data = new FormData();
		var input = document.querySelector("#pp") as HTMLFormElement;
		const file = input!.files[0];
		console.log(file.size);
		if (file.size < 1000000) {
			data.append("file", file, $user?.username);

			const request = new XMLHttpRequest();
			request.open("POST", "http://127.0.0.1:8000/api/api/v1/auth/upload_pp");
			request.send(data);
			request.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					const obj = JSON.parse(this.responseText);
					console.log(obj.data.file_name);
					path_foto = obj.data.file_name;
					upadateProfile("path_foto");
					adaProfile = true;
				}
			};
		} else {
			const targetHtml = document.getElementById("erroruppp");
			targetHtml?.classList.remove("hidden");
			setTimeout(() => {
				targetHtml?.classList.add("hidden");
			}, 5000);
			targetHtml!.innerHTML = "ukuran foto terlalu besar !<br> maksimal 1 MB";
		}
	};
</script>

<div
	id="pengaturan"
	class="w-full translate-y-full flex pt-24 justify-center top-12 left-0 right-0 z-50 fixed duration-300 bg-slate-700 backdrop-blur-xl transition-all bg-opacity-5 h-full rounded-t-2xl"
>
	<div
		style="min-height: 55%;"
		class=" w-11/12 md:w-7/12 h-5/6 bg-white backdrop-blur-3xl bg-opacity-80 rounded-2xl flex flex-col"
	>
		<div
			class="w-full h-8 my-1 border-b-2 border-slate-100 flex items-center justify-center"
		>
			<h1 class="text-center text-xs font-semibold">kelola akun</h1>
		</div>

		<div class="w-full md:flex-row flex-col flex p-5">
			<div
				class=" md:flex-col flex-row flex md:border-r-2 border-slate-100 pr-4 items-center mr-4"
			>
				<div
					class="w-16 h-16 flex items-center justify-center mb-2 overflow-hidden rounded-full bg-slate-300"
				>
					{#if $user?.path_foto && $user?.path_foto !== "NULL"}
						<img
							src="http://127.0.0.1:8000/api/api/v1/auth/poto_profile?file={$user?.path_foto}"
							alt="profile"
						/>
					{:else}
						<h1 class="text-slate-200 text-3xl font-semibold">
							{$user?.full_name[0]}
						</h1>
					{/if}
				</div>
				<div class="md:ml-0 ml-10">
					<h1
						id="erroruppp"
						class="hidden text-xxs font-semibold text-center text-red-500"
					>
						jj
					</h1>
					<label for="pp">
						<h1 class="text-xs link text-center font-semibold">ubah foto</h1>
					</label>

					<input
						accept="image/jpg, image/jpeg"
						on:change={() => {
							uploadImage();
						}}
						bind:files={filevar}
						class="hidden"
						type="file"
						id="pp"
					/>
				</div>
			</div>
			<div class="text-slate-700 text-xs font-medium">
				<h1 class="font-semibold text-lg capitalize">{$user?.full_name}</h1>
				<h1 class="my-3">{$user?.alamat}</h1>
				<div class="flex items-center justify-between">
					{#if $user.email && $user.email !== "NULL"}
						<h1 class="my-3">{$user?.email}</h1>
					{:else}
						<h1 class="my-3">anda belum mengunggah email</h1>
					{/if}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<h1
						on:click={() => {
							buka = true;
							ubah("email");
						}}
						class="link ml-5"
						id="LinkUbahemail"
					>
						ubah email
					</h1>

					<div class="hidden" id="btnBatalemail">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								buka = false;
								ubah("email");
							}}
							class="btn-secondary-small"
						>
							batal
						</div>
					</div>
				</div>

				<h1 id="erroremail" class="hidden text-xxs font-semibold text-red-500">
					jj
				</h1>
				<div
					id="formUbahemail"
					class=" hidden justify-between items-center mb-4"
				>
					<input bind:value={email} type="text" class="inputC" />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={() => {
							upadateProfile("email");
						}}
						class="btn-success-small"
					>
						<h1>simpan</h1>
					</div>
				</div>

				<h1 id="errornoWa" class="hidden text-xxs font-semibold text-red-500">
					err ubah wa
				</h1>
				<div class="flex items-center justify-between">
					<h1 class="my-3">{$user?.noWa}</h1>

					<h1
						id="LinkUbahnoWa"
						on:click={() => {
							buka = true;
							ubah("noWa");
						}}
						class="link ml-5"
					>
						ubah no wa
					</h1>

					<div class="hidden" id="btnBatalnoWa">
						<div
							on:click={() => {
								buka = false;
								ubah("noWa");
							}}
							class="btn-secondary-small"
						>
							batal
						</div>
					</div>
				</div>
				<div id="formUbahnoWa" class="hidden justify-between items-center mb-4">
					<input bind:value={noWa} type="text" class="inputC" />
					<div class="btn-success-small">
						<h1
							on:click={() => {
								upadateProfile("noWa");
							}}
						>
							simpan
						</h1>
					</div>
				</div>

				<div class="w-full my-3 flex justify-between items-center">
					<Gembok />
					<h1
						id="errorpassword"
						class="hidden text-xxs mx-1 font-semibold text-red-500"
					>
						ulangi password dengan benar!
					</h1>
					<h1
						id="LinkUbahpassword"
						on:click={() => {
							buka = true;
							ubah("password");
						}}
						class="text-xs link text-center font-semibold"
					>
						ubah sandi
					</h1>
					<div class="hidden" id="btnBatalpassword">
						<div
							on:click={() => {
								buka = false;
								ubah("password");
							}}
							class="btn-secondary-small"
						>
							batal
						</div>
					</div>
				</div>
				<div
					id="formUbahpassword"
					class="bg-gray-100 w-full hidden p-1 rounded-lg"
				>
					<div class="w-full flex flex-col h-full">
						<input
							bind:value={password}
							type="text"
							class="inputC"
							placeholder="masukan kata sandi baru"
						/>

						<input
							bind:value={confirm_password}
							type="text"
							class="mt-1 inputC"
							placeholder="ulangi kata sandi baru"
						/>
						<div class="w-full flex mt-1 justify-end">
							<div class="btn-success-small">
								<h1
									on:click={() => {
										upadateProfile("password");
									}}
								>
									simpan
								</h1>
							</div>
						</div>
					</div>
				</div>
				<h1 class="mt-7 text-gray-500">
					mendaftar pada: {$user?.tanggal_daftar}
				</h1>
			</div>
			<div class=" w-80 ml-5 text-xs px-5 border-l-2 border-slate-300" />
		</div>

		<div class="w-full flex justify-end p-5">
			<div
				on:click={() => {
					logout();
				}}
				class="btn-secondary"
			>
				<h1>logout</h1>
			</div>
		</div>
	</div>
</div>
