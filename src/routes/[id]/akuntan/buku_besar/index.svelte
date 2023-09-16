<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { SetCookie } from "$lib/stores/cokies";
  import { generate_waktu } from "$lib/stores/waktu_generator";
  import { Nf } from "$lib/stores/formatNumber";

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

  currentPosisiBase(2);
  currentPosisi(1);

  /**
   * @type {any[]}
   */
  let data_akun = [];
  let akun_change = {
    id_akun: 1,
    nama_akun: "hutang dagang",
    kategori_akun: "modal",
    pos_akun_debit: false,
  };

  const pull_akun = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akun/get_data_akuns",
      {
        headers: {
          accept: "application/json",
          // "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_akun = data1.data.data;
      console.log(data1.data.data);
    }
  };

  let mulai = "";
  let sampai = "";
  let laba_berjalan = 0;
  let jurnal_list = [];
  const today = new Date();
  let tanggal_awal = "";
  let tanggal_ahir = "";

  let nama_akun = "";
  let id_akun = "";
  let saldo_awal = 0;
  let saldo_ahir = 0;

  const pull = async () => {
    // alert("uyyy");
    const type = akun_change.pos_akun_debit;

    id_akun = akun_change.id_akun;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akuntansi/get_buku_besar",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          tanggal_ahir,
          tanggal_awal,
          id_akun,
          type,
        }),
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data = data1.data;
      jurnal_list = data.list_jurnal;
      saldo_awal = data.saldo_awal;
      saldo_ahir = data.saldo_ahir;
    }
  };

  onMount(async () => {
    pull_akun();
  });

  let is_cari = false;
</script>

<div class="   h-screen p-16 pr-5">
  <div class="   h-full">
    <h1 class="  text-center text-lg font-semibold text-gray-600">
      BUKU BESAR
    </h1>
    <div class="flex justify-center">
      <form on:submit|preventDefault={pull}>
        <div class=" flex mx-3 py-3 flex-row items-center justify-center">
          <h1 class="  text-center text-base font-semibold text-gray-600 mx-5">
            Per
          </h1>
          <input bind:value={tanggal_awal} type="date" class="inputB1" />
          <input bind:value={tanggal_ahir} type="date" class="inputB1" />
          <h5 class="  mx-10 text-gray-600">akun :</h5>
          <select
            bind:value={akun_change}
            class="inputB1 w-64 mr-2 px-2 rounded-lg"
            placeholder="opsional"
          >
            {#each data_akun as dt_b}
              <option value={dt_b}> {dt_b.nama_akun}</option>
            {/each}
          </select>
          <!-- svelte-ignore missing-declaration -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button type="submit" class="btn-primary-small w-12 uppercase"
            >cari</button
          >
        </div>
      </form>
    </div>

    <div class=" ml-10 px-10 flex flex-col items-center">
      <div class=" w-2/3 h-full bg-gray-200">
        <div class="w-full bg-gray-100 flex justify-between p-2">
          <div>
            <div class="  flex">
              <h1 class="mr-10">id akun</h1>
              <h1>: {akun_change.id_akun}</h1>
            </div>

            <div class="  flex">
              <h1 class=" mr-4">nama akun</h1>
              <h1>: {akun_change.nama_akun}</h1>
            </div>
          </div>

          <div class="mr-5">
            <div class="  flex">
              <h1 class="mr-5">saldo awal</h1>
              <h1>: {Nf.format(saldo_awal)}</h1>
            </div>

            <div class="  flex">
              <h1 class=" mr-6">saldo ahir</h1>
              <h1>: {Nf.format(saldo_ahir)}</h1>
            </div>
          </div>
        </div>
        <table class="table w-full">
          <thead>
            <tr>
              <th>tanggal</th>
              <th>keterangan</th>
              <th>debet</th>
              <th>kredit</th>
              <th>saldo</th>
            </tr>
            <!-- svelte-ignore missing-declaration -->
            {#if jurnal_list}
              {#each jurnal_list as lj}
                <tr>
                  <td>{lj.tanggal}</td>
                  <td>{lj.keterangan}</td>
                  <td>{Nf.format(lj.debet)}</td>
                  <td>{Nf.format(lj.kredit)}</td>
                  <td>{Nf.format(lj.current_saldo)}</td>
                </tr>
              {/each}
            {/if}
          </thead>
        </table>
      </div>
    </div>
  </div>
</div>
