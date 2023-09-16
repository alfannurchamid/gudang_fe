<script lang="ts">
	import { each, end_hydrating, onMount } from "svelte/internal";
	import { goto } from "$app/navigation";

	import Logo from "$lib/static/Logo.svg";
	import Loader from "$lib/components/Loader.svelte";
	import Banner from "$lib/static/images/Banner.jpg";
	import { SetCookie, GetCookie, logout } from "$lib/stores/cokies";

	import { user, updateUser } from "$lib/stores/userLogin";
	import { RefreshToken } from "$lib/stores/auth";

	let username: string;
	let password: string;
	const usrnameALERTA = () => {
		const usernameAlertDisplay = document.getElementById("usernameAlert");
		usernameAlertDisplay?.classList.remove("hidden");
		usernameAlertDisplay!.innerHTML = "nama pengguna harus di isi !";
		setTimeout(() => usernameAlertDisplay?.classList.add("hidden"), 900);
	};
	const lupaKataSandi = () => {
		if (username) {
			SetCookie("username", username, 10 * 60000);
			goto("/verifikasiLupaSandi");
		} else {
			usrnameALERTA();
		}
	};
	let accessKey: any = "";
	let refreshKey: any = "";

	const generateCompleteKey = () => {
		let deretKey = [
			1, 2, 3, 5, 1, 3, 2, 4, 5, 1, 1, 2, 3, 5, 1, 3, 2, 4, 5, 1, 1, 2, 3, 5, 1,
			3, 2, 4, 5, 1,
		];
		let lengkap = "";
		let lengkap1 = "";
		let bahan = GetCookie("refreshkey");
		if (bahan) {
			let bahan1 = String(bahan)!.slice(30, 60);
			lengkap1 = bahan1;
			for (let x = 0; x < bahan1.length; x++) {
				let h = bahan1.charCodeAt(x);

				let k = String.fromCharCode(h - deretKey[x]);
				lengkap = lengkap + k;
			}
			return lengkap;
		}
		return;
	};
	const falidate = async () => {
		accessKey = GetCookie("accesskey");
		refreshKey = GetCookie("refreshkey");
		if (refreshKey) {
			if (accessKey) {
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

				const content = await response.json();
				// console.log(content);
				// console.log(content.data);

				updateUser(content.data);
				SetCookie("id_user", content.data.id, 24 * 60 * 60000);
				SetCookie("access", content.data.access, 24 * 60 * 60000);

				console.log("masuk surveyer");
				if (content.data.access == 0) {
					SetCookie("username", username, 10 * 60000);
					goto(content.data.id + "/laporan_bc/laporan_mutasi");
					SetCookie("access", "0", 24 * 60 * 60000);
				} else {
					if (content.data.access <= 2) {
						goto("/" + content.data.id + "/admin/");
						SetCookie("access", "1", 24 * 60 * 60000);
					} else if (content.data.access >= 4) {
						goto(content.data.id + "/admin");
					}
				}
			} else {
				await RefreshToken(refreshKey);
				console.log(accessKey);
				await falidate();
			}
		} else {
			await logout();
		}
	};
	onMount(async () => {
		falidate();

		console.log(accessKey);
	});

	const submited = async () => {
		if (!username) {
			usrnameALERTA();
			return;
		}
		const getuser = await fetch("http://127.0.0.1:8000/api/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				username,
				password,
			}),
		});
		if (getuser.ok) {
			let user1 = await getuser.json();
			console.log(user1.data);
			const accessKey = user1.data.access_token;
			const expired_at = user1.data.expired_at;
			const refreshKey = user1.data.refresh_token;
			SetCookie("accesskey", accessKey, expired_at);
			SetCookie("refreshkey", refreshKey, 3600000 * 24);
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

			const content = await response.json();
			// console.log(content);
			// console.log(content.data);
			SetCookie("id_user", content.data.id, 24 * 60 * 60000);

			if (content.data.data_penduduk) {
				let des = content.data.data_penduduk.desa;
				console.log(des);
				let o = generateCompleteKey();
				console.log(o);
				if (o) {
					SetCookie("complete", o, 1666295239);
					SetCookie("id_desa", des, 1666295239);
				}
			}

			updateUser(content.data);
			SetCookie("access", content.data.access, 24 * 60 * 60000);

			if (content.data.access == 0) {
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
					const user = await response.json();
					const wa = user.data.noWa;
					SetCookie("nowa", wa, 10 * 60000);
				}
				SetCookie("access", "0", 24 * 60 * 60000);

				goto(content.data.id + "/laporan_bc/laporan_mutasi");
			} else {
				if (content.data.access <= 2) {
					SetCookie("access", "1", 24 * 60 * 60000);
					goto("/" + content.data.id + "/admin/");
				} else if (content.data.access >= 4) {
					goto(content.data.id + "/admin");
				}
			}
		} else {
			const errore = await getuser.json();
			const erore = errore.detail;

			console.log("aaaaaaaaaaaaaaaaaaaa ereoorr");
			console.log(erore);
			const targetHtml = document.getElementById("error");
			targetHtml?.classList.remove("hidden");
			setTimeout(() => {
				targetHtml?.classList.add("hidden");
			}, 5000);
			targetHtml!.innerHTML = erore;
		}
	};
</script>

<svelte:head>
	<title>Masuk Sistem Gudang</title>
</svelte:head>

<!-- {#each users as user}
	<p>{user.username}</p>
{/each} -->
<Loader />
<div class=" w-screen h-screen fixed -z-30 bg-banner" />
<div class=" mt-32 ml-28 w-6/12 fixed -z-20 flex justify-center items-center">
	<img src={Banner} alt="banner" class=" w-full" />
</div>
<div class="w-full px-145 md:p-0">
	<div class="banner flex flex-col mt-5 items-center">
		<img src={Logo} alt="logo" class="my-5 w-20" />

		<h1 class="text-center text-2xl text-white font-poppins font-light">
			Sistem Gudang Berikat Lestari Berkah Sae
		</h1>
	</div>

	<div class="w-full justify-end pr-20 flex md:flex-row flex-col">
		<div class="  md:w-3/12">
			<form class="b bg-gray-50 border border-slate-300 rounded-lg mt-5 p-4">
				<div class="flex justify-between">
					<label class=" text-sm" for="email">Nama Pengguna</label>
					<h3 id="usernameAlert" class="alert text-red-500 text-xs hidden">
						a
					</h3>
				</div>
				<input
					autocomplete="off"
					bind:value={username}
					class="inputB w-full"
					id="email"
					name="email"
					type="text"
				/>

				<div class="flex justify-between">
					<label class=" text-sm" for="email">Password</label>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<h3 on:click={lupaKataSandi} class=" text-xs link">
						Lupakata sandi?
					</h3>
				</div>
				<input
					bind:value={password}
					class="inputB w-full"
					id="password"
					name="password"
					type="password"
				/>

				<h1
					id="error"
					class="hidden text-center text-xs mx-1 font-semibold pb-2 text-red-500"
				>
					err
				</h1>
				<button
					class="w-full h-8 bg-green-600 text-white rounded-md"
					type="button"
					on:click={submited}>Masuk</button
				>
			</form>
			<div
				class="w-full bg-slate-200 p-4 md:text-sm h-14 justify-between flex border mt-5 rounded-lg"
			>
				Belum memiliki akun?
				<a href="/regist" class="link"> mendaftar.</a>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-banner {
		background-color: #0c2e4a;
	}
</style>
