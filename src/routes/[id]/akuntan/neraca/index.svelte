<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { SetCookie } from "$lib/stores/cokies";
  import { Nf } from "$lib/stores/formatNumber";

  import { fly, fade } from "svelte/transition";
  import { generate_waktu } from "$lib/stores/waktu_generator";
  import { generate_waktu_str } from "$lib/stores/waktu_generator_str";
  /**
   * @type {any[]}
   */
  let data = [];
  import { get_laba_berjalan } from "$lib/stores/update_laba_berjalan";

  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { goto } from "$app/navigation";
  currentPosisiBase(2);
  currentPosisi(1);
  let mulai = "";
  let sampai = "";

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  const errMessage = "maaf terjadi kesalahan";

  let laba_berjalan = 0;

  let aktiva_lancar_list = [];
  let aktiva_tetap_list = [];
  let aktiva_lancar_total = [];
  let aktiva_tetap_total = [];

  let list_hj_pd = [];
  let list_hj_pj = [];

  let list_modal = [];

  let total_hutang = 0;
  let total_modal = 0;

  const today = new Date();

  let tanggal = "";

  let bobo = JSON.stringify({
    tanggal,
  });

  const pull = async () => {
    isSuccessVisible = true;

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akuntansi/get_neraca",
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
      aktiva_lancar_list = data.aktiva.aktiva_lancar.datalist;
      aktiva_lancar_total = data.aktiva.aktiva_lancar.total;

      aktiva_tetap_list = data.aktiva.aktiva_tetap.datalist;
      aktiva_tetap_total = data.aktiva.aktiva_tetap.total;

      list_hj_pd = data.kewajiban.hutang_jpd.datalist;
      list_hj_pj = data.kewajiban.hutang_jpj.datalist;

      // const HAI = list_hj_pj.filter((item) => item.id_akun == "2.1.4");
      // list_hj_pd.push(HAI[0]);

      // list_hj_pj = list_hj_pj.filter((item) => item.id_akun != "2.1.4");

      list_modal = data.kewajiban.modal.datalist;

      total_hutang = data.kewajiban.total_hutang;
      total_modal = data.kewajiban.total_modal;

      setTimeout(function () {
        isSuccessVisible = false;
      }, 300);
    } else {
      hasError = true;
    }
  };
  const type = false;
  let bobi = JSON.stringify({
    type,
  });

  const cari = async () => {
    bobo = JSON.stringify({
      tanggal,
    });
    pull();
    bobi = JSON.stringify({
      type,
    });

    // laba_berjalan = await get_laba_tahun_jalan(tanggal);
    // console.log(
    //   typeof laba_berjalan + "------------------------------",
    //   laba_berjalan
    // );
    // total_modal += Number(laba_berjalan);
  };

  // const get_laba_tahun_jalan = async (tanggal) => {
  //   let res = await fetch(
  //     "http://127.0.0.1:8000/api/api/v1/akuntansi/get_laba_berjalan?tanggal=" +
  //       tanggal
  //   );
  //   if (res.ok) {
  //     let a = await res.json();
  //     console.log("laba jaklaan ", a.data.saldo);
  //     return a.data.saldo;
  //   } else {
  //     return 404;
  //   }
  // };

  onMount(async () => {
    bobo = JSON.stringify({});
    await pull();
    // let tanggal_sekarang = generate_waktu_str(today);
    // laba_berjalan = await get_laba_tahun_jalan(tanggal_sekarang);
  });

  let is_cari = false;
</script>

