<script lang="ts">
	import Logo from "$lib/static/images/logo.svg";
	import Tangan from "$lib/static/tanganHp.png";
	import { onMount } from "svelte";
	import { SetCookie, GetCookie, logout } from "$lib/stores/cokies";
	import { goto } from "$app/navigation";
	let notVerifi = true;
	let isError = true;
	let isMount = false;
	let kirimLagiOpen = true;
	let no_wa = "";
	let verifi_token: string;
	let datapost: any;
	let autofocuss = true;

	let username: string | null;

	onMount(async () => {
		username = GetCookie("username");
		if (username) {
			datapost = JSON.stringify({
				username,
			});
		} else {
			const no_wa = GetCookie("nowa");
			datapost = JSON.stringify({
				no_wa,
			});
		}
		const errTag = document.getElementById("errorTag");

		const verif = await fetch("http://127.0.0.1:8000/api/api/v1/auth/sendWa", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: datapost,
		});

		const data = await verif.json();
		if (verif.ok) {
			verifi_token = data.data.verifi_token;
			SetCookie("verifi_token", verifi_token, data.data.expired_at);

			setTimeout(() => {
				notVerifi = false;
				kirimLagiOpen = false;
				let no_wa = data.data.no_wa;
				if (!no_wa.startsWith("0")) {
					no_wa = "+" + no_wa;
				}
			}, 805);
		} else {
			setTimeout(() => (isError = false), 800);
			// alert(data.detail);
			errTag!.innerHTML = data.detail;
		}
		setTimeout(() => (isMount = true), 800);
		if (!datapost) {
			errTag!.innerHTML = datapost + "wahtu habis!";
			kirimLagiOpen = true;
		}

		if (document.readyState) {
			var timeleft = 120;
			const countd = document.getElementById("countdown");
			countd!.innerHTML = " sisa waktu " + timeleft + " menit";

			var downloadTimer = setInterval(function () {
				const verifi_tokenGet = GetCookie("verifi_token");
				if (timeleft <= 1 || !verifi_tokenGet) {
					clearInterval(downloadTimer);
					countd?.classList.add("text-red-500");
					countd!.innerHTML = "Waktu habis";

					// errTag!.innerHTML = 'wahtu habis!oo';
				} else {
					countd!.innerHTML = " sisa waktu " + timeleft + " detik";
				}
				timeleft -= 1;
			}, 1000);
		}
	});

	const submited = async (Value: string) => {
		const verification_kode = Value;
		const verif = await fetch(
			"http://127.0.0.1:8000/api/api/v1/auth/check_verifi",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
					Authorization: "Bearer " + verifi_token,
				},
				body: JSON.stringify({
					verification_kode,
				}),
			}
		);

		// console.log(data);
		if (verif.ok) {
			if (username) {
				const data = await verif.json();

				const accesskey = data.data.access_token;
				const expired_at = data.data.expired_at;

				SetCookie("accessKey", accesskey, expired_at);
				goto("/new_password");
			} else {
				alert("verifikasi berhasil ");
				logout();
			}
		} else {
			const data = await verif.json();

			const errTag = document.getElementById("errorTag");
			errTag!.innerHTML = data.detail;
			logout();
		}
	};

	const membesar = () => {
		const Input = document.getElementById("inputOTP") as HTMLInputElement;
		let panjang = Input.value.length;
		console.log(panjang);

		var trigger = Input.value;
		const regex = /[a-z]/;
		Input.value = trigger.replace(regex, "");

		if (panjang == 4) {
			// alert('cek');
			if (Input != null) {
				submited(Input.value);
				Input.disabled = true;
				Input.classList.add("text-gray-300");

				// Input.value = String(Input.value).slice(0, 3);
			}
		}
		Input?.classList.remove("text-xl");
		Input?.classList.add("text-5xl", "tracking-widest", "font-bold");
	};
</script>

<svelte:head>
	<title>BSPN PDI Perjuangan Verifikasi Kode</title>
</svelte:head>

<body class=" ">
	<div class="banner flex flex-col items-center p-10">
		<img src={Logo} alt="logo" class=" w-12.5" />
		<h1 class="text-center text-2xl text-black font-poppins font-light my-5">
			Verivikasi OTP
		</h1>
		<img src={Tangan} alt="logo" class=" w-60" />
	</div>

	<div class:notVerifi class=" flex flex-col items-center justify-center px-5">
		<div id="countdown" />

		<h4 class="text-black text-sm text-center">
			masukan 4 digit kode OTP<br /> yang kami kirim ke
			{#if no_wa}
				{no_wa}
			{/if}
		</h4>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			autocomplete="off"
			autofocus={autofocuss}
			on:keyup={membesar}
			class=" border-b-red-600 border-b-4 tracking-widest2 pl-2 h-20 my-2 w-40 text-xl placeholder-zinc-200"
			type="text"
			id="inputOTP"
			placeholder="masukan disini!"
		/>
	</div>
	<h1
		class="text-center flex w-full"
		on:click={() => {
			// veryf();
		}}
	>
		<div class:kirimLagiOpen class="flex w-full justify-center items-center">
			belum menerima email? <div
				class="link"
				on:click={() => {
					location.reload();
				}}
			>
				kirim lagi
			</div>
		</div>
	</h1>
	<div
		class:isMount
		class="pt-8 flex flex-col text-center items-center justify-center px-5"
	>
		<h1>sedang mengirim kode OTP</h1>
		mohon tunggu...
	</div>
	<div
		class:isError
		class="pt-8 flex flex-col text-center items-center justify-center px-5"
	>
		<h1 id="errorTag">x</h1>
		<div
			on:click={() => {
				logout();
				// goto('/');
			}}
			class="btn-danger-small mt-10"
		>
			kembali
		</div>
	</div>
</body>

<style>
	.notVerifi {
		@apply hidden;
	}

	.isMount {
		@apply hidden;
	}
	.kirimLagiOpen {
		@apply hidden;
	}
	.isError {
		@apply hidden;
	}
</style>
