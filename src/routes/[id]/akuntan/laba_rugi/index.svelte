<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { SetCookie } from "$lib/stores/cokies";
  import { generate_waktu } from "$lib/stores/waktu_generator";
  import { Nf } from "$lib/stores/formatNumber";
  import { fly, fade } from "svelte/transition";

  /**
   * @type {any[]}
   */
  let data = [];
  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { goto } from "$app/navigation";
  import { generate_waktu_str } from "$lib/stores/waktu_generator_str";
  currentPosisiBase(2);
  currentPosisi(1);

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  const errMessage = "maaf terjadi kesalahan";

  let mulai = "";
  let sampai = "";

  let pendapatan = 0;

  let list_hpp = [];
  let aktiva_tetap_list = [];
  let total_hpp = [];
  let aktiva_tetap_total = [];

  let oprasional_list = [];
  let list_hj_pj = [];

  let list_modal = [];

  let total_operasional = 0;
  let total_modal = 0;

  const today = new Date();

  let tanggal = "";
  let type = false;
  let bobo = JSON.stringify({
    type,
  });

  const pull = async () => {
    isSuccessVisible = true;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akuntansi/get_laba_rugi",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data = data1.data;
      console.log(data);
      pendapatan = data.pendapatan;
      list_hpp = data.hpp.datalist;
      total_hpp = data.hpp.total_hpp;

      oprasional_list = data.operasional.datalist;
      total_operasional = data.operasional.total_op;
      setTimeout(function () {
        isSuccessVisible = false;
      }, 300);
    } else {
      hasError = true;
    }
  };

  const cari = () => {
    bobo = JSON.stringify({
      mulai: mulai,
      ahir: sampai,
      type: true,
    });
    pull();
  };

  onMount(async () => {
    const ahir = generate_waktu_str(today);
    bobo = JSON.stringify({ type, ahir });
    pull();
  });

  const tambahBarang = () => {
    const seting = document.getElementById("pop_tambah_barang")?.classList;

    let clickUser = false;

    clickUser = !clickUser;
    if (clickUser) {
      seting?.remove("translate-y-full", "backdrop-blur-none", "bg-opacity-0");
      seting?.add("backdrop-blur-xl", "bg-opacity-5", "backdrop-brightness-75");
    } else {
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
    }
  };

  let id_pop = "";
  let nomor_pop = "";
  const expired_at = 3000000;

  const change_po = () => {
    SetCookie("id_po", id_pop, expired_at);
    SetCookie("nomor_po", nomor_pop, expired_at);
    goto("transaksi_in");
  };

  let is_cari = false;
</script>

<div class="   h-screen pt-20 md:p-16 pr-5">
  <div class="   h-full">
    <h1 class="  text-center text-lg text-gray-600">LABA RUGI</h1>
    <div class="flex justify-center">
      <h1 class="  text-center text-base text-gray-600 mx-5">Per</h1>
      {#if !is_cari}
        <h1 class="  text-center text-base text-gray-600">
          {generate_waktu(today)}
        </h1>
      {:else}
        <form
          on:submit|preventDefault={cari}
          class=" flex w-4/12 justify-center items-center"
        >
          <input
            bind:value={mulai}
            type="date"
            class="inputB mb-0"
            style="margin-bottom: 0;"
          />
          <h1 class=" text-2xl font-semibold">-</h1>
          <input
            bind:value={sampai}
            type="date"
            class="inputB mb-0"
            style="margin-bottom: 0;"
          />
          <button class="btn-success-small w-16 uppercase text-xl">
            cari
          </button>
        </form>
      {/if}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => (is_cari = !is_cari)}
        class="mx-5 bg-indigo-500 h-4 text-white rounded-full cursor-default hover:bg-indigo-400 w-10 flex justify-center uppercase text-xs"
      >
        {#if !is_cari}
          cari
        {:else}
          batal
        {/if}
      </div>
    </div>

    {#if hasError == true}
      <p class="error-alert w-full text-center justify-center">{errMessage}</p>
    {:else if isSuccessVisible}
      <p
        class="error-alert w-full text-center justify-center"
        transition:fade={{ duration: 150 }}
      >
        Loadingg..................
      </p>
    {:else}
      <div class=" ml-10 px-10 flex flex-col items-center">
        <div
          class=" rounded-xl mt-1 md:w-5/12 w-full grid grid-cols-2 border-green-200 border bg-green-300 gap-0"
        >
          <h5 class=" head2 w-60 text-left pl-8 uppercase">pendapatan</h5>
          <h5 class=" head2 text-right pr-10 uppercase">
            {Nf.format(pendapatan)}
          </h5>
        </div>
        {#if data}
          <div
            class="md:w-5/12 w-full rounded-xl p-1 pt-0 mt-2 border-2 border-slate-200"
          >
            <div
              class=" mt-2 rounded-xl grid grid-cols-2 border-green-200 border bg-green-300 w-full gap-0"
            >
              <h5 class=" head2 pl-5 uppercase">harga pokok penjualan</h5>
              <!-- svelte-ignore a11y-missing-content -->
              <h5 class=" head2 text-right pr-8 uppercase" />

              {#each list_hpp as dt_al}
                <h4 class=" rower text-left pl-16 capitalize">
                  {dt_al.nama_akun}
                </h4>
                <h4 class=" rower text-right pr-9 capitalize">
                  {Nf.format(dt_al.saldo)}
                </h4>
              {/each}

              <h5 class=" totaler text-center capitalize">
                total harga pokok penjualan
              </h5>
              <h5 class=" totaler text-right pr-9 capitalize">
                {Nf.format(total_hpp)}
              </h5>
            </div>

            <div
              class=" rounded-xl mt-3 grid grid-cols-2 border-yellow-200 border bg-yellow-200 w-full gap-0"
            >
              <h5 class=" head2 text-left pl-8 uppercase">laba kotor</h5>
              <h5 class=" head2 text-right pr-9 uppercase">
                {Nf.format(pendapatan - total_hpp)}
              </h5>
            </div>
          </div>
        {/if}

        <div
          class="md:w-5/12 w-full rounded-xl mt-4 p-1 pt-0 border-2 border-slate-200"
        >
          <div
            class=" rounded-xl mt-2 grid grid-cols-2 border-red-200 border bg-red-300 w-full gap-0"
          >
            <h5 class=" head2 text-center uppercase">beban operasional</h5>
            <!-- svelte-ignore a11y-missing-content -->
            <h5 class=" head2 text-center uppercase" />

            {#each oprasional_list as l_hu_jpd}
              <h4 class=" rower text-left pl-16 capitalize">
                {l_hu_jpd.nama_akun}
              </h4>
              <h4 class=" rower text-right pr-9 capitalize">
                {Nf.format(l_hu_jpd.saldo)}
              </h4>
            {/each}

            <h5 class=" totaler text-center capitalize">
              total biaya operasional
            </h5>
            <h5 class=" totaler text-right pr-9 capitalize">
              {Nf.format(total_operasional)}
            </h5>
          </div>

          <div
            class=" rounded-xl mt-3 grid grid-cols-2 border-yellow-200 border bg-pink-300 w-full gap-0"
          >
            <h5 class=" head2 w-60 text-left pl-8 uppercase">laba bersih</h5>
            <h5 class=" head2 text-right pr-9 uppercase">
              {Nf.format(pendapatan - total_hpp - total_operasional)}
            </h5>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .head2 {
    @apply text-base;
  }

  .rower {
    @apply text-xs bg-white;
  }

  .totaler {
    @apply bg-white bg-opacity-30 text-xs;
  }
</style>
