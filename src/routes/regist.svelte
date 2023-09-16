<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ params, url }) => {
		let lang = url.searchParams.get("lang");
		return {
			props: {
				lang: lang,
			},
		};
	};
</script>

<script type="ts">
	import Logo from "$lib/static/images/logo.jpg";
	import Duaorang from "$lib/static/Duaorang.png";

	import { goto } from "$app/navigation";
	export let lang: string;
	let token = "Cv4dwbbWTUJAhOMRpzMabOtZ1eqmG0Sk49E1lJ3snBYc5aPUtDgXMqoLB3fCR";
	let value: string;

	let username: string;
	let full_name: string;
	let email: string;
	let password: string;
	let confirm_password: string;
	let access: number = 0;
	let jabatan: string = "";
	let passwordAlertDisplay = true;
	let noWaAlertDisplay = true;
	let usernameAlertDisplay = true;

	if (lang == token) {
		console.log(lang);

		console.log(token);
		console.log("admin");
		access = 3;
	}
	let alamat: string;
	let noWa: string;
	let profile: string;
	let kodeTugas: number;

	let noWalAlert = "";
	let usernameAlert = "";
	let passwordAlert = "";
	import { correct } from "$lib/stores/regist";
	import { SetCookie } from "$lib/stores/cokies";

	const addUser = async () => {
		try {
			const response = await fetch(
				"http://127.0.0.1:8000/api/api/v1/auth/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						accept: "application/json",
					},
					body: JSON.stringify({
						username,
						full_name,
						noWa,
						access,
						jabatan,
						alamat,
						password,
						confirm_password,
					}),
				}
			);
			if (response.ok) {
				alert("pendaftaran berhasil");
				SetCookie("nowa", noWa, 10 * 60000);

				goto("/");
			} else {
				let getRes = await response.json();
				if (getRes.detail[0].msg) {
					passwordAlert = getRes.detail[0].msg;
					passwordAlertDisplay = false;
					setTimeout(() => (passwordAlertDisplay = true), 3000);
				} else {
					if (
						getRes.detail ==
						"username sudah digunakan ,silahkan coba username lain"
					) {
						usernameAlert = getRes.detail;
						usernameAlertDisplay = false;
						setTimeout(() => (usernameAlertDisplay = true), 3000);
					} else {
						noWalAlert = getRes.detail;
						noWaAlertDisplay = false;
						setTimeout(() => (noWaAlertDisplay = true), 3000);
					}
				}
			}
		} catch (error) {
			console.log(error);
		}

		// console.log(username, email, password, access, alamat, noWa, profile, kodeTugas);
	};

	const cek = (id: Id) => {
		let tag: InputReg = {
			id: id,
			tag: value,
			alert: ["yang anda masukan bukan email", "email sudah terdaftar"],
		};
		correct(tag);
	};

	const validatePasswords = () => {
		goto("/login");
	};
	let show = false;
	const showpassword = () => {
		show = !show;
		const target = document.getElementById("password") as HTMLInputElement;
		const target2 = document.getElementById("confirm") as HTMLInputElement;

		if (show) {
			target!.type = "text";
			target2!.type = "text";
		} else {
			target!.type = "password";
			target2!.type = "password";
		}
	};
</script>

<!-- https://stackoverflow.com/questions/62698421/svelte-adding-a-class-to-a-div-doesnt-add-the-classes-css-to-div -->
<svelte:head>
	<title>regist admin Gudang</title>
</svelte:head>
<div class="body px-145 md:p-0">
	<div class="banner flex flex-col mt-5 items-center">
		<img src={Logo} alt="logo" class="my-5 w-12.5" />
		<h1 class="text-center text-2xl text-black font-poppins font-light">
			Daftar {#if lang && lang == token}
				Admin
			{:else}
				BC
			{/if}
		</h1>
	</div>

	<div class="w-full flex-col md:flex-row flex">
		<div class="md:w-2/3 w-full flex justify-center items-center">
			<img src={Duaorang} alt="logo" class="  md:w-3/12 w-2/6" />
		</div>
		<div
			class="md:w-1/4 -mt-20 flex bg-slate-50 border border-slate-300 flex-col my-4 rounded-md p-5"
		>
			<form class="flex flex-col text-gray-600 text-sm">
				<div class="flex justify-between">
					<label class=" mr-2" for="noWa">nomor whatsapp</label>
					<h3 class:noWaAlertDisplay class="alert">{noWalAlert}</h3>
				</div>
				<input
					placeholder="masukan nomor whatsapp aktif"
					autocomplete="off"
					bind:value={noWa}
					class="inputB"
					id="noWa"
					name="noWa"
					type="noWa"
				/>

				<div class="flex justify-between">
					<label class="  mr-2" for="namapengguna">Nama pengguna</label>
					<h3 class:usernameAlertDisplay class="alert">{usernameAlert}</h3>
				</div>
				<input
					placeholder="nama pengguna untuk login"
					autocomplete="off"
					bind:value={username}
					class="inputB hhhhhhhhhhhhhhhhhh lowercase"
					id="namapengguna"
					name="namapengguna"
					type="text"
				/>

				<div class="flex justify-between">
					<label class="  " for="full_name">Nama Lenglap</label>
				</div>
				<input
					placeholder="nama lengkap sesuai di ktp"
					autocomplete="off"
					bind:value={full_name}
					class="inputB hhhhhhhhhhhhhhhhhh"
					id="full_name"
					name="full_name"
					type="text"
				/>

				<div class="flex justify-between">
					<label class=" mr-2" for="noWa">jabatan</label>
				</div>
				<input
					placeholder=""
					autocomplete="off"
					bind:value={jabatan}
					class="inputB"
					id="jabatan"
					name="jabatan"
					type="noWa"
				/>

				<div class="flex justify-between">
					<label class="" for="password">Kata sandi</label>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<h1
						on:click={() => {
							showpassword();
						}}
						class="link text-center text-xs"
					>
						tampilkan
					</h1>
				</div>
				<input
					autocomplete="off"
					bind:value={password}
					class="inputB"
					id="password"
					name="password"
					type="password"
				/>

				<div class="flex justify-between">
					<label class="" for="confirm">Ulang Kata sandi</label>
					<h3 class:passwordAlertDisplay class="alert">{passwordAlert}</h3>
				</div>
				<input
					autocomplete="off"
					bind:value={confirm_password}
					class="inputB"
					type="password"
					id="confirm"
					name="confirm"
				/>

				<button
					class="w-full h-8 bg-green-600 text-white rounded-md"
					type="button"
					on:click={addUser}>Masuk</button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.alert {
		@apply text-red-500;
	}

	.passwordAlertDisplay {
		@apply hidden;
	}
	.noWaAlertDisplay {
		@apply hidden;
	}
	.usernameAlertDisplay {
		@apply hidden;
	}
</style>
