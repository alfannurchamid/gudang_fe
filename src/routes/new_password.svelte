<script lang="ts">
	import { goto } from "$app/navigation";
	import { GetCookie } from "$lib/stores/cokies";
	import Logo from "$lib/static/images/logo.svg";
	import { onMount } from "svelte";
	let password = "";
	let confirm_password = "";
	let passwordAlert = "";
	let accessKey;

	const submit = async () => {
		accessKey = GetCookie("accessKey");
		const dataPost = JSON.stringify({
			password,
			confirm_password,
		});
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

		if (response.ok) {
			goto("/");
		} else {
			let getRes = await response.json();
			if (getRes.detail) {
				passwordAlert = getRes.detail;
			}
		}
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
	onMount(() => {
		// if (document.readyState) {
		// 	var timeleft = 10;
		// 	const countd = document.getElementById('countdown');
		// 	var downloadTimer = setInterval(function () {
		// 		if (timeleft <= 0) {
		// 			clearInterval(downloadTimer);
		// 			countd!.innerHTML = 'waktuhabis';
		// 		} else {
		// 			countd!.innerHTML = timeleft + ' sisa waktu detik';
		// 		}
		// 		timeleft -= 1;
		// 	}, 1000);
		// }
	});
</script>

<div class="w-full h-screen flex items-center flex-col bg-white">
	<div class="banner flex flex-col items-center pt-10">
		<img src={Logo} alt="logo" class=" w-12.5" />
		<h1 class="text-center text-2xl text-black font-poppins font-light mt-5">
			Verivikasi OTP
		</h1>
	</div>
	<div
		class="lg:w-1/2 w-5/6 flex justify-center flex-col border border-collapse rounded-xl bg-slate-50 my-5 px-10 py-10 lg:px-24"
	>
		<h1 class="mb-8 text-center uppercase font-semibold">ubah kataSandi</h1>
		<div id="countdown" />

		<div>
			<div class="flex justify-between">
				<label class="" for="password">Kata sandi</label>
				<h1
					on:click={() => {
						showpassword();
					}}
					class="link text-center"
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

			<div class="flex flex-col justify-between">
				<label class="" for="confirm">Ulang Kata sandi</label>
				<h3 class="alert">{passwordAlert}</h3>
			</div>
			<input
				autocomplete="off"
				bind:value={confirm_password}
				class="inputB"
				type="password"
				id="confirm"
				name="confirm"
			/>

			<div class=" w-full justify-end flex">
				<div
					on:click={() => {
						submit();
					}}
					class="btn-primary uppercase"
				>
					simpan
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.alert {
		@apply text-red-500;
	}
</style>