<div class="   h-screen pt-16 md:p-16 md:pr-8">
  <div class="   h-full">
    <h1 class="  text-center text-lg font-semibold text-gray-600">NERACA</h1>
    <div class="flex justify-center">
      <h1 class="  text-center text-base font-semibold text-gray-600 mx-5">
        Per
      </h1>
      {#if !is_cari}
        <h1 class="  text-center text-base font-semibold text-gray-600">
          {generate_waktu(today)}
        </h1>
      {:else}
        <form>
          <input
            on:change={() => {
              cari();
            }}
            bind:value={tanggal}
            type="date"
            class="inputB"
          />
        </form>
      {/if}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => (is_cari = !is_cari)}
        class="md:mx-5 mx-1 bg-indigo-500 h-4 text-white rounded-full cursor-default hover:bg-indigo-400 w-10 flex justify-center uppercase font-semibold text-xs"
      >
        {#if !is_cari}
          cari
        {:else}
          batal
        {/if}
      </div>
    </div>

    <!-- message -->

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
      <div class=" md:ml-10 ml-5 px-10 flex flex-col mb-40 items-center">
        <div class="md:w-5/12 grid grid-cols-2 w-full gap-0">
          <h4 class=" head1 font-semibold text-center uppercase">keterangan</h4>
          <h4 class=" head1 font-semibold text-center uppercase">jumlah</h4>
        </div>
        {#if data}
          <div
            class="md:w-5/12 w-full mb-3 rounded-xl p-1 pt-0 mt-2 border-2 border-slate-200"
          >
            <h1 class="text-center uppercase text-sm font-semibold">aktiva</h1>
            <div
              class=" rounded-xl mb-2 grid grid-cols-2 border-green-200 border bg-green-300 w-full gap-0"
            >
              <h5 class=" head2 font-semibold text-left ml-3 uppercase">
                aktiva lancar
              </h5>
              <!-- svelte-ignore a11y-missing-content -->
              <h5 class=" head2 font-semibold text-center uppercase" />

              {#each aktiva_lancar_list as dt_al}
                <h4 class=" rower font-semibold text-left pl-8 capitalize">
                  {dt_al.nama_akun}
                </h4>
                <h4 class=" rower font-semibold text-right pr-8 capitalize">
                  {Nf.format(dt_al.saldo)}
                </h4>
              {/each}

              <h5 class="  totaler text-base text-left pl-8 capitalize">
                total aktiva lancar
              </h5>
              <h5 class=" totaler capitalize text-right">
                {Nf.format(aktiva_lancar_total)}
              </h5>
            </div>

            <div
              class=" rounded-xl mt-1 mb-2 grid grid-cols-2 border-lime-200 border bg-lime-200 w-full gap-0"
            >
              <h5 class=" head2 font-semibold text-left pl-3 uppercase">
                aktiva tetap
              </h5>
              <!-- svelte-ignore a11y-missing-content -->
              <h5 class=" head2 font-semibold text-center uppercase" />

              {#each aktiva_tetap_list as dt_al}
                <h4 class=" rower font-semibold text-left pl-8 capitalize">
                  {dt_al.nama_akun}
                </h4>
                <h4 class=" rower font-semibold text-right pr-8 capitalize">
                  {Nf.format(dt_al.saldo)}
                </h4>
              {/each}

              <h5 class=" totaler pl-8 capitalize">total aktiva tetap</h5>
              <h5 class=" totaler capitalize text-right">
                {aktiva_tetap_total}
              </h5>
            </div>
            <div
              class=" rounded-xl mt-3 grid grid-cols-2 border-yellow-200 border bg-yellow-200 w-full gap-0"
            >
              <h5 class=" head2 font-semibold text-left pl-3 uppercase">
                total aktiva
              </h5>
              <h5 class=" head2 font-semibold text-right uppercase pr-8">
                {Nf.format(aktiva_tetap_total + aktiva_lancar_total)}
              </h5>
            </div>
          </div>
        {/if}

        <div
          class="md:w-5/12 w-full rounded-xl p-1 pt-0 mt-8 border-2 border-slate-200"
        >
          <h1 class="text-center uppercase text-sm font-semibold">kewajiban</h1>
          <div
            class=" mb-2 rounded-xl grid grid-cols-2 border-red-200 border bg-red-300 w-full gap-0"
          >
            <h5 class=" head2 font-semibold text-left pl-3 uppercase">
              hutang lancar
            </h5>
            <!-- svelte-ignore a11y-missing-content -->
            <h5 class=" head2 font-semibold text-center uppercase" />

            {#each list_hj_pd as l_hu_jpd}
              <h4 class=" rower font-semibold text-left pl-8 capitalize">
                {l_hu_jpd.nama_akun}
              </h4>
              <h4 class=" rower font-semibold text-right pr-8 capitalize">
                {Nf.format(l_hu_jpd.saldo)}
              </h4>
            {/each}

            <h5 class=" head2 font-semibold text-left pl-3 uppercase">
              hutang jangka panjang
            </h5>
            <!-- svelte-ignore a11y-missing-content -->
            <h5 class=" head2 font-semibold text-center uppercase" />

            {#each list_hj_pj as l_hu_jpj}
              <h4 class=" rower font-semibold text-left pl-8 capitalize">
                {l_hu_jpj.nama_akun}
              </h4>
              <h4 class=" rower font-semibold text-right pr-8 capitalize">
                {Nf.format(l_hu_jpj.saldo)}
              </h4>
            {/each}

            <h5 class=" totaler pl-8 capitalize">total hutang</h5>
            <h5 class=" totaler text-right capitalize">
              {Nf.format(total_hutang)}
            </h5>
          </div>

          <div
            class=" rounded-xl mt-1 mb-3 grid grid-cols-2 border-rose-200 border bg-rose-200 w-full gap-0"
          >
            <h5 class=" head2 font-semibold text-left pl-3 uppercase">modal</h5>
            <!-- svelte-ignore a11y-missing-content -->
            <h5 class=" head2 font-semibold text-center uppercase" />

            {#each list_modal as l_modal}
              <!-- {#if l_modal.id_akun == "3.5"}
                <h4 class=" rower font-semibold text-left pl-8 capitalize">
                  {l_modal.nama_akun} ooooooooooooo
                </h4>
                <h4 class=" rower font-semibold text-right pr-8 capitalize">
                  {laba_berjalan}
                </h4>
              {:else} -->
              <h4 class=" rower font-semibold text-left pl-8 capitalize">
                {l_modal.nama_akun}
              </h4>
              <h4 class=" rower font-semibold text-right pr-8 capitalize">
                {Nf.format(l_modal.saldo)}
              </h4>
              <!-- {/if} -->
            {/each}

            <h5 class=" totaler pl-8 capitalize">total modal</h5>
            <h5 class=" totaler text-right capitalize">
              {Nf.format(total_modal)}
            </h5>
          </div>
          <div
            class=" rounded-xl mt-1 grid grid-cols-2 border-yellow-200 border bg-pink-200 w-full gap-0"
          >
            <h5
              class=" head2 w-3/4 font-semibold md:w-60 text-center uppercase"
            >
              total kewajiban dan modal
            </h5>
            <h5 class=" head2 font-semibold pr-8 text-right uppercase">
              {Nf.format(total_hutang + total_modal)}
            </h5>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .head1 {
    @apply bg-indigo-300;
  }

  .head2 {
    @apply text-sm;
  }

  .rower {
    @apply text-xs bg-white;
  }

  .totaler {
    @apply bg-white bg-opacity-30 text-sm font-semibold  pr-8;
  }
</style>
