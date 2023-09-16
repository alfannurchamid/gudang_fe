<script>
  // @ts-nocheck

  import { fly, fade } from "svelte/transition";

  import { DelCookie, GetCookie } from "$lib/stores/cokies";
  import { onMount } from "svelte";
  import { cek_token } from "$lib/stores/cek_token";
  // @ts-ignore

  /**
   * @type {{ id_akun: string; nama_akun: string;  pos_akun_debit: string,saldo:number; }[]}
   */
  export let data;
  let accessKey = "";
  let refreshKey = "";

  let id_akun = "";
  let nama_akun = "";
  let pos_akun_debit = true;

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;

  onMount(async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
    pull_akun();
  });

  const errMessage = "maaf terjadi kesalahan";

  function reset_form() {
    document.getElementById("reseter")?.click();
  }

  const upload_akun = async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");

    let dat = {
      id_akun,
      nama_akun,
      pos_akun_debit,
    };

    let bobo = JSON.stringify(dat);

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akun/add_akun",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    if (response.ok) {
      isSuccessVisible = true;
      data.push({
        id_akun: id_akun,
        nama_akun: nama_akun,
        pos_akun_debit: Number(pos_akun_debit).toString(),
        saldo: 0,
      });

      console.log(data);

      data = data;

      reset_form();
      setTimeout(function () {
        isSuccessVisible = false;
      }, 400);
    } else {
      hasError = true;
    }
  };

  const close = () => {
    const seting = document.getElementById("pop_tambah_barang")?.classList;

    let clickUser = false;

    clickUser = !clickUser;

    seting?.remove(
      "backdrop-blur-xl",
      "bg-opacity-5",
      "backdrop-brightness-75"
    );
    seting?.add(
      "translate-y-full",
      "translate-y-full",
      "backdrop-blur-none",
      "bg-opacity-0"
    );
  };
</script>

<div
  id="pop_tambah_barang"
  class="w-full translate-y-full flex pt-14 justify-center top-12 left-0 right-0 z-50 fixed duration-300 bg-slate-700 backdrop-brightness-50 backdrop-blur-xl transition-all bg-opacity-5 h-full rounded-t-2xl"
>
  <div
    style="min-height: 55%;"
    class=" w-11/12 md:w-9/12 h-5/6 bg-white backdrop-blur-3xl bg-opacity-80 rounded-2xl flex flex-col"
  >
    <div
      class="w-full h-8 my-1 border-b-2 border-slate-100 flex items-center justify-between px-2"
    >
      <div class="bg-slate-200 text-slate-200">.</div>
      <h1 class="text-center text-xs font-semibold">Tambah Barang</h1>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          close();
        }}
        class=" btn-close"
      >
        X
      </div>
    </div>

    <div class="w-full text-center justify-center">
      {#if hasError == true}
        <p class="error-alert">{errMessage}</p>
      {:else if isSuccessVisible}
        <p class="error-alert" transition:fade={{ duration: 150 }}>
          Data updated successfully
        </p>
      {/if}
    </div>
    <div class="w-full md:flex-row flex-col flex p-5">
      <form class="submitted w-full" on:submit|preventDefault={upload_akun}>
        <div class=" md:flex-col flex-row w-full flex pr-4 items-center mr-4">
          <div class="flex w-10/12 flex-col">
            <div class=" flex flex-row w-full justify-start">
              <h5 class=" py-3 mr-10 text-gray-600">id_akun :</h5>
              <input
                bind:value={id_akun}
                type="text"
                class="inputB my-3 px-2 rounded-lg"
                required
              />
            </div>
            <div class=" flex flex-row w-full justify-start">
              <h5 class=" py-3 mr-10 text-gray-600">nama akun :</h5>
              <input
                bind:value={nama_akun}
                type="text"
                class="inputB my-3 px-2 uppercase w-9/12 rounded-lg"
                required
              />
            </div>

            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-10 text-gray-600">pos akun :</h5>
              <select
                bind:value={pos_akun_debit}
                class="inputB1 w-64 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                <option value={true} selected> debet</option>
                <option value={false}> kredit</option>
              </select>
            </div>

            <div class="flex w-full justify-end">
              <!-- <button type="submit" class=" ml-3 btn-success mt-5 ">simpan</button
            > -->
              <button
                class="mt-5 btn-success"
                on:click={() => (submitted = true)}>Continue</button
              >
              <button id="reseter" type="reset" class=" ml-3 btn-secondary mt-5"
                >reset</button
              >
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <button
                type="reset"
                on:click={() => {
                  close();
                }}
                class=" ml-3 btn-secondary mt-5"
              >
                batal
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="w-full flex justify-end p-5" />
  </div>
</div>

<style>
  .submitted input:invalid {
    border: 1px solid rgb(255, 130, 13);
  }

  .submitted input:focus:invalid {
    outline: 1px solid rgb(255, 130, 13);
  }
</style>
